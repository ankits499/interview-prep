---
name: add-subtopic
description: Generates the full study content for one subtopic of the Java interview-prep site (Study Guide Site) — concept material, an optional diagram or two, and a Q&A bank authored from expertise (with an optional Firecrawl grounding pass for recency-sensitive subtopics) — then writes it into the content files and verifies the build. Use this whenever the user asks to add, generate, fill in, or write content for a specific interview-prep subtopic (e.g. "add the Collections subtopic", "generate content for JVM Internals", "fill in Garbage Collection"), or invokes it directly as `/add-subtopic <subtopic-id>`. Always prefer this skill over manually drafting content by hand for this repo — it encodes the project's established format, quality bar, and file-wiring conventions.
---

# Add Subtopic

Generates one subtopic's worth of interview-prep content for the Study Guide Site (a static
Vite/React/TypeScript site) — end to end, in one pass: concept material, diagrams where they earn
their place, and a Q&A bank. One subtopic per run. Never touch other subtopics.

**Before anything else, read `CONTENT.md` at the repo root.** It documents the full content
model (`Question` / `ConceptSection` shapes, the Concepts+Q&A-per-subtopic architecture), the
quality bar (senior/staff framing, not textbook definitions), and the diagram conventions. This
skill is the mechanized version of that document's workflow — follow it, don't duplicate it.
(If you're delegating the drafting itself to a subagent — see "Generating several subtopics at
once" below — point that subagent at the shorter `references/style-reference.md` instead; you
still read the full `CONTENT.md` yourself for the steps around it.)

## Step 1 — Resolve the target subtopic

Read `src/content/subtopics.ts`. The argument passed to `/add-subtopic` should match a
`SubtopicMeta.id` under `SUBTOPICS_BY_TOPIC.java` (the repo is Java-only right now; treat `java`
as the default topic, but don't hardcode it so deeply that adding a second topic later would mean
rewriting this skill — accept an optional leading topic argument if one is given).

If no argument was given, or it doesn't match any id, **don't guess**. List every subtopic id and
label for the topic, and for each one note whether it already has concept content and/or
questions (check `src/content/concepts/<topic>.ts` and `src/content/questions/<topic>.ts` for
entries with a matching `subtopic` field). Ask the user which one to run.

## Step 2 — Check existing state (idempotency)

Read the full `src/content/concepts/<topic>.ts` and `src/content/questions/<topic>.ts` files.
If entries already exist for this subtopic id, this run **replaces** them — filter out every
existing entry whose `subtopic` matches, then add the freshly generated ones in their place.
Never duplicate, and never touch entries belonging to a different subtopic. This makes the skill
safe to re-run on a subtopic if the user wants a redo.

Reading the whole file also matters for Step 5 (deduping new questions against everything already
in the file, not just the subtopic being replaced).

## Step 3 — Author the Concepts (no Firecrawl here)

Write one `ConceptSection` (shape in `src/types.ts`) whose `concepts` array is a quick-reference
library, not a set of essays — as many small `ConceptCard`s as the subtopic genuinely has distinct
ideas worth a card, not a fixed count. A narrow subtopic might be well served by under 15; a broad
one (Concurrency, Collections) may need well over 30. Read CONTENT.md's "Concept card philosophy"
section before writing any of these; the short version:

- Each card: **`definition`** (one sentence), optional **`whyItMatters`** (1–3 bullets), optional
  **`example`** (small code + an optional one-line `note` only if the point isn't obvious from the
  code alone), **`remember`** (2–4 flashcard-style points), optional **`interviewAngle`** (one
  short Q/A teaser — not a full Q&A entry), optional **`related`** (a couple of sibling card ids).
- Understand in 1–3 minutes, move on. No long paragraphs, no essay-style numbered headers, no
  over-explaining the obvious. Not every card needs every field — a card with just `definition` +
  `remember` is completely fine.
