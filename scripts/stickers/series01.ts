// Series 01 stickers (the sticker album, M7), redrawn with the same kit as the song stickers. The halo shroom (the
// mascot, sticker 01) keeps its own drawing in docs/design/stickers/01-halo-shroom-found.svg.
import { c, p, circ, ell, rect, line, fill, hi, dot, spark, g, heartD, INK } from './kit.ts';

const bold = (x: number, y: number, size: number, text: string, colour: string, extra = '') =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Anybody, 'Arial Black', Arial, sans-serif" font-weight="900" font-size="${size}" fill="${colour}"${extra}>${text}</text>`;

export const stickers: { n: string; slug: string; title: string; defs?: string; art: string }[] = [
  {
    n: '02', slug: 'echo-well', title: 'Echo well',
    defs: `<radialGradient id="water" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#4a5bff"/><stop offset="1" stop-color="#0e1450"/></radialGradient>`,
    art: [
      line('M44 104 V40 M156 104 V40', 8, INK), line('M44 104 V40 M156 104 V40', 4, c.brown),
      p('M28 44 L100 12 L172 44 L160 52 L100 26 L40 52Z', c.brown), fill('M100 26 L160 52 L172 44 L100 12Z', '#7a4a20', 0.5), line('M48 40 L100 18 L152 40', 1.6, '#c98f55'),
      line('M44 60 H156', 5), line('M44 60 H156', 2, c.tan), line('M100 60 V82', 2), rect(92, 82, 16, 14, 3, c.grey, ' stroke-width="2.6"'),
      p('M156 60 h14 v12', 'none', ' stroke-width="3"'),
      ell(100, 108, 62, 18, '#7d8090'), ell(100, 108, 50, 13, 'url(#water)', ' stroke-width="2.6"'),
      ell(100, 108, 30, 7, 'none', ' stroke="#9aa6ff" stroke-width="2"'), ell(100, 108, 16, 3.5, 'none', ' stroke="#c9cfff" stroke-width="1.8"'),
      p('M38 108 V160 Q100 186 162 160 V108 Q100 130 38 108Z', '#a3a6b3'),
      ...[118, 134, 150].map((y) => line(`M38 ${y} Q100 ${y + 22} 162 ${y}`, 2, '#6f7280')),
      ...[[56, 126], [92, 140], [130, 132], [74, 156], [112, 162], [148, 150], [50, 146]].map(([x, y]) => line(`M${x} ${y} v12`, 2, '#6f7280')),
      hi('M44 120 q2 20 10 34 q-12 -8 -10 -34z', 0.5),
      p('M18 150 L40 144 L40 168 L18 174 L26 160Z', '#b8141c'), p('M182 150 L160 144 L160 168 L182 174 L174 160Z', '#b8141c'),
      p('M34 142 Q100 158 166 142 L166 166 Q100 182 34 166Z', c.red),
      bold(100, 163, 9.5, 'ECHO · SPOLETO · 2017', '#fff', ' textLength="112" lengthAdjust="spacingAndGlyphs"'),
      spark(178, 92, 8, c.lemon), spark(22, 84, 6, '#fff'),
    ].join(''),
  },
  {
    n: '03', slug: 'mix-for-tiff', title: 'Mix for tiff',
    defs: `<linearGradient id="foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8f6ff"/><stop offset=".3" stop-color="#ffd6ea"/><stop offset=".55" stop-color="#fff6c2"/><stop offset=".8" stop-color="#c9f2e0"/><stop offset="1" stop-color="#d8ccff"/></linearGradient>`,
    art: [
      circ(100, 100, 82, 'url(#foil)'),
      circ(100, 100, 62, 'none', ' stroke="#fff" stroke-width="2" opacity=".7"'), circ(100, 100, 46, 'none', ' stroke="#fff" stroke-width="1.4" opacity=".6"'),
      circ(100, 100, 26, '#f4f4f7', ' stroke-width="2.6"'), circ(100, 100, 16, '#d9d9e2', ' stroke-width="2"'), circ(100, 100, 8, '#ededea', ' stroke-width="2.4"'),
      hi('M40 70 Q60 32 104 24 Q66 42 52 80Z', 0.75), hi('M150 140 Q140 160 118 172 Q140 152 144 132Z', 0.5),
      `<text x="100" y="154" text-anchor="middle" font-family="'Permanent Marker', 'Comic Sans MS', cursive" font-size="19" fill="${c.blue}" transform="rotate(-6 100 150)">mix for tiff</text>`,
      `<text x="100" y="58" text-anchor="middle" font-family="'Comic Sans MS', cursive" font-size="12" fill="${c.red}">vol. 1 · 2022</text>`,
      line('M70 166 q20 6 48 0', 2.4, c.blue),
      p(heartD(150, 72, 7), c.pink, ' stroke-width="2"'), p(heartD(46, 124, 6), c.red, ' stroke-width="2"'),
      spark(172, 30, 9, c.lemon),
    ].join(''),
  },
  {
    n: '04', slug: 'plushie-backpack', title: 'Plushie backpack',
    art: [
      p('M70 50 Q70 20 100 20 Q130 20 130 50', 'none', ' stroke-width="10"'), p('M70 50 Q70 20 100 20 Q130 20 130 50', 'none', ` stroke="${c.pink}" stroke-width="5"`),
      p('M40 92 Q34 46 100 42 Q166 46 160 92 L164 156 Q166 182 136 184 H64 Q34 182 36 156Z', c.pink),
      ...Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        return dot(100 + Math.cos(a) * 64, 114 + Math.sin(a) * 70, 5, '#ffb8da');
      }),
      p('M40 92 Q34 46 100 42 Q166 46 160 92 L164 156 Q166 182 136 184 H64 Q34 182 36 156Z', 'none'),
      fill('M140 60 Q160 70 160 92 L164 156 Q166 178 140 184 Q154 150 140 60Z', '#e86aa6', 0.5),
      p('M56 116 Q56 102 70 102 H130 Q144 102 144 116 V156 Q144 170 130 170 H70 Q56 170 56 156Z', '#ff9ccb'),
      ...Array.from({ length: 9 }, (_, i) => line(`M${64 + i * 9} 104 v6`, 2, '#c2417d')),
      line('M60 108 Q100 104 140 108', 3, c.grey, ' stroke-dasharray="3 3"'), rect(128, 104, 8, 16, 3, c.grey, ' stroke-width="2.4"'),
      hi('M50 76 q10 -22 36 -28 q-24 12 -30 32z', 0.6),
      // the halo shroom charm on the zip
      line('M132 120 L150 140', 2.4, c.steel), circ(150, 140, 4, 'none', ' stroke-width="2"'),
      g('translate(158 156) scale(0.42)', `<ellipse cx="0" cy="-34" rx="26" ry="8" fill="none" stroke="${INK}" stroke-width="9"/><ellipse cx="0" cy="-34" rx="26" ry="8" fill="none" stroke="#ff4a1c" stroke-width="5"/>` +
        p('M-14 4 C-15 22 -12 30 -8 34 C-2 38 2 38 8 34 C12 30 15 22 14 4Z', '#f3f2f7', ' stroke-width="4"') + p('M-40 6 C-40 -30 40 -30 40 6 C28 12 -28 12 -40 6Z', '#e5302a', ' stroke-width="4"') +
        ['-18 -6 7.5 6.2', '8 -15 6.8 5.6', '25 -1 5.6 4.6'].map((v) => { const [x, y, rx, ry] = v.split(' '); return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fbf6ee"/>`; }).join('')),
      spark(176, 46, 8, c.lemon), spark(24, 60, 6, '#fff'),
    ].join(''),
  },
  {
    n: '05', slug: 'flash', title: 'Flash',
    art: [
      p(Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2 - Math.PI / 2; const r = i % 2 ? 58 : 84; return `${i ? 'L' : 'M'}${(100 + Math.cos(a) * r).toFixed(1)} ${(100 + Math.sin(a) * r).toFixed(1)}`; }).join(' ') + 'Z', '#fff'),
      p(Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2 - Math.PI / 2; const r = i % 2 ? 48 : 70; return `${i ? 'L' : 'M'}${(100 + Math.cos(a) * r).toFixed(1)} ${(100 + Math.sin(a) * r).toFixed(1)}`; }).join(' ') + 'Z', '#eef0ff', ' stroke-width="2"'),
      p('M108 34 L78 96 H100 L88 150 L128 82 H104 L120 34Z', c.orange), p('M110 40 L86 92 H104', 'none', ' stroke="#fff" stroke-width="2" opacity=".7"'),
      `<g transform="rotate(-6 100 128)">${bold(100, 136, 34, 'FLASH', c.blue, ` stroke="${INK}" stroke-width="2.5" paint-order="stroke"`)}</g>`,
      line('M62 144 H138', 3, c.red),
      spark(170, 34, 9, c.lemon), spark(30, 160, 7, c.lilac),
    ].join(''),
  },
  {
    n: '06', slug: 'bunny-fruit', title: 'Bunny & fruit',
    art: [
      p('M14 168 Q40 152 70 160 Q100 150 130 160 Q162 152 188 168 Q184 186 160 186 H40 Q16 186 14 168Z', c.green),
      ...[[30, 160], [56, 154], [150, 154], [174, 162], [96, 152]].map(([x, y]) => line(`M${x} ${y} l-3 -9 M${x} ${y} l4 -10 M${x} ${y} l9 -6`, 2.4, '#2c7428')),
      // ears first, so the head covers their base: long, full, rounded tips, pink inside
      ell(104, 44, 11, 32, '#fff', ' transform="rotate(-14 104 44)"'), ell(104, 46, 5, 22, c.rose, ' stroke-width="0" transform="rotate(-14 104 46)"'),
      ell(130, 42, 11, 32, '#fff', ' transform="rotate(12 130 42)"'), ell(130, 44, 5, 22, c.rose, ' stroke-width="0" transform="rotate(12 130 44)"'),
      // body: a round sitting bunny, tail on the left
      circ(36, 136, 13, '#fff', ' stroke-width="3"'),
      ell(82, 134, 54, 40, '#fff'),
      fill('M34 150 Q80 178 130 150 Q120 172 82 174 Q46 172 34 150Z', '#dcdce8', 0.8),
      ell(62, 168, 24, 9, '#fff'), line('M48 166 h6 M44 170 h6', 1.6, c.steel),
      // head
      circ(122, 92, 32, '#fff'),
      fill('M96 106 Q122 126 150 104 Q144 122 122 124 Q102 122 96 106Z', '#dcdce8', 0.7),
      ell(132, 86, 5, 6.5, INK, ' stroke-width="0"'), dot(134, 83.5, 1.8, '#fff'),
      dot(130, 102, 6, c.pink, 0.5),
      p('M150 92 q5 0 4 5 q-2 3 -5 1z', c.pink, ' stroke-width="1.6"'),
      line('M152 98 q-2 6 -8 6', 2), line('M154 96 l16 -4 M154 100 l16 2', 1.4, c.steel),
      ell(126, 152, 12, 8, '#fff', ' stroke-width="3"'),
      hi('M40 120 q8 -16 24 -20 q-14 8 -18 24z', 0.35),
      // the strawberry it is holding on to
      p('M146 182 Q124 166 130 146 Q142 134 156 140 Q172 136 178 152 Q182 170 146 182Z', c.red),
      ...[[140, 152], [152, 150], [164, 154], [146, 164], [158, 166], [170, 162], [154, 174]].map(([x, y]) => ell(x!, y!, 1.5, 2.5, c.lemon, ' stroke-width="0"')),
      p('M140 144 L146 132 L154 142 L162 132 L166 146 Q154 140 140 144Z', c.green, ' stroke-width="2.4"'),
      hi('M134 154 q2 -8 8 -10 q-4 6 -4 12z', 0.7),
      p(heartD(30, 60, 8), c.pink, ' stroke-width="2.2"'), spark(172, 44, 8, c.lemon), spark(40, 96, 5, '#fff'),
    ].join(''),
  },
  {
    n: '07', slug: 'over-ears', title: 'Over-ears',
    art: [
      p('M34 116 Q30 40 100 34 Q170 40 166 116', 'none', ' stroke-width="18"'), p('M34 116 Q30 40 100 34 Q170 40 166 116', 'none', ` stroke="${c.dark}" stroke-width="12"`),
      p('M58 62 Q100 40 142 62', 'none', ` stroke="${c.steel}" stroke-width="5"`), line('M60 58 Q100 38 140 58', 1.6, '#fff', ' opacity=".7"'),
      rect(26, 102, 18, 40, 6, c.grey), rect(156, 102, 18, 40, 6, c.grey),
      ell(52, 132, 30, 38, c.blue), ell(52, 132, 18, 26, '#4a5bff', ' stroke-width="2.6"'), hi('M32 112 q6 -14 18 -14 q-10 6 -12 20z', 0.6),
      ell(148, 132, 30, 38, '#1b1c23'), ell(148, 132, 18, 26, c.dark, ' stroke-width="2.6"'), hi('M128 112 q6 -14 18 -14 q-10 6 -12 20z', 0.35),
      g('translate(52 134) scale(0.3)', p('M-40 6 C-40 -30 40 -30 40 6 C28 12 -28 12 -40 6Z', '#e5302a', ' stroke-width="6"') + p('M-14 4 V30 H14 V4', '#fff', ' stroke-width="6"')),
      line('M52 170 Q50 188 70 184 Q86 180 80 170 Q74 160 92 162 Q110 166 104 178 Q98 190 120 186', 4, c.red),
      rect(118, 180, 18, 8, 3, c.grey, ' stroke-width="2.4"'), line('M136 184 h10', 3),
      spark(180, 50, 8, c.lemon), spark(24, 60, 6, c.lilac),
    ].join(''),
  },
  {
    n: '08', slug: 'wub', title: 'Wub',
    art: [
      line('M18 80 Q8 110 18 140 M30 90 Q24 110 30 130 M182 80 Q192 110 182 140 M170 90 Q176 110 170 130', 4, c.orange),
      rect(42, 30, 116, 150, 12, c.dark), fill('M136 34 h18 q4 0 4 4 v136 q0 4 -4 4 h-18z', '#1b1c23', 0.7),
      circ(100, 62, 14, '#1b1c23'), circ(100, 62, 6, c.lilac, ' stroke-width="2.4"'),
      circ(100, 124, 40, '#1b1c23'), circ(100, 124, 32, c.pink, ' stroke-width="3"'), circ(100, 124, 22, '#ff6fb3', ' stroke-width="2.4"'), circ(100, 124, 11, c.blue, ' stroke-width="2.6"'), dot(96, 120, 3, '#fff', 0.8),
      ...[[52, 40], [148, 40], [52, 170], [148, 170]].map(([x, y]) => circ(x!, y!, 3, c.grey, ' stroke-width="1.6"')),
      hi('M48 40 h10 v120 q-10 -40 -10 -120z', 0.25),
      p(Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; const r = i % 2 ? 16 : 26; return `${i ? 'L' : 'M'}${(158 + Math.cos(a) * r).toFixed(1)} ${(36 + Math.sin(a) * r).toFixed(1)}`; }).join(' ') + 'Z', c.orange),
      bold(158, 41, 13, 'WUB', '#fff'),
    ].join(''),
  },
  {
    n: '09', slug: 'nail-salon-rave', title: 'Nail salon rave',
    defs: `<linearGradient id="polish" x1="0" x2="1"><stop offset="0" stop-color="#4a5bff"/><stop offset=".5" stop-color="#2335f0"/><stop offset="1" stop-color="#101883"/></linearGradient>`,
    art: [
      rect(84, 16, 32, 52, 7, '#1b1c23'), line('M92 20 V64 M100 20 V64 M108 20 V64', 1.6, c.dark), hi('M88 22 h4 v40 h-4z', 0.3),
      rect(80, 64, 40, 14, 3, c.dark),
      p('M58 92 Q58 78 72 78 H128 Q142 78 142 92 V166 Q142 184 124 184 H76 Q58 184 58 166Z', 'url(#polish)'),
      hi('M66 94 q0 -8 8 -8 h8 q-10 4 -10 70 q-6 -20 -6 -62z', 0.6),
      rect(70, 112, 60, 50, 6, '#fff', ' stroke-width="2.6"'),
      bold(100, 130, 10, 'NAIL SALON', INK, ' textLength="50" lengthAdjust="spacingAndGlyphs"'), bold(100, 153, 20, 'RAVE', c.red, ' textLength="48" lengthAdjust="spacingAndGlyphs"'),
      ...Array.from({ length: 6 }, (_, i) => dot(76 + i * 10, 172, 2.4, c.lcd)),
      spark(162, 40, 10, '#fff'), spark(34, 70, 8, c.pink), spark(160, 150, 6, c.lcd), spark(40, 160, 5, c.lemon),
    ].join(''),
  },
  {
    n: '10', slug: 'ict-lax', title: 'ICT → LAX',
    art: [
      g('rotate(-12 100 100)', p('M14 60 H186 V140 H14Z', '#fff') + fill('M14 60 H186 V80 H14Z', c.blue) + p('M14 60 H186 V140 H14Z', 'none') +
        line('M140 60 V140', 2.4, c.grey, ' stroke-dasharray="4 4"') +
        bold(77, 74, 8.5, 'BOARDING PASS · ONE WAY', '#fff', ' textLength="112" lengthAdjust="spacingAndGlyphs"') +
        bold(42, 118, 22, 'ICT', INK, ' textLength="40" lengthAdjust="spacingAndGlyphs"') + bold(118, 118, 22, 'LAX', INK, ' textLength="40" lengthAdjust="spacingAndGlyphs"') +
        p('M64 104 h10 l5 -5 h3.5 l-2.5 5 h5 l2.5 -2.5 h2.5 l-1.7 4.2 l1.7 4.2 h-2.5 l-2.5 -2.5 h-5 l2.5 5 h-3.5 l-5 -5 h-10z', c.orange, ' stroke-width="1.6"') +
        `<text x="42" y="132" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" fill="${c.steel}">WICHITA, KS</text><text x="118" y="132" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" fill="${c.steel}">LOS ANGELES</text>` +
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => `<rect x="${148 + i * 3.2}" y="${88 + (i % 3) * 2}" width="${i % 2 ? 1.6 : 2.4}" height="${40 - (i % 3) * 4}" fill="${INK}"/>`).join('') +
        circ(14, 100, 8, '#ededea', ' stroke-width="0"') + circ(186, 100, 8, '#ededea', ' stroke-width="0"') +
        circ(124, 96, 12, 'none', ` stroke="${c.red}" stroke-width="2.2" opacity=".7"`) + `<text x="124" y="98" text-anchor="middle" font-family="Arial, sans-serif" font-size="6" font-weight="700" fill="${c.red}" opacity=".8">LAX 26</text>`),
      spark(176, 36, 8, c.lemon),
    ].join(''),
  },
  {
    n: '11', slug: 'streak-30', title: 'Streak 30',
    art: [
      rect(40, 36, 124, 146, 10, '#e3e4ea'), rect(34, 30, 124, 146, 10, '#fff'),
      p('M34 40 Q34 30 44 30 H148 Q158 30 158 40 V64 H34Z', c.red),
      bold(96, 56, 17, 'STREAK', '#fff', ' letter-spacing="2"'),
      ...[54, 78, 102, 126].map((x) => rect(x, 18, 8, 22, 4, c.grey, ' stroke-width="2.4"')),
      bold(96, 134, 64, '30', INK),
      `<text x="96" y="156" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="${c.steel}">days in a row</text>`,
      ...Array.from({ length: 10 }, (_, i) => rect(46 + i * 10, 164, 7, 6, 1.5, i < 9 ? c.lcd : '#fff', ' stroke-width="1.4"')),
      fill('M150 64 H158 V166 Q158 176 148 176 H150Z', '#d9d9e2'),
      p('M158 150 L172 164 L156 172Z', '#d9d9e2', ' stroke-width="2.4"'),
      spark(176, 40, 9, c.lemon), spark(22, 120, 6, c.pink),
    ].join(''),
  },
  {
    n: '12', slug: 'start-over', title: 'Start over',
    art: [
      p('M28 26 L170 18 L178 92 L172 100 L182 112 L176 182 L36 186 L30 120 L22 110 L30 98Z', '#f6f4ee'),
      fill('M110 24 L170 18 L178 92 L160 96 Q130 70 110 24Z', c.lilac, 0.35),
      ...Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, k) => dot(120 + k * 9, 30 + r * 9, 2.2 - r * 0.25, c.blue, 0.55)).join('')),
      `<g transform="rotate(-4 100 100)">${bold(100, 92, 40, 'START', c.blue, ` stroke="${INK}" stroke-width="2" paint-order="stroke"`)}${bold(100, 136, 40, 'OVER', c.orange, ` stroke="${INK}" stroke-width="2" paint-order="stroke"`)}</g>`,
      `<text x="100" y="166" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="2" fill="${c.dark}" transform="rotate(-4 100 160)">FROM HALO · 2026</text>`,
      p('M70 10 h60 v18 h-60z', 'rgba(255,255,255,.7)', ' stroke-width="1.4" transform="rotate(-4 100 18)"'),
      hi('M40 40 h30 v4 h-30z', 0.5),
    ].join(''),
  },
];
