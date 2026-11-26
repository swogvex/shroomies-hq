import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import releases from '../../src/data/discography.json' with { type: 'json' };

/** Records requests that leave our own origin. */
function watchForeign(page: Page, origin: string) {
  const foreign: string[] = [];
  page.on('request', (r) => {
    const url = new URL(r.url());
    if (url.protocol.startsWith('http') && url.origin !== origin) foreign.push(r.url());
  });
  return foreign;
}

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

test('the shelf filter shows one kind and keeps it in the URL', async ({ page }) => {
  await page.goto('/music/');
  await page.getByRole('button', { name: 'Albums' }).click();
  await expect(page).toHaveURL(/\?show=albums$/);
  await expect(page.getByRole('button', { name: 'Albums' })).toHaveAttribute('aria-pressed', 'true');
  const visible = page.locator('.cd:not([hidden])');
  await expect(visible).toHaveCount(releases.filter((r) => r.type === 'album').length);
  await expect(page.locator('#era-first-singles')).toBeHidden();
  await page.reload();
  await expect(visible).toHaveCount(releases.filter((r) => r.type === 'album').length);
  await page.getByRole('button', { name: 'Everything' }).click();
  await expect(page).toHaveURL(/\/music\/$/);
});

test('Surprise me opens a song not opened before and remembers it', async ({ page }) => {
  await page.goto('/music/');
  await page.getByRole('button', { name: 'Surprise me' }).click();
  await expect(page).toHaveURL(/\/music\/[a-z0-9-]+\/#t\d+$/);
  const opened = await page.evaluate(() => JSON.parse(localStorage.getItem('shq:opened-songs') ?? '[]'));
  expect(opened).toHaveLength(1);
  await expect(page.locator('.tracks li:target')).toHaveCount(1);
});

test('release pages make no third-party request before a click', async ({ page, baseURL }) => {
  const foreign = watchForeign(page, new URL(baseURL!).origin);
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
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
    await expect(page.getByRole('group', { name: 'Show' })).toBeHidden();
    await page.goto('/music/halo/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('HALO');
  });
});
