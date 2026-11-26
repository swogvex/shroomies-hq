import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const main = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Main' });

test.describe('desktop remote', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('marks the current track and every key is reachable by Tab', async ({ page }) => {
    await page.goto('/');
    await expect(main(page).getByRole('link', { name: /01.*Home/ })).toHaveAttribute('aria-current', 'page');
    const names: string[] = [];
    await page.getByRole('link', { name: 'Previous section' }).focus();
    for (let i = 0; i < 10; i++) {
      names.push((await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')).replace(/\s+/g, ' '));
      await page.keyboard.press('Tab');
    }
    expect(names.join(' | ')).toMatch(/prev.*next.*01.*07.*Calm mode/);
  });

  test('arrow keys on the remote and number keys walk the tracklist', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Previous section' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/\/music\/$/);
    await page.goto('/');
    await page.keyboard.press('4');
    await expect(page).toHaveURL(/\/room\/$/);
  });

  test('calm switch sets calm mode, announces it and is remembered', async ({ page }) => {
    await page.goto('/');
    const sw = page.getByRole('switch', { name: 'Calm mode' });
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    await sw.click();
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-calm', '');
    await expect(page.locator('[data-remote-say]')).toHaveText('CALM · NO FLASH');
    await page.reload();
    await expect(page.getByRole('switch', { name: 'Calm mode' })).toHaveAttribute('aria-checked', 'true');
    await page.getByRole('switch', { name: 'Calm mode' }).click();
    await expect(page.locator('html')).not.toHaveAttribute('data-calm');
  });

  test('never covers the focused footer link', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('contentinfo').getByRole('link').last();
    await link.focus();
    const a = await link.boundingBox();
    const r = await page.locator('[data-remote]').boundingBox();
    expect(a!.y + a!.height).toBeLessThanOrEqual(r!.y);
  });
});

test.describe('phone remote', () => {
  test.use({ viewport: { width: 390, height: 760 } });

  test('the display opens and closes the tracklist', async ({ page }) => {
    await page.goto('/es/');
    const toggle = page.getByRole('button', { name: 'Lista de pistas' });
    await expect(main(page).or(page.getByRole('navigation', { name: 'Principal' }))).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const nav = page.getByRole('navigation', { name: 'Principal' });
    await expect(nav.getByRole('link', { name: /Inicio/ })).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the plain dock list is the navigation', async ({ page }) => {
    await page.goto('/');
    await expect(main(page).getByRole('link')).toHaveCount(7);
    await expect(main(page).getByRole('link', { name: /Wall/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Previous section' })).toBeHidden();
    await expect(page.getByRole('switch')).toBeHidden();
  });
});