- Assign each card a **`group`** reflecting a real learning progression for the subtopic (e.g.
  Foundations → core mechanics → design judgment) — group order is set by first appearance in the
  array, so lay the array out in the order you want the reader to progress through.
- Give the section itself a short optional `intro` (1-2 sentences framing the subtopic) — not a
  block-by-block summary.
- `diagram` (optional) — Mermaid syntax, per CONTENT.md's Diagrams section. Only add one where a
  picture genuinely earns its place over prose: memory/heap layouts, generational GC flow,
  lock/thread state transitions, a class relationship. Add as many or as few as the subtopic
  actually has good candidates for — most cards warrant zero, a subtopic with several genuinely
  distinct visual ideas (e.g. concurrency) can carry more than a couple. Don't add one just to hit
  a quota, and don't cap it artificially either.

  **Keep every diagram small.** It renders inside a narrow card (~320–384px wide, capped height
  with scroll past that) at its *natural* size — it is not auto-scaled up to fill the space, so a
  diagram with too many nodes just looks cramped or scrolls. 3–6 nodes, short labels (a word or
  two), no subgraphs, and prefer `flowchart LR` over `TD` for short linear sequences.

## Step 4 — Decide whether this subtopic needs a Firecrawl pass

For well-trodden Java fundamentals (OOP, Strings, Collections, Exceptions, core Generics, and
similar long-stable topics), what a senior interview actually asks is well-established knowledge —
Firecrawl mostly returns listicles restating what you already know, and adds a search step without
adding real signal. **Default to skipping it and authoring Q&A directly from expertise**, the same
way Concepts already are.

Use `firecrawl_search` (the `developer` category, query like `"<subtopic label> java interview
questions senior"`) only when the subtopic is genuinely **recency-sensitive** — where "what's
commonly asked" plausibly shifted with recent Java/framework versions, or you're
specifically unsure what's current (e.g. `modern-java` and its virtual-threads/records/sealed-class
material, a subtopic tied to a specific recent JEP, or anything where your own knowledge might be
stale). Cross-reference the source tiers CONTENT.md documents if you do search — Baeldung/DZone/
InfoQ for technical accuracy signal, GeeksforGeeks/InterviewBit for what's actually commonly asked.
Judge relevance yourself; don't treat every hit as worth using, and never bulk-copy a source's
wording — write the question and answer yourself. Only attach a `source: {name, url}` on a
`Question` when it's meaningfully informed by a specific thing you found.

If in doubt about a specific subtopic, ask the user rather than defaulting either way.

## Step 5 — Author the Q&A

Write `Question` objects (shape in `src/types.ts`) — as many as the subtopic's real breadth
actually supports, one solid question per distinct thing a senior interviewer would probe, not a
fixed count. A narrow subtopic might genuinely need only 8; a broad one (concurrency, collections)
might need 25+. Resist padding to hit a round number, and resist stopping early just because a
prior subtopic landed at some number. For each:

- `topic` / `subtopic` set correctly; `id` following the file's existing naming pattern.
- `difficulty` skewed Intermediate–Expert, `seniority` skewed Senior–Staff — this is a senior/lead
  interview reference, not a screening quiz.
- `shortAnswer` always present, sized for a 30–60 second revision read.
- `detailedAnswer` / `keyPoints` / `seniorFollowUps` / `example` — add real depth on no more than
  roughly 40% of the questions, not uniformly on all of them. Padding every question with every
  optional field is worse than a few sharp, concise ones plus a few genuinely deep ones — it also
  costs real tokens for no reader benefit. Use judgment about where the extra depth actually earns
  its place.
- Dedup against the other new questions *and* against everything already in the file (from Step 2)
  — if a question you're about to write is really the same concept as one that already exists
  elsewhere in the file, don't add a near-duplicate.
- **Test the concept, don't restate it.** Read CONTENT.md's "Concepts vs Q&A" section. If a
  question's `shortAnswer` reads like a `ConceptCard.definition` copy-pasted, rewrite it as a
  scenario, a comparison, or a probe of the gotcha the card's `interviewAngle` only teased at.

