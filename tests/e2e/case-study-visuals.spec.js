import { test, expect } from '@playwright/test';

const screenshotCases = [
  { route: '/case-study/noble', image: '/previews/noble-live.webp' },
  { route: '/case-study/typesprint', image: '/previews/typesprint-live.webp' },
  { route: '/case-study/walkkittie', image: '/previews/walkkittie.webp' },
];

test.describe('Case study pages', () => {
  for (const item of screenshotCases) {
    test(`${item.route} shows product screenshot`, async ({ page }) => {
      await page.goto(item.route);
      await expect(page.locator(`img[src="${item.image}"]`).first()).toBeVisible();
    });
  }

  test('msscan shows terminal preview', async ({ page }) => {
    await page.goto('/case-study/msscan');
    await expect(page.getByText('msscan>').first()).toBeVisible();
    await expect(page.getByText('HTML report ready').first()).toBeVisible();
  });

  test('noble shows promo video and screen gallery', async ({ page }) => {
    await page.goto('/case-study/noble');
    const video = page.locator('video');
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(page.locator('img[src^="/previews/noble/"]')).toHaveCount(5);
  });

  test('case study canonical points at its own route', async ({ page }) => {
    await page.goto('/case-study/harita');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://mertsoylu.dev/case-study/harita',
    );
  });

  test('prev/next navigation moves between case studies', async ({ page }) => {
    await page.goto('/case-study/noble');
    // Listede noble'dan sonra gelen proje typesprint (PROJECTS dizisindeki sıradaki öğe).
    await page
      .getByRole('navigation', { name: /Proje gezinme|Project navigation/ })
      .getByRole('link')
      .last()
      .click();
    await expect(page).toHaveURL(/\/case-study\/typesprint$/);
  });

  test('case study has no horizontal scroll at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/case-study/noble');
    await expect(page.locator('h1')).toBeVisible();
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflows).toBe(false);
  });

  test('other projects nav is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/case-study/noble');
    await expect(page.getByRole('navigation', { name: /Diğer projeler|Other projects/ })).toBeVisible();
  });

  test('unknown case study renders 404', async ({ page }) => {
    await page.goto('/case-study/does-not-exist');
    // The 404 page is lazy-loaded; its h1 says the page was not found (it may also carry "404: ").
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/404|not found|bulunamadı/i);
  });

  test('noble gallery images reserve their space and describe what is in the shot', async ({ page }) => {
    await page.goto('/case-study/noble');
    const shots = page.locator('img[src^="/previews/noble/"]');
    await expect(shots).toHaveCount(5);
    for (const shot of await shots.all()) {
      await expect(shot).toHaveAttribute('width', /^\d+$/);
      await expect(shot).toHaveAttribute('height', /^\d+$/);
      // alt is a description of the screen, not a repeat of the visible figcaption.
      const alt = await shot.getAttribute('alt');
      const caption = await shot.locator('xpath=ancestor::figure//figcaption').innerText();
      expect(alt.length).toBeGreaterThan(40);
      expect(alt).not.toBe(caption);
    }
  });

  test('preview image alt is descriptive, not "<title> preview"', async ({ page }) => {
    await page.goto('/case-study/typesprint');
    const alt = await page.locator('img[src="/previews/typesprint-live.webp"]').first().getAttribute('alt');
    expect(alt.length).toBeGreaterThan(40);
    expect(alt).not.toMatch(/^TypeSprint (önizleme|preview)$/);
  });

  test('desktop: sticky contents rail marks the section being read', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/case-study/noble');
    const rail = page.getByRole('navigation', { name: /İçindekiler|Contents/ }).filter({ visible: true });
    await expect(rail).toHaveCount(1);
    const links = rail.getByRole('link');
    // Every target section exists, and each link is a comfortable 44px target.
    for (const link of await links.all()) {
      const href = await link.getAttribute('href');
      await expect(page.locator(href)).toHaveCount(1);
      expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(43.5);
    }
    // Scrolling the gallery into the reading band moves aria-current onto its link.
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector('#gallery').scrollIntoView({ block: 'start' }));
    await expect(rail.locator('a[aria-current="location"]')).toHaveAttribute('href', '#gallery');
    // The rail stays in view while the page scrolls.
    await expect(rail).toBeInViewport();
  });

  test('mobile: contents is a collapsible jump list that closes after use', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/case-study/noble');
    const summary = page.locator('details > summary').first();
    await expect(summary).toBeVisible();
    await summary.click();
    const list = page.getByRole('navigation', { name: /İçindekiler|Contents/ }).filter({ visible: true });
    await expect(list.getByRole('link').first()).toBeVisible();
    await list.locator('a[href="#decisions"]').click();
    await expect(page.locator('details').first()).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(/#decisions$/);
  });

  test('msscan terminal preview does not clip its last line on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/case-study/msscan');
    const last = page.getByText('HTML report ready').first();
    await expect(last).toBeVisible();
    const figure = page.locator('figure').filter({ hasText: 'msscan>' }).first();
    const [lastBox, figureBox] = [await last.boundingBox(), await figure.boundingBox()];
    expect(lastBox.y + lastBox.height).toBeLessThanOrEqual(figureBox.y + figureBox.height + 0.5);
  });
});
