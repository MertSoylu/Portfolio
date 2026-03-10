import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX, HiSun, HiMoon } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { isDark, toggleDarkMode } = useDarkMode();
  const { isTurkish, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isHomePage) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/' + href);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    );

    ['about', 'projects', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { name: isTurkish ? 'Hakkımda' : 'About', href: '#about' },
    { name: isTurkish ? 'Projeler' : 'Projects', href: '#projects' },
    { name: isTurkish ? 'İletişim' : 'Contact', href: '#contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-sand-50/95 dark:bg-dark-800/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            className="text-2xl font-bold gradient-text cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            MS
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = isHomePage && activeSection === item.href.slice(1);
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="relative text-sand-700 dark:text-dark-100 font-medium hover:text-warm-600 dark:hover:text-warm-400 py-1 px-3 cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-warm-500/10 dark:bg-warm-500/20 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.a>
              );
            })}

            {/* Dark mode toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="relative w-10 h-10 rounded-full flex items-center justify-center bg-sand-200 dark:bg-dark-500 text-sand-700 dark:text-dark-100 hover:bg-sand-300 dark:hover:bg-dark-400 transition-colors"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
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
                    <HiSun className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <HiMoon className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={toggleLanguage}
              className="relative w-10 h-10 rounded-full flex items-center justify-center bg-sand-200 dark:bg-dark-500 text-sand-700 dark:text-dark-100 hover:bg-sand-300 dark:hover:bg-dark-400 transition-colors"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isTurkish ? 'Dil değiştir' : 'Switch language'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isTurkish ? (
                  <motion.span
                    key="tr"
                    initial={{ rotate: -90, opacity: 0, scale: 0 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-xs font-bold"
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
                    className="text-xs font-bold"
                  >
                    EN
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.a
              href="https://github.com/MertSoylu"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              GitHub
            </motion.a>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <motion.button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg hover:bg-sand-200 dark:hover:bg-dark-500 transition-colors text-sand-700 dark:text-dark-100"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
            >
              {isDark ? <HiSun size={20} /> : <HiMoon size={20} />}
            </motion.button>

            <motion.button
              onClick={toggleLanguage}
              className="p-2.5 rounded-lg hover:bg-sand-200 dark:hover:bg-dark-500 transition-colors text-sand-700 dark:text-dark-100 text-xs font-bold"
              whileTap={{ scale: 0.9 }}
              aria-label={isTurkish ? 'Dil değiştir' : 'Switch language'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isTurkish ? (
                  <motion.span
                    key="tr-mobile"
                    initial={{ rotate: -90, opacity: 0, scale: 0 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.25 }}
                    className="inline-block"
                  >
                    TR
                  </motion.span>
                ) : (
                  <motion.span
                    key="en-mobile"
                    initial={{ rotate: 90, opacity: 0, scale: 0 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.25 }}
                    className="inline-block"
                  >
                    EN
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              className="p-2.5 rounded-lg hover:bg-sand-200 dark:hover:bg-dark-500 transition-colors text-sand-900 dark:text-dark-50"
              onClick={toggleMenu}
            >
              {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="flex flex-col gap-2 pb-4 pt-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`py-3 px-4 rounded-lg text-sand-700 dark:text-dark-100 font-medium hover:text-warm-600 dark:hover:text-warm-400 hover:bg-sand-100 dark:hover:bg-dark-600 transition-colors ${
                  isHomePage && activeSection === item.href.slice(1)
                    ? 'text-warm-600 dark:text-warm-400 font-bold'
                    : ''
                }`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="https://github.com/MertSoylu"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm inline-block w-fit mt-1"
              onClick={() => setIsOpen(false)}
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
