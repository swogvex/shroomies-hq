// Song stickers · HALO (2025–2026), with the two collabs she leads (CONSTANTLY, MEANT TO BE).
import { c, p, circ, ell, rect, line, fill, hi, dot, spark, g, heartD, INK } from './kit.ts';

export const defs: Record<string, string> = {
  'same-la': `<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd25a"/><stop offset=".55" stop-color="#ff6a3d"/><stop offset="1" stop-color="#e0388f"/></linearGradient>`,
  'look-up': `<radialGradient id="lantern" cx="50%" cy="65%" r="70%"><stop offset="0" stop-color="#fff6c2"/><stop offset=".6" stop-color="#ffb347"/><stop offset="1" stop-color="#ff7a2e"/></radialGradient>`,
};

export const art: Record<string, string> = {
  // a gift box bursting open with sparkles and a shooting star
  'everything-ive-ever-wanted': [
    // a gift box opening: the lid lifted straight up, ribbons lined up with the box's, light and stars pouring out
    fill('M54 104 L36 30 L164 30 L146 104Z', c.lemon, 0.35),
    spark(100, 40, 13, c.lemon), spark(66, 58, 8, '#fff'), spark(136, 56, 9, c.pink), spark(84, 24, 6, c.lilac), spark(120, 20, 6, '#fff'),
    line('M138 78 L178 30', 4, c.lemon), spark(182, 26, 10, c.lemon),
    rect(40, 106, 120, 76, 6, c.blue), fill('M128 108 h30 v72 h-30z', c.navy, 0.45),
    rect(90, 106, 20, 76, 2, c.lemon, ' stroke-width="3"'), fill('M104 108 h6 v72 h-6z', '#e6d24a', 0.8),
    hi('M46 112 h20 l-20 30z', 0.35),
    g('rotate(-10 100 84)', rect(32, 76, 136, 24, 5, '#4a5bff') + rect(90, 76, 20, 24, 2, c.lemon, ' stroke-width="3"') + hi('M38 80 h40 v4 h-40z', 0.5) +
      p('M100 76 Q78 46 62 58 Q54 72 98 78Z', c.lemon, ' stroke-width="3"') + p('M100 76 Q122 46 138 58 Q146 72 102 78Z', c.lemon, ' stroke-width="3"') +
      line('M70 62 Q84 66 96 74 M130 62 Q116 66 104 74', 1.6, '#c9a21a') + rect(93, 68, 14, 12, 4, '#ffe14a', ' stroke-width="2.6"')),
  ].join(''),

  // a genie lamp with a puff of magic: do it for me
  doit4me: [
    p('M30 150 Q36 120 80 118 H132 Q160 118 170 98 Q178 88 186 94 Q182 112 162 134 Q146 156 112 158 H62 Q36 158 30 150Z', c.gold),
    p('M30 150 Q20 132 36 128 Q46 138 40 150', c.gold, ' stroke-width="3"'),
    p('M66 158 H116 L124 176 H58Z', c.gold), fill('M120 120 Q150 120 168 102 Q160 130 128 150Z', '#d9a21a', 0.55),
    p('M82 118 Q96 98 112 118Z', '#ffd86b'), circ(97, 98, 6, c.gold, ' stroke-width="2.6"'),
    hi('M44 138 q20 -16 60 -16 q-40 6 -56 22z', 0.6),
    p('M176 92 Q170 70 186 60 Q176 46 160 54 Q150 32 128 42 Q114 26 98 40 Q80 34 82 54 Q72 72 92 74 Q104 84 120 74 Q140 84 152 72 Q170 80 176 92Z', c.lilac, ' stroke-width="3"'),
    fill('M98 50 Q120 44 136 56 Q154 50 166 64 Q150 66 136 66 Q118 70 98 60Z', c.pink, 0.7),
    spark(120, 56, 8, '#fff'), spark(148, 40, 6, c.lemon), spark(60, 40, 7, c.lemon),
  ].join(''),

  // the same palm tree against the same LA sunset
  'same-la': [
    circ(100, 100, 74, 'url(#dusk)'),
    ...[[124, 8], [140, 7], [154, 6], [166, 5]].map(([y, h]) => fill(`M26 ${y} H174 V${(y as number) + (h as number)} H26Z`, '#fff', 0.3)),
    p('M30 160 Q100 146 170 160 A74 74 0 0 1 30 160Z', c.navy),
    p('M98 158 Q92 110 108 66 L114 68 Q100 112 106 158Z', c.dark, ' stroke-width="3"'),
    ...['M110 66 Q86 50 62 62 Q88 58 108 70Z', 'M110 66 Q134 46 160 58 Q134 56 112 70Z', 'M110 66 Q96 40 74 40 Q98 50 108 68Z', 'M110 66 Q126 38 148 36 Q126 48 112 68Z', 'M110 66 Q114 86 102 102 Q116 84 112 66Z'].map((d) => p(d, c.dark, ' stroke-width="2.6"')),
    hi('M48 64 q14 -24 40 -32 q-24 14 -32 36z', 0.35),
  ].join(''),

  // a lipstick and an open compact mirror: pretty for you
  pretty4u: [
    g('rotate(18 70 110)', rect(46, 112, 40, 64, 6, c.gold) + fill('M74 114 h10 v60 h-10z', '#d9a21a', 0.55) + rect(50, 94, 32, 22, 3, '#d9a21a') + p('M52 94 V66 Q52 52 66 46 Q80 52 80 70 V94Z', c.red) + hi('M56 88 V68 q2 -10 8 -14 q-4 12 -4 34z', 0.6)),
    circ(140, 126, 40, c.pink), circ(140, 126, 30, c.rose, ' stroke-width="2.6"'),
    p('M110 96 Q104 56 140 48 Q176 56 170 96Z', c.pink), p('M118 92 Q114 64 140 58 Q166 64 162 92Z', '#d6ecff', ' stroke-width="2.6"'),
    hi('M126 84 l18 -22 l6 4 l-18 22z', 0.85),
    spark(150, 74, 7, '#fff', false), spark(174, 30, 9, c.lemon), spark(30, 40, 7, c.pink),
  ].join(''),

  // a cat and its photocopy
  copycat: [
    // a chain of paper dolls cut from one sheet, the scissors still open: someone copying you, one after another
    ...[0, 1, 2].map((i) => {
      const x = 24 + i * 54;
      const col = i === 0 ? c.pink : '#ffe3ef';
      return p(`M${x + 27} 52 a14 14 0 1 1 -0.1 0z M${x + 12} 80 H${x + 42} L${x + 54} 96 L${x + 46} 104 L${x + 40} 98 V128 L${x + 48} 168 H${x + 32} L${x + 27} 142 L${x + 22} 168 H${x + 6} L${x + 14} 128 V98 L${x + 8} 104 L${x} 96Z`, col, i ? ' stroke-dasharray="5 4"' : '');
    }),
    p('M38 56 Q30 48 34 44 Q40 46 42 54 Q44 46 50 44 Q54 48 46 56Z', c.red, ' stroke-width="2.2"'),
    dot(46, 64, 2.6), dot(56, 64, 2.6), dot(42, 70, 2.6, c.pink, 0.7), dot(60, 70, 2.6, c.pink, 0.7),
    line('M46 72 Q51 76 56 72', 2.2),
    g('rotate(-30 160 60)', circ(150, 34, 10, c.red, ' stroke-width="3"') + circ(170, 34, 10, c.red, ' stroke-width="3"') + circ(150, 34, 4, '#fff', ' stroke-width="2"') + circ(170, 34, 4, '#fff', ' stroke-width="2"') + p('M152 44 L176 92 L168 94 Z', c.grey, ' stroke-width="2.6"') + p('M168 44 L144 92 L152 94 Z', c.grey, ' stroke-width="2.6"') + dot(160, 56, 2.6)),
    spark(186, 120, 7, c.lemon), spark(16, 40, 6, c.pink),
  ].join(''),

  // a four-leaf clover with a leaf falling away
  'no-luck': [
    line('M100 104 Q112 150 96 184', 6), line('M100 104 Q112 150 96 184', 2.8, c.green),
    p(heartD(72, 78, 26), c.green, ' transform="rotate(-45 72 78)"'),
    p(heartD(128, 78, 26), c.green, ' transform="rotate(45 128 78)"'),
    p(heartD(72, 128, 26), c.green, ' transform="rotate(-135 72 128)"'),
    line('M100 104 L78 82 M100 104 L122 82 M100 104 L78 126', 2, '#2c7428'),
    p(heartD(158, 156, 18), c.mint, ' transform="rotate(160 158 156)"'), line('M158 160 L156 144', 1.8, '#2c7428'),
    line('M132 120 q10 8 14 22', 2.6, c.steel, ' stroke-dasharray="2 6"'),
    hi('M60 62 q4 -8 12 -8 q-6 4 -8 12z', 0.7), hi('M118 62 q4 -8 12 -8 q-6 4 -8 12z', 0.7),
  ].join(''),

  // a best-friends heart pendant, snapped in two and drifting apart
  breakup: [
    line('M50 66 Q40 40 56 14 M150 66 Q160 40 144 14', 4.2, c.steel, ' stroke-dasharray="0.1 6.5"'),
    g('rotate(-12 64 110) translate(-10 0)', p('M96 66 C70 40 22 52 26 96 C30 130 66 156 96 172 L86 150 L100 132 L84 114 L98 96 L86 80Z', c.pink) + circ(58, 72, 6, c.gold, ' stroke-width="2.4"') + hi('M36 88 q6 -20 26 -22 q-16 8 -20 26z', 0.7)),
    g('rotate(12 136 110) translate(10 0)', p('M104 66 C130 40 178 52 174 96 C170 130 134 156 104 172 L114 150 L100 132 L116 114 L102 96 L114 80Z', c.rose) + circ(142, 72, 6, c.gold, ' stroke-width="2.4"')),
    line('M100 110 v8 M100 128 v6', 3, c.red),
  ].join(''),

  // a magnifying glass over a fingerprint: what did I do?
  'tell-me-what-i-did': [
    g('rotate(-6 92 100)', rect(36, 34, 112, 136, 6, c.paper) + line('M50 54 H134 M50 64 H110', 2.4, c.grey)),
    ...[10, 18, 26, 34].map((r) => line(`M${86 - r} 118 A${r} ${r + 6} 0 0 1 ${86 + r} 118`, 2.6, c.steel)),
    line('M80 140 Q86 132 92 140 M70 146 Q86 128 102 146', 2.6, c.steel),
    line('M128 126 L176 176', 14), line('M128 126 L176 176', 8, c.brown),
    circ(104, 104, 38, 'rgba(210,235,255,.45)', ' stroke-width="9"'), circ(104, 104, 38, 'none', ` stroke="${c.gold}" stroke-width="4.5"`),
    hi('M80 88 q10 -16 28 -18 q-18 8 -22 24z', 0.8),
    line('M164 40 q0 -10 9 -10 q9 0 8 8 q-1 6 -8 9 v6', 4, c.orange), dot(173, 63, 2.8, c.orange),
  ].join(''),

  // a pink eraser rubbing out a scribble: start over
  'start-over': [
    // a seedling breaking through cracked ground: after everything, starting again
    p('M14 150 Q100 128 186 150 L182 184 H18Z', '#8a8d99'),
    fill('M18 170 Q100 158 182 170 V184 H18Z', '#6f7280', 0.8),
    line('M100 140 L92 152 L104 162 L96 176 M92 152 L74 158 M104 162 L124 166', 3),
    line('M100 140 Q96 100 100 70', 7), line('M100 140 Q96 100 100 70', 3.5, c.green),
    p('M100 86 Q70 84 56 58 Q86 52 100 82Z', c.green), line('M98 82 Q80 72 64 62', 1.8, '#2c7428'),
    p('M100 74 Q124 52 152 58 Q144 88 102 80Z', c.mint), line('M104 76 Q124 66 144 62', 1.8, c.green),
    p('M100 70 Q94 52 100 40 Q108 52 100 70Z', c.mint, ' stroke-width="2.8"'),
    hi('M64 62 q10 -2 22 8 q-12 -2 -20 -2z', 0.6),
    ...[[30, 160], [160, 158], [140, 176], [52, 176]].map(([x, y]) => p(`M${x} ${y} l6 -3 l5 4 l-4 4z`, '#a3a6b3', ' stroke-width="1.8"')),
    spark(150, 30, 10, c.lemon), spark(46, 32, 7, '#fff'), spark(170, 100, 6, c.lemon),
    circ(36, 98, 12, c.lemon, ' stroke-width="2.6"'), ...Array.from({ length: 8 }, (_, i) => line('M36 80 v-5', 2.4, INK, ` transform="rotate(${i * 45} 36 98)"`)),
  ].join(''),

  // a paper sky lantern floating up between the stars
  'look-up': [
    p('M62 52 Q100 24 138 52 L130 130 Q100 142 70 130Z', 'url(#lantern)'),
    line('M86 40 Q82 90 86 136 M114 40 Q118 90 114 136', 2, '#e07a20'),
    rect(78, 132, 44, 10, 3, c.tan), line('M86 142 L94 156 M114 142 L106 156', 2.4),
    p('M100 150 Q92 162 100 172 Q108 162 100 150Z', c.lemon, ' stroke-width="2.4"'), fill('M100 158 Q97 164 100 168 Q103 164 100 158Z', c.orange),
    hi('M70 60 q10 -14 22 -18 q-12 10 -14 26z', 0.7),
    spark(30, 40, 9, c.lemon), spark(170, 30, 7, '#fff'), spark(160, 120, 10, c.lemon), spark(36, 130, 6, '#fff'), spark(150, 170, 5, c.lemon),
    line('M40 186 l4 -10 M160 190 l-4 -10', 2.6, c.lilac),
  ].join(''),

  // a cowgirl hat with a star on its band
  'american-girl': [
    p('M14 118 Q30 146 100 146 Q170 146 186 118 Q176 104 160 116 Q100 132 40 116 Q24 104 14 118Z', c.pink),
    p('M50 120 Q46 70 66 52 Q80 42 100 58 Q120 42 134 52 Q154 70 150 120 Q100 132 50 120Z', c.pink),
    fill('M120 52 Q150 64 150 120 Q140 122 132 122 Q140 80 120 52Z', '#e86aa6', 0.6),
    line('M100 58 Q96 80 100 96', 2.4, '#c2417d'),
    p('M50 104 Q100 118 150 104 L150 120 Q100 132 50 120Z', c.blue, ' stroke-width="3"'),
    p('M100 100 l4.5 9 h10 l-8 6 l3 10 l-9.5 -6 l-9.5 6 l3 -10 l-8 -6 h10z', c.lemon, ' stroke-width="2.2"'),
    line('M24 124 Q100 152 176 124', 1.8, '#c2417d', ' stroke-dasharray="4 4"'),
    hi('M60 76 q6 -18 18 -22 q-10 12 -12 30z', 0.6),
    spark(176, 70, 8, c.lemon), spark(24, 80, 6, '#fff'),
  ].join(''),

  // a moving box taped up, ready to leave Toledo
  'farewell-toledo': [
    p('M36 86 H150 V176 H36Z', c.tan), p('M150 86 L176 70 V156 L150 176Z', '#c98f55'),
    p('M36 86 L18 60 H128 L150 86Z', '#e8c08e'), p('M150 86 L176 70 L154 46 L128 60Z', '#d9a66a'),
    rect(80, 86, 26, 90, 0, '#d9c7a0', ' stroke-width="2.4" opacity=".9"'),
    p(heartD(64, 130, 12), c.red, ' stroke-width="2.6"'),
    line('M118 150 H140 M118 158 H134', 2.4, c.brown),
    line('M120 72 Q132 54 150 50', 2.4, c.brown),
    g('rotate(-18 166 44)', p('M150 32 H178 Q184 32 184 38 V56 Q184 62 178 62 H150 L142 47Z', c.lemon, ' stroke-width="2.8"') + circ(150, 47, 3, '#fff', ' stroke-width="1.8"') + line('M158 42 H176 M158 50 H172', 2, '#c9a21a')),
    hi('M40 94 h20 l-20 30z', 0.3),
  ].join(''),

  // a flip phone from back then, opened, a heart on its little screen
  'its-not-like-that-anymore': [
    g('rotate(-12 100 100)', rect(62, 24, 76, 74, 14, c.lilac) + rect(72, 34, 56, 46, 6, c.lcd, ' stroke-width="2.6"') + p(heartD(100, 58, 10), c.red, ' stroke-width="2"') + rect(92, 86, 16, 4, 2, INK, ' stroke-width="1"') +
      rect(66, 96, 68, 18, 6, c.purple) + rect(62, 110, 76, 78, 14, c.lilac) +
      [0, 1, 2].flatMap((r) => [0, 1, 2].map((k) => rect(74 + k * 18, 140 + r * 14, 14, 9, 3, '#fff', ' stroke-width="2"'))).join('') + rect(86, 120, 28, 12, 5, c.paper, ' stroke-width="2.4"') +
      line('M134 30 L150 4', 5) + circ(150, 4, 4, c.pink, ' stroke-width="2.4"') + hi('M68 40 q2 -10 10 -12 v44 q-10 -10 -10 -32z', 0.5)),
    line('M150 120 l12 -6 M154 140 l14 0', 3, c.steel),
    spark(36, 150, 7, c.pink),
  ].join(''),

  // a neon infinity sign, glowing, never stops
  constantly: [
    line('M40 62 V44 M160 62 V44', 4, c.steel), line('M28 44 H172', 4, c.steel),
    line('M100 100 C78 64 30 64 30 100 C30 136 78 136 100 100 C122 64 170 64 170 100 C170 136 122 136 100 100Z', 22, c.pink, ' opacity=".35"'),
    line('M100 100 C78 64 30 64 30 100 C30 136 78 136 100 100 C122 64 170 64 170 100 C170 136 122 136 100 100Z', 14, INK),
    line('M100 100 C78 64 30 64 30 100 C30 136 78 136 100 100 C122 64 170 64 170 100 C170 136 122 136 100 100Z', 8, c.pink),
    line('M100 100 C78 64 30 64 30 100 C30 136 78 136 100 100 C122 64 170 64 170 100 C170 136 122 136 100 100Z', 2.6, '#fff', ' opacity=".9"'),
    rect(92, 140, 16, 24, 3, c.dark), line('M100 164 Q100 186 130 184', 3),
    spark(178, 150, 7, c.pink), spark(22, 150, 6, '#fff'),
  ].join(''),

  // two cherries joined at the stem: meant to be
  'meant-to-be': [
    line('M76 118 Q84 66 112 32 M132 122 Q128 72 112 32', 6), line('M76 118 Q84 66 112 32 M132 122 Q128 72 112 32', 2.8, c.green),
    p('M112 32 Q132 14 158 26 Q140 48 112 32Z', c.green), line('M118 32 Q136 26 152 28', 1.8, '#2c7428'),
    circ(72, 136, 30, c.red), circ(134, 140, 30, c.red),
    fill('M48 150 Q72 172 96 150 Q92 166 72 166 Q52 166 48 150Z', '#a5121a', 0.6), fill('M110 154 Q134 176 158 154 Q154 170 134 170 Q114 170 110 154Z', '#a5121a', 0.6),
    hi('M56 124 q6 -10 16 -10 q-10 4 -12 14z', 0.85), hi('M118 128 q6 -10 16 -10 q-10 4 -12 14z', 0.85),
    p(heartD(46, 60, 10), c.pink, ' stroke-width="2.4"'), p(heartD(172, 84, 8), c.pink, ' stroke-width="2.4"'),
    spark(170, 180, 6, c.lemon),
  ].join(''),
};
