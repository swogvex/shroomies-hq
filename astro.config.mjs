// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import search, { spanish404 } from './integrations/search.ts';

export default defineConfig({
  site: 'https://shroomieshq.fan',
  trailingSlash: 'always',
  i18n: {
    // locale list lives here and in src/i18n/index.ts; PT and JA can join later
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  adapter: vercel(),
  integrations: [search(), spanish404()],
  security: {
    // Astro adds hashes for its own scripts and styles; frame-ancestors only works as a header (vercel.json).
    csp: {
      // 'wasm-unsafe-eval' lets the search run Pagefind's WebAssembly; it does not allow eval() of JavaScript
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        'frame-src https://open.spotify.com https://www.youtube-nocookie.com',
        "media-src 'none'",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ],
    },
  },
});
