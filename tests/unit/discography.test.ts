import { describe, expect, it } from 'vitest';
import { applyCorrections, eraFor, ownTracks, type EraStart } from '../../src/lib/discography';
import { assignSlugs, normalizeRelease, pickRelease, releaseType, slugify, type MbRelease, type RawRelease } from '../../src/lib/musicbrainz';

const eras: EraStart[] = [
  { id: 'covers', startsOn: '2015-01-01' },
  { id: 'first-singles', startsOn: '2018-08-16' },
  { id: 'projects', startsOn: '2021-01-01' },
  { id: 'ltf', startsOn: '2024-05-23' },
  { id: 'halo', startsOn: '2025-07-18' },
];

const rg = (type: string, secondary: string[] = []) => ({ id: 'rg', title: 'T', 'primary-type': type, 'secondary-types': secondary });

describe('musicbrainz normalisation', () => {
  it('maps release group types', () => {
    expect(releaseType(rg('Album'), 1)).toBe('album');
    expect(releaseType(rg('EP'), 1)).toBe('ep');
    expect(releaseType(rg('Single'), 2)).toBe('collab');
    expect(releaseType(rg('EP', ['Remix']), 1)).toBe('remix');
    expect(releaseType(rg('Broadcast', ['Live', 'DJ-mix']), 1)).toBeNull();
    expect(releaseType(rg('Album', ['Compilation']), 1)).toBeNull();
  });

  it('picks the earliest official edition', () => {
    const r = (id: string, date?: string, status = 'Official') => ({ id, date, status }) as MbRelease;
    expect(pickRelease([r('b', '2026-05-01'), r('a', '2026-04-03'), r('c', '2026-01-01', 'Promotion'), r('d')])?.id).toBe('a');
  });

  it('slugifies titles', () => {
    expect(slugify('Summer’s Gone (Skybreak HALF BLOOD remix)')).toBe('summers-gone-skybreak-half-blood-remix');
    expect(slugify("I'M ALIVE")).toBe('im-alive');
    expect(slugify('Café Été')).toBe('cafe-ete');
  });

  it('normalises a release lookup', () => {
    const lookup: MbRelease = {
      id: 'rel-1', title: 'HALO', date: '2026-04-03', status: 'Official',
      'release-group': { id: 'rg-1', title: 'HALO', 'primary-type': 'Album' },
      'artist-credit': [{ name: 'Tiffany Day', joinphrase: '' }],
      'label-info': [{ label: null }, { label: { name: '[no label]' } }, { label: { name: 'Some Label' } }],
      relations: [
        { 'target-type': 'artist', type: 'producer', artist: { name: 'A' } },
        { 'target-type': 'artist', type: 'producer', artist: { name: 'A' } },
        { 'target-type': 'url', type: 'purchase' },
      ],
      media: [
        { tracks: [{ position: 1, title: 'One', length: 1000, recording: { id: 'r1', relations: [{ 'target-type': 'artist', type: 'instrument', attributes: ['guitar'], artist: { name: 'B' } }] } }] },
        { tracks: [{ position: 1, title: 'Two', recording: { id: 'r2', length: 2000 } }] },
      ],
    };
    expect(normalizeRelease(lookup)).toEqual({
      mbid: 'rg-1', releaseMbid: 'rel-1', title: 'HALO', type: 'album', date: '2026-04-03', label: 'Some Label', artistCredit: 'Tiffany Day',
      credits: [{ role: 'producer', name: 'A' }],
      tracks: [
        { mbid: 'r1', n: 1, title: 'One', durationMs: 1000, credits: [{ role: 'guitar', name: 'B' }] },
        { mbid: 'r2', n: 2, title: 'Two', durationMs: 2000, credits: [] },
      ],
    });
  });

  it('keeps old slugs and avoids clashes', () => {
    const base = { releaseMbid: '', label: null, artistCredit: '', tracks: [], credits: [] };
    const out = assignSlugs(
      [
        { ...base, mbid: 'a', title: 'LOVER TOFU FRUIT', type: 'album', date: '2024-09-13' },
        { ...base, mbid: 'b', title: 'Lover Tofu Fruit', type: 'single', date: '2024-08-01' },
        { ...base, mbid: 'c', title: 'Renamed', type: 'single', date: '2020-01-01' },
      ],
      [{ mbid: 'c', slug: 'old-name' }],
    );
    expect(out.map((r) => r.slug)).toEqual(['lover-tofu-fruit', 'lover-tofu-fruit-single', 'old-name']);
  });
});

const release = (over: Partial<RawRelease>): RawRelease => ({
  mbid: 'x', releaseMbid: 'x', slug: 'x', title: 'X', type: 'single', date: '2020-01-01', label: null, artistCredit: 'Tiffany Day', tracks: [], credits: [], ...over,
});

describe('corrections and catalogue', () => {
  it('assigns eras by start date', () => {
    expect(eraFor('2018-08-16', eras)).toBe('first-singles');
    expect(eraFor('2024-05-22', eras)).toBe('projects');
    expect(eraFor('2026-04-03', eras)).toBe('halo');
    expect(eraFor('2010', eras)).toBe('covers');
  });

  it('applies overrides, hides, adds and sorts', () => {
    const raw = [release({ mbid: 'a', slug: 'a', date: '2026-04-03' }), release({ mbid: 'b', slug: 'b', date: '2019-01-30' })];
    const out = applyCorrections(
      raw,
      { overrides: { a: { title: 'Fixed', era: 'ltf' }, b: { hidden: true } }, additions: [{ mbid: 'extra', slug: 'cover', title: 'A cover', type: 'single', date: '2016-05-01' }] },
      eras,
    );
    expect(out.map((r) => [r.slug, r.title, r.era])).toEqual([['cover', 'A cover', 'covers'], ['a', 'Fixed', 'ltf']]);
    expect(out[1]).not.toHaveProperty('hidden');
  });

  it('refuses duplicate slugs', () => {
    expect(() => applyCorrections([release({ mbid: 'a', slug: 's' }), release({ mbid: 'b', slug: 's' })], { overrides: {}, additions: [] }, eras)).toThrow(/"s"/);
  });

  it('lists each own song once, from the album when it is on one', () => {
    const t = (mbid: string, n = 1) => ({ mbid, n, title: mbid, durationMs: null, credits: [] });
    const rels = applyCorrections(
      [
        release({ mbid: '1', slug: 'single', type: 'single', date: '2026-02-20', tracks: [t('start-over')] }),
        release({ mbid: '4', slug: 'single-2', type: 'single', date: '2026-02-21', tracks: [{ ...t('other-recording'), title: 'start-over' }] }),
        release({ mbid: '2', slug: 'halo', type: 'album', date: '2026-04-03', tracks: [t('intro'), t('start-over', 2)] }),
        release({ mbid: '3', slug: 'remix', type: 'remix', date: '2026-05-01', tracks: [t('start-over-remix')] }),
      ],
      { overrides: {}, additions: [] },
      eras,
    );
    expect(ownTracks(rels).map((x) => [x.release, x.n, x.mbid])).toEqual([['halo', 1, 'intro'], ['halo', 2, 'start-over']]);
  });
});
