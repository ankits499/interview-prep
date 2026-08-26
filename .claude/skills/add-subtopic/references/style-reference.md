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

## The process — follow this order, don't freewrite straight to finished cards

1. **Brainstorm a flat bullet list** of every genuinely distinct, testable idea in the subtopic —
   one short title per bullet ("HashMap treeification", not a sentence explaining it). Don't
   filter yet, just get every idea down.
2. **Filter the list** — cut any bullet that fails this test: would a senior engineer be expected
   to know this cold (not textbook trivia)? Is there a real gotcha/tradeoff/internals detail to
   say about it (not just a definition)? Is it actually this subtopic's territory, not something
   already covered elsewhere?
3. **One `ConceptCard` per surviving bullet.** The card count is whatever survives the filter —
   never pad to a round number, never stop early to match a prior subtopic's count.
4. Same two steps for Q&A: brainstorm one question idea per surviving concept (plus cross-concept
   comparisons), filter out anything that just restates a definition or duplicates another
   question, then write the survivors as full `Question` objects.

## Concept card tone

Understand in 1-3 minutes, move on. No essay headers, no over-explaining the obvious. Not every
card needs every optional field — `definition` + `remember` alone is fine; don't add a field just
because the shape allows it. Skew Intermediate-Expert / Senior-Staff throughout.

## Q&A tone

Test the concept, don't restate it — scenario-based, comparison-based, or probing the gotcha a
card's `interviewAngle` only teased. **Depth-field rule (mechanical, not a judgment call):** sort
your finished questions by difficulty (Expert→Advanced→Intermediate→Basic), and only the top 40%
by count (round up) get `detailedAnswer`/`keyPoints`/`seniorFollowUps` — everyone else ships with
`shortAnswer` alone. Padding every question with every optional field wastes tokens and reads
worse than a few sharp concise ones plus a few genuinely deep ones.

## Bad vs good — same idea, two treatments

**Bad** (essay tone, restates the definition as a "question", padded with unearned fields):

```ts
// Concept card — too long, states the obvious, note adds nothing
{
  id: 'hashmap-treeification',
  title: 'HashMap Treeification',
  group: 'Internals',
  definition: 'HashMap treeification is a feature that was introduced in Java 8 which changes how HashMap handles buckets that have a lot of collisions in them by converting the linked list into a tree structure.',
  whyItMatters: ['This is important to understand for interviews.'],
  example: {
    code: { language: 'java', code: `Map<String, Integer> map = new HashMap<>();` },
    note: 'This creates a new HashMap.',
  },
  remember: ['Treeification happens in HashMap.', 'It was added in Java 8.'],
}

// Question — just the definition with a question mark
{
  id: 'java-coll-q9',
  question: 'What is HashMap treeification?',
  shortAnswer: 'HashMap treeification is when a bucket with too many collisions is converted from a linked list into a red-black tree, which was introduced in Java 8.',
  detailedAnswer: '...',
  keyPoints: ['...'],
  seniorFollowUps: ['...'],
  ...
}
```

**Good** (one sentence, real gotcha, question tests understanding not recall):

```ts
{
  id: 'hashmap-treeification',
  title: 'HashMap Treeification (Java 8+)',
  group: 'Internals',
  definition: 'Since Java 8, a bucket whose chain grows past 8 entries converts from a linked list to a red-black tree, capping worst-case lookup at O(log n) instead of O(n).',
  whyItMatters: ['Defends against pathological or adversarial hashCode() collisions that would otherwise degrade a bucket to a slow linked-list scan'],
  remember: ['Threshold: 8 entries AND table capacity >= 64 — below that it resizes the table instead', 'Untreeifies back to a list if the bucket shrinks below 6 entries'],
  readMinutes: 2,
}

{
  id: 'java-coll-q9',
  question: 'What triggers HashMap bucket treeification, and why was it added in Java 8?',
  shortAnswer: 'A single bucket accumulating more than 8 entries (with table capacity at least 64) converts that bucket\'s linked list into a red-black tree, capping worst-case lookup at O(log n). It defends against pathological or adversarially-crafted hashCode() collisions degrading a HashMap toward linked-list performance.',
  topic: 'java',
  subtopic: 'collections',
  difficulty: 'Expert',
  seniority: 'Staff',
  tags: ['hashmap', 'treeification', 'internals'],
}
```

The difference isn't length for its own sake — the good version has a *specific number* (8
entries, capacity 64), a *specific reason* (adversarial collisions), and no filler sentence that
exists only to fill a field.

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
