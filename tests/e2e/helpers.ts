import type { Page } from '@playwright/test';

/** Records requests that leave our own origin, and console errors. */
export function watch(page: Page, origin: string) {
  const foreign: string[] = [];
  const errors: string[] = [];
  page.on('request', (r) => {
    const url = new URL(r.url());
    if (url.protocol.startsWith('http') && url.origin !== origin) foreign.push(r.url());
  });
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return { foreign, errors };
}
