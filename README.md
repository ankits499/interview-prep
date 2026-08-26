# Interview Prep

A minimal, fast interview-revision reference for Senior Java / Spring Boot / Microservices
interviews. Static React + Tailwind app, deployable free on GitHub Pages, installable as a PWA.

Each topic has two views:
- **Recap** — plain-language concept explanations with code snippets, for skimming.
- **Q&A** — a filterable, searchable bank of interview questions with short/detailed answers,
  key points, senior follow-ups, and per-question progress tracking (mastered / needs review /
  bookmarked), stored in `localStorage`.

See [CONTENT.md](./CONTENT.md) for how new topics/questions get added.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploying to GitHub Pages

1. Create the GitHub repo and push this project to it.
2. In `vite.config.ts`, set `base` to match your repo name, e.g. `base: '/my-repo-name/'`
   (this only applies to production builds — local dev always runs at `/`).
3. In the repo's **Settings → Pages**, set the source to **GitHub Actions**.
4. Push to `main` — `.github/workflows/deploy.yml` builds and deploys automatically.

## Stack

React, TypeScript, Vite, Tailwind CSS v4, react-router-dom (HashRouter — works on GitHub Pages
without server rewrites), lucide-react, prism-react-renderer, vite-plugin-pwa.
