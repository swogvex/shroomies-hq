// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://shroomieshq.fan',
  trailingSlash: 'always',
  adapter: vercel(),
  security: {
    // Astro adds hashes for its own scripts and styles; frame-ancestors only works as a header (vercel.json).
    csp: {
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
