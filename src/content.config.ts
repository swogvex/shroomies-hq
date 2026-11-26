// Schemas for everything the owner edits under src/content/ (docs: 06-content-model). A wrong field fails the build with a clear message.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { eraIds } from './lib/discography.ts';
import { releaseTypes } from './lib/musicbrainz.ts';

const one = (file: string) => glob({ pattern: file, base: './src/content' });
const many = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });

// YAML turns 2026-04-03 into a Date and 2020 into a number: accept both, keep plain strings.
const asText = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === 'number' ? String(v) : v);
const date = z.preprocess(asText, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD'));
const partialDate = z.preprocess(asText, z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'use YYYY, YYYY-MM or YYYY-MM-DD'));
const url = z.url({ protocol: /^https$/ });
const mbid = z.uuid();
const draft = z.boolean().default(false);
const bilingual = z.object({ en: z.string().min(1), es: z.string().min(1) });
const era = z.enum(eraIds);
const releaseType = z.enum(releaseTypes);
/** A MusicBrainz recording id or "release-slug#track-number". */
const trackRef = z.string().regex(/^([0-9a-f-]{36}|[a-z0-9-]+#\d+)$/, 'use a recording id or release-slug#track-number');
const slug = z.string().regex(/^[a-z0-9-]+$/);
const timezone = z.string().refine((tz) => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}, 'not an IANA time zone, e.g. America/Chicago');
const credit = z.object({ role: z.string(), name: z.string() });
const platform = z.enum(['site', 'instagram', 'x', 'threads', 'substack', 'spotify', 'appleMusic', 'youtube', 'tiktok', 'soundcloud', 'discord']);

export const collections = {
  site: defineCollection({
    loader: one('site.md'),
    schema: z.object({
      ownerName: z.string(),
      contactEmail: z.email(),
      links: z.object({ portfolio: url, x: url, projectX: url.nullable(), projectInstagram: url.nullable() }),
      fanClubs: z.array(z.object({ name: z.string(), platform: z.enum(['x', 'instagram', 'tiktok', 'discord', 'other']), url })).default([]),
      // every platform must be listed; url null = not known yet. verified = the owner checked it is hers.
      official: z.record(platform, z.object({ url: url.nullable(), verified: z.boolean() })),
    }),
  }),

  eras: defineCollection({
    loader: many('eras'),
    schema: z.object({
      title: z.string(),
      years: z.preprocess(asText, z.string()),
      startsOn: date, // releases from this date on belong to the era unless corrections say otherwise
      order: z.number().int(),
      skin: era,
      room: z.enum(['wichita', 'dorm', 'la', 'backstage']).optional(),
      draft,
    }),
  }),

  releases: defineCollection({
    loader: many('releases'), // file name = the release slug in discography.json
    schema: z.object({
      mbid,
      cover: z.string().nullable().default(null),
      coverCredit: z.string().nullable().default(null),
      listen: z.object({ spotify: url, apple: url, youtube: url, bandcamp: url }).partial().default({}),
      lyricsSource: z.record(z.string(), url).optional(), // track number → page with the lyrics (we never show lyrics)
      draft,
    }),
  }),

  'discography-corrections': defineCollection({
    loader: one('discography-corrections.md'),
    schema: z.object({
      overrides: z.record(mbid, z.object({ title: z.string(), date: partialDate, type: releaseType, era, hidden: z.boolean(), slug }).partial()).default({}),
      additions: z
        .array(
          z.object({
            mbid: z.string(), // any unique id when MusicBrainz has none
            slug,
            title: z.string(),
            type: releaseType,
            date: partialDate,
            era: era.optional(),
            label: z.string().nullable().optional(),
            artistCredit: z.string().optional(),
            tracks: z.array(z.object({ mbid: z.string(), n: z.number().int(), title: z.string(), durationMs: z.number().int().nullable(), credits: z.array(credit).default([]) })).optional(),
            credits: z.array(credit).optional(),
          }),
        )
        .default([]),
    }),
  }),

  upcoming: defineCollection({
    loader: one('upcoming.md'),
    schema: z.object({ releases: z.array(z.object({ title: z.string(), date, type: releaseType, source: url })).default([]) }),
  }),

  tours: defineCollection({
    loader: one('tours.md'),
    schema: z.object({
      shows: z
        .array(
          z.object({
            date, city: z.string(), country: z.string().length(2), venue: z.string(), tour: z.string(),
            timeLocal: z.string().regex(/^\d{2}:\d{2}$/, 'use HH:mm'), timezone, source: url,
          }),
        )
        .default([]),
    }),
  }),

  mixtapes: defineCollection({
    loader: many('mixtapes'),
    schema: z.object({ title: z.string(), subtitle: z.string(), tracks: z.array(trackRef).min(1), order: z.number().int(), draft }), // subtitle: a few words on the tape label
  }),

  journal: defineCollection({
    loader: many('journal'), // journal/<lang>/<slug>.md
    schema: z
      .object({
        title: z.string(),
        date,
        type: z.enum(['release', 'tour', 'press', 'site']),
        source: url.optional(),
        sourceLabel: z.string().optional(),
        cover: z.string().optional(),
        draft,
        translationOf: z.string().optional(),
        reviewed: z.boolean().optional(),
      })
      .refine((e) => e.type === 'site' || e.source, { message: 'source is required unless type is site', path: ['source'] }),
  }),

  gallery: defineCollection({
    loader: many('gallery'),
    schema: z.object({
      title: z.string(),
      order: z.number().int(),
      intro: z.string(),
      photos: z
        .array(
          z.object({
            file: z.string(),
            alt: bilingual,
            context: z.string().optional(),
            date: partialDate.optional(),
            place: z.string().optional(),
            photographer: z.string().nullable(), // null = unknown
            permission: z.enum(['sessions', 'live', 'artwork', 'video-social']),
          }),
        )
        .default([]),
    }),
  }),

  stickers: defineCollection({
    loader: many('stickers'),
    schema: z.object({
      name: z.string(),
      subtitle: z.string(),
      rarity: z.enum(['common', 'rare', 'secret']),
      series: z.string().regex(/^\d{2}$/),
      svg: z.string(),
      unlock: z.string(),
      hint: bilingual,
      draft,
    }),
  }),

  'room-hints': defineCollection({
    loader: one('room-hints.md'),
    schema: z.object({
      rooms: z.partialRecord(z.enum(['wichita', 'dorm', 'la', 'backstage']), z.record(z.string(), z.object({ title: bilingual, line: bilingual }))).default({}),
    }),
  }),

  pages: defineCollection({
    loader: many('pages'), // pages/<lang>/<slug>.md
    schema: z.object({ title: z.string(), description: z.string(), updated: date, draft }),
  }),

  'song-of-day': defineCollection({
    loader: one('song-of-day.md'),
    schema: z.object({ pins: z.record(date, trackRef).default({}), exclude: z.array(trackRef).default([]) }),
  }),
};
