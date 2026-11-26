/** WCAG 2.x relative luminance of a `#rrggbb` colour. */
export function luminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`Not a #rrggbb colour: ${hex}`);
  const n = parseInt(m[1]!, 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two `#rrggbb` colours (1–21). */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Reads `--name: #hex` declarations per selector block from a CSS file. */
export function readTokens(css: string): Map<string, Record<string, string>> {
  const blocks = new Map<string, Record<string, string>>();
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [, selector, body] of clean.matchAll(/([^{};]+)\{([^{}]*)\}/g)) {
    const vars: Record<string, string> = {};
    for (const [, name, value] of body!.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\b/g)) vars[name!] = value!.toLowerCase();
    if (Object.keys(vars).length) blocks.set(selector!.trim().replace(/\s+/g, ' '), vars);
  }
  return blocks;
}
