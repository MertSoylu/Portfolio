import React, { useState, useEffect, lazy, Suspense } from 'react';

const Threads = lazy(() => import('./Threads'));

const SandBackground = ({ isDark }) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [showThreads, setShowThreads] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        setShowThreads(true);
      } else {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Threads color prop takes [r, g, b] normalized 0-1
  const lightColor = [0.94, 0.49, 0.18]; // #f07d2d warm orange
  const darkColor = [1.0, 0.60, 0.36];   // #ff9a5c soft orange

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-500 pointer-events-none"
      style={{ backgroundColor: isDark ? '#0f172a' : '#faf8f3' }}
      role="presentation"
      aria-hidden="true"
    >
      {hasWebGL && showThreads ? (
        <Suspense fallback={null}>
          <Threads
            color={isDark ? darkColor : lightColor}
            amplitude={0.8}
            distance={0.3}
            enableMouseInteraction={true}
          />
        </Suspense>
      ) : (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, #0f172a 0%, #131b30 50%, #1a2236 100%)'
              : 'linear-gradient(180deg, #faf8f3 0%, #f5f1e8 50%, #ede6db 100%)',
          }}
        />
      )}
    </div>
  );
};

export default SandBackground;
