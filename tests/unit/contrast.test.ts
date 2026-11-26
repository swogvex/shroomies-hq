import { describe, expect, it } from 'vitest';
import { contrast, readTokens } from '../../src/lib/contrast';

describe('contrast', () => {
  it('matches known WCAG ratios', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrast('#ffffff', '#ffffff')).toBe(1);
    expect(contrast('#ffffff', '#2335f0')).toBeCloseTo(7.4, 1);
  });
  it('is symmetric and rejects bad input', () => {
    expect(contrast('#121216', '#ededea')).toBe(contrast('#ededea', '#121216'));
    expect(() => contrast('#fff', '#000000')).toThrow();
  });
});

describe('readTokens', () => {
  it('reads hex custom properties per selector block', () => {
    const css = `@layer t { :root,\n [data-theme="original"] { --bg: #EDEDEA; --x: var(--bg); }\n [data-era="halo"] { --era-accent: #2335f0; } }`;
    const t = readTokens(css);
    expect(t.get(':root, [data-theme="original"]')).toEqual({ '--bg': '#ededea' });
    expect(t.get('[data-era="halo"]')).toEqual({ '--era-accent': '#2335f0' });
  });
});
