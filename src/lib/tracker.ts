// Pure statistics for the release tracker (09-spec-tracker). Dates are 'YYYY-MM-DD' keys; partial dates are skipped
// where a day is needed. Every function takes `today` so the page can recompute for the visitor's local date.
import { daysBetween, daysSinceEpoch, isFullDate } from './dates.ts';

type Dated = { date: string };

/** Distinct full release dates on or before today, oldest first (two releases on one day are one release day). */
const releaseDays = (releases: readonly Dated[], today: string) =>
  [...new Set(releases.map((r) => r.date).filter((d) => isFullDate(d) && d <= today))].sort();

/** Average days between consecutive release days, rounded; null with fewer than two. */
export function averageGap(releases: readonly Dated[], today: string): number | null {
  const days = releaseDays(releases, today);
  return days.length < 2 ? null : Math.round(daysBetween(days[0]!, days.at(-1)!) / (days.length - 1));
}

/** The longest stretch without a release, the current one (to = today) included. */
export function longestSilence(releases: readonly Dated[], today: string): { days: number; from: string; to: string } | null {
  const days = releaseDays(releases, today);
  if (!days.length) return null;
  let best = { days: daysBetween(days.at(-1)!, today), from: days.at(-1)!, to: today };
  for (let i = 1; i < days.length; i++) {
    const gap = daysBetween(days[i - 1]!, days[i]!);
    if (gap > best.days) best = { days: gap, from: days[i - 1]!, to: days[i]! };
  }
  return best;
}

/** The year with most releases out by today (ties: the latest year). */
export function busiestYear(releases: readonly Dated[], today: string): { year: string; count: number } | null {
  const counts = new Map<string, number>();
  for (const r of releases) if (r.date <= today) counts.set(r.date.slice(0, 4), (counts.get(r.date.slice(0, 4)) ?? 0) + 1);
  let best: { year: string; count: number } | null = null;
  for (const [year, count] of counts) if (!best || count > best.count || (count === best.count && year > best.year)) best = { year, count };
  return best;
}

/** How many releases out by today came out on a Friday (the global release day). */
export const fridays = (releases: readonly Dated[], today: string) =>
  releases.filter((r) => isFullDate(r.date) && r.date <= today && new Date(daysSinceEpoch(r.date) * 86_400_000).getUTCDay() === 5).length;

/** The next announced release after today, with whole days left. */
export function nextUpcoming<T extends Dated>(upcoming: readonly T[], today: string): (T & { days: number }) | undefined {
  const next = upcoming.filter((u) => u.date > today).sort((a, b) => a.date.localeCompare(b.date))[0];
  return next && { ...next, days: daysBetween(today, next.date) };
}

export type Peak<T> = { item: T; x: number; height: number };

/**
 * Waveform peaks: x from 0 (start) to 1 (today) by date, height from 0 to 1 by track count (the biggest release = 1).
 * Releases on one day stack into one peak (the biggest wins).
 */
export function peaks<T extends Dated & { tracks: number }>(releases: readonly T[], start: string, today: string): Peak<T>[] {
  const span = Math.max(1, daysBetween(start, today));
  const max = Math.max(1, ...releases.map((r) => r.tracks));
  const byDay = new Map<string, T>();
  for (const r of releases) {
    if (!isFullDate(r.date) || r.date < start || r.date > today) continue;
    const prev = byDay.get(r.date);
    if (!prev || r.tracks > prev.tracks) byDay.set(r.date, r);
  }
  return [...byDay.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({ item, x: daysBetween(start, item.date) / span, height: Math.max(item.tracks, 1) / max }));
}
