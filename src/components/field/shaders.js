// GLSL for the Signal Field and the hero name. Both use the same two-pass layout:
//
//   pass 1  (cell resolution, a few thousand fragments)  -> RGBA8 "cell texture":
//             R = glyph index / 255, G = hot (0 ink, 1 signal colour), B = ink alpha, A = solid fill alpha
//   pass 2  (full resolution, 2 texture reads)           -> glyph from the atlas, tinted, premultiplied
//
// All the maths (noise, sweep, lens, ripples, mask sampling) happens in pass 1, so the per-pixel cost is
// independent of how rich the animation is.

const PRECISION = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

export const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const HASH = `
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
`;

// 2D simplex noise (Ian McEwan / Stefan Gustavson, MIT).
const NOISE = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

// ---- Pass 2: shared by both canvases ---------------------------------------------------------------------

export const GLYPH_UNIFORMS = [
  'uCells',
  'uAtlas',
  'uGrid',
  'uCellPx',
  'uCanvasPx',
  'uAtlasSlots',
  'uAtlasPx',
  'uFg',
  'uSignal',
];

export const FRAG_GLYPHS = `${PRECISION}
uniform sampler2D uCells;
uniform sampler2D uAtlas;
uniform vec2 uGrid;
uniform vec2 uCellPx;
uniform vec2 uCanvasPx;
uniform vec2 uAtlasSlots;
uniform vec2 uAtlasPx;
uniform vec3 uFg;
uniform vec3 uSignal;

void main() {
  vec2 p = vec2(gl_FragCoord.x, uCanvasPx.y - gl_FragCoord.y);
  vec2 cell = floor(p / uCellPx);
  vec4 d = texture2D(uCells, vec2(cell.x + 0.5, uGrid.y - cell.y - 0.5) / uGrid);
  float idx = floor(d.r * 255.0 + 0.5);
  if (idx < 0.5 && d.a < 0.004) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec2 lp = floor(p - cell * uCellPx);
  vec2 slot = vec2(mod(idx, uAtlasSlots.x), floor(idx / uAtlasSlots.x));
  float cov = texture2D(uAtlas, (slot * uCellPx + lp + 0.5) / uAtlasPx).r;
  float a = clamp(cov * d.b + d.a, 0.0, 1.0);
  vec3 col = mix(uFg, uSignal, d.g);
  gl_FragColor = vec4(col * a, a);
}
`;

// ---- Pass 1: background field -----------------------------------------------------------------------------

export const FIELD_UNIFORMS = [
  'uGrid',
  'uCellCss',
  'uView',
  'uTime',
  'uScroll',
  'uMood',
  'uPointer',
  'uRip',
  'uTone',
];

