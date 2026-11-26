// What the search dialog can find (15-spec-navigation): songs, releases and journal entries, per language.
// Built as a file, turned into the Pagefind index by integrations/search.ts and then deleted from the output.
import { getImage } from 'astro:assets';
import { getCollection } from 'astro:content';
import { localePath, locales, t } from '../i18n';
import { formatDate } from '../lib/dates';
import { ownTracks } from '../lib/discography';
import { plain } from '../lib/journal';
import { discography, journal } from '../lib/music';

export type SearchRecord = { lang: string; kind: 'song' | 'release' | 'journal'; url: string; title: string; sub: string; text: string; image?: string; n?: string };

export async function GET() {
  const releases = await discography();
  const eras = Object.fromEntries((await getCollection('eras')).map((e) => [e.id, e.data.title]));
  const thumbs = new Map<string, string>();
  for (const r of releases) {
    if (r.image) thumbs.set(r.slug, (await getImage({ src: r.image, width: 96, height: 96, fit: 'cover', format: 'webp', quality: 60 })).src);
  }
  const bySlug = new Map(releases.map((r) => [r.slug, r]));
  const songs = ownTracks(releases, true);

  const records: SearchRecord[] = [];
  for (const lang of locales) {
    const url = (path: string) => localePath(path, lang);
    for (const s of songs) {
      const r = bySlug.get(s.release)!;
      records.push({
        lang, kind: 'song', url: url(`/music/${r.slug}/#t${s.n}`), title: s.title, sub: `${r.title} · ${r.date.slice(0, 4)}`,
        text: `${r.title} ${r.artistCredit} ${eras[r.era]} ${r.date.slice(0, 4)}`, image: thumbs.get(r.slug), n: String(s.n).padStart(2, '0'),
      });
    }
    for (const r of releases) {
      records.push({
        lang, kind: 'release', url: url(`/music/${r.slug}/`), title: r.title, sub: `${t(lang, `type.${r.type}`)} · ${r.date.slice(0, 4)}`,
        text: `${r.artistCredit} ${t(lang, `type.${r.type}`)} ${eras[r.era]} ${r.date.slice(0, 4)} ${r.tracks.map((tr) => tr.title).join(' ')}`, image: thumbs.get(r.slug),
      });
    }
    for (const e of await journal(lang)) {
      records.push({
        lang, kind: 'journal', url: url(`/journal/${e.slug}/`), title: e.data.title, sub: `${t(lang, `journal.${e.data.type}`)} · ${formatDate(e.data.date, lang)}`,
        text: plain(e.body ?? ''),
      });
    }
  }
  return new Response(JSON.stringify(records));
}
