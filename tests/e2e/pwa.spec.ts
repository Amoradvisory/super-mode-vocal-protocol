import { expect, test } from '@playwright/test';

test('manifeste et lecture hors ligne', async ({ context, page }) => {
  await page.goto('./');
  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) throw new Error('Service Worker indisponible');
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect.poll(async () => page.evaluate(() => Boolean(navigator.serviceWorker?.controller)), { timeout: 15000 }).toBeTruthy();

  await context.setOffline(true);
  await page.goto('./#/sourates');
  await expect(page.getByRole('heading', { name: 'Les sourates' })).toBeVisible();
  await page.goto('./#/sourate/2');
  await expect(page.locator('[data-verse-number="1"]')).toBeVisible();
});
