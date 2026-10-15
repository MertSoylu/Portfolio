import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiChevronDown } from 'react-icons/hi';
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
import LoadingSpinner from '../components/LoadingSpinner';
import PageBackButton from '../components/ui/PageBackButton';
import Reveal from '../components/ui/Reveal';
import { ProjectPreview } from '../components/ui/DevicePreview';
import { ProjectActions } from '../components/project/ProjectShowcase';

// Bilinmeyen id nadir bir durum: 404 sayfası vaka chunk'ına girmesin, gerektiğinde yüklensin.
const NotFoundPage = lazy(() => import('./NotFoundPage'));

// Sayfadaki sabit arayüz metinleri. İçerik metinleri (sorun, çözüm, özellikler...) caseStudies.js'ten gelir.
const COPY = {
  problem: { tr: 'Sorun', en: 'Problem' },
  solution: { tr: 'Çözüm', en: 'Solution' },
  video: { tr: 'Tanıtım videosu', en: 'Promo video' },
  features: { tr: 'Öne çıkan özellikler', en: 'Key features' },
  decisions: { tr: 'Kararlar', en: 'Decisions' },
  gallery: { tr: 'Ekranlar', en: 'Screens' },
  result: { tr: 'Sonuç', en: 'Result' },
  contents: { tr: 'İçindekiler', en: 'Contents' },
  otherProjects: { tr: 'Diğer projeler', en: 'Other projects' },
  projectNav: { tr: 'Proje gezinme', en: 'Project navigation' },
  previous: { tr: 'Önceki', en: 'Previous' },
  next: { tr: 'Sonraki', en: 'Next' },
};

const toArray = (value) => (Array.isArray(value) ? value : []);

