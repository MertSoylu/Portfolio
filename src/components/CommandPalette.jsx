import { useMemo } from 'react';
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
} from 'kbar';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import { CV_PATH } from '../utils/constants';
import toast from 'react-hot-toast';

const RenderResults = () => {
  const { results } = useMatches();
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="px-4 py-2 text-caption text-ink-500 dark:text-ink-300">{item}</div>
        ) : (
          <div
            className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer rounded-lg ${
              active ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-100' : 'text-ink-700 dark:text-ink-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon ? <span className="text-base">{item.icon}</span> : null}
              <div>
                <div className="text-sm font-semibold">{item.name}</div>
                {item.subtitle ? (
                  <div className="text-xs text-ink-500 dark:text-ink-300">{item.subtitle}</div>
                ) : null}
              </div>
            </div>
            {item.shortcut?.length ? (
              <div className="flex items-center gap-1">
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className="rounded border border-ink-200/70 bg-white/70 px-1.5 py-0.5 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  );
};

const InnerProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isTurkish, toggleLanguage } = useLanguage();
  const { isDark, toggleDarkMode } = useDarkMode();

  const actions = useMemo(
    () => [
      {
        id: 'home',
        name: isTurkish ? 'Ana Sayfa' : 'Home',
        shortcut: ['g', 'h'],
        keywords: 'home anasayfa start',
        section: isTurkish ? 'Gezinme' : 'Navigation',
        perform: () => navigate('/'),
      },
      {
        id: 'web',
        name: isTurkish ? 'Web Geliştirme' : 'Web Development',
        shortcut: ['g', 'w'],
        keywords: 'web frontend react',
        section: isTurkish ? 'Gezinme' : 'Navigation',
        perform: () => navigate('/web'),
      },
      {
        id: 'android',
        name: isTurkish ? 'Android' : 'Android',
        shortcut: ['g', 'a'],
        keywords: 'android mobile kotlin',
        section: isTurkish ? 'Gezinme' : 'Navigation',
        perform: () => navigate('/android'),
      },
      {
        id: 'cyber',
        name: isTurkish ? 'Siber Güvenlik' : 'Cybersecurity',
        shortcut: ['g', 'c'],
        keywords: 'cybersecurity güvenlik security',
        section: isTurkish ? 'Gezinme' : 'Navigation',
        perform: () => navigate('/cybersecurity'),
      },
      {
        id: 'data',
        name: isTurkish ? 'Veri Bilimi' : 'Data Science',
        shortcut: ['g', 'd'],
        keywords: 'data science veri ml deep learning',
        section: isTurkish ? 'Gezinme' : 'Navigation',
        perform: () => navigate('/data-science'),
      },
      {
        id: 'toggle-dark',
        name: isDark ? (isTurkish ? 'Açık Tema' : 'Light Theme') : isTurkish ? 'Koyu Tema' : 'Dark Theme',
        keywords: 'theme dark light tema',
        shortcut: ['t'],
        section: isTurkish ? 'Aksiyonlar' : 'Actions',
        perform: () => {
          toggleDarkMode();
          toast.success(
            isDark ? (isTurkish ? 'Açık tema' : 'Light theme') : isTurkish ? 'Koyu tema' : 'Dark theme',
          );
        },
      },
      {
        id: 'toggle-language',
        name: isTurkish ? 'English' : 'Türkçe',
        keywords: 'language dil tr en',
        shortcut: ['l'],
        section: isTurkish ? 'Aksiyonlar' : 'Actions',
        perform: () => {
          toggleLanguage();
        },
      },
      {
        id: 'download-cv',
        name: isTurkish ? 'CV İndir' : 'Download CV',
        keywords: 'cv resume download indir',
        section: isTurkish ? 'Aksiyonlar' : 'Actions',
        perform: () => {
          const link = document.createElement('a');
          link.href = CV_PATH;
          link.download = '';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
      },
      {
        id: 'github',
        name: 'GitHub',
        keywords: 'github profile repos',
        section: isTurkish ? 'Bağlantılar' : 'Links',
        perform: () => window.open('https://github.com/MertSoylu', '_blank', 'noopener'),
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        keywords: 'linkedin profile',
        section: isTurkish ? 'Bağlantılar' : 'Links',
        perform: () => window.open('https://www.linkedin.com/in/mert-soylu-b8b6a1341/', '_blank', 'noopener'),
      },
    ],
    [navigate, isTurkish, isDark, toggleDarkMode, toggleLanguage],
  );

  return <InnerKBar actions={actions}>{children}</InnerKBar>;
};

const InnerKBar = ({ actions, children }) => (
  <KBarProvider actions={actions}>
    {children}
    <KBarPortal>
      <KBarPositioner className="z-[2000] bg-black/40 backdrop-blur-sm">
        <KBarAnimator className="w-full max-w-xl overflow-hidden rounded-lg border border-ink-200/70 bg-white shadow-elevation dark:border-white/10 dark:bg-ink-900">
          <KBarSearch className="w-full border-b border-ink-200/70 bg-transparent px-5 py-4 text-base text-ink-900 outline-none placeholder-ink-400 dark:border-white/10 dark:text-white dark:placeholder-ink-400" />
          <div className="p-2 max-h-96 overflow-y-auto">
            <RenderResults />
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  </KBarProvider>
);

export const CommandPaletteProvider = ({ children }) => <InnerProvider>{children}</InnerProvider>;

export default CommandPaletteProvider;
