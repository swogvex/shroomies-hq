// The aura card (25-spec, "Share"): drawn in the browser on a <canvas>, never uploaded. It shows the era, the song,
// the aura polaroid, the fan line and the address: no answers, no names. Wide 1200×630 and story 1080×1350.
export type CardFormat = 'wide' | 'story';
type Era = { name: string; years: string; tag: string } | null;
type Card = { era: Era; aura: string; song: string; caption: string; s: Record<string, string> };

// the same pairs as the page (Aura.astro, [data-aura-skin])
const skins: Record<string, [string, string, string]> = {
  'first-singles': ['#9aa6ff', '#ffd6ea', '#241f4a'],
  projects: ['#ff4a1c', '#ffb347', '#3a1208'],
  ltf: ['#3f9a3a', '#ff8fc7', '#0f2618'],
  halo: ['#2335f0', '#ffffff', '#070a2a'],
  solo: ['#f4f4f7', '#c9cbd6', '#2a2c36'],
};
const INK = '#121216';
const PAPER = '#ededea';
const LCD = ['#c7f26a', '#a9dc45', '#1d2a08'];

const images = new Map<string, Promise<HTMLImageElement>>();
const image = (src: string) => {
  if (!images.has(src)) {
    images.set(src, new Promise((ok, fail) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = fail;
      img.src = src;
    }));
  }
  return images.get(src)!;
};

const display = (ctx: CanvasRenderingContext2D, px: number) => {
  ctx.font = `900 ${px}px Anybody, sans-serif`;
  if ('fontStretch' in ctx) ctx.fontStretch = 'extra-expanded'; // 150 %, like the page titles
};
const plain = (ctx: CanvasRenderingContext2D, font: string) => {
  ctx.font = font;
  if ('fontStretch' in ctx) ctx.fontStretch = 'normal';
};

/** Words into at most `lines` lines that fit `width`, shrinking the size until they do. */
function fit(ctx: CanvasRenderingContext2D, text: string, width: number, lines: number, from: number, to: number) {
  const words = text.toUpperCase().split(/\s+/);
  for (let px = from; px >= to; px -= 2) {
    display(ctx, px);
    const out: string[] = [];
    for (const w of words) {
      const line = out.length ? `${out.at(-1)} ${w}` : w;
      if (out.length && ctx.measureText(line).width <= width) out[out.length - 1] = line;
      else out.push(w);
    }
    if (out.length <= lines && out.every((l) => ctx.measureText(l).width <= width)) return { px, out };
  }
  display(ctx, to);
  return { px: to, out: words.length > lines ? [...words.slice(0, lines - 1), words.slice(lines - 1).join(' ')] : words };
}

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, colour: string, step = 6) {
  ctx.fillStyle = colour;
  for (let y = 0; y < h; y += step) for (let x = (y / step) % 2 ? step / 2 : 0; x < w; x += step) ctx.fillRect(x, y, 1.2, 1.2);
}

