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
      },
    },
  },
  plugins: [],
};
