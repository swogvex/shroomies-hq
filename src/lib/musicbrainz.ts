// Turns MusicBrainz Web Service v2 JSON into the committed discography snapshot (src/data/discography.json).
// Pure functions only: the network part lives in scripts/sync-discography.ts.

export type ReleaseType = 'album' | 'ep' | 'single' | 'collab' | 'remix';
export type Credit = { role: string; name: string };
export type Track = { mbid: string; n: number; title: string; durationMs: number | null; credits: Credit[] };
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
};

type MbArtistCredit = { name: string; joinphrase?: string }[];
type MbRelation = { 'target-type'?: string; type: string; attributes?: string[]; artist?: { name: string } };
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
  media?: { tracks?: { position: number; title: string; length?: number | null; recording: { id: string; length?: number | null; relations?: MbRelation[] } }[] }[];
};

/** Our type for a release group, or null when it is not one of her own releases (live, DJ mix, compilation…). */
export function releaseType(rg: MbReleaseGroup, artistCount: number): ReleaseType | null {
  const secondary = rg['secondary-types'] ?? [];
  if (secondary.includes('Remix')) return 'remix';
  if (secondary.length) return null;
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

const creditString = (ac: MbArtistCredit = []) => ac.map((a) => a.name + (a.joinphrase ?? '')).join('');

/** One release lookup (inc=recordings+artist-credits+labels+release-groups+artist-rels+recording-level-rels) → snapshot entry, or null. */
export function normalizeRelease(r: MbRelease): Omit<RawRelease, 'slug'> | null {
  const type = releaseType(r['release-group'], r['artist-credit']?.length ?? 1);
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
      (m.tracks ?? []).map((t) => ({
        mbid: t.recording.id,
        n: ++n, // numbered across discs
        title: t.title,
        durationMs: t.length ?? t.recording.length ?? null,
        credits: credits(t.recording.relations),
      })),
    ),
    credits: credits(r.relations),
  };
}

/** Adds slugs: keeps the slug a release already had (links stay stable), otherwise a free one from the title. */
export function assignSlugs(releases: Omit<RawRelease, 'slug'>[], previous: Pick<RawRelease, 'mbid' | 'slug'>[]): RawRelease[] {
  const old = new Map(previous.map((p) => [p.mbid, p.slug]));
  const taken = new Set(releases.map((r) => old.get(r.mbid)).filter(Boolean));
  return releases.map((r) => {
    let slug = old.get(r.mbid);
    if (!slug) {
      const base = slugify(r.title) || r.mbid.slice(0, 8);
      slug = [base, `${base}-${r.type}`, `${base}-${r.type}-${r.date.slice(0, 4)}`, `${base}-${r.mbid.slice(0, 8)}`].find((s) => !taken.has(s))!;
      taken.add(slug);
    }
    return { ...r, slug };
  });
}

export const byDate = (a: { date: string; title: string }, b: { date: string; title: string }) =>
  a.date.localeCompare(b.date) || a.title.localeCompare(b.title);
