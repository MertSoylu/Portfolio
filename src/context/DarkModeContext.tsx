import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DarkModeContextValue {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined);

export const useDarkMode = (): DarkModeContextValue => {
  const context = useContext(DarkModeContext);
  if (!context) throw new Error('useDarkMode must be used within DarkModeProvider');
  return context;
};

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved) as boolean;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
