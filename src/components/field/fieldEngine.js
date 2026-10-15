// The Signal Field engine: a fixed full-viewport WebGL canvas that renders a living ASCII field.
// Framework-free so it can be unit-reasoned about; AsciiField.jsx is the thin React wrapper.
//
// Per frame the CPU sets ~20 uniforms and issues two tiny draw calls (a cell-resolution field pass and a
// full-resolution glyph pass). Nothing is allocated per frame; the loop stops when the tab is hidden and
// is never started under prefers-reduced-motion (one static frame instead).

import {
  createCellTarget,
  createGL,
  createProgram,
  createQuad,
  createTexture,
  fieldDpr,
  hasHighp,
  isSmallScreen,
  loadFonts,
  observeTheme,
  prefersReducedMotion,
  readTheme,
  resizeCellTarget,
  uploadSource,
  watchReducedMotion,
} from './gl';
import { FONT_SPECS, GLYPHS, buildAtlas, cellMetrics } from './atlas';
import { FIELD_UNIFORMS, FRAG_FIELD, FRAG_GLYPHS, GLYPH_UNIFORMS, VERT } from './shaders';
import { createLoop } from './loop';

// [flow, lattice, calm, static, sweep] — eased towards the target of the current route.
const MOODS = {
  home: [1, 0, 0, 0, 1],
  area: [0.45, 1, 0.1, 0, 0.85],
  case: [0.35, 0, 1, 0, 0.5],
  notfound: [0, 0, 0, 1, 0.5],
};

const STATIC_TIME = 5.5; // a pleasant frozen frame for reduced motion
const UNIT_CELLS = 0;
const UNIT_ATLAS = 1;
const SCROLL_FACTOR = 0.15;
const ACTIVE_MS = 2000; // keep 60 fps this long after the last input
const RIPPLE_LIFE = 2.3;

// [base glyph alpha, lens glyph alpha, vignette strength]. Base glyphs stay faint, and the lens (which sits under
// the pointer, usually over text) is capped so the text colours keep ~4.5:1 under its densest glyph strokes
// (worst-case pixel incl. the glow: dark 25% total alpha -> fg 11.9:1, muted 4.6:1, accent 4.5:1; light 14% ->
// fg 14.9:1, muted 5.1:1, accent 4.5:1). The sweep head (2x lens) and ripples (1.75x) are transient and may reach
// ~45% / 40% (dark), where fg text keeps 7.9:1+ and muted/accent text 3:1+ for the fraction of a second they pass.
const TONE = {
  dark: [0.12, 0.2, 0.55],
  light: [0.09, 0.11, 0.5],
};

