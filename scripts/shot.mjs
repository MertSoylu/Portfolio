import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const base = process.env.SHOT_BASE || 'http://localhost:3000';
const outDir = process.env.SHOT_DIR || 'shots';
mkdirSync(outDir, { recursive: true });

const shots = JSON.parse(process.env.SHOT_LIST || '[]');

const browser = await chromium.launch();
for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: { width: s.w, height: s.h },
    deviceScaleFactor: 1,
    colorScheme: s.dark ? 'dark' : 'light',
  });
  const page = await ctx.newPage();
  await page.addInitScript((d) => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(d));
    } catch {}
  }, !!s.dark);
  await page.goto(base + s.path, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(s.wait ?? 1000);
  // Scroll through the page so whileInView reveals fire, then return to top.
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await sleep(120);
    }
    window.scrollTo(0, 0);
    await sleep(250);
  });
  if (s.scrollY != null) {
    await page.evaluate((y) => window.scrollTo(0, y), s.scrollY);
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/${s.name}.png`, fullPage: !!s.full });
  await ctx.close();
  console.log('shot:', s.name);
}
await browser.close();
console.log('done');
