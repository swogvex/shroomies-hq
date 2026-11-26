// Refreshes src/data/discography.json from MusicBrainz (runs as npm prebuild).
// Never fails the build: if MusicBrainz is down or slow, the committed snapshot stays as it is.
// The owner's corrections (src/content/discography-corrections.md) are applied at build time, so they work offline too.
import { mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { coverNames, sameArtwork } from '../src/lib/covers.ts';
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
  const found: Omit<RawRelease, 'slug' | 'cover'>[] = [];
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
 * Front covers from the Cover Art Archive, self-hosted in src/assets/covers/ (no hotlinking).
 * One file per artwork: a single that reuses the album art points to the album's file. Files are named after the
 * main release using them (halo.jpg). Only releases without a cover are fetched; the snapshot records each release's file.
 */
async function covers() {
  const dir = new URL('../src/assets/covers/', import.meta.url);
  mkdirSync(dir, { recursive: true });
  const thumb = (img: Buffer) => sharp(img).resize(16, 16, { fit: 'fill' }).removeAlpha().raw().toBuffer();
  const known = new Map<string, Buffer>();
  for (const file of readdirSync(dir)) known.set(file, await thumb(readFileSync(new URL(file, dir))));
  const releases = JSON.parse(readFileSync(OUT, 'utf8')) as RawRelease[];
  const missing: string[] = [];
  for (const r of releases) {
    if (r.cover && known.has(r.cover)) continue;
    try {
      const res = await fetch(`https://coverartarchive.org/release-group/${r.mbid}/front-1200`, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(30_000) });
      const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as Record<string, string>)[res.headers.get('content-type') ?? ''];
      if (!res.ok || !ext) throw new Error(String(res.status));
      const img = Buffer.from(await res.arrayBuffer());
      const t = await thumb(img);
      r.cover = [...known].find(([, k]) => sameArtwork(k, t))?.[0] ?? `${r.slug}.${ext}`;
      if (!known.has(r.cover)) {
        writeFileSync(new URL(r.cover, dir), img);
        known.set(r.cover, t);
      }
    } catch {
      r.cover = null; // the shelf uses the typographic cover instead
      missing.push(r.slug);
    }
  }
  for (const [from, to] of coverNames(releases)) {
    renameSync(new URL(from, dir), new URL(to, dir));
    for (const r of releases) if (r.cover === from) r.cover = to;
  }
  writeFileSync(OUT, JSON.stringify(releases, null, 2) + '\n');
  if (missing.length) console.log(`[discography] No cover found for: ${missing.join(', ')}`);
}

await sync().catch((e) => console.warn(`[discography] MusicBrainz unavailable, keeping the committed snapshot: ${e.message}`));
await covers().catch((e) => console.warn(`[discography] Covers skipped: ${e.message}`));
