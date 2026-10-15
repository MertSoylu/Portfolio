import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const sameWidths = (a, b) => a === b || (a && b && a.length === b.length && a.every((w, i) => w === b[i]));

/**
 * Rotating single-line text inside a persistent box.
 *
 * `mainClassName` styles that box (the hero puts its `.mark` highlight there), so the box is never
 * unmounted. The outgoing and incoming texts are stacked in one grid cell and swap at the same time
 * (no "empty box" gap), and the box width follows the text via a CSS width transition. Widths come
 * from an invisible measurer that renders every text once; when the longest text cannot fit on one row
 * the box falls back to its natural width and the text wraps as normal.
 */
const RotatingText = forwardRef(function RotatingText(
  {
    texts,
    transition = { type: 'spring', damping: 25, stiffness: 300 },
    initial = { y: '100%', opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: '-120%', opacity: 0 },
    animatePresenceMode = 'sync',
    animatePresenceInitial = false,
    rotationInterval = 2800,
    staggerDuration = 0,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  },
  ref,
) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  // One-row pixel width of each text; null = not measured / does not fit (natural width, text may wrap).
  const [widths, setWidths] = useState(null);
  const reduceMotion = useReducedMotion();
  const boxRef = useRef(null);
  const measureRefs = useRef([]);
  const textsKey = texts.join('\n');

  const splitIntoCharacters = (text) => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (segment) => segment.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }
    if (splitBy === 'words') {
      return currentText.split(' ').map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1,
      }));
    }
    if (splitBy === 'lines') {
      return currentText.split('\n').map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1,
      }));
    }
    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      const total = totalChars;
      if (staggerFrom === 'first') return index * staggerDuration;
      if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
      if (staggerFrom === 'center') {
        const center = Math.floor(total / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === 'random') {
        const randomIndex = Math.floor(Math.random() * total);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      return Math.abs(staggerFrom - index) * staggerDuration;
    },
    [staggerFrom, staggerDuration],
  );

  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentTextIndex(newIndex);
      if (onNext) onNext(newIndex);
    },
    [onNext],
  );

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex =
      currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback(
    (index) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) handleIndexChange(validIndex);
    },
    [texts.length, currentTextIndex, handleIndexChange],
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) handleIndexChange(0);
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);

  // Reduced motion: no timer at all. The first text stays on screen (the imperative handle still works).
  const rotates = auto && !reduceMotion && texts.length > 1;

  useEffect(() => {
    if (!rotates) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, rotates]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const nodes = measureRefs.current.slice(0, texts.length);
    if (reduceMotion || !box || nodes.length !== texts.length || nodes.some((node) => !node))
      return undefined;

    const measure = () => {
      const measured = nodes.map((node) => Math.ceil(node.getBoundingClientRect().width) + 1);
      const style = window.getComputedStyle(box);
      const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
      const available = box.parentElement?.clientWidth ?? Infinity;
      const usable = measured.every((width) => width > 1) && Math.max(...measured) + padding <= available;
      const next = usable ? measured : null;
      setWidths((previous) => (sameWidths(previous, next) ? previous : next));
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    // Re-measure when the type size changes (breakpoints, font swap) or the row gets narrower.
    const observer = new ResizeObserver(measure);
    nodes.forEach((node) => observer.observe(node));
    if (box.parentElement) observer.observe(box.parentElement);
    return () => observer.disconnect();
    // `textsKey` stands in for `texts`: callers often pass a fresh array every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textsKey, reduceMotion]);

  const oneRow = widths !== null;

  return (
    // Not: `layout` animasyonu bilerek yok. Hero'da y animasyonu yapan bir üst öğe içinde
    // framer-motion projeksiyonu metni eğip kaydırıyordu; genişlik CSS transition ile değişir.
    <span ref={boxRef} className={cx('relative inline-flex max-w-full', mainClassName)} {...rest}>
      {/* Screen readers get every text once, whatever the animation is showing. */}
      <span className="sr-only">{texts.join(', ')}</span>
      {reduceMotion ? (
        <span aria-hidden="true">{texts[currentTextIndex]}</span>
      ) : (
        <>
          <span
            aria-hidden="true"
            className={cx(
              'grid max-w-full overflow-hidden transition-[width] duration-300 ease-out',
              oneRow ? 'whitespace-nowrap' : 'whitespace-pre-wrap',
            )}
            style={oneRow ? { width: widths[currentTextIndex] } : undefined}
          >
            <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
              <motion.span
                key={currentTextIndex}
                className={cx(
                  'col-start-1 row-start-1',
                  splitBy === 'lines'
                    ? 'flex w-full flex-col'
                    : oneRow
                      ? 'flex flex-nowrap'
                      : 'flex flex-wrap',
                )}
              >
                {elements.map((wordObj, wordIndex, array) => {
                  const previousCharsCount = array
                    .slice(0, wordIndex)
                    .reduce((sum, word) => sum + word.characters.length, 0);
                  return (
                    <span key={wordIndex} className={cx('inline-flex', splitLevelClassName)}>
                      {wordObj.characters.map((char, charIndex) => (
                        <motion.span
                          key={charIndex}
                          initial={initial}
                          animate={animate}
                          exit={exit}
                          transition={{
                            ...transition,
                            delay: getStaggerDelay(
                              previousCharsCount + charIndex,
                              array.reduce((sum, word) => sum + word.characters.length, 0),
                            ),
                          }}
                          className={cx('inline-block', elementLevelClassName)}
                        >
                          {char}
                        </motion.span>
                      ))}
                      {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
                    </span>
                  );
                })}
              </motion.span>
            </AnimatePresence>
          </span>
          {/* Invisible measurer: every text once, on one row, in the same font as the visible text. */}
          <span
            aria-hidden="true"
            className="pointer-events-none invisible absolute left-0 top-0 h-0 w-max overflow-hidden whitespace-pre"
          >
            {texts.map((text, index) => (
              <span
                key={text}
                ref={(node) => {
                  measureRefs.current[index] = node;
                }}
                className="block w-max"
              >
                {text}
              </span>
            ))}
          </span>
        </>
      )}
    </span>
  );
});

export default RotatingText;
