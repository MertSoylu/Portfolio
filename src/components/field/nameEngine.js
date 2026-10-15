// The hero name engine: "Mert Soylu" rendered as ASCII by a shader that samples a text mask.
//
// The mask (Geist Variable 700) is drawn once on an offscreen 2D canvas and uploaded as a texture. Pass 1 turns
// it into per-cell glyph indices (dense inside the letters, lighter on edges) plus shimmer, a signal sweep,
// cursor scatter and the one-shot decode intro; pass 2 (shared with the field) draws the glyphs.
// The loop is paused when the hero is off-screen, when the tab is hidden and under prefers-reduced-motion
// (one static frame instead).

import {
  createCellTarget,
  createGL,
  createProgram,
  createQuad,
  createTexture,
  loadFonts,
  nameDpr,
  observeTheme,
  prefersReducedMotion,
  readTheme,
  resizeCellTarget,
  uploadSource,
  watchReducedMotion,
} from './gl';
import { FONT_SPECS, GLYPHS, buildAtlas, cellMetrics } from './atlas';
import { FRAG_GLYPHS, FRAG_NAME, GLYPH_UNIFORMS, NAME_UNIFORMS, VERT } from './shaders';
import { createLoop } from './loop';

const NAME_FONT = '"Geist Variable"';
const NAME_WEIGHT = 700;
const UNIT_CELLS = 0;
const UNIT_ATLAS = 1;
const UNIT_MASK = 2;
const INTRO_SECONDS = 1.25;
const STATIC_TIME = 7.3;
const ACTIVE_MS = 1600;

/** Lines the name is set in: one line when it is wide enough to be read, two ("Mert" / "Soylu") on phones. */
export const nameLines = (text, width) => (width < 640 ? text.split(' ') : [text]);

// Cell height in CSS px follows the name's size so the letters always span ~15 rows (legible): ~6.5px on phones
// up to ~9.5px on desktop. On 1x screens a glyph needs a few more device pixels to stay readable.
const cellHeightFor = (width, dpr) => {
  const base = Math.min(9.5, Math.max(6.5, width / 100));
  return dpr < 1.5 ? Math.max(base, 8) : base;
};

