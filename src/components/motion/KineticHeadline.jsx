import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * KineticHeadline — masked, per-word headline reveal with a skew/lift entrance
 * and a springy per-word hover lift. The signature display treatment for the
 * NOCTURNE LAB identity; replaces ScrollFloat/BlurText on headings.
 *
 * Props:
 *  - text: string (split into words) — or pass `children` for a single block
 *  - as: element tag for the wrapper ('h2' default)
 *  - className: classes for the wrapper (font sizing, color/gradient, etc.)
 *  - gradient: when true, words inherit the .gradient-text treatment
 *  - stagger: per-word delay (s)
 *  - once: animate only the first time in view (default true)
 */
const wordVariants = {
  hidden: { y: '115%', opacity: 0, skewY: 7 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    skewY: 0,
    transition: { delay: i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const KineticHeadline = ({ text, children, as = 'h2', className = '', gradient = false, once = true }) => {
  const reduce = useReducedMotion();
  const Wrapper = motion[as] || motion.h2;
  const words = typeof text === 'string' ? text.split(' ') : null;
  const wordClass = gradient ? 'gradient-text' : '';

  if (reduce || !words) {
    return (
      <Wrapper className={className}>
        <span className={wordClass}>{text ?? children}</span>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-12% 0px' }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-baseline"
          >
            <motion.span
              custom={i}
              variants={wordVariants}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 320, damping: 16 } }}
              className={`inline-block will-change-transform ${wordClass}`}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Wrapper>
  );
};

export default KineticHeadline;
