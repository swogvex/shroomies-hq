import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { slotFor } from '../../src/lib/time-slot';

describe('slotFor', () => {
  it('follows the four slot boundaries', () => {
    expect([5, 6, 11, 12, 17, 18, 20, 21, 0].map(slotFor)).toEqual(
      ['night', 'morning', 'morning', 'afternoon', 'afternoon', 'sunset', 'sunset', 'night', 'night'],
    );
  });

  it('matches public/init.js for every hour', () => {
    const src = readFileSync(new URL('../../public/init.js', import.meta.url), 'utf8');
    for (let hour = 0; hour < 24; hour++) {
      const html = { dataset: {} as Record<string, string> };
      const RealDate = Date;
      const env = {
        document: { documentElement: html },
        localStorage: { getItem: () => null },
        matchMedia: () => ({ matches: false }),
        Date: class extends RealDate { getHours() { return hour; } },
      };
      new Function(...Object.keys(env), src)(...Object.values(env));
      expect(html.dataset.slot, `hour ${hour}`).toBe(slotFor(hour));
    }
  });
});
