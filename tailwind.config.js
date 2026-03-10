/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Archivo', 'system-ui', 'sans-serif'],
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        sand: {
          50: '#faf8f3',
          100: '#f5f1e8',
          200: '#ede6db',
          300: '#e0d5c7',
          400: '#d4c4af',
          500: '#c9b8a0',
          600: '#b8a08c',
          700: '#9d8872',
          800: '#7a6a5c',
          900: '#5a4a42',
        },
        warm: {
          50: '#fffbf5',
          100: '#fff8f0',
          200: '#ffe8d6',
          300: '#ffd4b3',
          400: '#ffb88a',
          500: '#ff9a5c',
          600: '#f07d2d',
          700: '#d45e1f',
          800: '#a84617',
          900: '#7a3410',
        },
        dark: {
          50: '#e2e8f0',
          100: '#cbd5e1',
          200: '#94a3b8',
          300: '#64748b',
          400: '#475569',
          500: '#334155',
          600: '#1e293b',
          700: '#1a2236',
          800: '#0f172a',
          900: '#0b1120',
        }
      },
      animation: {
        'floating': 'floating 6s ease-in-out infinite',
        'drift': 'drift 20s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'slideInUp': 'slideInUp 0.6s ease-out',
        'slideInDown': 'slideInDown 0.6s ease-out',
        'fadeIn': 'fadeIn 0.6s ease-out',
        'gradient-x': 'gradient-x 3s ease infinite',
        'wave-shift': 'wave-shift 8s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'badge-pulse': 'badge-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shimmer: {
          '0%': { opacity: 0.5 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.5 },
        },
        slideInUp: {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'wave-shift': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        'badge-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.08)', opacity: 0.85 },
        },
      },
      backgroundImage: {
        'gradient-sand': 'linear-gradient(135deg, #faf8f3 0%, #ede6db 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 100%)',
      }
    },
  },
  plugins: [],
}
