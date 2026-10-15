import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Reveal — the single motion primitive for the site. Fades content up 12px into view once, and
 * collapses to a plain opacity fade when the user prefers reduced motion. `as` picks the motion
 * element (div, section, span, li, h2, ...). The `data-reveal` attribute lets the print stylesheet
 * force revealed content visible.
 */
const Reveal = ({ as = 'div', children, delay = 0, y = 12, once = true, className = '', ...rest }) => {
  const reduce = useReducedMotion();
  const Motion = motion[as] || motion.div;

  return (
    <Motion
      data-reveal=""
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Motion>
  );
};

export default Reveal;
