// Refreshes src/data/tour.json from the official tour feed (Seated, as shown on tiffdidwhat.com/tour). Runs as npm prebuild,
// so the daily rebuild picks up new dates. Never fails the build: on any problem the committed snapshot stays as it is.
import { readFileSync, writeFileSync } from 'node:fs';
import { fromSeated, refreshShows, type Show } from '../src/lib/tour.ts';
import { utcDateKey } from '../src/lib/dates.ts';

const FEED = 'https://cdn.seated.com/api/tour/b660d468-6bf1-44e7-8f9a-d0ad10d279fe?include=tour-events'; // artist id from the widget on tiffdidwhat.com/tour
const OUT = new URL('../src/data/tour.json', import.meta.url);

if (process.env.GITHUB_ACTIONS) {
  console.log('[tour] CI: using the committed snapshot.');
  process.exit(0);
}

try {
  const res = await fetch(FEED, { headers: { 'User-Agent': 'ShroomiesHQ/1.0 ( https://shroomieshq.fan )' }, signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(String(res.status));
  const fresh = fromSeated(await res.json());
  if (!fresh) throw new Error('unexpected feed shape');
  let previous: Show[] = [];
  try {
    previous = JSON.parse(readFileSync(OUT, 'utf8'));
  } catch {}
  const shows = refreshShows(previous, fresh, utcDateKey());
  writeFileSync(OUT, JSON.stringify(shows, null, 2) + '\n');
  console.log(`[tour] ${shows.length} shows (${fresh.length} in the feed).`);
} catch (e) {
  console.warn(`[tour] Feed unavailable, keeping the committed snapshot: ${(e as Error).message}`);
}
