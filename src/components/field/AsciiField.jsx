import { useEffect, useRef } from 'react';

/**
 * AsciiField — the Signal Field background. One fixed full-viewport WebGL canvas (aria-hidden, behind all
 * content, pointer-events none) that draws a living ASCII field. `mood` ('home' | 'area' | 'case' | 'notfound')
 * is eased inside the engine on route changes. While the field runs, <html data-field="on"> fades the CSS
 * `.site-bg` fallback out; if WebGL is unavailable (or the context is lost) the fallback simply stays.
 */
const AsciiField = ({ mood = 'home' }) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const moodRef = useRef(mood);
  moodRef.current = mood;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let cancelled = false;
    const root = document.documentElement;

    const show = () => {
      if (cancelled) return;
      canvas.dataset.on = 'true';
      root.dataset.field = 'on';
    };
    const hide = () => {
      canvas.dataset.on = 'false';
      delete root.dataset.field;
    };

    import('./fieldEngine')
      .then(({ createFieldEngine }) =>
        createFieldEngine(canvas, {
          mood: moodRef.current,
          onFirstFrame: show,
          onLost: hide,
          aborted: () => cancelled,
        }),
      )
      .then((engine) => {
        if (!engine) return;
        if (cancelled) {
          engine.destroy();
          return;
        }
        engineRef.current = engine;
        engine.setMood(moodRef.current);
      })
      .catch((error) => console.warn('Signal Field unavailable:', error));

    return () => {
      cancelled = true;
      engineRef.current?.destroy();
      engineRef.current = null;
      hide();
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setMood(mood);
  }, [mood]);

  return <canvas ref={canvasRef} className="field-canvas" aria-hidden="true" data-on="false" />;
};

export default AsciiField;
