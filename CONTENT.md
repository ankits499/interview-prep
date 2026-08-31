# Content workflow

This is a static frontend — no backend, database, or crawler infrastructure lives in this repo.
All content is TypeScript data under `src/content/`, imported directly into the app at build time.

## Structure: Topic → Subtopic → (Concepts + Q&A)

Each **topic** (currently just Java) is a sequential, numbered list of **subtopics** — a syllabus,
not a grab-bag. Each subtopic is its own study unit with two tabs:

- **Concepts** — a quick-reference library, not an article. A subtopic is however many small
  `ConceptCard`s (see `src/types.ts`) its real scope demands — not a fixed count — each
  independently understandable in 1–3 minutes: one-line
  definition, why it matters (1–3 bullets), a small example, 2–4 things to remember, and a short
  "interview angle" teaser. Grouped into a learning progression (e.g. Foundations → Pillars →
  Mechanics → Contracts → Design) via each card's `group` field — the group order is set by first
  appearance in the array. **Never write long-form prose or essay-style numbered sections here** —
  see "Concept card philosophy" below.
- **Q&A** — interview questions scoped *only* to that subtopic, that *test* the concepts rather
  than re-explain them (see "Concepts vs Q&A" below).

The list of subtopics per topic (order, category, priority) lives in `src/content/subtopics.ts`.
Content authoring always targets one subtopic at a time.

## How content gets added

The site itself knows nothing about Firecrawl or web research. The primary workflow is the
**`/add-subtopic <subtopic-id>`** skill (`.claude/skills/add-subtopic/`) — run it for one subtopic
id from `src/content/subtopics.ts` at a time and it does the full pipeline: authors the Concepts
material directly, authors the Q&A bank directly (Firecrawl only for recency-sensitive subtopics —
see below), writes both content files, and verifies the build. Run it with no argument to list all
subtopics and their current status (has concepts? has Q&A?).

The skill's steps, if doing this manually instead:

1. Author the **Concepts** material directly from expertise — no Firecrawl. Concept accuracy
   comes from Claude's own knowledge, not scraped pages.
2. Author the **Q&A** bank directly from expertise too, by default — what a senior interview asks
   about well-established Java topics (OOP, Strings, Collections, core language mechanics, ...) is
   itself well-established knowledge, and a Firecrawl pass over it mostly returns listicles
   restating the same things back. Reach for `firecrawl_search` only when the subtopic is
   genuinely **recency-sensitive** — where "what's commonly asked" plausibly shifted with a recent
   Java/framework version, or you're specifically unsure what's current. When you do search, never
   bulk-copy; extract the *idea* of a commonly-asked question and write it in the site's own voice,
   cross-referencing the suggested sources below.
3. Append the new entries to `src/content/concepts/<topic>.ts` and/or
   `src/content/questions/<topic>.ts`, tagging each entry with the correct `subtopic` id from
   `src/content/subtopics.ts` (or creates new topic files + registers them in `src/content/index.ts`
   and `src/content/subtopics.ts` for a brand-new topic).
4. Before adding, check for conceptual duplicates already in the file — two questions that
   really ask the same thing get merged into the single best-framed version rather than kept both.
5. Review the diff and commit.

No UI code changes are ever required to add content — the app reads from `src/content/index.ts`
and `src/content/subtopics.ts`, which aggregate whatever topic/subtopic files exist.

## Content quality bar

- Skew toward **Intermediate–Expert** difficulty and **Senior–Staff** seniority. Avoid beginner
  trivia ("What is a variable?") — this is a senior/lead interview reference, even for foundational
  Core Java subtopics (explain the *why*, not just the *what*).
- Prefer questions about internals, concurrency, performance, production tradeoffs, and failure
  scenarios over textbook definitions.
- `shortAnswer` should be revisable in 30–60 seconds. Put depth in `detailedAnswer`,
  `keyPoints`, and `seniorFollowUps`.
- The number of questions per subtopic isn't fixed — write as many as the subtopic's real breadth
  supports, one per distinct thing worth testing. A narrow subtopic may need under 10; a broad one
  may need 25+. Don't pad to a round number or artificially cap it.

## Concept card philosophy — read this before writing any Concepts content

The core principle: **understand in 1–3 minutes → remember the key idea → see a small example →
move on.** This app is a senior engineer's revision tool, not a blog. Every `ConceptCard`:

- `importance` — `must-know`, `useful`, or `deep-dive`. Omit it for the `useful` default. Reserve
  `must-know` for frequently tested foundations and production trade-offs; use `deep-dive` for
  internals with narrower interview value.
