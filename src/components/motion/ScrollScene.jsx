import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollScene — scroll-driven reveal wrapper. As the element travels through the
 * viewport it lifts, fades, and gently un-skews, with an optional parallax drift.
 * Use it to wrap cards/blocks for a continuous, motion-rich scroll feel.
 *
 * Props:
 *  - as: wrapper tag (default 'div')
 *  - parallax: vertical drift in px applied across the scroll range (default 0)
 *  - blurReveal: when true, also animates a blur → sharp transition
 *  - className / style: forwarded to the wrapper
 */
const ScrollScene = ({
  children,
  as = 'div',
  parallax = 0,
  blurReveal = false,
  className = '',
  style,
  ...rest
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'end 30%'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [48 + parallax, -parallax]);
  const skewY = useTransform(scrollYProgress, [0, 0.4], [4, 0]);
  const filter = useTransform(scrollYProgress, [0, 0.4], ['blur(10px)', 'blur(0px)']);

  const Wrapper = motion[as] || motion.div;

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} style={style} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Wrapper
      ref={ref}
      className={className}
      style={{
        opacity,
        y,
        skewY,
        ...(blurReveal ? { filter } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Wrapper>
  );
};

export default ScrollScene;
