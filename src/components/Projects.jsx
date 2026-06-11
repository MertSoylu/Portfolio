import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HiBookOpen, HiExternalLink, HiRefresh, HiStar, HiX } from 'react-icons/hi';
import { clearRateLimitState, fetchGitHubRepos, getGitHubProfileUrl } from '../utils/githubApi';
import { FALLBACK_PROJECTS } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import KineticHeadline from './motion/KineticHeadline';
import ScrollScene from './motion/ScrollScene';
import SitePreview from './SitePreview';

const getLanguageStyle = (language) => {
  const key = (language || '').toLowerCase();
  if (key.includes('typescript'))
    return 'border-cyan-300/50 bg-cyan-50 text-cyan-700 dark:border-cyan-300/25 dark:bg-cyan-300/10 dark:text-cyan-200';
  if (key.includes('javascript'))
    return 'border-yellow-300/60 bg-yellow-50 text-yellow-700 dark:border-yellow-300/25 dark:bg-yellow-300/10 dark:text-yellow-200';
  if (key.includes('kotlin'))
    return 'border-purple-300/50 bg-purple-50 text-purple-700 dark:border-purple-300/25 dark:bg-purple-300/10 dark:text-purple-200';
  if (key.includes('python'))
    return 'border-emerald-300/50 bg-emerald-50 text-emerald-700 dark:border-emerald-300/25 dark:bg-emerald-300/10 dark:text-emerald-200';
  return 'border-ink-200/70 bg-white/50 text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200';
};

