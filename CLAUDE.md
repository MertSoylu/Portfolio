# CLAUDE.md

React 18 SPA portfolio. React Router v6, Tailwind CSS v3, Framer Motion v10. `@` → `src/`.

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

- `DarkModeContext` — `isDark` + toggle; `.dark` class on root div
- `LanguageContext` — `useLanguage()` returns `{ language, isTurkish, toggleLanguage }`; persists to localStorage, sets `<html lang>`. Strings in `src/utils/constants.js`

**Routing**: Lazy pages via `lazyWithRetry()` — catches chunk load failures, does one-time sessionStorage-guarded page reload. `HomePage` (`/`) = `Hero` + lazy `About`/`Certificates`/`Projects`/`Contact` stacked with `SectionDivider`. Other routes live in the `LAZY_ROUTES` table in `src/App.jsx`: `/web`, `/android`, `/cybersecurity`, `/data-science`, `/case-study/:id`, `*`.

**Per-route transitions**: `src/App.jsx` — `<PageTransition>` motion wrapper with fade+slide. Collapses to plain opacity fade when `prefersReducedMotion`. No ROUTE_DIRECTIONS/ROUTE_OVERLAYS/ROUTE_PARTICLES (removed in ReactBits migration).

**Homepage sections**: Hero ("New" badge → NOBLE, ASCIIText name + RotatingText roles + GradientText CTA), About (MagicBento bento grid), Projects (featured wide card + 3-col project grid + GitHub repo CardMarquee), LogoLoop (infinite tech icon marquee), Certificates (TiltedCard), Contact (form + channels).

**Background**: Aurora (WebGL ogl, fixed, top 65vh) + Noise (canvas grain) + ClickSpark (canvas burst). All continuous RAF.

## Projects & case studies

- `src/data/projects.js` — single source for every project: card data, links, `preview` (`browser` | `phone` | `window` | `terminal`), `featured` flag. Feeds home Projects, `/web`, case study nav, SEO_META and tests. Bilingual fields are `{ tr, en }`, read via `pick(value, isTurkish)`.
- `src/data/caseStudies.js` — detail text keyed by project id (facts, problem/solution, decisions, optional `features`, `gallery`, `video`). Only imported by the case study chunk.
- `src/pages/CaseStudyPage.jsx` — one generic page for `/case-study/:id`; unknown id renders `NotFoundPage`.
- Add a project: entry in `projects.js` + entry in `caseStudies.js` + `<loc>` in `public/sitemap.xml`. SEO meta is generated automatically; `tests/unit/seo-meta.test.js` checks both files stay in sync.
- Assets: `public/previews/*.webp` (cards), `public/previews/noble/` + `public/media/` (case-study only; excluded from PWA precache in `vite.config.js`).

## ReactBits Components

All copy-pasted from [reactbits.dev](https://reactbits.dev) (not npm).

| Component     | File                                  | Notes                                                  |
| ------------- | ------------------------------------- | ------------------------------------------------------ |
| Aurora        | `src/components/ui/Aurora.jsx`        | WebGL (ogl). ColorStops, speed, blend, amplitude.      |
| ClickSpark    | `src/components/ui/ClickSpark.jsx`    | Canvas spark on click.                                 |
| Noise         | `src/components/ui/Noise.jsx`         | Canvas grain overlay, 1024×1024, continuous RAF.       |
| SpotlightCard | `src/components/ui/SpotlightCard.jsx` | Radial gradient on mouse move. Project cards.          |
| TiltedCard    | `src/components/ui/TiltedCard.jsx`    | 3D tilt on hover. Certificate cards.                   |
| RotatingText  | `src/components/RotatingText.jsx`     | Auto-cycling text (framer-motion). Hero roles.         |
| ShinyText     | `src/components/ui/ShinyText.jsx`     | CSS gradient shimmer. SectionHeader eyebrows.          |
| ASCIIText     | `src/components/ui/ASCIIText.jsx`     | Canvas→ASCII pixel rendering. Hero name.               |
| GradientText  | `src/components/ui/GradientText.jsx`  | Animated gradient text via motion value. Hero CTA.     |
| LogoLoop      | `src/components/ui/LogoLoop.jsx`      | RAF-driven infinite logo marquee. Below Projects.      |
| Magnet        | `src/components/ui/Magnet.jsx`        | Mouse-track translate3d pull. Navbar links.            |
| MagicBento    | `src/components/ui/MagicBento.jsx`    | Bento grid with mouse-follow spotlight. About section. |

**Performance-sensitive**: Aurora (WebGL 60fps, full viewport), Noise (canvas 60fps, 1024px). Both run continuous RAF.

## Data

`src/utils/githubApi.js`: GitHub REST via native `fetch`. Stale-while-revalidate — `fetchGitHubRepos` returns cached repos immediately, revalidates in background. Rate limiting (20 req/min) + 403/429 cooldown. Caches in memory + sessionStorage. Env: `VITE_GITHUB_USERNAME` (default `MertSoylu`), optional `VITE_GITHUB_TOKEN`.

## Pitfalls

- `DarkModeContext` toggles `dark` class on root div. Affects Tailwind `dark:` selectors.
- Changing `vercel.json` CSP requires syncing `netlify.toml` security headers.
- Vite chunk splitting in `vite.config.js` hardcodes vendor bundles. `chunkSizeWarningLimit: 600` kB.
- GSAP remains bundled (`vendor-gsap` chunk) but no components currently use it.
- Route transition edits affect only `src/App.jsx` `<PageTransition>`.
