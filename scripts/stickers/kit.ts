// Drawing kit for the song stickers of the aura reading (one per song, public/stickers/songs/<slug>.svg).
// Same finish as the series-01 stickers: ink outline, flat colour, a darker shade and a white highlight per part;
// the die-cut white border, its grey rim, the drop shadow and the laminate glare come from frame().

export const INK = '#121216';
export const c = {
  paper: '#fbfaf6', white: '#ffffff', cream: '#f2e6d8', red: '#e5302a', orange: '#ff4a1c', amber: '#ffb347',
  gold: '#ffc94a', lemon: '#fff36b', pink: '#ff8fc7', rose: '#ffc2dc', lilac: '#9aa6ff', blue: '#2335f0',
  navy: '#1b2470', sky: '#8fd3ff', aqua: '#5fd4c8', green: '#3f9a3a', mint: '#9be3b0', brown: '#a0612e',
  tan: '#e0b07a', grey: '#c9cbd6', steel: '#8f91a3', dark: '#3a3c48', purple: '#7b4fd6', lcd: '#c7f26a',
} as const;

const outline: [string, string][] = [['stroke', INK], ['stroke-width', '3.5'], ['stroke-linejoin', 'round'], ['stroke-linecap', 'round']];
/** The ink outline, minus whatever the caller overrides in `extra` (an attribute may appear only once in XML). */
const S = (extra: string) => outline.filter(([k]) => !new RegExp(`(^|\\s)${k}=`).test(extra)).map(([k, v]) => `${k}="${v}"`).join(' ');

/** A filled part with the ink outline. */
export const p = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}" ${S(extra)}${extra}/>`;
export const circ = (cx: number, cy: number, r: number, fill: string, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${S(extra)}${extra}/>`;
export const ell = (cx: number, cy: number, rx: number, ry: number, fill: string, extra = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${S(extra)}${extra}/>`;
export const rect = (x: number, y: number, w: number, h: number, rx: number, fill: string, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${S(extra)}${extra}/>`;
/** An ink line (no fill). */
export const line = (d: string, w = 3.5, colour: string = INK, extra = '') =>
  `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
/** Shade or colour patch without outline. */
export const fill = (d: string, colour: string, opacity = 1) => `<path d="${d}" fill="${colour}"${opacity < 1 ? ` opacity="${opacity}"` : ''}/>`;
/** White highlight. */
export const hi = (d: string, opacity = 0.75) => `<path d="${d}" fill="#fff" opacity="${opacity}"/>`;
export const dot = (cx: number, cy: number, r: number, colour: string = INK, opacity = 1) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colour}"${opacity < 1 ? ` opacity="${opacity}"` : ''}/>`;
/** A four-point sparkle. */
export const spark = (cx: number, cy: number, r: number, colour: string = c.white, outline = true) => {
  const k = r * 0.22;
  const d = `M${cx} ${cy - r} Q${cx + k} ${cy - k} ${cx + r} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + r} Q${cx - k} ${cy + k} ${cx - r} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
  return outline ? `<path d="${d}" fill="${colour}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>` : `<path d="${d}" fill="${colour}"/>`;
};
export const g = (transform: string, inner: string) => `<g transform="${transform}">${inner}</g>`;
/** A heart centred on (cx, cy) with half-width r. */
export const heartD = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy + r * 0.95} C${cx - r * 1.6} ${cy - r * 0.05} ${cx - r * 0.95} ${cy - r * 1.25} ${cx} ${cy - r * 0.45} C${cx + r * 0.95} ${cy - r * 1.25} ${cx + r * 1.6} ${cy - r * 0.05} ${cx} ${cy + r * 0.95}Z`;

/** The sticker around an illustration drawn in a 200 × 200 box (same 248 px canvas as the series-01 stickers). */
export function frame(title: string, art: string, defs = '') {
  const label = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="248" height="248" viewBox="-24 -24 248 248" role="img" aria-label="${label} sticker"><defs>${defs}<g id="art">${art}</g><filter id="cut" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b"/><feComponentTransfer in="b" result="m"><feFuncA type="linear" slope="16" intercept="-0.45"/></feComponentTransfer><feGaussianBlur in="m" stdDeviation="4.5" result="sb"/><feOffset in="sb" dy="5" result="so"/><feFlood flood-color="${INK}" flood-opacity=".3"/><feComposite in2="so" operator="in" result="shadow"/><feFlood flood-color="#d9d9e2"/><feComposite in2="m" operator="in" result="rim"/><feMorphology in="m" operator="erode" radius="1.3" result="mi"/><feFlood flood-color="#fff"/><feComposite in2="mi" operator="in" result="paper"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="rim"/><feMergeNode in="paper"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="sil" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/><feComponentTransfer><feFuncA type="linear" slope="16" intercept="-0.45"/></feComponentTransfer><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter><mask id="lam"><use href="#art" filter="url(#sil)"/></mask><linearGradient id="glare" x1="0" y1="0" x2="1" y2="1"><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".4"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#fff" stop-opacity=".16"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><use href="#art" filter="url(#cut)"/><rect x="-24" y="-24" width="248" height="248" fill="url(#glare)" mask="url(#lam)"/></svg>
`;
}

/** The locked look of a sticker in the album: its die-cut shape in grey, with a "?" (no art shown). */
export function lockedFrame(title: string, art: string, defs = '') {
  const label = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="248" height="248" viewBox="-24 -24 248 248" role="img" aria-label="${label} sticker, not found yet"><defs>${defs}<g id="art">${art}</g><filter id="sil" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/><feComponentTransfer result="m"><feFuncA type="linear" slope="16" intercept="-0.45"/></feComponentTransfer><feFlood flood-color="#c9cad3"/><feComposite in2="m" operator="in" result="rim"/><feMorphology in="m" operator="erode" radius="3" result="mi"/><feFlood flood-color="#e3e4ea"/><feComposite in2="mi" operator="in" result="body"/><feMerge><feMergeNode in="rim"/><feMergeNode in="body"/></feMerge></filter></defs><use href="#art" filter="url(#sil)"/><text x="100" y="122" text-anchor="middle" font-family="Anybody, 'Arial Black', Arial, sans-serif" font-weight="900" font-size="58" fill="#9a9ba6">?</text></svg>
`;
}
