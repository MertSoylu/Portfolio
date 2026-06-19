import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HiSun, HiMoon, HiMenu, HiX } from 'react-icons/hi';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useLanguage } from '../context/LanguageContext';
import Magnet from './ui/Magnet';

const SOCIALS = [
  { label: 'GitHub', icon: <FiGithub className="h-5 w-5" />, href: 'https://github.com/MertSoylu' },
  {
    label: 'LinkedIn',
    icon: <FiLinkedin className="h-5 w-5" />,
    href: 'https://www.linkedin.com/in/mert-soylu-b8b6a1341/',
  },
];

const IconToggle = ({ onClick, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line/12 bg-surface text-fg transition-colors hover:border-line/25 hover:bg-surface2"
  >
    {children}
  </button>
);

const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { isTurkish, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const isHomePage = location.pathname === '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const links = [
    { label: isTurkish ? 'Hakkımda' : 'About', id: 'about' },
    { label: isTurkish ? 'Projeler' : 'Projects', id: 'projects' },
    { label: isTurkish ? 'İletişim' : 'Contact', id: 'contact' },
  ];

  const goToSection = useCallback(
    (id) => {
      setOpen(false);
      const hash = `#${id}`;
      if (isHomePage) {
        const el = document.getElementById(id);
        if (el) {
          window.history.pushState(null, '', hash);
          el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
          return;
        }
      }
      navigate(`/${hash}`);
    },
    [isHomePage, navigate, reduce],
  );

  const goHome = () => {
    setOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-line/10 bg-canvas/85 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="container-wide flex h-16 items-center justify-between gap-4">
        <button
          type="button"
          onClick={goHome}
          className="group flex items-center gap-2.5 rounded-lg py-1 pr-2 text-left"
          aria-label={isTurkish ? 'Ana sayfa' : 'Home'}
        >
          <img src="/favicon.svg" alt="" width={28} height={28} className="h-7 w-7" draggable={false} />
          <span className="font-display text-lg font-semibold tracking-tight text-fg">Mert Soylu</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Magnet key={link.id} padding={30} magnetStrength={4}>
              <button
                type="button"
                onClick={() => goToSection(link.id)}
                className="link-underline rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
              >
                {link.label}
              </button>
            </Magnet>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <IconToggle
            onClick={toggleDarkMode}
            label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiSun className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiMoon className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </IconToggle>

          <IconToggle onClick={toggleLanguage} label={isTurkish ? 'Switch to English' : 'Türkçeye geç'}>
            <span className="text-[11px] font-bold">{isTurkish ? 'TR' : 'EN'}</span>
          </IconToggle>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={
              open ? (isTurkish ? 'Menüyü kapat' : 'Close menu') : isTurkish ? 'Menüyü aç' : 'Open menu'
            }
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line/12 bg-surface text-fg transition-colors hover:border-line/25 hover:bg-surface2 md:hidden"
          >
            {open ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line/10 bg-canvas/95 backdrop-blur-md md:hidden"
          >
            <div className="container-wide flex flex-col gap-1 py-4">
              {links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => goToSection(link.id)}
                  className="rounded-xl px-3 py-3 text-left font-display text-xl font-semibold text-fg transition-colors hover:bg-surface2"
                >
                  {link.label}
                </button>
              ))}

              <div className="mt-3 flex items-center gap-3 border-t border-line/10 pt-4">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line/12 bg-surface text-fg transition-colors hover:border-line/25 hover:bg-surface2"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