- `definition` — **one sentence.** What it is and why it exists. Not a paragraph.
- `whyItMatters` — 1–3 short bullets, the practical reason, not a restatement of the definition.
  Optional — skip it if the definition already makes the point.
- `example` — a small, focused code snippet. Add a one-line `note` only when the obvious reading
  of the code isn't the actual point (e.g. "the important part isn't `private`, it's that callers
  can't bypass the rule"). Optional — plenty of cards don't need one.
- `remember` — 2–4 critical points, phrased like a flashcard, not a summary of the paragraph above.
- `interviewAngle` — **one** short Q/A teasing what a senior interviewer actually tests. Not a
  full Q&A entry — that belongs in the Q&A bank.
- `related` — ids of a couple of other cards in the same subtopic worth reading alongside this one.
- `comparison` — a structured table (`columns`, `rows`, optional `takeaway`) for genuine
  side-by-side choices. Every row must match the column count; do not use tables for ordinary lists.

Do **not**: write long paragraphs, make every card feel like an article, over-explain obvious
things, use essay-style numbered headers (`01 · Topic`), repeat the same conclusion twice, or add
a diagram/example/interviewAngle to every single card just because the field exists — most cards
need only a definition, remember list, and maybe an example. Clarity beats completeness beats
cleverness. A reader should be able to sit down for 20–30 minutes and get through an entire
subtopic's concept cards.

As an editorial target, keep definitions near 25 words and normally below 35. Keep
`shortAnswer` near 20–35 words and normally below 45; move mechanisms, exceptions, and extended
trade-offs into `detailedAnswer` or `keyPoints`. Run `npm run audit:content` to list the largest
outliers in high-priority subtopics. The audit is advisory so accuracy can justify an exception.

**Grouping**: assign each card a `group` (e.g. "Foundations", "OOP Pillars", "Java Mechanics") that
reflects a real learning progression — foundational mechanics first, core pillars next, language-
specific mechanics after that, then object contracts / design judgment last. Don't give every card
equal weight; the progression itself is part of the content.

## Concepts vs Q&A — do not duplicate

**Concepts** = "teach me this quickly." **Q&A** = "can I answer this in an interview?" A Q&A
question should *test* a concept, not restate its definition. If a `Question`'s `shortAnswer` reads
like the matching `ConceptCard`'s `definition` copy-pasted, rewrite one of them — they're serving
different jobs. Good Q&A: scenario-based ("you inherit a codebase where..."), comparison-based
("what's the real difference between X and Y"), or probing a specific gotcha the concept card's
`interviewAngle` only teased at.

## Diagrams

A `ConceptCard` can carry an optional `diagram` field — raw [Mermaid](https://mermaid.js.org/)
syntax, rendered client-side via `MermaidDiagram` (`src/components/MermaidDiagram.tsx`). Mermaid is
deliberately the format here: a flowchart/sequence/state diagram is a handful of short text lines,
far cheaper to author than hand-built SVG or an Excalidraw scene graph, while still rendering as a
real, theme-matched diagram.

- **Use sparingly** — only where a picture genuinely clarifies something prose can't (memory/heap
  layout, GC generational flow, lock/thread state transitions, a sequence diagram for an async
  chain). How many depends entirely on the subtopic: most cards warrant zero, and a subtopic with
  several genuinely distinct visual ideas can carry more than a couple. Don't force a count in
  either direction — let the material decide.
- **Node labels: no quotes, parens, or other special characters.** Mermaid's parser breaks on
  `"`, `(`, `)`, `#`, etc. inside `[...]` labels (e.g. `a["x = new String(\"hi\")"]` fails to
  parse). Keep labels to plain words/identifiers — `a[new String]` not `a["new String(\"hi\")"]`.
- **Keep it small.** The diagram renders at its natural size inside a narrow card
  (~320–384px wide, height capped with scroll beyond that) — it is not stretched to fill the card,
  so a big diagram just looks cramped or scrolls rather than shrinking to fit. Aim for 3–6 nodes,
  short labels (a word or two, not a sentence), no subgraphs/clusters. Prefer `flowchart LR`
  (left-to-right) over `TD` (top-down) for short linear sequences — LR stays wide and shallow;
  TD stacks tall fast. If it needs more than ~6 nodes to say something real, it's probably two
  ideas — split it or fall back to prose.
