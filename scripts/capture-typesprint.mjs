import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 820 } });
await page.goto('https://typesprint.online', { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: 'public/previews/typesprint-live.png' });
await browser.close();
console.log('done');
