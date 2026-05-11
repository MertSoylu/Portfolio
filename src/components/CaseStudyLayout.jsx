import React from 'react';
import { motion } from 'framer-motion';
import { HiExternalLink, HiCode } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import PageMeta from './PageMeta';
import PageBackButton from './ui/PageBackButton';
import FadeContent from './FadeContent';

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.4 },
  },
};

/**
 * Shared case studies registry for navigation.
 */
export const CASE_STUDIES = [
  {
    id: 'mnemosyne',
    title: 'Mnemosyne',
    path: '/case-study/mnemosyne',
    category: 'Web',
  },
  {
    id: 'typesprint',
    title: 'TypeSprint',
    path: '/case-study/typesprint',
    category: 'Web',
  },
  {
    id: 'dert-haritasi',
    title: 'Dert Haritası',
    path: '/case-study/dert-haritasi',
    category: 'Web',
  },
  {
    id: 'walkkittie',
    title: 'WalkKittie',
    path: '/case-study/walkkittie',
    category: 'Android',
  },
  {
    id: 'msscan',
    title: 'msscan',
    path: '/case-study/msscan',
    category: 'Security',
  },
];

/**
 * Navigation sidebar for case studies.
 */
export const CaseStudyNav = ({ currentId, isTurkish }) => (
  <FadeContent duration={600} delay={200} threshold={0.1}>
    <nav className="card-raised p-5 sm:p-6">
      <h4 className="text-caption text-sand-600 dark:text-zinc-400 mb-4 font-semibold uppercase tracking-wide">
        {isTurkish ? 'Diğer Case Study' : 'Other Case Studies'}
      </h4>
      <ul className="space-y-2">
        {CASE_STUDIES.filter((cs) => cs.id !== currentId).map((cs) => (
          <li key={cs.id}>
            <Link
              to={cs.path}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sand-700 dark:text-zinc-300 hover:bg-accent-500/10 hover:text-accent-700 dark:hover:text-accent-300 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sand-100 dark:bg-zinc-800 text-xs font-bold text-sand-500 dark:text-zinc-400 group-hover:bg-accent-500/20 group-hover:text-accent-600 transition-colors">
                {cs.category[0]}
              </span>
              <span className="font-medium">{cs.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </FadeContent>
);

/**
 * Shared layout for case study pages.
 */
const CaseStudyLayout = ({
  routePath,
  title,
  subtitle,
  liveUrl,
  githubUrl,
  heroImage,
  currentId,
  isTurkish,
  children,
}) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="min-h-screen pt-24 pb-20 px-4"
  >
    {routePath && <PageMeta route={routePath} />}
    <PageBackButton />

    <div className="mx-auto w-full max-w-6xl">
      {/* Hero Header */}
      <header className="mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sand-900 dark:text-zinc-50 mb-4">
            {title}
          </h1>
          <p className="text-body-lg text-sand-700 dark:text-zinc-300 max-w-2xl mx-auto mb-6">{subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {liveUrl && (
              <motion.a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <HiExternalLink className="w-4 h-4" />
                {isTurkish ? 'Canlı Demo' : 'Live Demo'}
              </motion.a>
            )}
            {githubUrl && (
              <motion.a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <HiCode className="w-4 h-4" />
                {isTurkish ? 'Kaynak Kodu' : 'Source Code'}
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Hero Image */}
        {heroImage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 rounded-2xl overflow-hidden border border-sand-200 dark:border-dark-400 shadow-lg"
          >
            <img
              src={heroImage}
              alt={`${title} preview`}
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        )}
      </header>

      {/* Content + Sidebar */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">
        <div className="space-y-8">{children}</div>
        <aside className="hidden lg:block space-y-6">
          <CaseStudyNav currentId={currentId} isTurkish={isTurkish} />
        </aside>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden mt-12">
        <CaseStudyNav currentId={currentId} isTurkish={isTurkish} />
      </div>
    </div>
  </motion.div>
);

export default CaseStudyLayout;
