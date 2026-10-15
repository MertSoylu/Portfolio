import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiSun, HiMoon, HiMenu, HiX } from 'react-icons/hi';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useLanguage } from '../context/LanguageContext';
import { PERSONAL_INFO } from '../utils/constants';
import { isPlainLeftClick, scrollToSection } from '../utils/scroll';

const SOCIALS = [
  { label: 'GitHub', icon: FiGithub, href: PERSONAL_INFO.github },
  { label: 'LinkedIn', icon: FiLinkedin, href: PERSONAL_INFO.linkedin },
];

const FOCUSABLE = 'a[href], button:not([disabled])';
const DESKTOP_QUERY = '(min-width: 768px)';

const iconButton =
  'inline-flex h-11 w-11 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-surface2 hover:text-fg';

const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { isTurkish, toggleLanguage } = useLanguage();
  const location = useLocation();
  const reduce = useReducedMotion();
  const isHomePage = location.pathname === '/';
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const firstLinkRef = useRef(null);
  const wasOpen = useRef(false);

  const links = [
    { label: isTurkish ? 'Hakkımda' : 'About', id: 'about' },
    { label: isTurkish ? 'Projeler' : 'Projects', id: 'projects' },
    { label: isTurkish ? 'Sertifikalar' : 'Certificates', id: 'certificates' },
    { label: isTurkish ? 'İletişim' : 'Contact', id: 'contact' },
  ];

  const closeMenu = useCallback(() => setOpen(false), []);

  // Sheet focus: first link on open, back to the menu button on close.
  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    } else if (wasOpen.current) {
      menuButtonRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  // Sheet: body scroll lock, Escape to close, Tab kept inside header + sheet, and close when the
  // viewport grows to the desktop layout.
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }
      if (event.key !== 'Tab' || !headerRef.current) return;
      const items = Array.from(headerRef.current.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event) => {
      if (event.matches) closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);
    mq.addEventListener('change', onChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      mq.removeEventListener('change', onChange);
    };
  }, [open, closeMenu]);

  // Route changes close the sheet.
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  const handleSectionClick = (event, id) => {
    closeMenu();
    if (!isHomePage || event.defaultPrevented || !isPlainLeftClick(event)) return;
    if (scrollToSection(id, reduce)) event.preventDefault();
  };

  const handleBrandClick = () => {
    closeMenu();
    if (isHomePage) {
      window.history.replaceState(null, '', '/');
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  const themeLabel = isTurkish
    ? isDark
      ? 'Açık temaya geç'
      : 'Koyu temaya geç'
    : isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode';

  // Visible text is "TR / EN"; the accessible name starts with the same string (WCAG 2.5.3).
  const languageLabel = isTurkish ? 'TR / EN – İngilizceye geç' : 'TR / EN – Switch to Turkish';

  const menuLabel = open
    ? isTurkish
      ? 'Menüyü kapat'
      : 'Close menu'
    : isTurkish
      ? 'Menüyü aç'
      : 'Open menu';

  return (
    <header ref={headerRef} data-site-nav className="fixed inset-x-0 top-0 z-50">
      {/* The blurred bar is a child: backdrop-filter would make the header the containing block of the
          fixed mobile sheet below and collapse it to zero height. */}
      <div className="h-16 border-b border-line/10 bg-canvas/80 backdrop-blur">
        <div className="container-site flex h-full items-center justify-between gap-3">
          <Link
            to="/"
            onClick={handleBrandClick}
            className="-ml-1 flex min-h-11 items-center gap-2.5 rounded-md px-1 text-fg"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-signal text-xs font-bold tracking-tight text-signal-fg"
            >
              MS
            </span>
            <span className="text-base font-semibold tracking-tight">Mert Soylu</span>
          </Link>

          <nav aria-label={isTurkish ? 'Ana gezinme' : 'Main'} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.id}>
                  <Link
                    to={{ pathname: '/', hash: `#${link.id}` }}
                    onClick={(event) => handleSectionClick(event, link.id)}
                    className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted transition-colors duration-150 hover:bg-surface2 hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={languageLabel}
              className="inline-flex min-h-11 items-center rounded-md px-2.5 font-mono text-xs transition-colors duration-150 hover:bg-surface2"
            >
              <span>
                <span className={isTurkish ? 'font-bold text-fg' : 'text-muted'}>TR</span>
                {' / '}
                <span className={isTurkish ? 'text-muted' : 'font-bold text-fg'}>EN</span>
              </span>
            </button>

            <button type="button" onClick={toggleDarkMode} aria-label={themeLabel} className={iconButton}>
              {isDark ? (
                <HiSun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <HiMoon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={menuLabel}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`${iconButton} md:hidden`}
            >
              {open ? (
                <HiX className="h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-line/10 bg-canvas md:hidden"
          >
            <nav aria-label={isTurkish ? 'Mobil menü' : 'Mobile menu'} className="container-site py-4">
              <ul>
                {links.map((link, index) => (
                  <li key={link.id} className="border-b border-line/10">
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      to={{ pathname: '/', hash: `#${link.id}` }}
                      onClick={(event) => handleSectionClick(event, link.id)}
                      className="text-h3 flex min-h-14 items-center py-3 text-fg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul
                className="mt-6 flex items-center gap-2"
                aria-label={isTurkish ? 'Sosyal bağlantılar' : 'Social links'}
              >
                {SOCIALS.map(({ label, icon: Icon, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line/15 text-fg transition-colors duration-150 hover:border-line/40 hover:bg-surface2"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
