import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { watch } from './helpers';

test.use({ viewport: { width: 1280, height: 800 } });

test('a missing page gets the 404 with a 404 status, the remote says TRK 404', async ({ page }) => {
  const { errors } = watch(page, 'http://localhost:4321');
  const res = await page.goto('/no/such/page/');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skipped.');
  await expect(page.locator('.lcd-desk .lcd-track')).toHaveText('TRK 404 · SKIPPED');
  await expect(page.locator('[data-path]')).toHaveText('/no/such/page/');
  await expect(page.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('button', { name: 'Surprise me' })).toBeVisible();
  await page.getByRole('button', { name: 'Search the site' }).click();
  await expect(page.getByRole('combobox')).toBeFocused();
  expect(errors.filter((e) => !e.includes('404'))).toEqual([]);
});

test('the missing address is shown as text, never as HTML', async ({ page }) => {
  let dialogs = 0;
  page.on('dialog', (d) => (dialogs++, d.dismiss()));
  await page.goto('/<img src=x onerror=alert(1)>/');
  await expect(page.locator('[data-path]')).toHaveText('/<img src=x onerror=alert(1)>/');
  await expect(page.locator('[data-path] img')).toHaveCount(0);
  expect(dialogs).toBe(0);
});

test('the Spanish 404 is in Spanish', async ({ page }) => {
  await page.goto('/es/404/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pista saltada.');
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/es/');
});

test('three scratches chip, crack and shatter the disc; a new disc can be loaded', async ({ page }) => {
  await page.goto('/404.html');
  const lost = page.locator('[data-lost]');
  const disc = page.getByRole('button', { name: 'Scratch the disc' });
  await expect(disc).toHaveAccessibleDescription('Psst: scratch the disc three times.');
  await disc.click();
  await expect(page.locator('[data-lost-lcd]')).toHaveText('Scratch 1 of 3');
  await expect(lost).toHaveAttribute('data-s1', '');
  await disc.press('Enter');
  await expect(lost).toHaveAttribute('data-s2', '');
  await disc.press('Space');
  await expect(page.locator('[data-lost-lcd]')).toHaveText('★ SECRET FOUND');
  await expect(page.locator('[data-lost-say]')).toContainText('You found a secret');
  await expect(lost).toHaveAttribute('data-broken', '');
  await expect(page.locator('.shard').first()).toBeVisible();
  const reload = page.getByRole('button', { name: 'Load a new disc' });
  await expect(reload).toBeFocused(); // keyboard users land on the next step
  await reload.click();
  await expect(lost).not.toHaveAttribute('data-broken', '');
  await expect(lost).not.toHaveAttribute('data-s1', '');
  await expect(reload).toBeHidden();
  await expect(disc).toBeFocused();
  await expect(page.locator('[data-lost-lcd]')).toHaveText('TRK 404 · SKIPPED');
});

test('dragging the disc back and forth counts as one scratch', async ({ page }) => {
  await page.goto('/404.html');
  const box = (await page.locator('[data-disc]').boundingBox())!;
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx + 100, cy - 60);
  await page.mouse.down();
  for (const [x, y] of [[cx + 120, cy + 20], [cx + 60, cy + 110], [cx + 120, cy + 20]]) await page.mouse.move(x, y, { steps: 6 });
  await page.mouse.up();
  await expect(page.locator('[data-lost-lcd]')).toHaveText('Scratch 1 of 3');
  await expect(page.locator('[data-lost]')).not.toHaveAttribute('data-s2', ''); // the drag's click is not counted twice
});

test('calm mode stops the disc', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('shq:calm', 'on'));
  await page.goto('/404.html');
  await expect(page.locator('.spin')).toHaveCSS('animation-name', 'none');
});

for (const theme of ['original', 'light', 'dark'] as const) {
  test(`404 has no axe violations (${theme}, EN and ES)`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('shq:theme', t), theme);
    for (const path of ['/404.html', '/es/404/']) {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations, path).toEqual([]);
    }
  });
}
