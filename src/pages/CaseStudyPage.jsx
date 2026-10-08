import { Link, useParams } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiExternalLink } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import {
  CATEGORY_LABELS,
  CATEGORY_ROUTES,
  PROJECTS,
  UI_COPY,
  caseStudyPath,
  categoryPath,
  getProject,
  pick,
} from '../data/projects';
import { CASE_STUDIES } from '../data/caseStudies';
import PageMeta from '../components/PageMeta';
import PageBackButton from '../components/ui/PageBackButton';
import Reveal from '../components/ui/Reveal';
import { ProjectPreview } from '../components/ui/DevicePreview';
import { ProjectActions } from '../components/project/ProjectShowcase';
import NotFoundPage from './NotFoundPage';

// Sayfadaki sabit arayüz metinleri. İçerik metinleri (sorun, çözüm, özellikler...) caseStudies.js'ten gelir.
const COPY = {
  problem: { tr: 'Sorun', en: 'Problem' },
  solution: { tr: 'Çözüm', en: 'Solution' },
  video: { tr: 'Tanıtım videosu', en: 'Promo video' },
  features: { tr: 'Öne çıkan özellikler', en: 'Key features' },
  gallery: { tr: 'Ekranlar', en: 'Screens' },
  result: { tr: 'Sonuç', en: 'Result' },
  onThisPage: { tr: 'Bu sayfada', en: 'On this page' },
  otherProjects: { tr: 'Diğer projeler', en: 'Other projects' },
  projectNav: { tr: 'Proje gezinme', en: 'Project navigation' },
  previous: { tr: 'Önceki', en: 'Previous' },
  next: { tr: 'Sonraki', en: 'Next' },
  newTab: { tr: '(yeni sekmede açılır)', en: '(opens in a new tab)' },
};

const STATUS_CHIP =
  'rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent';
const TAG_CHIP = 'rounded-full border border-line/12 bg-surface2 px-2.5 py-1 text-xs font-medium text-muted';
const HERO_BUTTON = 'btn-secondary px-6 py-3 text-base';
const SIDE_HEADING = 'mb-4 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted';

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

// Bölüm kartı: numaralı eyebrow + h2 başlık. `id` hem sayfa içi bağlantının hedefi hem de
// aria-labelledby için kullanılır. `variant` kart stilini seçer; video bölümü kendi gövdesini
// (bodyClassName) kenardan kenara çizer.
const Section = ({
  id,
  number,
  title,
  variant = 'card',
  bodyClassName = 'px-6 pb-6 sm:px-8 sm:pb-8',
  children,
}) => (
  <Reveal
    as="section"
    id={id}
    aria-labelledby={`${id}-title`}
    className={`${variant} scroll-mt-28 overflow-hidden`}
  >
    <div className="px-6 pt-6 sm:px-8 sm:pt-8">
      <span className="eyebrow mb-3 block text-accent">{number}</span>
      <h2 id={`${id}-title`} className="mb-5 text-h3 text-fg">
        {title}
      </h2>
    </div>
    <div className={bodyClassName}>{children}</div>
  </Reveal>
);

