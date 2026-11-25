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
