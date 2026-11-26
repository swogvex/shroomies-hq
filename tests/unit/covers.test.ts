import { describe, expect, it } from 'vitest';
import { coverNames, sameArtwork, thumbDistance } from '../../src/lib/covers';

describe('sameArtwork', () => {
  const a = new Uint8Array(768).fill(100);
  it('treats a re-upload as the same artwork and a different cover as different', () => {
    expect(thumbDistance(a, a)).toBe(0);
    expect(sameArtwork(a, a.map((v, i) => (i % 2 ? v + 2 : v)))).toBe(true); // ~1 apart
    expect(sameArtwork(a, a.map((v) => v + 20))).toBe(false);
  });
});

describe('coverNames', () => {
  it('names each shared file after the album, then the earliest release', () => {
    const renames = coverNames([
      { slug: 'start-over', type: 'single', date: '2026-02-20', cover: 'start-over.jpg' },
      { slug: 'same-la', type: 'single', date: '2026-03-25', cover: 'start-over.jpg' },
      { slug: 'halo', type: 'album', date: '2026-04-03', cover: 'start-over.jpg' },
      { slug: 'remix', type: 'guest', date: '2025-08-29', cover: 'aura-park-remixes.png' },
      { slug: 'aura-park-remixes', type: 'guest', date: '2025-09-05', cover: 'aura-park-remixes.png' },
      { slug: 'kansas', type: 'single', date: '2024-07-12', cover: 'kansas.jpg' },
      { slug: 'no-art', type: 'single', date: '2020-01-01', cover: null },
    ]);
    expect([...renames]).toEqual([['start-over.jpg', 'halo.jpg'], ['aura-park-remixes.png', 'remix.png']]);
  });
});
