import { describe, expect, it } from 'vitest';
import { lastRelease, monthlyCounts, nextShow, zonedTime } from '../../src/lib/portal';

const releases = [{ date: '2026-10-13' }, { date: '2026-06-17' }, { date: '2026' }, { date: '2026-12-01' }, { date: '2026-10-02' }];

describe('portal helpers', () => {
  it('finds the last release out by today and counts the days', () => {
    expect(lastRelease(releases, '2026-11-24')).toEqual({ release: { date: '2026-10-13' }, days: 42 });
    expect(lastRelease(releases, '2026-10-13')?.days).toBe(0);
    expect(lastRelease([{ date: '2027-01-01' }], '2026-11-24')).toBeUndefined();
  });

  it('counts releases per month, ending with the current month', () => {
    const counts = monthlyCounts(releases, '2026-11-24', 3);
    expect(counts).toEqual([
      { month: '2026-09', count: 0 },
      { month: '2026-10', count: 2 },
      { month: '2026-11', count: 0 },
    ]);
    expect(monthlyCounts([], '2026-01-15', 14)[0]!.month).toBe('2024-12');
  });

  it('converts a venue wall-clock time to the real instant, across DST', () => {
    expect(zonedTime('2027-03-04', '20:00', 'America/Chicago').toISOString()).toBe('2027-03-05T02:00:00.000Z'); // CST, UTC-6
    expect(zonedTime('2027-07-04', '20:00', 'America/Chicago').toISOString()).toBe('2027-07-05T01:00:00.000Z'); // CDT, UTC-5
    expect(zonedTime('2026-11-26', '21:00', 'Europe/Warsaw').toISOString()).toBe('2026-11-26T20:00:00.000Z');
    expect(zonedTime('2027-04-10', '19:30', 'Asia/Tokyo').toISOString()).toBe('2027-04-10T10:30:00.000Z');
  });

  it('picks the next show on or after today', () => {
    const shows = [{ date: '2026-11-20' }, { date: '2026-12-02' }, { date: '2026-11-26' }];
    expect(nextShow(shows, '2026-11-26')).toEqual({ date: '2026-11-26' });
    expect(nextShow(shows, '2026-12-03')).toBeUndefined();
  });
});
