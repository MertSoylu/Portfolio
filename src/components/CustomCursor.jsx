import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const trailsRef = useRef([]);
  const posRef = useRef({ x: -100, y: -100 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const trailCount = 8;
    const trails = [];

    // Create trail elements
    for (let i = 0; i < trailCount; i++) {
      const el = document.createElement('div');
      el.className = 'cursor-trail';
      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(240, 125, 45, ${0.4 - i * 0.04}), transparent);
        width: ${12 - i}px;
        height: ${12 - i}px;
        transition: none;
        will-change: transform;
      `;
      document.body.appendChild(el);
      trails.push({ el, x: -100, y: -100 });
    }
    trailsRef.current = trails;

    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    let animId;
    const animate = () => {
      let prevX = posRef.current.x;
      let prevY = posRef.current.y;

      trails.forEach((trail, i) => {
        const speed = 0.3 - i * 0.02;
        trail.x += (prevX - trail.x) * speed;
        trail.y += (prevY - trail.y) * speed;
        trail.el.style.transform = `translate(${trail.x - 6}px, ${trail.y - 6}px)`;
        prevX = trail.x;
        prevY = trail.y;
      });

      animId = requestAnimationFrame(animate);
    };

    const handleMouseDown = () => {
      trails.forEach((trail) => {
        trail.el.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
        trail.el.style.transform = `translate(${trail.x - 6}px, ${trail.y - 6}px) scale(1.6)`;
        trail.el.style.opacity = '0.9';
        setTimeout(() => {
          trail.el.style.transition = 'none';
          trail.el.style.opacity = '';
        }, 150);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animId);
      trails.forEach((t) => {
        if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
      });
    };
  }, [isDesktop]);

  if (!isDesktop) return null;
  return null;
};

export default CustomCursor;
