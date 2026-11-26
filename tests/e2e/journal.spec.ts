import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { watch } from './helpers';

test('journal pages render in EN and ES with no axe violations, third-party requests or console errors', async ({ page, baseURL }) => {
  const { foreign, errors } = watch(page, new URL(baseURL!).origin);
  for (const path of ['/journal/', '/es/journal/', '/journal/type/tour/', '/journal/meant-to-be/', '/es/journal/spring-2027-tour/']) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations, path).toEqual([]);
  }
  expect(foreign).toEqual([]);
  expect(errors).toEqual([]);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('filters are plain links that show only their kind', async ({ page }) => {
    await page.goto('/journal/');
    const filters = page.getByRole('navigation', { name: 'Show entries' });
    await expect(filters.getByRole('link', { name: 'All' })).toHaveAttribute('aria-current', 'page');
    await filters.getByRole('link', { name: 'Press' }).click();
    await expect(page).toHaveURL(/\/journal\/type\/press\/$/);
    await expect(filters.getByRole('link', { name: 'Press' })).toHaveAttribute('aria-current', 'page');
    const types = await page.locator('.side .type').allTextContents();
    expect(types.length).toBeGreaterThan(0);
    expect(new Set(types)).toEqual(new Set(['Press']));
  });
});

test('an entry shows its source, reading time and older/newer links', async ({ page }) => {
  await page.goto('/journal/meant-to-be/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('MEANT TO BE with glaive');
  await expect(page.locator('.meta')).toContainText('min read');
  await expect(page.locator('.source a')).toHaveAttribute('href', /^https:\/\//);
  await expect(page.getByRole('link', { name: /Older/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Newer/ })).toBeVisible();
  await expect(page.locator('.side [aria-current="page"]')).toContainText('MEANT TO BE');
});

test('an unreviewed Spanish entry says so and links the English one; tour entries point to the tracker', async ({ page }) => {
  await page.goto('/es/journal/spring-2027-tour/');
  await expect(page.locator('.review')).toContainText('Traducción en revisión');
  await expect(page.locator('.review a')).toHaveAttribute('href', '/journal/spring-2027-tour/');
  await expect(page.locator('.tour-note a')).toHaveAttribute('href', '/es/tracker/');
});

for (const [path, lang] of [['/rss.xml', 'en'], ['/es/rss.xml', 'es']] as const) {
  test(`${path} is well-formed RSS with absolute links`, async ({ page, request }) => {
    const res = await request.get(path);
    expect(res.headers()['content-type']).toMatch(/xml/); // application/rss+xml in production (vercel.json); the local preview says text/xml
    const xml = await res.text();
    await page.goto('/');
    const feed = await page.evaluate((src) => {
      const doc = new DOMParser().parseFromString(src, 'application/xml');
      const items = [...doc.querySelectorAll('item')];
      return {
        error: doc.querySelector('parsererror')?.textContent ?? null,
        language: doc.querySelector('channel > language')?.textContent,
        title: doc.querySelector('channel > title')?.textContent,
        items: items.length,
        complete: items.every((i) => ['title', 'link', 'guid', 'pubDate', 'description'].every((n) => i.querySelector(n)?.textContent)),
        links: items.map((i) => i.querySelector('link')!.textContent!),
      };
    }, xml);
    expect(feed.error).toBeNull();
    expect(feed.language).toBe(lang);
    expect(feed.title).toBeTruthy();
    expect(feed.items).toBeGreaterThan(0);
    expect(feed.items).toBeLessThanOrEqual(30);
    expect(feed.complete).toBe(true);
    for (const link of feed.links) expect(link).toMatch(lang === 'es' ? /^https:\/\/shroomieshq\.fan\/es\/journal\/[a-z0-9-]+\/$/ : /^https:\/\/shroomieshq\.fan\/journal\/[a-z0-9-]+\/$/);
  });
}
