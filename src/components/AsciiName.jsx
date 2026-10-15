import { useEffect, useRef, useState } from 'react';
import Reveal from './ui/Reveal';
import { afterLoad } from './field/defer';

/**
 * AsciiName — the hero h1. A real `<h1>` always stays in the DOM (screen readers, SEO, the no-WebGL
 * fallback). After the page has loaded, a WebGL canvas that draws the same name out of glyphs is loaded
 * lazily; once its first frame is on screen it crossfades in and the h1 text becomes visually hidden.
 *
 * `status`: 'idle' (plain text, height reserved so nothing shifts) | 'ready' (canvas shown) | 'plain'
 * (WebGL unavailable or lost: plain text, no reserved height).
 */
const AsciiName = ({ text, className = '' }) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    let cancelled = false;
    let engine = null;

    const cancelLoad = afterLoad(() => {
      import('./field/nameEngine')
        .then(({ createNameEngine }) =>
          createNameEngine(canvas, wrap, {
            text,
            onFirstFrame: () => !cancelled && setStatus('ready'),
            onLost: () => !cancelled && setStatus('plain'),
            aborted: () => cancelled,
          }),
        )
        .then((created) => {
          if (!created) {
            if (!cancelled) setStatus('plain');
            return;
          }
          if (cancelled) created.destroy();
          else engine = created;
        })
        .catch(() => {
          if (!cancelled) setStatus('plain');
        });
    });

    return () => {
      cancelled = true;
      cancelLoad();
      engine?.destroy();
    };
  }, [text]);

  return (
    <Reveal delay={0.06} className={`ascii-name ${className}`} data-status={status} data-ascii-name="">
      <div ref={wrapRef} className="ascii-name__box">
        <h1 id="hero-title" className="text-display ascii-name__text">
          {text}
        </h1>
        <canvas ref={canvasRef} className="ascii-name__canvas" aria-hidden="true" />
      </div>
    </Reveal>
  );
};

export default AsciiName;
