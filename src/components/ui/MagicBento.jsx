import { useRef, useEffect } from 'react';

const DEFAULT_GLOW_COLOR = '194, 86, 47';

const BentoCard = ({ children, className = '', glowColor = DEFAULT_GLOW_COLOR }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--glow-x', `${x}%`);
      el.style.setProperty('--glow-y', `${y}%`);
      el.style.setProperty('--glow-intensity', '1');
    };

    const handleMouseLeave = () => {
      el.style.setProperty('--glow-intensity', '0');
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [glowColor]);

  return (
    <div className={`bento-card ${className}`} ref={cardRef}>
      {children}
    </div>
  );
};

const MagicBento = ({ items = [], glowColor = DEFAULT_GLOW_COLOR, className = '' }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        el.style.setProperty('--cursor-x', `${e.clientX}px`);
        el.style.setProperty('--cursor-y', `${e.clientY}px`);
        el.style.setProperty('--spotlight-opacity', '1');
      } else {
        el.style.setProperty('--spotlight-opacity', '0');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`bento-grid relative ${className}`}
      style={{
        '--glow-color': glowColor,
        '--cursor-x': '50%',
        '--cursor-y': '50%',
        '--spotlight-opacity': '0',
      }}
    >
      {items.map((item, index) => (
        <BentoCard key={index} glowColor={glowColor} className={item.className || ''}>
          {item.content}
        </BentoCard>
      ))}
      <div
        className="pointer-events-none fixed w-[600px] h-[600px] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          left: 'var(--cursor-x)',
          top: 'var(--cursor-y)',
          background: `radial-gradient(circle, rgba(${glowColor}, 0.08) 0%, rgba(${glowColor}, 0.04) 25%, transparent 60%)`,
          opacity: 'var(--spotlight-opacity)',
          transition: 'opacity 0.3s ease',
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default MagicBento;
