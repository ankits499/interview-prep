# Repository Guidelines

## Project Structure & Module Organization

This is a static React 19, TypeScript, and Vite PWA. Route screens live in `src/pages/`, reusable UI in `src/components/`, stateful behavior in `src/hooks/`, and helpers in `src/lib/`. Study material is build-time data under `src/content/concepts/` and `src/content/questions/`; metadata and aggregation live in `subtopics.ts` and `index.ts`. Global styles are in `src/styles/index.css`, static assets in `public/`, and maintenance scripts in `scripts/`. Read `CONTENT.md` before editing study material.

## Build, Test, and Development Commands

- `npm install` installs locked dependencies.
- `npm run dev` starts Vite with hot reload.
- `npm run validate:content` checks content IDs, references, and other corpus invariants.
- `npm run lint` runs Oxlint across the project.
- `npm run build` validates content, type-checks, and creates `dist/`.
- `npm run preview` serves the production bundle locally.

Always use `npm run build` before submitting changes; a standalone `tsc --noEmit` is not an equivalent final check in this repository.

## Coding Style & Naming Conventions

Use two-space indentation, single quotes, no semicolons, and trailing commas in multiline structures. Use `PascalCase` for components and files (`QuestionDetail.tsx`), `camelCase` for functions and variables, and `useX` for hooks (`useProgress.ts`). Keep pages focused and move reusable behavior into `components/`, `hooks/`, or `lib/`. Preserve strict typing and avoid unused declarations.

## Testing Guidelines

No unit-test framework or coverage threshold is configured. Required checks are `npm run validate:content`, `npm run lint`, and `npm run build`. For UI changes, manually exercise affected routes, responsive layout, navigation, theme behavior, and persisted progress. If tests are introduced, colocate `*.test.ts(x)` files beside the code and add the runner to `package.json`.

## Commit & Pull Request Guidelines

Use short, imperative, sentence-case summaries, matching history: `Refine compact bezel glass navigation`. Keep commits scoped to one coherent change. Pull requests should explain the outcome, list verification commands, link issues, and include screenshots for visual changes. Call out content-schema, routing, PWA, or deployment changes.

## Content and Configuration Safety

Keep secrets out of the repository; the app is entirely client-side. When adding content, use valid subtopic IDs, avoid duplicate questions, keep Mermaid labels simple, and update the relevant aggregators for new topics. Production uses the GitHub Pages base path configured in `vite.config.ts`; verify it before changing deployment targets.
