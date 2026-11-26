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
    for (let i = 0; i < 12; i++) {
      names.push((await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')).replace(/\s+/g, ' '));
      await page.keyboard.press('Tab');
    }
    expect(names.join(' | ')).toMatch(/back.*skip.*play.*01.*07.*search.*calm mode/i);
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


// small phones, large phones, iPad portrait/landscape, laptops and big screens
const widths = [320, 360, 375, 393, 430, 768, 1024, 1180, 1280, 1440, 1920];
const lcd = (page: import('@playwright/test').Page) => page.locator('.remote-lcd:visible');

for (const width of widths) {
  test.describe(`remote at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test('fits the screen, keeps one width on every page and shows every track whole', async ({ page }) => {
      const sizes: number[] = [];
      for (const path of ['/', '/es/music/']) {
        await page.goto(path);
        const box = (await page.locator('[data-remote]').boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        const today = (await page.locator('.rk-today').boundingBox())!;
        expect(today.x + today.width).toBeLessThanOrEqual(box.x + box.width);
        sizes.push(box.width);
      }
      expect(sizes[1]).toBe(sizes[0]);
      // no track name or top line needs to glide or cut
      await page.evaluate(() => document.fonts.ready);
      const cut = await lcd(page).evaluate((el, names) => {
        const track = el.querySelector<HTMLElement>('.lcd-track')!;
        const desk = el.classList.contains('lcd-desk');
        const over = (e: HTMLElement) => e.offsetWidth > 0 && e.scrollWidth > e.clientWidth;
        const bad = names.filter(([n, name]) => ((track.textContent = desk ? `TRK ${n} · ${name}` : `${n} ${name}`), over(track)));
        return over(el.querySelector<HTMLElement>('[data-lcd-mode]')!) ? [...bad, 'mode'] : bad;
      }, sections.map((s) => [s.n, s.lcd]));
      expect(cut).toEqual([]);
    });
  });
}

for (const width of [320, 1280]) {
  test.describe(`LCD at ${width}px with a line too long for it`, () => {
    test.use({ viewport: { width, height: 800 } });
    const longLine = async (page: import('@playwright/test').Page) => {
      await page.goto('/');
      const before = (await page.locator('[data-remote]').boundingBox())!.width;
      const state = await lcd(page).evaluate((el) => {
        const line = el.querySelector<HTMLElement>('.lcd-track')!;
        line.textContent = 'TRK 03 · A VERY VERY LONG TRACK NAME';
        dispatchEvent(new Event('resize'));
        return { running: line.getAnimations().length, clipped: line.classList.contains('lcd-run') };
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
}

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
