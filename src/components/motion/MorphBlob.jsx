import React, { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * MorphBlob — an organic, slowly morphing duotone blob used as a soft backdrop
 * accent behind heroes and section headers. Pure SVG path interpolation via
 * framer-motion, so it stays crisp at any size and is GPU-cheap.
 *
 * Respects prefers-reduced-motion (renders a static blob with no animation).
 */
const SHAPES = [
  'M43.6,-62.5C56.4,-53.9,66.5,-40.9,71.4,-26C76.3,-11.1,76,5.7,70.4,19.9C64.8,34.1,53.9,45.7,41,54.9C28,64.1,12.9,70.9,-2.5,74.3C-17.9,77.7,-35.8,77.7,-49.3,69.4C-62.8,61.1,-71.9,44.5,-75.8,27.4C-79.7,10.3,-78.4,-7.3,-72,-22.6C-65.6,-37.9,-54.1,-50.9,-40.6,-59.4C-27.1,-67.9,-13.6,-71.9,1.2,-73.5C16,-75.2,32,-71.1,43.6,-62.5Z',
  'M38.5,-55.6C50.9,-47.4,62.5,-37.4,67.9,-24.5C73.3,-11.6,72.5,4.2,67.3,18.3C62.1,32.4,52.5,44.8,40.3,54.4C28.1,64,13.1,70.8,-2.5,74.2C-18.1,77.6,-34.3,77.6,-47.1,69.3C-59.9,61,-69.3,44.4,-73.6,27.1C-77.9,9.8,-77.1,-8.2,-70.6,-23.3C-64.1,-38.4,-51.9,-50.6,-38.5,-58.6C-25.1,-66.6,-12.6,-70.4,0.8,-71.5C14.1,-72.6,28.2,-71,38.5,-55.6Z',
  'M47.7,-66.8C61.2,-58.1,71,-43.7,75.3,-28C79.6,-12.3,78.4,4.7,72.6,19.4C66.8,34.1,56.4,46.5,43.5,56.1C30.6,65.7,15.3,72.5,-0.7,73.5C-16.7,74.5,-33.4,69.7,-46.8,60.2C-60.2,50.7,-70.3,36.5,-74.6,20.6C-78.9,4.7,-77.4,-12.9,-70.4,-27.6C-63.4,-42.3,-50.9,-54.1,-37.1,-62.5C-23.3,-70.9,-8.2,-75.9,4.6,-72.9C17.4,-69.9,34.2,-75.5,47.7,-66.8Z',
];

const MorphBlob = ({
  className = '',
  from = '#7c5cff',
  to = '#27e0c4',
  opacity = 0.55,
  duration = 16,
  blur = 0,
}) => {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, '');
  const loop = [SHAPES[0], SHAPES[1], SHAPES[2], SHAPES[0]];

  return (
    <svg
      viewBox="-100 -100 200 200"
      className={className}
      style={{ filter: blur ? `blur(${blur}px)` : undefined, opacity }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <motion.path
        fill={`url(#grad-${id})`}
        initial={{ d: SHAPES[0] }}
        animate={reduce ? { d: SHAPES[0] } : { d: loop }}
        transition={
          reduce ? undefined : { duration, repeat: Infinity, ease: 'easeInOut', times: [0, 0.33, 0.66, 1] }
        }
      />
    </svg>
  );
};

export default MorphBlob;
