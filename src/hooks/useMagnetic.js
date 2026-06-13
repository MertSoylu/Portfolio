import React from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * useMagnetic — pulls an element toward the cursor on hover.
 * Returns a ref + framer-motion style + mouse handlers.
 *
 * @param {number} strength - how strongly the element follows the cursor (0–1).
 */
export const useMagnetic = (strength = 0.22) => {
  const ref = React.useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18 });
  const springY = useSpring(y, { stiffness: 180, damping: 18 });

  const rectRef = React.useRef(null);

  const onMouseMove = (event) => {
    if (!ref.current) return;
    if (!rectRef.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null;
  };

  React.useEffect(() => {
    const handleScrollOrResize = () => {
      rectRef.current = null;
    };
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  return { ref, style: { x: springX, y: springY }, onMouseMove, onMouseLeave };
};

export default useMagnetic;
