import { afterEach, describe, expect, it, vi } from 'vitest';
import { read, readJSON, remove, write, writeJSON } from '../../src/lib/storage';

const memory = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m };
};

afterEach(() => vi.unstubAllGlobals());

describe('storage', () => {
  it('prefixes keys and round-trips values', () => {
    const s = memory();
    vi.stubGlobal('localStorage', s);
    expect(write('theme', 'dark')).toBe(true);
    expect(s.m.get('shq:theme')).toBe('dark');
    expect(read('theme')).toBe('dark');
    writeJSON('visits', ['2026-11-26']);
    expect(readJSON('visits', [])).toEqual(['2026-11-26']);
    remove('theme');
    expect(read('theme')).toBeNull();
  });

  it('gives the fallback for corrupt JSON', () => {
    const s = memory();
    s.setItem('shq:stickers', '{oops');
    vi.stubGlobal('localStorage', s);
    expect(readJSON('stickers', [])).toEqual([]);
  });

  it('never throws when storage is blocked', () => {
    const boom = () => { throw new DOMException('denied', 'SecurityError'); };
    vi.stubGlobal('localStorage', { getItem: boom, setItem: boom, removeItem: boom });
    expect(read('theme')).toBeNull();
    expect(write('theme', 'dark')).toBe(false);
    expect(() => remove('theme')).not.toThrow();
    expect(readJSON('visits', ['x'])).toEqual(['x']);
  });

  it('works with no localStorage at all (server build)', () => {
    vi.stubGlobal('localStorage', undefined);
    expect(read('theme')).toBeNull();
    expect(write('theme', 'dark')).toBe(false);
  });
});
