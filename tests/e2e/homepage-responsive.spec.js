import { test, expect } from '@playwright/test';

const visibleProjectOverflow = () => {
  const viewportWidth = window.innerWidth;
  const ignoredTags = new Set(['svg', 'path']);

  return Array.from(document.querySelectorAll('#projects *'))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const isVisible =
        rect.width > 2 &&
        rect.height > 2 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number(style.opacity || 1) !== 0;

      if (!isVisible || ignoredTags.has(element.tagName.toLowerCase())) return null;
      if (rect.left >= -1 && rect.right <= viewportWidth + 1) return null;

      return {
        tag: element.tagName.toLowerCase(),
        className: String(element.className).slice(0, 140),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
      };
    })
    .filter(Boolean);
};

test.describe('Homepage responsive layout', () => {
  test('mobile projects showcase stays inside viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    const overflowing = await page.evaluate(visibleProjectOverflow);

    expect(overflowing).toEqual([]);
  });

  test('projects morph autoplay starts when visible', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');

    await page.waitForTimeout(5200);
    await page.locator('#projects').scrollIntoViewIfNeeded();

    await expect(page.locator('#projects h3').filter({ hasText: 'Mnemosyne' })).toBeVisible();
    await page.waitForTimeout(3300);
    await expect(page.locator('#projects h3').filter({ hasText: 'TypeSprint' })).toBeVisible();
  });

  test('projects morph autoplay keeps running on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');

    await page.locator('#projects').scrollIntoViewIfNeeded();
    await expect(page.locator('#projects h3').filter({ hasText: 'Mnemosyne' })).toBeVisible();

    const box = await page.locator('#projects').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

    await page.waitForTimeout(3300);
    await expect(page.locator('#projects h3').filter({ hasText: 'TypeSprint' })).toBeVisible();
  });
});
