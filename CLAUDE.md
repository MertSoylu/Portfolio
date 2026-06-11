# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Vite dev server (port 3000, auto-opens)
npm run build          # Production build
npm run build:analyze  # Build + open rollup bundle visualizer (dist/stats.html)
npm run preview        # Preview production build
npm run lint           # ESLint on .js/.jsx
npm run format         # Prettier write src + root files
npm run test           # Vitest run (unit, jsdom)
npm run test:watch     # Vitest watch
npm run e2e            # Playwright e2e
```

Run single unit test: `npx vitest run tests/unit/seo-meta.test.js`
Run single e2e: `npx playwright test tests/e2e/smoke.spec.js`

Pre-commit: husky + lint-staged auto-runs `eslint --fix` + prettier on staged files. Commit messages enforced by commitlint (Conventional Commits).

## Architecture

React 18 SPA. React Router v6, Tailwind CSS, Framer Motion. `@` aliases `src/` (vite + works in imports).

**Entry** (`src/main.jsx`): `HelmetProvider` > `BrowserRouter` > `App`. Forces manual scroll restoration + scroll-to-top on load. `initWebVitals()` reports Core Web Vitals.

**Provider stack** (`src/App.jsx`, outer→inner): `ErrorBoundary` > `MotionConfig reducedMotion="user"` > `DarkModeProvider` > `LanguageProvider` > `CommandPaletteProvider` > `AppContent`. `Toaster` (react-hot-toast) + deferred Vercel Analytics/SpeedInsights siblings.

- `DarkModeContext` — `isDark` + toggle; `.dark` class on root div
- `LanguageContext` — `useLanguage()` returns `{ language, isTurkish, toggleLanguage }`; persists to localStorage, sets `<html lang>` + `data-lang`. Strings live in `src/utils/constants.js`
- `CommandPalette` (kbar) — ⌘K command palette

**Routing** (`src/App.jsx`): `HomePage` (`/`) = `Hero` + lazy `About`/`Certificates`/`Projects`/`Contact` under one `Suspense`, joined by `SectionDivider`. Standalone pages: `/web`, `/android`, `/cybersecurity`, `/data-science`. Case studies: `/case-study/{mnemosyne,typesprint,walkkittie,msscan}`. `*` → `NotFoundPage`.

**Lazy loading**: every route + heavy component loaded via `lazyWithRetry` — on chunk load failure it does a one-time `sessionStorage`-guarded page reload (handles stale-deploy chunk 404s) before throwing. Add new pages through this helper, not bare `lazy()`.

**Per-route motion config** (objects keyed by pathname in `App.jsx`): `ROUTE_DIRECTIONS` (wipe direction), `ROUTE_OVERLAYS` (gradient tint classes), `ROUTE_PARTICLES` (particle count + noise). When adding a route, add matching entries to all three. `PageTransition` does clip-path wipe transitions; collapses to simple fade when `prefersReducedMotion`.

**Background**: `FluidParticlesBackground` (`src/components/ui/fluid-particles-background.tsx`, ogl/WebGL) — lazy + deferred (`DeferredParticlesBackground` waits for window load + idle, disabled on reduced-motion, downscaled particle count on mobile). This replaced the old SandBackground/CustomCursor.

**Motion/effect components**: `src/components/motion/` (`KineticHeadline`, `MorphBlob`, `ScrollScene`) + many reusable text/card effects in `src/components/` (`DecryptedText`, `SplitFlapText`, `TextPressure`, `ScrollReveal`, `TiltCard`, `SpotlightCard`, `ElectricBorder`, etc.). GSAP + Lenis (smooth scroll) available.

**Page scaffolds**: `SpecialtyPageLayout` (specialty pages), `CaseStudyLayout` (case studies), `PageMeta` (per-route SEO via Helmet).

**Data** (`src/utils/githubApi.js`): GitHub REST via native `fetch` (no axios). Stale-while-revalidate — `fetchGitHubRepos` returns cached repos immediately, revalidates in background, notifies subscribers via `onReposUpdate`. Client-side rate limiting (20 req/min) + server 403/429 cooldown honoring `x-ratelimit-reset`. Caches in memory + sessionStorage. Env: `VITE_GITHUB_USERNAME` (default `MertSoylu`), optional `VITE_GITHUB_TOKEN`.

**Build** (`vite.config.js`): manual vendor chunks (react, motion, ogl, gsap, lenis, icons, vercel). PWA via `vite-plugin-pwa` (autoUpdate SW, runtime caching for Cloudinary images / GitHub API / Google Fonts; `cv.pdf` + `/certificates/` denied from navigate-fallback).

## Security Headers

`vercel.json` — defense-in-depth (fixes security audit findings):

- **CSP**: strict (self-hosted scripts/styles, GitHub API access)
- **X-Frame-Options**: DENY (clickjacking)
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: browser APIs disabled (geolocation, mic, camera, payment, etc.)
