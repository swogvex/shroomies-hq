// Pure helpers for the journal (12-spec-journal): reading time, the RSS summary and the RSS document itself.

export const journalTypes = ['release', 'tour', 'press', 'site'] as const;
export type JournalType = (typeof journalTypes)[number];

/** Minutes to read a Markdown body at 200 words a minute, at least 1. */
export const readingTime = (body: string) => Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 200));

/** The first paragraph of a Markdown body as plain text (the RSS summary). */
export const summary = (body: string) => plain(body.trim().split(/\n\s*\n/)[0] ?? '');

/** Markdown as plain text on one line (also the search index text). */
export function plain(md: string): string {
  return md
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links and images keep their text
    .replace(/[*_`~#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const xml = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

export type FeedItem = { title: string; link: string; date: string; summary: string; category: string };

/** RSS 2.0 for one language. Links must be absolute; dates are YYYY-MM-DD (published at 00:00 UTC). */
export function rss(channel: { title: string; link: string; self: string; description: string; language: string }, items: readonly FeedItem[]): string {
  const day = (d: string) => new Date(`${d}T00:00:00Z`).toUTCString();
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${xml(channel.title)}</title>`,
    `<link>${xml(channel.link)}</link>`,
    `<atom:link href="${xml(channel.self)}" rel="self" type="application/rss+xml"/>`,
    `<description>${xml(channel.description)}</description>`,
    `<language>${xml(channel.language)}</language>`,
    ...(items[0] ? [`<lastBuildDate>${day(items[0].date)}</lastBuildDate>`] : []),
    ...items.map((i) =>
      [
        '<item>',
        `<title>${xml(i.title)}</title>`,
        `<link>${xml(i.link)}</link>`,
        `<guid isPermaLink="true">${xml(i.link)}</guid>`,
        `<pubDate>${day(i.date)}</pubDate>`,
        `<category>${xml(i.category)}</category>`,
        `<description>${xml(i.summary)}</description>`,
        '</item>',
      ].join(''),
    ),
    '</channel>',
    '</rss>',
    '',
  ].join('\n');
}
