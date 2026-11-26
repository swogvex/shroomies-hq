import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { finePrint } from '../../src/lib/sections';

test.use({ viewport: { width: 1280, height: 800 } });

test('every fine-print page exists in EN and ES and the footer links to it', async ({ page }) => {
  for (const [prefix, footer] of [['', 'Footer'], ['/es', 'Pie de página']] as const) {
    for (const slug of finePrint) {
      const res = await page.goto(`${prefix}/${slug}/`);
      expect(res?.status(), `${prefix}/${slug}/`).toBe(200);
      await expect(page.getByRole('navigation', { name: /fine print|letra pequeña/i }).locator('[aria-current="page"]')).toHaveAttribute('href', `${prefix}/${slug}/`);
      await expect(page.getByRole('navigation', { name: footer }).locator(`a[href="${prefix}/${slug}/"]`)).toHaveCount(1);
    }
  }
});

test('the privacy page starts with the short version and numbers its sections', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy');
  await expect(page.getByRole('complementary', { name: 'In short' })).toContainText('No cookies');
  await expect(page.locator('.lcd-desk .lcd-track')).toHaveText('FINE PRINT · 02');
  await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText('Who is responsible');
});

test('Spanish pages link to Spanish pages', async ({ page }) => {
  await page.goto('/es/legal/');
  await expect(page.locator('.prose a[href="/es/privacy/"]')).toHaveCount(1);
  await expect(page.locator('.prose a[href^="/privacy/"]')).toHaveCount(0);
});

for (const theme of ['original', 'light', 'dark'] as const) {
  test(`fine print has no axe violations (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('shq:theme', t), theme);
    for (const path of ['/legal/', '/es/privacy/', '/credits/']) {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations, path).toEqual([]);
    }
  });
}