## Step 6 — Write the files

Make the actual edits: replace the subtopic's prior entries (if any, per Step 2) with the new
`ConceptSection` in `src/content/concepts/<topic>.ts`, and the new `Question[]` in
`src/content/questions/<topic>.ts`. These are plain TypeScript array literals — edit them directly,
matching the existing formatting/style in the file.

**Before moving on, read CONTENT.md's "Common pitfalls" section** — a large old_string/new_string
edit on one of these arrays has silently truncated the file before (a stray `]` inserted mid-array,
or a line dropped between the old and new content). Skim the diff and confirm the file's structure
looks intact around the edit boundary, not just that the new content itself reads correctly.

## Step 7 — Verify

Run **`npm run build`** from the repo root — this is the authoritative check, and the only one you
need to run. `npx tsc --noEmit` is not a reliable substitute (different config/cache — it has
passed before on a file `npm run build`'s `tsc -b` then failed on) and isn't worth running as an
extra interim step either; go straight to `npm run build` once the files are written. If it fails,
fix the content and re-run rather than leaving a broken build behind.

If any `ConceptCard` in this run has a `diagram`, also re-read each one for quotes, parens, or
other special characters inside node labels (`a["x = new String(\"hi\")"]` fails to parse) —
Mermaid syntax errors are a runtime failure the build won't catch. Keep labels to plain words.

## Step 8 — Visual sanity check (only if a dev server is already running)

Check whether a preview/dev server for this project is already running. If so, navigate to
`/topic/<topic>/subtopic/<subtopic-id>` — note this app uses `HashRouter`, so the real URL is
`http://localhost:<port>/#/topic/<topic>/subtopic/<subtopic-id>` — and screenshot both the
Concepts tab and the Q&A tab. If a `diagram` was added, confirm it actually rendered as a diagram
rather than an error state. If no dev server is running, skip this step rather than starting one
unprompted — that's a bigger action than this skill should take on its own.

## Step 9 — Report

Summarize for the user: how many concept cards were written (and the group breakdown), whether a
diagram was included (and what it depicts), how many questions were added, which sources informed
the Q&A grounding, and the verification result. This is a content-authoring pass, not a UI change
— no need to describe component/layout work you didn't do.

## Generating several subtopics at once

If the user asks for multiple subtopics in one go, don't run them through separate full skill
invocations sequentially — draft them in parallel via subagents, then merge and verify once. This
keeps token/time cost roughly per-subtopic instead of compounding overhead N times.

- **Each drafting agent reads `references/style-reference.md`, not the full `CONTENT.md`.** The
  full doc carries sourcing/pitfalls/file-layout sections a drafting agent doesn't need — the
  condensed reference has the schema, tone, and one example card/question, which is enough to
  match the site's style. (You, running this skill's later steps yourself, still read the real
  `CONTENT.md` when it matters — e.g. the "Common pitfalls" section in Step 6/7.)
- **Each agent writes its own output directly to a file** (e.g. via the Write tool to a scratch
  path) instead of pasting the full `ConceptCard[]`/`Question[]` TypeScript back in its response.
  A drafted subtopic can run tens of thousands of tokens — round-tripping that through the
  conversation and then re-transcribing it into a merge script is the single biggest avoidable
  cost in a multi-subtopic run. Have the agent report back only: file path, card/question counts,
  group names, and any new ids it minted (for your own collision check, not to enumerate in prose).
- **Don't ask agents to enumerate every existing id in their reply** to prove no collisions — that
  bloats every agent's response for no real benefit, since the actual merge step re-checks
  collisions programmatically anyway (see the id-collision check pattern below).
- When merging: splice each agent's output file into the two content files yourself, in one pass,
  then run the id-collision and `related`-ref integrity checks, then Step 7's `npm run build` once
  for everything — not once per subtopic.
