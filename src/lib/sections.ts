import type { Key } from '../i18n';

/** The seven tracks of the site, in remote order. One list for the remote, its dock fallback and the tracklist. */
export const sections = [
  { n: '01', path: '/', label: 'nav.home', lcd: 'PORTAL' },
  { n: '02', path: '/music/', label: 'nav.music', lcd: 'THE SHELF' },
  { n: '03', path: '/tracker/', label: 'nav.tracker', lcd: 'THE WAVEFORM' },
  { n: '04', path: '/room/', label: 'nav.room', lcd: "TIFF'S ROOM" },
  { n: '05', path: '/gallery/', label: 'nav.gallery', lcd: 'SCRAPBOOK' },
  { n: '06', path: '/journal/', label: 'nav.journal', lcd: 'THE JOURNAL' },
  { n: '07', path: '/wall/', label: 'nav.wall', lcd: 'CORKBOARD' },
] as const satisfies readonly { n: string; path: string; label: Key; lcd: string }[];

/** Index of the section a locale-free path belongs to, or -1 (legal pages, /dev/kit/…). Home only matches exactly. */
export function sectionIndex(path: string): number {
  return sections.findIndex((s) => (s.path === '/' ? path === '/' : path.startsWith(s.path)));
}

/** Previous and next section, wrapping like a tracklist. Pages outside the tracklist count as Home. */
export function neighbours(index: number): { prev: number; next: number } {
  const i = Math.max(index, 0);
  return { prev: (i + sections.length - 1) % sections.length, next: (i + 1) % sections.length };
}

/** The fine print (18-privacy-legal), in footer and index order: src/content/pages/<lang>/<slug>.md, served at /<slug>/. */
export const finePrint = ['legal', 'privacy', 'wall-rules', 'credits', 'about'] as const;
export type FinePrint = (typeof finePrint)[number];
