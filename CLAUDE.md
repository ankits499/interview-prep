# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Summary

**Interview Prep** — a static React + Tailwind site for senior Java/Spring Boot/Microservices interview revision. Deployable to GitHub Pages as a PWA. No backend, no database; all content is TypeScript data under `src/content/` imported at build time.

## Quick Commands

```bash
npm run dev       # Start Vite dev server (port 5173, auto-reloading)
npm run build     # TypeScript check + Vite build (always use this, not tsc alone)
npm run lint      # Lint with oxlint
npm run preview   # Preview production build locally
```

**Critical:** Always run `npm run build` for final verification — `tsc --noEmit` can pass while `npm run build` fails due to different cache/config. After editing content arrays, sanity-check the file wasn't truncated: `grep -c "^  {$" <file>` should match expected entry count (common pitfall mentioned in CONTENT.md).

## Architecture & Key Concepts

### Content Model: Topic → Subtopic → (Concepts + Q&A)

- **Topics** — coarse subjects (currently `java`); each topic has an ordered list of subtopics
- **Subtopics** — study units (e.g. "Concurrency", "Garbage Collection"); each has two views:
  - **Concepts** — quick-reference library of `ConceptCard`s (1–3 min each), grouped by learning progression
  - **Q&A** — interview question bank scoped to that subtopic
- **Subtopic metadata** — id, label, priority (high/medium/low), category (for grouping in UI) lives in `src/content/subtopics.ts`

### Key Data Structures (from `src/types.ts`)

- `ConceptCard` — atomic study unit: definition, whyItMatters (bullets), example (with optional note), remember (flashcard points), interviewAngle (1 Q/A teaser), diagram (optional Mermaid), related (cross-refs)
- `ConceptSection` — all concept cards for one subtopic + intro text
- `Question` — interview Q/A: shortAnswer (30–60s), detailedAnswer, keyPoints, seniorFollowUps, difficulty, seniority, tags, optional source attribution
- `Difficulty` — Basic | Intermediate | Advanced | Expert
- `Seniority` — Mid | Senior | Lead | Staff (prefer Senior+ for this audience)

### Routing & UI Structure

- **Hash-based routing** (`HashRouter`) — works on GitHub Pages without server rewrites
- Routes: `/` (home), `/topic/:id`, `/topic/:id/subtopic/:id`, `/topic/:id/question/:id`, `/search`, `/review`, `/settings`
- Layout wraps all routes; sidebar/header are persistent
- Search palette (Cmd+K) indexes concepts, questions, and topics
- Progress tracking (`localStorage`): mastered, needs-review, bookmarked per question

## Content Authoring Workflow

### Primary: Use the `/add-subtopic` Skill

```bash
/add-subtopic <subtopic-id>    # Author concepts + Q&A, write files, verify build
/add-subtopic                  # List all subtopics with current status (has concepts? Q&A?)
```

The skill handles the full pipeline: author materials, write to `src/content/concepts/<topic>.ts` and `src/content/questions/<topic>.ts`, ensure `subtopics.ts` includes the subtopic id, and verify the build.

### If Authoring Manually

1. **Write Concepts** directly from expertise (not scraped) — accuracy comes from Claude's own knowledge
2. **Write Q&A** directly from expertise too, unless recency-sensitive (e.g. new Java version features). Only use `firecrawl_search` for "what's commonly asked" research; never bulk-copy; rewrite in the site's voice
3. **Append to content files** — `src/content/concepts/<topic>.ts` and `src/content/questions/<topic>.ts`
4. **Check for duplicates** — merge questions that really test the same thing
5. **Review diff and commit**

### Content Quality Bar

- **Skew Senior–Staff** — avoid beginner trivia ("what is a variable?"). Explain the *why*, not just the *what*
- Prefer internals, concurrency, performance, production tradeoffs, failure scenarios
- Concepts should be understandable in 1–3 minutes; Q&A shortAnswer in 30–60 seconds
- Questions per subtopic: as many as real breadth supports (typically 10–25+), not a fixed count

### Concept Card Philosophy — Read Before Writing

A `ConceptCard` is a senior engineer's revision tool:

- `definition` — **one sentence only.** What it is and why it exists
- `whyItMatters` — 1–3 bullets on practical reason (optional if definition makes it)
- `example` — small, focused code snippet (optional). Add `note` only if the obvious reading isn't the actual point (e.g. "the important part isn't `private`")
- `remember` — 2–4 flashcard-style critical points, not a summary
- `interviewAngle` — **one** short Q/A teasing what's actually tested (not a full Q&A entry — that belongs in the Q&A bank)
- `related` — a couple of other card ids in same subtopic worth reading alongside

**Do NOT**: write long paragraphs, over-explain, use essay-style numbered headers, repeat conclusions, or add diagram/example to every card. Clarity > completeness > cleverness. A reader should finish an entire subtopic in 20–30 minutes.

