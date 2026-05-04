import { test, expect } from '@playwright/test';

test.describe('Portfolio smoke', () => {
  test('home page loads with hero and meta title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Mert Soylu/);
    await expect(page.locator('main#main')).toBeVisible();
  });

  test('skip-to-content link exists', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('a[href="#main"]');
    await expect(skip).toHaveCount(1);
  });

  test('CV download link present in hero', async ({ page }) => {
    await page.goto('/');
    const cv = page.locator('a[href="/cv.pdf"]').first();
    await expect(cv).toHaveAttribute('download', '');
  });

  test('specialty pages reachable', async ({ page }) => {
    for (const route of ['/web', '/android', '/cybersecurity', '/data-science']) {
      await page.goto(route);
      await expect(page.locator('main#main')).toBeVisible();
    }
  });

  test('404 page renders quick links', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('link', { name: /web/i })).toBeVisible();
  });

  test('honeypot blocks bot submissions', async ({ page }) => {
    await page.goto('/');
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toBeHidden();
  });
});
