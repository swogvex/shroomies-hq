// Checks every text/background token pair in src/styles/tokens.css for WCAG AA (4.5:1). Exit 1 on failure.
import { readFileSync } from 'node:fs';
import { contrast, readTokens } from '../src/lib/contrast.ts';

const AA = 4.5;
const blocks = readTokens(readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8'));
const block = (selector: string) => {
  const b = blocks.get(selector);
  if (!b) throw new Error(`Missing token block ${selector}`);
  return b;
};

const themes = {
  original: block(':root, [data-theme="original"]'),
  light: block('[data-theme="light"]'),
  dark: block('[data-theme="dark"]'),
};
const palette = block(':root');
const eras = ['halo', 'projects', 'ltf', 'first-singles', 'covers'];

// [foreground, background] token names inside one theme
const themePairs = [
  ['--ink', '--bg'], ['--ink', '--surface'], ['--muted', '--bg'], ['--muted', '--surface'],
  ['--link', '--bg'], ['--link', '--surface'], ['--on-accent', '--accent'], ['--on-hot', '--hot'],
  ['--inverse-ink', '--inverse'], ['--inverse-muted', '--inverse'], ['--band-ink', '--band'], ['--cork-ink', '--cork'],
] as const;

const rows: { what: string; ratio: number }[] = [];
const check = (what: string, fg: string | undefined, bg: string | undefined) => {
  if (!fg || !bg) throw new Error(`Missing token for ${what}`);
  rows.push({ what, ratio: contrast(fg, bg) });
};

for (const [name, t] of Object.entries(themes)) {
  for (const [fg, bg] of themePairs) check(`${name}: ${fg} on ${bg}`, t[fg], t[bg]);
}
for (const name of ['original', 'light'] as const) {
  check(`${name}: --c-aura-text on --bg`, palette['--c-aura-text'], themes[name]['--bg']);
  check(`${name}: --c-aura-text on --surface`, palette['--c-aura-text'], themes[name]['--surface']);
}
check('all: --c-lcd-ink on --c-lcd-1', palette['--c-lcd-ink'], palette['--c-lcd-1']);
check('all: --c-lcd-ink on --c-lcd-2', palette['--c-lcd-ink'], palette['--c-lcd-2']);

for (const era of eras) {
  const e = block(era === 'halo' ? ':root, [data-era="halo"]' : `[data-era="${era}"]`);
  const dark = block(era === 'halo' ? '[data-theme="dark"]:is(:not([data-era]), [data-era="halo"])' : `[data-theme="dark"][data-era="${era}"]`);
  check(`era ${era}: --on-era-accent on --era-accent`, e['--on-era-accent'], e['--era-accent']);
  for (const name of ['original', 'light'] as const) {
    check(`era ${era} / ${name}: --era-accent-text on --bg`, e['--era-accent-text'], themes[name]['--bg']);
    check(`era ${era} / ${name}: --era-accent-text on --surface`, e['--era-accent-text'], themes[name]['--surface']);
  }
  check(`era ${era} / dark: --era-accent-text on --bg`, dark['--era-accent-text'], themes.dark['--bg']);
  check(`era ${era} / dark: --era-accent-text on --surface`, dark['--era-accent-text'], themes.dark['--surface']);
}

let failed = 0;
for (const { what, ratio } of rows) {
  const ok = ratio >= AA;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${ratio.toFixed(2).padStart(5)}:1  ${what}`);
}
console.log(`\n${rows.length - failed}/${rows.length} pairs pass AA (${AA}:1).`);
if (failed) process.exit(1);
