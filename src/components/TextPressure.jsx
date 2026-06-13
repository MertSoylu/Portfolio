// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Compressa VF',
  // This font is just an example, you should not use it in commercial projects.
  fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  strokeWidth = 2,
  className = '',

  minFontSize = 24,
  maxFontSize = Number.POSITIVE_INFINITY,
  edgePadding = '0px',
  idleCenter = false,
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const centersRef = useRef([]);
  const maxDistRef = useRef(0);

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  const resetCursorPosition = useCallback(() => {
    const node = containerRef.current;
    const isCoarsePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    if (node && (idleCenter || isCoarsePointer)) {
      const rect = node.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      mouseRef.current = { ...center };
      cursorRef.current = { ...center };
      return;
    }

    mouseRef.current = { x: -99999, y: -99999 };
    cursorRef.current = { x: -99999, y: -99999 };
  }, [idleCenter]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    resetCursorPosition();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [resetCursorPosition]);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.min(Math.max(newFontSize, minFontSize), maxFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();
      const maxTextWidth = containerW * 0.96;

      if (textRect.width > maxTextWidth) {
        const fittedFontSize = Math.max(minFontSize, newFontSize * (maxTextWidth / textRect.width));
        setFontSize(Math.min(fittedFontSize, maxFontSize));
      }

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [chars.length, maxFontSize, minFontSize, scale]);

  useEffect(() => {
    const invalidateCache = () => {
      centersRef.current = [];
    };
    const debouncedSetSize = debounce(() => {
      setSize();
      invalidateCache();
    }, 100);
    debouncedSetSize();
    window.addEventListener('resize', debouncedSetSize);
    return () => {
      window.removeEventListener('resize', debouncedSetSize);
    };
  }, [setSize]);

  useEffect(() => {
    let rafId;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        if (centersRef.current.length === 0) {
          const titleRect = titleRef.current.getBoundingClientRect();
          maxDistRef.current = titleRect.width / 2;

          const scrollX = window.scrollX;
          const scrollY = window.scrollY;
          const centers = [];
          spansRef.current.forEach((span) => {
            if (!span) return;
            const rect = span.getBoundingClientRect();
            centers.push({
              docX: rect.left + rect.width / 2 + scrollX,
              docY: rect.top + rect.height / 2 + scrollY,
            });
          });
          centersRef.current = centers;
        }

        const maxDist = maxDistRef.current || 200;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        spansRef.current.forEach((span, idx) => {
          if (!span) return;
          const cached = centersRef.current[idx];
          if (!cached) return;

          const charCenter = {
            x: cached.docX - scrollX,
            y: cached.docY - scrollY,
          };

          const d = dist(mouseRef.current, charCenter);

          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          if (span.style.fontVariationSettings !== newFontVariationSettings) {
            span.style.fontVariationSettings = newFontVariationSettings;
          }
          if (alpha && span.style.opacity !== alphaVal) {
            span.style.opacity = alphaVal;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha]);

  const styleElement = useMemo(() => {
    return (
      <style>{`
          @font-face {
            font-family: '${fontFamily}';
            src: url('${fontUrl}');
            font-style: normal;
            font-display: swap;
          }
          .stroke span {
            position: relative;
            color: ${textColor};
          }
          .stroke span::after {
            content: attr(data-char);
            position: absolute;
            left: 0;
            top: 0;
            color: transparent;
            z-index: -1;
            -webkit-text-stroke-width: ${strokeWidth}px;
            -webkit-text-stroke-color: ${strokeColor};
          }
        `}</style>
    );
  }, [fontFamily, fontUrl, textColor, strokeColor, strokeWidth]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-transparent">
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${className} ${
          flex ? 'flex justify-between' : ''
        } ${stroke ? 'stroke' : ''} uppercase text-center`}
        style={{
          fontFamily,
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          width: '100%',
          boxSizing: 'border-box',
          paddingInline: edgePadding,
          fontWeight: 100,
          color: stroke ? undefined : textColor,
        }}
      >
        {chars.map((char, i) => (
          <span key={i} ref={(el) => (spansRef.current[i] = el)} data-char={char} className="inline-block">
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
