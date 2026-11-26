import { describe, expect, it } from 'vitest';
import en from '../../src/i18n/en.json';
import es from '../../src/i18n/es.json';
import { localePath, t } from '../../src/i18n';

describe('i18n', () => {
  it('has the same keys in every locale', () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });
  it('fills placeholders', () => {
    expect(t('es', 'theme.change', { name: 'Claro' })).toBe('Tema: Claro. Cambiar tema');
  });
  it('maps a page to the other locale', () => {
    expect(localePath('/', 'es')).toBe('/es/');
    expect(localePath('/music/halo/', 'es')).toBe('/es/music/halo/');
    expect(localePath('/es/', 'en')).toBe('/');
    expect(localePath('/es/music/', 'en')).toBe('/music/');
    expect(localePath('/essays/', 'en')).toBe('/essays/');
    expect(localePath('/es/music/', 'es')).toBe('/es/music/');
  });
});
