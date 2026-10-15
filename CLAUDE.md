# CLAUDE.md

React 18 SPA portfolio. React Router v6, Tailwind CSS v3, Framer Motion v10. `@` → `src/`.

Visual identity is **Signal** (`docs/superpowers/specs/2026-10-15-signal-identity.md` is the contract): near-black canvas, hairline grid, one Claude-orange (#D97757) accent, Geist + Geist Mono. No WebGL/canvas/continuous JS animation.

## Commands

```bash
npm run dev        # Vite dev server port 3000
npm run build      # Production build
npm run lint       # ESLint .js/.jsx
npm run format     # Prettier write
npm run test       # Vitest
npm run e2e        # Playwright
```

Single unit: `npx vitest run tests/unit/<file>`
Single e2e: `npx playwright test tests/e2e/<file>` (no downloaded browsers? prefix `PW_CHANNEL=chrome`)

Pre-commit: husky + lint-staged runs eslint --fix + prettier on staged. commitlint enforces Conventional Commits.

## Architecture

**Provider stack** (`src/App.jsx`, outer→inner): `ErrorBoundary` > `MotionConfig` > `DarkModeProvider` > `LanguageProvider` > `AppContent`. `Toaster` + deferred Vercel Analytics/SpeedInsights siblings.

- `DarkModeContext` — `isDark` + toggle; `.dark` class on `<html>` (not a wrapper div), persisted under localStorage `darkMode` (default dark); also updates `<meta name="theme-color">` (#0A0B0D / #F7F7F4).
- `public/theme-init.js` — blocking `<script src>` in `index.html` `<head>` that applies the saved theme + theme-color before first paint. Must stay an external file: `vercel.json` CSP is `script-src 'self'` (no inline scripts). Keep its storage key/colours in sync with `DarkModeContext`.
- `LanguageContext` — `useLanguage()` returns `{ language, isTurkish, toggleLanguage }`; persists to localStorage, sets `<html lang>`. Strings in `src/utils/constants.js`. Turkish copy is informal ("sen") everywhere, including SEO.

**Routing**: Lazy pages via `lazyWithRetry()` — catches chunk load failures, does one-time sessionStorage-guarded page reload. `HomePage` (`/`) = `Hero` + lazy `About`/`Certificates`/`Projects`/`Contact` stacked with `SectionDivider`. Other routes live in the `LAZY_ROUTES` table in `src/App.jsx`: `/web`, `/android`, `/cybersecurity`, `/data-science`, `/case-study/:id`, `*`.

**Per-route transitions**: `src/App.jsx` — `<PageTransition>` motion wrapper with fade+slide. Collapses to plain opacity fade when `prefersReducedMotion`. No ROUTE_DIRECTIONS/ROUTE_OVERLAYS/ROUTE_PARTICLES (removed in ReactBits migration).

**Homepage sections** (being rebuilt to the Signal spec; current code is mid-migration): Hero, About, Projects, tech loop (`TechLogoLoop`, temporary), Certificates, Contact. Section ids: `about`, `projects`, `certificates`, `contact`. New sections use `SectionHeader` (`src/components/home/SectionHeader.jsx`: `{ id, index, label, title, lead, aside, align }`) and `Reveal` (`src/components/ui/Reveal.jsx`, adds `data-reveal` for print).

**Background**: pure CSS — `<div className="site-bg" aria-hidden="true" />` in `AppContent` (fixed, `z-index:-1`, 64px hairline grid + faint signal glow, radial mask). No JS. The app shell is `Navbar` (`<header data-site-nav>`, fixed h-16; pages offset themselves) + `<main id="main">` + `Footer`.

## Design system (Signal)

- **Fonts**: self-hosted `@fontsource-variable/geist` (`font-sans`) and `geist-mono` (`font-mono`), imported in `src/main.jsx`. No Google Fonts anywhere (CSP `font-src 'self' data:`).
- **Tokens**: RGB-triplet CSS vars in `src/index.css` (`:root` light, `html.dark` dark), mapped in `tailwind.config.js`: `canvas surface surface2 fg muted line accent ok danger` + `signal` / `signal-fg`. Use `text-accent` for accent _text/icons_ (works on both themes), `bg-signal text-signal-fg` for accent _fills_ — never `text-signal` on light. Line alphas only from Tailwind's scale (`border-line/10`, `/15`, `/20`, `/25`…); `/12` generates nothing (a temporary legacy alias exists).
- **Classes** (`src/index.css`): `.container-site`, `.text-display/.text-h1..h4/.text-lead`, `.label` (mono, uppercase, muted) / `.micro` (mono 11px, smallest allowed), `.btn` + `.btn-primary/.btn-secondary/.btn-ghost/.btn-lg`, `.card`, `.card-interactive`, `.tag`, `.link`, `.ticks` (corner marks, ≤2 per page), `.mark` (signal highlight), `.status-dot`, `.site-bg`. Radius: cards `rounded-lg`, buttons/inputs `rounded-md`, tags `rounded`. Depth by border, not shadow.
- **Legacy aliases**: the `LEGACY ALIASES — removed in phase 3` blocks in `src/index.css` and `tailwind.config.js` keep old class names (`.eyebrow`, `.text-body*`, `.card-prominent`, `.card-hover`, `.container-wide`, `.rule`, `accent-strong`, `ink-800/900`, `shadow-soft/lift`, `opacity-12`) alive for not-yet-rebuilt files. Do not use them in new code.
- **Print**: `@media print` hides only `[data-site-nav]`, `footer`, `.site-bg` and `<button>`s, and forces `[data-reveal]` / `[data-page-transition]` visible. Don't hide `header` globally.

## Projects & case studies

- `src/data/areas.js` — `AREAS` (id, path, index `01`..`04`, `name`/`short` `{ tr, en }`, `stack`) + `areaByPath()`; single source for the four areas (About, Footer, NotFound, area-page headers, SEO_META titles). Add/rename an area here only.
- `src/data/projects.js` — single source for every project: card data, links, `preview` (`browser` | `phone` | `window` | `terminal`), `featured` flag. Feeds home Projects, `/web`, case study nav, SEO_META and tests. Bilingual fields are `{ tr, en }`, read via `pick(value, isTurkish)`.
- `src/data/caseStudies.js` — detail text keyed by project id (facts, problem/solution, decisions, optional `features`, `gallery`, `video`). Only imported by the case study chunk.
- `src/pages/CaseStudyPage.jsx` — one generic page for `/case-study/:id`; unknown id renders `NotFoundPage`.
- Add a project: entry in `projects.js` + entry in `caseStudies.js` + `<loc>` in `public/sitemap.xml`. SEO meta is generated automatically; `tests/unit/seo-meta.test.js` checks both files stay in sync.
- Assets: `public/previews/*.webp` (cards), `public/previews/noble/` + `public/media/` (case-study only; excluded from PWA precache in `vite.config.js`).

## ReactBits Components

Copy-pasted from [reactbits.dev](https://reactbits.dev) (not npm). The Signal redesign removes most of them; only these remain until the homepage/area/case-study rebuild lands.

| Component     | File                                  | Notes                                                       |
| ------------- | ------------------------------------- | ----------------------------------------------------------- |
| RotatingText  | `src/components/RotatingText.jsx`     | Auto-cycling text (framer-motion). Kept for Hero roles.     |
| ASCIIText     | `src/components/ui/ASCIIText.jsx`     | (pending removal) Hero name.                                |
| GradientText  | `src/components/ui/GradientText.jsx`  | (pending removal) Hero CTA.                                 |
| SpotlightCard | `src/components/ui/SpotlightCard.jsx` | (pending removal) Project cards.                            |
| TiltedCard    | `src/components/ui/TiltedCard.jsx`    | (pending removal) Certificate cards.                        |
| MagicBento    | `src/components/ui/MagicBento.jsx`    | (pending removal) About bento grid.                         |
| LogoLoop      | `src/components/ui/LogoLoop.jsx`      | (pending removal) RAF marquee; used only by `TechLogoLoop`. |
| CardMarquee   | `src/components/ui/CardMarquee.jsx`   | (pending removal) GitHub repo marquee in Projects.          |

Already removed: Aurora (and `ogl`), Noise, ClickSpark, ShinyText, Magnet. Do not reintroduce continuous RAF/canvas/WebGL effects.

## Data

`src/utils/githubApi.js`: GitHub REST via native `fetch`. Stale-while-revalidate — `fetchGitHubRepos` returns cached repos immediately, revalidates in background. Rate limiting (10 req/min) + 403/429 cooldown. Caches in memory + sessionStorage. Env: `VITE_GITHUB_USERNAME` (default `MertSoylu`), optional `VITE_GITHUB_TOKEN`.

## Pitfalls

- `.dark` is on `<html>` (set by `public/theme-init.js` before paint, then `DarkModeContext`). Affects Tailwind `dark:` selectors; don't add a second `dark` class on a wrapper.
- Changing the `vercel.json` CSP: it is the only host config (no `netlify.toml`). Scripts must be same-origin files; `frame-src` is `'none'`; fonts are self-hosted.
- Vite chunk splitting in `vite.config.js` hardcodes vendor bundles (`vendor-icons/motion/vercel/react/common`). `chunkSizeWarningLimit: 600` kB. Cyrillic/Vietnamese Geist subsets are excluded from the PWA precache.
- `html, body` use `overflow-x: clip` (not `hidden`) so `position: sticky` keeps working; don't add `overflow-x-hidden` to wrappers around sticky elements.
- Route transition edits affect only `src/App.jsx` `<PageTransition>` (opacity + 8px, 0.3s in / 0.15s out; reduced motion → 0.15s fade).
