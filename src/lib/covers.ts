// Cover art dedupe: one file per artwork, named after the main release that uses it (used by scripts/sync-discography.ts).
import type { RawRelease, ReleaseType } from './musicbrainz.ts';

/** Mean absolute difference of two raw 16×16 RGB thumbnails: 0 = identical, 255 = opposite. */
export function thumbDistance(a: Uint8Array, b: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

/** Re-uploads of one artwork measure about 1; different covers 18 or more (checked on all 47 covers, 2026-11-26). */
export const sameArtwork = (a: Uint8Array, b: Uint8Array) => thumbDistance(a, b) < 6;

const rank: Record<ReleaseType, number> = { album: 0, ep: 1, single: 2, collab: 3, remix: 4, guest: 5 };

/** Renames so each cover file is called after its main release (album first, then EP…, then the earliest): current → wanted. */
export function coverNames(releases: readonly Pick<RawRelease, 'slug' | 'type' | 'date' | 'cover'>[]): Map<string, string> {
  const renames = new Map<string, string>();
  for (const [file, users] of Map.groupBy(releases.filter((r) => r.cover), (r) => r.cover!)) {
    const main = users.toSorted((a, b) => rank[a.type] - rank[b.type] || a.date.localeCompare(b.date))[0];
    const wanted = main.slug + file.slice(file.lastIndexOf('.'));
    if (wanted !== file) renames.set(file, wanted);
  }
  return renames;
}
