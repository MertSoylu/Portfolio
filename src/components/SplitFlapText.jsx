import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const SplitFlapChar = ({ targetChar, delay, duration = 600, className = '' }) => {
  const [display, setDisplay] = useState('\u00A0');
  const [settled, setSettled] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (targetChar === ' ' || targetChar === '\u00A0') {
      setDisplay('\u00A0');
      setSettled(true);
      return;
    }

    setSettled(false);
    // Start flipping after delay
    timeoutRef.current = setTimeout(() => {
      let elapsed = 0;
      const flipInterval = 50; // ms between flips

      intervalRef.current = setInterval(() => {
        elapsed += flipInterval;
        if (elapsed >= duration) {
          clearInterval(intervalRef.current);
          setDisplay(targetChar);
          setSettled(true);
        } else {
          // Random character, increasingly likely to show target
          const probability = elapsed / duration;
          if (Math.random() < probability * 0.3) {
            setDisplay(targetChar);
          } else {
            setDisplay(CHARS[Math.floor(Math.random() * CHARS.length)]);
          }
        }
      }, flipInterval);
    }, delay);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [targetChar, delay, duration]);

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ rotateX: 0 }}
      animate={settled ? { rotateX: 0 } : { rotateX: [0, -10, 0] }}
      transition={{ duration: 0.05, repeat: settled ? 0 : Infinity }}
      style={{ minWidth: targetChar === ' ' ? '0.3em' : undefined }}
    >
      {display}
    </motion.span>
  );
};

/**
 * SplitFlapText — Airport departure board style text reveal
 * @param {string} text - The text to display
 * @param {number} staggerMs - Delay between each character starting (ms)
 * @param {number} flipDuration - How long each character flips before settling (ms)
 * @param {string} className - Class for each character span
 * @param {string} containerClassName - Class for the container
 */
const SplitFlapText = ({
  text,
  staggerMs = 80,
  flipDuration = 600,
  className = '',
  containerClassName = '',
}) => {
  return (
    <span className={containerClassName} aria-label={text}>
      {text.split('').map((char, i) => (
        <SplitFlapChar
          key={`${i}-${char}`}
          targetChar={char}
          delay={i * staggerMs}
          duration={flipDuration}
          className={className}
        />
      ))}
    </span>
  );
};

/**
 * MorphingRoles — Smooth role text cycling with character-level layout animation
 */
const MorphingRoles = ({ roles, interval = 3000, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, interval);
    return () => clearInterval(timer);
  }, [roles.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -30, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="block"
        >
          {roles[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export { SplitFlapText, MorphingRoles };
export default SplitFlapText;
