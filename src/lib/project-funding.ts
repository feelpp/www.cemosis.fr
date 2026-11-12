import { getCollection } from 'astro:content';
import { z } from 'astro/zod';
import { parse } from 'yaml';
import source from '../data/project-funding.yaml?raw';
import type { Language } from './site';
import { projectPublicationRules } from './publication-projects';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const strings = z.array(z.string().trim().min(1));
const matching = z.object({ references: strings.default([]), names: strings.default([]) }).strict();
const grants = z.array(z.object({ reference: z.string().trim().min(1), program: z.string().trim().min(1).optional(), source: z.url().optional() }).strict()).default([]);
const relationship = z.object({
  project: slug.optional(),
  source: slug.optional(),
  coverage: z.literal('partial').optional(),
  recipient: z.string().trim().min(1).optional(),
  status: z.enum(['active', 'past']).optional(),
  period: z.object({ en: z.string().min(1), fr: z.string().min(1) }).strict().optional(),
  aspects: z.object({ en: strings, fr: strings }).strict().optional(),
}).strict().refine(value => Boolean(value.project) !== Boolean(value.source), 'Specify exactly one funding project or source');
const data = z.object({
  fundingSources: z.record(slug, z.object({
    title: z.object({ en: z.string().min(1), fr: z.string().min(1) }).strict(),
    grants,
    url: z.url().optional(),
  }).strict()).default({}),
  projects: z.record(slug, z.object({
    aliases: z.array(slug).default([]),
    grants,
    publicationMatching: matching.default({ references: [], names: [] }),
    fundedBy: z.array(relationship).default([]),
  }).strict()),
}).strict().parse(parse(source));
const config = data.projects;
export const fundingSources = data.fundingSources;

export const projectAliases: Record<string, string> = {};
for (const [project, data] of Object.entries(config)) {
  for (const alias of data.aliases) {
    if (config[alias] || projectAliases[alias]) throw new Error(`Duplicate or conflicting project alias ${alias} in project-funding.yaml`);
    projectAliases[alias] = project;
  }
  const funders = new Set<string>();
  for (const funding of data.fundedBy) {
    const key = funding.project ? `project:${funding.project}` : `source:${funding.source}`;
    const valid = funding.project ? funding.project !== project && config[funding.project] : funding.source && fundingSources[funding.source];
    if (!valid || funders.has(key)) {
      throw new Error(`Invalid or duplicate funder ${key} for ${project} in project-funding.yaml`);
    }
    funders.add(key);
  }
}

export const canonicalProjectSlug = (project: string) => projectAliases[project] ?? project;

export async function getProjectCatalog(lang: Language) {
  const entries = [...await getCollection('projects'), ...await getCollection('funding')];
  const known = new Set(entries.map(({ data }) => data.slug));
  for (const project of Object.keys(config)) {
    if (!known.has(project)) throw new Error(`Unknown project ${project} in project-funding.yaml`);
  }
  for (const alias of Object.keys(projectAliases)) {
    if (known.has(alias)) throw new Error(`Project alias ${alias} must not have a separate content entry`);
  }
  return entries.filter(({ data }) => !data.draft && data.lang === lang).map(({ data }) => ({
    ...data,
    aliases: config[data.slug]?.aliases ?? [],
    grants: config[data.slug]?.grants ?? [],
    publicationMatching: projectPublicationRules(config[data.slug] ?? {}),
    fundedBy: config[data.slug]?.fundedBy ?? [],
  })).sort((a, b) => a.title.localeCompare(b.title, lang));
}
