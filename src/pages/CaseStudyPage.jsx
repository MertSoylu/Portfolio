import { Link, useParams } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiCode, HiExternalLink, HiPlay } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_LABELS, PROJECTS, caseStudyPath, getProject, pick } from '../data/projects';
import { CASE_STUDIES } from '../data/caseStudies';
import PageMeta from '../components/PageMeta';
import PageBackButton from '../components/ui/PageBackButton';
import Reveal from '../components/ui/Reveal';
import { ProjectPreview } from '../components/ui/DevicePreview';
import NotFoundPage from './NotFoundPage';

const chip = 'rounded-full border border-line/12 bg-surface2 px-2.5 py-1 text-xs font-medium text-muted';

// Metindeki `ters tırnaklı` parçaları satır içi kod olarak gösterir.
const withInlineCode = (text) =>
  text.split(/`([^`]+)`/).map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
        {part}
      </code>
    ) : (
      part
    ),
  );

const SectionTitle = ({ children }) => <h2 className="mb-4 text-h3 text-fg">{children}</h2>;

const CaseStudyNav = ({ currentId, isTurkish }) => (
  <nav className="card p-5" aria-label={isTurkish ? 'Diğer projeler' : 'Other projects'}>
    <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted">
      {isTurkish ? 'Diğer projeler' : 'Other projects'}
    </h2>
    <ul className="space-y-1">
      {PROJECTS.filter((project) => project.id !== currentId).map((project) => (
        <li key={project.id}>
          <Link
            to={caseStudyPath(project.id)}
            className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface2 hover:text-fg"
          >
            <span className="truncate">{project.title}</span>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent/80">
              {pick(CATEGORY_LABELS[project.category], isTurkish)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

const PrevNext = ({ currentId, isTurkish }) => {
  const index = PROJECTS.findIndex((project) => project.id === currentId);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const item = (project, direction) => (
    <Link
      to={caseStudyPath(project.id)}
      className={`card card-hover group flex flex-col gap-1 p-5 ${direction === 'next' ? 'text-right' : ''}`}
    >
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted ${
          direction === 'next' ? 'justify-end' : ''
        }`}
      >
        {direction === 'prev' && (
          <HiArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        )}
        {direction === 'prev' ? (isTurkish ? 'Önceki' : 'Previous') : isTurkish ? 'Sonraki' : 'Next'}
        {direction === 'next' && (
          <HiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        )}
      </span>
      <span className="font-display text-xl font-semibold text-fg">{project.title}</span>
    </Link>
  );

  return (
    <nav
      className="grid gap-3 sm:grid-cols-2"
      aria-label={isTurkish ? 'Proje gezinme' : 'Project navigation'}
    >
      {item(prev, 'prev')}
      {item(next, 'next')}
    </nav>
  );
};

