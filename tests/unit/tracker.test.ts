import { describe, expect, it } from 'vitest';
import { averageGap, busiestYear, fridays, longestSilence, nextUpcoming, peaks } from '../../src/lib/tracker';

// Hand-checked fixture: a leap day, two releases on one day, a year-only date, one release after "today".
const fixture = [
  { date: '2024-02-29', tracks: 1, t: 'A' }, // Thursday
  { date: '2024-03-01', tracks: 5, t: 'B' }, // Friday
  { date: '2024-03-01', tracks: 1, t: 'C' }, // Friday, same day as B
  { date: '2025-03-07', tracks: 2, t: 'D' }, // Friday
  { date: '2023', tracks: 1, t: 'E' }, // MusicBrainz only knows the year
  { date: '2025-09-05', tracks: 3, t: 'F' }, // after today
];
const today = '2025-06-01';

describe('tracker stats on the hand-checked fixture', () => {
  it('average gap: 2024-02-29 → 2025-03-07 is 372 days over 2 gaps', () => {
    expect(averageGap(fixture, today)).toBe(186);
  });

  it('longest silence: 2024-03-01 → 2025-03-07 (371 days) beats the current 86', () => {
    expect(longestSilence(fixture, today)).toEqual({ days: 371, from: '2024-03-01', to: '2025-03-07' });
  });

  it('the current silence counts when it is the longest', () => {
    const noF = fixture.filter((r) => r.t !== 'F');
    expect(longestSilence(noF, '2026-06-01')).toEqual({ days: 451, from: '2025-03-07', to: '2026-06-01' });
  });

  it('busiest year: 2024 with 3 (the year-only date counts for 2023)', () => {
    expect(busiestYear(fixture, today)).toEqual({ year: '2024', count: 3 });
    expect(busiestYear([{ date: '2023' }, { date: '2024-05-01' }], today)).toEqual({ year: '2024', count: 1 }); // tie: latest year
  });

  it('fridays: B, C and D', () => {
    expect(fridays(fixture, today)).toBe(3);
  });
});

describe('edge cases', () => {
  it('no releases', () => {
    expect(averageGap([], today)).toBeNull();
    expect(longestSilence([], today)).toBeNull();
    expect(busiestYear([], today)).toBeNull();
    expect(fridays([], today)).toBe(0);
    expect(peaks([], '2015-01-01', today)).toEqual([]);
  });

  it('one release', () => {
    const one = [{ date: '2025-05-30', tracks: 1 }];
    expect(averageGap(one, today)).toBeNull();
    expect(longestSilence(one, today)).toEqual({ days: 2, from: '2025-05-30', to: today });
    expect(busiestYear(one, today)).toEqual({ year: '2025', count: 1 });
  });

  it('releases on the same day are one release day', () => {
    expect(averageGap([{ date: '2025-01-03' }, { date: '2025-01-03' }], today)).toBeNull();
  });
});

describe('countdown', () => {
  it('picks the nearest announced date after today', () => {
    const up = [{ date: '2025-06-01', title: 'today' }, { date: '2025-06-10', title: 'later' }, { date: '2025-06-03', title: 'next' }];
    expect(nextUpcoming(up, today)).toEqual({ date: '2025-06-03', title: 'next', days: 2 });
    expect(nextUpcoming([{ date: '2025-05-01' }], today)).toBeUndefined();
  });
});

describe('waveform peaks', () => {
  it('places peaks by date, sizes them by tracks and stacks one day into its biggest release', () => {
    const p = peaks(fixture, '2024-01-01', today);
    expect(p.map((x) => x.item.t)).toEqual(['A', 'B', 'D']);
    expect(p.map((x) => x.height)).toEqual([0.2, 1, 0.4]);
    expect(p[0]!.x).toBeCloseTo(59 / 517);
    expect(p.at(-1)!.x).toBeLessThanOrEqual(1);
  });
});
