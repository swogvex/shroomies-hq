// Shows: the official tour feed (Seated, the widget on tiffdidwhat.com/tour) synced at build into src/data/tour.json,
// plus the owner's own additions and hidden ids from src/content/tours.md. Pure functions: the network part is scripts/sync-tour.ts.
import { zonedTime } from './portal.ts';

export type Show = {
  id: string;
  date: string; // local date at the venue, YYYY-MM-DD
  startsAt: string | null; // UTC instant, null when the time isn't announced
  city: string; // "Charlotte, NC", "Warsaw, Poland"
  venue: string;
  soldOut: boolean;
  source: string;
};

/** The artist's official tour page (where the feed is shown). */
export const TOUR_PAGE = 'https://www.tiffdidwhat.com/tour';

const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const text = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 120) : '');

/**
 * Seated JSON:API (`/api/tour/<artist>?include=tour-events`) → shows, oldest first.
 * The feed is outside data: anything malformed is skipped, and a response of the wrong shape returns null (keep the snapshot).
 */
export function fromSeated(json: unknown): Show[] | null {
  const included = (json as { included?: unknown })?.included;
  if (!Array.isArray(included)) return null;
  const shows: Show[] = [];
  for (const item of included) {
    if (item?.type !== 'tour-events' || typeof item.id !== 'string' || !/^[\w-]{1,64}$/.test(item.id)) continue;
    const a = item.attributes ?? {};
    const date = a['starts-at-date-local'];
    const venue = text(a['venue-name']);
    // "Prague, Prague" → "Prague"
    const city = [...new Set(text(a['formatted-address']).split(',').map((s) => s.trim()).filter(Boolean))].join(', ');
    if (!isDate(date) || !venue || !city) continue;
    const at = a['is-starts-at-known'] && typeof a['starts-at'] === 'string' ? new Date(a['starts-at']) : null;
    shows.push({ id: item.id, date, startsAt: at && !isNaN(+at) ? at.toISOString() : null, city, venue, soldOut: a['is-sold-out'] === true, source: TOUR_PAGE });
  }
  return shows.sort(byShowDate);
}

const byShowDate = (a: Show, b: Show) => a.date.localeCompare(b.date) || (a.startsAt ?? '').localeCompare(b.startsAt ?? '') || a.id.localeCompare(b.id);

/** New snapshot: the fresh feed, plus past shows the feed has dropped (the tracker keeps her tour history). */
export function refreshShows(previous: readonly Show[], fresh: readonly Show[], today: string): Show[] {
  const ids = new Set(fresh.map((s) => s.id));
  return [...previous.filter((s) => s.date < today && !ids.has(s.id)), ...fresh].sort(byShowDate);
}

export type ManualShow = { date: string; city: string; country: string; venue: string; timeLocal: string; timezone: string; source: string };

/** Every show the site uses: the synced feed minus the owner's hidden ids, plus the owner's own additions. */
export function mergeShows(feed: readonly Show[], manual: readonly ManualShow[], hide: readonly string[] = []): Show[] {
  const added = manual.map((m) => ({
    id: `manual-${m.date}-${m.venue}`,
    date: m.date,
    startsAt: zonedTime(m.date, m.timeLocal, m.timezone).toISOString(),
    city: `${m.city}, ${m.country}`,
    venue: m.venue,
    soldOut: false,
    source: m.source,
  }));
  return [...feed.filter((s) => !hide.includes(s.id)), ...added].sort(byShowDate);
}
