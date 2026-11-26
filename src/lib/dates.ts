// Calendar dates as 'YYYY-MM-DD' keys. The build uses the UTC date; the browser corrects to the visitor's local date.

const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');

/** The visitor's local calendar date. */
export const localDateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** The UTC calendar date (what the static build renders). */
export const utcDateKey = (d = new Date()) => d.toISOString().slice(0, 10);

/** Days from 1970-01-01 to a full date key. */
export function daysSinceEpoch(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d) / DAY;
}

export const daysBetween = (from: string, to: string) => daysSinceEpoch(to) - daysSinceEpoch(from);

/** True only for full dates; MusicBrainz sometimes has just a year or a month. */
export const isFullDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

export type Anniversary<T> = { item: T; years: number; offset: number };

/**
 * Anniversaries (1 year or more) of dated items within ±window days of today, nearest first, today's first of all.
 * offset < 0 = it was N days ago, > 0 = in N days. A 29 February item counts on 1 March in other years.
 */
export function anniversaries<T extends { date: string }>(items: readonly T[], today: string, window = 3): Anniversary<T>[] {
  const t = daysSinceEpoch(today);
  const year = Number(today.slice(0, 4));
  const out: Anniversary<T>[] = [];
  for (const item of items) {
    if (!isFullDate(item.date)) continue;
    const [y, m, d] = item.date.split('-').map(Number);
    for (const at of [year - 1, year, year + 1]) {
      const offset = Date.UTC(at, m - 1, d) / DAY - t;
      if (Math.abs(offset) <= window && at - y >= 1) out.push({ item, years: at - y, offset });
    }
  }
  return out.sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset) || b.offset - a.offset);
}

/** A date key in the page language, e.g. "26 Nov 2026" / "26 nov 2026". Partial dates show what they have. */
export function formatDate(key: string, locale: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }): string {
  const [y, m = 1, d = 1] = key.split('-').map(Number);
  const partial = key.length === 4 ? { year: 'numeric' as const } : key.length === 7 ? { month: opts.month ?? 'short', year: 'numeric' as const } : opts;
  return new Intl.DateTimeFormat(locale, { ...partial, timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** The build's UTC date with the day either side, so a page can switch to the visitor's local date. */
export const aroundDay = (today = utcDateKey()) => [-1, 0, 1].map((o) => utcDateKey(new Date((daysSinceEpoch(today) + o) * DAY)));
