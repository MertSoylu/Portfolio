import { useEffect, useRef } from 'react';

const CHARSET = ' .,:;i1tfLX#MW&8%B@$';

const ASCIIText = ({ text = 'Mert Soylu', asciiFontSize = 11, enableWaves = true, className = '' }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const preRef = useRef(null);
  const stateRef = useRef({ time: 0, raf: null });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const pre = preRef.current;
    if (!container || !canvas || !pre) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const tick = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) {
        stateRef.current.raf = requestAnimationFrame(tick);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio, 2);
      const state = stateRef.current;
      state.time += 0.02;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      // Size the rasterized text by height, then shrink to fit width so long
      // names never overflow/clip on narrow (mobile) canvases.
      let fontSize = Math.round(h * 0.78);
      ctx.font = `900 ${fontSize}px Inter, system-ui, sans-serif`;
      const maxTextW = w * 0.99;
      const measured = ctx.measureText(text).width;
      if (measured > maxTextW) {
        fontSize = Math.max(10, Math.floor((fontSize * maxTextW) / measured));
        ctx.font = `900 ${fontSize}px Inter, system-ui, sans-serif`;
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const wave = enableWaves ? Math.sin(state.time) * 3 : 0;
      const bob = enableWaves ? Math.cos(state.time * 0.7) * 2 : 0;
      ctx.fillText(text, w / 2 + wave, h / 2 + bob);

      const cols = Math.floor(w / (asciiFontSize * 0.7));
      const rows = Math.floor(h / asciiFontSize);

      // Sample the full device-pixel buffer. Canvas is scaled by dpr, so reading
      // only the CSS-px region (w×h) would grab the top-left 1/dpr² of the glyphs
      // — text ends up clipped/off-center on dpr>1 screens (most phones).
      const cw = canvas.width;
      const ch = canvas.height;
      const imgData = ctx.getImageData(0, 0, cw, ch);
      const data = imgData.data;

      let str = '';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = Math.floor((x / cols) * cw);
          const py = Math.floor((y / rows) * ch);
          const i = (px + py * cw) * 4;
          const r = data[i] || 0;
          const g = data[i + 1] || 0;
          const b = data[i + 2] || 0;
          const brightness = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
          const idx = Math.min(Math.floor(brightness * CHARSET.length), CHARSET.length - 1);
          str += CHARSET[idx];
        }
        str += '\n';
      }
      pre.textContent = str;

      stateRef.current.raf = requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    stateRef.current.raf = id;
    return () => cancelAnimationFrame(id);
  }, [text, asciiFontSize, enableWaves]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 opacity-0 pointer-events-none" />
      <pre
        ref={preRef}
        className="m-0 p-0 text-center select-none leading-[1em] font-bold"
        style={{
          fontSize: `${asciiFontSize}px`,
          fontFamily: "'Courier New', monospace",
          color: '#C2562F',
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textShadow: '0 0 4px rgba(194,86,47,0.25)',
        }}
      />
    </div>
  );
};

export default ASCIIText;
