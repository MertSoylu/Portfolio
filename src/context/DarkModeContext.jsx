import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

// Browser-chrome colours; keep in sync with --canvas in src/index.css and public/theme-init.js.
const THEME_COLOR = { dark: '#0A0B0D', light: '#F7F7F4' };

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) throw new Error('useDarkMode must be used within DarkModeProvider');
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
      return true; // default to dark theme
    } catch {
      return true;
    }
  });

  // `.dark` lives on <html> (set before first paint by public/theme-init.js, then kept in sync here).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', isDark ? THEME_COLOR.dark : THEME_COLOR.light);

    try {
      localStorage.setItem('darkMode', JSON.stringify(isDark));
    } catch {
      /* storage unavailable (private mode): the choice just won't persist */
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
};
