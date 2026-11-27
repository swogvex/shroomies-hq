import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { watch } from './helpers';
import { read, type AuraQuestion, type DeckSong } from '../../src/lib/aura';

type PageData = { feelings: { id: string }[]; questions: AuraQuestion[]; deck: DeckSong[] };
const pageData = (page: Page) => page.locator('[data-aura-data]').evaluate((el) => JSON.parse(el.textContent!)) as Promise<PageData>;
const axe = async (page: Page) => expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

/** Answers (0–3 each) whose reading is, or is not, a standalone single. */
function answersFor(d: PageData, standalone: boolean) {
  const order = d.feelings.map((f) => f.id);
  for (let k = 0; k < 4 ** 8; k++) {
    const a = Array.from({ length: 8 }, (_, i) => Math.floor(k / 4 ** i) % 4);
    if (read(a, d.questions, d.deck, order).song.standalone === standalone) return a;
  }
  throw new Error('no such reading');
}

async function answerAll(page: Page, answers: number[]) {
  for (const [i, a] of answers.entries()) {
    await expect(page.locator(`.q[data-q="${i}"]`)).toBeVisible();
    await page.locator(`.q[data-q="${i}"] .opt`).nth(a).click();
  }
  await expect(page.locator('[data-stage="result"]')).toBeVisible();
}

test('intro in EN and ES: B1 is the current track, no axe violations, the deck lists every song', async ({ page }) => {
  for (const [path, title] of [['/aura/', 'The aura reading'], ['/es/aura/', 'La lectura del aura']]) {
    await page.goto(path!);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title!);
    await expect(page.locator('nav a[aria-current="page"]')).toContainText('B1');
    await expect(page.locator('[data-start]')).toBeVisible();
    await expect(page.locator('[data-nojs]')).toBeHidden();
    const d = await pageData(page);
    await expect(page.locator('#deck .songs li')).toHaveCount(d.deck.length);
    await axe(page);
  }
});

test('a pointer reading moves on by itself, ends on a song, saves only the last result and loads nothing from Spotify before Listen', async ({ page, baseURL }) => {
  const { foreign, errors } = watch(page, new URL(baseURL!).origin);
  await page.goto('/aura/');
  const d = await pageData(page);
  const answers = answersFor(d, false);
  await page.locator('[data-start]').click();
  await expect(page.locator('.lcd-track').first()).toContainText('B1 · Q 1/8');
  await answerAll(page, answers);
  const expected = read(answers, d.questions, d.deck, d.feelings.map((f) => f.id));
  await expect(page.locator('[data-song-title]')).toHaveText(expected.song.title);
  await expect(page.locator('[data-era-block]')).toBeVisible();
  await expect(page.locator('[data-announce]')).toContainText(expected.song.title);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('shq:aura')!));
  expect(saved).toMatchObject({ era: expected.era, song: expected.song.title });
  expect(Object.keys(saved).sort()).toEqual(['date', 'era', 'song']); // never the answers
  const sum = await page.locator('[data-mix-pct]').allTextContents();
  expect(sum.reduce((a, b) => a + parseInt(b), 0)).toBe(100);
  await axe(page);
  expect(foreign).toEqual([]);
  await page.locator('[data-stage="result"] [data-gate-load]').click();
  await expect(page.locator('[data-stage="result"] iframe')).toHaveAttribute('src', /open\.spotify\.com\/embed\//);
  expect(errors).toEqual([]);
});

test('keyboard: picks never jump pages, 1–4 pick, Enter goes on, Backspace goes back, the number keys stay on the page', async ({ page }) => {
  await page.goto('/aura/');
  await page.locator('[data-start]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#aura-q0')).toBeFocused();
  await expect(page.locator('[data-progress-text]')).toHaveText('Question 1 of 8');
  await page.keyboard.press('2');
  await expect(page.locator('.q[data-q="0"] input').nth(1)).toBeChecked();
  await page.keyboard.press('ArrowDown'); // native radios: the arrow moves the pick, the page stays
  await expect(page.locator('.q[data-q="0"] input').nth(2)).toBeChecked();
  await page.waitForTimeout(600);
  await expect(page.locator('.q[data-q="0"]')).toBeVisible();
  await page.keyboard.press('7'); // the remote's shortcut would leave the reading
  await expect(page).toHaveURL(/\/aura\/$/);
  await page.keyboard.press('Enter');
  await expect(page.locator('#aura-q1')).toBeFocused();
  await page.keyboard.press('Backspace');
  await expect(page.locator('#aura-q0')).toBeFocused();
  await expect(page.locator('.q[data-q="0"] input').nth(2)).toBeChecked(); // the answer is kept
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('D');
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('[data-stage="result"]')).toBeVisible();
  await expect(page.locator('[data-era-name]')).toBeFocused();
  await expect(page.locator('[data-era-name]')).toHaveText('HALO');
});

