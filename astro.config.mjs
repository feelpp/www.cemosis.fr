import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Default to the repository's GitHub Pages URL. Set both values for a custom domain.
const base = (process.env.SITE_BASE ?? '/www.cemosis.fr').replace(/\/$/, '');
const { projects } = parse(readFileSync(new URL('./src/data/project-funding.yaml', import.meta.url), 'utf8'));
const aliasPaths = new Set(Object.values(projects).flatMap(project => (project.aliases ?? []).flatMap(alias => ['fr', 'en'].map(lang => `${base}/${lang}/projects/${alias}/`))));
export default defineConfig({
  site: process.env.SITE_URL || 'https://feelpp.github.io',
  base: base || '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: page => ['fr', 'en'].some(lang => new URL(page).pathname.startsWith(`${base}/${lang}/`)) && !aliasPaths.has(new URL(page).pathname) })],
  devToolbar: { enabled: false },
  vite: { server: { host: '127.0.0.1' } },
});
