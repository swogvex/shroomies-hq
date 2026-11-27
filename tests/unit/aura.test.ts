import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml'; // comes with Vite (and so with Vitest); the site reads the same files through Astro
import { auraEras, buildDeck, read, type AuraQuestion, type AuraSongRule } from '../../src/lib/aura';
import { applyCorrections, type EraId } from '../../src/lib/discography';
import type { RawRelease } from '../../src/lib/musicbrainz';
import raw from '../../src/data/discography.json' with { type: 'json' };

const front = (file: string) => parse(readFileSync(file, 'utf8').split(/^---$/m)[1]!);
const aura = front('src/content/aura.md') as {
  feelings: { id: string }[];
  questions: (AuraQuestion & { options: { label: { en: string } }[] })[];
  songs: Record<string, AuraSongRule>;
};
const eras = readdirSync('src/content/eras').map((f) => ({ id: f.replace('.md', '') as EraId, startsOn: String(front(`src/content/eras/${f}`).startsOn).slice(0, 10) }));
const corrections = front('src/content/discography-corrections.md');
const releases = applyCorrections(raw as RawRelease[], { overrides: corrections.overrides ?? {}, additions: corrections.additions ?? [] }, eras);
const { deck, missing, unknown } = buildDeck(releases, aura.songs);
const order = aura.feelings.map((f) => f.id);

describe('aura content', () => {
  it('every song of hers has feelings, and every title in aura.md is one of her songs', () => {
    expect(missing).toEqual([]);
    expect(unknown).toEqual([]);
  });
  it('uses only known feelings, 1 or 2 per song and per answer', () => {
    for (const s of deck) {
      expect(s.feelings.length, s.title).toBeGreaterThanOrEqual(1);
      expect(s.feelings.length, s.title).toBeLessThanOrEqual(2);
      for (const f of s.feelings) expect(order, s.title).toContain(f);
    }
    expect(aura.questions).toHaveLength(8);
    for (const q of aura.questions) {
      expect(q.options.map((o) => o.era)).toEqual([...auraEras]); // A–D always in era order
      for (const o of q.options) for (const f of o.feelings) expect(order).toContain(f);
    }
  });
  it('keeps her led collabs, never the covers era, and marks standalone singles', () => {
    const titles = deck.map((s) => s.title);
    expect(titles).toContain('CONSTANTLY');
    expect(titles).toContain('MEANT TO BE');
    expect(titles).not.toContain('Crush');
    const spoiled = deck.find((s) => s.title === 'SPOILED BITCH')!;
    expect(spoiled).toMatchObject({ standalone: false, era: 'projects', explicit: true });
    expect(deck.find((s) => s.title === 'KANSAS')).toMatchObject({ standalone: false, era: 'ltf' });
    expect(deck.find((s) => s.title === 'Bubble')).toMatchObject({ standalone: true, era: 'first-singles' });
    expect(deck.find((s) => s.title === 'CONSTANTLY')).toMatchObject({ standalone: true, era: 'halo' });
  });
});

describe('aura scoring', () => {
  it('is deterministic and picks the era of the most answers', () => {
    const all = (i: number) => Array(8).fill(i);
    for (const [i, era] of auraEras.entries()) {
      const r = read(all(i), aura.questions, deck, order);
      expect(r.era).toBe(era);
      expect(r.mix[era]).toBe(100);
      expect(read(all(i), aura.questions, deck, order)).toEqual(r);
    }
  });
  it('breaks a tie with the latest answer among the tied eras', () => {
    expect(read([0, 0, 0, 0, 1, 1, 1, 1], aura.questions, deck, order).era).toBe('projects');
    expect(read([1, 1, 1, 1, 0, 0, 0, 0], aura.questions, deck, order).era).toBe('first-singles');
  });
  it('mix adds up to 100 and never shows the winner below another era', () => {
    const r = read([0, 1, 2, 3, 0, 1, 2, 3], aura.questions, deck, order);
    expect(Object.values(r.mix).reduce((a, b) => a + b, 0)).toBe(100);
    expect(Math.max(...Object.values(r.mix))).toBe(r.mix[r.era]);
  });

  // 4^8 = 65,536 readings (spec 25): every song reachable, standalone 8–25 %, no song above 15 %.
  it('covers the whole deck over every answer combination', () => {
    const counts = new Map<string, number>();
    let standalone = 0;
    const n = 4 ** 8;
    for (let k = 0; k < n; k++) {
      const answers = Array.from({ length: 8 }, (_, i) => Math.floor(k / 4 ** i) % 4);
      const { song } = read(answers, aura.questions, deck, order);
      counts.set(song.title, (counts.get(song.title) ?? 0) + 1);
      if (song.standalone) standalone++;
    }
    const unreached = deck.filter((s) => !counts.has(s.title)).map((s) => s.title);
    expect(unreached).toEqual([]);
    expect(standalone / n).toBeGreaterThanOrEqual(0.08);
    expect(standalone / n).toBeLessThanOrEqual(0.25);
    const [top, most] = [...counts].sort((a, b) => b[1] - a[1])[0]!;
    expect(most / n, top).toBeLessThanOrEqual(0.15);
  });
});
