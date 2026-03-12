import { useState, useRef, useCallback, useEffect } from 'react';

const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      setStyle({
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`,
        transition: 'transform 0.1s ease',
      });
      setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)',
      transition: 'transform 0.4s ease',
    });
    setGlowPos({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`card-border-glow ${className}`}
      style={{
        ...style,
        transition: style.transition,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(240,125,45,0.22) 0%, rgba(240,125,45,0.06) 40%, transparent 65%)`,
          transition: 'background 0.15s ease, opacity 0.3s ease',
        }}
      />
      {children}
    </div>
  );
};

export default TiltCard;
