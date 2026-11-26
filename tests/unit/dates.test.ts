import { describe, expect, it } from 'vitest';
import { anniversaries, aroundDay, daysBetween, daysSinceEpoch, formatDate, localDateKey, utcDateKey } from '../../src/lib/dates';

describe('date keys', () => {
  it('local and UTC keys differ across midnight', () => {
    // 23:30 on 31 Dec in a UTC-5 browser is already 1 Jan in UTC
    const d = new Date('2027-01-01T04:30:00Z');
    expect(utcDateKey(d)).toBe('2027-01-01');
    expect(localDateKey(new Date(2026, 11, 31, 23, 30))).toBe('2026-12-31');
  });

  it('counts days', () => {
    expect(daysSinceEpoch('1970-01-02')).toBe(1);
    expect(daysBetween('2026-04-03', '2026-11-26')).toBe(237);
    expect(daysBetween('2024-02-28', '2024-03-01')).toBe(2); // leap year
  });
});

describe('anniversaries', () => {
  const items = [
    { date: '2026-04-03', t: 'HALO' },
    { date: '2024-09-13', t: 'LTF' },
    { date: '2018-08-16', t: 'Bubble' },
    { date: '2020', t: 'year only' },
    { date: '2020-02-29', t: 'leap' },
    { date: '2021-01-01', t: 'new year' },
  ];

  it('finds exact anniversaries, never year zero', () => {
    expect(anniversaries(items, '2027-04-03')).toEqual([{ item: items[0], years: 1, offset: 0 }]);
    expect(anniversaries(items, '2026-04-03')).toEqual([]);
  });

  it('looks ±3 days, nearest first, and across the new year', () => {
    expect(anniversaries(items, '2026-09-11').map((a) => [a.item.t, a.offset])).toEqual([['LTF', 2]]);
    expect(anniversaries(items, '2026-12-30').map((a) => [a.item.t, a.years, a.offset])).toEqual([['new year', 6, 2]]);
    expect(anniversaries(items, '2026-08-20')).toEqual([]);
  });

  it('skips partial dates and moves 29 February to 1 March', () => {
    expect(anniversaries(items, '2026-03-01', 0).map((a) => a.item.t)).toEqual(['leap']);
    expect(anniversaries(items, '2028-02-29', 0).map((a) => a.item.t)).toEqual(['leap']);
  });
});

describe('formatDate', () => {
  it('formats in the page language and keeps partial dates partial', () => {
    expect(formatDate('2026-04-03', 'en')).toBe('Apr 3, 2026');
    expect(formatDate('2026-04-03', 'es')).toBe('3 abr 2026');
    expect(formatDate('2020', 'en')).toBe('2020');
    expect(formatDate('2020-06', 'en')).toBe('Jun 2020');
  });
});

describe('aroundDay', () => {
  it('gives yesterday, today and tomorrow across a month and a leap day', () => {
    expect(aroundDay('2024-03-01')).toEqual(['2024-02-29', '2024-03-01', '2024-03-02']);
    expect(aroundDay('2026-12-31')).toEqual(['2026-12-30', '2026-12-31', '2027-01-01']);
  });
});
