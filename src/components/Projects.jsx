import { Link } from 'react-router-dom';
import { HiArrowRight, HiExternalLink, HiStar } from 'react-icons/hi';
import { FiGithub } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_LABELS, PROJECTS, UI_COPY, caseStudyPath, pick } from '../data/projects';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { FALLBACK_PROJECTS, FOREST_SITE_URL } from '../utils/constants';
import { getGitHubProfileUrl } from '../utils/githubApi';
import SectionHeader from './home/SectionHeader';
import { ProjectPreview, TerminalPreview } from './ui/DevicePreview';
import NewTabNote from './ui/NewTabNote';
import Reveal from './ui/Reveal';

const MAX_REPOS = 6;

// The UI never shows GitHub's raw (English) error text: it maps the status to a bilingual message.
const githubErrorText = (error, isTurkish) => {
  const status = error?.status;
  if (status === 403 || status === 429) {
    return isTurkish
      ? 'GitHub istek sınırına ulaşıldı. Biraz sonra tekrar dene.'
      : 'GitHub rate limit reached. Try again in a little while.';
  }
  if (status >= 500) {
    return isTurkish
      ? 'GitHub şu anda geçici olarak kullanılamıyor.'
      : 'GitHub is temporarily unavailable right now.';
  }
  return isTurkish ? 'GitHub depoları yüklenemedi.' : 'GitHub repositories could not be loaded.';
};

// 6-column grid on lg: a card spans 2 columns, so 3 per row. A short last row is stretched to fill it
// (two cards span 3, a lone card spans 6); on md (2 columns) a lone last card spans both columns.
const LG_SPAN = { 2: 'lg:col-span-2', 3: 'lg:col-span-3', 6: 'lg:col-span-6' };
const MD_SPAN = { 1: 'md:col-span-1', 2: 'md:col-span-2' };

const gridSpan = (index, count) => {
  const remainder = count % 3;
  const lg = remainder && index >= count - remainder ? 6 / remainder : 2;
  const md = count % 2 === 1 && index === count - 1 ? 2 : 1;
  return `${MD_SPAN[md]} ${LG_SPAN[lg]}`;
};

// Stretched link: the title's ::after covers the whole card, so the card is one big target while the
// accessible name stays the project title. The focus ring is drawn on the pseudo-element.
const stretchedLink =
  "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent";

const FeaturedProject = ({ project, isTurkish }) => {
  const liveLabel = pick(project.liveLabel, isTurkish) || pick(UI_COPY.liveSite, isTurkish);

  return (
    <Reveal>
      <article className="card ticks grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0 self-center">
          <ProjectPreview project={project} />
        </div>

        <div className="flex min-w-0 flex-col lg:py-2">
          <p className="label">
            {pick(CATEGORY_LABELS[project.category], isTurkish)} · {pick(project.status, isTurkish)}
          </p>

          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            <Link to={caseStudyPath(project.id)} className="transition-colors hover:text-accent">
              {project.title}
            </Link>
          </h3>
          <p className="mt-4 text-base text-muted">{pick(project.summary, isTurkish)}</p>

          {project.highlights && (
            <dl className="mt-6 divide-y divide-line/10 border-y border-line/10 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {project.highlights.map((item) => (
                <div
                  key={item.value}
                  className="flex items-baseline justify-between gap-4 py-3 sm:flex-col-reverse sm:items-start sm:justify-end sm:gap-1 sm:px-4 sm:py-4 sm:first:pl-0 sm:last:pr-0"
                >
                  <dt className="label">{pick(item.label, isTurkish)}</dt>
                  <dd className="font-mono text-lg font-medium tabular-nums sm:text-xl">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li key={pick(tag, isTurkish)} className="tag">
                {pick(tag, isTurkish)}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            <Link to={caseStudyPath(project.id)} className="btn-primary">
              {pick(UI_COPY.caseStudy, isTurkish)}
              <HiArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                {liveLabel}
                <HiExternalLink aria-hidden="true" className="h-4 w-4" />
                <NewTabNote />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <FiGithub aria-hidden="true" className="h-4 w-4" />
                GitHub
                <NewTabNote />
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
};

// A fixed-height window onto the preview. Frames taller than the window (phone, browser chrome) are cropped
// at the bottom, so every card in a row lines up whatever its width.
const CardPreview = ({ project }) => {
  const { preview } = project;

  return (
    <div className="relative h-56 overflow-hidden border-b border-line/10 bg-surface2">
      {preview.kind === 'terminal' ? (
        <TerminalPreview
          title={preview.title || project.title}
          lines={preview.lines}
          compact
          className="h-full !rounded-none !border-0"
        />
      ) : (
        <div className="px-4 pt-4">
          <ProjectPreview project={project} />
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project, isTurkish, index, span }) => (
  <Reveal as="li" delay={(index % 3) * 0.06} className={`min-w-0 ${span}`}>
    <article className="card-interactive group relative flex h-full flex-col overflow-hidden">
      <CardPreview project={project} />

      <div className="flex flex-1 flex-col p-5">
        <p className="label flex items-center justify-between gap-3">
          <span>{pick(CATEGORY_LABELS[project.category], isTurkish)}</span>
          <span className="text-accent">{pick(project.status, isTurkish)}</span>
        </p>
        <h3 className="text-h3 mt-3">
          <Link to={caseStudyPath(project.id)} className={stretchedLink}>
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted">{pick(project.summary, isTurkish)}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {project.tags.slice(0, 4).map((tag) => (
            <li key={pick(tag, isTurkish)} className="tag">
              {pick(tag, isTurkish)}
            </li>
          ))}
        </ul>
      </div>
    </article>
  </Reveal>
);

const RepoCard = ({ repo, isTurkish, dateFormat }) => {
  const hasStars = typeof repo.stargazers_count === 'number';
  const stars = repo.stargazers_count;

  return (
    <li className="min-w-0">
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="card-interactive flex h-full flex-col p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-h4 min-w-0 break-words">{repo.name}</h4>
          {repo.language && <span className="tag shrink-0">{repo.language}</span>}
        </div>
        <p className="mt-2 text-sm text-muted">
          {pick(repo.description, isTurkish) ||
            (isTurkish ? 'Açıklama eklenmemiş.' : 'No description available.')}
        </p>
        {(hasStars || repo.updated_at) && (
          <div className="micro mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 text-muted">
            {hasStars && (
              <span className="inline-flex items-center gap-1">
                <HiStar aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                {stars} {isTurkish ? 'yıldız' : stars === 1 ? 'star' : 'stars'}
              </span>
            )}
            {repo.updated_at && (
              <span>
                {isTurkish ? 'Güncelleme' : 'Updated'}{' '}
                <time dateTime={repo.updated_at}>{dateFormat.format(new Date(repo.updated_at))}</time>
              </span>
            )}
          </div>
        )}
        <NewTabNote />
      </a>
    </li>
  );
};

const RepoSkeletons = () => (
  <div aria-hidden="true" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="card h-36 p-5 motion-safe:animate-pulse">
        <div className="h-5 w-2/3 rounded bg-surface2" />
        <div className="mt-4 h-3 rounded bg-surface2" />
        <div className="mt-2 h-3 w-4/5 rounded bg-surface2" />
      </div>
    ))}
  </div>
);

