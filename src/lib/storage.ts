// The only door to localStorage (no cookies anywhere). Every key is prefixed 'shq:'.
// Storage can be blocked (private mode, settings): reads then give the fallback and writes report false.

export type StorageKey =
  | 'theme' | 'calm' | 'era' | 'lang-hint' | 'stickers' | 'streak' | 'visits' | 'opened-songs'
  | 'coin-day' | 'guess' | 'device' | 'wall-sent' | 'wall-reacted' | 'aura';

const store = (): Storage | null => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // some browsers throw on the property access itself when storage is disabled
  }
};

export function read(key: StorageKey): string | null {
  try {
    return store()?.getItem('shq:' + key) ?? null;
  } catch {
    return null;
  }
}

export function write(key: StorageKey, value: string): boolean {
  try {
    const s = store();
    s?.setItem('shq:' + key, value);
    return !!s;
  } catch {
    return false; // blocked or full
  }
}

export function remove(key: StorageKey): void {
  try {
    store()?.removeItem('shq:' + key);
  } catch {}
}

/** JSON value, or the fallback when missing, blocked or corrupt. */
export function readJSON<T>(key: StorageKey, fallback: T): T {
  const raw = read(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const writeJSON = (key: StorageKey, value: unknown) => write(key, JSON.stringify(value));
