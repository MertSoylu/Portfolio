#!/usr/bin/env node
// Pure-Node PNG generator for og-image.png (1200x630).
// No external dependencies. Placeholder design; replace with a real export later.
import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'og-image.png');
const W = 1200;
const H = 630;

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
};

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// 5x7 monospace bitmap font. Each glyph: 7 rows, top to bottom, 5 bits per row.
const FONT = {
  ' ': [0, 0, 0, 0, 0, 0, 0],
  '.': [0, 0, 0, 0, 0, 0, 4],
  ',': [0, 0, 0, 0, 4, 4, 8],
  '-': [0, 0, 0, 14, 0, 0, 0],
  '·': [0, 0, 0, 4, 0, 0, 0],
  '/': [1, 2, 2, 4, 8, 8, 16],
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 23, 17, 17, 14],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [14, 4, 4, 4, 4, 4, 14],
  J: [7, 2, 2, 2, 2, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 25, 21, 19, 17, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [14, 17, 16, 14, 1, 17, 14],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 21, 21, 21, 10],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 17, 10, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
  0: [14, 17, 17, 17, 17, 17, 14],
  1: [4, 12, 4, 4, 4, 4, 14],
  2: [14, 17, 1, 2, 4, 8, 31],
  3: [14, 17, 1, 6, 1, 17, 14],
  4: [2, 6, 10, 18, 31, 2, 2],
  5: [31, 16, 30, 1, 1, 17, 14],
  6: [6, 8, 16, 30, 17, 17, 14],
  7: [31, 1, 2, 4, 8, 8, 8],
  8: [14, 17, 17, 14, 17, 17, 14],
  9: [14, 17, 17, 15, 1, 2, 12],
};

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
  255,
];

const BG = hex('#faf8f4');
const FG = hex('#13110f');
const ACCENT = hex('#c2562f');
const MUTED = hex('#7a6a5c');

const buf = Buffer.alloc(W * H * 4, 0);
for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) {
    const o = (y * W + x) * 4;
    buf[o] = BG[0];
    buf[o + 1] = BG[1];
    buf[o + 2] = BG[2];
    buf[o + 3] = BG[3];
  }
}

const setPx = (x, y, color) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const o = (y * W + x) * 4;
  buf[o] = color[0];
  buf[o + 1] = color[1];
  buf[o + 2] = color[2];
  buf[o + 3] = color[3];
};

const fillRect = (x0, y0, w, h, color) => {
  for (let y = y0; y < y0 + h; y += 1) {
    for (let x = x0; x < x0 + w; x += 1) setPx(x, y, color);
  }
};

const drawText = (text, x, y, scale, color) => {
  const upper = text.toUpperCase();
  let cx = x;
  for (const ch of upper) {
    const glyph = FONT[ch] || FONT[' '];
    for (let row = 0; row < 7; row += 1) {
      const bits = glyph[row];
      for (let col = 0; col < 5; col += 1) {
        if (bits & (1 << (4 - col))) {
          for (let sy = 0; sy < scale; sy += 1) {
            for (let sx = 0; sx < scale; sx += 1) {
              setPx(cx + col * scale + sx, y + row * scale + sy, color);
            }
          }
        }
      }
    }
    cx += 6 * scale;
  }
  return cx;
};

const textWidth = (text, scale) => text.length * 6 * scale - scale;

fillRect(0, 0, W, 6, ACCENT);

const title = 'MERT SOYLU';
const subtitle = 'JUNIOR FULL-STACK DEVELOPER';
const titleScale = 12;
const subScale = 4;
const titleW = textWidth(title, titleScale);
const subW = textWidth(subtitle, subScale);

drawText(title, Math.floor((W - titleW) / 2), 230, titleScale, FG);
drawText(subtitle, Math.floor((W - subW) / 2), 360, subScale, MUTED);

const accentLineW = 90;
fillRect(Math.floor((W - accentLineW) / 2), 340, accentLineW, 4, ACCENT);

fillRect(0, H - 6, W, 6, ACCENT);

// Encode RGB (no alpha) for smaller file.
const rgb = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i += 1) {
  rgb[i * 3] = buf[i * 4];
  rgb[i * 3 + 1] = buf[i * 4 + 1];
  rgb[i * 3 + 2] = buf[i * 4 + 2];
}

// Add filter byte (0 = None) at start of each scanline.
const raw = Buffer.alloc(W * H * 3 + H);
for (let y = 0; y < H; y += 1) {
  raw[y * (W * 3 + 1)] = 0;
  rgb.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type: truecolor
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

const idat = deflateSync(raw, { level: 9 });
const png = Buffer.concat([PNG_SIG, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, png);

const sha = createHash('sha256').update(png).digest('hex').slice(0, 12);
console.log(`Wrote ${OUT} (${(png.length / 1024).toFixed(1)} KB, sha ${sha})`);
