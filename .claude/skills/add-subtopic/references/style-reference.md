# Content style reference (condensed)

For an agent drafting one subtopic's content. This is the trimmed version of the repo's
`CONTENT.md` — schema and tone only, no sourcing/pitfalls/file-layout sections. Don't read the
full `CONTENT.md`; this is enough.

## Shapes (from `src/types.ts`)

```ts
interface ConceptCard {
  id: string                    // kebab-case, unique across the whole content set
  title: string
  group: string                 // learning-progression bucket; order = first appearance in array
  definition: string             // ONE sentence
  whyItMatters?: string[]        // 1-3 short bullets, optional
  example?: { code: { language: string; code: string }; note?: string }
  remember?: string[]            // 2-4 flashcard points, optional
  interviewAngle?: { q: string; a: string }  // ONE teaser Q/A, optional
  related?: string[]             // sibling card ids, optional
  diagram?: string               // Mermaid syntax, optional, rare
  readMinutes?: number           // 1-3
}

interface Question {
  id: string                     // pattern: java-<subtopic-abbrev>-qN
  question: string
  shortAnswer: string             // always present, 30-60s read
  detailedAnswer?: string
  keyPoints?: string[]
  seniorFollowUps?: string[]
  example?: string                // plain string, not an object
  topic: 'java'
  subtopic: string
  difficulty: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'
  seniority: 'Mid' | 'Senior' | 'Lead' | 'Staff'
  tags: string[]
}
```

## Concept card tone

Understand in 1-3 minutes, move on. No essay headers, no over-explaining the obvious. Not every
card needs every optional field — `definition` + `remember` alone is fine. Skew Intermediate-Expert
/ Senior-Staff throughout; avoid textbook trivia.

## Q&A tone

Test the concept, don't restate it — scenario-based, comparison-based, or probing the gotcha a
card's `interviewAngle` only teased. **Add `detailedAnswer`/`keyPoints`/`seniorFollowUps` on no
more than ~40% of questions** — the harder ones only. Padding every question with every optional
field wastes tokens and reads worse; a few sharp concise ones plus a few genuinely deep ones beats
uniform depth.

## Diagrams

Rare — most subtopics need zero, a broad one might have 2-3 genuinely distinct visual ideas.
3-6 nodes, short plain-word labels, `flowchart LR` for short sequences. **Never put quotes,
parens, or other special characters inside a node label** (`a["x = new String(\"hi\")"]` fails to
parse) — plain words only, e.g. `a[new String]`.

## One example card (good density/format to match)

```ts
{
  id: 'string-pool',
  title: 'String Pool (Interning)',
  group: 'Foundations',
  definition: 'A JVM-managed cache of unique String literals — identical literals are automatically deduplicated to a single shared object.',
  whyItMatters: ['Since Java 7 the pool lives in the heap (not PermGen), so it\'s subject to normal garbage collection instead of causing OutOfMemoryError under heavy literal use'],
  remember: ['Compile-time constant expressions ("a" + "b") are folded and pooled by the compiler; runtime-built strings are not, even if equal'],
  readMinutes: 2,
  related: ['string-creation', 'string-intern'],
},
```

## One example question (good density/format to match)

```ts
{
  id: 'java-str-q4',
  question: 'A service parses a 500MB file into memory, then extracts thousands of tiny substrings and discards the original. On an older JVM this held onto huge amounts of memory. On a current JVM it doesn\'t. Why?',
  shortAnswer: 'Pre-Java 7, substring() shared the original char array and just changed the offset/length — every extracted substring kept the entire original array reachable. Java 7+ always copies only the needed characters, so the original becomes eligible for GC once nothing else references it.',
  seniorFollowUps: ['If you were stuck supporting an app on a pre-Java-7 JVM, how would you work around this without changing the JVM version?'],
  topic: 'java',
  subtopic: 'strings',
  difficulty: 'Advanced',
  seniority: 'Senior',
  tags: ['substring', 'memory', 'jvm'],
},
```
