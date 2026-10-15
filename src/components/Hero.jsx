import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiDownload, HiMail } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { AREAS } from '../data/areas';
import { PROJECTS, caseStudyPath, pick } from '../data/projects';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { CV_LABEL, CV_PATH, HERO_ROLES, PERSONAL_INFO } from '../utils/constants';
import { isPlainLeftClick, scrollToSection } from '../utils/scroll';
import Reveal from './ui/Reveal';
import RotatingText from './RotatingText';

// "a React Developer" / "an Android Developer": the English role line is a sentence ("I'm …").
const withArticle = (role) => `${/^[aeiou]/i.test(role) ? 'an' : 'a'} ${role}`;

const Row = ({ label, children }) => (
  <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-x-4 border-t border-line/10 py-3 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
    <dt className="label">{label}</dt>
    <dd className="min-w-0 text-sm">{children}</dd>
  </div>
);

const areaLinkClass =
  'inline-flex min-h-11 items-center text-fg underline decoration-line/25 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent lg:min-h-8';

const Hero = () => {
  const { isTurkish } = useLanguage();
  const reduce = useReducedMotion();
  const { status, repos } = useGitHubRepos();
  const t = (tr, en) => (isTurkish ? tr : en);

  const roles = isTurkish ? HERO_ROLES.tr : HERO_ROLES.en.map(withArticle);
  const latest = PROJECTS.find((project) => project.featured) ?? PROJECTS[0];
  // The count row only exists once GitHub has answered with something.
  const repoCount = status === 'success' && repos.length > 0 ? repos.length : null;

  const jumpTo = (id) => (event) => {
    if (!isPlainLeftClick(event)) return;
    if (scrollToSection(id, reduce)) event.preventDefault();
  };

  return (
    <section aria-labelledby="hero-title" className="relative pb-8 pt-28 md:pb-10 md:pt-36">
      <div className="container-site grid items-start gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-7">
          <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-line/15 bg-surface px-3.5 py-2 text-sm">
              <span className="status-dot" aria-hidden="true" />
              {t('Uzaktan / hibrit işlere açığım', 'Open to remote / hybrid work')}
            </p>
            <p className="label">{PERSONAL_INFO.locationShort}</p>
          </Reveal>

          <Reveal as="h1" id="hero-title" delay={0.06} className="text-display mt-8">
            {PERSONAL_INFO.name}
          </Reveal>

          {/* Stable height whatever role is showing: the prefix always sits on its own row below sm, and the
              type steps down so the longest role ("Junior Full-Stack Geliştirici") still fits on one row. */}
          <Reveal
            as="p"
            delay={0.12}
            className="mt-6 flex flex-col items-start gap-2 text-[0.9375rem] text-muted min-[360px]:text-base sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 sm:text-xl"
          >
            <span>{t('Ben bir', "I'm")}</span>
            <RotatingText
              texts={roles}
              rotationInterval={3200}
              mainClassName="mark font-mono"
              splitLevelClassName="overflow-hidden pb-1"
              splitBy="characters"
              staggerDuration={0.012}
              staggerFrom="first"
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            />
          </Reveal>

          <Reveal as="p" delay={0.18} className="text-lead mt-6 max-w-xl">
            {t(
              'Web, Android, güvenlik ve yapay zekâ alanlarında çalışıyorum; fikirleri hızlı, okunur ve gerçekten çalışan arayüzlere dönüştürüyorum.',
              'I work across web, Android, security, and AI — turning ideas into fast, readable interfaces that actually ship.',
            )}
          </Reveal>

          <Reveal delay={0.24} className="mt-10 flex flex-wrap gap-3">
            <Link
              to={{ pathname: '/', hash: '#projects' }}
              onClick={jumpTo('projects')}
              className="btn-primary btn-lg w-full sm:w-auto"
            >
              {t('Projeleri gör', 'View projects')}
              <HiArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a href={CV_PATH} download className="btn-secondary btn-lg w-full sm:w-auto">
              <HiDownload aria-hidden="true" className="h-4 w-4" />
              {isTurkish ? CV_LABEL.tr : CV_LABEL.en}
            </a>
            <Link
              to={{ pathname: '/', hash: '#contact' }}
              onClick={jumpTo('contact')}
              className="btn-ghost btn-lg w-full sm:w-auto"
            >
              <HiMail aria-hidden="true" className="h-4 w-4" />
              {t('İletişim', 'Contact')}
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.18} className="min-w-0 lg:col-span-5 lg:mt-6">
          <aside aria-labelledby="hero-now" className="card ticks p-6 sm:p-7">
            <h2 id="hero-now" className="label mb-5 text-fg">
              {t('Şu an', 'Now')}
            </h2>
            <dl>
              <Row label={t('Son çıkan', 'Latest release')}>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link
                    to={caseStudyPath(latest.id)}
                    className="inline-flex min-h-11 items-center font-medium text-fg underline decoration-line/25 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent lg:min-h-8"
                  >
                    {latest.title}
                  </Link>
                  <span className="tag border-transparent bg-signal font-medium text-signal-fg">
                    {t('YENİ', 'NEW')}
                  </span>
                </span>
                <span className="micro block text-muted">
                  {latest.tags
                    .slice(0, 2)
                    .map((tag) => pick(tag, isTurkish))
                    .join(' · ')}
                </span>
              </Row>

              <Row label={t('Odak', 'Focus')}>
                <ul>
                  {AREAS.map((area) => (
                    <li key={area.id}>
                      <Link to={area.path} className={areaLinkClass}>
                        {pick(area.name, isTurkish)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Row>

              {repoCount !== null && (
                <Row label={t('Açık repo', 'Public repos')}>
                  <span className="font-mono tabular-nums">{repoCount}</span>
                </Row>
              )}

              <Row label={t('Konum', 'Based in')}>{pick(PERSONAL_INFO.location, isTurkish)}</Row>
            </dl>
          </aside>
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;
