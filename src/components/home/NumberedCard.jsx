import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * NumberedCard — editorial card with a clip-path reveal on scroll, a pointer
 * tracked 3D tilt, a pointer-following spotlight, a top accent bar that grows
 * on hover, and a large ghost numeral in the corner. Shared by the About focus
 * areas and the Certificates grid so both speak the specialty-page card dialect.
 */

const EASE = [0.22, 1, 0.36, 1];

const NumberedCard = ({ index, delay = 0, className = '', children }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 150, damping: 18 });
  const springY = useSpring(rotY, { stiffness: 150, damping: 18 });

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(220px circle at ${glowX}% ${glowY}%, rgba(124,92,255,0.18), rgba(39,224,196,0.10) 45%, transparent 72%)`;

  const handleMove = (event) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotY.set((px - 0.5) * 10);
    rotX.set(-(py - 0.5) * 10);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const handleLeave = () => {
    rotX.set(0);
    rotY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  const revealVariants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { opacity: 0, y: 42, clipPath: 'inset(14% 0% 14% 0%)' },
        visible: {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          transition: { duration: 0.75, delay, ease: EASE },
        },
      };

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={reduce ? undefined : { y: -6 }}
      viewport={{ once: true, margin: '-50px' }}
      className="h-full [perspective:1000px] will-change-transform"
    >
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={reduce ? undefined : { rotateX: springX, rotateY: springY, transformPerspective: 1000 }}
        className={`group relative h-full overflow-hidden rounded-2xl border border-ink-200/70 bg-white/70 shadow-soft backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-ink-800/75 ${className}`}
      >
        <motion.span
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />
        <span className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-[3px] origin-left scale-x-0 bg-gradient-to-r from-violet-500 via-aqua-300 to-ember-400 shadow-[0_0_18px_rgba(39,224,196,0.55)] transition-transform duration-500 group-hover:scale-x-100" />
        {index != null && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-7 -right-1 z-[2] select-none text-[7rem] font-extrabold leading-none text-ink-900/[0.05] transition-colors duration-500 group-hover:text-violet-500/[0.08] dark:text-white/[0.05] dark:group-hover:text-aqua-200/[0.08]"
            style={{ fontFamily: "'Syne', 'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            {String(index).padStart(2, '0')}
          </span>
        )}
        <div className="relative z-[4] flex h-full flex-col [transform:translateZ(26px)]">{children}</div>
      </motion.div>
    </motion.div>
  );
};

export default NumberedCard;
