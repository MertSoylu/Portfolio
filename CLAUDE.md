# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build (outputs to dist/)
npm run preview  # Preview production build
npm run lint     # ESLint on .js/.jsx files
```

No test framework is configured.

## Environment Variables

Copy `.env.example` to `.env` and set:
- `VITE_GITHUB_USERNAME` — GitHub username whose repos are displayed in Projects
- `VITE_GITHUB_TOKEN` — (optional) Increases GitHub API rate limit from 60 to 5000 req/hr
- `VITE_API_URL` — (optional) Backend endpoint for the contact form
- `VITE_GA_ID` — (optional) Google Analytics tracking ID

## Architecture

**Stack:** React 18 + Vite, Tailwind CSS (class-based dark mode), Framer Motion, React Router v6, Axios.

### Context System

Two global contexts wrap the entire app in `App.jsx`:
- `DarkModeContext` — `isDark` + `toggleDarkMode()`, persisted to localStorage, applies `dark` class to `<html>`
- `LanguageContext` — `language` (`"tr"` or `"en"`), `isTurkish`, `toggleLanguage()`, auto-detects browser preference on first visit, persisted to localStorage

All bilingual text is inlined inside components as conditional objects/strings — there is no external i18n library.

### Routing

`/` renders a single-page scroll layout (Hero → About → Projects → Contact) with scroll-based active section tracking in Navbar. Sub-pages `/web`, `/android`, `/cybersecurity` are full-page detail views rendered via React Router.

### GitHub API Integration (`src/utils/githubApi.js`)

Fetches public repos for the configured username. Implements:
- 24-hour localStorage cache (key: `github_repos_cache`)
- Client-side rate limiting (20 requests/minute)
- Graceful fallback to `FALLBACK_PROJECTS` defined in `src/utils/constants.js`

### Tailwind Configuration

`tailwind.config.js` defines custom design tokens used throughout:
- Color scales: `sand`, `warm`, `dark`
- Custom animations: `floating`, `drift`, `shimmer`, `slideIn`, `fadeIn`, `wave-shift`

Dark mode uses the `class` strategy — toggling the `dark` class on `<html>` triggers all `dark:` variants.

### Deployment

Both `netlify.toml` and `vercel.json` are configured for SPA routing (all paths → `index.html`). Build command is `npm run build`, publish dir is `dist/`.
