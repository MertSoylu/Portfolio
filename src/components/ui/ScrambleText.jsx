import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const POOL = '01/\\|<>#*+=:-.ABCDEFGHKMNRSTUXYZ23456789';
const DURATION = 460; // ms
const KEEP = /[\s/]/; // spaces and the "/" separator stay put

/**
 * ScrambleText — decodes `text` from random glyphs once, the first time it scrolls into view (~0.45 s).
 * The real text is always in the DOM (and in the accessibility tree); the scramble is an aria-hidden overlay
 * that exists only while it runs, driven by requestAnimationFrame for that short window. Reduced motion:
 * no effect at all.
 */
const ScrambleText = ({ text, className = '' }) => {
  const reduce = useReducedMotion();
  const textRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const real = textRef.current;
    const overlay = overlayRef.current;
    if (reduce || !real || !overlay || typeof IntersectionObserver === 'undefined') return undefined;

    const chars = Array.from(text);
    const resolveAt = chars.map((char, i) =>
      KEEP.test(char) ? 0 : (0.12 + (0.62 * i) / chars.length + 0.26 * Math.random()) * DURATION,
    );
    const out = new Array(chars.length);
    let raf = 0;
    let start = 0;

    const finish = () => {
      overlay.textContent = '';
      real.style.color = '';
    };

    const step = (now) => {
      if (!start) start = now;
      const elapsed = now - start;
      if (elapsed >= DURATION) {
        finish();
        return;
      }
      for (let i = 0; i < chars.length; i += 1) {
        out[i] =
          elapsed >= resolveAt[i] || KEEP.test(chars[i])
            ? chars[i]
            : POOL[Math.floor(Math.random() * POOL.length)];
      }
      overlay.textContent = out.join('');
      raf = window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        real.style.color = 'transparent';
        raf = window.requestAnimationFrame(step);
      },
      { threshold: 0.6, rootMargin: '0px 0px -6% 0px' },
    );
    observer.observe(real);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
      finish();
    };
  }, [text, reduce]);

  return (
    <span className={`relative ${className}`}>
      <span ref={textRef}>{text}</span>
      <span
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 select-none whitespace-nowrap"
      />
    </span>
  );
};

export default ScrambleText;
