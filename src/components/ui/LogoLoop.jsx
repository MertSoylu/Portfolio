import { useRef, useState, useEffect } from 'react';

const LogoLoop = ({
  logos = [],
  speed = 90,
  direction = 'right',
  logoHeight = 40,
  gap = 80,
  hoverSpeed = 20,
  fadeOut = false,
  scaleOnHover = false,
  className = '',
  renderItem,
}) => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const rafRef = useRef(null);
  const xRef = useRef(0);
  const lastRef = useRef(0);

  const itemW = logoHeight * 3;
  const items = [...logos, ...logos, ...logos];
  const totalW = logos.length * (itemW + gap);

  useEffect(() => {
    lastRef.current = 0;

    const tick = (time) => {
      if (!innerRef.current) return;
      if (!lastRef.current) lastRef.current = time;
      const delta = (time - lastRef.current) / 1000;
      lastRef.current = time;

      const currentSpeed = hovering ? hoverSpeed : speed;
      const sign = direction === 'right' ? 1 : -1;
      xRef.current += sign * currentSpeed * delta;

      if (xRef.current < -totalW) xRef.current += totalW;
      if (xRef.current > 0) xRef.current -= totalW;

      innerRef.current.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed, direction, hoverSpeed, hovering, totalW]);

  return (
    <div
      ref={outerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {fadeOut && (
        <>
          <div
            className="absolute inset-y-0 left-0 w-10 sm:w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgb(var(--canvas)), transparent)' }}
          />
          <div
            className="absolute inset-y-0 right-0 w-10 sm:w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, rgb(var(--canvas)), transparent)' }}
          />
        </>
      )}
      <div ref={innerRef} className="flex items-center" style={{ gap: `${gap}px`, width: 'max-content' }}>
        {items.map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center shrink-0"
            style={{
              width: `${itemW}px`,
              height: `${logoHeight * 1.6}px`,
              opacity: 0.85,
              transition: 'opacity 0.3s, transform 0.3s',
            }}
            onMouseEnter={(e) => {
              if (scaleOnHover) {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scale(1.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (scaleOnHover) {
                e.currentTarget.style.opacity = '0.85';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {renderItem ? (
              renderItem(logo, i)
            ) : typeof logo === 'string' ? (
              <img
                src={logo}
                alt=""
                style={{ height: `${logoHeight}px`, width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ fontSize: `${logoHeight}px`, lineHeight: 1, display: 'flex' }}>{logo}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
