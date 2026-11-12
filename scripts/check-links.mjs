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
// Each publication/project association must be rendered in both directions.
let associations = 0;
for (const lang of ['fr', 'en']) {
  const publicationFile = join(root, lang, 'publications', 'index.html');
  const publicationRows = documentFor(publicationFile).querySelectorAll('[data-publication]');
  for (const row of publicationRows) {
    for (const link of row.querySelectorAll('.publication-projects a')) {
      const target = fileFor(new URL(link.getAttribute('href'), site).pathname);
      if (!target || !documentFor(target).querySelectorAll('[data-publication]').some(p => p.id === row.id)) {
        errors.push(`Missing project → publication association: ${lang}/${row.id} → ${link.getAttribute('href')}`);
      }
      associations++;
    }
  }
  for (const file of htmlFiles.filter(file => file.startsWith(join(root, lang, 'projects') + '/'))) {
    for (const row of documentFor(file).querySelectorAll('[data-publication]')) {
      const reverse = publicationRows.find(p => p.id === row.id);
      if (!reverse?.querySelectorAll('.publication-projects a').some(link => fileFor(new URL(link.getAttribute('href'), site).pathname) === file)) {
        errors.push(`Missing publication → project association: ${file} → ${row.id}`);
      }
    }
  }
}
// Project-funding links have reciprocal "Funding" / "Supported projects" entries.
let fundingRelations = 0;
for (const file of htmlFiles) {
  for (const relation of documentFor(file).querySelectorAll('[data-funding-relation]')) {
    const link = relation.querySelector('a');
    const target = link && fileFor(new URL(link.getAttribute('href'), site).pathname);
    const reverse = target && documentFor(target).querySelectorAll('[data-funding-relation]').some(other =>
      other.getAttribute('data-funding-relation') !== relation.getAttribute('data-funding-relation') &&
      other.getAttribute('data-funding-status') === relation.getAttribute('data-funding-status') &&
      other.getAttribute('data-funder') === relation.getAttribute('data-funder') &&
      other.getAttribute('data-funded-project') === relation.getAttribute('data-funded-project'));
    if (!reverse) errors.push(`Missing reciprocal project funding link: ${file} → ${link?.getAttribute('href')}`);
    fundingRelations++;
  }
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
const fundingConfig = parseYaml(readFileSync('src/data/project-funding.yaml', 'utf8'));
for (const [project, config] of Object.entries(fundingConfig.projects)) {
  for (const lang of ['fr', 'en']) {
    const file = join(root, lang, 'projects', project, 'index.html');
    if (!existsSync(file)) continue; // Drafts / untranslated projects are not rendered.
    for (const grant of config.grants ?? []) {
      if (!documentFor(file).querySelectorAll('[data-project-grant]').some(row => row.getAttribute('data-project-grant') === grant.reference)) errors.push(`Missing project grant: ${lang}/${project} → ${grant.reference}`);
    }
    for (const funding of config.fundedBy ?? []) {
      const row = documentFor(file).querySelectorAll('[data-funder], [data-funding-source]').find(row =>
        funding.project ? row.getAttribute('data-funding-relation') === 'received' && row.getAttribute('data-funder') === funding.project : row.getAttribute('data-funding-source') === funding.source);
      if (!row) errors.push(`Configured funding not rendered: ${lang}/${project} → ${funding.project ?? funding.source}`);
      if (funding.recipient && !row?.text.includes(funding.recipient)) errors.push(`Missing funding recipient: ${lang}/${project}`);
      if (funding.coverage === 'partial' && !row?.text.includes(lang === 'fr' ? 'Financement partiel' : 'Partial funding')) errors.push(`Missing partial funding label: ${lang}/${project}`);
      if (funding.status && row?.getAttribute('data-funding-status') !== funding.status) errors.push(`Missing funding status: ${lang}/${project}`);
      if (funding.period && !row?.text.includes(funding.period[lang])) errors.push(`Missing funding period: ${lang}/${project}`);
      const sourceGrants = funding.project ? fundingConfig.projects[funding.project]?.grants : fundingConfig.fundingSources?.[funding.source]?.grants;
      for (const grant of sourceGrants ?? []) {
        if (!row?.querySelectorAll('[data-grant-reference]').some(item => item.getAttribute('data-grant-reference') === grant.reference)) errors.push(`Missing funding reference: ${lang}/${project} → ${grant.reference}`);
      }
    }
  }
  for (const alias of config.aliases ?? []) {
    for (const lang of ['fr', 'en']) {
      const aliasPath = `${base}/${lang}/projects/${alias}/`;
      const canonicalPath = `${base}/${lang}/projects/${project}/`;
      const file = join(root, lang, 'projects', alias, 'index.html');
      if (!existsSync(file)) { errors.push(`Missing project alias redirect: ${aliasPath}`); continue; }
      const redirect = documentFor(file);
      if (redirect.querySelector('link[rel="canonical"]')?.getAttribute('href') !== new URL(canonicalPath, site).href ||
          redirect.querySelector('meta[http-equiv="refresh"]')?.getAttribute('content') !== `0;url=${canonicalPath}`) {
        errors.push(`Incorrect project alias target: ${aliasPath}`);
      }
      if (sitemap.includes(`<loc>${site.origin}${aliasPath}</loc>`)) errors.push(`Project alias in sitemap: ${aliasPath}`);
      if (documentFor(join(root, lang, 'projects', 'index.html')).querySelectorAll('a').some(link => link.getAttribute('href') === aliasPath)) {
        errors.push(`Renamed project still listed separately: ${aliasPath}`);
      }
    }
  }
}
if (sitemap.includes('/404') || redirects.some(({ from }) => sitemap.includes(`<loc>${site.origin}${base}/${from}/</loc>`))) errors.push('Sitemap contains a 404 or redirect page.');
// People have one public anchor and reciprocal project associations, regardless
// of whether their main entry is a staff card or a doctoral-history row.
const peopleConfig = parseYaml(readFileSync('src/data/people.yaml', 'utf8'));
const aliases = new Map(Object.entries(fundingConfig.projects).flatMap(([slug, project]) => (project.aliases ?? []).map(alias => [alias, slug])));
let peopleLinks = 0;
for (const lang of ['fr', 'en']) {
  const about = documentFor(join(root, lang, 'about', 'index.html'));
  for (const person of peopleConfig.people) {
    const anchors = about.querySelectorAll('[id]').filter(element => element.id === `person-${person.id}`);
    if (anchors.length !== 1) { errors.push(`Expected one person anchor: ${lang}/${person.id}`); continue; }
    const projects = new Set([
      ...(person.projects ?? []).map(project => project.project),
      ...(person.contracts ?? []).flatMap(contract => [...contract.projects ?? [], ...(contract.funding ?? []).flatMap(funding => funding.project ? [funding.project] : [])]),
    ].map(project => aliases.get(project) ?? project));
    for (const project of projects) {
      const path = `${base}/${lang}/projects/${project}/`;
      const target = fileFor(path);
      if (!anchors[0].querySelectorAll('a').some(link => link.getAttribute('href') === path) ||
          !target || !documentFor(target).querySelectorAll('[data-project-person]').some(row => row.getAttribute('data-project-person') === person.id)) {
        errors.push(`Missing reciprocal person/project link: ${lang}/${person.id} → ${project}`);
      }
      peopleLinks++;
    }
    if (person.doctorate) {
      const row = about.querySelectorAll('[data-doctorate]').find(row => row.getAttribute('data-doctorate') === person.id);
      if (!row || row.getAttribute('data-doctorate-status') !== person.doctorate.status) errors.push(`Missing doctoral record: ${lang}/${person.id}`);
      if (person.doctorate.defenseDate && row?.querySelector('time')?.getAttribute('datetime') !== person.doctorate.defenseDate) errors.push(`Incorrect defense date: ${lang}/${person.id}`);
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Verified ${htmlFiles.length} HTML pages: internal links, assets, metadata, drafts and redirects.`);
console.log(`Verified ${associations} bidirectional publication/project associations across both languages.`);
console.log(`Verified ${fundingRelations} reciprocal project-funding entries across both languages.`);
console.log(`Verified ${peopleLinks} reciprocal person/project associations across both languages.`);
