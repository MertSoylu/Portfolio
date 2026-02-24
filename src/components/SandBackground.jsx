import React, { useEffect, useRef } from 'react';

const SandBackground = ({ isDark }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 90;
    const connectionDistance = isMobile ? 80 : 120;
    const mouseRadius = 150;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.baseSpeedX = Math.random() * 0.5 - 0.25;
        this.baseSpeedY = Math.random() * 0.5 - 0.25;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
        this.opacity = Math.random() * 0.4 + 0.1;

        const hue = isDark ? 220 : 38;
        const sat = isDark ? 30 + Math.random() * 20 : 60 + Math.random() * 20;
        const light = isDark ? 45 + Math.random() * 20 : 60 + Math.random() * 20;
        this.color = `hsla(${hue}, ${sat}%, ${light}%, ${this.opacity})`;
      }

      update() {
        // Mouse repel effect
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius && dist > 0) {
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          this.speedX += Math.cos(angle) * force * 2;
          this.speedY += Math.sin(angle) * force * 2;
        }

        // Damping — return to base speed
        this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
        this.speedY += (this.baseSpeedY - this.speedY) * 0.05;

        this.x += this.speedX;
        this.y += this.speedY;

        // Subtle wave movement
        this.speedY += Math.sin(Date.now() * 0.0001) * 0.005;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.15;
            ctx.strokeStyle = isDark
              ? `rgba(100, 140, 200, ${opacity})`
              : `rgba(196, 168, 144, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    let animId;

    const animate = () => {
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isDark) {
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#131b30');
        gradient.addColorStop(1, '#1a2236');
      } else {
        gradient.addColorStop(0, '#faf8f3');
        gradient.addColorStop(0.5, '#f5f1e8');
        gradient.addColorStop(1, '#ede6db');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Wave effect
      ctx.strokeStyle = isDark
        ? 'rgba(100, 140, 200, 0.06)'
        : 'rgba(196, 168, 144, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x += 50) {
        const y =
          canvas.height / 2 +
          Math.sin((x + Date.now() * 0.0005) * 0.01) * 30;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Constellation connections
      drawConnections();

      // Particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default SandBackground;
