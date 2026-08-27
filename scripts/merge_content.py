#!/usr/bin/env python3
"""
Merge one or more subtopic-content JSON files into a topic's
src/content/concepts/<topic>.ts and src/content/questions/<topic>.ts.

Why this exists
---------------
The old workflow had drafting agents write raw TypeScript directly, then a
one-off Python script tried to splice that TS into the target files using
bracket-depth counting over the agent's free-form text. That broke twice in
practice: once when a marker substring ("Foo[] =") was itself searched for
an opening '[' and matched the empty-array literal inside its own name, and
once when string literals inside the content held unbalanced brackets and
confused the depth counter. Both bugs silently produced structurally broken
TypeScript that only showed up at `npm run build`.

This script sidesteps that entirely: drafting agents emit *structured JSON*
(schema below) instead of hand-written TypeScript. JSON has no ambiguity
about where a string ends, so there is nothing to mis-parse. This script is
the only thing that ever renders JSON -> TypeScript, via an explicit
recursive serializer (see `to_ts`) — not a text-editing pass over existing
TS, just clean generation of new TS followed by a plain end-of-file append
(both target files always end with a single closing `]` for their main
export, so "insert before the last `]`" is a safe, unambiguous operation).

Usage
-----
    python3 scripts/merge_content.py <topic> <subtopic.json> [<subtopic.json> ...]
    python3 scripts/merge_content.py <topic> <subtopic.json> --dry-run
    python3 scripts/merge_content.py <topic> <subtopic.json> --no-build

JSON schema (one file per subtopic)
------------------------------------
{
  "topic": "spring-boot",
  "subtopic": "sb-transactions",
  "sectionId": "sb-concept-transactions",
  "constBaseName": "sbTransactions",
  "sectionTitle": "Transaction Management",
  "sectionIntro": "1-2 sentence framing of the subtopic.",
  "concepts": [
    {
      "id": "transactional-proxy-mechanics",
      "title": "@Transactional Is Proxy-Based AOP",
      "group": "@Transactional Mechanics",
      "definition": "...",
      "whyItMatters": ["...", "..."],
      "example": {"code": {"language": "java", "code": "..."}, "note": "..."},
      "remember": ["...", "..."],
      "interviewAngle": {"q": "...", "a": "..."},
      "related": ["other-card-id"],
      "diagram": "flowchart LR\\n  A[Foo] --> B[Bar]",
      "readMinutes": 2
    }
  ],
  "questions": [
    {
      "id": "sb-tx-q1",
      "question": "...",
      "shortAnswer": "...",
      "detailedAnswer": "...",
      "keyPoints": ["..."],
      "seniorFollowUps": ["..."],
      "example": "...",
      "topic": "spring-boot",
      "subtopic": "sb-transactions",
      "difficulty": "Advanced",
      "seniority": "Senior",
      "tags": ["transactional", "proxy"],
      "source": {"name": "...", "url": "..."}
    }
  ]
}

Only `id`/`title`/`group`/`definition` are required on a concept card, and
only `id`/`question`/`shortAnswer`/`topic`/`subtopic`/`difficulty`/
`seniority`/`tags` are required on a question — everything else is optional
and simply omitted from the JSON if unused (omit the key; don't pass null).
"""

import json
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

CONCEPT_REQUIRED = ("id", "title", "group", "definition")
QUESTION_REQUIRED = ("id", "question", "shortAnswer", "topic", "subtopic", "difficulty", "seniority", "tags")

IDENTIFIER_RE = re.compile(r"^[A-Za-z_$][A-Za-z0-9_$]*$")


