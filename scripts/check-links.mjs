import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'node-html-parser';
import { parse as parseYaml } from 'yaml';

const root = resolve('dist');
const site = new URL(process.env.SITE_URL || 'https://feelpp.github.io');
const base = (process.env.SITE_BASE ?? '/www.cemosis.fr').replace(/\/$/, '');
const errors = [];
const htmlFiles = [];
function walk(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}
if (!existsSync(root)) throw new Error('Run pnpm build first.');
walk(root);
const parsed = new Map();
const documentFor = file => {
  if (!parsed.has(file)) parsed.set(file, parse(readFileSync(file, 'utf8')));
  return parsed.get(file);
};
function fileFor(pathname) {
  if (base && pathname !== base && !pathname.startsWith(`${base}/`)) return undefined;
  const path = resolve(root, `.${decodeURIComponent(pathname.slice(base.length) || '/')}`);
  if (path !== root && !path.startsWith(`${root}/`)) return undefined;
  if (!existsSync(path)) return undefined;
  return statSync(path).isDirectory() ? join(path, 'index.html') : path;
}
for (const file of htmlFiles) {
  const relative = file.slice(root.length).replace(/index\.html$/, '');
  const current = new URL(`${base}${relative}`, site);
  const document = documentFor(file);
  for (const element of document.querySelectorAll('[href], [src], meta[property="og:image"]')) {
    const href = element.getAttribute('href') ?? element.getAttribute('src') ?? element.getAttribute('content');
    if (!href || /^(mailto:|tel:|data:|javascript:)/i.test(href)) continue;
    let target;
    try { target = new URL(href, current); } catch { errors.push(`${relative}: invalid URL ${href}`); continue; }
    if (target.origin !== site.origin || (base && target.pathname !== base && !target.pathname.startsWith(`${base}/`))) continue;
    const targetFile = fileFor(target.pathname);
    if (!targetFile || !existsSync(targetFile)) errors.push(`${relative}: missing ${href}`);
    else if (target.hash && targetFile.endsWith('.html')) {
      const id = decodeURIComponent(target.hash.slice(1));
      if (!documentFor(targetFile).querySelectorAll('[id]').some(el => el.id === id)) errors.push(`${relative}: missing anchor ${href}`);
    }
  }
  const isRedirect = document.querySelector('meta[http-equiv="refresh"]');
  if (isRedirect) {
    const target = isRedirect.getAttribute('content')?.match(/url=(.*)/i)?.[1];
    if (!target || !fileFor(new URL(target, current).pathname)) errors.push(`${relative}: broken redirect`);
  } else if (!file.endsWith('/404.html')) {
    if (document.querySelectorAll('h1').length !== 1) errors.push(`${relative}: expected one h1`);
    if (!document.querySelector('meta[name="description"]')?.getAttribute('content')) errors.push(`${relative}: missing description`);
    const expected = new URL(current.pathname, site).href;
    if (document.querySelector('link[rel="canonical"]')?.getAttribute('href') !== expected) errors.push(`${relative}: incorrect canonical`);
  }
}
// Assert that every published collection entry has output and drafts do not.
for (const collection of ['pages', 'projects', 'news', 'funding']) {
  const folder = resolve(`src/content/${collection}`);
  function checkEntries(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) checkEntries(path);
      else if (entry.name.endsWith('.md')) {
        const source = readFileSync(path, 'utf8');
        const data = parseYaml(source.match(/^---\n([\s\S]*?)\n---/)?.[1] || '');
        const target = join(root, data.lang, collection === 'pages' ? '' : collection === 'funding' ? 'projects' : collection, data.slug, 'index.html');
        if (existsSync(target) === Boolean(data.draft)) errors.push(`${path}: draft/publication output mismatch`);
      }
    }
  }
  checkEntries(folder);
}
// Imported articles must keep media local and cannot introduce executable HTML.
const discussions = JSON.parse(readFileSync('src/data/discussions.json', 'utf8'));
for (const lang of ['fr', 'en']) {
  for (const item of discussions.items) {
    const path = join(root, lang, 'discussions', String(item.number), 'index.html');
    if (!existsSync(path)) { errors.push(`Missing discussion ${item.number} (${lang})`); continue; }
    const article = documentFor(path).querySelector('.imported-discussion');
    if (!article || article.querySelector('script, iframe, object, embed')) errors.push(`Unsafe imported HTML: ${path}`);
    for (const image of article?.querySelectorAll('img') || []) {
      if (!image.getAttribute('src')?.startsWith(`${base}/media/`)) errors.push(`Non-local imported image: ${path}`);
    }
    for (const element of article?.querySelectorAll('*') || []) {
      if (Object.keys(element.attributes).some(name => /^on/i.test(name))) errors.push(`Inline handler in imported article: ${path}`);
    }
  }
}
const redirects = JSON.parse(readFileSync('src/data/redirects.json', 'utf8'));
for (const { from, to } of redirects) {
  if (!existsSync(join(root, from, 'index.html')) || !existsSync(join(root, to, 'index.html'))) errors.push(`Missing redirect output: ${from} → ${to}`);
}
const sitemap = readFileSync(join(root, 'sitemap-0.xml'), 'utf8');
if (sitemap.includes('/404') || redirects.some(({ from }) => sitemap.includes(`<loc>${site.origin}${base}/${from}/</loc>`))) errors.push('Sitemap contains a 404 or redirect page.');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Verified ${htmlFiles.length} HTML pages: internal links, assets, metadata, drafts and redirects.`);
