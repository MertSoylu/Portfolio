// Glyph atlas: every glyph the shaders can show, drawn once into a 2D canvas in Geist Mono.
//
// Index 0-10 is the density ramp (blank -> '@'); 11-17 are "signal" glyphs the field swaps in at hot spots.
// Each slot is exactly one screen cell in *device* pixels, so the fragment shader reads it 1:1 with NEAREST
// filtering (crisp, no mip chain, no resampling shimmer).

export const RAMP = ' .·:-=+*%#@';
export const SIGNAL_GLYPHS = '/\\|<>01';
export const GLYPHS = RAMP + SIGNAL_GLYPHS;
export const RAMP_MAX = RAMP.length - 1; // 10: index of the densest ramp glyph
export const SIGNAL_FIRST = RAMP.length; // 11
export const SIGNAL_COUNT = SIGNAL_GLYPHS.length; // 7

export const MONO_FONT = '"Geist Mono Variable"';
export const MONO_WEIGHT = 600;
/** Fonts to wait for before drawing (name mask + atlas). */
export const FONT_SPECS = [`${MONO_WEIGHT} 32px ${MONO_FONT}`];

const ATLAS_COLS = 8;

/** Cell geometry in device px for a cell height in CSS px: monospace proportions (width ~ 0.58 x height). */
export const cellMetrics = (cellHeightCss, dpr) => {
  const ch = Math.max(6, Math.round(cellHeightCss * dpr));
  const cw = Math.max(3, Math.round(ch * 0.58));
  return { cw, ch };
};

export const buildAtlas = ({ cw, ch }) => {
  const rows = Math.ceil(GLYPHS.length / ATLAS_COLS);
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_COLS * cw;
  canvas.height = rows * ch;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Geist Mono advance is 0.6em: size the font so a glyph fills the slot width, never taller than the slot.
  const fontPx = Math.min(cw / 0.6, ch * 0.92);
  ctx.font = `${MONO_WEIGHT} ${fontPx.toFixed(2)}px ${MONO_FONT}, ui-monospace, monospace`;
  const baseline = ch * 0.5 + fontPx * 0.35;

  for (let i = 1; i < GLYPHS.length; i += 1) {
    const col = i % ATLAS_COLS;
    const row = Math.floor(i / ATLAS_COLS);
    ctx.fillText(GLYPHS[i], col * cw + cw / 2, row * ch + baseline);
  }

  return { canvas, cols: ATLAS_COLS, rows, width: canvas.width, height: canvas.height, cw, ch };
};