test('a standalone single shows only the song, in a white light, in Spanish', async ({ page }) => {
  await page.goto('/es/aura/');
  const d = await pageData(page);
  await page.locator('[data-start]').click();
  await answerAll(page, answersFor(d, true));
  await expect(page.locator('[data-era-block]')).toBeHidden();
  await expect(page.locator('[data-mix-block]')).toBeHidden();
  await expect(page.locator('[data-solo-block]')).toBeVisible();
  await expect(page.locator('[data-caption]')).toHaveText('luz blanca');
  await expect(page.locator('[data-song-from]')).toContainText('un single por su cuenta');
});

test('take it again and the browser back button walk the reading without losing the page', async ({ page }) => {
  await page.goto('/aura/');
  await page.locator('[data-start]').click();
  await page.locator('.q[data-q="0"] .opt').first().click();
  await expect(page.locator('.q[data-q="1"]')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.q[data-q="0"]')).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-stage="intro"]')).toBeVisible();
  await page.locator('[data-start]').click();
  await answerAll(page, [0, 0, 0, 0, 0, 0, 0, 0]);
  await page.locator('[data-again]').click();
  await expect(page.locator('#aura-q0')).toBeFocused();
  await expect(page.locator('.q[data-q="0"] input:checked')).toHaveCount(0);
});

test('the aura card is drawn in the browser, with no request anywhere else', async ({ page, baseURL }) => {
  const { foreign } = watch(page, new URL(baseURL!).origin);
  await page.goto('/aura/');
  await page.locator('[data-start]').click();
  await answerAll(page, [3, 3, 3, 3, 3, 3, 3, 3]);
  await page.locator('[data-make-card]').click();
  const canvas = page.locator('[data-card-canvas]');
  await expect(canvas).toHaveAttribute('aria-label', /HALO/);
  const painted = () => canvas.evaluate((c: HTMLCanvasElement) => {
    const px = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    let ink = 0;
    for (let i = 0; i < px.length; i += 400) if (px[i]! < 60) ink++;
    return ink;
  });
  await expect.poll(painted).toBeGreaterThan(50);
  await page.getByText('Story').click();
  await expect.poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.height)).toBe(1350);
  await axe(page);
  await page.keyboard.press('Escape');
  expect(foreign).toEqual([]);
});

test('without JS: the intro says so and every possible result is a link', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/aura/');
  await expect(page.locator('[data-nojs]')).toBeVisible();
  await expect(page.locator('[data-start]')).toBeHidden();
  await expect(page.locator('[data-stage="quiz"]')).toBeHidden();
  expect(await page.locator('#deck .songs a').count()).toBeGreaterThan(50);
  await ctx.close();
});

test.describe('calm mode', () => {
  test('no drifting aura or spinning disc', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('shq:calm', 'on'));
    await page.goto('/aura/');
    const names = await page.locator('.hero .blob').first().evaluate((e) => getComputedStyle(e).animationName);
    expect(names).toBe('none');
    await page.locator('[data-start]').click();
    expect(await page.locator('.disc[data-state="now"]').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
  });
});

test.describe('phone', () => {
  test.use({ viewport: { width: 360, height: 780 }, hasTouch: true });
  test('every question fits the screen width and Next stays reachable', async ({ page }) => {
    await page.goto('/aura/');
    await page.locator('[data-start]').tap();
    for (let i = 0; i < 8; i++) {
      const q = page.locator(`.q[data-q="${i}"]`);
      await expect(q).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
      await q.locator('.opt').first().tap();
    }
    await expect(page.locator('[data-stage="result"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    await axe(page);
  });
});
