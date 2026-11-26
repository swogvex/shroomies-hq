import { describe, expect, it } from 'vitest';
import { seededShuffle, songOfDay } from '../../src/lib/song-of-day';

const catalogue = Array.from({ length: 40 }, (_, i) => ({ mbid: `rec-${i}`, release: i < 20 ? 'halo' : 'ltf', n: (i % 20) + 1 }));

describe('seededShuffle', () => {
  it('is a stable permutation', () => {
    const a = seededShuffle(catalogue, 'shq');
    expect(a).toEqual(seededShuffle(catalogue, 'shq'));
    expect(a).not.toEqual(catalogue);
    expect([...a].sort((x, y) => x.n - y.n || x.release.localeCompare(y.release))).toEqual(
      [...catalogue].sort((x, y) => x.n - y.n || x.release.localeCompare(y.release)),
    );
    expect(seededShuffle(catalogue, 'other')).not.toEqual(a);
  });
});

describe('songOfDay', () => {
  it('is the same for the same date and walks the whole catalogue before repeating', () => {
    expect(songOfDay(catalogue, '2026-11-26')).toEqual(songOfDay(catalogue, '2026-11-26'));
    const days = Array.from({ length: 40 }, (_, i) => songOfDay(catalogue, new Date(Date.UTC(2026, 10, 26 + i)).toISOString().slice(0, 10))!.mbid);
    expect(new Set(days).size).toBe(40);
  });

  it('honours pins by recording id or release#track, and exclusions', () => {
    expect(songOfDay(catalogue, '2027-01-30', { pins: { '2027-01-30': 'rec-7' } })?.mbid).toBe('rec-7');
    expect(songOfDay(catalogue, '2027-01-30', { pins: { '2027-01-30': 'ltf#3' } })?.mbid).toBe('rec-22');
    const unknownPin = songOfDay(catalogue, '2027-01-30', { pins: { '2027-01-30': 'nope' } });
    expect(unknownPin).toEqual(songOfDay(catalogue, '2027-01-30'));
    const only = songOfDay(catalogue, '2027-01-30', { exclude: catalogue.slice(1).map((t) => t.mbid) });
    expect(only?.mbid).toBe('rec-0');
  });

  it('returns nothing for an empty catalogue', () => {
    expect(songOfDay([], '2026-11-26')).toBeUndefined();
  });
});