def die(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def to_camel(kebab: str) -> str:
    parts = kebab.split("-")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


# ---------------------------------------------------------------------------
# JSON -> TypeScript serialization
# ---------------------------------------------------------------------------

def serialize_string(s: str) -> str:
    """Render a Python string as a TS string or template literal."""
    if "\n" in s:
        # Multi-line content (diagrams, code blocks) -> template literal.
        escaped = s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
        return f"`{escaped}`"
    has_single = "'" in s
    has_double = '"' in s
    if not has_single:
        body = s.replace("\\", "\\\\")
        return f"'{body}'"
    if not has_double:
        body = s.replace("\\", "\\\\")
        return f'"{body}"'
    # Both quote types present — single-quote and escape the single quotes.
    body = s.replace("\\", "\\\\").replace("'", "\\'")
    return f"'{body}'"


def serialize_key(k: str) -> str:
    return k if IDENTIFIER_RE.match(k) else serialize_string(k)


def to_ts(value, indent: int = 0) -> str:
    pad = "  " * indent
    inner_pad = "  " * (indent + 1)
    if isinstance(value, dict):
        if not value:
            return "{}"
        lines = ["{"]
        for k, v in value.items():
            if v is None:
                continue  # omit nulls rather than emitting `key: null`
            lines.append(f"{inner_pad}{serialize_key(k)}: {to_ts(v, indent + 1)},")
        lines.append(f"{pad}}}")
        return "\n".join(lines)
    if isinstance(value, list):
        if not value:
            return "[]"
        # Arrays of short, simple strings (tags, related, keyPoints, etc.)
        # render inline on one line, matching the hand-authored style —
        # only multi-line items or a long rendered line fall back to one
        # item per line.
        if all(isinstance(v, str) and "\n" not in v for v in value):
            inline = "[" + ", ".join(serialize_string(v) for v in value) + "]"
            if len(inline) <= 100 and "\n" not in inline:
                return inline
        lines = ["["]
        for item in value:
            lines.append(f"{inner_pad}{to_ts(item, indent + 1)},")
        lines.append(f"{pad}]")
        return "\n".join(lines)
    if isinstance(value, str):
        return serialize_string(value)
    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return "undefined"
    return str(value)  # int/float


def render_object(obj: dict) -> str:
    """Top-level object literal, indented as one array element (2 spaces)."""
    return to_ts(obj, indent=1)


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

def validate_file(data: dict, path: Path) -> None:
    top_required = ("topic", "subtopic", "sectionId", "constBaseName", "sectionTitle", "concepts", "questions")
    for key in top_required:
        if key not in data:
            die(f"{path}: missing required top-level key '{key}'")
    if not isinstance(data["concepts"], list) or not data["concepts"]:
        die(f"{path}: 'concepts' must be a non-empty array")
    if not isinstance(data["questions"], list) or not data["questions"]:
        die(f"{path}: 'questions' must be a non-empty array")
    for i, c in enumerate(data["concepts"]):
        for key in CONCEPT_REQUIRED:
            if key not in c:
                die(f"{path}: concepts[{i}] missing required key '{key}'")
    for i, q in enumerate(data["questions"]):
        for key in QUESTION_REQUIRED:
            if key not in q:
                die(f"{path}: questions[{i}] missing required key '{key}'")
        if q["topic"] != data["topic"]:
            die(f"{path}: questions[{i}].topic ('{q['topic']}') != file topic ('{data['topic']}')")
        if q["subtopic"] != data["subtopic"]:
            die(f"{path}: questions[{i}].subtopic ('{q['subtopic']}') != file subtopic ('{data['subtopic']}')")


def check_subtopic_registered(topic: str, subtopic: str) -> None:
    subtopics_file = REPO_ROOT / "src/content/subtopics.ts"
    text = subtopics_file.read_text(encoding="utf-8")
    if f"id: '{subtopic}'" not in text:
        die(
            f"subtopic '{subtopic}' is not registered in src/content/subtopics.ts under topic "
            f"'{topic}' — add it there first (this script never edits subtopics.ts)."
        )


def extract_existing_ids(text: str) -> set:
    return set(re.findall(r"id:\s*'([^']+)'", text)) | set(re.findall(r'id:\s*"([^"]+)"', text))


# ---------------------------------------------------------------------------
# Merge
# ---------------------------------------------------------------------------

def find_export_array_span(text: str, export_line_prefix: str) -> tuple:
    """Locate `export const <name>: <Type>[] = [` ... the file's *final* `]`.

    Both content files are a sequence of top-level `const` declarations
    followed by exactly one `export const ... = [ ... ]` as the last
    statement in the file. We never need to balance brackets over
    arbitrary existing content — we only need the start of the export
    statement (an exact, unique line we search for) and the file's last
    non-whitespace character (which must be that statement's closing `]`).
    """
    idx = text.find(export_line_prefix)
    if idx == -1:
        die(f"could not find '{export_line_prefix}' in target file")
    stripped = text.rstrip()
    if not stripped.endswith("]"):
        die("target file does not end with ']' — refusing to append; file may already be broken")
    end_idx = len(stripped) - 1  # index of the final ']'
    return idx, end_idx


def merge_one(topic: str, data: dict, concepts_text: str, questions_text: str,
              existing_concept_ids: set, existing_question_ids: set) -> tuple:
    subtopic = data["subtopic"]
    const_base = data["constBaseName"]
    concept_const = f"{const_base}Concepts"

    # --- concepts ---
    rendered_cards = [f"  {render_object(c)}," for c in data["concepts"]]
    new_const_decl = f"const {concept_const}: ConceptCard[] = [\n" + "\n".join(rendered_cards) + "\n]\n"

    topic_concepts_const = f"{to_camel(topic)}Concepts"
    export_prefix = f"export const {topic_concepts_const}: ConceptSection[] = ["
    start_idx, end_idx = find_export_array_span(concepts_text, export_prefix)

    section_obj = {
        "id": data["sectionId"],
        "subtopic": subtopic,
        "title": data["sectionTitle"],
        "intro": data.get("sectionIntro", ""),
        "concepts": concept_const,
    }
    # 'concepts' value must be the bare identifier, not a quoted string.
    section_text = "  {\n"
    for k, v in section_obj.items():
        if k == "concepts":
            section_text += f"    {k}: {v},\n"
        else:
            section_text += f"    {k}: {to_ts(v, 2)},\n"
    section_text += "  },\n"

    concepts_text = (
        concepts_text[:start_idx]
        + new_const_decl
        + "\n"
        + concepts_text[start_idx:end_idx]
        + section_text
        + concepts_text[end_idx:]
    )

    # --- questions ---
    rendered_questions = [f"  {render_object(q)}," for q in data["questions"]]
    header = f"  // ── {data['sectionTitle']} Questions " + "─" * 20 + "\n"
    block = header + "\n".join(rendered_questions) + "\n"

    topic_questions_const = f"{to_camel(topic)}Questions"
    q_export_prefix = f"export const {topic_questions_const}: Question[] = ["
    q_start_idx, q_end_idx = find_export_array_span(questions_text, q_export_prefix)

    questions_text = (
        questions_text[:q_end_idx]
        + block
        + questions_text[q_end_idx:]
    )

    return concepts_text, questions_text


def node_bracket_check(path: Path) -> None:
    script = r"""
const fs = require('fs');
const s = fs.readFileSync(process.argv[1], 'utf8');
let depth = 0, min = 0, inStr = null, esc = false;
for (const ch of s) {
  if (inStr) {
    if (esc) { esc = false; }
    else if (ch === '\\') { esc = true; }
    else if (ch === inStr) { inStr = null; }
  } else {
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; }
    else if ('{[('.includes(ch)) depth++;
    else if ('}])'.includes(ch)) depth--;
  }
  if (depth < min) min = depth;
}
if (depth !== 0 || min !== 0) {
  console.error(`bracket check FAILED for ${process.argv[1]}: final depth=${depth} min depth=${min}`);
  process.exit(1);
}
"""
    result = subprocess.run(["node", "-e", script, str(path)], capture_output=True, text=True)
    if result.returncode != 0:
        die(result.stderr.strip() or f"bracket check failed for {path}")


def main() -> None:
    args = sys.argv[1:]
    if len(args) < 2:
        print(__doc__)
        sys.exit(1)

    dry_run = "--dry-run" in args
    no_build = "--no-build" in args
    args = [a for a in args if not a.startswith("--")]

    topic = args[0]
    json_paths = [Path(p) for p in args[1:]]
    if not json_paths:
        die("no JSON files given")

    concepts_file = REPO_ROOT / f"src/content/concepts/{topic}.ts"
    questions_file = REPO_ROOT / f"src/content/questions/{topic}.ts"
    if not concepts_file.exists():
        die(f"{concepts_file} does not exist")
    if not questions_file.exists():
        die(f"{questions_file} does not exist")

    datasets = []
    for p in json_paths:
        if not p.exists():
            die(f"{p} does not exist")
        data = json.loads(p.read_text(encoding="utf-8"))
        if data.get("topic") != topic:
            die(f"{p}: topic '{data.get('topic')}' does not match CLI arg '{topic}'")
        validate_file(data, p)
        check_subtopic_registered(topic, data["subtopic"])
        datasets.append(data)

    # Cross-file duplicate check within this batch.
    seen_concept_ids, seen_question_ids = {}, {}
    for data in datasets:
        for c in data["concepts"]:
            if c["id"] in seen_concept_ids:
                die(f"duplicate concept id '{c['id']}' in {data['subtopic']} and {seen_concept_ids[c['id']]}")
            seen_concept_ids[c["id"]] = data["subtopic"]
        for q in data["questions"]:
            if q["id"] in seen_question_ids:
                die(f"duplicate question id '{q['id']}' in {data['subtopic']} and {seen_question_ids[q['id']]}")
            seen_question_ids[q["id"]] = data["subtopic"]

    concepts_text = concepts_file.read_text(encoding="utf-8")
    questions_text = questions_file.read_text(encoding="utf-8")

    existing_concept_ids = extract_existing_ids(concepts_text)
    existing_question_ids = extract_existing_ids(questions_text)

    for cid in seen_concept_ids:
        if cid in existing_concept_ids:
            die(f"concept id '{cid}' already exists in {concepts_file}")
    for qid in seen_question_ids:
        if qid in existing_question_ids:
            die(f"question id '{qid}' already exists in {questions_file}")

    total_concepts = total_questions = 0
    for data in datasets:
        concepts_text, questions_text = merge_one(
            topic, data, concepts_text, questions_text, existing_concept_ids, existing_question_ids
        )
        total_concepts += len(data["concepts"])
        total_questions += len(data["questions"])

    if dry_run:
        print(f"[dry-run] would write {len(datasets)} subtopic(s): "
              f"{total_concepts} concept cards, {total_questions} questions")
        for data in datasets:
            print(f"  - {data['subtopic']}: {len(data['concepts'])} concepts, {len(data['questions'])} questions")
        return

    concepts_file.write_text(concepts_text, encoding="utf-8")
    questions_file.write_text(questions_text, encoding="utf-8")

    node_bracket_check(concepts_file)
    node_bracket_check(questions_file)

    print(f"Merged {len(datasets)} subtopic(s) into '{topic}': "
          f"{total_concepts} concept cards, {total_questions} questions")
    for data in datasets:
        print(f"  - {data['subtopic']}: {len(data['concepts'])} concepts, {len(data['questions'])} questions")

    if not no_build:
        print("Running npm run build...")
        result = subprocess.run(["npm", "run", "build"], cwd=REPO_ROOT, capture_output=True, text=True)
        print(result.stdout[-3000:])
        if result.returncode != 0:
            print(result.stderr[-3000:], file=sys.stderr)
            die("npm run build failed — fix the content above and re-run (or revert the two edited files)")
        print("Build OK.")


if __name__ == "__main__":
    main()
