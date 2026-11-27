// Draws one sticker per song of the aura reading into public/stickers/songs/<slug>.svg (run: node scripts/song-stickers.ts).
// The drawings live in scripts/stickers/<era>.ts; the frame (die-cut border, shadow, glare) in scripts/stickers/kit.ts.
// Every song in src/content/aura.md needs a drawing, and every drawing a song: otherwise this script stops and says which.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { slugify } from '../src/lib/musicbrainz.ts';
import { frame } from './stickers/kit.ts';
import * as firstSingles from './stickers/first-singles.ts';
import * as projects from './stickers/projects.ts';
import * as ltf from './stickers/ltf.ts';
import * as halo from './stickers/halo.ts';

const eras = [firstSingles, projects, ltf, halo];
const art: Record<string, string> = Object.assign({}, ...eras.map((e) => e.art));
const defs: Record<string, string> = Object.assign({}, ...eras.map((e) => e.defs ?? {}));

// song titles = the keys of the songs map in aura.md ("TITLE": { feelings … })
const aura = readFileSync(new URL('../src/content/aura.md', import.meta.url), 'utf8');
const titles = [...aura.slice(aura.indexOf('\nsongs:')).matchAll(/^\s+"(.+)":\s*\{/gm)].map((m) => m[1]!);
const bySlug = new Map(titles.map((t) => [slugify(t), t]));

const missing = [...bySlug.keys()].filter((s) => !art[s]);
const extra = Object.keys(art).filter((s) => !bySlug.has(s));
if (extra.length) throw new Error(`stickers with no song in aura.md: ${extra.join(', ')}`);
if (missing.length && !process.argv.includes('--partial')) throw new Error(`songs with no sticker yet: ${missing.join(', ')}`);

const out = new URL('../public/stickers/songs/', import.meta.url);
mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) if (!art[f.replace(/\.svg$/, '')]) rmSync(new URL(f, out));
for (const [slug, drawing] of Object.entries(art)) writeFileSync(new URL(`${slug}.svg`, out), frame(bySlug.get(slug)!, drawing, defs[slug]));
console.log(`[stickers] ${Object.keys(art).length} written${missing.length ? `, ${missing.length} still missing` : ''}`);
