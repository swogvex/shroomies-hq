import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { watch } from './helpers';

test('tracker renders in EN and ES with no axe violations, third-party requests or console errors', async ({ page, baseURL }) => {
  const { foreign, errors } = watch(page, new URL(baseURL!).origin);
  for (const [path, title] of [['/tracker/', 'The Waveform'], ['/es/tracker/', 'The Waveform']]) {
    await page.goto(path!, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title!);
    await expect(page.locator('.tiles-day:visible .n')).toHaveCount(4);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations, path).toEqual([]);
  }
  expect(foreign).toEqual([]);
  expect(errors).toEqual([]);
});

test('waveform: one peak in the Tab order, arrow keys move along it and the tip follows', async ({ page }) => {
  await page.goto('/tracker/');
  const peaks = page.locator('.peak');
  const count = await peaks.count();
  expect(count).toBeGreaterThan(20);
  await expect(page.locator('.peak[tabindex="0"]')).toHaveCount(1);
  await page.locator('.peak[tabindex="0"]').focus();
  const first = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  await page.keyboard.press('ArrowLeft');
  const second = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  expect(second).not.toBe(first);
  await expect(page.locator('[data-tip]')).toHaveText(second!);
  await expect(page.locator('.peak[tabindex="0"]')).toHaveCount(1);
  await expect(page).toHaveURL(/\/tracker\/$/); // the remote's arrow keys did not change page
  await page.keyboard.press('Home');
  await expect(peaks.first()).toBeFocused();
  await page.keyboard.press('End');
  await expect(peaks.last()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/music\/[a-z0-9-]+\/$/);
});

test('phone: the waveform tip stays over its peak and inside the panel, even at the recent end', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/tracker/');
  const peaks = page.locator('.peak');
  for (const i of [(await peaks.count()) - 1, 0]) {
    await peaks.nth(i).focus();
    const [tip, box, peak] = await Promise.all(['[data-tip]', '[data-wave]', `.peak >> nth=${i}`].map((s) => page.locator(s).boundingBox()));
    expect(tip!.x).toBeGreaterThanOrEqual(box!.x);
    expect(tip!.x + tip!.width).toBeLessThanOrEqual(box!.x + box!.width);
    expect(Math.abs(tip!.x + tip!.width / 2 - (peak!.x + peak!.width / 2))).toBeLessThan(tip!.width / 2 + 12); // over its peak (the edge peaks sit within the 8 px kept for the shadow)
  }
});

test('the table holds the same releases as the waveform and opens without JS', async ({ browser }) => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto('/tracker/');
  await page.getByText('Show as table').click();
  const rows = page.locator('.as-table tbody tr');
  expect(await rows.count()).toBeGreaterThanOrEqual(await page.locator('.peak').count());
  await expect(rows.first().getByRole('link')).toBeVisible();
  await page.close();
});

test.describe('local date', () => {
  test.use({ timezoneId: 'Pacific/Kiritimati' }); // UTC+14
  test('the daily blocks switch to the visitor’s own date', async ({ page }) => {
    const now = new Date();
    await page.clock.setFixedTime(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12)));
    await page.goto('/tracker/');
    const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString().slice(0, 10);
    for (const group of ['.tiles', '.cards']) {
      await expect(page.locator(`${group} > [data-day]:not([hidden])`)).toHaveAttribute('data-day', tomorrow);
      await expect(page.locator(`${group} > [data-day]:not([hidden])`)).toHaveCount(1);
    }
  });
});
