import { test, expect } from '@playwright/test';

// Deterministic GitHub data: the repo grid must not depend on the live API (or on the sandbox network).
const REPOS = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `repo-${index + 1}`,
  full_name: `MertSoylu/repo-${index + 1}`,
  description: `Repository number ${index + 1}`,
  html_url: `https://github.com/MertSoylu/repo-${index + 1}`,
  language: 'JavaScript',
  stargazers_count: index,
  updated_at: `2026-0${9 - index}-10T10:00:00Z`, // repo-1 is the most recently updated
  fork: false,
  owner: { login: 'MertSoylu' },
}));

const mockGitHub = async (page) => {
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({ json: REPOS, headers: { 'access-control-allow-origin': '*' } }),
  );
};

// Runs in the browser: `page.evaluate(visibleOverflow, '#projects')`.
const visibleOverflow = (selector) => {
  const viewportWidth = window.innerWidth;
  const ignoredTags = new Set(['svg', 'path']);

  return Array.from(document.querySelectorAll(`${selector} *`))
    .map((element) => {
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
  test.beforeEach(async ({ page }) => {
    await mockGitHub(page);
  });

  test('mobile project grid stays inside viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    expect(await page.evaluate(visibleOverflow, '#projects')).toEqual([]);
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

  test('GitHub repos are a static list of external links', async ({ page }) => {
    await page.goto('/');
    const list = page.locator('#projects ul[aria-label*="GitHub"]');
    await list.scrollIntoViewIfNeeded();
    await expect(list.locator('> li')).toHaveCount(6);
    // No marquee: nothing duplicated, nothing hidden from assistive tech.
    await expect(page.locator('#projects li[aria-hidden="true"]')).toHaveCount(0);
    for (const link of await list.locator('> li > a').all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
    await expect(list.locator('h4').first()).toHaveText('repo-1');
  });
});

test.describe('Homepage layout', () => {
  test.beforeEach(async ({ page }) => {
    await mockGitHub(page);
  });

  for (const [width, height] of [
    [320, 700],
    [360, 740],
    [390, 844],
    [768, 1024],
    [1440, 900],
  ]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      // Scroll through the page so every lazy section mounts and every Reveal runs.
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
      expect(await page.evaluate(visibleOverflow, 'main')).toEqual([]);
    });
  }

  test('hero CTA scrolls to projects', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.getByRole('link', { name: /Projeleri gör|View projects/ }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator('#projects')).toBeInViewport();
  });
});
