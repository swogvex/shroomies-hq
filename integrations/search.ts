// Build step for search and the Spanish 404 (15-spec-navigation).
// 1. Turns dist/search-records.json (src/pages/search-records.json.ts) into a static Pagefind index per language in
//    dist/pagefind/, then deletes the records file. Runs before the Vercel adapter copies dist to its output.
// 2. Vercel serves one 404 page by default: this adds a route so /es/... misses get /es/404/.
import type { AstroIntegration } from 'astro';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as pagefind from 'pagefind';
import type { SearchRecord } from '../src/pages/search-records.json.ts';

const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]!);

/** One record as a tiny HTML page, so Pagefind can weigh the title above the rest. */
export function recordHtml(r: SearchRecord): string {
  const meta = { title: r.title, kind: r.kind, sub: r.sub, image: r.image, n: r.n };
  return `<html lang="${esc(r.lang)}"><head>${Object.entries(meta)
    .filter(([, v]) => v)
    .map(([k, v]) => `<meta data-pagefind-meta="${k}[content]" content="${esc(v!)}">`)
    .join('')}</head><body><h1 data-pagefind-weight="10">${esc(r.title)}</h1><p data-pagefind-weight="3">${esc(r.sub)}</p><p>${esc(r.text)}</p></body></html>`;
}

export default function search(): AstroIntegration {
  return {
    name: 'shq:search',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const file = fileURLToPath(new URL('search-records.json', dir));
        const records = JSON.parse(readFileSync(file, 'utf8')) as SearchRecord[];
        const { index, errors } = await pagefind.createIndex({});
        if (!index) throw new Error(`Pagefind: ${errors.join(', ')}`);
        for (const r of records) {
          const res = await index.addHTMLFile({ url: r.url, content: recordHtml(r) });
          if (res.errors.length) throw new Error(`Pagefind (${r.url}): ${res.errors.join(', ')}`);
        }
        const out = await index.writeFiles({ outputPath: fileURLToPath(new URL('pagefind/', dir)) });
        if (out.errors.length) throw new Error(`Pagefind: ${out.errors.join(', ')}`);
        await pagefind.close();
        // our own dialog talks to pagefind.js: Pagefind's ready-made UIs are never loaded
        for (const ui of ['pagefind-ui.js', 'pagefind-ui.css', 'pagefind-modular-ui.js', 'pagefind-modular-ui.css', 'pagefind-component-ui.js', 'pagefind-component-ui.css', 'pagefind-highlight.js', 'wasm.unknown.pagefind']) {
          rmSync(new URL(`pagefind/${ui}`, dir), { force: true });
        }
        rmSync(file);
        logger.info(`search index: ${records.length} records`);
      },
    },
  };
}

/** Runs after the adapter wrote .vercel/output/config.json: Spanish misses get the Spanish 404 page. */
export function spanish404(): AstroIntegration {
  return {
    name: 'shq:spanish-404',
    hooks: {
      'astro:build:done': ({ logger }) => {
        const config = '.vercel/output/config.json';
        if (!existsSync(config)) return;
        const json = JSON.parse(readFileSync(config, 'utf8')) as { routes: Record<string, unknown>[] };
        const last = json.routes.findIndex((r) => r.dest === '/404.html');
        if (last < 0 || json.routes.some((r) => r.dest === '/es/404/index.html')) return;
        json.routes.splice(last, 0, { src: '^/es/.*$', dest: '/es/404/index.html', status: 404 });
        writeFileSync(config, JSON.stringify(json, null, '\t'));
        logger.info('Spanish 404 route added');
      },
    },
  };
}
