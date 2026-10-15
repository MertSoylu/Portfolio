/** @type {import('tailwindcss').Config} */
// Signal identity tokens. Values live in CSS variables (src/index.css) as RGB triplets so
// the same utility works in both themes and supports alpha (`bg-canvas/80`).
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Geist Variable"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        surface2: token('surface-2'),
        fg: token('fg'),
        muted: token('muted'),
        line: token('line'),
        // Text-safe accent (text, icons, small marks, focus ring). Fills use `signal`.
        accent: token('accent'),
        signal: {
          DEFAULT: token('signal'),
          fg: token('signal-fg'),
        },
        ok: token('ok'),
        danger: token('danger'),

        /* LEGACY ALIASES — removed in phase 3 */
        // Used by: About.jsx, Certificates.jsx (hover:text-accent-strong).
        'accent-strong': token('accent'),
        // Used by: ui/DevicePreview.jsx (phone/terminal frames).
        ink: {
          800: '#181B1F',
          900: '#0A0B0D',
        },
      },
      /* LEGACY ALIASES — removed in phase 3 */
      boxShadow: {
        // Used by: Hero.jsx, Projects.jsx, ui/DevicePreview.jsx.
        soft: '0 1px 2px rgb(0 0 0 / 0.18)',
        lift: '0 24px 48px -24px rgb(0 0 0 / 0.5)',
      },
      opacity: {
        // `border-line/12` is used all over the not-yet-rebuilt sections; the spec scale has no 12.
        12: '0.12',
      },
    },
  },
  plugins: [],
};
