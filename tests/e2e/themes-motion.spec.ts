import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/es/', '/music/', '/es/music/halo/', '/music/mixtapes/when-the-drop-hits/'];

test('new pages have no axe violations in the light theme', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('shq:theme', 'light'));
  for (const path of pages) {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations, path).toEqual([]);
  }
});

for (const how of ['calm', 'reduced'] as const) {
  test(`no CD or cassette motion with ${how === 'calm' ? 'calm mode' : 'reduced motion'}`, async ({ page }) => {
    if (how === 'calm') await page.addInitScript(() => localStorage.setItem('shq:calm', 'on'));
    else await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/music/');
    const cd = page.locator('#era-halo .cd a').first();
    await cd.hover();
    await expect.poll(() => cd.evaluate((a) => getComputedStyle(a).rotate)).toBe('none');
    expect(await cd.locator('.disc').evaluate((d) => getComputedStyle(d).animationName)).toBe('none');
    const tape = page.locator('.cassette').first();
    await tape.hover();
    expect(await tape.locator('.hub').first().evaluate((h) => getComputedStyle(h).animationName)).toBe('none');
  });
}

test('keyboard: Tab reaches the shelf, a CD opens with Enter', async ({ page }) => {
  await page.goto('/music/');
  await page.getByRole('tab', { name: /HALO/ }).focus();
  await page.keyboard.press('Tab'); // into the open shelf
  const focused = page.locator('.cd a:focus');
  await expect(focused).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/music\/[a-z0-9-]+\/$/);
});
