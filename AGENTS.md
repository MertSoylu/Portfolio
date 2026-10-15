# AGENTS.md

Guidance for coding agents on this repo lives in [CLAUDE.md](CLAUDE.md). Read it first: it is the single source of truth for the architecture, the Signal design system, the content model, the tests and the pitfalls. This file only points there so the two cannot drift apart again.

## Quick start

```bash
npm run dev        # Vite dev server port 3000
npm run build      # Production build → ./dist
npm run lint       # ESLint .js/.jsx
npm run format     # Prettier write
npm run test       # Vitest
npm run e2e        # Playwright (no downloaded browsers? prefix PW_CHANNEL=chrome)
```

Commits go through husky + lint-staged (eslint --fix + prettier) and commitlint (Conventional Commits).

## Rules that are easy to miss

- Visual identity is **Signal** (`docs/superpowers/specs/2026-10-15-signal-identity.md`): Claude-orange accent, Geist fonts, no WebGL/canvas/continuous JS animation, no removed ReactBits components.
- Every visible string needs both Turkish (informal "sen") and English.
- Projects live only in `src/data/projects.js` + `src/data/caseStudies.js` (+ `public/sitemap.xml`); areas only in `src/data/areas.js`.
- Accent text uses `text-accent`, accent fills use `bg-signal text-signal-fg`; never use a `/12` opacity (it generates nothing).
