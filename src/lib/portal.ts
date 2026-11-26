// Pure helpers for the home page (07-spec-home): days since the last release, the release sparkline, shows.
import { daysBetween, isFullDate } from './dates.ts';

type Dated = { date: string };

/** The newest release out on or before `today` (full dates only), with the days since it came out. */
export function lastRelease<T extends Dated>(releases: readonly T[], today: string): { release: T; days: number } | undefined {
  const out = releases.filter((r) => isFullDate(r.date) && r.date <= today).sort((a, b) => b.date.localeCompare(a.date))[0];
  return out && { release: out, days: daysBetween(out.date, today) };
}

/** Releases per calendar month for the `months` months ending with the month of `today`, oldest first. */
export function monthlyCounts(releases: readonly Dated[], today: string, months = 14): { month: string; count: number }[] {
  const [y, m] = today.split('-').map(Number) as [number, number];
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - (months - 1 - i), 1));
    const month = d.toISOString().slice(0, 7);
    return { month, count: releases.filter((r) => r.date.startsWith(month)).length };
  });
}

/** The UTC instant of a wall-clock time in an IANA time zone (e.g. a show at 20:00 in America/Chicago). */
export function zonedTime(date: string, time: string, timeZone: string): Date {
  const [y, mo, d] = date.split('-').map(Number) as [number, number, number];
  const [h, mi] = time.split(':').map(Number) as [number, number];
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  // how far the zone's clock is from UTC at that moment; a second pass settles DST changeovers
  const offset = (at: number) => {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        .formatToParts(at)
        .map((x) => [x.type, x.value]),
    );
    return Date.UTC(+p.year!, +p.month! - 1, +p.day!, +p.hour!, +p.minute!) - at;
  };
  const first = guess - offset(guess);
  return new Date(guess - offset(first));
}

/** The next show on or after `today`, if any. */
export const nextShow = <T extends Dated>(shows: readonly T[], today: string) => shows.filter((s) => s.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
