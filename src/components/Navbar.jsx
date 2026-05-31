import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useLanguage } from '../context/LanguageContext';

const SECTION_IDS = ['about', 'projects', 'contact'];
const LazyStaggeredMenu = React.lazy(() =>
  import('./StaggeredMenu').then((module) => ({ default: module.StaggeredMenu })),
);

const NavbarFallback = ({ headerControls, menuLabel, openMenuAriaLabel, onLoadMenu }) => (
  <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-transparent p-3 sm:p-5 lg:p-8">
    <div className="pointer-events-auto flex items-center">
      <img
        src="/favicon.svg"
        alt="Logo"
        className="block h-7 w-auto object-contain drop-shadow-[0_10px_18px_rgba(5,9,18,0.18)] sm:h-8"
        width={110}
        height={24}
        draggable={false}
      />
    </div>
    <div className="pointer-events-auto flex h-10 items-center gap-1.5 sm:h-9 sm:gap-2">
      <button
        type="button"
        onClick={onLoadMenu}
        className="inline-flex h-full min-w-[82px] items-center justify-between gap-2 rounded-xl border border-ink-200/70 bg-white/75 px-2.5 text-[0.68rem] font-black uppercase text-ink-800 shadow-soft backdrop-blur-xl hover:border-cyan-300 dark:border-white/10 dark:bg-ink-900/70 dark:text-ink-100 max-[360px]:min-w-10 max-[360px]:justify-center max-[360px]:px-0 sm:min-w-[90px] sm:px-3 sm:text-[0.72rem]"
        aria-label={openMenuAriaLabel}
      >
        <span className="max-[360px]:sr-only">{menuLabel}</span>
        <span className="relative inline-flex h-4 w-4 items-center justify-center">
          <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
          <span className="absolute h-3.5 w-0.5 rounded-full bg-current" />
        </span>
      </button>
      {headerControls}
    </div>
  </header>
);

const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { isTurkish, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const [menuReady, setMenuReady] = useState(false);

  const menuItems = [
    { label: isTurkish ? 'Hakkımda' : 'About', link: '#about' },
    { label: isTurkish ? 'Projeler' : 'Projects', link: '#projects' },
    { label: isTurkish ? 'İletişim' : 'Contact', link: '#contact' },
  ];

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/MertSoylu' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/in/mert-soylu-b8b6a1341/' },
  ];

  const handleItemClick = useCallback(
    (index) => {
      const sectionId = SECTION_IDS[index];
      const targetHash = `#${sectionId}`;

      if (isHomePage && location.hash === targetHash) {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      navigate(`/${targetHash}`);
    },
    [isHomePage, location.hash, navigate],
  );

  const headerControls = (
    <>
      {/* Dark mode toggle */}
      <motion.button
        onClick={toggleDarkMode}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200/70 bg-white/75 text-ink-800 shadow-soft backdrop-blur-xl hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-ink-900/70 dark:text-ink-100 dark:hover:border-cyan-300/40 dark:hover:text-cyan-100 sm:h-9 sm:w-9"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HiSun className="w-4 h-4" />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HiMoon className="w-4 h-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Language toggle */}
      <motion.button
        onClick={toggleLanguage}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200/70 bg-white/75 text-ink-800 shadow-soft backdrop-blur-xl hover:border-accent-300 hover:text-accent-700 dark:border-white/10 dark:bg-ink-900/70 dark:text-ink-100 dark:hover:border-accent-300/40 dark:hover:text-accent-100 sm:h-9 sm:w-9"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isTurkish ? 'Switch to English' : 'Türkçeye geç'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isTurkish ? (
            <motion.span
              key="tr"
              initial={{ rotate: -90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.25 }}
              className="text-[10px] font-bold"
            >
              TR
            </motion.span>
          ) : (
            <motion.span
              key="en"
              initial={{ rotate: 90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.25 }}
              className="text-[10px] font-bold"
            >
              EN
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );

  const menuProps = {
    isFixed: true,
    position: 'right',
    items: menuItems,
    socialItems,
    displaySocials: true,
    displayItemNumbering: true,
    logoUrl: '/favicon.svg',
    headerContent: headerControls,
    onItemClick: handleItemClick,
    panelMetaLabel: isTurkish ? 'Stüdyo dizini' : 'Studio index',
    socialsLabel: isTurkish ? 'Bağlantılar' : 'Links',
    socialsAriaLabel: isTurkish ? 'Sosyal bağlantılar' : 'Social links',
    menuLabel: isTurkish ? 'Menü' : 'Menu',
    closeLabel: isTurkish ? 'Kapat' : 'Close',
    openMenuAriaLabel: isTurkish ? 'Menüyü aç' : 'Open menu',
    closeMenuAriaLabel: isTurkish ? 'Menüyü kapat' : 'Close menu',
    colors: isDark
      ? ['rgba(255,79,70,0.92)', 'rgba(6,182,212,0.9)']
      : ['rgba(18,29,45,0.92)', 'rgba(255,79,70,0.86)'],
    panelBg: isDark
      ? 'linear-gradient(145deg, rgba(5,9,18,0.97) 0%, rgba(9,17,31,0.95) 54%, rgba(10,34,48,0.97) 100%)'
      : 'linear-gradient(145deg, rgba(255,253,247,0.97) 0%, rgba(236,252,255,0.95) 48%, rgba(255,244,240,0.97) 100%)',
    panelTextColor: isDark ? '#f7fbff' : '#121d2d',
    accentColor: isDark ? '#66e5f4' : '#ff4f46',
    menuButtonColor: isDark ? '#f7fbff' : '#121d2d',
    openMenuButtonColor: isDark ? '#f7fbff' : '#121d2d',
    changeMenuColorOnOpen: false,
  };
  const fallback = (
    <NavbarFallback
      headerControls={headerControls}
      menuLabel={menuProps.menuLabel}
      openMenuAriaLabel={menuProps.openMenuAriaLabel}
      onLoadMenu={() => setMenuReady(true)}
    />
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMenuReady(true), 1600);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!menuReady) return fallback;

  return (
    <Suspense fallback={fallback}>
      <LazyStaggeredMenu {...menuProps} />
    </Suspense>
  );
};

export default Navbar;
