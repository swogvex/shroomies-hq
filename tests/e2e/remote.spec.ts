import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { sections } from '../../src/lib/sections';

const main = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Main' });

test.describe('desktop remote', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('marks the current track and every key is reachable by Tab', async ({ page }) => {
    await page.goto('/');
    await expect(main(page).getByRole('link', { name: /01.*Home/ })).toHaveAttribute('aria-current', 'page');
    const names: string[] = [];
    await page.getByRole('link', { name: 'Previous section' }).focus();
    for (let i = 0; i < 11; i++) {
      names.push((await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')).replace(/\s+/g, ' '));
      await page.keyboard.press('Tab');
    }
    expect(names.join(' | ')).toMatch(/back.*skip.*play.*01.*07.*calm mode/i);
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

// every key, the orange one included, stays inside the screen on small phones in both languages
for (const width of [320, 375, 393]) {
  test.describe(`phone remote at ${width}px`, () => {
    test.use({ viewport: { width, height: 760 } });
    for (const path of ['/', '/es/']) {
      test(`fits the screen on ${path}`, async ({ page }) => {
        await page.goto(path);
        const box = (await page.locator('[data-remote]').boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        const today = (await page.locator('.rk-today').boundingBox())!;
        expect(today.x + today.width).toBeLessThanOrEqual(box.x + box.width);
        // no track name or top line is cut with an ellipsis
        await page.evaluate(() => document.fonts.ready);
        const cut = await page.evaluate((names) => {
          const lcd = document.querySelector('.lcd-mob')!;
          const track = lcd.querySelector<HTMLElement>('.lcd-track')!;
          const over = (el: HTMLElement) => el.offsetWidth > 0 && el.scrollWidth > el.clientWidth;
          const bad = names.filter((n) => ((track.textContent = n), over(track)));
          return over(lcd.querySelector<HTMLElement>('[data-lcd-mode]')!) ? [...bad, 'mode'] : bad;
        }, sections.map((s) => `${s.n} ${s.lcd}`));
        expect(cut).toEqual([]);
      });
    }
  });
}

test.describe('phone LCD with a line too long for it', () => {
  test.use({ viewport: { width: 320, height: 760 } });
  const longLine = async (page: import('@playwright/test').Page) => {
    await page.goto('/');
    const before = (await page.locator('[data-remote]').boundingBox())!.width;
    const state = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.lcd-mob .lcd-track')!;
      el.textContent = '03 A VERY LONG TRACK NAME';
      dispatchEvent(new Event('resize'));
      return { running: el.getAnimations().length, clipped: el.classList.contains('lcd-run') };
    });
    expect((await page.locator('[data-remote]').boundingBox())!.width).toBe(before);
    return state;
  };

  test('glides to its end and back, and the remote keeps its width', async ({ page }) => {
    expect(await longLine(page)).toEqual({ running: 1, clipped: true });
  });

  test('stays still with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await longLine(page)).toEqual({ running: 0, clipped: false });
  });

  test('stays still in calm mode', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('shq:calm', 'on'));
    expect(await longLine(page)).toEqual({ running: 0, clipped: false });
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
