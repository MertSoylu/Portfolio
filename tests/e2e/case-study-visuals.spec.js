import { test, expect } from '@playwright/test';

const visualCases = [
  { route: '/case-study/mnemosyne', image: '/previews/mnemosyne-live.png' },
  { route: '/case-study/typesprint', image: '/previews/typesprint-live.png' },
];

test.describe('Case study visuals', () => {
  for (const item of visualCases) {
    test(`${item.route} shows product screenshot`, async ({ page }) => {
      await page.goto(item.route);

      await expect(page.locator(`img[src="${item.image}"]`).first()).toBeVisible();
    });
  }

  test('/case-study/walkkittie shows animated octopus pet', async ({ page }) => {
    await page.goto('/case-study/walkkittie');

    await expect(page.getByTestId('walkkittie-octopus-pet').first()).toBeVisible();
    await expect(page.getByText(/Pixel Ahtapot|Pixel Octopus/).first()).toBeVisible();
  });

  test('msscan shows terminal product surface', async ({ page }) => {
    await page.goto('/case-study/msscan');

    await expect(page.getByText('msscan>').first()).toBeVisible();
    await expect(page.getByText('HTML report ready').first()).toBeVisible();
  });

  test('desktop hero copy starts near product preview', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/case-study/typesprint');

    const kicker = page.locator('.lab-kicker').first();
    const preview = page.locator('.preview-shell').first();

    await expect(kicker).toBeVisible();
    await expect(preview).toBeVisible();

    const kickerBox = await kicker.boundingBox();
    const previewBox = await preview.boundingBox();

    expect(kickerBox.y - previewBox.y).toBeLessThan(64);
  });
});
