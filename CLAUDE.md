# CLAUDE.md

Guidance for Claude Code (claude.ai/code) in this repo.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint on .js/.jsx files
```

## Architecture

React 18 SPA with React Router v6, Tailwind CSS, Framer Motion.

**Routing** (`src/App.jsx`): Single layout wraps all routes. `HomePage` = section components at `/`. Three specialty pages: `/android`, `/web`, `/cybersecurity`.

**Global Providers** (wrap entire app):

- `DarkModeContext` — `isDark` + toggle; dark mode via `.dark` class on root div
- `LanguageContext` — Turkish/English i18n; strings in `src/utils/constants.js`

**Pages** (`src/pages/`): `AndroidPage`, `WebDevPage`, `CyberSecurityPage` — standalone pages per focus area.

**Components** (`src/components/`): Section components (`Hero`, `About`, `Projects`, `Contact`, `Footer`) + UI utilities (`Navbar`, `SandBackground`, `ScrollProgress`, `CustomCursor`, `LoadingSpinner`).

**Utils** (`src/utils/`):

- `constants.js` — translation strings + static data
- `githubApi.js` — GitHub API calls (axios)

Animations use `AnimatePresence` with `mode="wait"` for page transitions. `SandBackground` = decorative animated canvas/SVG behind all content.

## Security Headers

`vercel.json` has security headers:

- **CSP**: Strict policy (self-hosted scripts/styles, GitHub API access)
- **X-Frame-Options**: DENY (clickjacking protection)
- **X-Content-Type-Options**: nosniff (MIME sniffing prevention)
- **Referrer-Policy**: strict-origin-when-cross-origin (referrer leakage prevention)
- **Permissions-Policy**: All browser APIs disabled (geolocation, microphone, camera, payment, etc.)

Headers fix security audit findings. Defense-in-depth vs XSS, clickjacking, common web vulns.
