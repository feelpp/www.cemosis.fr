import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Default to the repository's GitHub Pages URL. Set both values for a custom domain.
const base = (process.env.SITE_BASE ?? '/www.cemosis.fr').replace(/\/$/, '');
export default defineConfig({
  site: process.env.SITE_URL || 'https://feelpp.github.io',
  base: base || '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: page => ['fr', 'en'].some(lang => new URL(page).pathname.startsWith(`${base}/${lang}/`)) })],
  devToolbar: { enabled: false },
  vite: { server: { host: '127.0.0.1' } },
});
