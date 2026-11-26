// One song per calendar date, the same for everyone on that date. No server, no randomness at runtime.
import { daysSinceEpoch } from './dates.ts';

/** FNV-1a 32-bit hash of a string. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

/** Deterministic Fisher–Yates shuffle (mulberry32 generator): same items + same seed = same order on every device. */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  let a = hash(seed);
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type Pickable = { mbid: string; release: string; n: number };
/** A track reference from song-of-day.md or a mixtape: a MusicBrainz recording id or "release-slug#track-number". */
export const matches = (ref: string) => (t: Pickable) => ref === t.mbid || ref === `${t.release}#${t.n}`;

export type SongOfDayRules = { pins?: Record<string, string>; exclude?: readonly string[] };

/** The song for a 'YYYY-MM-DD' date: a pinned one if the owner set it, otherwise the seeded rotation. */
export function songOfDay<T extends Pickable>(catalogue: readonly T[], date: string, { pins = {}, exclude = [] }: SongOfDayRules = {}): T | undefined {
  const pinned = pins[date] && catalogue.find(matches(pins[date]));
  if (pinned) return pinned;
  const pool = seededShuffle(catalogue.filter((t) => !exclude.some((ref) => matches(ref)(t))), 'shq');
  return pool[((daysSinceEpoch(date) % pool.length) + pool.length) % pool.length];
}
