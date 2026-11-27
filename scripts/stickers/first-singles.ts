// Song stickers · First singles (2018–2020). Each drawing sits in a 200 × 200 box. The sticker holds the feeling of the
// song (its title and what it is about), not only its title.
import { c, p, circ, ell, rect, line, fill, hi, dot, spark, g, heartD, INK } from './kit.ts';

const soap = (id: string) =>
  `<radialGradient id="${id}" cx="36%" cy="30%" r="72%"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".5" stop-color="#e3f6ff" stop-opacity=".85"/><stop offset=".8" stop-color="#e8dcff" stop-opacity=".9"/><stop offset="1" stop-color="#ffcfe6" stop-opacity=".95"/></radialGradient>`;

export const defs: Record<string, string> = {
  'i-want-my-money-back': `<clipPath id="pig"><ellipse cx="92" cy="106" rx="64" ry="44"/></clipPath><clipPath id="hole"><path d="M84 100 L106 94 L118 116 L104 134 L82 126Z"/></clipPath>`,
  bubble: soap('soap'),
  'im-sorry': `<clipPath id="heart"><path d="${heartD(100, 104, 62)}"/></clipPath>`,
  'clout-chaser': `<clipPath id="bag"><path d="M64 112 Q52 156 84 172 Q116 180 128 140 Q132 112 122 92Z"/></clipPath>`,
};

/** A soap bubble: iridescent body, a curved window reflection, rim glints. */
const bubbleAt = (cx: number, cy: number, r: number) =>
  circ(cx, cy, r, 'url(#soap)', r < 14 ? ' stroke-width="2.6"' : '') +
  line(`M${cx - r * 0.62} ${cy + r * 0.48} A${r * 0.78} ${r * 0.78} 0 0 0 ${cx + r * 0.5} ${cy + r * 0.62}`, Math.max(2, r * 0.09), c.pink, ' opacity=".75"') +
  line(`M${cx + r * 0.52} ${cy + r * 0.55} A${r * 0.78} ${r * 0.78} 0 0 0 ${cx + r * 0.78} ${cy - r * 0.05}`, Math.max(2, r * 0.09), c.aqua, ' opacity=".7"') +
  hi(`M${cx - r * 0.7} ${cy - r * 0.12} Q${cx - r * 0.62} ${cy - r * 0.6} ${cx - r * 0.18} ${cy - r * 0.74} L${cx - r * 0.1} ${cy - r * 0.56} Q${cx - r * 0.46} ${cy - r * 0.44} ${cx - r * 0.5} ${cy - r * 0.06}Z`, 0.95);

