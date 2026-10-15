# CLAUDE.md

React 18 SPA portfolio (TR/EN). React Router v6, Tailwind CSS v3, Framer Motion v10, Vite 5. `@` → `src/`.

Visual identity is **Signal** (`docs/superpowers/specs/2026-10-15-signal-identity.md` is the contract): near-black canvas, hairline grid, one Claude-orange accent (`#D97757` fill / dark-theme text, `#A8452A` light-theme text), Geist + Geist Mono. No WebGL, canvas or continuous JS animation loops.

## Commands

```bash
npm run dev        # Vite dev server port 3000 (predev regenerates public/og-image.png)
npm run build      # Production build (prebuild regenerates og-image)
npm run lint       # ESLint .js/.jsx
npm run format     # Prettier write
npm run test       # Vitest
npm run e2e        # Playwright (starts `npm run preview` on :4173 itself)
```

Single unit: `npx vitest run tests/unit/<file>`
Single e2e: `npx playwright test tests/e2e/<file>` (no downloaded browsers? prefix `PW_CHANNEL=chrome`)

Pre-commit: husky + lint-staged runs eslint --fix + prettier on staged. commitlint enforces Conventional Commits. CI (`.github/workflows/ci.yml`) runs `npm ci`, `npm run lint`, `npm run build` only; tests and e2e are local.

## Architecture

**Provider stack** (`src/App.jsx`, outer→inner): `ErrorBoundary` > `MotionConfig` > `DarkModeProvider` > `LanguageProvider` > `AppContent`. `Toaster` + deferred Vercel Analytics/SpeedInsights siblings. `HelmetProvider` + `BrowserRouter` wrap `App` in `src/main.jsx`, which also imports the fonts.

