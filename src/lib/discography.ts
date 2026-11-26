// The discography the pages use: MusicBrainz snapshot + the owner's corrections + eras. Applied at build time.
import { byDate, type Credit, type RawRelease, type ReleaseType, type Track } from './musicbrainz.ts';

export const eraIds = ['covers', 'first-singles', 'projects', 'ltf', 'halo'] as const;
export type EraId = (typeof eraIds)[number];
export type Release = RawRelease & { era: EraId };
export type Override = Partial<{ title: string; date: string; type: ReleaseType; era: EraId; hidden: boolean; slug: string }>;
export type Addition = Omit<RawRelease, 'releaseMbid' | 'label' | 'artistCredit' | 'tracks' | 'credits' | 'cover'> &
  Partial<{ label: string | null; artistCredit: string; tracks: Track[]; credits: Credit[]; era: EraId }>;
export type Corrections = { overrides: Record<string, Override>; additions: Addition[] };
export type EraStart = { id: EraId; startsOn: string };

/** The era a date falls in: the latest era that started on or before it. */
export function eraFor(date: string, eras: readonly EraStart[]): EraId {
  const sorted = [...eras].sort((a, b) => b.startsOn.localeCompare(a.startsOn));
  return (sorted.find((e) => e.startsOn <= date) ?? sorted.at(-1)!).id;
}

export function applyCorrections(raw: readonly RawRelease[], { overrides, additions }: Corrections, eras: readonly EraStart[]): Release[] {
  const fixed = raw
    .map((r) => ({ ...r, ...overrides[r.mbid] }))
    .filter((r) => !r.hidden)
    .map(({ hidden, era, ...r }) => ({ ...r, era: era ?? eraFor(r.date, eras) }));
  const added = additions.map((a) => ({
    releaseMbid: a.mbid, label: null, artistCredit: 'Tiffany Day', tracks: [], credits: [], cover: null, ...a, era: a.era ?? eraFor(a.date, eras),
  }));
  const all = [...fixed, ...added].sort(byDate);
  const dup = all.find((r, i) => all.findIndex((o) => o.slug === r.slug) !== i);
  if (dup) throw new Error(`Two releases share the slug "${dup.slug}": set a different slug in discography-corrections.md`);
  return all;
}

export type CatalogueTrack = Track & { release: string; releaseTitle: string; date: string };

/**
 * What resets "days since" and counts in the tracker stats (home and tracker share it): her albums, EPs and singles, and
 * collabs where she is the lead artist ("Tiffany Day & glaive"); not collabs led by someone else, remixes or guest features (owner, 2026-11-26).
 */
export const countsAsRelease = (r: { type: ReleaseType; artistCredit: string }) =>
  r.type === 'album' || r.type === 'ep' || r.type === 'single' || (r.type === 'collab' && r.artistCredit.startsWith('Tiffany Day'));

/** Same title = same song (MusicBrainz sometimes keeps the single and EP versions as two recordings). */
export const songKey = (title: string) => title.trim().toLowerCase();

const preference: Record<ReleaseType, number> = { album: 0, ep: 1, single: 2, collab: 3, remix: 9, guest: 9 };

/**
 * Her own songs, once each (remixes and guest features left out). A song on a single and later on an album is shown "from" the album.
 * Same song = same songKey (e.g. Calone, single and EP).
 * Order is by release date so the song-of-the-day shuffle stays stable when nothing new comes out.
 */
export function ownTracks(releases: readonly Release[]): CatalogueTrack[] {
  const best = new Map<string, { t: CatalogueTrack; rank: number }>();
  for (const r of releases) {
    if (preference[r.type] === 9) continue;
    for (const t of r.tracks) {
      const key = songKey(t.title);
      const prev = best.get(key);
      if (!prev || preference[r.type] < prev.rank) best.set(key, { t: { ...t, release: r.slug, releaseTitle: r.title, date: r.date }, rank: preference[r.type] });
    }
  }
  return [...best.values()].map((b) => b.t).sort((a, b) => byDate({ date: a.date, title: a.release }, { date: b.date, title: b.release }) || a.n - b.n);
}
