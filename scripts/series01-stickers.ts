// Writes the series-01 stickers (scripts/stickers/series01.ts): the found and locked versions in docs/design/stickers/
// (the album's source, M7) and the found version in public/stickers/ for the ones the site already shows.
// Run: node scripts/series01-stickers.ts
import { existsSync, writeFileSync } from 'node:fs';
import { frame, lockedFrame } from './stickers/kit.ts';
import { stickers } from './stickers/series01.ts';

const docs = new URL('../docs/design/stickers/', import.meta.url);
const pub = new URL('../public/stickers/', import.meta.url);
for (const s of stickers) {
  if (existsSync(docs)) {
    writeFileSync(new URL(`${s.n}-${s.slug}-found.svg`, docs), frame(s.title, s.art, s.defs));
    writeFileSync(new URL(`${s.n}-${s.slug}-locked.svg`, docs), lockedFrame(s.title, s.art, s.defs));
  }
  const live = new URL(`${s.slug}.svg`, pub);
  if (existsSync(live)) writeFileSync(live, frame(s.title, s.art, s.defs));
}
console.log(`[stickers] series 01: ${stickers.length} redrawn`);
