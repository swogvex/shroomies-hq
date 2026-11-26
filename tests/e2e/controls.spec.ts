import { test, expect } from '@playwright/test';

// Owner's rule: every boxed control (a link, button, select or summary drawn as a box with a hard shadow or a 2 px+
// border) lifts on hover like the buttons do. Add new pages here as they ship.
const pages = ['/', '/music/', '/music/halo/', '/music/mixtapes/when-the-drop-hits/', '/tracker/', '/journal/', '/journal/meant-to-be/'];
const keyboardOnly = ['skip-link']; // only visible while focused from the keyboard

for (const width of [1280, 390]) {
  test(`every boxed control lifts on hover at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const checked = new Set<string>();
    const still: string[] = [];
    for (const path of pages) {
      await page.goto(path);
      const items = await page.evaluate((skip) => {
        const found: { i: number; key: string }[] = [];
        document.querySelectorAll('a, button, select, summary').forEach((e, i) => {
          const r = e.getBoundingClientRect();
          const cs = getComputedStyle(e);
          if (!r.width || !r.height || cs.visibility === 'hidden' || cs.opacity === '0') return;
          if (skip.some((c) => e.classList.contains(c))) return;
          const hard = /\d+px \d+px 0px/.test(cs.boxShadow) && !cs.boxShadow.includes('inset');
          const boxed = parseFloat(cs.borderTopWidth) >= 2 && cs.borderTopStyle !== 'none';
          if (!hard && !boxed) return;
          e.setAttribute('data-audit', String(i));
          found.push({ i, key: `${e.tagName.toLowerCase()}.${[...e.classList].filter((c) => !c.startsWith('astro')).join('.')}` });
        });
        return found;
      }, keyboardOnly);
      for (const { i, key } of items) {
        if (checked.has(key)) continue;
        checked.add(key);
        const el = page.locator(`[data-audit="${i}"]`);
        await el.scrollIntoViewIfNeeded();
        const pos = () => el.evaluate((e) => `${e.getBoundingClientRect().top}|${getComputedStyle(e).transform}|${getComputedStyle(e).translate}`);
        const before = await pos();
        await el.hover({ force: true });
        await expect.poll(pos, { timeout: 1000 }).not.toBe(before).catch(() => still.push(`${key} on ${path}`));
        await page.mouse.move(1, 1);
      }
    }
    expect(still).toEqual([]);
  });
}
