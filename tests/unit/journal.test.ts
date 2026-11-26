import { describe, expect, it } from 'vitest';
import { readingTime, rss, summary } from '../../src/lib/journal';

describe('journal helpers', () => {
  it('reading time: 200 words a minute, at least 1', () => {
    expect(readingTime('')).toBe(1);
    expect(readingTime('word '.repeat(200))).toBe(1);
    expect(readingTime('word '.repeat(201))).toBe(2);
  });

  it('summary: the first paragraph without Markdown', () => {
    expect(summary('\n*HALO* is out, see [the link](https://x.y) and `code`.\n\nSecond paragraph.')).toBe('HALO is out, see the link and code.');
    expect(summary('One line\nwrapped')).toBe('One line wrapped');
  });
});

describe('rss', () => {
  const channel = { title: 'Shroomies HQ · Journal', link: 'https://shroomieshq.fan/journal/', self: 'https://shroomieshq.fan/rss.xml', description: 'Fan journal', language: 'en' };

  it('escapes every text and has the required elements', () => {
    const out = rss(channel, [{ title: 'A <b> & "quote"', link: 'https://shroomieshq.fan/journal/a/', date: '2026-11-12', summary: "it's </description><x>", category: 'Tour' }]);
    expect(out).toContain('<title>A &lt;b&gt; &amp; &quot;quote&quot;</title>');
    expect(out).toContain('<description>it&apos;s &lt;/description&gt;&lt;x&gt;</description>');
    expect(out).toContain('<pubDate>Thu, 12 Nov 2026 00:00:00 GMT</pubDate>');
    expect(out).toContain('<language>en</language>');
    expect(out).toContain('<guid isPermaLink="true">https://shroomieshq.fan/journal/a/</guid>');
    expect(out).not.toMatch(/<x>/);
  });

  it('an empty feed is still a valid channel', () => {
    const out = rss(channel, []);
    expect(out).toContain('<channel>');
    expect(out).not.toContain('<item>');
    expect(out).not.toContain('lastBuildDate');
  });
});
