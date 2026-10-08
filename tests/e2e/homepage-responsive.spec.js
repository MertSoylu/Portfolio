import { test, expect } from '@playwright/test';

const visibleProjectOverflow = () => {
  const viewportWidth = window.innerWidth;
  const ignoredTags = new Set(['svg', 'path']);
  // GitHub repo şeridi (marquee) bilerek taşar; kenarları maske ile gizlenir.
  const marquee = document.querySelector('#projects ul[aria-label*="GitHub"]');

  return Array.from(document.querySelectorAll('#projects *'))
    .map((element) => {
      if (marquee && marquee.contains(element)) return null;
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const isVisible =
        rect.width > 2 &&
        rect.height > 2 &&
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
      };
    })
    .filter(Boolean);
};

test.describe('Homepage projects', () => {
  test('mobile project grid stays inside viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    expect(await page.evaluate(visibleProjectOverflow)).toEqual([]);
  });

  test('featured project and all project cards are listed', async ({ page }) => {
    await page.goto('/');
    await page.locator('#projects').scrollIntoViewIfNeeded();

    for (const title of [
      'NOBLE',
      'TypeSprint',
      'BİZ Şehir Haritası',
      'Biz Topluluğu',
      'WalkKittie',
      'msscan',
    ]) {
      await expect(page.locator('#projects h3').filter({ hasText: title }).first()).toBeVisible();
    }
  });

  test('project card opens its case study', async ({ page }) => {
    await page.goto('/');
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.locator('#projects h3 a', { hasText: 'TypeSprint' }).click();
    await expect(page).toHaveURL(/\/case-study\/typesprint$/);
  });

  test('marquee duplicates are not keyboard focusable', async ({ page }) => {
    await page.goto('/');
    await page.locator('#projects').scrollIntoViewIfNeeded();
    const hiddenItems = page.locator('#projects li[aria-hidden="true"]');
    if ((await hiddenItems.count()) === 0) return;
    await expect(hiddenItems.first()).toHaveAttribute('inert', '');
  });
});
