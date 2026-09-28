import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiCollection, HiExternalLink, HiSparkles, HiStar, HiX, HiBookOpen } from 'react-icons/hi';
import { FiGithub } from 'react-icons/fi';
import { clearRateLimitState, fetchGitHubRepos, getGitHubProfileUrl } from '../utils/githubApi';
import { FALLBACK_PROJECTS, FOREST_SITE_URL } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_LABELS, PROJECTS, caseStudyPath, pick } from '../data/projects';
import SectionHeader from './home/SectionHeader';
import CardMarquee from './ui/CardMarquee';
import Reveal from './ui/Reveal';
import SpotlightCard from './ui/SpotlightCard';
import { TerminalPreview } from './ui/DevicePreview';

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

const CardLinks = ({ project, isTurkish }) => (
  <div className="relative z-10 mt-auto flex items-center gap-4 pt-4 text-xs font-semibold">
    <span className="inline-flex items-center gap-1.5 text-accent">
      <HiBookOpen className="h-3.5 w-3.5" />
      Case study
    </span>
    {(project.liveUrl || project.githubUrl) && (
      <a
        href={project.liveUrl || project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
      >
        {project.liveUrl ? <HiExternalLink className="h-3.5 w-3.5" /> : <FiGithub className="h-3.5 w-3.5" />}
        {project.liveUrl ? pick(project.liveLabel, isTurkish) || (isTurkish ? 'Canlı' : 'Live') : 'GitHub'}
      </a>
    )}
  </div>
);

const CardThumb = ({ project, isTurkish }) => {
  const { preview } = project;
  if (preview.kind === 'terminal') {
    return (
      <TerminalPreview
        title={preview.title}
        lines={preview.lines}
        compact
        className="h-full rounded-none border-0 shadow-none"
      />
    );
  }
  return (
    <img
      src={preview.src}
      alt={`${project.title} ${isTurkish ? 'önizleme' : 'preview'}`}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
};

// Kartın tamamı case study'ye gider (başlıktaki linkin ::after'ı kartı kaplar);
// harici link z-10 ile bunun üstünde kalır.
const ProjectCard = ({ project, isTurkish, index }) => (
  <Reveal delay={(index % 3) * 0.06} className="h-full">
    <SpotlightCard spotlightColor="rgba(194, 86, 47, 0.10)" className="h-full">
      <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line/10 bg-surface2">
          <CardThumb project={project} isTurkish={isTurkish} />
          <span className="absolute bottom-3 left-3 rounded-full bg-canvas/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-fg backdrop-blur-sm">
            {pick(CATEGORY_LABELS[project.category], isTurkish)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg font-semibold text-fg">
              <Link
                to={caseStudyPath(project.id)}
                className="after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-accent"
              >
                {project.title}
              </Link>
            </h3>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
              {pick(project.status, isTurkish)}
            </span>
          </div>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">
            {pick(project.summary, isTurkish)}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={pick(tag, isTurkish)}
                className="rounded-full border border-line/12 bg-surface2 px-2 py-0.5 text-[10px] text-muted"
              >
                {pick(tag, isTurkish)}
              </span>
            ))}
          </div>
          <CardLinks project={project} isTurkish={isTurkish} />
        </div>
      </article>
    </SpotlightCard>
  </Reveal>
);

const FeaturedProject = ({ project, isTurkish }) => (
  <Reveal className="mb-5 sm:mb-6">
    <article className="card-prominent group relative grid overflow-hidden lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div className="relative flex items-center overflow-hidden border-b border-line/10 bg-[#0c0a07] lg:border-b-0 lg:border-r">
        <img
          src={project.preview.src}
          alt={`${project.title} ${isTurkish ? 'ana ekranı' : 'home screen'}`}
          loading="lazy"
          decoding="async"
          width={1200}
          height={748}
          className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
            <HiSparkles className="h-3 w-3" />
            {isTurkish ? 'Öne çıkan' : 'Featured'}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            {pick(CATEGORY_LABELS[project.category], isTurkish)} · {pick(project.status, isTurkish)}
          </span>
        </div>

        <h3 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {project.title}
        </h3>
        <p className="mt-3 text-body text-muted">{pick(project.summary, isTurkish)}</p>

        {project.highlights && (
          <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-line/10 py-4">
            {project.highlights.map((item) => (
              <div key={item.value} className="flex flex-col">
                <dt className="order-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {pick(item.label, isTurkish)}
                </dt>
                <dd className="order-1 font-display text-xl font-semibold text-fg sm:text-2xl">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className={chipClass}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <Link to={caseStudyPath(project.id)} className="btn-primary px-4 py-2 text-sm">
            <HiBookOpen className="h-4 w-4" />
            Case study
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-4 py-2 text-sm"
            >
              <HiExternalLink className="h-4 w-4" />
              {isTurkish ? 'Site' : 'Website'}
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-4 py-2 text-sm"
            >
              <FiGithub className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  </Reveal>
);

const RepoCard = ({ repo, onOpen, isTurkish }) => (
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
        {repo.description || (isTurkish ? 'Açıklama eklenmemiş.' : 'No description available.')}
      </p>
      <div className="flex items-center justify-between text-xs font-medium text-muted">
        <span className="inline-flex items-center gap-1">
          <HiStar className="text-accent" />
          {repo.stargazers_count ?? 0}
        </span>
        <span>
          {repo.updated_at ? new Date(repo.updated_at).toLocaleDateString(isTurkish ? 'tr-TR' : 'en-US') : ''}
        </span>
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
  const featured = PROJECTS.find((project) => project.featured);
  const others = PROJECTS.filter((project) => project !== featured);

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

        <div className="mx-auto w-full max-w-6xl">
          {featured && <FeaturedProject project={featured} isTurkish={isTurkish} />}
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((project, index) => (
              <ProjectCard key={project.id} project={project} isTurkish={isTurkish} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="mx-auto w-full max-w-6xl border-t border-line/10 pt-10">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  {isTurkish ? 'Açık kaynak' : 'Open source'}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h3 className="text-h3 text-fg">{isTurkish ? 'GitHub repoları' : 'GitHub repositories'}</h3>
                  <Reveal
                    as="a"
                    href={FOREST_SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    delay={0.05}
                    className="group btn-secondary px-4 py-2 text-xs"
                    aria-label={isTurkish ? 'cv-orman 3D ormanını aç' : 'Open cv-orman 3D forest'}
                  >
                    <HiSparkles className="h-4 w-4 text-accent transition-transform duration-300 group-hover:rotate-12" />
                    {isTurkish ? '3D orman' : '3D forest'}
                    <HiExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Reveal>
                </div>
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
                <RepoCard
                  key={repo.id || repo.name}
                  repo={repo}
                  onOpen={setActiveProject}
                  isTurkish={isTurkish}
                />
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
