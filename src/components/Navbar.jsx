import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useLanguage } from '../context/LanguageContext';
import { StaggeredMenu } from './StaggeredMenu';

const SECTION_IDS = ['about', 'projects', 'contact'];

const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { isTurkish, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const menuItems = [
    { label: isTurkish ? 'Hakkımda' : 'About', link: '#about' },
    { label: isTurkish ? 'Projeler' : 'Projects', link: '#projects' },
    { label: isTurkish ? 'İletişim' : 'Contact', link: '#contact' },
  ];

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/MertSoylu' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/in/mert-soylu-b8b6a1341/' },
  ];

  const handleItemClick = useCallback((index) => {
    const sectionId = SECTION_IDS[index];
    if (!isHomePage) {
      navigate(`/#${sectionId}`);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isHomePage, navigate]);

  const headerControls = (
    <>
      {/* Dark mode toggle */}
      <motion.button
        onClick={toggleDarkMode}
        className="w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-current transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span key="sun" initial={{ rotate: -90, opacity: 0, scale: 0 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0 }} transition={{ duration: 0.25 }}>
              <HiSun className="w-4 h-4" />
            </motion.span>
          ) : (
            <motion.span key="moon" initial={{ rotate: 90, opacity: 0, scale: 0 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0 }} transition={{ duration: 0.25 }}>
              <HiMoon className="w-4 h-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Language toggle */}
      <motion.button
        onClick={toggleLanguage}
        className="w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-current transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isTurkish ? 'Switch to English' : 'Türkçeye geç'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isTurkish ? (
            <motion.span key="tr" initial={{ rotate: -90, opacity: 0, scale: 0 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0 }} transition={{ duration: 0.25 }} className="text-[10px] font-bold">TR</motion.span>
          ) : (
            <motion.span key="en" initial={{ rotate: 90, opacity: 0, scale: 0 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0 }} transition={{ duration: 0.25 }} className="text-[10px] font-bold">EN</motion.span>
          )}
        </AnimatePresence>
      </motion.button>

    </>
  );

  return (
    <StaggeredMenu
      isFixed={true}
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials={true}
      displayItemNumbering={true}
      logoUrl="/favicon.svg"
      headerContent={headerControls}
      onItemClick={handleItemClick}
      colors={isDark ? ['rgba(8,8,8,0.72)', 'rgba(0,0,0,0.82)'] : ['rgba(245,240,232,0.58)', 'rgba(250,248,243,0.64)']}
      panelBg={isDark ? 'rgba(0,0,0,0.84)' : 'rgba(250,248,243,0.68)'}
      panelTextColor={isDark ? '#e2e8f0' : '#5a4a42'}
      accentColor={isDark ? '#ff9a5c' : '#f07d2d'}
      menuButtonColor={isDark ? '#e2e8f0' : '#5a4a42'}
      openMenuButtonColor={isDark ? '#e2e8f0' : '#5a4a42'}
      changeMenuColorOnOpen={false}
    />
  );
};

export default Navbar;
