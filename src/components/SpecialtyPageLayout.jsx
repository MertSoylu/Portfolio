import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { AREAS, areaById, nextArea } from '../data/areas';
import { pick } from '../data/projects';
import PageMeta from './PageMeta';
import PageBackButton from './ui/PageBackButton';
import Reveal from './ui/Reveal';
import SectionHeader from './home/SectionHeader';

const COPY = {
  area: { tr: 'Alan', en: 'Area' },
  summary: { tr: 'Alan özeti', en: 'Area summary' },
  stack: { tr: 'Teknolojiler', en: 'Stack' },
  projects: { tr: 'Projeler', en: 'Projects' },
  live: { tr: 'Yayında', en: 'Live' },
  status: { tr: 'Durum', en: 'Status' },
  ctaTitle: { tr: 'Aklında bir proje mi var?', en: 'Have something in mind?' },
  ctaText: {
    tr: 'Fikrini ya da sorunu bir mesajla anlat; birlikte bakalım.',
    en: 'Send a message with your idea or problem and we can take a look.',
  },
  ctaContact: { tr: 'İletişime geç', en: 'Get in touch' },
  ctaNext: { tr: 'Sıradaki', en: 'Next' },
};

/**
 * PageSection — one section of an area page: a SectionHeader (index / label / title / lead) followed by
 * the content, with the shared vertical rhythm (`mt-20 md:mt-28`) between sections.
 */
export const PageSection = ({ id, index, label, title, lead, children }) => (
  <section aria-labelledby={id} className="mt-20 md:mt-28">
    <SectionHeader id={id} index={index} label={label} title={title} lead={lead} />
    {children}
  </section>
);

/**
 * InfoCard — a static (non-clickable) card for a feature, focus area or learning topic. No hover
 * affordance on purpose. `index` is a decorative mono number; `meta` is an optional footer node.
 */
export const InfoCard = ({ index, title, children, meta }) => (
  <div className="card flex h-full flex-col p-6">
    {index && (
      <span aria-hidden="true" className="micro text-accent">
        {index}
      </span>
    )}
    <h3 className={`text-h4 ${index ? 'mt-3' : ''}`}>{title}</h3>
    <p className="mt-2 text-sm text-muted">{children}</p>
    {meta && <div className="mt-auto pt-5">{meta}</div>}
  </div>
);

// Meta row inside the header aside: mono label on the left, value on the right.
const MetaRow = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 border-t border-line/10 pt-4">
    <dt className="label">{label}</dt>
    <dd className="flex items-center gap-2 text-sm text-fg">{children}</dd>
  </div>
);

/**
 * SpecialtyPageLayout — shared by the four area pages. Renders the back link, the header (mono
 * `Alan 0N / 04` marker, h1, lead and a meta aside with stack and counts), the page content and the
 * closing call-to-action band (contact + next area). Header copy comes from `area.page` in
 * src/data/areas.js; pass the area's `projects` so the counts are derived from data.
 */
const SpecialtyPageLayout = ({ areaId, projects = [], children }) => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);

  const area = areaById(areaId);
  const next = nextArea(areaId);
  const total = String(AREAS.length).padStart(2, '0');
  const liveCount = projects.filter((project) => project.liveUrl).length;
  const { status } = area.page;

  return (
    <div className="pb-8 pt-28 sm:pt-32">
      <PageMeta route={area.path} />
      <div className="container-site">
        <PageBackButton />

        <header className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
          <div className="min-w-0">
            <Reveal as="p" className="label">
              {t(COPY.area)} {area.index} / {total} · {t(area.name)}
            </Reveal>
            <Reveal as="h1" delay={0.05} className="text-h1 mt-4 max-w-3xl">
              {t(area.page.title)}
            </Reveal>
            <Reveal as="p" delay={0.1} className="text-lead mt-5 max-w-2xl">
              {t(area.page.lead)}
            </Reveal>
          </div>

          <Reveal as="aside" delay={0.15} aria-label={t(COPY.summary)} className="card min-w-0 p-5">
            <dl className="space-y-4">
              <div>
                <dt className="label">{t(COPY.stack)}</dt>
                <dd className="mt-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {area.stack.map((item) => (
                      <li key={item} className="tag">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              {projects.length > 0 && (
                <MetaRow label={t(COPY.projects)}>
                  <span className="font-mono">{projects.length}</span>
                </MetaRow>
              )}
              {liveCount > 0 && (
                <MetaRow label={t(COPY.live)}>
                  <span aria-hidden="true" className="status-dot" />
                  <span className="font-mono">{liveCount}</span>
                </MetaRow>
              )}
              {status && (
                <MetaRow label={t(COPY.status)}>
                  <span
                    aria-hidden="true"
                    className={
                      status.tone === 'ok' ? 'status-dot' : 'h-2 w-2 shrink-0 rounded-full bg-accent'
                    }
                  />
                  <span>{t(status.label)}</span>
                </MetaRow>
              )}
            </dl>
          </Reveal>
        </header>

        {children}

        <section aria-labelledby="page-cta-heading" className="mt-20 md:mt-28">
          <Reveal className="card ticks p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12">
              <div className="min-w-0">
                <h2 id="page-cta-heading" className="text-h2">
                  {t(COPY.ctaTitle)}
                </h2>
                <p className="text-lead mt-3 max-w-xl">{t(COPY.ctaText)}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                <Link to="/#contact" className="btn-primary btn-lg">
                  {t(COPY.ctaContact)}
                </Link>
                <Link to={next.path} className="btn-secondary btn-lg">
                  <span>
                    <span className="text-muted">{t(COPY.ctaNext)}:</span> {t(next.name)}
                  </span>
                  <HiArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
};

export default SpecialtyPageLayout;