export const FRAG_FIELD = `${PRECISION}
uniform vec2 uGrid;      // cols, rows
uniform vec2 uCellCss;   // cell size, CSS px
uniform vec2 uView;      // viewport, CSS px
uniform float uTime;     // seconds
uniform float uScroll;   // parallax offset, CSS px
uniform vec4 uMood;      // flow, lattice, calm, static   (each 0..1, eased in JS)
uniform vec3 uPointer;   // x, y (CSS px), lens strength 0..1
uniform vec4 uRip[4];    // x, y, start time, amplitude
uniform vec4 uTone;      // base ink alpha, hot ink alpha (lens), sweep gain, vignette strength
${NOISE}
${HASH}

const float LENS_R = 190.0;

void main() {
  vec2 cell = vec2(floor(gl_FragCoord.x), uGrid.y - 1.0 - floor(gl_FragCoord.y));
  vec2 pos = (cell + 0.5) * uCellCss;

  float flow = uMood.x;
  float lattice = uMood.y;
  float calm = uMood.z;
  float stat = uMood.w;

  // Cursor lens: pushes the pattern outward a little and (below) densifies + tints it.
  vec2 toP = pos - uPointer.xy;
  float dP = length(toP);
  float lens = uPointer.z * smoothstep(LENS_R, 0.0, dP);
  vec2 sp = pos - toP / max(dP, 1.0) * lens * 26.0;
  sp.y += uScroll;

  // A slowly flowing, domain-warped terrain. Soft density blobs plus iso-lines of the same height field, so the
  // glyphs read as drifting contour lines.
  float t = uTime * (0.05 + 0.06 * flow) * (1.0 - 0.55 * calm);
  vec2 q = sp / 330.0;
  vec2 w = vec2(snoise(q * 0.7 + vec2(0.0, t)), snoise(q * 0.7 + vec2(7.3, 2.1 - t)));
  float warp = 1.2 + 1.0 * flow;
  float n = snoise(q * 0.95 + w * warp + vec2(t * 0.8, -t * 0.55));
  float n2 = snoise(q * 2.3 - w * 0.8 + vec2(-t * 1.1, t * 0.6));
  float d = 0.5 + 0.5 * (n * 0.82 + n2 * 0.26);
  float dens = smoothstep(0.4 + 0.14 * calm, 0.86, d);
  float fr = abs(fract(d * 8.0 + 0.5) - 0.5);
  float line = 1.0 - smoothstep(0.03, 0.17, fr);
  float v = dens * (0.72 - 0.22 * calm) + line * (0.1 + 0.62 * dens) * (1.0 - 0.55 * calm);

  // Twinkling dust so the quiet areas still breathe.
  float dust = hash21(cell * 1.7 + floor(uTime * 0.6 + hash21(cell) * 7.0));
  v = max(v, step(0.972, dust) * 0.13);

  // Drifting lattice (area pages): '+' at crossings, ':' / '-' along the lines.
  if (lattice > 0.001) {
    vec2 gc = cell + vec2(floor(uTime * 0.6), floor(uScroll / uCellCss.y));
    float onX = 1.0 - step(0.5, mod(gc.x, 14.0));
    float onY = 1.0 - step(0.5, mod(gc.y, 7.0));
    float crossing = onX * onY;
    float lat = crossing * 0.6 + onX * (1.0 - crossing) * 0.27 + onY * (1.0 - crossing) * 0.37;
    v = mix(v, max(v * 0.6, lat), lattice);
  }

  float hotSweep = 0.0;
  float hotLens = 0.0;
  float hotRip = 0.0;
  float hotStat = 0.0;

  // Signal sweep: a radar-like diagonal band, sharp leading edge and a long tail.
  float period = mix(8.6, 11.0, calm);
  float cyc = fract((uTime + period - 1.6) / period);
  float span = 0.4;
  if (uTone.z > 0.001 && cyc < span) {
    vec2 dir = normalize(vec2(1.0, 0.62));
    float extent = dot(uView, dir);
    float u = cyc / span;
    float s = dot(pos, dir) - mix(-0.25, 1.25, u) * extent;
    float band = s > 0.0 ? exp(-s * s / (2.0 * 30.0 * 30.0)) : exp(s / 240.0);
    band *= 0.6 + 0.4 * snoise(sp / 100.0 + vec2(4.0, uTime * 0.2));
    hotSweep = band * uTone.z;
    v += hotSweep * 0.6;
  }

  // Lens: denser, orange, with a thin reticle ring.
  hotLens = lens + exp(-pow((dP - LENS_R * 0.82) / 8.0, 2.0)) * uPointer.z * 0.6;
  v += lens * 0.5 + (hotLens - lens) * 0.4;

  // Click ripples.
  for (int i = 0; i < 4; i++) {
    vec4 r = uRip[i];
    float age = uTime - r.z;
    if (r.w > 0.0 && age > 0.0 && age < 2.2) {
      float life = 1.0 - age / 2.2;
      float width = 18.0 + age * 16.0;
      float dd = length(pos - r.xy) - (8.0 + age * 360.0);
      float rr = exp(-dd * dd / (2.0 * width * width)) * life * life * r.w;
      hotRip += rr;
      v += rr * 0.7;
    }
  }

  // 404: TV static with horizontal tears and a rolling bar.
  if (stat > 0.001) {
    float tq = floor(uTime * 15.0);
    float band = floor(cell.y / 3.0);
    float tear = step(0.88, hash21(vec2(band, floor(uTime * 4.0))));
    float shift = tear * floor(hash21(vec2(band, tq)) * 48.0);
    float h = hash21(vec2(cell.x + shift, cell.y) + tq * vec2(0.71, 1.37));
    float bar = exp(-pow((cell.y / uGrid.y - fract(uTime * 0.17)) * 8.0, 2.0));
    float sv = pow(h, 2.4) * (0.6 + 0.7 * bar);
    v = mix(v, sv, stat);
    hotStat = stat * step(0.992, h) * 0.9;
  }

  v = clamp(v, 0.0, 1.0);
  float hot = clamp(hotSweep + hotLens + hotRip + hotStat, 0.0, 1.0);

  float idx = floor(v * 10.0 + 0.5);
  float pick = hash21(cell + floor(uTime * 7.0));
  if (idx > 8.5 && hot > 0.3 && pick < 0.65) {
    idx = 11.0 + floor(pick / 0.65 * 6.999);
  }

  // Ink alpha: faint base, a stronger (still capped) signal alpha at hot spots. The lens sits under the pointer,
  // i.e. usually under text, so it stays at the AA-safe level (uTone.y); the sweep head and ripple rings are
  // transient and may be brighter.
  vec2 uv = pos / uView - 0.5;
  float vig = 1.0 - uTone.w * smoothstep(0.25, 0.85, length(uv * vec2(1.0, 1.1)));
  float base = uTone.x * (0.7 + 0.3 * v) * vig;
  float hotInk = max(max(hotSweep * uTone.y * 2.0, hotLens * uTone.y), max(hotRip * uTone.y * 1.75, hotStat * uTone.y));
  float ink = max(base, min(hotInk, uTone.y * 2.0));

  // A faint solid tint behind lit cells turns the glyph streaks into a soft, pixelated glow.
  float glow = uTone.y * 0.25 * smoothstep(0.04, 0.8, hot);
  // ...and a very faint warm haze that breathes at the top of the viewport.
  float haze = 0.05 * smoothstep(0.8, 0.0, length((uv + vec2(0.0, 0.52)) * vec2(0.85, 1.3)));
  haze *= (0.75 + 0.25 * snoise(vec2(uTime * 0.07, uv.x * 1.5))) * (1.0 - 0.5 * calm);
  glow = max(glow, haze * (1.0 - stat));

  // Occasional brighter "star" glyphs.
  float star = step(0.9965, hash21(cell * 2.9 + floor(uTime * 1.1 + hash21(cell + 4.0) * 9.0)));
  ink = max(ink, star * uTone.x * 1.7 * vig);
  idx = max(idx, star * (2.0 + floor(hash21(cell + 8.0) * 6.0)));

  gl_FragColor = vec4(idx / 255.0, hot, ink, glow);
}
`;

