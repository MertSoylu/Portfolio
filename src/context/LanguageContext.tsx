import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextValue {
  language: Language;
  isTurkish: boolean;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('language');
      if (saved === 'tr' || saved === 'en') return saved;
      return navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language === 'tr' ? 'tr' : 'en';
    document.documentElement.setAttribute('data-lang', language);

    document.body.classList.add('lang-switching');
    const timeout = setTimeout(() => {
      document.body.classList.remove('lang-switching');
    }, 420);

    return () => clearTimeout(timeout);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  return (
    <LanguageContext.Provider value={{ language, isTurkish: language === 'tr', toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