// Metindeki `ters tırnaklı` parçaları satır içi kod olarak gösterir.
const withInlineCode = (text) =>
  String(text ?? '')
    .split(/`([^`]+)`/)
    .map((part, index) =>
      index % 2 === 1 ? (
        <code
          key={index}
          className="rounded border border-line/10 bg-canvas px-1 py-0.5 font-mono text-[0.85em] text-fg"
        >
          {part}
        </code>
      ) : (
        part
      ),
    );

// Hangi bölümün okunduğunu izler: üst çubuğun hemen altındaki bantta kesişen ilk bölüm "aktif" sayılır.
// Bölümlerden hiçbiri bantta değilse son aktif bölüm korunur. IntersectionObserver yoksa (eski
// tarayıcı, jsdom) aktif bölüm hiç işaretlenmez; bağlantılar yine çalışır.
const useActiveSection = (ids) => {
  const [active, setActive] = useState(null);
  const key = ids.join('|');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!elements.length) return undefined;

    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        const current = elements.find((element) => visible.has(element.id));
        if (current) {
          setActive(current.id);
        } else if (elements[0].getBoundingClientRect().top > window.innerHeight * 0.45) {
          // Sayfanın başına dönüldü: ilk bölüm bandın altında kaldı, hiçbir bölüm "okunmuyor".
          setActive(null);
        }
      },
      { rootMargin: '-96px 0px -55% 0px' },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key]);

  return active;
};

// Bölüm kartı: numaralı mono indeks + h2 başlık. `id` hem sayfa içi bağlantının hedefi hem de
// aria-labelledby için kullanılır; video bölümü kendi gövdesini (bodyClassName) kenardan kenara çizer.
const Section = ({ id, number, title, bodyClassName = 'px-5 pb-5 sm:px-8 sm:pb-8', children }) => (
  <Reveal as="section" id={id} aria-labelledby={`${id}-title`} className="card scroll-mt-24 overflow-hidden">
    <div className="px-5 pt-5 sm:px-8 sm:pt-8">
      <p aria-hidden="true" className="label mb-3 text-accent">
        {number}
      </p>
      <h2 id={`${id}-title`} className="mb-5 break-words text-h3">
        {title}
      </h2>
    </div>
    <div className={bodyClassName}>{children}</div>
  </Reveal>
);

// Sayfa içi bölüm bağlantıları. 44px hedefler; aktif bölüm `aria-current="location"` taşır.
const TocLinks = ({ sections, active, onNavigate }) => (
  <ul className="space-y-0.5">
    {sections.map((section) => {
      const isActive = active === section.id;
      return (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            aria-current={isActive ? 'location' : undefined}
            onClick={onNavigate}
            className={`flex min-h-11 items-center gap-3 rounded-r-md border-l-2 px-3 text-sm transition-colors hover:bg-surface2 hover:text-fg ${
              isActive ? 'border-accent bg-surface2/60 font-medium text-fg' : 'border-transparent text-muted'
            }`}
          >
            <span aria-hidden="true" className="micro text-accent">
              {section.number}
            </span>
            <span className="min-w-0 break-words">{section.title}</span>
          </a>
        </li>
      );
    })}
  </ul>
);

// lg altında: başlığın altında açılır atlama listesi. Bir bağlantıya basınca kapanır.
const MobileContents = ({ sections, active, t }) => {
  const [open, setOpen] = useState(false);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="card group mb-10 lg:hidden"
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-2 marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="label text-fg">{t(COPY.contents)}</span>
        <HiChevronDown
          className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <nav aria-label={t(COPY.contents)} className="border-t border-line/10 p-2">
        <TocLinks sections={sections} active={active} onNavigate={() => setOpen(false)} />
      </nav>
    </details>
  );
};

// lg ve üstünde: sağ rayda yapışkan içindekiler listesi.
const RailContents = ({ sections, active, t }) => (
  <nav aria-label={t(COPY.contents)} className="card hidden p-2 lg:block">
    <p className="label px-3 pb-1 pt-3">{t(COPY.contents)}</p>
    <TocLinks sections={sections} active={active} />
  </nav>
);

// Diğer projelerin listesi. Mobilde sayfa sonunda, lg'de sağ rayda görünür.
const OtherProjectsNav = ({ currentId, t }) => (
  <nav aria-label={t(COPY.otherProjects)} className="card p-2">
    <p className="label px-3 pb-1 pt-3">{t(COPY.otherProjects)}</p>
    <ul className="space-y-0.5">
      {PROJECTS.filter((project) => project.id !== currentId).map((project) => (
        <li key={project.id}>
          <Link
            to={caseStudyPath(project.id)}
            className="flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-sm text-muted transition-colors hover:bg-surface2 hover:text-fg"
          >
            <span className="min-w-0 truncate">{project.title}</span>
            <span className="micro shrink-0 uppercase">{t(CATEGORY_LABELS[project.category])}</span>
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

  const item = (project, isNext) => (
    <Link
      to={caseStudyPath(project.id)}
      className={`card-interactive group flex flex-col gap-1.5 p-5 ${isNext ? 'items-end text-right' : ''}`}
    >
      <span className="label inline-flex items-center gap-2">
        {!isNext && (
          <HiArrowLeft
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        )}
        {t(isNext ? COPY.next : COPY.previous)}
        {isNext && (
          <HiArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </span>
      <span className="text-h4 break-words text-fg">{project.title}</span>
    </Link>
  );

  return (
    <nav className="grid gap-3 sm:grid-cols-2" aria-label={t(COPY.projectNav)}>
      {item(prev, false)}
      {item(next, true)}
    </nav>
  );
};

const CaseStudy = ({ project, study }) => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);

  const category = t(CATEGORY_LABELS[project.category]);
  const isPhone = project.preview?.kind === 'phone';
  const facts = toArray(study.facts);
  const features = toArray(study.features);
  const decisions = toArray(t(study.decisions));
  const gallery = toArray(study.gallery);
  const resultTags = toArray(study.resultTags);
  const extraLinks = toArray(study.extraLinks);

  // Kategorinin uzmanlık sayfası varsa oraya dön; yoksa (ör. Terminal) proje bölümüne.
  const hasCategoryPage = Boolean(CATEGORY_ROUTES[project.category]);
  const backLabel = hasCategoryPage
    ? t({ tr: `${category} projelerine dön`, en: `Back to ${category} projects` })
    : t(UI_COPY.backToProjects);

  // Görünen bölümler sırayla numaralanır; eksik bölümler (video, özellik, karar, galeri) listeye girmez.
  const sections = [
    { id: 'problem', title: t(COPY.problem) },
    { id: 'solution', title: t(COPY.solution) },
    study.video && { id: 'video', title: t(COPY.video) },
    features.length > 0 && { id: 'features', title: t(COPY.features) },
    decisions.length > 0 && { id: 'decisions', title: t(study.decisionsTitle) || t(COPY.decisions) },
    gallery.length > 0 && { id: 'gallery', title: t(COPY.gallery) },
    { id: 'result', title: t(COPY.result) },
  ]
    .filter(Boolean)
    .map((section, index) => ({ ...section, number: String(index + 1).padStart(2, '0') }));
  const meta = Object.fromEntries(sections.map((section) => [section.id, section]));
  const active = useActiveSection(sections.map((section) => section.id));

  return (
    <div className="relative pb-20 pt-28 sm:pt-32">
      <PageMeta route={caseStudyPath(project.id)} />
      <div className="container-site">
        <PageBackButton to={categoryPath(project.category)} label={backLabel} className="mb-8" />

        <header
          className={`mb-10 grid items-center gap-10 lg:gap-12 ${
            isPhone ? 'lg:grid-cols-[minmax(0,1fr)_17rem]' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]'
          }`}
        >
          <Reveal className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="label">{`${category} · ${t(UI_COPY.caseStudy)}`}</p>
              <span className="tag">{t(project.status)}</span>
            </div>
            <h1 className="break-words text-h1">{project.title}</h1>
            <p className="text-lead mt-5 max-w-2xl break-words">{t(study.subtitle)}</p>
            <div className="mt-7">
              <ProjectActions project={project} showCaseStudy={false} size="lg" extraLinks={extraLinks} />
            </div>
          </Reveal>

          {/* Köşe işaretleri (.ticks) sayfadaki tek vurgu paneli: önizlemeyi vizör gibi çerçeveler. */}
          <Reveal
            delay={0.1}
            className={`ticks min-w-0 p-3 sm:p-4 ${isPhone ? 'mx-auto w-fit max-w-full lg:justify-self-end' : ''}`}
          >
            <ProjectPreview project={project} eager />
          </Reveal>
        </header>

        {facts.length > 0 && (
          <dl className="mb-10 grid divide-y divide-line/10 border-y border-line/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {facts.map((fact, index) => (
              <div key={index} className="min-w-0 py-4 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <dt className="label">{t(fact.label)}</dt>
                <dd className="mt-1.5 break-words text-sm font-medium text-fg">{t(fact.value)}</dd>
              </div>
            ))}
          </dl>
        )}

        <MobileContents sections={sections} active={active} t={t} />

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
          <div className="min-w-0 space-y-6">
            <Section {...meta.problem}>
              <p className="max-w-prose break-words text-muted">{t(study.problem)}</p>
            </Section>

            <Section {...meta.solution}>
              <p className="max-w-prose break-words text-muted">{t(study.solution)}</p>
            </Section>

            {study.video && (
              <Section {...meta.video} bodyClassName="">
                {/* preload="none": video yalnızca oynatılınca indirilir. Videoda konuşma yok
                    (müzik + ekrandaki yazılar), bu yüzden altyazı izi eklenmedi. */}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  aria-label={t({
                    tr: `${project.title} tanıtım videosu`,
                    en: `${project.title} promo video`,
                  })}
                  className="block aspect-video w-full bg-black"
                  src={study.video.src}
                  poster={study.video.poster}
                  controls
                  preload="none"
                  playsInline
                />
              </Section>
            )}

            {features.length > 0 && (
              <Section {...meta.features}>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <li key={index} className="min-w-0 rounded-md border border-line/10 bg-surface2 p-4">
                      <h3 className="text-h4 break-words">{t(feature.title)}</h3>
                      <p className="mt-1.5 break-words text-sm text-muted">
                        {withInlineCode(t(feature.desc))}
                      </p>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {decisions.length > 0 && (
              <Section {...meta.decisions}>
                <ol className="divide-y divide-line/10 border-y border-line/10">
                  {decisions.map((item, index) => (
                    <li key={index} className="flex items-baseline gap-4 py-4">
                      <span aria-hidden="true" className="shrink-0 font-mono text-sm font-medium text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 break-words text-muted">{withInlineCode(item)}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {gallery.length > 0 && (
              <Section {...meta.gallery}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {gallery.map((shot) => (
                    <figure key={shot.src} className={shot.wide ? 'min-w-0 sm:col-span-2' : 'min-w-0'}>
                      {/* Bağlantının adı görselin alt metninden gelir (görselde ne olduğu); görünen
                          altyazı figcaption'da ayrıca durur, böylece aynı cümle iki kez okunmaz. */}
                      <a
                        href={shot.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-lg border border-line/10 bg-surface2 transition-colors hover:border-line/25"
                      >
                        <img
                          src={shot.src}
                          alt={t(shot.alt) || t(shot.caption)}
                          width={shot.width}
                          height={shot.height}
                          loading="lazy"
                          decoding="async"
                          className="h-auto w-full"
                        />
                        <span className="sr-only"> {t(UI_COPY.newTab)}</span>
                      </a>
                      <figcaption className="mt-2 break-words text-sm text-muted">
                        {t(shot.caption)}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </Section>
            )}

            <Section {...meta.result}>
              <p className="max-w-prose break-words text-muted">{t(study.result)}</p>
              {resultTags.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {resultTags.map((tag, index) => (
                    <li key={index} className="tag">
                      {t(tag)}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <PrevNext currentId={project.id} t={t} />
          </div>

          <div className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <RailContents sections={sections} active={active} t={t} />
            <OtherProjectsNav currentId={project.id} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CaseStudyPage = () => {
  const { id } = useParams();
  const project = getProject(id);
  const study = project ? CASE_STUDIES[project.id] : undefined;

  if (!project || !study) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFoundPage />
      </Suspense>
    );
  }

  return <CaseStudy key={project.id} project={project} study={study} />;
};

export default CaseStudyPage;
