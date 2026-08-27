import { expect, test } from '@playwright/test';

test('lecture, taille et reprise locale', async ({ page }) => {
  await page.goto('/#/sourates');
  await expect(page.getByRole('heading', { name: 'Les sourates' })).toBeVisible();
  await page.getByRole('link', { name: /1 · Le Prologue/ }).click();
  await expect(page.locator('[data-verse-number="1"]')).toBeVisible();
  await expect(page.locator('[data-verse-number="7"]')).toBeAttached();

  const before = await page.locator('.verse-text').first().evaluate((node) => getComputedStyle(node).fontSize);
  await page.getByRole('button', { name: 'Agrandir le texte' }).click();
  const after = await page.locator('.verse-text').first().evaluate((node) => getComputedStyle(node).fontSize);
  expect(parseFloat(after)).toBeGreaterThan(parseFloat(before));

  await page.reload();
  const persisted = await page.locator('.verse-text').first().evaluate((node) => getComputedStyle(node).fontSize);
  expect(persisted).toBe(after);

  await page.locator('[data-verse-number="7"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.reload();
  await expect(page.locator('[data-verse-number="7"]')).toBeAttached();
});

test('aucun débordement horizontal aux tailles critiques', async ({ page }) => {
  for (const width of [320, 360, 390, 430, 768, 1024]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/#/sourate/2');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    for (let i = 0; i < 4; i += 1) await page.getByRole('button', { name: 'Agrandir le texte' }).click();
    const metrics = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
  }
});
