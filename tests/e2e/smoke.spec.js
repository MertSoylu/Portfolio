import { test, expect } from '@playwright/test';

test.describe('Portfolio smoke', () => {
  test('home page loads with hero and meta title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Mert Soylu/);
    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Mert Soylu' })).toBeVisible();
  });

  test('home sections render in order, each labelled by its heading', async ({ page }) => {
    await page.goto('/');
    const ids = ['about', 'projects', 'stack', 'certificates', 'contact'];
    for (const id of ids) {
      const section = page.locator(`main section#${id}`);
      await expect(section).toHaveCount(1);
      await expect(section).toHaveAttribute('aria-labelledby', /.+/);
    }
    const order = await page.evaluate((list) => {
      const top = (id) => document.getElementById(id).getBoundingClientRect().top + window.scrollY;
      return list.map(top);
    }, ids);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  test('skip-to-content link exists', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('a[href="#main"]');
    await expect(skip).toHaveCount(1);
  });

  test('CV download link present in hero and contact', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').waitFor(); // lazy section
    const cv = page.locator('a[href="/cv.pdf"]');
    expect(await cv.count()).toBeGreaterThanOrEqual(2);
    for (const link of await cv.all()) {
      await expect(link).toHaveAttribute('download', '');
    }
  });

  test('hero role line exposes every role to assistive tech', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => localStorage.setItem('language', 'en'));
    await page.goto('/');
    const line = page.locator('section[aria-labelledby="hero-title"] p', { hasText: "I'm" }).first();
    // Static first role is visible; the full list is in the accessible text.
    await expect(line).toContainText('a React Developer');
    const text = await line.evaluate((el) => el.textContent);
    for (const role of [
      'React Developer',
      'Junior Full-Stack Developer',
      'Android Developer',
      'AI Enthusiast',
    ]) {
      expect(text).toContain(role);
    }
    await page.waitForTimeout(3500);
    await expect(line.locator('[aria-hidden="true"]')).toHaveText('a React Developer');
  });

  test('specialty pages reachable', async ({ page }) => {
    for (const route of ['/web', '/android', '/cybersecurity', '/data-science']) {
      await page.goto(route);
      await expect(page.locator('main#main')).toBeVisible();
    }
  });

  test('404 page renders quick links', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('main').getByRole('link', { name: /web/i })).toBeVisible();
  });

  test('honeypot blocks bot submissions', async ({ page }) => {
    await page.goto('/');
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toBeHidden();
  });

  test('contact form shows field errors and clears the banner on edit', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('#contact button[type="submit"]').click();
    const name = page.locator('#from_name');
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAttribute('aria-describedby', 'from_name-error');
    await expect(page.locator('#from_name-error')).toBeVisible();
    await name.fill('Ada Lovelace');
    await expect(name).toHaveAttribute('aria-invalid', 'false');
  });
});
