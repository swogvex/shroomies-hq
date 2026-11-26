import { describe, expect, it } from 'vitest';
import { applyCorrections, countsAsRelease, eraFor, ownTracks, type EraStart } from '../../src/lib/discography';
import { assignSlugs, isGuest, normalizeRelease, pickRelease, releaseType, slugify, type MbRelease, type RawRelease } from '../../src/lib/musicbrainz';

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
    expect(releaseType(rg('Single', ['Remix']), 3, true)).toBe('guest');
    expect(releaseType(rg('Album', ['Live']), 1, true)).toBeNull();
  });

  it('spots guest features', () => {
    const credit = (...parts: [string, string][]) => parts.map(([id, joinphrase]) => ({ name: id, joinphrase, artist: { id } }));
    expect(isGuest(credit(['TD', '']), 'TD')).toBe(false);
    expect(isGuest(credit(['TD', ' & '], ['glaive', '']), 'TD')).toBe(false); // collab
    expect(isGuest(credit(['Lucian', ' & '], ['TD', '']), 'TD')).toBe(false); // joint single
    expect(isGuest(credit(['Dabin', ' & '], ['FrostTop', ' feat. '], ['TD', '']), 'TD')).toBe(true);
    expect(isGuest(credit(['Daniel Allan', '']), 'TD')).toBe(true); // only on a track
  });

  it('keeps only her tracks on a guest release, with the release numbering', () => {
    const track = (id: string, artist: string) => ({ position: 1, title: id, recording: { id }, 'artist-credit': [{ name: artist, artist: { id: artist } }] });
    const out = normalizeRelease(
      { id: 'r', title: 'Noise Pollution', 'release-group': { id: 'g', title: 'Noise Pollution', 'primary-type': 'Album' },
        'artist-credit': [{ name: 'Daniel Allan', artist: { id: 'DA' } }], media: [{ tracks: [track('a', 'DA'), track('b', 'TD'), track('c', 'DA')] }] },
      'TD',
    );
    expect(out?.type).toBe('guest');
    expect(out?.tracks.map((t) => [t.mbid, t.n])).toEqual([['b', 2]]);
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
      'artist-credit': [{ name: 'Tiffany Day', joinphrase: '', artist: { id: 'TD' } }],
      'label-info': [{ label: null }, { label: { name: '[no label]' } }, { label: { name: 'Some Label' } }],
      relations: [
        { 'target-type': 'artist', type: 'producer', artist: { name: 'A' } },
        { 'target-type': 'artist', type: 'producer', artist: { name: 'A' } },
        { 'target-type': 'url', type: 'purchase' },
        { 'target-type': 'url', type: 'free streaming', url: { resource: 'https://open.spotify.com/album/4T7qu6MdxoGjzZPErRWgsO' } },
        { 'target-type': 'url', type: 'streaming', url: { resource: 'https://music.apple.com/us/album/1872819106' } },
        { 'target-type': 'url', type: 'streaming', url: { resource: 'http://music.apple.com/us/album/2' } },
        { 'target-type': 'url', type: 'free streaming', url: { resource: 'https://www.deezer.com/album/907282002' } },
      ],
      media: [
        { tracks: [{ position: 1, title: 'One', length: 1000, recording: { id: 'r1', relations: [{ 'target-type': 'artist', type: 'instrument', attributes: ['guitar'], artist: { name: 'B' } }] } }] },
        { tracks: [{ position: 1, title: 'Two', recording: { id: 'r2', length: 2000 } }] },
      ],
    };
    expect(normalizeRelease(lookup, 'TD')).toEqual({
      mbid: 'rg-1', releaseMbid: 'rel-1', title: 'HALO', type: 'album', date: '2026-04-03', label: 'Some Label', artistCredit: 'Tiffany Day',
      credits: [{ role: 'producer', name: 'A' }],
      links: { spotify: 'https://open.spotify.com/album/4T7qu6MdxoGjzZPErRWgsO', apple: 'https://music.apple.com/us/album/1872819106' },
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
      [{ mbid: 'c', slug: 'old-name', cover: 'old-name.jpg' }],
    );
    expect(out.map((r) => [r.slug, r.cover])).toEqual([['lover-tofu-fruit', null], ['lover-tofu-fruit-single', null], ['old-name', 'old-name.jpg']]);
  });
});

const release = (over: Partial<RawRelease>): RawRelease => ({
  mbid: 'x', releaseMbid: 'x', slug: 'x', title: 'X', type: 'single', date: '2020-01-01', label: null, artistCredit: 'Tiffany Day', tracks: [], credits: [], cover: null, ...over,
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
        release({ mbid: '5', slug: 'guest', type: 'guest', date: '2026-05-02', tracks: [t('wish-upon-a-star')] }),
      ],
      { overrides: {}, additions: [] },
      eras,
    );
    expect(ownTracks(rels).map((x) => [x.release, x.n, x.mbid])).toEqual([['halo', 1, 'intro'], ['halo', 2, 'start-over']]);
    // search also lists remix and guest tracks, and a song she has on her own release still points there
    const withRemixOfSame = [...rels, { ...release({ mbid: '6', slug: 'remix-2', type: 'remix', date: '2026-06-01', tracks: [t('start-over')] }), era: 'halo' as const }];
    expect(ownTracks(withRemixOfSame, true).map((x) => [x.release, x.mbid])).toEqual([['halo', 'intro'], ['halo', 'start-over'], ['remix', 'start-over-remix'], ['guest', 'wish-upon-a-star']]);
  });
});

describe('countsAsRelease', () => {
  it('her albums, EPs, singles and the collabs she leads reset "days since" (owner, 2026-11-26)', () => {
    const solo = 'Tiffany Day';
    expect(['album', 'ep', 'single', 'collab', 'remix', 'guest'].filter((type) => countsAsRelease({ type: type as never, artistCredit: solo }))).toEqual(['album', 'ep', 'single', 'collab']);
    expect(countsAsRelease({ type: 'collab', artistCredit: 'Tiffany Day & glaive' })).toBe(true);
    expect(countsAsRelease({ type: 'collab', artistCredit: 'Lucian & Tiffany Day' })).toBe(false);
  });
});
