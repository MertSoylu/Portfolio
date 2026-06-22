import { Children, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Seamless infinite card marquee.
 * - Content is duplicated and translated continuously, so it flows in one
 *   direction forever with no visible reset (true loop).
 * - Pauses while hovered. Drag (pointer/touch) to scrub manually, then it resumes.
 * - Collapses to a static, swipeable row when prefers-reduced-motion is set.
 */
const CardMarquee = ({
  children,
  speed = 36,
  direction = 'right',
  gapClassName = 'gap-4 sm:gap-5',
  itemClassName = 'w-[280px] sm:w-[340px]',
  fadeWidth = 64,
  ariaLabel,
}) => {
  const reduce = useReducedMotion();
  const items = Children.toArray(children);
  const innerRef = useRef(null);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const pausedRef = useRef(false);
  const drag = useRef({ active: false, startX: 0, startOffset: 0, moved: false, pointerId: null });

  const measure = useCallback(() => {
    const el = innerRef.current;
    if (!el || el.children.length <= items.length) return;
    const half = el.children[items.length].offsetLeft - el.children[0].offsetLeft;
    if (half > 0) {
      halfRef.current = half;
      if (offsetRef.current === 0) offsetRef.current = -half;
    }
  }, [items.length]);

  useLayoutEffect(() => {
    measure();
    const el = innerRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  // Continuous flow.
  useEffect(() => {
    if (reduce) return undefined;
    const sign = direction === 'right' ? 1 : -1;
    let raf = 0;
    let last = 0;
    const tick = (t) => {
      if (!last) last = t;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const half = halfRef.current;
      if (half > 0) {
        if (!pausedRef.current && !drag.current.active) offsetRef.current += sign * speed * dt;
        if (offsetRef.current >= 0) offsetRef.current -= half;
        else if (offsetRef.current < -half) offsetRef.current += half;
        if (innerRef.current) innerRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, direction, speed]);

  // Manual drag-to-scrub, attached imperatively to keep markup non-interactive.
  useEffect(() => {
    const el = innerRef.current;
    if (!el || reduce) return undefined;
    const onDown = (e) => {
      drag.current = {
        active: true,
        startX: e.clientX,
        startOffset: offsetRef.current,
        moved: false,
        pointerId: e.pointerId,
      };
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    const onMove = (e) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.startX;
      if (Math.abs(dx) > 5) drag.current.moved = true;
      offsetRef.current = drag.current.startOffset + dx;
    };
    const onUp = () => {
      drag.current.active = false;
    };
    const onClick = (e) => {
      if (drag.current.moved) {
        e.preventDefault();
        e.stopPropagation();
        drag.current.moved = false;
      }
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClick, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('click', onClick, true);
    };
  }, [reduce, items.length]);

  if (reduce) {
    return (
      <ul
        aria-label={ariaLabel}
        className={`no-scrollbar flex ${gapClassName} snap-x snap-mandatory overflow-x-auto pb-1`}
      >
        {items.map((child, i) => (
          <li key={i} className={`snap-start shrink-0 ${itemClassName}`}>
            {child}
          </li>
        ))}
      </ul>
    );
  }

  const edgeMask = `linear-gradient(to right, transparent 0, #000 ${fadeWidth}px, #000 calc(100% - ${fadeWidth}px), transparent 100%)`;

  return (
    <div
      className="relative overflow-hidden px-3 sm:px-6"
      style={{ WebkitMaskImage: edgeMask, maskImage: edgeMask }}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        if (!drag.current.active) pausedRef.current = false;
      }}
    >
      <ul
        ref={innerRef}
        aria-label={ariaLabel}
        className={`flex w-max ${gapClassName} cursor-grab select-none items-stretch [touch-action:pan-y] active:cursor-grabbing`}
      >
        {[...items, ...items].map((child, i) => (
          <li key={i} aria-hidden={i >= items.length} className={`shrink-0 ${itemClassName}`}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardMarquee;