export const createNameEngine = async (canvas, container, { text, onFirstFrame, onLost, aborted } = {}) => {
  let disposed = false;

  await loadFonts([`${NAME_WEIGHT} 100px ${NAME_FONT}`, ...FONT_SPECS], text + GLYPHS);
  if (aborted?.()) return null;

  const state = {
    gl: null,
    p1: null,
    p2: null,
    cells: null,
    atlasTex: null,
    maskTex: null,
    atlas: null,
    cols: 0,
    rows: 0,
    key: '',
    cssW: 0,
    cssH: 0,
    sizeW: 0,
    sizeH: 0,
    scatterR: 110,
    scatterAmt: 50,
    mask: document.createElement('canvas'),
  };

  let reduced = prefersReducedMotion();
  let theme = readTheme();
  let lost = false;
  let drewFirst = false;
  let inView = true;
  let introT = 0;
  let time = 0;
  let lastInput = -1e9;

  // Pointer in client space, plus an underdamped spring on the scatter strength so glyphs bounce back.
  const ptr = { cx: -1e4, cy: -1e4, tx: -1e4, ty: -1e4, has: false, inside: false, s: 0, v: 0 };
  let rect = null;

  // ---- GL resources ---------------------------------------------------------------------------------------

  const buildGL = () => {
    const gl = createGL(canvas);
    if (!gl) return false;
    try {
      state.gl = gl;
      state.p1 = createProgram(gl, VERT, FRAG_NAME, NAME_UNIFORMS);
      state.p2 = createProgram(gl, VERT, FRAG_GLYPHS, GLYPH_UNIFORMS);
      createQuad(gl);
      state.cells = createCellTarget(gl, UNIT_CELLS);
      state.atlasTex = createTexture(gl, UNIT_ATLAS, { filter: 'nearest' });
      state.maskTex = createTexture(gl, UNIT_MASK, { filter: 'linear' });
      gl.clearColor(0, 0, 0, 0);
      state.key = '';
      state.atlas = null;
      return true;
    } catch (error) {
      console.warn('AsciiName disabled:', error);
      return false;
    }
  };

  const applyTheme = () => {
    theme = readTheme();
    const { gl, p1, p2 } = state;
    if (!gl || lost) return;
    gl.useProgram(p2.program);
    gl.uniform3f(p2.u.uFg, theme.fg[0], theme.fg[1], theme.fg[2]);
    gl.uniform3f(p2.u.uSignal, theme.accent[0], theme.accent[1], theme.accent[2]);
    gl.useProgram(p1.program);
    gl.uniform1f(p1.u.uFill, theme.isDark ? 0.1 : 0.07);
  };

  // Draws "Mert Soylu" (fitted to the container, one or two lines) into the mask canvas.
  const drawMask = (cssW, cssH, dpr, pxW, pxH) => {
    const mask = state.mask;
    mask.width = pxW; // resizing also clears it
    mask.height = pxH;
    const ctx = mask.getContext('2d');
    if (!ctx) return false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    const lines = nameLines(text, cssW);
    const family = `${NAME_FONT}, ui-sans-serif, system-ui, sans-serif`;
    const setFont = (px) => {
      ctx.font = `${NAME_WEIGHT} ${px}px ${family}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = `${(-0.045 * px).toFixed(2)}px`;
    };

    setFont(100);
    const widest = Math.max(...lines.map((line) => ctx.measureText(line).width));
    const cap = ctx.measureText('M').actualBoundingBoxAscent || 72;
    const descent = ctx.measureText('y').actualBoundingBoxDescent || 20;
    const advance = 92; // line advance at 100px
    const blockAt100 = cap + (lines.length - 1) * advance + descent;
    const scale = Math.min((cssW * 0.99) / widest, (cssH * 0.96) / blockAt100);
    const fontPx = 100 * scale;

    setFont(fontPx);
    const blockH = blockAt100 * scale;
    const baseline0 = (cssH - blockH) / 2 + cap * scale;
    const left = (cssW - widest * scale) / 2;
    lines.forEach((line, i) => ctx.fillText(line, left, baseline0 + i * advance * scale));
    return true;
  };

  const layout = () => {
    const { gl } = state;
    if (!gl || lost) return false;
    const cssW = Math.round(container.clientWidth);
    const cssH = Math.round(container.clientHeight);
    if (cssW < 40 || cssH < 20) return false;
    const dpr = nameDpr();
    const { cw, ch } = cellMetrics(cellHeightFor(cssW, dpr), dpr);
    const key = `${cssW}x${cssH}@${dpr}:${cw}x${ch}`;
    if (key === state.key) return false;
    state.key = key;

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    state.cssW = cssW;
    state.cssH = cssH;
    state.cols = Math.ceil(canvas.width / cw);
    state.rows = Math.ceil(canvas.height / ch);
    const gridPxW = state.cols * cw;
    const gridPxH = state.rows * ch;
    state.sizeW = gridPxW / dpr;
    state.sizeH = gridPxH / dpr;
    state.scatterR = cssW < 640 ? 84 : 125;
    state.scatterAmt = cssW < 640 ? 38 : 58;

    // The mask covers exactly the cell grid (a few px more than the canvas).
    if (!drawMask(cssW, cssH, dpr, gridPxW, gridPxH)) return false;
    uploadSource(gl, UNIT_MASK, state.maskTex, state.mask);

    if (!state.atlas || state.atlas.cw !== cw || state.atlas.ch !== ch) {
      const atlas = buildAtlas({ cw, ch });
      if (!atlas) return false;
      state.atlas = atlas;
      uploadSource(gl, UNIT_ATLAS, state.atlasTex, atlas.canvas);
    }
    resizeCellTarget(gl, UNIT_CELLS, state.cells, state.cols, state.rows);

    const { p1, p2, atlas } = state;
    gl.useProgram(p1.program);
    gl.uniform1i(p1.u.uMask, UNIT_MASK);
    gl.uniform2f(p1.u.uGrid, state.cols, state.rows);
    gl.uniform2f(p1.u.uCellCss, cw / dpr, ch / dpr);
    gl.uniform2f(p1.u.uSizeCss, state.sizeW, state.sizeH);

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

  const draw = (t, intro, scatter, sweep) => {
    const { gl, p1, p2, cells } = state;
    gl.bindFramebuffer(gl.FRAMEBUFFER, cells.fbo);
    gl.viewport(0, 0, state.cols, state.rows);
    gl.useProgram(p1.program);
    gl.uniform1f(p1.u.uTime, t);
    gl.uniform1f(p1.u.uIntro, intro);
    gl.uniform3f(p1.u.uPointer, ptr.cx - (rect ? rect.left : 0), ptr.cy - (rect ? rect.top : 0), scatter);
    gl.uniform2f(p1.u.uScatter, state.scatterR, state.scatterAmt);
    gl.uniform1f(p1.u.uSweep, sweep);
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
    draw(STATIC_TIME, 1, 0, 0);
  };

  const small = () => state.cssW < 640;

  const loop = createLoop((now, dt) => {
    time += dt;
    introT = Math.min(INTRO_SECONDS, introT + dt);

    // Scatter target: 1 while the pointer is near the name, else 0; the spring gives the bounce back.
    let target = 0;
    if (ptr.has) {
      rect = canvas.getBoundingClientRect();
      const k = 1 - Math.exp(-16 * dt);
      ptr.cx += (ptr.tx - ptr.cx) * k;
      ptr.cy += (ptr.ty - ptr.cy) * k;
      const margin = state.scatterR * 0.6;
      if (
        ptr.inside &&
        ptr.tx > rect.left - margin &&
        ptr.tx < rect.right + margin &&
        ptr.ty > rect.top - margin &&
        ptr.ty < rect.bottom + margin
      ) {
        target = 1;
      }
    }
    ptr.v += (110 * (target - ptr.s) - 11 * ptr.v) * dt;
    ptr.s += ptr.v * dt;
    if (ptr.s < -0.25) ptr.s = -0.25;
    if (ptr.s > 1.1) ptr.s = 1.1;
    const settled = target === 0 && Math.abs(ptr.s) < 0.003 && Math.abs(ptr.v) < 0.01;
    if (settled) {
      ptr.s = 0;
      ptr.v = 0;
    }

    draw(time, introT / INTRO_SECONDS, ptr.s, 1);

    const busy = introT < INTRO_SECONDS || !settled || now - lastInput < ACTIVE_MS;
    return small() || !busy ? 1000 / 30 : 0;
  });

  const syncLoop = () => {
    const shouldRun = !disposed && !lost && !reduced && inView && !document.hidden && !!state.gl;
    if (shouldRun) loop.start();
    else loop.stop();
  };

  // ---- Input ----------------------------------------------------------------------------------------------

  const onMove = (event) => {
    if (reduced || event.pointerType === 'touch') return;
    ptr.tx = event.clientX;
    ptr.ty = event.clientY;
    ptr.inside = true;
    if (!ptr.has) {
      ptr.cx = event.clientX;
      ptr.cy = event.clientY;
      ptr.has = true;
    }
    lastInput = performance.now();
  };

  // The pointer position is frozen where it left, so the scatter relaxes in place instead of sliding away.
  const onLeave = () => {
    ptr.inside = false;
    lastInput = performance.now();
  };

  // ---- Lifecycle ------------------------------------------------------------------------------------------

  if (!buildGL() || !layout()) {
    disposed = true;
    return null;
  }
  applyTheme();
  if (reduced) renderStatic();
  else draw(0, 0, 0, 1);
  syncLoop();

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!layout()) return;
      if (reduced) renderStatic();
      else if (!loop.running) draw(time, introT / INTRO_SECONDS, 0, 1);
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
      else draw(time, introT / INTRO_SECONDS, 0, 1);
      syncLoop();
    }
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('blur', onLeave);
  document.documentElement.addEventListener('mouseleave', onLeave);
  document.addEventListener('visibilitychange', syncLoop);
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);

  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
  resizeObserver?.observe(container);
  const visibilityObserver =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          (entries) => {
            inView = entries[entries.length - 1].isIntersecting;
            syncLoop();
          },
          { rootMargin: '80px 0px' },
        )
      : null;
  visibilityObserver?.observe(container);

  const stopTheme = observeTheme(() => {
    applyTheme();
    if (reduced) renderStatic();
    else if (!loop.running && state.gl && !lost) draw(time, introT / INTRO_SECONDS, 0, 1);
  });
  const stopMotion = watchReducedMotion((value) => {
    reduced = value;
    if (reduced) renderStatic();
    syncLoop();
  });

  return {
    destroy() {
      disposed = true;
      loop.stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', onLeave);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('visibilitychange', syncLoop);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      stopTheme();
      stopMotion();
      if (state.gl && !lost) state.gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
};
