import { describe, expect, it } from 'vitest';
import { recordHtml } from '../../integrations/search';

describe('search records', () => {
  it('escapes titles from MusicBrainz and keeps the title weighted above the rest', () => {
    const html = recordHtml({ lang: 'en', kind: 'song', url: '/music/x/#t1', title: 'Rock & "Roll" <b>', sub: 'X · 2020', text: 'a <script>', n: '01' });
    expect(html).toContain('<h1 data-pagefind-weight="10">Rock &amp; &quot;Roll&quot; &lt;b&gt;</h1>');
    expect(html).toContain('content="Rock &amp; &quot;Roll&quot; &lt;b&gt;"');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('image[content]'); // no empty meta
    expect(html).toContain('<meta data-pagefind-meta="n[content]" content="01">');
  });
});