const CaseStudyPage = () => {
  const { id } = useParams();
  const { isTurkish } = useLanguage();
  const project = getProject(id);
  const study = CASE_STUDIES[id];

  if (!project || !study) return <NotFoundPage />;

  const t = (value) => pick(value, isTurkish);
  const isPhone = project.preview?.kind === 'phone';
  const decisions = t(study.decisions) || [];
  const links = [
    project.liveUrl && {
      href: project.liveUrl,
      label: t(project.liveLabel) || (isTurkish ? 'Canlı site' : 'Live site'),
      icon: HiExternalLink,
      primary: true,
    },
    project.githubUrl && {
      href: project.githubUrl,
      label: isTurkish ? 'Kaynak kodu' : 'Source code',
      icon: HiCode,
      primary: !project.liveUrl,
    },
    ...(study.extraLinks || []).map((link) => ({ ...link, icon: HiExternalLink })),
  ].filter(Boolean);

  return (
    <div className="relative min-h-screen px-5 pb-20 pt-28 sm:pt-32">
      <PageMeta route={caseStudyPath(project.id)} />
      <div className="container-wide">
        <PageBackButton to="/#projects" className="mb-8" />

        <header
          className={`mb-10 grid items-center gap-8 sm:mb-12 lg:gap-12 ${
            isPhone ? 'lg:grid-cols-[minmax(0,1fr)_280px]' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]'
          }`}
        >
          <div>
            <Reveal as="div" className="mb-4">
              <span className="eyebrow text-accent">{t(CATEGORY_LABELS[project.category])} · Case study</span>
            </Reveal>
            <Reveal as="h1" delay={0.05} className="text-h1 text-fg">
              {project.title}
            </Reveal>
            <Reveal as="p" delay={0.1} className="mb-6 mt-4 max-w-2xl text-body-lg text-fg/80">
              {t(study.subtitle)}
            </Reveal>
            <Reveal delay={0.15} className="flex flex-wrap gap-3">
              {links.map(({ href, label, icon: Icon, primary }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${primary ? 'btn-primary' : 'btn-secondary'} px-4 py-2 text-sm`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </Reveal>
          </div>

          <Reveal delay={0.1} className="w-full">
            <ProjectPreview
              project={project}
              alt={`${project.title} ${isTurkish ? 'önizleme' : 'preview'}`}
              eager
            />
          </Reveal>
        </header>

        <dl className="mb-10 grid gap-3 sm:grid-cols-3">
          {study.facts.map((fact) => (
            <div key={t(fact.label)} className="card p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {t(fact.label)}
              </dt>
              <dd className="mt-2 text-sm font-semibold text-fg">{t(fact.value)}</dd>
            </div>
          ))}
        </dl>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0 space-y-6">
            <Reveal className="grid gap-5 md:grid-cols-2">
              <section className="card p-6">
                <SectionTitle>Problem</SectionTitle>
                <p className="text-body text-muted">{t(study.problem)}</p>
              </section>
              <section className="card p-6">
                <SectionTitle>{isTurkish ? 'Çözüm' : 'Solution'}</SectionTitle>
                <p className="text-body text-muted">{t(study.solution)}</p>
              </section>
            </Reveal>

            {study.video && (
              <Reveal as="section" className="card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-line/10 px-5 py-3 text-sm font-semibold text-fg">
                  <HiPlay className="h-4 w-4 text-accent" />
                  {isTurkish ? 'Tanıtım videosu' : 'Promo video'}
                </div>
                {/* preload="none": video yalnızca oynatılınca indirilir. Videoda konuşma yok
                    (müzik + ekrandaki yazılar), bu yüzden altyazı izi eklenmedi.
                    relative + z-[9999]: sayfanın üstündeki Noise (z-[9998]) grenini videonun
                    üstüne çizmesin. */}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  aria-label={isTurkish ? `${project.title} tanıtım videosu` : `${project.title} promo video`}
                  className="relative z-[9999] block aspect-video w-full bg-black"
                  src={study.video.src}
                  poster={study.video.poster}
                  controls
                  preload="none"
                  playsInline
                />
              </Reveal>
            )}

            {study.features && (
              <Reveal as="section" className="card p-6 sm:p-8">
                <SectionTitle>{isTurkish ? 'Neler yapıyor' : 'What it does'}</SectionTitle>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {study.features.map((feature) => (
                    <li key={t(feature.title)} className="rounded-xl border border-line/10 bg-surface2 p-4">
                      <h3 className="mb-1.5 font-sans text-sm font-semibold text-fg">{t(feature.title)}</h3>
                      <p className="text-body-sm text-muted">{t(feature.desc)}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal as="section" className="card-prominent p-6 sm:p-8">
              <SectionTitle>{t(study.decisionsTitle)}</SectionTitle>
              <ol className="grid gap-3">
                {decisions.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-4 rounded-xl border border-line/10 bg-surface2 p-4 text-body-sm text-muted"
                  >
                    <span className="font-display text-base font-semibold leading-snug text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{withInlineCode(item)}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            {study.gallery && (
              <Reveal as="section">
                <SectionTitle>{isTurkish ? 'Ekranlar' : 'Screens'}</SectionTitle>
                <div className="grid gap-4 sm:grid-cols-2">
                  {study.gallery.map((shot) => (
                    <figure key={shot.src} className={shot.wide ? 'sm:col-span-2' : ''}>
                      <a
                        href={shot.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-2xl border border-line/12 bg-[#0c0a07] transition-transform duration-300 hover:-translate-y-0.5"
                      >
                        <img
                          src={shot.src}
                          alt={t(shot.caption)}
                          loading="lazy"
                          decoding="async"
                          className="w-full"
                        />
                      </a>
                      <figcaption className="mt-2 text-xs text-muted">{t(shot.caption)}</figcaption>
                    </figure>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal as="section" className="card p-6">
              <SectionTitle>{isTurkish ? 'Sonuç' : 'Result'}</SectionTitle>
              <p className="text-body text-muted">{t(study.result)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {study.resultTags.map((tag) => (
                  <span key={t(tag)} className={chip}>
                    {t(tag)}
                  </span>
                ))}
              </div>
            </Reveal>

            <PrevNext currentId={project.id} isTurkish={isTurkish} />
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <CaseStudyNav currentId={project.id} isTurkish={isTurkish} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyPage;
