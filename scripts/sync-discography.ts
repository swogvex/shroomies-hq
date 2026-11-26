// Refreshes src/data/discography.json from MusicBrainz (runs as npm prebuild).
// Never fails the build: if MusicBrainz is down or slow, the committed snapshot stays as it is.
// The owner's corrections (src/content/discography-corrections.md) are applied at build time, so they work offline too.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { assignSlugs, byDate, normalizeRelease, pickRelease, type MbRelease, type RawRelease } from '../src/lib/musicbrainz.ts';

const ARTIST = 'c9e3089c-a7bc-4df5-80f9-9161eaa74a02'; // Tiffany Day, verified with the owner 2026-11-26
const API = 'https://musicbrainz.org/ws/2/';
const USER_AGENT = 'ShroomiesHQ/1.0 ( https://shroomieshq.fan )';
const OUT = new URL('../src/data/discography.json', import.meta.url);

if (process.env.GITHUB_ACTIONS) {
  console.log('[discography] CI: using the committed snapshot.');
  process.exit(0);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
let last = 0;
const deadline = Date.now() + 180_000; // a busy MusicBrainz must not hold the build for long

async function get<T>(path: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    if (Date.now() > deadline) throw new Error('took longer than 3 minutes');
    await wait(Math.max(0, last + 1100 - Date.now())); // MusicBrainz allows 1 request per second
    last = Date.now();
    const res = await fetch(API + path + '&fmt=json', { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(15_000) });
    if (res.ok) return (await res.json()) as T;
    if (res.status !== 503 || attempt === 4) throw new Error(`${res.status} on ${path}`);
    await wait(2000 * 2 ** attempt); // 503 = busy or rate limited
  }
}

async function sync() {
  const all: MbRelease[] = [];
  // her releases, then releases by others where she is on a track (guest features)
  for (const by of ['artist', 'track_artist']) {
    for (let offset = 0, count = 1; offset < count; offset += 100) {
      const page = await get<{ releases: MbRelease[]; 'release-count': number }>(`release?${by}=${ARTIST}&inc=release-groups&limit=100&offset=${offset}`);
      all.push(...page.releases);
      count = page.releases.length ? page['release-count'] : 0;
    }
  }
  const groups = Map.groupBy(all, (r) => r['release-group'].id);
  const found: Omit<RawRelease, 'slug'>[] = [];
  const skipped: string[] = [];
  for (const releases of groups.values()) {
    const pick = pickRelease(releases);
    if (!pick) continue;
    const full = await get<MbRelease>(`release/${pick.id}?inc=recordings+artist-credits+labels+release-groups+artist-rels+recording-level-rels`);
    const release = normalizeRelease(full, ARTIST);
    if (release) found.push(release);
    else skipped.push(`${full.date ?? '?'} ${full['release-group'].title} (${[full['release-group']['primary-type'], ...(full['release-group']['secondary-types'] ?? [])].join(' + ')})`);
  }
  let previous: RawRelease[] = [];
  try {
    previous = JSON.parse(readFileSync(OUT, 'utf8'));
  } catch {}
  const releases = assignSlugs(found, previous).sort(byDate);
  writeFileSync(OUT, JSON.stringify(releases, null, 2) + '\n');
  console.log(`[discography] ${releases.length} releases, ${releases.reduce((n, r) => n + r.tracks.length, 0)} tracks.`);
  if (skipped.length) console.log(`[discography] Live, DJ mix or compilation, skipped (add them in discography-corrections.md if wanted):\n  ${skipped.join('\n  ')}`);
}

/**
 * Front covers from the Cover Art Archive, self-hosted in src/assets/covers/<release-group mbid>.<ext> (no hotlinking).
 * Named by mbid so a slug changed in the corrections keeps its cover. Only missing ones are fetched.
 */
async function covers() {
  const dir = new URL('../src/assets/covers/', import.meta.url);
  mkdirSync(dir, { recursive: true });
  const have = new Set(readdirSync(dir).map((f) => f.replace(/\.\w+$/, '')));
  const missing: string[] = [];
  for (const r of JSON.parse(readFileSync(OUT, 'utf8')) as RawRelease[]) {
    if (have.has(r.mbid)) continue;
    try {
      const res = await fetch(`https://coverartarchive.org/release-group/${r.mbid}/front-1200`, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(30_000) });
      const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as Record<string, string>)[res.headers.get('content-type') ?? ''];
      if (!res.ok || !ext) throw new Error(String(res.status));
      writeFileSync(new URL(`${r.mbid}.${ext}`, dir), Buffer.from(await res.arrayBuffer()));
    } catch {
      missing.push(r.slug); // the shelf uses the typographic cover instead
    }
  }
  if (missing.length) console.log(`[discography] No cover found for: ${missing.join(', ')}`);
}

await sync().catch((e) => console.warn(`[discography] MusicBrainz unavailable, keeping the committed snapshot: ${e.message}`));
await covers().catch((e) => console.warn(`[discography] Covers skipped: ${e.message}`));
