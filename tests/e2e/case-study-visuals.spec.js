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
    await expect(page.getByText('404')).toBeVisible();
  });
});
