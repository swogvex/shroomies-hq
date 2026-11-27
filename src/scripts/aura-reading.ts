// The aura reading in the browser (25-spec): questions, history steps, keyboard shortcuts, the result, copy and the card.
// The page (src/views/Aura.astro) renders every question and inlines the deck as JSON; the scoring is src/lib/aura.ts.
import { read, type AuraEra, type DeckSong } from '../lib/aura';
import { readJSON, writeJSON } from '../lib/storage';
import { lcdText } from '../lib/lcd';
import { drawCard, type CardFormat } from './aura-card';

type Song = DeckSong & { fit: number; spotify: string | null; embed: string | null; href: string };
type Era = { id: AuraEra; name: string; years: string; tag: string; line: string; fit: number };
type Data = {
  feelings: { id: string; why: string }[];
  eras: Era[];
  questions: { kicker: string; options: { era: AuraEra; feelings: string[] }[] }[];
  deck: Song[];
  s: Record<string, string>;
  locale: 'en' | 'es';
};
type Saved = { era: AuraEra | null; song: string; date: string };

const root = document.querySelector<HTMLElement>('[data-aura]');
if (root) {
  const data = JSON.parse(root.querySelector('[data-aura-data]')!.textContent!) as Data;
  const $ = <T extends HTMLElement = HTMLElement>(sel: string, from: ParentNode = root) => from.querySelector<T>(sel)!;
  const fill = (key: string, vars: Record<string, string> = {}) => data.s[key]!.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '');
  const order = data.feelings.map((f) => f.id);
  const why = Object.fromEntries(data.feelings.map((f) => [f.id, f.why]));
  const eraOf = Object.fromEntries(data.eras.map((e) => [e.id, e])) as Record<AuraEra, Era>;
  const lcd = (text: string) => dispatchEvent(new CustomEvent('shq:lcd', { detail: text }));

  const stages: Record<string, HTMLElement> = Object.fromEntries([...root.querySelectorAll<HTMLElement>('[data-stage]')].map((el) => [el.dataset.stage!, el]));
  const questions = [...root.querySelectorAll<HTMLElement>('.q')];
  const discs = [...root.querySelectorAll<HTMLElement>('.disc')];
  const devBlobs = [...root.querySelectorAll<HTMLElement>('[data-dev]')];
  const next = $<HTMLButtonElement>('[data-next]');
  const start = $<HTMLButtonElement>('[data-start]');

  const answers: (number | undefined)[] = Array(questions.length).fill(undefined);
  let step = -1; // -1 intro, 0–7 questions, 8 result
  let last: { era: AuraEra | null; song: Song } | null = null;

  // the last reading (shq:aura) on the intro: a small return loop
  const saved = readJSON<Saved | null>('aura', null);
  const savedSong = saved && data.deck.find((s) => s.title === saved.song);
  if (savedSong) {
    $('[data-last]').hidden = false;
    const a = $<HTMLAnchorElement>('[data-last-link]');
    a.textContent = savedSong.title;
    a.href = savedSong.href;
  }

  const show = (name: 'intro' | 'quiz' | 'result') => {
    for (const [k, el] of Object.entries(stages)) el.hidden = k !== name;
    root.dataset.at = name;
  };

  const paintQuestion = (i: number) => {
    questions.forEach((q, j) => (q.hidden = j !== i));
    const kicker = data.questions[i]!.kicker;
    $('[data-qn]').textContent = `Q${String(i + 1).padStart(2, '0')}`;
    $('[data-qk]').textContent = kicker;
    $('[data-progress-text]').textContent = fill('progress', { n: String(i + 1), total: String(questions.length) });
    discs.forEach((d, j) => {
      d.dataset.state = j < i ? 'done' : j === i ? 'now' : 'todo';
      const a = answers[j];
      if (a === undefined) delete d.dataset.auraSkin;
      else d.dataset.auraSkin = data.questions[j]!.options[a]!.era;
    });
    devBlobs.forEach((b, j) => {
      const a = answers[j]; // later answers are cleared when one changes, so this is the picture so far
      if (a === undefined) delete b.dataset.auraSkin;
      else b.dataset.auraSkin = data.questions[j]!.options[a]!.era;
    });
    next.disabled = answers[i] === undefined;
    next.firstChild!.textContent = `${data.s[i === questions.length - 1 ? 'finish' : 'next']} `;
    lcd(`B1 · Q ${i + 1}/${questions.length}`);
  };

  const go = (to: number, push = true) => {
    step = to;
    if (push) history.pushState({ aura: to }, '');
    if (to < 0) {
      show('intro');
      lcd('B1 · AURA READING');
      start.focus();
    } else if (to < questions.length) {
      show('quiz');
      paintQuestion(to);
      $(`#aura-q${to}`).focus({ preventScroll: true });
      stages.quiz!.scrollIntoView({ block: 'start' });
    } else result();
  };

  const result = () => {
    const r = read(answers as number[], data.questions, data.deck, order) as ReturnType<typeof read> & { song: Song };
    const song = r.song;
    const solo = song.standalone;
    const era = eraOf[r.era];
    last = { era: solo ? null : r.era, song };
    show('result');
    const res = stages.result!;
    res.dataset.solo = String(solo);
    $('[data-res-skin]').dataset.auraSkin = solo ? 'solo' : r.era;
    $('[data-era-block]').hidden = solo;
    $('[data-solo-block]').hidden = !solo;
    $('[data-mix-block]').hidden = solo;
    const date = new Date().toLocaleDateString(data.locale, { day: 'numeric', month: 'short' }).toUpperCase().replace('.', '');
    $('[data-stamp]').textContent = fill('stamp', { date });
    $('[data-caption]').textContent = solo ? data.s.whiteLight! : era.tag;
    const name = $('[data-era-name]');
    name.textContent = era.name;
    name.className = `era-name fit-${era.fit}`;
    $('[data-era-years]').textContent = era.years;
    $('[data-era-tag]').textContent = era.tag;
    $('[data-era-line]').textContent = era.line;
    const title = $('[data-song-title]');
    title.textContent = song.title;
    title.parentElement!.className = `song-title fit-${song.fit}`;
    $('[data-explicit]').hidden = !song.explicit;
    $('[data-song-from]').textContent = solo ? fill('soloFrom', { year: song.year }) : fill('from', { release: song.releaseTitle, year: song.year });
    $('[data-why]').textContent = fill('because', { a: why[r.why[0]]!, b: why[r.why[1]]! });
    $<HTMLAnchorElement>('[data-open-release]').href = song.href;
    // the player gate of the result: re-armed for this song (nothing loads before the click)
    const gate = $('[data-gate]', res);
    for (const el of gate.querySelectorAll<HTMLElement>('[data-gate-load], .gate-small')) el.hidden = !song.embed; // no Spotify link: the release page only
    if (song.embed) {
      gate.dataset.gate = song.embed;
      gate.dataset.frameTitle = song.title;
      gate.toggleAttribute('data-tall', song.embed.includes('/album/')); // same rule as PlayerGate.astro
      gate.querySelector<HTMLAnchorElement>('[data-gate-fallback] a')!.href = song.spotify!;
      gate.dispatchEvent(new Event('gate:reset'));
    }
    for (const e of data.eras) {
      const row = $(`[data-mix="${e.id}"]`);
      $('[data-mix-bar]', row).style.inlineSize = `${r.mix[e.id]}%`; // CSSOM, allowed by the CSP
      $('[data-mix-pct]', row).textContent = `${r.mix[e.id]}%`;
      row.classList.toggle('win', e.id === r.era);
    }
    $('[data-copy-status]').textContent = '';
    $('[data-announce]').textContent = solo ? fill('announceSolo', { song: song.title }) : fill('announce', { era: era.name, song: song.title });
    lcd(`B1 · ${lcdText(song.title) || 'YOUR AURA'}`);
    writeJSON('aura', { era: last.era, song: song.title, date: new Date().toISOString().slice(0, 10) } satisfies Saved);
    res.classList.remove('reveal');
    void res.offsetWidth; // restart the develop animation on "take it again"
    res.classList.add('reveal');
    res.scrollIntoView({ block: 'start' });
    $(solo ? '[data-solo-block] .era-name' : '[data-era-name]').focus({ preventScroll: true });
  };

  // ---- answering: pointer picks move on by themselves; keyboard picks wait for Next (no surprise jumps) ----
  let pointer = false;
  root.addEventListener('pointerdown', () => (pointer = true), true);
  root.addEventListener('keydown', () => (pointer = false), true);
  questions.forEach((q, i) => {
    q.addEventListener('change', (e) => {
      answers[i] = Number((e.target as HTMLInputElement).value);
      for (let j = i + 1; j < answers.length; j++) answers[j] = undefined; // a changed answer re-asks the rest
      paintQuestion(i);
      if (pointer) setTimeout(() => step === i && go(i + 1), 420);
    });
  });
  next.addEventListener('click', () => answers[step] !== undefined && go(step + 1));
  $('[data-back]').addEventListener('click', () => history.back());
  start.addEventListener('click', () => {
    answers.fill(undefined);
    for (const input of root.querySelectorAll<HTMLInputElement>('.q input')) input.checked = false;
    go(0);
  });
  $('[data-again]').addEventListener('click', () => start.click());
  addEventListener('popstate', (e) => {
    const to = (e.state as { aura?: number } | null)?.aura ?? -1;
    // never land on a question after an unanswered one, or on a result without all answers
    const firstGap = answers.findIndex((a) => a === undefined);
    go(firstGap === -1 ? to : Math.min(to, firstGap), false);
  });
  history.replaceState({ aura: -1 }, '');

  // shortcuts on a question: 1–4 / A–D pick, Enter next, Backspace back (never while typing; the remote's 1–7 wait)
  addEventListener(
    'keydown',
    (e) => {
      if (step < 0 || step >= questions.length || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement;
      if (t.isContentEditable || t.closest('textarea, select, input:not([type="radio"]), dialog')) return;
      const k = e.key.toUpperCase();
      const i = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : k.length === 1 ? 'ABCD'.indexOf(k) : -1;
      if (/^[5-9]$/.test(k)) e.stopPropagation(); // the remote's 5–7 would leave the reading halfway
      if (i >= 0) {
        e.preventDefault();
        e.stopPropagation();
        const input = questions[step]!.querySelectorAll<HTMLInputElement>('input')[i]!;
        input.checked = true;
        input.focus();
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (e.key === 'Enter' && answers[step] !== undefined) {
        e.preventDefault();
        go(step + 1);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        history.back();
      }
    },
    true,
  );

  // ---- copy and the aura card ----
  const copyText = () => (last!.era ? fill('copyText', { era: eraOf[last!.era].name, song: last!.song.title }) : fill('copyTextSolo', { song: last!.song.title })) + ' — shroomieshq.fan/aura';
  $('[data-copy]').addEventListener('click', async () => {
    const status = $('[data-copy-status]');
    try {
      await navigator.clipboard.writeText(copyText());
      status.textContent = data.s.copied!;
    } catch {
      status.textContent = `${data.s.copyFailed} ${copyText()}`;
    }
  });

  const dialog = $<HTMLDialogElement>('[data-card-dialog]');
  const canvas = $<HTMLCanvasElement>('[data-card-canvas]');
  const share = $<HTMLButtonElement>('[data-card-share]');
  let format: CardFormat = 'wide';
  const paintCard = async () => {
    const { era, song } = last!;
    await drawCard(canvas, format, {
      era: era && eraOf[era],
      colours: (['--a1', '--a2', '--a-bg'] as const).map((v) => getComputedStyle($('[data-res-skin]')).getPropertyValue(v).trim()) as [string, string, string],
      song: song.title,
      caption: era ? eraOf[era].tag : data.s.whiteLight!,
      s: data.s,
    });
    canvas.setAttribute('aria-label', fill('cardAlt', { era: era ? eraOf[era].name : '—', song: song.title }));
  };
  const blob = () => new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/png'));
  const fileName = () => `tiff-aura-${last!.song.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${format}.png`;
  $('[data-make-card]').addEventListener('click', async () => {
    dialog.showModal();
    await paintCard();
    const probe = new File([new Blob()], 'x.png', { type: 'image/png' });
    share.hidden = !navigator.canShare?.({ files: [probe] });
  });
  $('[data-card-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close()); // a click on the backdrop
  for (const input of dialog.querySelectorAll<HTMLInputElement>('[name="aura-fmt"]')) {
    input.addEventListener('change', () => {
      format = input.value as CardFormat;
      paintCard();
    });
  }
  $('[data-card-save]').addEventListener('click', async () => {
    const b = await blob();
    if (!b) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = fileName();
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  share.addEventListener('click', async () => {
    const b = await blob();
    if (!b) return;
    try {
      await navigator.share({ files: [new File([b], fileName(), { type: 'image/png' })], text: copyText() });
    } catch {} // the visitor closed the share sheet
  });
}
