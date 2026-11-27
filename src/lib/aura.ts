// The aura reading (25-spec-aura-reading): the deck (built at build time from the discography) and the scoring
// (runs in the browser). Pure functions, no DOM, so the unit tests can run every answer combination.
import { countsAsRelease, ownTracks, songKey, type Release } from './discography.ts';

export const auraEras = ['first-singles', 'projects', 'ltf', 'halo'] as const;
export type AuraEra = (typeof auraEras)[number];

export type AuraOption = { era: AuraEra; feelings: readonly string[] };
export type AuraQuestion = { options: readonly AuraOption[] };
export type AuraSongRule = { feelings: readonly string[]; explicit?: boolean; hidden?: boolean };

/** One song that can come out. `era` is its release's era; for a standalone single, the era it neighbours. */
export type DeckSong = {
  title: string;
  release: string;
  releaseTitle: string;
  year: string;
  era: AuraEra;
  standalone: boolean;
  explicit: boolean;
  feelings: readonly string[];
};

/** Titles in aura.md are matched like the rest of the site (songKey), with curly and straight apostrophes treated alike. */
export const auraKey = (title: string) => songKey(title).replace(/[‘’]/g, "'");

/**
 * Her own songs (albums, EPs, singles and the collabs she leads), once each, shown from the EP or album when they are on one.
 * A song whose best release is a single or a collab is standalone. The covers era never comes out.
 * Returns the deck plus the songs with no feelings in aura.md and the aura.md titles that match no song (build warnings).
 */
export function buildDeck(releases: readonly Release[], rules: Readonly<Record<string, AuraSongRule>>) {
  const own = new Map(releases.filter(countsAsRelease).map((r) => [r.slug, r]));
  const byKey = new Map(Object.entries(rules).map(([title, rule]) => [auraKey(title), rule]));
  const deck: DeckSong[] = [];
  const missing: string[] = [];
  const used = new Set<string>();
  for (const t of ownTracks(releases)) {
    const r = own.get(t.release);
    if (!r) continue; // a collab led by someone else (remix and guest tracks are already left out)
    const key = auraKey(t.title);
    const rule = byKey.get(key);
    used.add(key);
    if (!rule) {
      missing.push(t.title);
      continue;
    }
    if (rule.hidden) continue;
    const standalone = r.type !== 'album' && r.type !== 'ep';
    deck.push({
      title: t.title,
      release: r.slug,
      releaseTitle: r.title,
      year: r.date.slice(0, 4),
      era: r.era === 'covers' ? 'first-singles' : r.era, // a standalone single before 2018 neighbours the first singles
      standalone,
      explicit: !!rule.explicit,
      feelings: rule.feelings,
    });
  }
  const unknown = Object.keys(rules).filter((title) => !used.has(auraKey(title)));
  return { deck, missing, unknown };
}

/** Scoring constants. Change them only together with the coverage test (standalone 0.85, not 0.7: the real deck has 11 standalone singles, not 17). */
export const scoring = { eraPoints: 2, weights: [1, 0.5], eraSongBonus: 1, standaloneBonus: 0.85, shortlistWithin: 0.7 } as const;

export type Reading = {
  era: AuraEra;
  song: DeckSong;
  /** The two strongest feelings, strongest first (ties in the order of the feelings list). */
  why: [string, string];
  /** Era percentages in auraEras order; they add up to 100 and the winner is never below another era. */
  mix: Record<AuraEra, number>;
};

/** Same answers (option index 0–3 per question) always give the same reading. */
export function read(answers: readonly number[], questions: readonly AuraQuestion[], deck: readonly DeckSong[], feelingOrder: readonly string[]): Reading {
  const eraPts = Object.fromEntries(auraEras.map((e) => [e, 0])) as Record<AuraEra, number>;
  const feelPts: Record<string, number> = {};
  let total = 0;
  const picked = answers.map((a, i) => questions[i]!.options[a]!);
  for (const o of picked) {
    eraPts[o.era] += scoring.eraPoints;
    for (const f of o.feelings) {
      feelPts[f] = (feelPts[f] ?? 0) + 1;
      total++;
    }
  }

  const max = Math.max(...Object.values(eraPts));
  const tied = auraEras.filter((e) => eraPts[e] === max);
  const era = picked.findLast((o) => tied.includes(o.era))!.era;

  const fit = (s: DeckSong) => {
    const w = scoring.weights.slice(0, s.feelings.length);
    const sum = s.feelings.reduce((acc, f, i) => acc + (feelPts[f] ?? 0) * w[i]!, 0);
    return (sum / w.reduce((a, b) => a + b, 0) / Math.max(total, 1)) * 10 + (s.standalone ? scoring.standaloneBonus : scoring.eraSongBonus);
  };
  const scored = deck.filter((s) => s.era === era).map((s) => ({ s, fit: fit(s) }));
  const best = Math.max(...scored.map((x) => x.fit));
  // plain < compare, not localeCompare: the order must be the same in every browser
  const shortlist = scored.filter((x) => x.fit >= best - scoring.shortlistWithin).map((x) => x.s).sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
  let h = 7;
  for (const a of answers) h = (h * 31 + a + 1) % 9973;
  const song = shortlist[h % shortlist.length]!;

  const top = [...feelingOrder].sort((a, b) => (feelPts[b] ?? 0) - (feelPts[a] ?? 0) || feelingOrder.indexOf(a) - feelingOrder.indexOf(b));
  const sumEra = Object.values(eraPts).reduce((a, b) => a + b, 0) || 1;
  const mix = Object.fromEntries(auraEras.map((e) => [e, Math.floor((eraPts[e] / sumEra) * 100)])) as Record<AuraEra, number>;
  mix[era] += 100 - Object.values(mix).reduce((a, b) => a + b, 0);

  return { era, song, why: [top[0]!, top[1]!], mix };
}