const Projects = () => {
  const { isTurkish } = useLanguage();
  const { status, repos, error, retry } = useGitHubRepos();
  const t = (tr, en) => (isTurkish ? tr : en);

  const featured = PROJECTS.find((project) => project.featured);
  const others = PROJECTS.filter((project) => project !== featured);

  const failed = status === 'error';
  const visibleRepos = (status === 'success' && repos.length > 0 ? repos : FALLBACK_PROJECTS).slice(
    0,
    MAX_REPOS,
  );
  const dateFormat = new Intl.DateTimeFormat(isTurkish ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-20 md:py-28">
      <div className="container-site">
        <SectionHeader
          id="projects-title"
          index="02"
          label={t('Projeler', 'Projects')}
          title={t('Yayında olan işler.', 'Work that is live.')}
          lead={t(
            'Canlı ürünler, yayınladığım mobil uygulamalar ve açık kaynak araçlar.',
            'Live products, published mobile apps, and open-source tools.',
          )}
        />

        {featured && <FeaturedProject project={featured} isTurkish={isTurkish} />}

        <ul className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 md:grid-cols-2 lg:grid-cols-6">
          {others.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isTurkish={isTurkish}
              index={index}
              span={gridSpan(index, others.length)}
            />
          ))}
        </ul>

        <div className="mt-16 border-t border-line/10 pt-8 sm:mt-20">
          <Reveal className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label">{t('Açık kaynak', 'Open source')}</p>
              <h3 className="text-h3 mt-2">{t('GitHub depoları', 'GitHub repositories')}</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={getGitHubProfileUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <FiGithub aria-hidden="true" className="h-4 w-4" />
                {t('GitHub profilim', 'GitHub profile')}
                <NewTabNote />
              </a>
              <a href={FOREST_SITE_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                {t('3D orman', '3D forest')}
                <HiExternalLink aria-hidden="true" className="h-4 w-4" />
                <NewTabNote />
              </a>
            </div>
          </Reveal>

          {failed && (
            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-line/15 bg-surface2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p role="status" className="text-sm">
                {githubErrorText(error, isTurkish)}{' '}
                <span className="text-muted">
                  {t('Yedek liste gösteriliyor.', 'Showing a fallback list.')}
                </span>
              </p>
              <button type="button" onClick={retry} className="btn-secondary shrink-0">
                {t('Tekrar dene', 'Retry')}
              </button>
            </div>
          )}

          {status === 'loading' ? (
            <>
              <p role="status" className="sr-only">
                {t('GitHub depoları yükleniyor', 'Loading GitHub repositories')}
              </p>
              <RepoSkeletons />
            </>
          ) : (
            <Reveal
              as="ul"
              aria-label={t('GitHub depoları', 'GitHub repositories')}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {visibleRepos.map((repo) => (
                <RepoCard
                  key={repo.id || repo.name}
                  repo={repo}
                  isTurkish={isTurkish}
                  dateFormat={dateFormat}
                />
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
