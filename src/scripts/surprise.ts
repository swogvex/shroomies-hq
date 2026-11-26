// Surprise me (08-spec-music): a song this visitor hasn't been sent to yet; when all have been, start over.
// The button carries the pool ("slug#n" list) and the localized /music/ base.
import { readJSON, writeJSON } from '../lib/storage';

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-surprise]')) {
  button.addEventListener('click', () => {
    const pool: string[] = JSON.parse(button.dataset.pool!);
    const opened = new Set(readJSON<string[]>('opened-songs', []));
    const fresh = pool.filter((s) => !opened.has(s));
    const choices = fresh.length ? fresh : pool;
    const pick = choices[Math.floor(Math.random() * choices.length)]!;
    writeJSON('opened-songs', fresh.length ? [...opened, pick] : [pick]);
    const [slug, n] = pick.split('#');
    location.assign(`${button.dataset.base}${slug}/#t${n}`);
  });
  button.hidden = false;
}