**Grouping**: each card has a `group` field (e.g. "Foundations", "OOP Pillars", "Mechanics") reflecting learning progression. Group order is set by first appearance in the array — order them intentionally, not alphabetically.

### Concepts vs Q&A — No Duplication

- **Concepts** = "teach me this quickly" (definition + remember + example)
- **Q&A** = "can I answer this in an interview?" (scenario-based, comparison-based, testing for gotchas)

If a Q&A's `shortAnswer` reads like a concept's `definition` copy-pasted, rewrite one. They serve different jobs.

## Diagrams (Mermaid)

A `ConceptCard` can include optional `diagram` — raw Mermaid syntax rendered client-side.

- **Use sparingly** — only where a picture genuinely clarifies (memory layout, GC flow, lock/thread states, sequence diagrams). Most cards need zero
- **Keep labels plain** — no quotes, parens, special chars inside `[...]` labels — Mermaid's parser breaks: `a[new String]` yes, `a["x = new String(\"hi\")"]` fails
- **Keep it small** — 3–6 nodes, short labels (word or two). Cards are ~320–384px wide; oversized diagrams scroll/look cramped. Use `flowchart LR` for sequences (wide/shallow) over `TD` (tall/stacked)
- Example:
  ```ts
  diagram: `flowchart LR
    A[Eden] -->|survives| B[Survivor]
    B -->|ages out| C[Old Gen]`
  ```

## Content File Layout

```
src/
  types.ts                           # Question, ConceptCard, ConceptSection interfaces
  content/
    index.ts                         # Aggregates everything, exposed to app
    subtopics.ts                     # Per-topic ordered subtopic list (id, label, category, priority)
    concepts/
      java.ts                        # All ConceptCard[] entries for Java topic
    questions/
      java.ts                        # All Question[] entries for Java topic
  pages/
    HomePage.tsx, TopicPage.tsx, ... # Route pages
  components/                         # Reusable UI (Header, Sidebar, SearchPalette, etc.)
  hooks/
    useSearch.ts, useTheme.ts, useConceptProgress.ts
  styles/index.css                    # Tailwind + custom CSS
```

## GitHub Pages Deployment

1. Set `base` in `vite.config.ts` to your repo name: `base: '/my-repo-name/'` (production only; local dev always `/`)
2. Repo **Settings → Pages** → source: **GitHub Actions**
3. Push to `main` — `.github/workflows/deploy.yml` builds + deploys automatically

## Tech Stack & Dependencies

- **React** 19 + React Router v7 (HashRouter for GitHub Pages)
- **TypeScript** ~6.0
- **Vite** 8 (dev server + build)
- **Tailwind CSS** v4 + `@tailwindcss/vite` plugin
- **lucide-react** — icon library
- **prism-react-renderer** — syntax highlighting for code blocks
- **mermaid** v11 — diagram rendering
- **vite-plugin-pwa** — PWA support (auto-update, installable)
- **oxlint** — linting (fast, ESLint-compatible)

## Common Pitfalls

1. **Mermaid labels with special chars fail silently** — labels like `[new String("hi")]` break parser. Runtime strings won't show errors in `tsc`, only by viewing rendered diagram. Audit every `diagram` field for `"`, `(`, `)`, `#`
2. **`tsc --noEmit` can pass while `npm run build` fails** — different configs/caches. Always run `npm run build` for final check, especially after large content edits
3. **Large Edit replacements on content arrays can silently truncate** — if replacement text doesn't end exactly where original continues, array gets cut. After large edits, verify: `grep -c "^  {$" <file>` matches expected entry count
4. **Progress storage is localStorage-only** — bookmarks/mastered status are browser-local; no sync across devices

## Build & Linting

- TypeScript config split: `tsconfig.json` (base), `tsconfig.app.json` (app), `tsconfig.node.json` (build tools)
- Linting via oxlint (`.oxlintrc.json`) — fast, ESLint-compatible rules
- PWA manifest in `vite.config.ts` (name, icons, theme colors)
- Favicon: `public/favicon.svg` + PWA icons (`public/pwa-*.png`)

## Useful Utilities

- `src/lib/groupBy` — groups array by key (used for UI grouping)
- `CodeBlock` component — renders syntax-highlighted code with theme support
- `MermaidDiagram` component — renders mermaid diagrams client-side
- `SearchPalette`/`CommandPaletteOverlay` — Cmd+K search across all content

## Development Notes

- Hot Module Reload (HMR) works in dev — changes to content or components hot-reload
- Tailwind CSS v4 uses `@tailwindcss/vite` plugin (no `postcss.config.js` needed)
- All content is static; no API calls or external data fetches at runtime
- Styling is Tailwind + custom CSS in `src/styles/` — no CSS-in-JS framework
