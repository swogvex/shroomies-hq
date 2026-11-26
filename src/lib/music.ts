// Build-time music data for the pages: the corrected discography, covers, mixtapes and song of the day.
// Wrong references in mixtapes or song-of-day.md fail the build with the file and the reference to fix.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import sharp from 'sharp';
import raw from '../data/discography.json';
import { applyCorrections, ownTracks, type EraId, type Release } from './discography.ts';
import type { Links, RawRelease, Track } from './musicbrainz.ts';
import { matches, songOfDay } from './song-of-day.ts';
import { daysSinceEpoch, utcDateKey } from './dates.ts';

/** Drafts show everywhere except the production site, so previews and local builds can review them. */
export const published = (e: { data: { draft?: boolean } }) => !e.data.draft || process.env.VERCEL_ENV !== 'production';

const coverFiles = import.meta.glob<ImageMetadata>('../assets/covers/*', { eager: true, import: 'default' });
const coverImage = (file: string | null) => (file ? coverFiles[`../assets/covers/${file}`] : undefined);

/** Spine colours from the approved boards; each release gets the one nearest its cover's dominant colour. */
const spines = { flash: [255, 255, 255], night: [58, 60, 72], plush: [255, 143, 199], aura: [255, 74, 28], peri: [154, 166, 255], lemon: [255, 243, 107], strobe: [35, 53, 240], grass: [63, 154, 58] } as const;
export type Spine = keyof typeof spines;

async function spineFor(file: string | null): Promise<Spine> {
  if (!file) return 'night';
  const { dominant: d } = await sharp(`src/assets/covers/${file}`).stats();
  const dist = ([r, g, b]: readonly number[]) => (r - d.r) ** 2 + (g - d.g) ** 2 + (b - d.b) ** 2;
  return (Object.keys(spines) as Spine[]).reduce((a, b) => (dist(spines[b]) < dist(spines[a]) ? b : a));
}

export type ShelfRelease = Release & {
  image?: ImageMetadata;
  spine: Spine;
  listen: Links;
  lyrics: Record<string, string>;
  note?: CollectionEntry<'releases'>;
  durationMs: number | null;
};

let cache: Promise<ShelfRelease[]> | undefined;

/** Every visible release, oldest first, with the owner's fan layer (releases/*.md) merged in. */
export function discography(): Promise<ShelfRelease[]> {
  return (cache ??= (async () => {
    const corrections = (await getEntry('discography-corrections', 'discography-corrections'))!.data;
    const eras = (await getCollection('eras')).map((e) => ({ id: e.id as EraId, startsOn: e.data.startsOn }));
    const notes = new Map((await getCollection('releases', published)).map((n) => [n.id, n]));
    const releases = applyCorrections(raw as RawRelease[], corrections, eras);
    for (const slug of notes.keys()) if (!releases.some((r) => r.slug === slug)) throw new Error(`src/content/releases/${slug}.md: no release with that slug in the discography`);
    return Promise.all(
      releases.map(async (r) => {
        const note = notes.get(r.slug);
        const cover = note?.data.cover ?? r.cover;
        const ms = r.tracks.map((t) => t.durationMs);
        return {
          ...r,
          image: coverImage(cover),
          spine: await spineFor(cover),
          listen: { ...r.links, ...note?.data.listen },
          lyrics: note?.data.lyricsSource ?? {},
          note,
          durationMs: ms.length && ms.every((m) => m !== null) ? ms.reduce((a, b) => a! + b!, 0) : null,
        };
      }),
    );
  })());
}

export type TrackRef = Track & { release: ShelfRelease };

/** A mixtape or song-of-day reference resolved against every release (guest and remix tracks included). */
export function resolve(releases: readonly ShelfRelease[], ref: string, where: string): TrackRef {
  for (const release of releases) {
    const t = release.tracks.find((t) => matches(ref)({ ...t, release: release.slug }));
    if (t) return { ...t, release };
  }
  throw new Error(`${where}: "${ref}" matches no track in the discography (use a recording id or release-slug#track-number)`);
}

export async function mixtapes() {
  const releases = await discography();
  return (await getCollection('mixtapes', published))
    .sort((a, b) => a.data.order - b.data.order)
    .map((m) => ({ ...m, tracks: m.data.tracks.map((ref) => resolve(releases, ref, `src/content/mixtapes/${m.id}.md`)) }));
}

/** Song of the day for the UTC build date and the day either side, so the browser can switch to the visitor's local date. */
export async function songsOfDays(today = utcDateKey()) {
  const releases = await discography();
  const rules = (await getEntry('song-of-day', 'song-of-day'))!.data;
  for (const ref of [...Object.values(rules.pins), ...rules.exclude]) resolve(releases, ref, 'src/content/song-of-day.md');
  const catalogue = ownTracks(releases);
  const day = (offset: number) => new Date((daysSinceEpoch(today) + offset) * 86_400_000).toISOString().slice(0, 10);
  return Object.fromEntries([-1, 0, 1].map((o) => [day(o), songOfDay(catalogue, day(o), rules)!])) as Record<string, (typeof catalogue)[number]>;
}

/** Surprise me pool: her own songs (no collabs, remixes or features) minus song-of-day.md exclusions, as "slug#n". */
export async function surprisePool(): Promise<string[]> {
  const releases = await discography();
  const { exclude } = (await getEntry('song-of-day', 'song-of-day'))!.data;
  const solo = new Set(releases.filter((r) => r.type !== 'collab').map((r) => r.slug));
  return ownTracks(releases)
    .filter((t) => solo.has(t.release) && !exclude.some((ref) => matches(ref)(t)))
    .map((t) => `${t.release}#${t.n}`);
}

/** Show filter of the shelf: singles include remixes, collabs include her guest features. */
export const showGroup = { album: 'albums', ep: 'eps', single: 'singles', remix: 'singles', collab: 'collabs', guest: 'collabs' } as const;

/** 3:21 style duration. */
export const duration = (ms: number) => {
  const s = Math.round(ms / 1000);
  return s >= 3600 ? `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
