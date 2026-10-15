// Kept apart from gl.js so the (tiny) scheduling helper can live in the main bundle while the WebGL code
// stays in lazy chunks.

/** Runs `callback` after the window `load` event and a browser-idle moment, so it never competes with LCP. */
export const afterLoad = (callback, idleTimeout = 1500) => {
  let cancelled = false;
  let idleId = 0;
  let timeoutId = 0;

  const run = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(() => !cancelled && callback(), { timeout: idleTimeout });
    } else {
      timeoutId = window.setTimeout(() => !cancelled && callback(), 120);
    }
  };

  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener('load', run);
    if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
    window.clearTimeout(timeoutId);
  };
};