export const createFieldEngine = async (canvas, { mood = 'home', onFirstFrame, onLost, aborted } = {}) => {
  let disposed = false;

  await loadFonts(FONT_SPECS, GLYPHS);
  // Check right before touching the canvas: React StrictMode (dev) mounts, unmounts and remounts the same <canvas>.
  if (aborted?.()) return null;

  const small = isSmallScreen();
  const state = {
    gl: null,
    p1: null,
    p2: null,
    quad: null,
    cells: null,
    atlasTex: null,
    atlas: null,
    cols: 0,
    rows: 0,
    dpr: 1,
    cssW: 0,
    cssH: 0,
    cellKey: '',
  };

  let reduced = prefersReducedMotion();
  let theme = readTheme();
  let lost = false;
  let drewFirst = false;
  let t0 = performance.now();

  const moodNow = Float32Array.from(MOODS[mood] || MOODS.home);
  const moodTarget = Float32Array.from(moodNow);

  const ptr = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, lens: 0, lensT: 0, has: false };
  const ripples = new Float32Array(16);
  let rippleIdx = 0;
  let lastRippleT = -10;
  let lastInput = -1e9;
  let scroll = 0;

  // ---- GL resources ---------------------------------------------------------------------------------------

  const buildGL = () => {
    const gl = createGL(canvas);
    if (!gl) return false;
    try {
      state.gl = gl;
      state.p1 = createProgram(gl, VERT, FRAG_FIELD, FIELD_UNIFORMS);
      state.p2 = createProgram(gl, VERT, FRAG_GLYPHS, GLYPH_UNIFORMS);
      if (!hasHighp(gl)) console.warn('Signal Field: highp unavailable, expect banding');
      state.quad = createQuad(gl);
      state.cells = createCellTarget(gl, UNIT_CELLS);
      state.atlasTex = createTexture(gl, UNIT_ATLAS, { filter: 'nearest' });
      gl.clearColor(0, 0, 0, 0);
      state.cellKey = '';
      state.cols = 0;
      return true;
    } catch (error) {
      console.warn('Signal Field disabled:', error);
      return false;
    }
  };

  const applyTheme = () => {
    theme = readTheme();
    const { gl, p2 } = state;
    if (!gl || lost) return;
    gl.useProgram(p2.program);
    gl.uniform3f(p2.u.uFg, theme.fg[0], theme.fg[1], theme.fg[2]);
    // `--accent` is the text-safe orange: Claude orange on dark, the darker A8452A on light.
    gl.uniform3f(p2.u.uSignal, theme.accent[0], theme.accent[1], theme.accent[2]);
  };

  const layout = () => {
    const { gl } = state;
    if (!gl || lost) return false;
    const cssW = canvas.clientWidth || window.innerWidth;
    const cssH = canvas.clientHeight || window.innerHeight;
    const dpr = fieldDpr();
    const { cw, ch } = cellMetrics(small ? 12 : 14, dpr);
    const key = `${cssW}x${cssH}@${dpr}:${cw}x${ch}`;
    if (key === state.cellKey) return false;
    state.cellKey = key;

    state.cssW = cssW;
    state.cssH = cssH;
    state.dpr = dpr;
    canvas.width = Math.max(1, Math.round(cssW * dpr));
    canvas.height = Math.max(1, Math.round(cssH * dpr));
    state.cols = Math.ceil(canvas.width / cw);
    state.rows = Math.ceil(canvas.height / ch);

    if (!state.atlas || state.atlas.cw !== cw || state.atlas.ch !== ch) {
      const atlas = buildAtlas({ cw, ch });
      if (!atlas) return false;
      state.atlas = atlas;
      uploadSource(gl, UNIT_ATLAS, state.atlasTex, atlas.canvas);
    }
    resizeCellTarget(gl, UNIT_CELLS, state.cells, state.cols, state.rows);

    const { p1, p2, atlas } = state;
    gl.useProgram(p1.program);
    gl.uniform2f(p1.u.uGrid, state.cols, state.rows);
    gl.uniform2f(p1.u.uCellCss, cw / dpr, ch / dpr);
    gl.uniform2f(p1.u.uView, cssW, cssH);

    gl.useProgram(p2.program);
    gl.uniform1i(p2.u.uCells, UNIT_CELLS);
    gl.uniform1i(p2.u.uAtlas, UNIT_ATLAS);
    gl.uniform2f(p2.u.uGrid, state.cols, state.rows);
    gl.uniform2f(p2.u.uCellPx, cw, ch);
    gl.uniform2f(p2.u.uCanvasPx, canvas.width, canvas.height);
    gl.uniform2f(p2.u.uAtlasSlots, atlas.cols, atlas.rows);
    gl.uniform2f(p2.u.uAtlasPx, atlas.width, atlas.height);
    return true;
  };

  // ---- Drawing --------------------------------------------------------------------------------------------

  const draw = (time, sweepOn) => {
    const { gl, p1, p2, cells } = state;
    const tone = theme.isDark ? TONE.dark : TONE.light;

    gl.bindFramebuffer(gl.FRAMEBUFFER, cells.fbo);
    gl.viewport(0, 0, state.cols, state.rows);
    gl.useProgram(p1.program);
    gl.uniform1f(p1.u.uTime, time);
    gl.uniform1f(p1.u.uScroll, scroll);
    gl.uniform4f(p1.u.uMood, moodNow[0], moodNow[1], moodNow[2], moodNow[3]);
    gl.uniform3f(p1.u.uPointer, ptr.x, ptr.y, ptr.lens);
    gl.uniform4fv(p1.u.uRip, ripples);
    gl.uniform4f(p1.u.uTone, tone[0], tone[1], sweepOn ? moodNow[4] : 0, tone[2]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(p2.program);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (!drewFirst) {
      drewFirst = true;
      onFirstFrame?.();
    }
  };

  const renderStatic = () => {
    if (!state.gl || lost) return;
    moodNow.set(moodTarget);
    ptr.lens = 0;
    ptr.x = ptr.y = -1e4;
    ripples.fill(0);
    scroll = 0;
    draw(STATIC_TIME, false);
  };

  const ease = (rate, dt) => 1 - Math.exp(-rate * dt);

  const loop = createLoop((now, dt) => {
    const time = (now - t0) / 1000;

    for (let i = 0; i < 5; i += 1) moodNow[i] += (moodTarget[i] - moodNow[i]) * ease(1.6, dt);

    const k = ease(13, dt);
    if (ptr.has) {
      ptr.x += (ptr.tx - ptr.x) * k;
      ptr.y += (ptr.ty - ptr.y) * k;
    }
    ptr.lens += (ptr.lensT - ptr.lens) * ease(5, dt);
    if (ptr.lens < 0.002 && ptr.lensT === 0) ptr.lens = 0;

    const scrollTarget = (window.scrollY || 0) * SCROLL_FACTOR;
    const scrollDelta = scrollTarget - scroll;
    scroll += scrollDelta * ease(5, dt);

    draw(time, true);

    const busy =
      now - lastInput < ACTIVE_MS ||
      time - lastRippleT < RIPPLE_LIFE ||
      Math.abs(scrollDelta) > 0.5 ||
      Math.abs(ptr.lens - ptr.lensT) > 0.01;
    return small ? 1000 / 30 : busy ? 0 : 1000 / 24;
  });

  const syncLoop = () => {
    const shouldRun = !disposed && !lost && !reduced && !document.hidden && !!state.gl;
    if (shouldRun) loop.start();
    else loop.stop();
  };

  const refresh = () => {
    if (!state.gl || lost) return;
    if (reduced) renderStatic();
  };

  // ---- Input ----------------------------------------------------------------------------------------------

  const addRipple = (x, y, now) => {
    const o = (rippleIdx++ % 4) * 4;
    lastRippleT = (now - t0) / 1000;
    ripples[o] = x;
    ripples[o + 1] = y;
    ripples[o + 2] = lastRippleT;
    ripples[o + 3] = 1;
  };

  const aim = (x, y) => {
    ptr.tx = x;
    ptr.ty = y;
    if (!ptr.has) {
      ptr.x = x;
      ptr.y = y;
      ptr.has = true;
    }
  };

  const onMove = (event) => {
    if (reduced || event.pointerType === 'touch') return;
    aim(event.clientX, event.clientY);
    ptr.lensT = 1;
    lastInput = performance.now();
  };

  const onDown = (event) => {
    if (reduced || !event.isPrimary) return;
    const now = performance.now();
    lastInput = now;
    aim(event.clientX, event.clientY);
    if (event.pointerType === 'touch') {
      ptr.x = event.clientX;
      ptr.y = event.clientY;
      ptr.lensT = 1;
    }
    addRipple(event.clientX, event.clientY, now);
  };

  const onUp = (event) => {
    if (event.pointerType === 'touch') ptr.lensT = 0;
  };

  const onLeave = () => {
    ptr.lensT = 0;
    lastInput = performance.now();
  };

  // ---- Lifecycle ------------------------------------------------------------------------------------------

  if (!buildGL() || !layout()) {
    disposed = true;
    return null;
  }
  applyTheme();
  if (reduced) renderStatic();
  syncLoop();

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (layout()) {
        if (reduced || !loop.running) {
          if (reduced) renderStatic();
          else draw((performance.now() - t0) / 1000, true);
        }
      }
    }, 120);
  };

  const onContextLost = (event) => {
    event.preventDefault();
    lost = true;
    loop.stop();
    onLost?.();
  };

  const onContextRestored = () => {
    if (disposed) return;
    if (buildGL() && layout()) {
      lost = false;
      drewFirst = false;
      applyTheme();
      if (reduced) renderStatic();
      syncLoop();
    }
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('pointercancel', onUp, { passive: true });
  window.addEventListener('blur', onLeave);
  document.documentElement.addEventListener('mouseleave', onLeave);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', syncLoop);
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
  resizeObserver?.observe(canvas);

  const stopTheme = observeTheme(() => {
    applyTheme();
    refresh();
  });
  const stopMotion = watchReducedMotion((value) => {
    reduced = value;
    ptr.lensT = 0;
    if (reduced) renderStatic();
    syncLoop();
  });

  return {
    setMood(name) {
      moodTarget.set(MOODS[name] || MOODS.home);
      if (reduced) renderStatic();
    },
    destroy() {
      disposed = true;
      loop.stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('blur', onLeave);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', syncLoop);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      resizeObserver?.disconnect();
      stopTheme();
      stopMotion();
      const { gl } = state;
      if (gl && !lost) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    },
  };
};
