# AGENTS.md

Compact guidance for OpenCode agents on this repo. See `CLAUDE.md` for architecture details.

## Quick Start

```bash
npm run dev        # Vite server on port 3000 (auto-opens)
npm run build      # Production build to ./dist
npm run lint       # ESLint .js/.jsx files only
npm run preview    # Preview production build locally
```

No test suite. No pre-commit hooks.

## Key Quirks

### Routing & Lazy Loading

- Home (`/`) is composed of section components stacked with dividers.
- Some pages use custom `lazyWithRetry()` wrapper (Android, CyberSecurity, NotFound) that catches chunk load failures and reloads page once. Direct imports for `/web` and `/data-science`.
- Each route has **hardcoded directional transitions** in `src/App.jsx` (`ROUTE_DIRECTIONS`, `ROUTE_OVERLAYS`, `ROUTE_PARTICLES` objects). Changing route animations requires editing all three.
- Mobile adjusts particle count to 65% of desktop setting per `ROUTE_PARTICLES`.

### Build & Chunks

- **Vite chunk splitting** in `vite.config.js` hardcodes vendor bundles: `vendor-react`, `vendor-motion`, `vendor-icons`, `vendor-ogl`, `vendor-gsap`, `vendor-lenis`, `vendor-vercel`, `vendor-common`.
- **chunkSizeWarningLimit: 600** (non-default). Exceeding this triggers build warnings.
- Import alias: `@/` → `./src/`

### Global Contexts

- `DarkModeContext`: Toggles `dark` class on root div. Affects Tailwind dark: selectors and inline opacity values.
- `LanguageContext`: Turkish/English i18n. Strings in `src/utils/constants.js`. Add new keys to both language objects to avoid undefined rendering.

### Analytics & Performance

- Vercel Analytics deferred-loaded via `requestIdleCallback` after page load. Will not appear in dev server test runs unless load complete.
- `FluidParticlesBackground` (custom OGL/GSAP component) runs on all pages. Expensive on low-end devices; mobile detection built in.

### Deployment

- **Vercel**: `vercel.json` defines strict CSP, caching per asset type, SPA rewrite.
- **Netlify**: `netlify.toml` defines environment contexts (production, deploy-preview, branch-deploy) that set `VITE_ENV`. Build command same.
- Both configs assume `npm run build` outputs to `./dist`.

## Common Pitfalls

- Adding UI to a lazy page without wrapping in `<Suspense fallback={<LoadingSpinner />}>` → chunk errors may not show fallback.
- Editing route transition settings in only one of three objects → inconsistent animation behavior.
- Modifying `ROUTE_PARTICLES` values without testing on mobile → particles may disappear or tank performance on low-end phones.
- Adding new i18n strings only to one language object → other language will show undefined or keys.
- Modifying CSP in `vercel.json` without syncing `netlify.toml` security headers → inconsistent security across deployments.
