import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const theme of ['original', 'light', 'dark'] as const) {
  test(`no axe violations in the ${theme} theme, EN and ES`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('shq:theme', t), theme);
    for (const path of ['/', '/es/']) {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations, path).toEqual([]);
    }
  });
}

test('theme pill cycles Original → Light → Dark and is remembered', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const html = page.locator('html');
  const pill = page.getByRole('button', { name: /^Theme: Original/ });
  await expect(html).toHaveAttribute('data-theme', 'original');
  await pill.click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Theme: Light. Change theme' })).toBeVisible();
  await page.getByRole('button', { name: /^Theme: Light/ }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

test('first visit follows a dark OS preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('calm mode and time slot are set before paint', async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 0, 1, 19, 30));
  await page.addInitScript(() => localStorage.setItem('shq:calm', 'on'));
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-slot', 'sunset');
  await expect(html).toHaveAttribute('data-calm', '');
});

test('language switch keeps the page and sets lang', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('button', { name: /^Tema: Original/ })).toBeVisible();
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the page works and the theme pill stays hidden', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.theme-pill')).toBeHidden();
  });
});
