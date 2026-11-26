// The journal RSS feed for one language (/rss.xml, /es/rss.xml): latest 30 entries, first paragraph as the summary.
import type { APIContext } from 'astro';
import { localePath, t, type Locale } from '../i18n';
import { rss, summary } from '../lib/journal';
import { journal } from '../lib/music';

export async function feed(locale: Locale, { site }: APIContext): Promise<Response> {
  const abs = (path: string) => new URL(localePath(path, locale), site).href;
  const body = rss(
    { title: t(locale, 'journal.feed'), link: abs('/journal/'), self: abs('/rss.xml'), description: t(locale, 'journal.description'), language: locale },
    (await journal(locale)).slice(0, 30).map((e) => ({
      title: e.data.title,
      link: abs(`/journal/${e.slug}/`),
      date: e.data.date,
      summary: summary(e.body ?? ''),
      category: t(locale, `journal.${e.data.type}`),
    })),
  );
  return new Response(body); // prerendered: the content type comes from vercel.json
}
