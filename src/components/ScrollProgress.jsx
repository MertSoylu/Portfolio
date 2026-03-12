import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      {/* Track */}
      <div className="h-1 w-full bg-sand-100 dark:bg-dark-600" />
      {/* Progress bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 origin-left"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #ff9a5c, #f07d2d, #d45e1f)',
          boxShadow: '0 0 8px 0px rgba(240,125,45,0.50)',
        }}
      />
    </div>
  );
};

export default ScrollProgress;