- `DarkModeContext` — `isDark` + toggle; `.dark` class on `<html>` (not a wrapper div), persisted under localStorage `darkMode` (default dark); also updates `<meta name="theme-color">` (#0A0B0D / #F7F7F4).
- `public/theme-init.js` — blocking `<script src>` in `index.html` `<head>` that applies the saved theme + theme-color before first paint. Must stay an external file: `vercel.json` CSP is `script-src 'self'` (no inline scripts). Keep its storage key/colours in sync with `DarkModeContext`.
- `LanguageContext` — `useLanguage()` returns `{ language, isTurkish, toggleLanguage }`; persists to localStorage, sets `<html lang>`. Strings in `src/utils/constants.js`. Every visible string needs TR and EN; Turkish copy is informal ("sen") everywhere, including SEO.

**Routing**: lazy pages via `lazyWithRetry()` (one-time sessionStorage-guarded reload on chunk load failure). `HomePage` (`/`) = `Hero` + lazy `About` (`#about`, 01), `Projects` (`#projects`, 02), `Stack` (`#stack`, 03), `Certificates` (`#certificates`, 04), `Contact` (`#contact`, 05), each opened by `SectionHeader`. Other routes live in the `LAZY_ROUTES` table in `src/App.jsx`: `/web`, `/android`, `/cybersecurity`, `/data-science`, `/case-study/:id`, `*`.

**Shell**: `Navbar` (`<header data-site-nav>`, fixed h-16; brand monogram + name, which collapses to monogram-only below 360px but stays the link's accessible name; links About · Projects · Certificates · Contact; TR/EN toggle; theme toggle; mobile sheet with Escape/focus handling) + `<main id="main">` + `Footer`. Background is pure CSS: `<div className="site-bg" aria-hidden="true" />` (fixed, z -1, 64px hairline grid + faint signal glow, radial mask).

**Transitions**: `<PageTransition>` in `src/App.jsx` (opacity + 8px, 0.3s in / 0.15s out, `mode="wait"`; reduced motion → 0.15s fade). `Reveal` is the only other motion primitive. Hero roles use `RotatingText`.

**SEO**: every route renders `PageMeta` (Helmet), which always emits `robots` (`index, follow`, or `noindex` via its `noindex` prop; the 404 sets it). `index.html` has no static robots tag. Meta text comes from `SEO_META` in `src/utils/constants.js`; area titles are derived from `areas.js`.

## Design system (Signal)

- **Fonts**: self-hosted `@fontsource-variable/geist` (`font-sans`) and `geist-mono` (`font-mono`). No Google Fonts (CSP `font-src 'self' data:`).
- **Tokens**: RGB-triplet CSS vars in `src/index.css` (`:root` light, `html.dark` dark), mapped in `tailwind.config.js`: `canvas surface surface2 fg muted line accent ok danger` + `signal` / `signal-fg`. Use `text-accent` for accent _text/icons_ (works on both themes), `bg-signal text-signal-fg` for accent _fills_; never `text-signal` on light. Line alphas only from Tailwind's scale (`border-line/10`, `/15`, `/20`, `/25`…); `/12` generates nothing.
- **Classes** (`src/index.css`): `.container-site`, `.text-display/.text-h1..h4/.text-lead`, `.label` (mono, uppercase, muted) / `.micro` (mono 11px, smallest allowed size), `.btn` + `.btn-primary/.btn-secondary/.btn-ghost/.btn-lg`, `.card`, `.card-interactive`, `.tag`, `.link`, `.ticks` (corner marks, ≤2 per page), `.mark` (signal highlight), `.status-dot`, `.site-bg`. Radius: cards `rounded-lg`, buttons/inputs `rounded-md`, tags `rounded`. Depth by border, not shadow. There is no legacy alias layer any more; every class and theme entry in those two files is in use.
- **Print**: `@media print` hides only `[data-site-nav]`, `footer`, `.site-bg`, `<button>`s and the skip link, and forces `[data-reveal]` / `[data-page-transition]` visible. Don't hide `header` globally.

## Shared components

| Piece                                             | File                                         | Notes                                                                                                                                                                                                 |
| ------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Reveal`                                          | `src/components/ui/Reveal.jsx`               | Fade + 12px rise once; opacity only under reduced motion. `as` picks the element; sets `data-reveal` for print.                                                                                       |
| `RotatingText`                                    | `src/components/RotatingText.jsx`            | Hero role line. `mainClassName` (`.mark`) styles a persistent box whose width follows the text; swaps overlap so the highlight is never empty; static first role + sr-only list under reduced motion. |
| `DevicePreview` (`ProjectPreview` etc.)           | `src/components/ui/DevicePreview.jsx`        | `BrowserFrame` / `PhoneFrame` / `WindowShot` / `TerminalPreview`; `ProjectPreview` picks by `project.preview` (home Projects, showcases, case study header).                                          |
| `PageBackButton`                                  | `src/components/ui/PageBackButton.jsx`       | Back link at the top of area / case-study pages (default `/#about`).                                                                                                                                  |
| `NewTabNote`                                      | `src/components/ui/NewTabNote.jsx`           | sr-only "opens in a new tab" suffix for external links.                                                                                                                                               |
| `SectionHeader`                                   | `src/components/home/SectionHeader.jsx`      | The only section header: hairline rule + mono `index / label`, h2, lead, `aside`. Props `{ id, index, label, title, lead, aside, align, className }`.                                                 |
| `SpecialtyPageLayout` + `PageSection`, `InfoCard` | `src/components/SpecialtyPageLayout.jsx`     | Shared by the four area pages: back link, `Alan 0N / 04` header + meta aside, children, closing CTA band (contact + next area).                                                                       |
| `ProjectShowcase`, `TagList`, `ProjectActions`    | `src/components/project/ProjectShowcase.jsx` | Project showcase block on `/web`, `/android`, `/cybersecurity`; `ProjectActions` (primary + secondary links) is also used by the case study header.                                                   |
| `useGitHubRepos`                                  | `src/hooks/useGitHubRepos.js`                | `{ status: 'loading' \| 'success' \| 'error', repos, error, retry }`; subscribes to githubApi background refreshes.                                                                                   |
| `PageMeta`, `ErrorBoundary`, `LoadingSpinner`     | `src/components/`                            | Helmet meta (see SEO), top-level error fallback, CSS-only spinner.                                                                                                                                    |

Removed in the Signal redesign (do not reintroduce; no continuous RAF/canvas/WebGL): Aurora (and `ogl`), Noise, ClickSpark, ASCIIText, GradientText, ShinyText, Magnet, MagicBento, TiltedCard, SpotlightCard, LogoLoop, CardMarquee, ProjectModal, `src/lib/utils.ts` (`clsx`, `tailwind-merge`), legacy Tailwind palettes/shadows and the old CSS classes.

## Content model

- `src/data/areas.js` — `AREAS`: the four areas (id, path, index `01`..`04`, `name`/`short` `{ tr, en }`, `stack`) and each area's page copy under `page` (h1 `title`, `lead`, optional `status`, then one `{ label, title, lead?, ...items }` block per page section: `projects`, `tech`, `approach`, `features`, `stats`, `checks`, `focus`, `certificate`, `statement`, `learning`, `outputs`). Text may use `{count}` / `{live}` placeholders filled by `fill()`; `stats` items can `derive` values from data. Helpers: `areaByPath`, `areaById`, `nextArea`, `fill`, `LEARNING_LEVELS`. Single source for About cards, Footer, NotFound links, area pages and SEO titles. Add/rename an area here only.
- `src/data/projects.js` — single source for every project: card data, links, `preview` (`browser` | `phone` | `window` | `terminal`), `featured` flag (exactly one). Feeds home Projects, `/web`, `/android`, `/cybersecurity`, case study nav, SEO_META and tests. Bilingual fields are `{ tr, en }`, read via `pick(value, isTurkish)`. Also `UI_COPY`, `caseStudyPath`, `getProject`, `projectsByCategory`.
- `src/data/caseStudies.js` — detail text keyed by project id (facts, problem/solution, decisions, optional `features`, `gallery`, `video`). Only imported by the case study chunk.
- `src/pages/CaseStudyPage.jsx` — one generic page for `/case-study/:id` (preview header, facts, numbered sections, mobile jump list, sticky TOC on lg, prev/next); unknown id renders `NotFoundPage`.
- `src/utils/constants.js` — `PERSONAL_INFO`, `HERO_ROLES`, `CV_PATH`/`CV_LABEL`, `CERTIFICATES`, `SEO_META`, `FALLBACK_PROJECTS`.
- Add a project: entry in `projects.js` + entry in `caseStudies.js` + `<loc>` in `public/sitemap.xml`. SEO meta is generated automatically; `tests/unit/seo-meta.test.js` checks the files stay in sync.
- Assets: `public/previews/*.webp` (cards, `<id>-live.webp` on case studies), `public/previews/noble/` + `public/media/` (case-study only; excluded from PWA precache in `vite.config.js`).

## Data

`src/utils/githubApi.js`: GitHub REST via native `fetch`. Stale-while-revalidate — `fetchGitHubRepos` returns cached repos immediately, revalidates in background. Rate limiting (10 req/min) + 403/429 cooldown. Caches in memory + sessionStorage. Env: `VITE_GITHUB_USERNAME` (default `MertSoylu`), optional `VITE_GITHUB_TOKEN`. The contact form uses EmailJS (`VITE_EMAILJS_SERVICE_ID`, `_TEMPLATE_ID`, `_PUBLIC_KEY`) and a hidden `website` honeypot.

## Tests

- Unit (`tests/unit`, Vitest + jsdom): `seo-meta` (SEO_META, sitemap and project/case-study sync), `page-meta` (exactly one robots tag: `index, follow` / `noindex`), `projects-data` (`pick`, bilingual copy, gallery/alt rules), `case-study-page` (404 fallback, numbered sections + TOC, nav landmarks, gallery, scroll-spy), `rate-limit` (GitHub budget + SWR refresh), `error-boundary`.
- E2E (`tests/e2e`, Playwright, chromium): `smoke` (home sections in order, skip link, CV link, hero roles for assistive tech, area pages, 404, honeypot, contact form), `homepage-responsive` (projects grid/cards, GitHub repo list, no horizontal overflow at several widths, hero CTA), `case-study-visuals` (previews, msscan terminal, NOBLE video + gallery, canonical, prev/next, 360px overflow, TOC behaviour).
- Kept contracts the tests rely on are listed at the end of the spec (`main#main`, single `a[href="#main"]`, `#projects` with one `h3` per project, `ul[aria-label*="GitHub"]`, `input[name="website"]`, nav names, …).

## Pitfalls

- `.dark` is on `<html>` (set by `public/theme-init.js` before paint, then `DarkModeContext`). Affects Tailwind `dark:` selectors; don't add a second `dark` class on a wrapper.
- `vercel.json` is the only host config (no `netlify.toml`). CSP: scripts must be same-origin files, `frame-src` is `'none'`, fonts are self-hosted.
- Vite chunk splitting in `vite.config.js` hardcodes vendor bundles (`vendor-icons/motion/vercel/react/common`). `chunkSizeWarningLimit: 600` kB. Cyrillic/Vietnamese Geist subsets are excluded from the PWA precache.
- `html, body` use `overflow-x: clip` (not `hidden`) so `position: sticky` keeps working; don't add `overflow-x-hidden` to wrappers around sticky elements.
- Navbar at 320px has no room for the brand name next to TR/EN + theme + menu (44px targets); keep the name `sr-only` below 360px rather than letting it wrap.
- Route transition edits affect only `src/App.jsx` `<PageTransition>`.