// ---- Pass 1: hero name ------------------------------------------------------------------------------------

export const NAME_UNIFORMS = [
  'uGrid',
  'uCellCss',
  'uSizeCss',
  'uMask',
  'uTime',
  'uIntro',
  'uPointer',
  'uScatter',
  'uSweep',
  'uFill',
];

export const FRAG_NAME = `${PRECISION}
uniform vec2 uGrid;
uniform vec2 uCellCss;
uniform vec2 uSizeCss;    // size of the cell grid, CSS px (the mask covers exactly this)
uniform sampler2D uMask;  // alpha = text coverage
uniform float uTime;
uniform float uIntro;     // 0 -> 1 decode progress
uniform vec3 uPointer;    // x, y (CSS px, canvas space), scatter strength 0..1
uniform vec2 uScatter;    // radius, displacement (CSS px)
uniform float uSweep;     // sweep gain (0 = off)
uniform float uFill;      // solid tint behind dense glyphs
${NOISE}
${HASH}

float cover(vec2 p) {
  return texture2D(uMask, p / uSizeCss).a;
}

void main() {
  vec2 cell = vec2(floor(gl_FragCoord.x), uGrid.y - 1.0 - floor(gl_FragCoord.y));
  vec2 pos = (cell + 0.5) * uCellCss;

  // Pointer scatter: sample the mask from a displaced position, so glyphs near the cursor are shoved away
  // and jittered; the displacement follows the (eased) pointer, so they settle back when it leaves.
  vec2 toP = pos - uPointer.xy;
  float dP = length(toP);
  float sc = uPointer.z * smoothstep(uScatter.x, 0.0, dP);
  vec2 dir = toP / max(dP, 1.0);
  vec2 jit = vec2(hash21(cell + 3.1), hash21(cell + 9.7)) - 0.5;
  vec2 sp = pos - (dir * 0.7 + jit * 1.4) * sc * uScatter.y;

  vec2 o = uCellCss * 0.25;
  float cov = 0.25 * (cover(sp + vec2(-o.x, -o.y)) + cover(sp + vec2(o.x, -o.y)) +
                      cover(sp + vec2(-o.x, o.y)) + cover(sp + vec2(o.x, o.y)));

  float g = smoothstep(0.07, 0.82, cov);
  float shim = snoise(cell * vec2(0.21, 0.13) + vec2(uTime * 0.55, -uTime * 0.32));
  float idx = floor(g * 10.0 + 0.5);
  if (g > 0.93) {
    idx = 8.0 + floor((0.5 + 0.5 * shim) * 2.99);
  } else if (g > 0.1) {
    idx = clamp(idx + step(0.45, shim) - step(shim, -0.45), 1.0, 10.0);
  }
  float ink = mix(0.5, 1.0, g);
  float hot = 0.0;

  // Scattered glyphs dissolve into signal-coloured dust.
  float tq = floor(uTime * 14.0);
  float dustPick = hash21(cell + tq * 1.7);
  if (sc > 0.02 && dustPick < sc * 0.55) {
    idx = max(idx, 1.0 + floor(hash21(cell + tq * 2.3) * 8.0));
    ink = max(ink, 0.7);
    hot = max(hot, sc);
  }
  hot = max(hot, sc * 0.6 * step(0.5, g));

  // Sparse ambient dust around the letters, and a few signal sparks inside them.
  float amb = hash21(cell * 1.3 + floor(uTime * 1.6));
  if (g < 0.1 && amb > 0.992) {
    idx = 1.0 + floor(hash21(cell + 5.0) * 3.0);
    ink = 0.4;
  }
  if (g > 0.6 && hash21(cell * 0.7 + floor(uTime * 2.2)) > 0.987) hot = max(hot, 0.85);

  // Signal sweep across the letters.
  float cyc = fract((uTime - 0.8) / 5.2);
  if (uSweep > 0.001 && cyc < 0.34) {
    vec2 dirS = normalize(vec2(1.0, 0.4));
    float extent = dot(uSizeCss, dirS);
    float s = dot(pos, dirS) - mix(-0.2, 1.2, cyc / 0.34) * extent;
    float band = s > 0.0 ? exp(-s * s / (2.0 * 0.012 * extent * 0.012 * extent))
                         : exp(s / (0.1 * extent));
    hot = max(hot, band * uSweep * smoothstep(0.08, 0.5, g));
  }

  // Decode intro: random sparse glyphs resolve (left to right, jittered) into the name.
  if (uIntro < 0.999) {
    float order = hash21(cell * 1.37) * 0.6 + (cell.x / uGrid.x) * 0.4;
    float k = smoothstep(order * 0.72, order * 0.72 + 0.28, uIntro);
    float r1 = hash21(cell + floor(uTime * 16.0) * 3.7);
    float r2 = hash21(cell + floor(uTime * 16.0) * 5.3 + 11.0);
    float resolved = step(r1, k);
    float show = step(r2, 0.34 * (1.0 - k) + 0.04);
    float noiseIdx = 1.0 + floor(hash21(cell + 17.0 + floor(uTime * 16.0)) * 9.99);
    float nIdx = noiseIdx * show;
    idx = mix(nIdx, idx, resolved);
    ink = mix(0.55 * show, ink, resolved);
    hot = mix(0.65 * show, hot, resolved);
    g *= resolved;
  }

  float fill = uFill * smoothstep(0.5, 0.95, cov) * (uIntro < 0.999 ? g : 1.0);
  gl_FragColor = vec4(idx / 255.0, clamp(hot, 0.0, 1.0), ink, fill);
}
`;
