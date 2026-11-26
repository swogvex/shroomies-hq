import en from './en.json';
import es from './es.json';

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export type Key = keyof typeof en;

// `satisfies` makes a key missing from es.json a type error, so `npm run check` fails the build.
const strings = { en, es: es satisfies Record<Key, string> } as const;

export function t(locale: Locale, key: Key, vars: Record<string, string> = {}): string {
  return strings[locale][key].replace(/\{(\w+)\}/g, (_, name: string) => vars[name] ?? `{${name}}`);
}

/** The same page in another locale: EN lives at the root, ES under /es/. */
export function localePath(path: string, to: Locale): string {
  const bare = path.replace(/^\/es(?=\/|$)/, '') || '/';
  return to === 'en' ? bare : `/es${bare}`;
}
