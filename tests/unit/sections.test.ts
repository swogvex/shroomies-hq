import { describe, expect, it } from 'vitest';
import { neighbours, sectionIndex, sections } from '../../src/lib/sections';

describe('sections', () => {
  it('has seven numbered tracks and the B1 bonus', () => {
    expect(sections.map((s) => s.n)).toEqual(['01', '02', '03', '04', '05', '06', '07', 'B1']);
  });
  it('finds the section of a path', () => {
    expect(sectionIndex('/')).toBe(0);
    expect(sectionIndex('/music/')).toBe(1);
    expect(sectionIndex('/music/halo/')).toBe(1);
    expect(sectionIndex('/wall/')).toBe(6);
    expect(sectionIndex('/aura/')).toBe(7);
    expect(sectionIndex('/legal/')).toBe(-1);
    expect(sectionIndex('/musical/')).toBe(-1);
  });
  it('wraps prev and next like a tracklist', () => {
    expect(neighbours(0)).toEqual({ prev: 7, next: 1 });
    expect(neighbours(6)).toEqual({ prev: 5, next: 7 });
    expect(neighbours(7)).toEqual({ prev: 6, next: 0 });
    expect(neighbours(-1)).toEqual({ prev: 7, next: 1 });
  });
});
