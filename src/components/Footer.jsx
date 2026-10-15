import { HiArrowUp, HiMail } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { AREAS } from '../data/areas';
import { PERSONAL_INFO } from '../utils/constants';
import { isPlainLeftClick, scrollToSection } from '../utils/scroll';

const linkClass =
  'inline-flex min-h-11 items-center text-sm text-muted transition-colors duration-150 hover:text-fg';

const Footer = () => {
  const { isTurkish } = useLanguage();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const currentYear = new Date().getFullYear();
  const t = (value) => (isTurkish ? value.tr : value.en);

  const pages = [
    { id: 'about', name: isTurkish ? 'Hakkımda' : 'About' },
    { id: 'projects', name: isTurkish ? 'Projeler' : 'Projects' },
    { id: 'certificates', name: isTurkish ? 'Sertifikalar' : 'Certificates' },
    { id: 'contact', name: isTurkish ? 'İletişim' : 'Contact' },
  ];

  const connect = [
    { name: 'GitHub', icon: FiGithub, href: PERSONAL_INFO.github, external: true },
    { name: 'LinkedIn', icon: FiLinkedin, href: PERSONAL_INFO.linkedin, external: true },
    { name: isTurkish ? 'E-posta' : 'Email', icon: HiMail, href: `mailto:${PERSONAL_INFO.email}` },
  ];

  const handleSectionClick = (event, id) => {
    if (pathname !== '/' || !isPlainLeftClick(event)) return;
    if (scrollToSection(id, reduce)) event.preventDefault();
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

  return (
    <footer className="mt-24 border-t border-line/10">
      <div className="container-site py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.5fr_1fr_1.4fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-signal text-xs font-bold tracking-tight text-signal-fg"
              >
                MS
              </span>
              <span className="text-base font-semibold tracking-tight">Mert Soylu</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted">
              {isTurkish
                ? 'Web, Android, güvenlik ve yapay zekâ alanlarında ürüne dönüşen projeler geliştiriyorum.'
                : 'Building product-minded projects across web, Android, security, and AI.'}
            </p>
          </div>

          <div>
            <h2 className="label mb-3 font-normal">{isTurkish ? 'Sayfalar' : 'Pages'}</h2>
            <ul>
              {pages.map((page) => (
                <li key={page.id}>
                  <Link
                    to={{ pathname: '/', hash: `#${page.id}` }}
                    onClick={(event) => handleSectionClick(event, page.id)}
                    className={linkClass}
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label mb-3 font-normal">{isTurkish ? 'Alanlar' : 'Areas'}</h2>
            <ul>
              {AREAS.map((area) => (
                <li key={area.id}>
                  <Link to={area.path} className={`${linkClass} gap-2`}>
                    <span className="micro text-muted" aria-hidden="true">
                      {area.index}
                    </span>
                    {t(area.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h2 className="label mb-3 font-normal">{isTurkish ? 'Bağlantılar' : 'Connect'}</h2>
            <ul className="flex gap-2">
              {connect.map(({ name, icon: Icon, href, external }) => (
                <li key={name}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={name}
                    title={name}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line/15 text-fg transition-colors duration-150 hover:border-line/40 hover:bg-surface2"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <a href={`mailto:${PERSONAL_INFO.email}`} className="link mt-4 inline-block break-all text-sm">
              {PERSONAL_INFO.email}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-line/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {isTurkish
              ? `© ${currentYear} Mert Soylu. Tüm hakları saklıdır.`
              : `© ${currentYear} Mert Soylu. All rights reserved.`}
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="btn btn-ghost -mx-3 self-start px-3 sm:self-auto"
          >
            <HiArrowUp className="h-4 w-4" aria-hidden="true" />
            {isTurkish ? 'Yukarı çık' : 'Back to top'}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
