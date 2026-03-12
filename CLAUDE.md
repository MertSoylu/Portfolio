# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint on .js/.jsx files
```

## Architecture

React 18 SPA with React Router v6, Tailwind CSS, and Framer Motion.

**Routing** (`src/App.jsx`): Single layout wraps all routes. `HomePage` is a composition of section components rendered at `/`. Three specialty pages at `/android`, `/web`, `/cybersecurity`.

**Global Providers** (wrap entire app):
- `DarkModeContext` — exposes `isDark` + toggle; dark mode applied via `.dark` class on root div
- `LanguageContext` — Turkish/English i18n; translation strings live in `src/utils/constants.js`

**Pages** (`src/pages/`): `AndroidPage`, `WebDevPage`, `CyberSecurityPage` — each is a standalone page for a focus area.

**Components** (`src/components/`): Section components (`Hero`, `About`, `Projects`, `Contact`, `Footer`) plus UI utilities (`Navbar`, `SandBackground`, `ScrollProgress`, `CustomCursor`, `LoadingSpinner`).

**Utils** (`src/utils/`):
- `constants.js` — translation strings and static data
- `githubApi.js` — GitHub API calls (via axios)

Animations use `AnimatePresence` with `mode="wait"` for page transitions. The `SandBackground` component is a decorative animated canvas/SVG rendered behind all content.

## Security Headers

The site is configured with comprehensive security headers in `vercel.json`:
- **CSP**: Strict policy (self-hosted scripts/styles, GitHub API access)
- **X-Frame-Options**: DENY (clickjacking protection)
- **X-Content-Type-Options**: nosniff (MIME sniffing prevention)
- **Referrer-Policy**: strict-origin-when-cross-origin (referrer leakage prevention)
- **Permissions-Policy**: All browser APIs disabled (geolocation, microphone, camera, payment, etc.)

These headers address security audit findings and provide defense-in-depth against XSS, clickjacking, and other common web vulnerabilities.
