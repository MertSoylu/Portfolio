import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import KineticHeadline from '../motion/KineticHeadline';

/**
 * SectionHeader — shared editorial section intro used across the homepage.
 * Mirrors the specialty-page hero language: a mono kicker pill, a kinetic
 * word-reveal title, an animated duotone underline rule, an optional lead
 * paragraph on the left, and an optional aside slot (index / stats) on the
 * right. Left-aligned, asymmetric, and reduced-motion aware.
 */

const EASE = [0.22, 1, 0.36, 1];

const SectionHeader = ({ index, kicker, kickerIcon, title, lead, aside, className = '' }) => {
  const reduce = useReducedMotion();

  return (
    <div className={`mb-12 md:mb-16 ${className}`}>
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
        <div>
          <motion.span
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="lab-kicker mb-5"
          >
            {index && <span className="lab-mono text-[10px] opacity-70">{index}</span>}
            {kickerIcon}
            {kicker}
          </motion.span>

          <KineticHeadline
            as="h2"
            gradient
            text={title}
            className="text-4xl font-extrabold leading-[1.04] tracking-tight text-ink-900 dark:text-white sm:text-5xl lg:text-6xl"
          />

          <motion.span
            aria-hidden="true"
            initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="mt-5 block h-[3px] w-40 origin-left rounded-full bg-gradient-to-r from-violet-500 via-aqua-300 to-ember-400 sm:w-56"
          />

          {lead && (
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="mt-6 max-w-xl text-body-lg text-ink-600 dark:text-ink-200"
            >
              {lead}
            </motion.p>
          )}
        </div>

        {aside && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            className="lg:pb-2"
          >
            {aside}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
