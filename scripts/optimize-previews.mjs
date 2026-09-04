import { readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const dir = 'public/previews';
const MAX_WIDTH = 1600;
const QUALITY = 82;

const files = readdirSync(dir).filter((f) => statSync(join(dir, f)).isFile());

let beforeTotal = 0;
let afterTotal = 0;

for (const file of files) {
  const src = join(dir, file);
  const out = src.replace(/\.(png|jpe?g|webp)$/i, '.webp');

  const before = statSync(src).size;
  const metadata = await sharp(src).metadata();

  let pipeline = sharp(src);
  if (metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH });
  }
  pipeline = pipeline.webp({ quality: QUALITY, effort: 6 });

  await pipeline.toFile(out);

  const after = statSync(out).size;
  beforeTotal += before;
  afterTotal += after;

  console.log(`${file} -> ${out.split('/').pop()}: ${kb(before)} -> ${kb(after)}`);

  unlinkSync(src);
}

console.log(`\nTotal: ${kb(beforeTotal)} -> ${kb(afterTotal)} (-${Math.round((1 - afterTotal / beforeTotal) * 100)}%)`);

function kb(bytes) {
  return `${Math.round(bytes / 1024)} kB`;
}
