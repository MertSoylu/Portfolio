import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiCollection, HiExternalLink, HiStar, HiX, HiBookOpen, HiCode, HiShieldCheck } from 'react-icons/hi';
import { HiDevicePhoneMobile } from 'react-icons/hi2';
import { clearRateLimitState, fetchGitHubRepos, getGitHubProfileUrl } from '../utils/githubApi';
import { FALLBACK_PROJECTS } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import SectionHeader from './home/SectionHeader';
import SpotlightCard from './ui/SpotlightCard';
import CardMarquee from './ui/CardMarquee';

const chipClass = 'rounded-full border border-line/12 bg-surface2 px-2.5 py-1 text-xs font-medium text-muted';

const ProjectModal = ({ project, onClose, isTurkish }) => {
  const dialogRef = useRef(null);
  const titleId = 'project-modal-title';

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;

    const focusables = Array.from(
      node.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    );
    focusables[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', handleKeyDown);
    return () => node.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-fg/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line/12 bg-surface shadow-lift"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-line/10 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-muted transition-colors hover:bg-surface2 hover:text-fg"
            aria-label={isTurkish ? 'Modalı kapat' : 'Close modal'}
          >
            <HiX className="h-5 w-5" />
          </button>
          {project.language && <span className={`mb-3 inline-flex ${chipClass}`}>{project.language}</span>}
          <h3 id={titleId} className="pr-10 text-h3 text-fg">
            {project.name}
          </h3>
          {project.full_name && <p className="mt-1 text-sm text-muted">{project.full_name}</p>}
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line/10 bg-surface2 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Stars</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-fg">
                <HiStar className="text-accent" />
                {project.stargazers_count ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-line/10 bg-surface2 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {isTurkish ? 'Fork' : 'Forks'}
              </p>
              <p className="mt-2 text-sm font-semibold text-fg">{project.forks_count ?? 0}</p>
            </div>
            <div className="rounded-xl border border-line/10 bg-surface2 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {isTurkish ? 'Güncel' : 'Updated'}
              </p>
              <p className="mt-2 text-sm font-semibold text-fg">
                {project.updated_at
                  ? new Date(project.updated_at).toLocaleDateString(isTurkish ? 'tr-TR' : 'en-US')
                  : '-'}
              </p>
            </div>
          </div>

          <p className="text-body text-muted">
            {project.description ||
              (isTurkish ? 'Bu repo için açıklama eklenmemiş.' : 'No repository description available.')}
          </p>

          {Array.isArray(project.topics) && project.topics.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.topics.map((topic) => (
                <span key={topic} className={chipClass}>
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-line/10 px-6 py-4">
          <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <HiExternalLink className="h-4 w-4" />
            GitHub
          </a>
          <button type="button" onClick={onClose} className="btn-secondary">
            {isTurkish ? 'Kapat' : 'Close'}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
};

const ProjectCard = ({ project, isTurkish, index }) => {
  const iconMap = {
    Web: <HiCode className="h-5 w-5" />,
    Android: <HiDevicePhoneMobile className="h-5 w-5" />,
    Security: <HiShieldCheck className="h-5 w-5" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
    >
      <SpotlightCard spotlightColor="rgba(194, 86, 47, 0.10)" className="h-full">
        <div className="card card-hover flex h-full flex-col overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/10] overflow-hidden bg-surface2">
            {project.snapshotSrc ? (
              <img
                src={project.snapshotSrc}
                alt={`${project.title} ${isTurkish ? 'önizleme' : 'preview'}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-2xl font-semibold text-muted/40">{project.title}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 rounded-full bg-accent/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              {project.category}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                {iconMap[project.category] || <HiCode className="h-5 w-5" />}
              </span>
              <h3 className="font-display text-lg font-semibold text-fg">{project.title}</h3>
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                {project.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted line-clamp-2 flex-1">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line/12 bg-surface2 px-2 py-0.5 text-[10px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              {project.caseStudyPath && (
                <Link
                  to={project.caseStudyPath}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition-colors hover:text-accent-strong"
                >
                  <HiBookOpen className="h-3.5 w-3.5" />
                  Case Study
                </Link>
              )}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-fg"
              >
                <HiExternalLink className="h-3.5 w-3.5" />
                {isTurkish ? 'Aç' : 'Open'}
              </a>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

const RepoCard = ({ repo, onOpen }) => (
  <SpotlightCard spotlightColor="rgba(194, 86, 47, 0.10)" className="h-full">
    <button
      type="button"
      onClick={() => onOpen(repo)}
      className="card card-hover flex h-full w-full flex-col p-4 sm:p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <h4 className="min-w-0 break-words text-h4 text-fg">{repo.name}</h4>
        {repo.language && <span className={`shrink-0 ${chipClass}`}>{repo.language}</span>}
      </div>
      <p className="mb-3 line-clamp-2 text-body-sm text-muted flex-1">
        {repo.description || 'No description available.'}
      </p>
      <div className="flex items-center justify-between text-xs font-medium text-muted">
        <span className="inline-flex items-center gap-1">
          <HiStar className="text-accent" />
          {repo.stargazers_count ?? 0}
        </span>
        <span>{repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : ''}</span>
      </div>
    </button>
  </SpotlightCard>
);

const Projects = () => {
  const { isTurkish } = useLanguage();
  const [repos, setRepos] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeProject, setActiveProject] = useState(null);

  const featuredProjects = useMemo(
    () => [
      {
        id: 'mnemosyne',
        title: 'Mnemosyne',
        url: 'https://m-nemosyne.live',
        caseStudyPath: '/case-study/mnemosyne',
        category: 'Web',
        status: isTurkish ? 'Canlı' : 'Live',
        snapshotSrc: '/previews/mnemosyne-live.png',
        description: isTurkish
          ? 'Konum bazlı anıları harita ve zaman katmanlarıyla sunan canlı web uygulaması.'
          : 'A live web app for location-based memories, built around maps and time layers.',
        tags: [
          'React',
          'PWA',
          isTurkish ? 'Konum' : 'Location',
          isTurkish ? 'Zaman katmanları' : 'Time layers',
        ],
      },
      {
        id: 'typesprint',
        title: 'TypeSprint',
        url: 'https://typesprint.online',
        caseStudyPath: '/case-study/typesprint',
        category: 'Web',
        status: isTurkish ? 'Canlı' : 'Live',
        snapshotSrc: '/previews/typesprint-live.png',
        description: isTurkish
          ? 'Yazma hızını doğrulukla ölçen, çok dilli kelime havuzlu WPM uygulaması.'
          : 'A typing-speed app built around accuracy and multilingual word pools.',
        tags: ['JavaScript', 'WPM', isTurkish ? 'Çok dilli' : 'Multilingual', 'Leaderboard'],
      },
      {
        id: 'walkkittie',
        title: 'WalkKittie',
        url: 'https://play.google.com/store/apps/details?id=com.mert.paticat',
        caseStudyPath: '/case-study/walkkittie',
        category: 'Android',
        status: 'Google Play',
        snapshotSrc: '/previews/walkkittie.png',
        description: isTurkish
          ? "Adım sayacı, su takibi ve piksel pet bakımını birleştiren, Google Play'de yayında bir Android uygulaması."
          : 'A Google Play Android app combining step tracking, water tracking, and pixel-pet care.',
        tags: ['Kotlin', 'Jetpack Compose', 'Material 3', isTurkish ? 'Pet' : 'Pet'],
      },
      {
        id: 'msscan',
        title: 'msscan',
        url: 'https://github.com/MertSoylu/msscan',
        caseStudyPath: '/case-study/msscan',
        category: 'Security',
        status: 'GitHub',
        snapshotSrc: null,
        description: isTurkish
          ? 'XSS, SQLi, CSRF, header ve subdomain kontrolleri için async Python CLI güvenlik tarayıcısı.'
          : 'An async Python CLI security scanner for XSS, SQLi, CSRF, headers, SSRF, and subdomains.',
        tags: ['Python', 'CLI', 'Async', isTurkish ? 'Raporlama' : 'Reports'],
      },
    ],
    [isTurkish],
  );

  useEffect(() => {
    const load = async () => {
      setStatus('loading');
      try {
        const nextRepos = await fetchGitHubRepos();
        setRepos(nextRepos.length ? nextRepos : FALLBACK_PROJECTS);
        setStatus(nextRepos.length ? 'success' : 'fallback');
      } catch (error) {
        setRepos(FALLBACK_PROJECTS);
        setStatus('error');
        setErrorMessage(error?.message || 'GitHub repositories could not be loaded.');
      }
    };
    load();
  }, []);

  return (
    <section id="projects" className="relative px-5 py-12 sm:py-20 md:py-24">
      <div className="container-wide max-w-screen-2xl">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeader
            kicker={isTurkish ? 'Çalışmalar' : 'Work'}
            kickerIcon={<HiCollection className="h-4 w-4" />}
            title={isTurkish ? 'Projeler' : 'Projects'}
            lead={
              isTurkish
                ? 'Canlı ürünler, yayınladığım mobil uygulamalar ve açık kaynak araçlar.'
                : 'Live products, published mobile apps, and open-source tools.'
            }
          />
        </div>

        <CardMarquee
          ariaLabel={isTurkish ? 'Öne çıkan projeler' : 'Featured projects'}
          direction="right"
          speed={34}
          gapClassName="gap-4 sm:gap-5"
          itemClassName="w-[280px] sm:w-[340px]"
        >
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} isTurkish={isTurkish} index={index} />
          ))}
        </CardMarquee>

        <div className="mt-16">
          <div className="mx-auto w-full max-w-6xl border-t border-line/10 pt-10">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  {isTurkish ? 'Açık kaynak' : 'Open source'}
                </p>
                <h3 className="mt-1 text-h3 text-fg">
                  {isTurkish ? 'GitHub repoları' : 'GitHub repositories'}
                </h3>
              </div>
              <a
                href={getGitHubProfileUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-4 py-2 text-xs"
              >
                <HiExternalLink className="h-4 w-4" />
                GitHub
              </a>
            </div>

            {status === 'error' && (
              <div className="mb-4 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm text-fg">
                <p className="mb-3 font-semibold">
                  {isTurkish
                    ? 'GitHub akışı yüklenemedi; yedek liste gösteriliyor.'
                    : 'GitHub feed could not load; showing fallback list.'}
                </p>
                {errorMessage && <p className="mb-3 text-muted">{errorMessage}</p>}
                <button
                  type="button"
                  onClick={() => {
                    clearRateLimitState();
                    setStatus('loading');
                    setErrorMessage('');
                    fetchGitHubRepos()
                      .then((r) => {
                        setRepos(r.length ? r : FALLBACK_PROJECTS);
                        setStatus(r.length ? 'success' : 'fallback');
                      })
                      .catch((e) => {
                        setRepos(FALLBACK_PROJECTS);
                        setStatus('error');
                        setErrorMessage(e.message);
                      });
                  }}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  {isTurkish ? 'Tekrar dene' : 'Retry'}
                </button>
              </div>
            )}
          </div>

          {status === 'loading' ? (
            <div className="mx-auto w-full max-w-6xl grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="card h-36 animate-pulse p-5">
                  <div className="mb-4 h-5 w-2/3 rounded-lg bg-surface2" />
                  <div className="mb-2 h-3 rounded-lg bg-surface2" />
                  <div className="h-3 w-4/5 rounded-lg bg-surface2" />
                </div>
              ))}
            </div>
          ) : (
            <CardMarquee
              ariaLabel={isTurkish ? 'GitHub repoları' : 'GitHub repositories'}
              direction="left"
              speed={30}
              gapClassName="gap-3 sm:gap-4"
              itemClassName="w-[260px] sm:w-[300px]"
            >
              {repos.slice(0, 8).map((repo) => (
                <RepoCard key={repo.id || repo.name} repo={repo} onOpen={setActiveProject} />
              ))}
            </CardMarquee>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
            isTurkish={isTurkish}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