const ProjectModal = ({ project, onClose, isTurkish }) => {
  const dialogRef = useRef(null);
  const titleId = 'project-modal-title';

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return undefined;

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
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink-900/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-white/10 bg-white text-ink-900 shadow-elevation dark:bg-ink-900 dark:text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-ink-200/70 px-6 py-5 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-200 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={isTurkish ? 'Modalı kapat' : 'Close modal'}
          >
            <HiX className="h-5 w-5" />
          </button>
          {project.language && (
            <span
              className={`mb-3 inline-flex rounded-lg border px-3 py-1 text-xs font-extrabold ${getLanguageStyle(project.language)}`}
            >
              {project.language}
            </span>
          )}
          <h3 id={titleId} className="pr-10 text-h3">
            {project.name}
          </h3>
          {project.full_name && (
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{project.full_name}</p>
          )}
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <div className="card-flat p-4">
              <p className="text-caption text-ink-500 dark:text-ink-300">Stars</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-extrabold">
                <HiStar className="text-accent-500" />
                {project.stargazers_count ?? 0}
              </p>
            </div>
            <div className="card-flat p-4">
              <p className="text-caption text-ink-500 dark:text-ink-300">{isTurkish ? 'Fork' : 'Forks'}</p>
              <p className="mt-2 text-sm font-extrabold">{project.forks_count ?? 0}</p>
            </div>
            <div className="card-flat p-4">
              <p className="text-caption text-ink-500 dark:text-ink-300">
                {isTurkish ? 'Güncel' : 'Updated'}
              </p>
              <p className="mt-2 text-sm font-extrabold">
                {project.updated_at
                  ? new Date(project.updated_at).toLocaleDateString(isTurkish ? 'tr-TR' : 'en-US')
                  : '-'}
              </p>
            </div>
          </div>

          <p className="text-body text-ink-600 dark:text-ink-200">
            {project.description ||
              (isTurkish ? 'Bu repo için açıklama eklenmemiş.' : 'No repository description available.')}
          </p>

          {Array.isArray(project.topics) && project.topics.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-lg border border-ink-200/70 bg-white/50 px-2.5 py-1 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-ink-200/70 px-6 py-4 dark:border-white/10">
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

const FeaturedProjectNav = ({ projects, isTurkish }) => (
  <div className="mb-6 md:hidden">
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-caption text-cyan-700 dark:text-cyan-200">
        {isTurkish ? 'Seçili ürünler' : 'Selected products'}
      </p>
      <span className="text-[11px] font-extrabold uppercase text-ink-400 dark:text-ink-300">
        {isTurkish ? 'Hızlı geçiş' : 'Quick jump'}
      </span>
    </div>
    <nav
      className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label={isTurkish ? 'Öne çıkan projeler' : 'Featured projects'}
    >
      <div className="flex min-w-max snap-x gap-2">
        {projects.map((project, index) => (
          <a
            key={project.id}
            href={`#project-${project.id}`}
            className="inline-flex min-h-[42px] snap-start items-center gap-2 rounded-lg border border-ink-200/70 bg-white/75 px-3 py-2 text-xs font-extrabold text-ink-700 shadow-soft backdrop-blur-xl dark:border-white/15 dark:bg-ink-800/85 dark:text-ink-100"
          >
            <span className="text-cyan-700 dark:text-cyan-200">{String(index + 1).padStart(2, '0')}</span>
            {project.title}
          </a>
        ))}
      </div>
    </nav>
  </div>
);

const FeaturedProjectCard = ({ project, index, isTurkish }) => (
  <motion.article
    id={`project-${project.id}`}
    initial={{ opacity: 0.82, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.55, delay: index * 0.08 }}
    whileHover={{ y: -6 }}
    className="card-prominent card-border-glow featured-project-card grid scroll-mt-24 gap-3 overflow-hidden p-2.5 sm:scroll-mt-28 sm:gap-4 sm:p-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-5"
  >
    <SitePreview
      title={project.title}
      url={project.url}
      type={project.previewType}
      variant={project.variant}
      terminalContent={project.terminalContent}
      expandable={false}
      showActions={false}
      snapshotSrc={project.snapshotSrc}
      forceSnapshot={project.forceSnapshot}
      livePreview={project.previewType === 'web' && !project.livePreviewBlocked}
    />
    <div className="flex flex-col p-1.5 sm:p-2">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-lg border px-3 py-1 text-xs font-extrabold ${project.badgeClass}`}>
          {project.category}
        </span>
        <span className="rounded-lg border border-ink-200/70 bg-white/50 px-3 py-1 text-xs font-extrabold text-ink-500 dark:border-white/10 dark:bg-white/10 dark:text-ink-300">
          {project.status}
        </span>
      </div>

      <h3 className="mb-2 text-[1.45rem] font-extrabold leading-tight text-ink-900 dark:text-white sm:mb-3 sm:text-h3">
        {project.title}
      </h3>
      <p className="mb-3 text-sm leading-relaxed text-ink-600 dark:text-ink-200 sm:mb-4 sm:text-body-sm">
        {project.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2 sm:mb-5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-ink-200/70 bg-white/50 px-2.5 py-1 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        {project.caseStudyPath && (
          <Link to={project.caseStudyPath} className="btn-primary min-h-[44px] px-3 py-2 text-xs sm:px-4">
            <HiBookOpen className="h-4 w-4" />
            Case Study
          </Link>
        )}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary min-h-[44px] px-3 py-2 text-xs sm:px-4"
        >
          <HiExternalLink className="h-4 w-4" />
          {isTurkish ? 'Aç' : 'Open'}
        </a>
      </div>
    </div>
  </motion.article>
);

const RepoCard = ({ repo, onOpen }) => (
  <motion.button
    type="button"
    onClick={() => onOpen(repo)}
    initial={{ opacity: 0.86, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-30px' }}
    whileHover={{ y: -6 }}
    className="card-raised card-hover card-border-glow flex h-full flex-col p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
  >
    <div className="mb-3 flex items-start justify-between gap-3">
      <h4 className="min-w-0 break-words text-h4 text-ink-900 dark:text-white">{repo.name}</h4>
      {repo.language && (
        <span
          className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-extrabold ${getLanguageStyle(repo.language)}`}
        >
          {repo.language}
        </span>
      )}
    </div>
    <p className="mb-4 line-clamp-3 text-body-sm text-ink-600 dark:text-ink-200">
      {repo.description || 'No description available.'}
    </p>
    <div className="mt-auto flex items-center justify-between text-xs font-bold text-ink-500 dark:text-ink-300">
      <span className="inline-flex items-center gap-1">
        <HiStar className="text-accent-500" />
        {repo.stargazers_count ?? 0}
      </span>
      <span>{repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : ''}</span>
    </div>
  </motion.button>
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
        previewType: 'web',
        variant: 'memory',
        snapshotSrc: '/previews/mnemosyne-live.png',
        forceSnapshot: true,
        badgeClass:
          'border-cyan-300/50 bg-cyan-50 text-cyan-700 dark:border-cyan-300/25 dark:bg-cyan-300/10 dark:text-cyan-200',
        description: isTurkish
          ? 'Konum bazlı hafıza fikrini web arayüzüne taşıyan, harita ve zaman katmanları etrafında kurgulanmış canlı uygulama.'
          : 'A live web app that turns location-based memory into a product surface built around maps and time layers.',
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
        previewType: 'web',
        variant: 'typing',
        badgeClass:
          'border-accent-300/50 bg-accent-50 text-accent-700 dark:border-accent-300/25 dark:bg-accent-300/10 dark:text-accent-200',
        description: isTurkish
          ? 'Yazma hızını doğrulukla birlikte ölçen; çok dilli kelime havuzu ve skor mantığıyla çalışan WPM deneyimi.'
          : 'A typing-speed experience focused on accuracy, multilingual word pools, and fair score tracking.',
        tags: ['JavaScript', 'WPM', isTurkish ? 'Çok dilli' : 'Multilingual', 'Leaderboard'],
      },
      {
        id: 'walkkittie',
        title: 'WalkKittie',
        url: 'https://play.google.com/store/apps/details?id=com.mert.paticat',
        caseStudyPath: '/case-study/walkkittie',
        category: 'Android',
        status: 'Google Play',
        previewType: 'mobile',
        variant: 'mobile',
        badgeClass:
          'border-purple-300/50 bg-purple-50 text-purple-700 dark:border-purple-300/25 dark:bg-purple-300/10 dark:text-purple-200',
        description: isTurkish
          ? 'Adım sayacı, su takibi ve sanal kedi bakımını birleştiren; Google Play’de yayında olan Android uygulaması.'
          : 'An Android app on Google Play combining step tracking, water tracking, and virtual pet care.',
        tags: ['Kotlin', 'Jetpack Compose', 'Material 3', isTurkish ? 'Sağlık' : 'Health'],
      },
      {
        id: 'msscan',
        title: 'msscan',
        url: 'https://github.com/MertSoylu/msscan',
        caseStudyPath: '/case-study/msscan',
        category: 'Security',
        status: 'GitHub',
        previewType: 'terminal',
        variant: 'terminal',
        badgeClass:
          'border-ink-300/60 bg-ink-50 text-ink-700 dark:border-white/20 dark:bg-white/10 dark:text-white',
        description: isTurkish
          ? 'XSS, SQLi, CSRF, header ve subdomain kontrolleri için geliştirilen async Python CLI güvenlik tarayıcısı.'
          : 'An async Python CLI security scanner for XSS, SQLi, CSRF, headers, redirects, SSRF, and subdomains.',
        tags: ['Python', 'CLI', 'Async', isTurkish ? 'Raporlama' : 'Reports'],
      },
    ],
    [isTurkish],
  );

  const loadRepos = async ({ resetRateLimit = false } = {}) => {
    setStatus('loading');
    setErrorMessage('');
    if (resetRateLimit) clearRateLimitState();
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

  useEffect(() => {
    loadRepos();
  }, []);

  return (
    <section id="projects" className="relative px-4 py-16 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-16">
          <KineticHeadline
            as="h2"
            gradient
            className="section-title justify-center text-center"
            text={isTurkish ? 'Projeler' : 'Projects'}
          />
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-ink-600 dark:text-ink-200">
            {isTurkish
              ? 'Canlı ürünler, yayınlanmış mobil iş ve açık kaynak araçlar. Her kart problem, arayüz ve teknik karar odaklı.'
              : 'Live products, published mobile work, and open-source tools. Each card focuses on the problem, interface, and technical decisions.'}
          </p>
        </div>

        <FeaturedProjectNav projects={featuredProjects} isTurkish={isTurkish} />

        <div className="mb-5 flex items-center gap-3">
          <p className="text-caption text-accent-700 dark:text-accent-200">
            {isTurkish ? 'Ürün seçkisi' : 'Selected products'}
          </p>
          <div className="studio-rule flex-1" />
        </div>

        <ScrollScene className="space-y-4 sm:space-y-5">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} isTurkish={isTurkish} />
          ))}
        </ScrollScene>

        <div className="mt-16 border-t border-ink-200/70 pt-10 dark:border-white/10">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-caption text-cyan-700 dark:text-cyan-200">
                {isTurkish ? 'Açık kaynak akışı' : 'Open-source feed'}
              </p>
              <h3 className="mt-2 text-h2 text-ink-900 dark:text-white">
                {isTurkish ? 'Güncel public repo akışı' : 'Current public repository feed'}
              </h3>
              <p className="mt-2 max-w-xl text-body-sm text-ink-500 dark:text-ink-300">
                {isTurkish
                  ? 'Üstteki ürün kartları seçilmiş işler; burası GitHub API’den gelen canlı repo listesi.'
                  : 'The product cards above are curated; this stays as the live GitHub API repository list.'}
              </p>
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
            <div className="mb-4 rounded-lg border border-accent-300/50 bg-accent-50 p-4 text-sm text-accent-800 dark:border-accent-300/20 dark:bg-accent-300/10 dark:text-accent-100">
              <p className="mb-3 font-bold">
                {isTurkish
                  ? 'GitHub akışı yüklenemedi; yedek liste gösteriliyor.'
                  : 'GitHub feed could not load; showing fallback list.'}
              </p>
              {errorMessage && <p className="mb-3">{errorMessage}</p>}
              <button
                type="button"
                onClick={() => loadRepos({ resetRateLimit: true })}
                className="btn-outline px-4 py-2 text-xs"
              >
                <HiRefresh className="h-4 w-4" />
                {isTurkish ? 'Tekrar dene' : 'Retry'}
              </button>
            </div>
          )}

          {status === 'loading' ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="card-raised h-44 animate-pulse p-5">
                  <div className="mb-4 h-5 w-2/3 rounded-lg bg-ink-100 dark:bg-white/10" />
                  <div className="mb-2 h-3 rounded-lg bg-ink-100 dark:bg-white/10" />
                  <div className="h-3 w-4/5 rounded-lg bg-ink-100 dark:bg-white/10" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {repos.map((repo) => (
                <RepoCard key={repo.id || repo.name} repo={repo} onOpen={setActiveProject} />
              ))}
            </div>
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
