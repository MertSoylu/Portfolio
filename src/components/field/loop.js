// A tiny requestAnimationFrame driver with a frame-rate ceiling that the tick can change on the fly
// (60 fps while the user interacts, 30 fps otherwise, 30 fps always on phones). It allocates nothing per frame.

export const createLoop = (tick) => {
  let raf = 0;
  let running = false;
  let last = 0;
  let minInterval = 0;

  const frame = (now) => {
    raf = window.requestAnimationFrame(frame);
    // 1.5 ms of slack so a 33 ms cap lands on every second 60 Hz vsync instead of drifting to every third.
    if (last && now - last < minInterval - 1.5) return;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
    last = now;
    minInterval = tick(now, dt) || 0;
  };

  return {
    start() {
      if (running) return;
      running = true;
      last = 0;
      minInterval = 0;
      raf = window.requestAnimationFrame(frame);
    },
    stop() {
      if (!running) return;
      running = false;
      window.cancelAnimationFrame(raf);
    },
    get running() {
      return running;
    },
  };
};
