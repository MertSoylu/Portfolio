import React from 'react';
import { motion } from 'framer-motion';
import { HiCode, HiExternalLink } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import PageMeta from './PageMeta';
import PageBackButton from './ui/PageBackButton';
import FadeContent from './FadeContent';
import SitePreview from './SitePreview';
import KineticHeadline from './motion/KineticHeadline';
import MorphBlob from './motion/MorphBlob';

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -28,
    transition: { duration: 0.35 },
  },
};

export const CASE_STUDIES = [
  { id: 'mnemosyne', title: 'Mnemosyne', path: '/case-study/mnemosyne', category: 'Web' },
  { id: 'typesprint', title: 'TypeSprint', path: '/case-study/typesprint', category: 'Web' },
  { id: 'walkkittie', title: 'WalkKittie', path: '/case-study/walkkittie', category: 'Android' },
  { id: 'msscan', title: 'msscan', path: '/case-study/msscan', category: 'Security' },
];

const previewVariantById = {
  mnemosyne: 'memory',
  typesprint: 'typing',
  walkkittie: 'mobile',
  msscan: 'terminal',
};

export const CaseStudyNav = ({ currentId, isTurkish }) => (
  <FadeContent duration={600} delay={200} threshold={0.1}>
    <nav className="card-raised p-5">
      <h4 className="mb-4 text-caption text-ink-500 dark:text-ink-200">
        {isTurkish ? 'Diger case study' : 'Other case studies'}
      </h4>
      <ul className="space-y-2">
        {CASE_STUDIES.filter((cs) => cs.id !== currentId).map((cs) => (
          <li key={cs.id}>
            <Link
              to={cs.path}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-600 transition-colors hover:bg-cyan-500/10 hover:text-cyan-700 dark:text-ink-200 dark:hover:text-cyan-100"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200/70 bg-white/70 text-xs font-extrabold text-ink-500 transition-colors group-hover:border-cyan-300 group-hover:text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-ink-200">
                {cs.category[0]}
              </span>
              <span>{cs.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </FadeContent>
);

const FactStrip = ({ facts = [] }) => {
  if (!facts.length) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.label} className="card-flat p-4">
          <p className="text-caption text-ink-500 dark:text-ink-300">{fact.label}</p>
          <p className="mt-2 text-sm font-bold text-ink-900 dark:text-white">{fact.value}</p>
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
  previewVariant,
  terminalContent,
  children,
}) => {
  const variant = previewVariant || previewVariantById[currentId] || 'web';

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:pb-20"
    >
      {routePath && <PageMeta route={routePath} />}
      <PageBackButton />

      <MorphBlob
        className="pointer-events-none absolute left-[-14%] top-[10%] -z-10 h-[40vh] w-[40vh]"
        from="#27e0c4"
        to="#7c5cff"
        opacity={0.15}
        blur={48}
        duration={24}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="mb-10 grid items-end gap-6 sm:mb-12 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_440px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <span className="lab-kicker mb-4 sm:mb-5">
              {isTurkish ? 'Ürün dosyası' : 'Product case study'}
            </span>
            <KineticHeadline
              as="h1"
              text={title}
              className="mb-3 text-h1 text-ink-900 dark:text-white sm:mb-4"
            />
            <p className="mb-5 max-w-2xl text-[1.05rem] leading-relaxed text-ink-600 dark:text-ink-200 sm:mb-6 sm:text-body-lg">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {liveUrl && (
                <motion.a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary min-h-[44px] flex-1 px-3 py-2 text-xs sm:flex-none sm:px-5 sm:py-3 sm:text-sm"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <HiExternalLink className="h-4 w-4" />
                  {isTurkish ? 'Canlı demo' : 'Live demo'}
                </motion.a>
              )}
              {githubUrl && (
                <motion.a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary min-h-[44px] flex-1 px-3 py-2 text-xs sm:flex-none sm:px-5 sm:py-3 sm:text-sm"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <HiCode className="h-4 w-4" />
                  {isTurkish ? 'Kaynak kodu' : 'Source code'}
                </motion.a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <SitePreview
              title={title}
              url={liveUrl || githubUrl}
              type={variant === 'mobile' ? 'mobile' : variant === 'terminal' ? 'terminal' : 'web'}
              variant={variant}
              terminalContent={terminalContent}
            />
          </motion.div>
        </header>

        <div className="mb-8">
          <FactStrip facts={facts} />
        </div>

        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6 sm:space-y-8">{children}</div>
          <aside className="hidden space-y-6 lg:block">
            <CaseStudyNav currentId={currentId} isTurkish={isTurkish} />
          </aside>
        </div>

        <div className="mt-12 lg:hidden">
          <CaseStudyNav currentId={currentId} isTurkish={isTurkish} />
        </div>
      </div>
    </motion.div>
  );
};

export default CaseStudyLayout;
