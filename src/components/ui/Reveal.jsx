import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Reveal — the single motion primitive for the site. Fades content up into view
 * once, and collapses to a plain opacity fade when the user prefers reduced motion.
 * `as` picks the motion element (div, section, span, li, h2, ...).
 */
const Reveal = ({ as = 'div', children, delay = 0, y = 18, once = true, className = '', ...rest }) => {
  const reduce = useReducedMotion();
  const Motion = motion[as] || motion.div;

  return (
    <Motion
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Motion>
  );
};

export default Reveal;
