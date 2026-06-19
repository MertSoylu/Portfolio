import { HiCode, HiExternalLink } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import PageMeta from './PageMeta';
import PageBackButton from './ui/PageBackButton';
import Reveal from './ui/Reveal';
import { BrowserFrame, PhoneFrame } from './ui/DevicePreview';

export const CASE_STUDIES = [
  { id: 'mnemosyne', title: 'Mnemosyne', path: '/case-study/mnemosyne', category: 'Web' },
  { id: 'typesprint', title: 'TypeSprint', path: '/case-study/typesprint', category: 'Web' },
  { id: 'walkkittie', title: 'WalkKittie', path: '/case-study/walkkittie', category: 'Android' },
  { id: 'msscan', title: 'msscan', path: '/case-study/msscan', category: 'Security' },
];

export const CaseStudyNav = ({ currentId, isTurkish }) => (
  <nav className="card p-5">
    <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
      {isTurkish ? 'Diğer case study’ler' : 'Other case studies'}
    </h4>
    <ul className="space-y-1.5">
      {CASE_STUDIES.filter((cs) => cs.id !== currentId).map((cs) => (
        <li key={cs.id}>
          <Link
            to={cs.path}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface2 hover:text-fg"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface2 text-xs font-semibold text-accent">
              {cs.category[0]}
            </span>
            <span>{cs.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

const FactStrip = ({ facts = [] }) => {
  if (!facts.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.label} className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{fact.label}</p>
          <p className="mt-2 text-sm font-semibold text-fg">{fact.value}</p>
        </div>
      ))}
    </div>
  );
};

const CaseStudyLayout = ({
  routePath,
  title,
  subtitle,
  liveUrl,
  githubUrl,
  currentId,
  isTurkish,
  facts = [],
  previewSnapshotSrc,
  children,
}) => {
  const isMobile = currentId === 'walkkittie';

  return (
    <div className="relative min-h-screen px-5 pb-20 pt-28 sm:pt-32">
      {routePath && <PageMeta route={routePath} />}
      <div className="container-wide">
        <PageBackButton className="mb-8" />

        <header className="mb-10 grid items-start gap-8 sm:mb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-12">
          <div>
            <Reveal as="div" className="mb-4">
              <span className="eyebrow text-accent">{isTurkish ? 'Ürün dosyası' : 'Product case study'}</span>
            </Reveal>
            <Reveal as="h1" delay={0.05} className="text-h1 text-fg">
              {title}
            </Reveal>
            <Reveal as="p" delay={0.1} className="mb-6 mt-4 max-w-2xl text-body-lg text-fg/80">
              {subtitle}
            </Reveal>
            <Reveal delay={0.15} className="flex flex-wrap gap-3">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-4 py-2 text-sm"
                >
                  <HiExternalLink className="h-4 w-4" />
                  {isTurkish ? 'Canlı demo' : 'Live demo'}
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  <HiCode className="h-4 w-4" />
                  {isTurkish ? 'Kaynak kodu' : 'Source code'}
                </a>
              )}
            </Reveal>
          </div>

          <Reveal delay={0.1} className="w-full">
            {isMobile ? (
              <PhoneFrame src={previewSnapshotSrc} title={title} alt={`${title} preview`} />
            ) : (
              <BrowserFrame
                url={liveUrl || githubUrl}
                src={previewSnapshotSrc}
                title={title}
                alt={`${title} preview`}
              />
            )}
          </Reveal>
        </header>

        <div className="mb-8">
          <FactStrip facts={facts} />
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">{children}</div>
          <aside className="hidden lg:block">
            <CaseStudyNav currentId={currentId} isTurkish={isTurkish} />
          </aside>
        </div>

        <div className="mt-12 lg:hidden">
          <CaseStudyNav currentId={currentId} isTurkish={isTurkish} />
        </div>
      </div>
    </div>
  );
};

export default CaseStudyLayout;
