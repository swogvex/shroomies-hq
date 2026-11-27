// Song stickers · The Projects (2021–2023): Recovery, Dependency, Renewal, Gratitude and APESHIT.
import { c, p, circ, ell, rect, line, fill, hi, dot, spark, g, heartD, INK } from './kit.ts';

export const defs: Record<string, string> = {
  'party-w-out-me': `<clipPath id="hat"><path d="M58 170 L100 40 L142 170Z"/></clipPath>`,
  'nights-w-u': `<mask id="moon" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="#000"/><circle cx="100" cy="104" r="70" fill="#fff"/><circle cx="136" cy="82" r="60" fill="#000"/></mask><mask id="inside" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="#000"/><circle cx="100" cy="104" r="70" fill="#fff"/></mask>`,
  'should-i-be-ok': `<radialGradient id="ball" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#4a4c58"/><stop offset=".55" stop-color="#1b1c23"/><stop offset="1" stop-color="#050507"/></radialGradient>`,
  calone: `<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bff3ee"/><stop offset="1" stop-color="#2fb3c4"/></linearGradient>`,
};

export const art: Record<string, string> = {
  // a masquerade mask on a stick, a feather and gold trim
  pretend: [
    line('M150 112 L182 186', 8, INK), line('M150 112 L182 186', 4, c.gold),
    p('M128 60 Q150 20 160 30 Q162 52 140 72Z', c.pink), line('M136 64 Q148 44 156 34', 2, '#c2417d'),
    p('M24 82 Q30 58 62 62 Q86 66 100 80 Q114 66 138 62 Q170 58 176 82 Q178 112 150 118 Q126 120 112 104 Q100 96 88 104 Q74 120 50 118 Q22 112 24 82Z', c.purple),
    fill('M30 100 Q50 116 76 108 Q60 122 42 116Z M170 100 Q150 116 124 108 Q140 122 158 116Z', '#5a32a8', 0.6),
    p('M44 84 Q58 74 76 84 Q60 96 44 84Z', INK, ' stroke-width="2"'), p('M124 84 Q142 74 156 84 Q140 96 124 84Z', INK, ' stroke-width="2"'),
    line('M28 78 Q60 56 100 78 Q140 56 172 78', 3, c.gold),
    ...[[40, 104], [100, 90], [160, 104]].map(([x, y]) => circ(x!, y!, 4, c.gold, ' stroke-width="2"')),
    hi('M40 70 q18 -8 34 -2 q-18 0 -30 8z', 0.6),
  ].join(''),

  // an hourglass whose sand falls up, inside a rewind arrow
  'take-me-back': [
    line('M42 148 A70 70 0 1 1 158 152', 8, INK), line('M42 148 A70 70 0 1 1 158 152', 4, c.lilac),
    p('M28 132 L44 156 L58 130Z', c.lilac),
    rect(64, 34, 72, 12, 4, c.brown), rect(64, 154, 72, 12, 4, c.brown),
    p('M72 46 Q72 86 98 100 Q72 114 72 154 H128 Q128 114 102 100 Q128 86 128 46Z', 'rgba(220,240,255,.85)'),
    p('M80 54 Q82 80 100 94 Q118 80 120 54Z', c.amber, ' stroke-width="2.6"'),
    p('M88 146 Q100 134 112 146Z', c.amber, ' stroke-width="2.4"'),
    line('M100 140 V102', 2.4, c.amber), ...[[100, 124], [100, 112], [97, 132]].map(([x, y]) => dot(x!, y!, 1.8, '#c97a00')),
    hi('M78 52 q-2 30 14 44 q-14 -6 -14 -44z', 0.6),
    line('M66 46 V154 M134 46 V154', 3, c.brown),
  ].join(''),

  // a mug of cocoa with marshmallows, the steam curling into a heart
  'feel-alright': [
    p('M140 98 Q176 98 172 124 Q168 146 136 140', 'none', ' stroke-width="12"'), p('M140 98 Q176 98 172 124 Q168 146 136 140', 'none', ` stroke="${c.orange}" stroke-width="5"`),
    p('M38 84 H148 L140 160 Q138 174 124 174 H62 Q48 174 46 160Z', c.orange),
    fill('M120 88 H146 L138 160 Q136 172 124 172 H112Z', '#d93a10', 0.45),
    ell(93, 84, 55, 12, '#7a3b1a'), ...[[72, 82], [96, 78], [116, 84], [88, 88]].map(([x, y]) => rect(x! - 8, y! - 6, 16, 12, 4, '#fff', ' stroke-width="2.4"')),
    hi('M52 100 q2 34 8 56 q-10 -18 -8 -56z', 0.5),
    p(heartD(96, 36, 14), 'none', ` stroke="${c.steel}" stroke-width="3"`), line('M88 70 Q82 60 90 54 M106 70 Q112 60 104 54', 3, c.steel),
    rect(70, 116, 46, 24, 12, c.paper, ' stroke-width="2.6"'), p(heartD(93, 128, 6), c.pink, ' stroke-width="2"'),
  ].join(''),

  // a cracked eggshell, a tiny yolk heart peeking out
  vulnerable: [
    p('M44 112 Q44 176 100 178 Q156 176 156 112 L144 102 L128 116 L112 100 L96 116 L80 100 L64 116 L54 102Z', c.paper),
    fill('M120 112 L128 116 L144 102 L156 112 Q156 170 110 178 Q140 150 120 112Z', c.grey, 0.5),
    p(heartD(100, 104, 20), c.amber),
    hi('M88 96 q4 -6 10 -4 q-6 2 -8 8z', 0.8),
    g('rotate(-24 100 60)', p('M52 70 Q52 18 100 16 Q148 18 148 70 L136 80 L120 64 L104 80 L88 64 L72 80 L62 66Z', c.paper) + fill('M122 30 Q148 40 148 70 L136 80 L128 72 Q134 46 122 30Z', c.grey, 0.5)),
    hi('M58 124 q0 26 16 40 q-22 -12 -16 -40z', 0.6),
    spark(170, 150, 8, c.lemon), spark(30, 150, 6, c.pink),
  ].join(''),

  // a teddy bear wrapped in a blanket with a thermometer: homesick in bed
  homesick: [
    circ(62, 46, 16, c.brown), circ(138, 46, 16, c.brown), circ(62, 46, 8, c.tan, ' stroke-width="2.4"'), circ(138, 46, 8, c.tan, ' stroke-width="2.4"'),
    circ(100, 82, 48, c.brown),
    ell(100, 96, 22, 16, c.tan), ell(100, 88, 7, 5, INK, ' stroke-width="1"'), line('M100 93 V100 M92 104 Q100 108 108 104', 2.6),
    line('M78 72 q6 -5 12 0 M110 72 q6 -5 12 0', 3),
    g('rotate(-30 128 106)', rect(110, 102, 44, 8, 4, '#fff', ' stroke-width="2.4"') + rect(144, 102, 10, 8, 4, c.red, ' stroke-width="2.4"')),
    p('M30 120 Q100 104 170 120 L176 184 H24Z', c.lilac),
    line('M40 134 L160 134 M36 156 L164 156', 2.4, c.purple),
    ...[[54, 145], [86, 145], [118, 145], [150, 145], [70, 170], [102, 170], [134, 170]].map(([x, y]) => p(heartD(x!, y!, 5), c.pink, ' stroke-width="1.6"')),
    hi('M64 58 q10 -16 30 -14 q-18 6 -24 22z', 0.35),
  ].join(''),

  // a sleepy crescent moon in a nightcap, two stars keeping it company
  'nights-w-u': [
    // a sleepy crescent moon with a sleep mask on, stars keeping it company: a night with you
    // crescent = circle r70 at (100,104) minus circle r60 at (136,82); its thick band runs x≈31–88 at y≈118
    `<g mask="url(#moon)">${circ(100, 104, 70, c.lemon, ' stroke-width="0"')}${fill('M30 104 A70 70 0 0 0 150 154 L150 200 H0 V104Z', '#e6c43a', 0.55)}${circ(100, 104, 70, 'none', ' stroke-width="7"')}</g>`,
    `<g mask="url(#inside)">${circ(136, 82, 60, 'none', ' stroke-width="3.5"')}</g>`,
    hi('M44 92 Q48 66 66 52 Q56 72 54 96Z', 0.7),
    // the sleep mask across the eyes, inside the band
    g('translate(0 0)', p('M36 116 Q36 108 46 108 Q58 112 70 108 Q80 108 80 118 Q80 130 70 130 Q58 126 46 130 Q36 130 36 116Z', c.pink, ' stroke-width="3"') +
      fill('M38 124 Q40 130 46 130 Q58 126 70 130 Q78 130 80 122 Q76 127 70 127 Q58 123 46 127 Q40 127 38 124Z', '#e86aa6', 0.7) +
      line('M43 118 Q48 123 53 118 M62 118 Q67 123 72 118', 2.2, '#fff') + line('M44 119 l-2 3 M52 119 l2 3 M63 119 l-2 3 M71 119 l2 3', 1.4, '#fff') +
      hi('M42 112 q8 -3 16 0 q-8 0 -14 4z', 0.6)),
    dot(52, 137, 5, c.pink, 0.55),
    line('M58 144 Q64 149 70 144', 2.6),
    // Z z: asleep
    line('M114 30 h14 l-14 16 h14', 3.2, c.blue), line('M136 14 h10 l-10 11 h10', 2.6, c.blue), line('M154 2 h7 l-7 8 h7', 2.2, c.blue),
    spark(150, 108, 12, c.lemon), spark(176, 64, 8, '#fff'), spark(30, 34, 7, c.lemon), spark(176, 168, 6, '#fff'),
  ].join(''),

  // a phone with the typing dots and an unread badge: who texts first?
  'if-i-dont-text-you-first': [
    rect(48, 20, 92, 164, 18, c.dark), rect(56, 34, 76, 136, 10, '#e9ecff', ' stroke-width="2.6"'), rect(82, 26, 24, 5, 2.5, INK, ' stroke-width="1"'),
    p('M66 64 h44 a8 8 0 0 1 8 8 v12 a8 8 0 0 1 -8 8 h-36 l-8 8 v-8 a8 8 0 0 1 -8 -8 v-12 a8 8 0 0 1 8 -8z', c.lilac, ' stroke-width="2.6"'),
    p('M76 108 h44 a8 8 0 0 1 8 8 v10 a8 8 0 0 1 -8 8 h-44 a8 8 0 0 1 -8 -8 v-10 a8 8 0 0 1 8 -8z', '#fff', ' stroke-width="2.6"'),
    dot(86, 121, 4, c.steel), dot(98, 121, 4, c.steel), dot(110, 121, 4, c.steel),
    circ(140, 28, 16, c.red), dot(140, 28, 5, '#fff'),
    hi('M60 40 q2 -4 8 -4 h6 q-10 2 -12 14z', 0.6),
    line('M160 70 q10 10 0 20 M170 62 q18 18 0 36', 3.5, c.blue),
  ].join(''),

  // a friendship bracelet of beads, knotted, with a heart charm
  hanna: [
    line('M150 150 q16 14 10 30 M150 150 q22 4 28 20', 3, c.purple),
    ell(100, 96, 62, 56, 'none', ' stroke-width="6"'), ell(100, 96, 62, 56, 'none', ` stroke="${c.purple}" stroke-width="2.6"`),
    ...Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 - Math.PI / 2;
      const x = 100 + Math.cos(a) * 62, y = 96 + Math.sin(a) * 56;
      const col = [c.pink, c.lemon, c.sky, c.mint, c.lilac, c.orange, '#fff'][i % 7]!;
      return i % 3 === 0 ? rect(x - 9, y - 9, 18, 18, 4, col, ' stroke-width="2.6"') : circ(x, y, 9.5, col, ' stroke-width="2.6"');
    }),
    line('M100 152 V162', 3), p(heartD(100, 176, 14), c.red), hi('M92 172 q2 -5 7 -6 q-4 3 -5 8z', 0.8),
    spark(100, 96, 10, c.lemon), spark(80, 78, 5, '#fff'),
  ].join(''),

  // a perfume bottle holding a sea breeze, with a shell
  calone: [
    rect(84, 24, 32, 24, 6, c.gold), fill('M104 26 h10 v20 h-10z', '#d9a21a', 0.6), rect(90, 46, 20, 12, 2, c.grey),
    p('M50 72 Q50 58 64 58 H136 Q150 58 150 72 V160 Q150 178 132 178 H68 Q50 178 50 160Z', 'url(#sea)'),
    p('M50 120 Q66 108 82 120 Q100 132 116 120 Q134 108 150 120 V160 Q150 178 132 178 H68 Q50 178 50 160Z', c.aqua, ' stroke-width="2.6"'),
    line('M56 140 Q70 132 84 140 Q100 148 114 140 Q130 132 144 140', 2.4, '#fff'),
    hi('M60 72 q0 -6 8 -6 h10 q-12 4 -12 40 q-6 -10 -6 -34z', 0.75),
    ...[[30, 50, 8], [22, 72, 5], [36, 86, 4]].map(([x, y, r]) => circ(x!, y!, r!, '#e3f7ff', ' stroke-width="2"')),
    p('M150 168 Q154 142 172 140 Q192 144 186 168Z', c.rose, ' stroke-width="3"'), line('M156 166 L164 146 M166 166 L172 144 M176 166 L180 148', 2, '#e86aa6'),
  ].join(''),

  // a donut with sprinkles and a bite taken out of it
  'bad-habits': [
    p('M100 26 A74 74 0 1 1 99.9 26Z', c.tan),
    fill('M40 128 A74 74 0 0 0 172 116 A70 70 0 0 1 40 128Z', '#c98f55', 0.6),
    p('M100 40 Q148 38 162 84 Q168 120 142 140 Q122 132 108 146 Q92 158 70 146 Q40 140 38 106 Q38 54 100 40Z', c.pink),
    circ(100, 100, 18, '#ededea'),
    p('M142 34 Q132 44 142 54 Q132 62 142 72 Q156 72 166 60 Q170 46 160 36 Q152 30 142 34Z', '#ededea', ' stroke-width="0"'),
    line('M142 34 Q132 44 142 54 Q132 62 142 72', 3.5),
    ...[[70, 66, 20, c.lemon], [86, 54, -30, '#fff'], [120, 60, 40, c.blue], [60, 92, -10, c.mint], [126, 90, 70, c.lemon], [80, 128, 30, c.blue], [112, 128, -40, '#fff'], [142, 110, 10, c.mint], [96, 74, 80, c.orange]].map(
      ([x, y, r, col]) => rect((x as number) - 6, (y as number) - 2.5, 12, 5, 2.5, col as string, ` stroke-width="1.8" transform="rotate(${r} ${x} ${y})"`),
    ),
    hi('M56 70 q10 -20 34 -24 q-22 10 -28 30z', 0.6),
  ].join(''),

  // a jewelled tiara on a velvet cushion
  'spoiled-bitch': [
    p('M22 140 Q20 118 48 116 H152 Q180 118 178 140 Q180 166 152 168 H48 Q20 166 22 140Z', c.red),
    fill('M24 150 Q60 162 100 160 Q140 162 176 150 Q176 166 152 168 H48 Q24 166 24 150Z', '#a5121a', 0.6),
    ...[[22, 140], [178, 140]].map(([x, y]) => line(`M${x} ${y} l${x! < 100 ? -10 : 10} 14`, 3) + circ(x! < 100 ? 10 : 190, 158, 6, c.gold, ' stroke-width="2.4"')),
    p('M40 120 L50 64 L76 92 L100 44 L124 92 L150 64 L160 120 Q100 108 40 120Z', c.gold),
    fill('M100 44 L124 92 L150 64 L160 120 Q130 112 108 112Z', '#e0a518', 0.5),
    ...[[50, 64, 7, c.pink], [150, 64, 7, c.pink], [100, 44, 9, c.sky]].map(([x, y, r, col]) => circ(x as number, y as number, r as number, col as string, ' stroke-width="2.6"')),
    p('M90 98 L100 82 L110 98 L100 110Z', c.sky, ' stroke-width="2.6"'), ...[[70, 104], [130, 104]].map(([x, y]) => p(`M${x! - 6} ${y} L${x} ${y! - 8} L${x! + 6} ${y} L${x} ${y! + 6}Z`, c.pink, ' stroke-width="2"')),
    hi('M96 88 l4 -6 v12z', 0.9), hi('M44 130 q20 -8 50 -8 q-28 4 -46 14z', 0.3),
    spark(172, 40, 9, c.lemon), spark(30, 50, 7, '#fff'),
  ].join(''),

  // a dropped plate in three pieces, blue willow rim, chips flying
  'broken-plates': [
    // one plate, broken in three: the shards share the same crack, the rim pattern continues across them
    g('translate(-6 -4) rotate(-6 100 100)', p('M100 34 A66 66 0 0 1 166 100 L118 104 L110 70 L100 34Z', '#fff') + line('M100 48 A52 52 0 0 1 152 100', 5, c.blue) + line('M100 60 A40 40 0 0 1 140 100', 1.8, c.blue, ' stroke-dasharray="4 4"') + hi('M110 42 q30 6 46 34 q-22 -20 -46 -26z', 0.6)),
    g('translate(8 8) rotate(4 100 100)', p('M166 100 A66 66 0 0 1 64 156 L92 122 L118 104Z', '#fff') + line('M152 100 A52 52 0 0 1 72 146', 5, c.blue) + line('M140 100 A40 40 0 0 1 80 136', 1.8, c.blue, ' stroke-dasharray="4 4"')),
    g('translate(-10 6) rotate(-3 100 100)', p('M64 156 A66 66 0 0 1 100 34 L110 70 L84 96 L92 122Z', '#fff') + line('M72 146 A52 52 0 0 1 100 48', 5, c.blue) + line('M80 136 A40 40 0 0 1 100 60', 1.8, c.blue, ' stroke-dasharray="4 4"') + fill('M70 150 A58 58 0 0 1 48 96 L60 98 A46 46 0 0 0 76 140Z', c.grey, 0.4)),
    p('M150 40 l12 -4 l-2 10z', '#fff', ' stroke-width="2.4"'), line('M156 34 l2 -2', 3, c.blue),
    p('M178 140 l10 4 l-8 8z', '#fff', ' stroke-width="2.4"'), p('M22 70 l-8 -6 l12 -2z', '#fff', ' stroke-width="2.4"'),
    line('M176 58 l10 -8 M184 116 l12 2 M28 140 l-10 6 M40 40 l-8 -8', 3.5),
  ].join(''),

  // a pair of wind-up chattering teeth
  'bite-back': [
    // a pink snake coiled and rising, fangs out: hurt it and it bites back
    p('M40 170 Q30 150 52 142 Q80 134 120 146 Q156 158 160 140 Q162 124 140 120 Q110 116 84 120 Q60 122 62 108 Q64 94 90 96 Q120 98 130 82', 'none', ' stroke-width="26"'),
    p('M40 170 Q30 150 52 142 Q80 134 120 146 Q156 158 160 140 Q162 124 140 120 Q110 116 84 120 Q60 122 62 108 Q64 94 90 96 Q120 98 130 82', 'none', ` stroke="${c.pink}" stroke-width="19"`),
    line('M44 162 Q40 150 56 146 M90 140 Q110 142 124 150 M146 126 Q156 130 154 140 M70 112 Q68 102 84 100', 2.6, '#c2417d', ' stroke-dasharray="3 6"'),
    line('M36 172 Q30 176 22 172', 5, INK), line('M36 172 Q30 176 22 172', 2, c.pink),
    p('M112 88 Q110 56 138 46 Q166 40 176 62 Q182 82 160 92 Q138 100 112 88Z', c.pink),
    fill('M116 86 Q140 96 162 90 Q174 84 176 74 Q170 96 140 98 Q122 96 116 86Z', '#e86aa6', 0.7),
    p('M126 78 Q146 88 172 72', 'none', ' stroke-width="3"'),
    p('M136 82 L140 96 L145 83Z', '#fff', ' stroke-width="2.2"'), p('M156 80 L159 93 L163 79Z', '#fff', ' stroke-width="2.2"'),
    ell(146, 58, 7, 8, '#fff', ' stroke-width="2.6"'), dot(148, 59, 3.6), dot(149, 57, 1.2, '#fff'),
    line('M138 46 l-4 -8 M152 44 l2 -8', 2.6, c.red),
    line('M176 70 q10 2 14 -4 M190 66 l6 -6 M190 66 l6 4', 2.6, c.red),
    hi('M122 66 q6 -14 20 -18 q-12 8 -14 20z', 0.6),
    line('M168 30 l8 -8 M180 44 l10 -4 M156 22 l2 -10', 3.5),
  ].join(''),

  // a "for sale" yard sign with a house on it and the key on a tag
  'zillow-houses-for-sale': [
    p('M18 178 Q40 166 60 172 Q100 162 140 172 Q160 166 182 178Z', c.green),
    line('M54 176 V40 M54 52 H160', 6, c.brown),
    line('M76 52 V64 M140 52 V64', 2.4),
    rect(64, 64, 88, 66, 6, c.red), rect(70, 70, 76, 54, 3, 'none', ' stroke="#fff" stroke-width="2"'),
    p('M84 108 V92 L108 74 L132 92 V108Z', '#fff', ' stroke-width="2.6"'), rect(102, 94, 12, 14, 1, c.red, ' stroke-width="2"'),
    line('M150 130 L162 146', 2.4), circ(164, 150, 7, 'none', ' stroke-width="3"'),
    g('rotate(30 172 160)', rect(170, 156, 24, 7, 2, c.gold, ' stroke-width="2.4"') + rect(186, 163, 4, 6, 1, c.gold, ' stroke-width="2"')),
    hi('M70 70 h20 l-20 14z', 0.3),
  ].join(''),

  // a fluffy cloud with a little wooden ladder up to it
  clouds: [
    line('M58 186 L92 106 M90 190 L118 112', 5, c.brown), ...[0, 1, 2, 3, 4].map((i) => line(`M${64 + i * 6.8} ${172 - i * 16} L${96 + i * 5.6} ${176 - i * 16}`, 4, c.tan)),
    p('M30 104 Q14 104 16 86 Q18 68 40 70 Q40 40 72 42 Q86 20 112 30 Q138 22 148 50 Q176 46 180 72 Q190 98 164 106Z', '#fff'),
    fill('M30 104 Q100 118 164 106 Q178 100 180 86 Q160 104 100 104 Q50 104 30 92Z', c.lilac, 0.45),
    hi('M44 64 q6 -16 22 -16 q-16 6 -18 20z', 0.8),
    spark(160, 140, 9, c.lemon), spark(30, 140, 6, c.lemon), spark(130, 160, 5, '#fff'),
  ].join(''),

  // a cable car climbing a steep San Francisco street
  'san-francisco-sidewalk': [
    line('M14 170 L186 104', 4), line('M14 182 L186 116', 4),
    line('M100 16 L120 46', 2.6), line('M60 10 L186 10', 2.4, c.steel),
    g('rotate(-21 100 110)', rect(46, 64, 108, 74, 8, c.red) + rect(40, 56, 120, 12, 5, c.cream) + rect(52, 74, 96, 26, 3, c.sky, ' stroke-width="2.6"') + line('M76 74 V100 M100 74 V100 M124 74 V100', 2.6) + rect(52, 108, 96, 8, 2, c.gold, ' stroke-width="2.4"') + circ(70, 140, 9, c.dark) + circ(130, 140, 9, c.dark) + hi('M54 78 h12 l-12 16z', 0.6)),
  ].join(''),

  // a magic 8-ball, the blue window still deciding
  'should-i-be-ok': [
    circ(100, 100, 74, 'url(#ball)'),
    circ(100, 100, 32, '#101116', ' stroke-width="3"'),
    p('M100 80 L120 114 H80Z', c.blue, ' stroke-width="2.6"'), fill('M100 86 L114 110 H86Z', '#4a5bff'),
    line('M96 104 q0 -6 4 -6 q4 0 4 4 q0 3 -4 5', 2.4, '#fff'), dot(100, 110, 1.4, '#fff'),
    hi('M52 62 q16 -28 50 -32 q-30 12 -42 38z', 0.55), hi('M140 146 q10 -8 14 -18 q-2 14 -12 22z', 0.25),
    spark(170, 36, 10, c.lilac), spark(30, 160, 7, '#fff'),
  ].join(''),

  // a party hat on its own, confetti, and a balloon gone limp
  'party-w-out-me': [
    // the party went on without you: a party hat left behind, confetti still falling, a streamer
    g('rotate(-12 100 112)', p('M58 170 L100 40 L142 170Z', c.pink) +
      `<g clip-path="url(#hat)">${fill('M30 136 L150 108 L156 126 L36 154Z', c.lemon)}${fill('M50 96 L130 78 L134 92 L54 110Z', c.blue)}${fill('M70 62 L120 50 L122 60 L72 72Z', c.lemon)}</g>` +
      p('M58 170 L100 40 L142 170Z', 'none') + ell(100, 170, 42, 9, c.paper, ' stroke-width="2.8"') +
      circ(100, 36, 11, c.lemon) + line('M93 29 l-4 -7 M107 29 l4 -7 M100 25 v-9', 2.6) + hi('M88 74 l8 -24 l2 50z', 0.4)),
    line('M150 60 q12 -10 18 2 q6 12 18 2', 3.2, c.blue), line('M26 92 q-6 12 6 18 q12 6 2 18', 3.2, c.orange),
    ...[[160, 112, c.lemon, 20], [176, 140, c.blue, -30], [140, 30, c.orange, 50], [36, 50, c.mint, -20], [22, 150, c.orange, 40], [162, 170, c.mint, 10], [58, 20, c.pink, 60], [42, 182, c.blue, -40], [184, 92, c.pink, 30]].map(([x, y, col, r]) => rect((x as number) - 6, (y as number) - 3, 12, 6, 1.5, col as string, ` stroke-width="1.8" transform="rotate(${r} ${x} ${y})"`)),
    ...[[30, 120], [150, 186], [176, 40], [70, 186]].map(([x, y]) => circ(x!, y!, 3.5, c.pink, ' stroke-width="1.6"')),
  ].join(''),

  // a striped hot-air balloon going up past the clouds
  'dreams-abt-optimism': [
    p('M100 20 Q154 20 156 72 Q156 108 114 140 H86 Q44 108 44 72 Q46 20 100 20Z', c.lemon),
    p('M100 20 Q78 22 74 72 Q74 108 90 140 H110 Q126 108 126 72 Q122 22 100 20Z', c.pink),
    p('M100 20 Q94 30 94 72 Q94 108 98 140 H102 Q106 108 106 72 Q106 30 100 20Z', c.blue, ' stroke-width="2.4"'),
    hi('M58 52 q10 -24 30 -28 q-18 14 -22 40z', 0.6),
    line('M88 140 L86 156 M112 140 L114 156', 2.6),
    rect(80, 154, 40, 26, 4, c.tan), line('M82 162 H118 M82 170 H118 M92 156 V178 M108 156 V178', 1.8, c.brown),
    p('M14 120 Q14 108 26 110 Q30 98 44 104 Q56 104 54 118 Q54 126 44 126 H22 Q14 126 14 120Z', '#fff', ' stroke-width="3"'),
    p('M150 162 Q150 150 162 152 Q166 140 180 146 Q192 146 190 160 Q190 168 180 168 H158 Q150 168 150 162Z', '#fff', ' stroke-width="3"'),
    spark(172, 40, 8, c.lemon),
  ].join(''),

  // an old-school tattoo flash: heart, banner and swallow-tail ribbon
  'heart-to-heart-in-the-tattoo-parlor': [
    p(heartD(100, 92, 62), c.red),
    fill(heartD(108, 100, 46), '#b8141c', 0.35),
    hi('M60 64 q10 -18 28 -14 q-16 6 -22 22z', 0.75),
    p('M22 98 L40 90 L42 104 L22 112 L30 104Z', c.cream, ' stroke-width="3"'), p('M178 98 L160 90 L158 104 L178 112 L170 104Z', c.cream, ' stroke-width="3"'),
    p('M36 86 Q100 104 164 86 L166 108 Q100 128 34 108Z', c.cream),
    line('M48 98 Q100 114 152 98', 2.4, '#c9b29c'),
    p('M58 44 q-10 -16 6 -22 q8 12 -6 22z', c.green, ' stroke-width="2.6"'), p('M142 44 q10 -16 -6 -22 q-8 12 6 22z', c.green, ' stroke-width="2.6"'),
    spark(100, 30, 9, c.lemon), spark(30, 150, 7, c.lemon), spark(170, 150, 7, c.lemon),
    ...[[80, 152], [120, 152]].map(([x, y]) => dot(x!, y!, 3)),
  ].join(''),

  // the wind-up monkey with his cymbals, mid-crash
  apeshit: [
    rect(76, 150, 18, 24, 6, c.brown), rect(106, 150, 18, 24, 6, c.brown),
    p('M66 104 Q66 80 100 80 Q134 80 134 104 V154 H66Z', c.red), fill('M110 82 Q134 84 134 104 V154 H118Z', '#a5121a', 0.5),
    line('M82 112 H118', 2.4, c.gold), ...[96, 104].map((x) => circ(100, x + 24, 3, c.gold, ' stroke-width="1.6"')),
    circ(66, 56, 13, c.brown), circ(134, 56, 13, c.brown), circ(66, 56, 6, c.tan, ' stroke-width="2"'), circ(134, 56, 6, c.tan, ' stroke-width="2"'),
    circ(100, 60, 30, c.brown), ell(100, 68, 20, 16, c.tan),
    dot(90, 56, 3.6), dot(110, 56, 3.6), dot(91, 55, 1.2, '#fff'), dot(111, 55, 1.2, '#fff'), p('M88 72 Q100 84 112 72Z', '#fff', ' stroke-width="2.4"'),
    rect(84, 26, 32, 10, 3, c.red, ' stroke-width="2.6"'), line('M100 26 V18', 2.6), dot(100, 16, 4, c.gold),
    line('M68 100 L34 82 M132 100 L166 82', 9, INK), line('M68 100 L34 82 M132 100 L166 82', 5, c.brown),
    ell(30, 76, 22, 8, c.gold, ' transform="rotate(-60 30 76)"'), ell(170, 76, 22, 8, c.gold, ' transform="rotate(60 170 76)"'),
    line('M12 46 l-8 -6 M8 66 l-8 0 M188 46 l8 -6 M192 66 l8 0', 3.5),
    line('M134 130 H150', 4), rect(148, 116, 7, 28, 3, c.gold, ' stroke-width="2.4"'),
  ].join(''),
};
