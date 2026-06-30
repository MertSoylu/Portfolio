import { HiMail } from 'react-icons/hi';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { PERSONAL_INFO } from '../utils/constants';

const Footer = () => {
  const { isTurkish } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', icon: <FiGithub className="h-5 w-5" />, href: 'https://github.com/MertSoylu' },
    {
      name: 'LinkedIn',
      icon: <FiLinkedin className="h-5 w-5" />,
      href: 'https://www.linkedin.com/in/mert-soylu-b8b6a1341/',
    },
    { name: 'Email', icon: <HiMail className="h-5 w-5" />, href: `mailto:${PERSONAL_INFO.email}` },
  ];

  return (
    <footer className="mt-12 border-t border-line/10 px-5 py-14">
      <div className="container-wide">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <h3 className="mb-3 font-display text-2xl font-semibold text-fg">Mert Soylu</h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {isTurkish
                ? 'Web, Android, güvenlik ve yapay zeka alanlarında ürüne dönüşen projeler geliştiriyorum.'
                : 'Building product-minded projects across web, Android, security, and AI.'}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {isTurkish ? 'Sayfalar' : 'Pages'}
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: isTurkish ? 'Hakkımda' : 'About', href: '/#about' },
                { name: isTurkish ? 'Projeler' : 'Projects', href: '/#projects' },
                { name: isTurkish ? 'İletişim' : 'Contact', href: '/#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-muted transition-colors hover:text-fg"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {isTurkish ? 'Bağlantılar' : 'Connect'}
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/12 bg-surface text-fg transition-colors hover:border-line/25 hover:bg-surface2"
                  title={link.name}
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-line/10 pt-6 text-sm text-muted md:flex-row">
          <p>
            {isTurkish
              ? `© ${currentYear} Mert Soylu. Tüm hakları saklıdır.`
              : `© ${currentYear} Mert Soylu. All rights reserved.`}
          </p>
          <p>
            {isTurkish ? 'React ve Tailwind CSS ile geliştirildi.' : 'Built with React and Tailwind CSS.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