export const art: Record<string, string> = {
  // bubbles drifting up: one big with a bedroom window in its reflection, three small ones following
  bubble: [
    bubbleAt(90, 104, 66),
    p('M108 50 Q126 52 136 64 L128 74 Q120 64 106 62Z', '#fff', ' stroke-width="0" opacity=".9"'),
    p('M110 66 Q122 68 128 76 L124 82 Q118 76 108 74Z', '#fff', ' stroke-width="0" opacity=".75"'),
    dot(130, 146, 3, '#fff', 0.9),
    bubbleAt(162, 48, 20), bubbleAt(176, 96, 10), bubbleAt(34, 168, 13), bubbleAt(150, 168, 7),
    spark(28, 48, 9, c.lemon), spark(186, 140, 7, '#fff'),
  ].join(''),

  // a paper plane flying itself: a looping dotted trail that starts at its tail
  autopilot: [
    line('M92 110 C70 120 52 140 60 160 C68 178 96 172 92 152 C88 132 58 130 34 146 C22 154 16 162 14 172', 3.2, c.steel, ' stroke-dasharray="1 8"'),
    p('M28 58 Q30 44 46 46 Q52 32 68 38 Q82 32 88 46 Q100 48 98 60 Q96 68 86 68 H38 Q28 68 28 58Z', '#fff', ' stroke-width="3"'),
    fill('M34 64 H88 Q94 64 96 60 Q96 68 86 68 H38 Q32 68 34 64Z', c.lilac, 0.5),
    p('M90 106 L186 40 L124 110Z', '#fff'),
    p('M124 110 L186 40 L134 150Z', c.sky),
    p('M124 110 L134 150 L118 132Z', '#7cbde8'),
    fill('M96 104 L176 48 L124 104Z', c.lilac, 0.25),
    line('M124 110 L186 40', 2.6),
    hi('M104 100 L170 52 L118 98Z', 0.7),
    spark(170, 150, 8, c.lemon), spark(156, 22, 6, '#fff'),
  ].join(''),

  // a cracked piggy bank seen from the side: a chunk broken off, the savings rolling out
  'i-want-my-money-back': [
    // a piggy bank seen from the side, a piece broken out of it: the savings spilling out
    ell(96, 180, 70, 7, INK, ' stroke-width="0" opacity=".12"'),
    rect(54, 136, 18, 34, 7, '#e86aa6'), rect(118, 136, 18, 34, 7, '#e86aa6'),
    line('M30 100 q-14 -2 -12 -14 q2 -10 10 -6 q6 4 -2 10', 3.2),
    ell(92, 106, 64, 44, c.pink),
    `<g clip-path="url(#pig)">${fill('M24 122 Q92 166 160 120 V170 H24Z', '#e86aa6', 0.55)}${fill('M84 100 L106 94 L118 116 L104 134 L82 126Z', '#5a1638')}</g>`,
    // the coins are inside: only what the hole lets you see
    `<g clip-path="url(#hole)">${circ(96, 116, 9, c.gold, ' stroke-width="2.2"')}${circ(110, 128, 8, c.gold, ' stroke-width="2.2"')}${circ(104, 104, 7, '#e0a518', ' stroke-width="2"')}</g>`,
    p('M84 100 L106 94 L118 116 L104 134 L82 126Z', 'none', ' stroke-width="3"'),
    line('M88 66 L94 80 L86 90 L84 100 M104 134 L110 148', 2.6),
    // the coin slot: a metal plate with the slit in it
    g('rotate(-4 85 63)', rect(68, 57, 34, 13, 5, c.grey, ' stroke-width="2.8"') + rect(74, 61.5, 22, 4, 2, INK, ' stroke-width="0"') + hi('M71 59 h12 v2 h-12z', 0.7)),
    p('M116 70 L124 42 L142 72Z', c.pink), fill('M120 66 L125 50 L135 68Z', '#e86aa6'),
    rect(150, 94, 20, 28, 9, '#ffb0d2'), ell(160, 108, 5, 9, '#ff8fc0', ' stroke-width="2"'), dot(158, 104, 1.8), dot(158, 112, 1.8),
    dot(134, 92, 4), dot(135, 91, 1.4, '#fff'), dot(138, 108, 6, '#ff6fb3', 0.45),
    hi('M40 86 Q50 68 74 64 Q58 76 50 94Z', 0.65),
    // the piece that broke out, the same shape, lying on the floor with the coins
    p('M118 176 L134 166 L150 174 L140 186 L122 186Z', c.pink, ' stroke-width="3"'), fill('M134 166 L150 174 L146 178 L132 172Z', '#5a1638'),
    ...[[62, 182, 10], [86, 186, 9], [40, 176, 8]].map(([x, y, r]) => circ(x!, y!, r!, c.gold) + circ(x!, y!, r! - 4, 'none', ' stroke-width="1.8"')),
    line('M150 140 l10 -2 M148 152 l10 4', 2.6, c.orange),
  ].join(''),

  // a butterfly net swinging at a floating "like": chasing the clout
  'clout-chaser': [
    line('M22 190 L72 120', 10), line('M22 190 L72 120', 5, c.tan), line('M28 182 L66 128', 1.6, '#c98f55'),
    `<g clip-path="url(#bag)">${p('M64 112 Q52 156 84 172 Q116 180 128 140 Q132 112 122 92Z', 'rgba(255,255,255,.8)', ' stroke-width="0"')}${line('M40 100 L130 190 M54 92 L140 178 M70 86 L150 166 M84 80 L156 152 M30 116 L114 200 M40 190 L130 100 M54 198 L144 108 M70 206 L156 120 M26 176 L118 84', 1.6, c.steel)}</g>`,
    p('M64 112 Q52 156 84 172 Q116 180 128 140 Q132 112 122 92', 'none', ' stroke-width="3"'),
    ell(94, 102, 32, 16, 'none', ' stroke-width="7" transform="rotate(-28 94 102)"'), ell(94, 102, 32, 16, 'none', ` stroke="${c.grey}" stroke-width="3" transform="rotate(-28 94 102)"`),
    p('M122 26 h52 a12 12 0 0 1 12 12 v32 a12 12 0 0 1 -12 12 h-22 l-12 14 l-2 -14 h-16 a12 12 0 0 1 -12 -12 v-32 a12 12 0 0 1 12 -12z', c.orange),
    fill('M110 70 h76 v0 a12 12 0 0 1 -12 12 h-52 a12 12 0 0 1 -12 -12z', '#d93a10', 0.5),
    p(heartD(148, 54, 15), '#fff', ' stroke-width="2.6"'),
    hi('M120 36 q2 -8 10 -8 h14 q-16 2 -20 14z', 0.55),
    p(heartD(186, 18, 6), c.pink, ' stroke-width="2"'), p(heartD(110, 16, 5), c.pink, ' stroke-width="2"'),
    line('M104 48 l-10 -2 M106 64 l-10 4', 3),
  ].join(''),

  // a bouquet in kraft paper: a daisy, a tulip and a rose, tied with a ribbon
  flowers: [
    line('M100 122 L70 72 M100 122 L104 64 M100 122 L138 76', 5, c.green),
    p('M66 94 q-24 -6 -28 -28 q22 4 28 28z', c.mint), line('M64 92 q-12 -8 -20 -22', 1.6, c.green),
    p('M134 100 q26 -4 32 -26 q-24 2 -32 26z', c.mint), line('M136 98 q14 -4 26 -20', 1.6, c.green),
    ...Array.from({ length: 10 }, (_, i) => ell(70, 54, 6.5, 15, c.paper, ` transform="rotate(${i * 36} 70 70)" stroke-width="2.6"`)),
    circ(70, 70, 10, c.lemon), ...[[67, 67], [73, 68], [70, 73]].map(([x, y]) => dot(x!, y!, 1.4, '#c9a21a')),
    p('M92 68 Q88 34 104 32 Q120 34 116 68 Q104 76 92 68Z', c.red), p('M104 34 Q96 48 98 66 Q104 70 110 66 Q112 48 104 34Z', '#ff5a4a', ' stroke-width="2.4"'),
    hi('M95 46 q2 -8 6 -10 q-2 8 -2 18z', 0.6),
    circ(140, 72, 19, c.pink), line('M140 72 m-4 0 a4 4 0 1 1 8 0 a8 8 0 1 1 -14 -2 a12 12 0 1 1 22 4', 2.4, '#c2417d'), hi('M126 64 q4 -8 12 -10 q-6 4 -8 12z', 0.6),
    p('M64 112 L100 188 L136 112 Q100 100 64 112Z', c.tan),
    fill('M100 188 L84 114 Q92 108 100 108Z', '#c98f55', 0.6), line('M78 120 L100 172 M122 120 L100 172', 1.6, '#c98f55'),
    p('M96 134 Q80 116 70 126 Q64 136 74 142 Q86 146 96 138Z', c.pink, ' stroke-width="3"'), p('M104 134 Q120 116 130 126 Q136 136 126 142 Q114 146 104 138Z', c.pink, ' stroke-width="3"'),
    line('M76 128 Q82 132 90 134 M124 128 Q118 132 110 134', 1.8, '#c2417d'),
    p('M96 140 L86 168 L92 166 L96 172 L100 144Z M104 140 L114 168 L108 166 L104 172 L100 144Z', c.pink, ' stroke-width="2.6"'),
    rect(93, 130, 14, 12, 4, '#ff6fb3', ' stroke-width="2.8"'),
  ].join(''),

  // a heart beating again: a heartbeat line runs through it
  'im-alive': [
    p(heartD(100, 100, 60), c.red),
    fill(heartD(108, 110, 44), '#b8141c', 0.35),
    hi('M60 68 q10 -22 32 -14 q-20 4 -26 24z', 0.85), dot(146, 70, 4, '#fff', 0.7),
    line('M12 108 H58 L70 84 L86 138 L100 60 L114 128 L124 104 H188', 12, INK),
    line('M12 108 H58 L70 84 L86 138 L100 60 L114 128 L124 104 H188', 6, c.lcd),
    line('M12 108 H58 L70 84 L86 138 L100 60 L114 128 L124 104 H188', 1.6, '#f6ffd8'),
    circ(188, 108, 7, c.lcd, ' stroke-width="3"'),
    spark(158, 40, 11, c.lemon), spark(38, 58, 7, '#fff'), spark(170, 160, 6, c.pink), spark(30, 156, 5, c.lemon),
  ].join(''),

  // a bowl of rainbow cereal, the spoon dipped in the milk
  'frooty-loops': [
    line('M122 96 L174 30', 11), line('M122 96 L174 30', 6, c.grey), ell(178, 24, 11, 7, c.grey, ' transform="rotate(-52 178 24)"'),
    line('M128 88 L168 38', 1.8, '#fff', ' opacity=".8"'),
    p('M24 100 Q100 110 176 100 Q168 170 100 176 Q32 170 24 100Z', c.blue),
    fill('M40 128 Q100 152 166 126 Q158 166 100 170 Q46 166 40 128Z', c.navy, 0.45),
    hi('M40 114 q4 24 24 40 q-26 -8 -28 -40z', 0.45),
    ...[[56, 142], [76, 150], [100, 152], [124, 150], [146, 142]].map(([x, y], i) => circ(x!, y!, 5, [c.pink, c.lemon, c.mint, c.orange, c.lilac][i]!, ' stroke-width="2"') + dot(x!, y!, 1.6, c.paper)),
    ell(100, 100, 76, 16, '#fffdf6'), fill('M36 102 Q100 118 164 102 Q100 112 36 102Z', '#e9e2d6'),
    ...[[56, 98, c.pink], [78, 92, c.lemon], [100, 98, c.mint], [124, 92, c.orange], [146, 100, c.lilac], [70, 106, c.orange], [92, 108, c.red], [116, 106, c.pink], [138, 108, c.lemon], [44, 104, c.mint], [90, 84, c.lilac], [112, 84, c.red], [134, 82, c.mint], [154, 92, c.pink]].map(
      ([x, y, f]) => circ(x as number, y as number, 9, f as string, ' stroke-width="2.8"') + circ(x as number, y as number, 3, '#fffdf6', ' stroke-width="1.8"'),
    ),
    p('M146 98 q6 -10 14 -2 q-4 8 -14 2z', '#fffdf6', ' stroke-width="2.2"'),
  ].join(''),

  // the last slice of cake, a cherry on top and a little "?" flag: satisfied?
  satisfied: [
    p('M24 128 L150 96 L180 126 L180 166 L24 166Z', c.cream),
    fill('M24 136 H180 V146 H24Z', c.pink, 0.9), fill('M24 154 H180 V160 H24Z', c.pink, 0.9),
    p('M180 126 L180 166 L150 140 L150 96Z', '#f0dcc4'), fill('M150 112 L180 136 V142 L150 118Z', c.pink, 0.8),
    p('M24 128 L150 96 L180 126 Z', '#fff'),
    p('M24 128 L180 126 L180 166 L24 166Z', 'none'),
    line('M24 136 H180 M24 154 H180', 2, '#e86aa6'),
    p('M24 128 Q32 140 40 128 Q48 140 56 128 Q64 140 72 128', '#fff', ' stroke-width="2.4"'),
    hi('M34 160 h60 v3 h-60z', 0.5), dot(60, 145, 1.6, '#c2417d'), dot(110, 158, 1.6, '#c2417d'),
    line('M150 104 Q148 76 128 60', 3, c.green), circ(150, 106, 13, c.red), hi('M143 100 q4 -6 10 -4 q-6 2 -8 8z', 0.85),
    line('M92 116 L88 30', 4, c.tan),
    p('M88 30 L42 22 Q36 22 38 28 L44 58 Q46 62 52 62 L88 62Z', c.lemon, ' stroke-width="3"'),
    fill('M88 54 L50 56 L52 62 L88 62Z', '#e6d24a', 0.8),
    line('M54 36 q0 -9 9 -8 q9 1 6 9 q-3 5 -6 9', 4), dot(62.5, 54, 2.6),
  ].join(''),

  // the fear of signing: a contract with a heart seal, the pen hovering and sweating
  'commitment-issues': [
    g('rotate(-6 92 108)', p('M34 30 H140 L156 46 V184 H34Z', c.paper) + p('M140 30 V46 H156Z', '#e3ddd0', ' stroke-width="2.6"') +
      line('M50 52 H118 M50 66 H134 M50 80 H128 M50 94 H136 M50 108 H112', 3, c.grey) + line('M50 144 H124', 2.6) +
      line('M52 132 l8 8 M60 132 l-8 8', 3, c.red) + circ(134, 162, 14, c.red) + p(heartD(134, 162, 7), '#ffb0b0', ' stroke-width="1.6"') +
      p('M124 172 l-6 12 l8 -4 l4 6z', c.red, ' stroke-width="2"')),
    g('rotate(38 140 92)', rect(130, 30, 18, 92, 8, c.navy) + rect(130, 30, 18, 20, 6, '#2a3590') + p('M132 122 L139 146 L146 122Z', c.gold) + line('M139 128 V140', 1.6) + rect(144, 44, 6, 40, 3, c.gold, ' stroke-width="2"') + hi('M134 54 h4 v60 h-4z', 0.35)),
    ...[[178, 92], [186, 112], [172, 128]].map(([x, y]) => p(`M${x} ${y! - 8} Q${x! + 6} ${y} ${x} ${y! + 4} Q${x! - 6} ${y} ${x} ${y! - 8}Z`, c.sky, ' stroke-width="2.2"')),
  ].join(''),

  // a wind-up alarm clock ringing at an hour nobody should be awake
  twfno: [
    line('M66 156 l-12 20 M134 156 l12 20', 6),
    p('M50 52 A22 22 0 0 1 86 36 Z', c.grey), p('M150 52 A22 22 0 0 0 114 36 Z', c.grey),
    line('M100 28 V42', 5), rect(84, 22, 32, 8, 4, c.grey, ' stroke-width="2.8"'),
    circ(100, 104, 62, c.red), fill('M50 126 A56 56 0 0 0 150 126 A62 62 0 0 1 50 126Z', '#a5121a', 0.55),
    circ(100, 104, 48, c.paper), circ(100, 104, 48, 'none', ` stroke="${c.grey}" stroke-width="4"`),
    ...Array.from({ length: 12 }, (_, i) => line(`M100 60 v${i % 3 ? 4 : 9}`, 2.6, INK, ` transform="rotate(${i * 30} 100 104)"`)),
    line('M100 104 L100 70', 5), line('M100 104 L126 112', 4), circ(100, 104, 5, c.red, ' stroke-width="2.4"'),
    p('M124 70 A12 12 0 1 0 136 84 A9 9 0 1 1 124 70Z', c.lemon, ' stroke-width="2"'),
    hi('M54 80 q10 -26 40 -32 q-28 14 -34 40z', 0.7),
    line('M28 30 l-10 -6 M22 52 l-12 0 M172 30 l10 -6 M178 52 l12 0 M26 76 l-10 4 M174 76 l10 4', 4),
  ].join(''),

  // a heart patched up: two bandages crossed over the crack
  'im-sorry': [
    p(heartD(100, 104, 62), c.rose),
    `<g clip-path="url(#heart)">${fill(heartD(100, 116, 50), c.pink, 0.5)}${p('M100 52 L90 76 L108 94 L92 118 L104 140 L96 172', 'none', ' stroke-width="4"')}${line('M100 52 L90 76 L108 94 L92 118 L104 140 L96 172', 1.4, '#fff', ' opacity=".6"')}</g>`,
    p(heartD(100, 104, 62), 'none'),
    ...[-34, 34].map((r) => g(`rotate(${r} 100 108)`, rect(44, 94, 112, 30, 14, '#f3c79a') + rect(84, 97, 32, 24, 5, '#ffe7cc', ' stroke-width="2.4"') + [54, 64, 74, 126, 136, 146].map((x) => dot(x, 104, 1.8, '#c98f55') + dot(x, 114, 1.8, '#c98f55')).join('') + hi('M50 100 h30 v4 h-30z', 0.5))),
    hi('M58 70 q10 -18 30 -14 q-18 6 -24 22z', 0.8),
    p(heartD(170, 40, 8), c.pink, ' stroke-width="2.2"'), spark(30, 40, 7, '#fff'),
  ].join(''),

  // a growth ruler with marks climbing it, and the pencil that drew them
  grownup: [
    rect(66, 14, 50, 174, 6, c.lemon), fill('M104 16 h10 v170 h-10z', '#e6d24a', 0.8),
    ...Array.from({ length: 16 }, (_, i) => line(`M66 ${26 + i * 10.4} h${i % 2 ? 10 : 18}`, 2.4)),
    ...[[156, c.red], [124, c.blue], [92, c.green], [58, c.orange]].map(([y, col]) => line(`M80 ${y} h44`, 4.5, col as string) + p(`M128 ${(y as number) - 6} l10 6 l-10 6z`, col as string, ' stroke-width="2.4"')),
    g('rotate(26 152 118)', rect(142, 34, 20, 124, 3, '#ffb000') + fill('M154 36 h6 v120 h-6z', '#d48a00', 0.6) + rect(142, 30, 20, 14, 3, c.pink) + rect(142, 42, 20, 7, 0, c.grey, ' stroke-width="2.4"') + p('M142 158 L152 184 L162 158Z', c.tan) + p('M148 172 L152 184 L156 172Z', INK, ' stroke-width="1.4"')),
    hi('M70 20 h8 v160 h-8z', 0.35),
    spark(40, 36, 11, c.lemon), spark(42, 150, 6, c.pink), spark(176, 40, 7, '#fff'),
  ].join(''),

  // an old photo of the two of you, lit at the corner by a match
  revenge: [
    g('rotate(-8 90 100)', p('M26 40 H150 V164 H26Z', c.paper) + p('M38 52 H138 V136 H38Z', c.lilac) + fill('M38 112 Q88 96 138 116 V136 H38Z', c.mint, 0.6) +
      p(heartD(72, 92, 17), c.pink, ' stroke-width="2.8"') + p(heartD(106, 92, 17), c.pink, ' stroke-width="2.8"') +
      p('M150 164 V124 Q140 132 132 124 Q124 136 112 130 Q106 148 94 152 V164Z', '#3a2a22', ' stroke-width="2.4"')),
    p('M110 170 Q92 146 110 118 Q114 134 124 130 Q120 110 138 94 Q136 118 150 124 Q164 138 152 162 Q142 176 110 170Z', c.orange),
    p('M120 166 Q110 150 122 136 Q126 148 134 146 Q136 132 146 126 Q154 146 146 160 Q138 170 120 166Z', c.lemon, ' stroke-width="2.4"'),
    // the match: its red head sits in the flame, the stick runs away from it
    line('M186 192 L146 152', 10), line('M186 192 L146 152', 6, c.tan),
    ell(142, 148, 7, 9, c.red, ' transform="rotate(-45 142 148)"'), dot(140, 146, 2, '#ff8a7a'),
    line('M118 86 q-6 -10 2 -18 q8 -8 0 -16 M140 80 q-4 -10 4 -16', 3, c.steel, ' opacity=".7"'),
  ].join(''),

  // the sun out again after the rain: a rainbow from cloud to cloud
  'gonna-be-okay': [
    circ(152, 52, 24, c.lemon), ...Array.from({ length: 10 }, (_, i) => line('M152 16 v-8', 3.5, INK, ` transform="rotate(${i * 36} 152 52)"`)), hi('M138 44 q4 -10 14 -12 q-8 6 -10 14z', 0.8),
    ...[[c.red, 72], [c.orange, 62], [c.lemon, 52], [c.green, 42], [c.blue, 32]].map(([col, r]) => line(`M${100 - (r as number)} 142 A${r} ${r} 0 0 1 ${100 + (r as number)} 142`, 10.5, col as string)),
    line('M28 142 A72 72 0 0 1 172 142 M78 142 A22 22 0 0 1 122 142', 3),
    line('M34 132 A66 66 0 0 1 60 90', 2, '#fff', ' opacity=".6"'),
    p('M10 154 Q10 130 32 132 Q38 112 60 120 Q78 116 78 136 Q92 138 88 158 H18 Q8 158 10 154Z', '#fff'), fill('M14 152 Q50 146 88 152 V158 H18Z', c.lilac, 0.4),
    p('M190 154 Q192 130 168 132 Q160 112 140 122 Q122 118 122 138 Q108 140 112 158 H182 Q194 158 190 154Z', '#fff'), fill('M112 152 Q150 146 190 152 V158 H182Z', c.lilac, 0.4),
    ...[[40, 172], [62, 178], [146, 172], [168, 178]].map(([x, y]) => p(`M${x} ${y! - 6} Q${x! + 4} ${y} ${x} ${y! + 3} Q${x! - 4} ${y} ${x} ${y! - 6}Z`, c.sky, ' stroke-width="1.8"')),
  ].join(''),

  // a cactus in a terracotta pot: prickly outside, one flower on top
  'youre-so-fucking-mean-to-me': [
    p('M58 144 H142 L132 188 H68Z', '#d9763a'), fill('M68 188 L62 150 H76 L80 188Z', '#b85a24', 0.5), fill('M120 150 H140 L132 188 H124Z', '#b85a24', 0.35),
    p('M52 132 H148 V150 H52Z', '#e88a4c'),
    p('M84 134 V64 Q84 40 100 40 Q116 40 116 64 V134Z', c.green),
    p('M84 108 H66 Q54 108 54 94 V76 Q54 68 61 68 Q68 68 68 76 V94 H84', c.green),
    p('M116 96 H134 Q146 96 146 82 V64 Q146 56 139 56 Q132 56 132 64 V82 H116', c.green),
    line('M100 48 V130 M92 60 V128 M108 60 V128', 1.6, '#2c7428'),
    hi('M88 62 q0 -16 8 -18 q-4 10 -4 30z', 0.5), hi('M58 78 q0 -6 4 -6 v16z', 0.4),
    ...[[90, 70], [108, 82], [92, 96], [108, 112], [90, 124], [60, 84], [140, 70], [96, 54], [64, 98], [138, 86]].map(([x, y]) => line(`M${x} ${y} l-6 -3 M${x} ${y} l5 -5`, 2, INK)),
    ...Array.from({ length: 5 }, (_, i) => ell(100, 30, 6, 11, c.pink, ` transform="rotate(${i * 72} 100 40)" stroke-width="2.6"`)), circ(100, 40, 5, c.lemon, ' stroke-width="2.4"'),
    line('M150 30 l12 -10 M158 44 l14 -2', 3.5, c.red),
  ].join(''),

  // two tin-can phones on a string: the left can is talking, sound waves coming out of its mouth
  'we-need-to-talk': [
    p('M74 112 Q100 126 126 112', 'none', ' stroke-width="3"'), line('M74 112 Q100 126 126 112', 1.2, c.tan),
    rect(22, 88, 52, 48, 4, c.grey), ell(22, 112, 9, 24, '#e3e4ea'), ell(22, 112, 5, 18, c.steel, ' stroke-width="2"'),
    line('M38 88 V136 M56 88 V136', 2, c.steel), rect(30, 98, 36, 28, 2, c.red, ' stroke-width="2.4"'), hi('M30 92 h36 v4 h-36z', 0.6),
    rect(126, 88, 52, 48, 4, c.grey), ell(178, 112, 9, 24, '#e3e4ea'), ell(178, 112, 5, 18, c.steel, ' stroke-width="2"'),
    line('M144 88 V136 M162 88 V136', 2, c.steel), rect(134, 98, 36, 28, 2, c.blue, ' stroke-width="2.4"'), hi('M134 92 h36 v4 h-36z', 0.6),
    dot(74, 112, 3), dot(126, 112, 3),
    line('M12 92 A26 26 0 0 0 12 132 M4 80 A40 40 0 0 0 4 144', 3.5, c.orange),
    p('M96 34 h46 a10 10 0 0 1 10 10 v18 a10 10 0 0 1 -10 10 h-30 l-12 10 v-10 h-4 a10 10 0 0 1 -10 -10 v-18 a10 10 0 0 1 10 -10z', '#fff', ' stroke-width="3"'),
    dot(108, 53, 4, c.steel), dot(120, 53, 4, c.steel), dot(132, 53, 4, c.steel),
  ].join(''),

  // a fainting couch, a dropped handkerchief and a rose: the drama of missing someone
  'im-overdramatic-and-i-miss-you': [
    // one big tear, a little heart inside it: missing someone, dramatically
    p('M100 18 Q150 86 150 124 Q150 176 100 176 Q50 176 50 124 Q50 86 100 18Z', c.sky),
    fill('M62 146 Q74 172 100 172 Q132 172 144 140 Q140 160 118 168 Q92 176 72 160Z', '#5fa8d8', 0.6),
    p(heartD(100, 124, 22), c.pink, ' stroke-width="3"'), hi('M88 116 q3 -6 9 -6 q-5 3 -6 8z', 0.85),
    hi('M70 112 Q74 82 96 50 Q84 82 80 116Z', 0.85), dot(84, 136, 3.5, '#fff', 0.7),
    p('M30 158 Q30 150 36 146 Q42 150 42 158 Q42 164 36 164 Q30 164 30 158Z', c.sky, ' stroke-width="2.4"'),
    p('M160 150 Q160 140 168 134 Q176 140 176 150 Q176 158 168 158 Q160 158 160 150Z', c.sky, ' stroke-width="2.4"'),
    spark(152, 44, 10, c.lemon), spark(42, 56, 7, '#fff'), spark(174, 96, 6, c.pink),
  ].join(''),
};
