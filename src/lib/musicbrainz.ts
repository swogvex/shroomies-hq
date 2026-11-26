// Turns MusicBrainz Web Service v2 JSON into the committed discography snapshot (src/data/discography.json).
// Pure functions only: the network part lives in scripts/sync-discography.ts.

/** guest = she is featured on someone else's release (shown after a divider on the shelf). */
export type ReleaseType = 'album' | 'ep' | 'single' | 'collab' | 'remix' | 'guest';
export type Credit = { role: string; name: string };
export type Track = { mbid: string; n: number; title: string; durationMs: number | null; credits: Credit[] };
/** Official streaming pages, from the release's URL relations on MusicBrainz. */
export type Links = Partial<Record<'spotify' | 'apple' | 'youtube' | 'bandcamp', string>>;
export type RawRelease = {
  mbid: string; // release group: stable across reissues
  releaseMbid: string; // the edition the tracklist comes from
  slug: string;
  title: string;
  type: ReleaseType;
  date: string; // YYYY, YYYY-MM or YYYY-MM-DD, as MusicBrainz has it
  label: string | null;
  artistCredit: string;
  tracks: Track[];
  credits: Credit[];
  links?: Links;
  cover: string | null; // file in src/assets/covers/, shared by releases with the same artwork; null = typographic cover
};

type MbArtistCredit = { name: string; joinphrase?: string; artist?: { id: string } }[];
type MbRelation = { 'target-type'?: string; type: string; attributes?: string[]; artist?: { name: string }; url?: { resource: string } };
export type MbReleaseGroup = { id: string; title: string; 'primary-type'?: string | null; 'secondary-types'?: string[] };
export type MbRelease = {
  id: string;
  title: string;
  date?: string;
  status?: string | null;
  'release-group': MbReleaseGroup;
  'artist-credit'?: MbArtistCredit;
  'label-info'?: { label?: { name: string } | null }[];
  relations?: MbRelation[];
  media?: { tracks?: { position: number; title: string; length?: number | null; 'artist-credit'?: MbArtistCredit; recording: { id: string; length?: number | null; relations?: MbRelation[] } }[] }[];
};

/** True when the artist is missing from the credit or comes after "feat."/"ft."/"with". */
export function isGuest(credit: MbArtistCredit = [], artist: string): boolean {
  const i = credit.findIndex((a) => a.artist?.id === artist);
  return i === -1 || (i > 0 && /\b(feat|ft|with)\b/i.test(credit[i - 1].joinphrase ?? ''));
}

/** Our type for a release group, or null when it is not a release we list (live, DJ mix, compilation…). */
export function releaseType(rg: MbReleaseGroup, artistCount: number, guest = false): ReleaseType | null {
  const secondary = rg['secondary-types'] ?? [];
  if (secondary.some((t) => t !== 'Remix')) return null;
  if (guest) return 'guest';
  if (secondary.length) return 'remix';
  const base = ({ Album: 'album', EP: 'ep', Single: 'single' } as const)[rg['primary-type'] as 'Album' | 'EP' | 'Single'];
  if (!base) return null;
  return artistCount > 1 ? 'collab' : base;
}

/** The edition to read the tracklist from: official, earliest date first. */
export function pickRelease(releases: MbRelease[]): MbRelease | undefined {
  return releases
    .filter((r) => !r.status || r.status === 'Official')
    .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999') || a.id.localeCompare(b.id))[0];
}

export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ'’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function credits(relations: MbRelation[] = []): Credit[] {
  const seen = new Set<string>();
  return relations
    .filter((r) => r['target-type'] === 'artist' && r.artist)
    .map((r) => ({
      // instrument/vocal rels carry the useful part in attributes ("guitar", "lead vocals")
      role: (r.type === 'instrument' || r.type === 'vocal') && r.attributes?.length ? r.attributes.join(', ') : r.type,
      name: r.artist!.name,
    }))
    .filter((c) => !seen.has(c.role + '|' + c.name) && seen.add(c.role + '|' + c.name));
}

const hosts: [keyof Links, RegExp][] = [
  ['spotify', /^https:\/\/open\.spotify\.com\/(album|track)\/\w+$/],
  ['apple', /^https:\/\/music\.apple\.com\//],
  ['youtube', /^https:\/\/(music\.|www\.)?youtube\.com\//],
  ['bandcamp', /^https:\/\/[\w-]+\.bandcamp\.com\//],
];

/** First https link per platform among the URL relations (inc=url-rels). */
export function links(relations: MbRelation[] = []): Links {
  const out: Links = {};
  for (const url of relations.map((r) => r.url?.resource ?? '')) {
    const hit = hosts.find(([key, re]) => !out[key] && re.test(url));
    if (hit) out[hit[0]] = url;
  }
  return out;
}

const creditString = (ac: MbArtistCredit = []) => ac.map((a) => a.name + (a.joinphrase ?? '')).join('');

/**
 * One release lookup (inc=recordings+artist-credits+labels+release-groups+artist-rels+recording-level-rels+url-rels) → snapshot entry, or null.
 * On a guest release only her tracks are kept; track numbers stay those of the release.
 */
export function normalizeRelease(r: MbRelease, artist: string): Omit<RawRelease, 'slug' | 'cover'> | null {
  const guest = isGuest(r['artist-credit'], artist);
  const type = releaseType(r['release-group'], r['artist-credit']?.length ?? 1, guest);
  if (!type) return null;
  let n = 0;
  return {
    mbid: r['release-group'].id,
    releaseMbid: r.id,
    title: r['release-group'].title,
    type,
    date: r.date ?? '',
    label: r['label-info']?.find((l) => l.label && l.label.name !== '[no label]')?.label?.name ?? null, // "[no label]" = self-released
    artistCredit: creditString(r['artist-credit']),
    tracks: (r.media ?? []).flatMap((m) =>
      (m.tracks ?? []).flatMap((t) => {
        n++; // numbered across discs, counting every track
        const hers = !guest || !t['artist-credit'] || t['artist-credit'].some((a) => a.artist?.id === artist);
        return hers ? [{ mbid: t.recording.id, n, title: t.title, durationMs: t.length ?? t.recording.length ?? null, credits: credits(t.recording.relations) }] : [];
      }),
    ),
    credits: credits(r.relations),
    links: links(r.relations),
  };
}

/** Adds slugs: keeps the slug a release already had (links stay stable), otherwise a free one from the title. Keeps its cover too. */
export function assignSlugs(releases: Omit<RawRelease, 'slug' | 'cover'>[], previous: Pick<RawRelease, 'mbid' | 'slug' | 'cover'>[]): RawRelease[] {
  const old = new Map(previous.map((p) => [p.mbid, p.slug]));
  const cover = new Map(previous.map((p) => [p.mbid, p.cover ?? null]));
  const taken = new Set(releases.map((r) => old.get(r.mbid)).filter(Boolean));
  return releases.map((r) => {
    let slug = old.get(r.mbid);
    if (!slug) {
      const base = slugify(r.title) || r.mbid.slice(0, 8);
      slug = [base, `${base}-${r.type}`, `${base}-${r.type}-${r.date.slice(0, 4)}`, `${base}-${r.mbid.slice(0, 8)}`].find((s) => !taken.has(s))!;
      taken.add(slug);
    }
    return { ...r, slug, cover: cover.get(r.mbid) ?? null };
  });
}

export const byDate = (a: { date: string; title: string }, b: { date: string; title: string }) =>
  a.date.localeCompare(b.date) || a.title.localeCompare(b.title);
