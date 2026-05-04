import React from 'react';
import { motion } from 'framer-motion';
import BlurText from './BlurText';
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
    eyebrow: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  red: {
    eyebrow: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
  blue: {
    eyebrow: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  zinc: {
    eyebrow: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20',
  },
  warm: {
    eyebrow: 'bg-accent-500/10 text-accent-700 dark:text-accent-300 border-accent-500/20',
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
  children,
}) => {
  const accentTheme = accentClasses[accent] ?? accentClasses.warm;

  const containerClasses = centered
    ? 'flex min-h-screen items-center justify-center px-4'
    : 'min-h-screen pt-24 pb-20 px-4';

  const innerClasses = centered ? 'mx-auto w-full max-w-lg text-center' : 'mx-auto w-full max-w-3xl';

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`${containerClasses} ${className}`}
    >
      {routePath && <PageMeta route={routePath} />}
      {!hideBackButton && <PageBackButton />}

      <div className={innerClasses}>
        {(eyebrow || title || titleNode || subtitle) && (
          <header className={`mb-12 md:mb-16 ${centered ? '' : 'text-center'}`}>
            {eyebrow && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-caption mb-6 ${accentTheme.eyebrow}`}
              >
                {eyebrowIcon}
                {eyebrow}
              </motion.span>
            )}

            {titleNode ? (
              <div className="mb-6">{titleNode}</div>
            ) : title ? (
              <BlurText
                text={title}
                delay={80}
                animateBy="words"
                direction="top"
                className="text-h1 text-sand-900 dark:text-zinc-50 mb-6 justify-center"
              />
            ) : null}

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-body-lg text-sand-700 dark:text-zinc-300 max-w-2xl mx-auto"
              >
                {subtitle}
              </motion.p>
            )}
          </header>
        )}

        <div className={contentClassName}>{children}</div>
      </div>
    </motion.div>
  );
};

export default SpecialtyPageLayout;
