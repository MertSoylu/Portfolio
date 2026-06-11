import React from 'react';
import { motion } from 'framer-motion';
import KineticHeadline from './motion/KineticHeadline';
import MorphBlob from './motion/MorphBlob';
import PageMeta from './PageMeta';
import PageBackButton from './ui/PageBackButton';

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

// Static lookup so Tailwind picks up class names at build time.
const accentClasses = {
  emerald: {
    eyebrow: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border-emerald-500/25',
  },
  red: {
    eyebrow: 'bg-accent-500/10 text-accent-700 dark:text-accent-200 border-accent-500/25',
  },
  blue: {
    eyebrow: 'bg-violet-500/10 text-violet-700 dark:text-violet-200 border-violet-500/25',
  },
  zinc: {
    eyebrow: 'bg-ink-500/10 text-ink-700 dark:text-ink-100 border-ink-500/20',
  },
  warm: {
    eyebrow: 'bg-accent-500/10 text-accent-700 dark:text-accent-200 border-accent-500/25',
  },
};

/**
 * Shared layout for specialty pages (Android, Web, Cyber, Data Science, NotFound).
 * Owns the page motion wrapper, back button, optional hero block, and content slot.
 */
const SpecialtyPageLayout = ({
  routePath,
  accent = 'warm',
  eyebrow,
  eyebrowIcon,
  title,
  titleNode,
  subtitle,
  hideBackButton = false,
  centered = false,
  className = '',
  contentClassName = '',
  sideNode,
  children,
}) => {
  const accentTheme = accentClasses[accent] ?? accentClasses.warm;

  const containerClasses = centered
    ? 'flex min-h-screen items-center justify-center px-4'
    : 'min-h-screen px-4 pb-16 pt-24 sm:pb-20';

  const innerClasses = centered ? 'mx-auto w-full max-w-lg text-center' : 'mx-auto w-full max-w-6xl';

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative overflow-hidden ${containerClasses} ${className}`}
    >
      {routePath && <PageMeta route={routePath} />}
      {!hideBackButton && <PageBackButton />}

      <MorphBlob
        className="pointer-events-none absolute right-[-12%] top-[8%] -z-10 h-[40vh] w-[40vh]"
        from="#7c5cff"
        to="#27e0c4"
        opacity={0.16}
        blur={48}
        duration={22}
      />

      <div className={`relative ${innerClasses}`}>
        {(eyebrow || title || titleNode || subtitle || sideNode) && (
          <header
            className={`mb-10 grid items-end gap-6 md:mb-16 md:gap-8 ${
              centered || !sideNode ? 'text-center' : 'lg:grid-cols-[minmax(0,1fr)_420px]'
            }`}
          >
            <div className={centered || !sideNode ? 'mx-auto max-w-3xl' : 'max-w-3xl'}>
              {eyebrow && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-4 py-1.5 text-caption sm:mb-6 ${accentTheme.eyebrow}`}
                >
                  {eyebrowIcon}
                  {eyebrow}
                </motion.span>
              )}

              {titleNode ? (
                <div className="mb-4 sm:mb-6">{titleNode}</div>
              ) : title ? (
                <KineticHeadline
                  as="h1"
                  text={title}
                  className={`mb-4 text-h1 text-ink-900 dark:text-white sm:mb-6 ${
                    centered || !sideNode ? 'text-center' : ''
                  }`}
                />
              ) : null}

              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className={`text-body-lg text-ink-600 dark:text-ink-200 ${
                    centered || !sideNode ? 'mx-auto max-w-2xl' : 'max-w-2xl'
                  }`}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>

            {sideNode && (
              <motion.div
                initial={{ opacity: 0, y: 28, rotate: 1.5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-full max-w-md lg:mx-0"
              >
                {sideNode}
              </motion.div>
            )}
          </header>
        )}

        <div className={contentClassName}>{children}</div>
      </div>
    </motion.div>
  );
};

export default SpecialtyPageLayout;
