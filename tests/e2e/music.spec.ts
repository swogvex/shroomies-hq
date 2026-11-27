import { test, expect } from '@playwright/test';
import { watch } from './helpers';
import AxeBuilder from '@axe-core/playwright';
import releases from '../../src/data/discography.json' with { type: 'json' };


test('every shelf link opens a release page, in EN and ES', async ({ page, request }) => {
  for (const base of ['/music/', '/es/music/']) {
    await page.goto(base);
    const hrefs = await page.locator('.cd a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
    expect(hrefs.length).toBeGreaterThan(40);
    for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
  }
});

for (const theme of ['original', 'dark'] as const) {
  test(`music pages have no axe violations (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('shq:theme', t), theme);
    for (const path of ['/music/', '/es/music/halo/', '/music/mixtapes/the-college-years/']) {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations, path).toEqual([]);
    }
  });
}

test('era tabs show one shelf at a time and work by keyboard', async ({ page }) => {
  await page.goto('/music/');
  const halo = page.getByRole('tab', { name: /HALO/ });
  await expect(halo).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#era-halo')).toBeVisible();
  await expect(page.locator('#era-ltf')).toBeHidden();
  await halo.focus();
  await page.keyboard.press('ArrowLeft');
  const ltf = page.getByRole('tab', { name: /LOVER TOFU FRUIT/ });
  await expect(ltf).toBeFocused();
  await expect(ltf).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#era-ltf')).toBeVisible();
  await expect(page.locator('#era-halo')).toBeHidden();
  await expect(page).toHaveURL(/#era-ltf$/);
  await page.reload();
  await expect(ltf).toHaveAttribute('aria-selected', 'true');
});

test('the Show select keeps one kind, hides empty eras and keeps it in the URL', async ({ page }) => {
  await page.goto('/music/');
  const select = page.getByLabel('Show');
  await select.selectOption('albums');
  await expect(page).toHaveURL(/\?show=albums/);
  const albums = releases.filter((r) => r.type === 'album').length;
  await expect(page.locator('.cd:not([hidden])')).toHaveCount(albums);
  await expect(page.getByRole('tab', { name: /First singles/ })).toBeHidden();
  await page.reload();
  await expect(select).toHaveValue('albums');
  await expect(page.locator('.cd:not([hidden])')).toHaveCount(albums);
  await select.selectOption('all');
  await expect(page).not.toHaveURL(/show=/);
});

test('Surprise me opens a song not opened before and remembers it', async ({ page }) => {
  await page.goto('/music/');
  await page.getByRole('button', { name: 'Surprise me' }).click();
  await expect(page).toHaveURL(/\/music\/[a-z0-9-]+\/#t\d+$/);
  const opened = await page.evaluate(() => JSON.parse(localStorage.getItem('shq:opened-songs') ?? '[]'));
  expect(opened).toHaveLength(1);
  await expect(page.locator('.tracks li:target')).toHaveCount(1);
});

test('Surprise me still works when its stored list is damaged', async ({ page }) => {
  for (const bad of ['5', '{}', '"x"', 'not json']) {
    await page.goto('/music/');
    await page.evaluate((v) => localStorage.setItem('shq:opened-songs', v), bad);
    await page.getByRole('button', { name: 'Surprise me' }).click();
    await expect(page, bad).toHaveURL(/\/music\/[a-z0-9-]+\/#t\d+$/);
  }
});

test('release pages make no third-party request before a click', async ({ page, baseURL }) => {
  const { foreign, errors } = watch(page, new URL(baseURL!).origin);
  for (const path of ['/music/', '/music/halo/', '/es/music/lover-tofu-fruit/', '/music/mixtapes/when-the-drop-hits/']) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('iframe')).toHaveCount(0);
  }
  expect(foreign).toEqual([]);
  expect(errors).toEqual([]);
});

test('the player gate loads Spotify only after the click and moves focus to it', async ({ page }) => {
  const withSpotify = releases.find((r) => (r as { links?: { spotify?: string } }).links?.spotify);
  test.skip(!withSpotify, 'no release has a Spotify link in the snapshot yet');
  await page.route('https://open.spotify.com/**', (route) => route.fulfill({ body: '<title>stub</title>', contentType: 'text/html' }));
  const spotify: string[] = [];
  page.on('request', (r) => r.url().startsWith('https://open.spotify.com') && spotify.push(r.url()));
  await page.goto(`/music/${withSpotify!.slug}/`, { waitUntil: 'networkidle' });
  expect(spotify).toEqual([]);
  await page.getByRole('button', { name: /Load Spotify player/ }).click();
  const frame = page.locator('iframe[src^="https://open.spotify.com/embed/"]');
  await expect(frame).toHaveCount(1);
  await expect(frame).toBeFocused();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the shelf is a list of links and the JS-only controls stay hidden', async ({ page }) => {
    await page.goto('/music/');
    await expect(page.locator('.cd a').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Surprise me' })).toBeHidden();
    await expect(page.getByRole('combobox')).toBeHidden();
    await expect(page.getByRole('tablist')).toBeHidden();
    await expect(page.locator('#era-first-singles')).toBeVisible(); // every era stacked
    await page.goto('/music/halo/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('HALO');
  });
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
  test('the era bar sticks to the top and a tap starts the new era from its first CD', async ({ page }) => {
    await page.goto('/music/');
    await page.evaluate(() => scrollBy(0, 600));
    await expect.poll(() => page.locator('.tabs').evaluate((e) => Math.abs(Math.round(e.getBoundingClientRect().top)))).toBe(0);
    await page.getByRole('tab', { name: /Projects/ }).tap();
    await expect(page.locator('#era-projects')).toBeVisible();
    await expect.poll(() => page.locator('.cabinet-wrap').evaluate((e) => Math.abs(Math.round(e.getBoundingClientRect().top)))).toBe(0);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations).toEqual([]);
  });

  test('an open Show picker closes when the page scrolls or a finger drags elsewhere', async ({ page }) => {
    await page.goto('/music/');
    const select = page.locator('[data-filter]');
    const isOpen = () => select.evaluate((e) => e.matches(':open'));
    test.skip(!(await page.evaluate(() => CSS.supports('appearance', 'base-select'))), 'native picker');
    await select.tap();
    expect(await isOpen()).toBe(true);
    await page.evaluate(() => scrollBy(0, 200));
    await expect.poll(isOpen).toBe(false);
    await select.tap();
    await page.locator('.page-title').dispatchEvent('touchmove');
    await expect.poll(isOpen).toBe(false);
    await select.tap();
    await page.getByRole('option', { name: 'EPs' }).click(); // still works after closing
    await expect(page).toHaveURL(/show=eps/);
  });
});

test('choosing an era tab never scrolls the tab row and cuts the tab tops', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/music/');
  for (const era of ['first-singles', 'projects', 'ltf', 'halo']) {
    await page.locator(`#tab-${era}`).click();
    expect(await page.locator('[data-tabs]').evaluate((e) => [e.scrollTop, e.scrollHeight - e.clientHeight])).toEqual([0, 0]);
  }
});