- Example (a good size — 3 nodes, short labels, LR):
  ```ts
  {
    id: 'generational-gc',
    title: 'Generational GC',
    group: 'GC Fundamentals',
    definition: '...',
    diagram: `flowchart LR
      A[Eden] -->|survives| B[Survivor]
      B -->|ages out| C[Old Gen]`,
  }
  ```

## Common pitfalls — check these every time before declaring a subtopic done

These have each caused a broken build or a silently-corrupt file at least once. Check for all of
them, every run, not just when something looks wrong:

- **Mermaid labels with quotes/parens/special characters fail to parse.** `a["x = new
  String(\"hi\")"]` breaks Mermaid's parser on the embedded `"` and `(`. Keep node labels to plain
  words/identifiers only — `a[new String]`, not a quoted expression. This has broken a shipped
  diagram before; it won't show up in `tsc`/`npm run build` since it's a runtime string, only by
  actually looking at the rendered diagram or eyeballing every `diagram` field for `"`, `(`, `)`, `#`.
- **`npx tsc --noEmit` can pass while `npm run build` fails on the same file.** They use different
  configs/caches, and a real syntax or type error has slipped past `--noEmit` before while
  `npm run build`'s `tsc -b` caught it. **Always run `npm run build`, not just `tsc --noEmit`** —
  treat `--noEmit` as a fast interim check during editing, never as the final verification.
- **A large `old_string`/`new_string` Edit on a content array can silently truncate the file** if
  the replacement text doesn't end exactly where the original array continues — e.g. appending a
  stray `]` mid-array, or dropping a line that should have been preserved between old and new
  content. This has silently cut a `Question[]` array in half before, and `tsc --noEmit` didn't
  catch it (stale cache) — only `npm run build` did. After any edit that inserts a large content
  block, sanity-check the file wasn't truncated: `grep -c "^  {$" <file>` should roughly match the
  number of entries you expect, or run `node -e "…count braces/brackets…"` to confirm balance.

## Suggested sources (hints, not a fixed list)

Claude should judge which sources are actually relevant to the requested topic — never blindly
scrape everything below. Respect each site's robots.txt, terms of service, and copyright; never
bulk-copy paragraphs verbatim — rewrite in the site's own voice. Preserve attribution via the
optional `source: { name, url }` field on `Question` whenever a question is meaningfully derived
from a specific source. Concept cards don't carry source attribution — they're written from
expertise, not researched (see "How content gets added" above).

**High-quality technical deep dives** (prefer these for concept accuracy):
- [Baeldung](https://www.baeldung.com/) — Java/Spring authoritative reference
- [DZone](https://dzone.com/), [InfoQ](https://www.infoq.com/)
- [Martin Fowler's blog](https://martinfowler.com/) — microservices/architecture patterns
- Official [Spring docs/guides](https://spring.io/guides), [OpenJDK/JEP pages](https://openjdk.org/jeps/0)
- [Confluent's blog](https://www.confluent.io/blog/) — Kafka internals/patterns
- AWS/Kubernetes official architecture documentation

**Interview-Q&A-specific aggregators** (use mainly to identify commonly-asked phrasings):
- DeepReach, "Java Interview Questions & Answers", Notes4Interview, PrepIQ
- GeeksforGeeks (Java/Spring/System Design sections), InterviewBit
- Educative's system-design/Java tracks

**System design / distributed systems**:
- "System Design Primer" (GitHub), High Scalability blog, ByteByteGo content

## File layout

```
.claude/skills/add-subtopic/  # the /add-subtopic <id> skill — the primary content-authoring workflow
src/
  types.ts                    # Question, ConceptSection/ConceptCard (+ ConceptExample, CodeSnippet) interfaces
  content/
    index.ts                  # aggregates everything, exposed to the app
    subtopics.ts              # per-topic ordered subtopic list (id, label, category, priority)
    concepts/
      java.ts
      <new-topic>.ts          # add here for a new topic (currently Java-only)
    questions/
      java.ts
      <new-topic>.ts
```

To register a brand-new topic: add it to `TOPIC_INFO` in `src/content/index.ts`, add its subtopic
list to `SUBTOPICS_BY_TOPIC` in `src/content/subtopics.ts`, then add `concepts/<topic>.ts` and
`questions/<topic>.ts` files and wire them into `CONCEPTS_BY_TOPIC` / `QUESTIONS_BY_TOPIC`.

To add a subtopic to an existing topic: add one entry to that topic's array in `subtopics.ts`
(order matters — it's the reading sequence), then add matching entries to that topic's
`concepts/<topic>.ts` and/or `questions/<topic>.ts` tagged with the new subtopic's `id`.
