# AGENTS.md

Compact guidance for OpenCode agents on this repo.

## Commands

```bash
npm run dev        # Vite dev server port 3000
npm run build      # Production build → ./dist
npm run lint       # ESLint .js/.jsx
npm run format     # Prettier write
npm run test       # Vitest
npm run e2e        # Playwright
```

Single unit: `npx vitest run tests/unit/<file>`
Single e2e: `npx playwright test tests/e2e/<file>`

Pre-commit: husky + lint-staged runs eslint --fix + prettier on staged files. Commit messages enforced by commitlint (Conventional Commits). `format` before commit if lint-staged errors.

## Architecture

**Stack**: React 18 SPA, React Router v6, Tailwind CSS v3, Framer Motion. `@` → `src/`.

**Provider stack** (`src/App.jsx`, outer→inner): `ErrorBoundary` > `MotionConfig` > `DarkModeProvider` > `LanguageProvider` > `AppContent`. `Toaster` + deferred Vercel Analytics/SpeedInsights siblings.

**Routing**: Lazy pages via `lazyWithRetry()` wrapper — catches chunk load failures, does one-time sessionStorage-guarded page reload. `HomePage` (`/`) = `Hero` + lazy `About`/`Certificates`/`Projects`/`Contact` stacked with `SectionDivider`. Standalone: `/web`, `/android`, `/cybersecurity`, `/data-science`. Case studies: `/case-study/{mnemosyne,typesprint,walkkittie,msscan}`. Add new routes through `lazyWithRetry`.

**Per-route transitions**: `src/App.jsx` — `<PageTransition>` motion wrapper with fade+slide. Collapses to plain opacity fade when `prefersReducedMotion`. **No more** `ROUTE_DIRECTIONS`/`ROUTE_OVERLAYS`/`ROUTE_PARTICLES` objects (removed in ReactBits migration).

**i18n** (`src/utils/constants.js`): Turkish/English via `LanguageContext`. Add keys to both language objects.

## ReactBits Components

These are copy-pasted from [reactbits.dev](https://reactbits.dev) (not npm).

| Component     | File                                  | Notes                                                                                |
| ------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| Aurora        | `src/components/ui/Aurora.jsx`        | WebGL (ogl) background. Config: colorStops, speed, blend, amplitude. Full-res 60fps. |
| ClickSpark    | `src/components/ui/ClickSpark.jsx`    | Canvas spark burst on click.                                                         |
| Noise         | `src/components/ui/Noise.jsx`         | Canvas grain overlay. 1024×1024, continuous RAF.                                     |
| SpotlightCard | `src/components/ui/SpotlightCard.jsx` | Spotlight radial gradient on mouse move. Used on project cards.                      |
| TiltedCard    | `src/components/ui/TiltedCard.jsx`    | 3D perspective tilt on hover. Used on certificate cards.                             |
| RotatingText  | `src/components/RotatingText.jsx`     | Auto-cycling text animation (framer-motion). Used in Hero for roles.                 |
| ShinyText     | `src/components/ui/ShinyText.jsx`     | CSS gradient shimmer. Used in SectionHeader eyebrows.                                |
| ASCIIText     | `src/components/ui/ASCIIText.jsx`     | Canvas→ASCII pixel rendering. Used in Hero for name.                                 |
| GradientText  | `src/components/ui/GradientText.jsx`  | Animated gradient text via motion value. Used in Hero CTA button.                    |
| LogoLoop      | `src/components/ui/LogoLoop.jsx`      | RAF-driven infinite logo marquee. Used below Projects.                               |
| Magnet        | `src/components/ui/Magnet.jsx`        | Mouse-track translate3d pull. Used on navbar links.                                  |

**Performance-sensitive**: `Aurora` (WebGL 60fps, full viewport), `Noise` (canvas 60fps, 1024px). Both run continuous RAF loops. Be mindful when adding features.

## Pitfalls

- `DarkModeContext` toggles `dark` class on root div. Affects Tailwind `dark:` selectors.
- Changing `vercel.json` CSP requires syncing `netlify.toml` security headers.
- Vite chunk splitting in `vite.config.js` hardcodes vendor bundles. `chunkSizeWarningLimit: 600` kB.
- GSAP files remain bundled (`vendor-gsap` chunk) but no components currently use it.
- Route transition edits affect only `src/App.jsx` `<PageTransition>` now.
