// Song stickers · LOVER TOFU FRUIT (2024).
import { c, p, circ, ell, rect, line, fill, hi, dot, spark, g, heartD, INK } from './kit.ts';

export const defs: Record<string, string> = {
  'far-away': `<linearGradient id="glass" x1="0" x2="1"><stop offset="0" stop-color="#7fd39a"/><stop offset=".5" stop-color="#b9f0c8"/><stop offset="1" stop-color="#4fae6c"/></linearGradient>`,
};

export const art: Record<string, string> = {
  // a ferris wheel turning, every cabin a different colour
  'always-fun': [
    line('M100 100 L60 186 M100 100 L140 186', 7), line('M100 100 L60 186 M100 100 L140 186', 3, c.grey),
    line('M48 186 H152', 5),
    circ(100, 100, 70, 'none', ' stroke-width="7"'), circ(100, 100, 70, 'none', ` stroke="${c.pink}" stroke-width="3.5"`),
    circ(100, 100, 50, 'none', ' stroke-width="2.4"'),
    ...Array.from({ length: 8 }, (_, i) => line('M100 100 L100 30', 2.4, INK, ` transform="rotate(${i * 45} 100 100)"`)),
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4, x = 100 + Math.sin(a) * 70, y = 100 - Math.cos(a) * 70;
      return line(`M${x} ${y} v6`, 2.4) + rect(x - 10, y + 5, 20, 16, 5, [c.lemon, c.sky, c.orange, c.mint, c.lilac, c.red, c.pink, c.blue][i]!, ' stroke-width="2.6"');
    }),
    circ(100, 100, 10, c.lemon, ' stroke-width="3"'),
    spark(178, 30, 8, c.lemon), spark(24, 40, 6, '#fff'),
  ].join(''),

  // the four-colour memory game, the green pad lit
  'simon-said': [
    circ(100, 100, 78, c.dark),
    p('M96 30 A70 70 0 0 0 30 96 H70 A30 30 0 0 1 96 70Z', '#7dff7a'),
    p('M104 30 A70 70 0 0 1 170 96 H130 A30 30 0 0 0 104 70Z', c.red),
    p('M30 104 A70 70 0 0 0 96 170 V130 A30 30 0 0 1 70 104Z', c.lemon),
    p('M170 104 A70 70 0 0 1 104 170 V130 A30 30 0 0 0 130 104Z', c.blue),
    fill('M96 30 A70 70 0 0 0 30 96 H70 A30 30 0 0 1 96 70Z', '#fff', 0.35),
    circ(100, 100, 28, '#1b1c23'), circ(100, 100, 16, c.grey, ' stroke-width="2.6"'),
    ...[[94, 94], [106, 94], [100, 106]].map(([x, y]) => dot(x!, y!, 3, c.dark)),
    hi('M44 70 q10 -20 30 -30 q-14 16 -20 34z', 0.8),
    line('M24 24 l12 12 M14 52 l14 4 M52 14 l4 14', 3.5, c.lcd),
  ].join(''),

  // a message in a bottle, bobbing on the waves under a far moon
  'far-away': [
    // a folded map: you here, them over there, a long dotted road between two pins
    p('M14 54 L68 36 L132 56 L186 38 V150 L132 168 L68 148 L14 166Z', '#f6efd9'),
    fill('M68 36 L132 56 V168 L68 148Z', '#e9dfc0'), line('M68 36 V148 M132 56 V168', 2.4),
    fill('M24 120 Q44 104 60 116 Q58 136 34 140Z', c.mint, 0.9), fill('M140 70 Q168 60 178 80 Q170 100 146 94Z', c.mint, 0.9),
    fill('M76 120 Q100 110 124 126 L124 150 Q100 142 76 140Z', c.sky, 0.8),
    line('M40 134 C70 120 70 80 100 90 C130 100 130 64 160 66', 3.5, c.red, ' stroke-dasharray="2 8"'),
    p('M40 140 C30 124 28 108 40 104 C52 108 50 124 40 140Z', c.blue), circ(40, 114, 4.5, '#fff', ' stroke-width="2"'),
    p('M160 72 C150 56 148 40 160 36 C172 40 170 56 160 72Z', c.red), p(heartD(160, 48, 5), '#fff', ' stroke-width="1.6"'),
    hi('M20 60 L64 46 V60 L20 74Z', 0.4),
    spark(184, 20, 8, c.lemon), spark(22, 30, 6, '#fff'),
  ].join(''),

  // a high-top sneaker at full sprint, dust behind
  'what-am-i-running-from': [
    p('M56 50 L98 44 Q106 80 120 96 Q166 104 174 128 Q178 146 160 148 H52 Q44 148 46 136Z', c.lilac),
    p('M44 136 H176 Q178 158 160 160 H48 Q40 158 44 136Z', '#fff'), line('M44 148 H178', 2.4, c.grey),
    fill('M100 90 Q130 100 140 104 L132 130 Q110 116 100 90Z', '#fff', 0.8),
    line('M66 70 L92 66 M68 84 L96 80 M72 98 L102 94 M78 112 L110 108', 3.2, '#fff'), line('M66 70 L92 66 M68 84 L96 80 M72 98 L102 94 M78 112 L110 108', 1.4, INK),
    circ(64, 128, 12, c.pink, ' stroke-width="2.8"'), p('M60 124 l4 4 l6 -6', 'none', ' stroke-width="2.4"'),
    p('M56 50 L98 44 L100 56 L58 62Z', c.pink, ' stroke-width="2.6"'),
    hi('M60 64 q10 40 6 66 q-12 -30 -6 -66z', 0.4),
    p('M8 148 Q4 134 18 134 Q22 122 36 128 Q46 130 42 144 Q46 156 32 156 H16 Q6 156 8 148Z', '#ece6dc', ' stroke-width="2.6"'),
    line('M10 70 H40 M4 92 H34 M14 114 H36', 4),
  ].join(''),

  // a jack-in-the-box: the joke is a boxing glove on a spring
  'what-a-joke': [
    // a jack-in-the-box: the lid flipped open on its hinge, the joke is a boxing glove on a spring
    p('M40 112 H140 V180 H40Z', c.red), p('M140 112 L164 96 V164 L140 180Z', '#a5121a'),
    p('M84 128 l6 12 h13 l-10 8 l4 13 l-13 -8 l-13 8 l4 -13 l-10 -8 h13z', c.lemon, ' stroke-width="2.4"'),
    line('M150 130 l8 -4 M150 150 l8 -4', 2.4, c.gold),
    p('M40 112 L64 96 H164 L140 112Z', '#5a0c10'),
    // the lid is hinged on the back edge (64,96)-(164,96) and stands open behind the box
    p('M64 96 L52 40 H152 L164 96Z', '#ff6a52'), fill('M64 96 L58 66 H158 L164 96Z', '#e04a34', 0.6), line('M64 96 H164', 3),
    p('M90 70 l4 8 h9 l-7 6 l3 9 l-9 -6 l-9 6 l3 -9 l-7 -6 h9z', c.lemon, ' stroke-width="2"'),
    line('M104 104 q-14 -8 0 -14 q14 -6 0 -14 q-14 -8 0 -14 q14 -6 0 -14', 5, INK), line('M104 104 q-14 -8 0 -14 q14 -6 0 -14 q-14 -8 0 -14 q14 -6 0 -14', 2.4, c.grey),
    p('M86 34 Q86 10 110 10 Q136 10 136 34 Q136 54 112 56 Q100 56 96 50 Q84 50 86 40Z', c.red), p('M86 40 Q76 36 80 26 Q86 20 94 26', c.red, ' stroke-width="3"'),
    line('M98 50 V56 H120 V52', 3), hi('M100 18 q12 -6 24 4 q-14 -2 -22 6z', 0.7),
    line('M150 22 l10 -8 M158 40 l12 -2 M64 20 l-8 -8', 3.5),
  ].join(''),

  // a college pennant on a stick, with a star
  loyola: [
    line('M34 26 V186', 7), line('M34 26 V186', 3, c.tan), circ(34, 24, 7, c.gold, ' stroke-width="2.6"'),
    p('M38 34 L184 82 L38 130Z', '#9a1b30'), fill('M38 34 L184 82 L38 52Z', '#c42a44', 0.6),
    p('M38 112 L130 100 L184 82 L38 130Z', c.blue, ' stroke-width="2.6"'),
    p('M74 70 l7 14 h15 l-12 9 l5 15 l-15 -9 l-15 9 l5 -15 l-12 -9 h15z', c.lemon, ' stroke-width="2.4"'),
    line('M112 68 H150 M112 80 H160', 3, '#fff', ' opacity=".7"'),
    hi('M42 40 l40 14 l-40 0z', 0.35),
    spark(170, 150, 8, c.lemon),
  ].join(''),

  // a heart-shaped box of chocolates, lid off
  'hella-boy-crazy': [
    g('rotate(-14 140 60)', p(heartD(144, 64, 34), c.pink) + p('M118 50 Q144 70 170 50', 'none', ' stroke-width="2.4"') + p('M136 40 q8 10 16 0 q-8 16 -16 0z', c.red, ' stroke-width="2.4"')),
    p(heartD(86, 116, 62), c.red), p(heartD(86, 116, 48), '#7a1f1f', ' stroke-width="2.6"'),
    ...[[64, 98, c.brown], [108, 98, '#5a2d12'], [86, 124, c.brown], [66, 136, '#5a2d12'], [106, 136, c.cream], [86, 96, c.pink]].map(([x, y, col]) => circ(x as number, y as number, 11, col as string, ' stroke-width="2.6"') + hi(`M${(x as number) - 6} ${(y as number) - 3} q2 -5 7 -5 q-4 2 -5 6z`, 0.6)),
    line('M58 120 q4 -4 8 0 M98 140 q4 -4 8 0', 1.8, c.cream),
    hi('M44 82 q8 -20 30 -18 q-18 6 -24 22z', 0.6),
    p(heartD(170, 150, 9), c.pink, ' stroke-width="2.4"'), p(heartD(26, 50, 7), c.pink, ' stroke-width="2.4"'),
  ].join(''),

  // a sunflower from the fields back home
  kansas: [
    line('M100 120 Q96 160 104 190', 7), line('M100 120 Q96 160 104 190', 3.5, c.green),
    p('M100 160 Q70 150 58 128 Q86 128 100 150Z', c.green), p('M104 174 Q132 168 146 146 Q118 144 104 166Z', c.green),
    line('M66 132 Q84 142 98 152 M140 150 Q122 160 106 168', 1.8, '#2c7428'),
    ...Array.from({ length: 14 }, (_, i) => ell(100, 30, 11, 24, i % 2 ? c.amber : c.lemon, ` transform="rotate(${i * (360 / 14)} 100 76)"`)),
    circ(100, 76, 30, '#7a3b1a'), circ(100, 76, 22, '#5a2d12', ' stroke-width="2"'),
    ...Array.from({ length: 12 }, (_, i) => dot(100 + Math.cos(i * 0.52) * (i % 2 ? 14 : 8), 76 + Math.sin(i * 0.52) * (i % 2 ? 14 : 8), 2, '#c98f55')),
    hi('M84 64 q6 -8 16 -8 q-10 4 -12 12z', 0.4),
  ].join(''),

  // two puzzle pieces that fit, pink and blue
  together: [
    g('rotate(-10 80 100)', p('M30 60 H70 Q66 46 78 44 Q92 44 88 60 H112 V84 Q126 80 126 94 Q126 108 112 104 V140 H30Z', c.pink) + hi('M36 66 h24 q-20 4 -20 24z', 0.5)),
    g('rotate(-10 120 110) translate(10 6)', p('M112 84 Q126 80 126 94 Q126 108 112 104 V70 H170 V150 H112 V128 Q98 132 98 118 Q98 104 112 108Z', c.sky) + hi('M118 76 h40 q-34 4 -36 20z', 0.5)),
    p(heartD(100, 168, 10), c.red, ' stroke-width="2.6"'),
    spark(40, 30, 8, c.lemon), spark(172, 40, 9, c.lemon), spark(178, 168, 6, '#fff'),
  ].join(''),

  // a block of tofu wearing a strawberry, chopsticks ready
  'lover-tofu-fruit': [
    line('M120 30 L186 116 M108 34 L178 124', 6), line('M120 30 L186 116 M108 34 L178 124', 2.6, c.tan),
    p('M40 104 L100 82 L160 104 L100 126Z', '#fffaf0'), p('M40 104 L100 126 V180 L40 158Z', c.cream), p('M160 104 L100 126 V180 L160 158Z', '#e8dccb'),
    hi('M50 104 l50 -18 l-20 16z', 0.8),
    ...[[64, 140], [80, 150], [124, 146], [140, 136]].map(([x, y]) => dot(x!, y!, 2, '#d6c6b0')),
    p('M100 58 Q120 60 122 80 Q120 104 100 110 Q80 104 78 80 Q80 60 100 58Z', c.red),
    p('M88 60 L100 50 L112 60 L106 62 L100 56 L94 62Z', c.green, ' stroke-width="2.4"'),
    ...[[92, 74], [106, 72], [98, 86], [110, 90], [88, 94]].map(([x, y]) => ell(x!, y!, 1.7, 2.7, c.lemon, ' stroke-width="0"')),
    hi('M86 70 q2 -8 8 -10 q-4 6 -4 14z', 0.8),
    p(heartD(52, 64, 9), c.pink, ' stroke-width="2.4"'),
    line('M62 128 q4 4 8 0 M126 128 q4 4 8 0', 2.4), dot(66, 120, 2.6), dot(130, 120, 2.6),
  ].join(''),
};