// Sayfa içi bölüm bağlantıları. Yalnızca lg'de görünür; mobilde sayfa zaten kısa bir akıştır.
const PageToc = ({ sections, t }) => (
  <nav className="card hidden p-5 lg:block" aria-label={t(COPY.onThisPage)}>
    <h2 className={SIDE_HEADING}>{t(COPY.onThisPage)}</h2>
    <ul className="space-y-1">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="flex items-baseline gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="font-display text-xs font-semibold text-accent">{section.number}</span>
            <span>{section.title}</span>
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

// Diğer projelerin listesi. Mobilde sayfa sonunda, lg'de yan alanda görünür.
const OtherProjectsNav = ({ currentId, t }) => (
  <nav className="card p-5" aria-label={t(COPY.otherProjects)}>
    <h2 className={SIDE_HEADING}>{t(COPY.otherProjects)}</h2>
    <ul className="space-y-1">
      {PROJECTS.filter((project) => project.id !== currentId).map((project) => (
        <li key={project.id}>
          <Link
            to={caseStudyPath(project.id)}
            className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="truncate">{project.title}</span>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent/80">
              {t(CATEGORY_LABELS[project.category])}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

// Önceki / sonraki proje. Liste döngüseldir: ilk projenin önceki öğesi son proje olur.
const PrevNext = ({ currentId, t }) => {
  const index = PROJECTS.findIndex((project) => project.id === currentId);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const item = (project, direction) => {
    const isNext = direction === 'next';
    return (
      <Link
        to={caseStudyPath(project.id)}
        className={`card card-hover group flex flex-col gap-1 p-5 ${isNext ? 'text-right' : ''}`}
      >
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted ${
            isNext ? 'justify-end' : ''
          }`}
        >
          {!isNext && <HiArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />}
          {t(isNext ? COPY.next : COPY.previous)}
          {isNext && <HiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />}
        </span>
        <span className="font-display text-xl font-semibold text-fg">{project.title}</span>
      </Link>
    );
  };

  return (
    <nav className="grid gap-3 sm:grid-cols-2" aria-label={t(COPY.projectNav)}>
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
  const category = t(CATEGORY_LABELS[project.category]);
  const isPhone = project.preview?.kind === 'phone';
  const decisions = t(study.decisions) || [];

  // Kategorinin uzmanlık sayfası varsa oraya dön; yoksa (ör. Terminal) proje bölümüne.
  const hasCategoryPage = Boolean(CATEGORY_ROUTES[project.category]);
  const backTo = categoryPath(project.category);
  const backLabel = hasCategoryPage
    ? t({ tr: `${category} projelerine dön`, en: `Back to ${category} projects` })
    : t(UI_COPY.backToProjects);

  // Görünen bölümler sırayla numaralanır; eksik bölümler (video, özellik, galeri) listeye girmez.
  const sectionList = [
    { id: 'problem', title: t(COPY.problem) },
    { id: 'solution', title: t(COPY.solution) },
    study.video && { id: 'video', title: t(COPY.video) },
    study.features && { id: 'features', title: t(COPY.features) },
    { id: 'decisions', title: t(study.decisionsTitle) },
    study.gallery && { id: 'gallery', title: t(COPY.gallery) },
    { id: 'result', title: t(COPY.result) },
  ]
    .filter(Boolean)
    .map((section, index) => ({ ...section, number: String(index + 1).padStart(2, '0') }));
  const sectionMeta = Object.fromEntries(sectionList.map((section) => [section.id, section]));

  return (
    <div className="relative min-h-screen px-5 pb-20 pt-28 sm:pt-32">
      <PageMeta route={caseStudyPath(project.id)} />
      <div className="container-wide">
        <PageBackButton to={backTo} label={backLabel} className="mb-8" />

        <header
          className={`mb-12 grid items-center gap-8 sm:mb-14 lg:gap-12 ${
            isPhone ? 'lg:grid-cols-[minmax(0,1fr)_280px]' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]'
          }`}
        >
          <div className="min-w-0">
            <Reveal as="div" className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="eyebrow text-accent">{`${category} · ${t(UI_COPY.caseStudy)}`}</span>
              <span className={STATUS_CHIP}>{t(project.status)}</span>
            </Reveal>
            <Reveal as="h1" delay={0.05} className="text-h1 text-fg">
              {project.title}
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-5 max-w-2xl text-body-lg text-fg/80">
              {t(study.subtitle)}
            </Reveal>
            <Reveal delay={0.15} className="mt-7 flex flex-wrap items-center gap-2.5">
              <ProjectActions project={project} showCaseStudy={false} size="lg" />
              {(study.extraLinks || []).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={HERO_BUTTON}
                >
                  {t(link.label)}
                  <HiExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{t(COPY.newTab)}</span>
                </a>
              ))}
            </Reveal>
          </div>

          <Reveal delay={0.1} className="min-w-0 w-full">
            <ProjectPreview project={project} alt={`${project.title} ${t(UI_COPY.preview)}`} eager />
          </Reveal>
        </header>

        <dl className="card mb-12 grid divide-y divide-line/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {study.facts.map((fact) => (
            <div key={t(fact.label)} className="p-5">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {t(fact.label)}
              </dt>
              <dd className="mt-2 text-sm font-semibold text-fg">{t(fact.value)}</dd>
            </div>
          ))}
        </dl>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          <div className="min-w-0 space-y-6">
            <Section {...sectionMeta.problem}>
              <p className="text-body text-muted">{t(study.problem)}</p>
            </Section>

            <Section {...sectionMeta.solution}>
              <p className="text-body text-muted">{t(study.solution)}</p>
            </Section>

            {study.video && (
              <Section {...sectionMeta.video} bodyClassName="">
                {/* preload="none": video yalnızca oynatılınca indirilir. Videoda konuşma yok
                    (müzik + ekrandaki yazılar), bu yüzden altyazı izi eklenmedi.
                    relative + z-[9999]: sayfanın üstündeki sabit Noise katmanı (z-[9998]) grenini
                    videonun üstüne bindirmesin ve kontroller tıklanabilir kalsın. Bu değer
                    kaldırılırsa video grenin altında kalır. */}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  aria-label={t({
                    tr: `${project.title} tanıtım videosu`,
                    en: `${project.title} promo video`,
                  })}
                  className="relative z-[9999] block aspect-video w-full bg-black"
                  src={study.video.src}
                  poster={study.video.poster}
                  controls
                  preload="none"
                  playsInline
                />
              </Section>
            )}

            {study.features && (
              <Section {...sectionMeta.features}>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {study.features.map((feature) => (
                    <li key={t(feature.title)} className="rounded-xl border border-line/10 bg-surface2 p-4">
                      <h3 className="mb-1.5 font-sans text-sm font-semibold text-fg">{t(feature.title)}</h3>
                      <p className="text-body-sm text-muted">{t(feature.desc)}</p>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section {...sectionMeta.decisions} variant="card-prominent">
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
            </Section>

            {study.gallery && (
              <Section {...sectionMeta.gallery}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {study.gallery.map((shot) => (
                    <figure key={shot.src} className={shot.wide ? 'sm:col-span-2' : ''}>
                      <a
                        href={shot.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-2xl border border-line/12 bg-[#0c0a07] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <img
                          src={shot.src}
                          alt={t(shot.caption)}
                          loading="lazy"
                          decoding="async"
                          className="w-full"
                        />
                        <span className="sr-only">{t(COPY.newTab)}</span>
                      </a>
                      <figcaption className="mt-2 text-xs text-muted">{t(shot.caption)}</figcaption>
                    </figure>
                  ))}
                </div>
              </Section>
            )}

            <Section {...sectionMeta.result}>
              <p className="text-body text-muted">{t(study.result)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {study.resultTags.map((tag) => (
                  <span key={t(tag)} className={TAG_CHIP}>
                    {t(tag)}
                  </span>
                ))}
              </div>
            </Section>

            <PrevNext currentId={project.id} t={t} />
          </div>

          <aside className="min-w-0 space-y-5 lg:sticky lg:top-28">
            <PageToc sections={sectionList} t={t} />
            <OtherProjectsNav currentId={project.id} t={t} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyPage;
