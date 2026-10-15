// Raw-WebGL + environment helpers shared by the Signal Field (AsciiField) and the hero name (AsciiName).
// No dependencies. Everything here is allocation-free after setup; nothing runs per frame except what the
// engines call explicitly.

export const GL_ATTRS = {
  alpha: true,
  antialias: false,
  premultipliedAlpha: true,
  // A software rasteriser would make a fullscreen shader expensive: let the CSS fallback win instead.
  failIfMajorPerformanceCaveat: true,
  depth: false,
  stencil: false,
  powerPreference: 'low-power',
};

/** WebGL 1 context or null (never throws; jsdom / blocked / software-only all give null). */
export const createGL = (canvas) => {
  try {
    const gl = canvas.getContext('webgl', GL_ATTRS);
    if (!gl || typeof gl.createShader !== 'function') return null;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    return gl;
  } catch {
    return null;
  }
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
};

/**
 * Links a program with a_pos bound to location 0 and caches every uniform location in `u`
 * (pass the uniform names you will set). Throws on failure; engines catch and fall back.
 */
export const createProgram = (gl, vertexSource, fragmentSource, uniformNames) => {
  const vs = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, 'aPos');
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed: ${log}`);
  }
  const u = {};
  for (const name of uniformNames) u[name] = gl.getUniformLocation(program, name);
  return { program, u };
};

/** Full-screen triangle strip bound to attribute 0. Call once; the binding stays for the context. */
export const createQuad = (gl) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  return buffer;
};

export const createTexture = (gl, unit, { filter = 'nearest' } = {}) => {
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const f = filter === 'linear' ? gl.LINEAR : gl.NEAREST;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
};

/** Uploads a 2D canvas (or any TexImageSource) into the texture bound to `unit`. */
export const uploadSource = (gl, unit, texture, source, format = gl.RGBA) => {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, source);
};

/** RGBA8 render target of the per-cell data (one texel per glyph cell). */
export const createCellTarget = (gl, unit) => {
  const texture = createTexture(gl, unit, { filter: 'nearest' });
  const fbo = gl.createFramebuffer();
  const target = { texture, fbo, width: 0, height: 0 };
  return target;
};

export const resizeCellTarget = (gl, unit, target, width, height) => {
  if (target.width === width && target.height === height) return;
  target.width = width;
  target.height = height;
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, target.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

export const hasHighp = (gl) => {
  const format = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  return !!format && format.precision > 0;
};

// ---- Environment -------------------------------------------------------------------------------------------

const media = (query) => (typeof window.matchMedia === 'function' ? window.matchMedia(query) : null);

export const prefersReducedMotion = () => !!media('(prefers-reduced-motion: reduce)')?.matches;

/** Calls `callback(reduced)` when the preference flips; returns a disposer. */
export const watchReducedMotion = (callback) => {
  const mq = media('(prefers-reduced-motion: reduce)');
  if (!mq) return () => {};
  const handler = () => callback(mq.matches);
  mq.addEventListener?.('change', handler);
  return () => mq.removeEventListener?.('change', handler);
};

export const isCoarsePointer = () => !!media('(pointer: coarse)')?.matches;

/** Phones / small tablets: smaller cells, 30 fps cap, DPR 1 for the full-screen field. */
export const isSmallScreen = () => isCoarsePointer() || window.innerWidth < 768;

/** Device pixel ratio the field renders at (kept low: the glyphs are faint, the fill rate is not free). */
export const fieldDpr = () => (isSmallScreen() ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));

/** The name canvas is small, so it can afford a sharper ratio (phones are 2-3x). */
export const nameDpr = () => Math.min(window.devicePixelRatio || 1, 2);

const triplet = (style, name, fallback) => {
  const parts = style
    .getPropertyValue(name)
    .trim()
    .split(/[\s,/]+/)
    .map(Number);
  return parts.length >= 3 && parts.every((n) => Number.isFinite(n))
    ? parts.slice(0, 3).map((n) => n / 255)
    : fallback;
};

/** Reads the design tokens (`--fg`, `--signal`, `--accent`, `--canvas`) and the theme from the document. */
export const readTheme = () => {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const isDark = root.classList.contains('dark');
  return {
    isDark,
    fg: triplet(style, '--fg', isDark ? [0.93, 0.93, 0.94] : [0.05, 0.05, 0.06]),
    canvas: triplet(style, '--canvas', isDark ? [0.04, 0.04, 0.05] : [0.97, 0.97, 0.96]),
    signal: triplet(style, '--signal', [0.85, 0.47, 0.34]),
    accent: triplet(style, '--accent', [0.85, 0.47, 0.34]),
  };
};

/** Calls `callback()` whenever <html class> changes (DarkModeContext toggles `dark` there). */
export const observeTheme = (callback) => {
  if (typeof MutationObserver === 'undefined') return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
};

/** Resolves once the fonts the atlas / mask need are ready (or after `timeout`, using the fallback). */
export const loadFonts = async (specs, text, timeout = 3000) => {
  if (!document.fonts?.load) return;
  const load = Promise.all(specs.map((spec) => document.fonts.load(spec, text))).catch(() => {});
  await Promise.race([load, new Promise((resolve) => window.setTimeout(resolve, timeout))]);
};