async function polaroid(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, tilt: number, aura: string, caption: string) {
  const [a1, a2, bg] = skins[aura] ?? skins.solo!;
  const pad = size * 0.05;
  const h = size + pad + size * 0.2;
  ctx.save();
  ctx.translate(x + size / 2, y + h / 2);
  ctx.rotate((tilt * Math.PI) / 180);
  ctx.translate(-size / 2 - pad, -h / 2);
  // hard shadow, frame, photo
  ctx.fillStyle = INK;
  ctx.fillRect(14, 14, size + pad * 2, h);
  ctx.fillStyle = '#fbfaf6';
  ctx.fillRect(0, 0, size + pad * 2, h);
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.strokeRect(1.5, 1.5, size + pad * 2 - 3, h - 3);
  ctx.save();
  ctx.beginPath();
  ctx.rect(pad, pad, size, size);
  ctx.clip();
  ctx.fillStyle = bg;
  ctx.fillRect(pad, pad, size, size);
  ctx.globalCompositeOperation = 'screen';
  for (const [cx, cy, r, c] of [[0.3, 0.3, 0.55, a1], [0.75, 0.62, 0.55, a2], [0.4, 0.85, 0.45, a1]] as const) {
    const g = ctx.createRadialGradient(pad + cx * size, pad + cy * size, 0, pad + cx * size, pad + cy * size, r * size);
    g.addColorStop(0, c);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(pad, pad, size, size);
  }
  ctx.globalCompositeOperation = 'source-over';
  const shroom = await image('/stickers/halo-shroom.svg');
  ctx.drawImage(shroom, pad + size * 0.18, pad + size * 0.14, size * 0.64, size * 0.64);
  ctx.translate(pad, pad);
  grain(ctx, size, size, 'rgba(0,0,0,0.22)', 5);
  ctx.restore();
  ctx.strokeRect(pad, pad, size, size);
  // caption in marker, tape on top
  ctx.fillStyle = INK;
  ctx.font = `${Math.round(size * 0.085)}px "Permanent Marker", cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(caption, pad + size / 2, size + pad + size * 0.1, size);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.translate(pad + size / 2, -6);
  ctx.rotate(-0.05);
  ctx.fillRect(-size * 0.2, -14, size * 0.4, 28);
  ctx.restore();
}

function chip(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, px: number, align: CanvasTextAlign = 'left') {
  plain(ctx, `${px}px VT323, monospace`);
  const w = ctx.measureText(text).width + px * 0.8;
  const left = align === 'center' ? x - w / 2 : x;
  const g = ctx.createLinearGradient(0, y, 0, y + px * 1.3);
  g.addColorStop(0, LCD[0]!);
  g.addColorStop(1, LCD[1]!);
  ctx.fillStyle = g;
  ctx.fillRect(left, y, w, px * 1.3);
  ctx.fillStyle = LCD[2]!;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, left + px * 0.4, y + px * 0.68);
}

export async function drawCard(canvas: HTMLCanvasElement, format: CardFormat, card: Card) {
  await Promise.all(['900 64px Anybody', '32px VT323', '32px "Permanent Marker"', '700 24px "Atkinson Hyperlegible Next"'].map((f) => document.fonts.load(f)));
  const story = format === 'story';
  canvas.width = story ? 1080 : 1200;
  canvas.height = story ? 1350 : 630;
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width;
  const H = canvas.height;
  const [, , bg] = skins[card.aura] ?? skins.solo!;
  const big = card.era ? card.era.name : card.song;
  const meta = card.era ? `${card.era.years} · ${card.era.tag}` : card.caption;

  if (!story) {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);
    grain(ctx, W, H, 'rgba(18,18,22,0.08)');
    await polaroid(ctx, 70, 52, 390, -3, card.aura, card.caption);
    const x = 560;
    const width = W - x - 70;
    chip(ctx, card.s.myAura!, x, 64, 30);
    const name = fit(ctx, big, width, 2, 118, 56);
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    let y = 128 + name.px * 0.82;
    for (const line of name.out) {
      ctx.fillText(line, x, y);
      y += name.px * 0.9;
    }
    plain(ctx, '32px VT323, monospace');
    ctx.fillText(meta, x, y + 6, width);
    y += 64;
    if (card.era) {
      plain(ctx, '700 22px "Atkinson Hyperlegible Next", sans-serif');
      ctx.fillStyle = '#c23815';
      ctx.fillText(card.s.mySong!.toUpperCase(), x, y);
      const song = fit(ctx, card.song, width, 2, 62, 30);
      ctx.fillStyle = INK;
      y += song.px * 0.95;
      for (const line of song.out) {
        ctx.fillText(line, x, y);
        y += song.px * 0.92;
      }
    }
    plain(ctx, '18px "Atkinson Hyperlegible Next", sans-serif');
    ctx.fillStyle = '#4a4b55';
    ctx.fillText(card.s.fanLine!, x, H - 70, width);
    plain(ctx, '700 22px "Atkinson Hyperlegible Next", sans-serif');
    ctx.fillStyle = INK;
    ctx.fillText('shroomieshq.fan/aura', x, H - 40);
  } else {
    // story: the era's night colour with the strobe edge, polaroid in the middle
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, bg);
    g.addColorStop(1, '#050507');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    grain(ctx, W, H, 'rgba(255,255,255,0.06)', 7);
    ctx.lineWidth = 18;
    ctx.strokeStyle = '#2335f0';
    ctx.strokeRect(9, 9, W - 18, H - 18);
    chip(ctx, card.s.myAura!, W / 2, 90, 40, 'center');
    await polaroid(ctx, W / 2 - 260, 180, 520, -3, card.aura, card.caption);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const name = fit(ctx, big, W - 140, 2, 120, 56);
    ctx.fillStyle = '#ffffff';
    let y = 880 + name.px * 0.8;
    for (const line of name.out) {
      ctx.fillText(line, W / 2, y);
      y += name.px * 0.9;
    }
    plain(ctx, '42px VT323, monospace');
    ctx.fillStyle = LCD[0]!;
    ctx.fillText(meta, W / 2, y + 4, W - 140);
    if (card.era) {
      // the song gets its own line under the era
      const song = fit(ctx, card.song, W - 200, 1, 64, 30);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(song.out[0]!, W / 2, Math.min(y + 30 + song.px, H - 120));
    }
    plain(ctx, '22px "Atkinson Hyperlegible Next", sans-serif');
    ctx.fillStyle = '#c9cbd6';
    ctx.fillText(card.s.fanLine!, W / 2, H - 82, W - 140);
    plain(ctx, '700 28px "Atkinson Hyperlegible Next", sans-serif');
    ctx.fillStyle = '#ffffff';
    ctx.fillText('shroomieshq.fan/aura', W / 2, H - 46);
  }
}
