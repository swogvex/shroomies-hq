import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { watch } from './helpers';

const box = (page: Page) => page.getByRole('combobox', { name: /search|buscar/i });
const hits = (page: Page) => page.getByRole('listbox').getByRole('option');

test.describe('search dialog', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('opens with /, Ctrl+K and the remote key, and Esc gives focus back', async ({ page }) => {
    await page.goto('/music/');
    await page.keyboard.press('/');
    await expect(box(page)).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();

    await page.keyboard.press('Control+k');
    await expect(box(page)).toBeFocused();
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('dialog')).toBeHidden();

    const key = page.getByRole('button', { name: 'Search songs, releases and the journal' });
    await key.click();
    await expect(box(page)).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(key).toBeFocused();
  });

  test('finds a song, groups the results, moves with the arrows and opens with Enter', async ({ page }) => {
    const { foreign, errors } = watch(page, 'http://localhost:4321');
    await page.goto('/');
    await page.keyboard.press('/');
    await box(page).fill('same la');
    const songs = page.getByRole('group', { name: /Songs/ });
    await expect(songs.getByRole('option').first()).toContainText('SAME LA');
    await expect(songs.getByRole('option').first()).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('group', { name: /Releases/ })).toBeVisible();
    await expect(page.locator('[data-search-say]')).toHaveText(/^\d+ results?$/);
    await expect(box(page)).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('ArrowDown');
    const second = hits(page).nth(1);
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(box(page)).toHaveAttribute('aria-activedescendant', (await second.getAttribute('id'))!);
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/music\/halo\/#t3$/);
    expect(foreign).toEqual([]);
    expect(errors).toEqual([]); // the CSP lets Pagefind's WebAssembly run
  });

  test('needs every word, ignores accents and puts the exact title first', async ({ page }) => {
    await page.goto('/music/');
    await page.keyboard.press('/');
    await box(page).fill('halo');
    await expect(hits(page).first()).toHaveAttribute('href', '/music/halo/');
    await box(page).fill('spoleto well cover');
    await expect(page.getByText('Nothing for “spoleto well cover”')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('button', { name: 'surprise me' })).toBeVisible();
    await expect(page.locator('[data-search-state]')).toHaveText('0 RESULTS');
  });

  test('searches the Spanish index from Spanish pages', async ({ page }) => {
    await page.goto('/es/');
    await page.keyboard.press('/');
    await box(page).fill('cancion');
    const entry = page.getByRole('group', { name: /Diario/ }).getByRole('option').first();
    await expect(entry).toHaveAttribute('href', /^\/es\/journal\//);
    await expect(entry.locator('mark').first()).toHaveText(/canci[oó]n/i);
  });

  test('a suggestion fills the box and searches', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('/');
    await page.getByRole('button', { name: '2018' }).click();
    await expect(box(page)).toHaveValue('2018');
    await expect(hits(page).first()).toBeVisible();
  });

  for (const theme of ['original', 'dark'] as const) {
    test(`open dialog with results has no axe violations (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('shq:theme', t), theme);
      await page.goto('/journal/');
      await page.keyboard.press('/');
      await box(page).fill('tour');
      await expect(hits(page).first()).toBeVisible();
      const { violations } = await new AxeBuilder({ page }).include('#search').analyze();
      expect(violations).toEqual([]);
    });
  }
});

test.describe('search on phones', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens from the tracklist and fits the screen', async ({ page }) => {
    await page.goto('/es/');
    await page.getByRole('button', { name: 'Lista de pistas' }).click();
    await page.getByRole('button', { name: 'Buscar canciones, lanzamientos y el diario' }).click();
    await expect(box(page)).toBeFocused();
    await expect(page.locator('[data-tracklist-toggle]')).toHaveAttribute('aria-expanded', 'false');
    await box(page).fill('same');
    await expect(hits(page).first()).toBeVisible();
    const width = await page.locator('#search').evaluate((d) => d.getBoundingClientRect().right);
    expect(width).toBeLessThanOrEqual(390);
  });
});
