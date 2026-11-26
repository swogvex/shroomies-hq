import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home renders with no axe violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shroomies HQ');
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations).toEqual([]);
});

test('home makes no third-party requests and has no console errors', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const foreign: string[] = [];
  const errors: string[] = [];
  page.on('request', (r) => {
    const url = new URL(r.url());
    if (url.protocol.startsWith('http') && url.origin !== origin) foreign.push(r.url());
  });
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(foreign).toEqual([]);
  expect(errors).toEqual([]);
});

test.describe('local date', () => {
  // UTC+14: at noon UTC the visitor is already on the next calendar day
  test.use({ timezoneId: 'Pacific/Kiritimati' });
  test('the song of the day and the other daily blocks switch to the visitor’s own date', async ({ page }) => {
    const now = new Date();
    await page.clock.setFixedTime(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12)));
    await page.goto('/');
    const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString().slice(0, 10);
    await expect(page.locator('#today [data-day]:not([hidden])')).toHaveAttribute('data-day', tomorrow);
    await expect(page.locator('#today [data-day]:not([hidden])')).toHaveCount(1);
    await expect(page.locator('#song-title')).toBeVisible();
  });
});

test('the today key on the remote opens the song card', async ({ page }) => {
  await page.goto('/music/');
  await page.getByRole('link', { name: 'Song of the day' }).click();
  await expect(page).toHaveURL(/\/#today$/);
  await expect(page.locator('#today')).toBeInViewport();
});
