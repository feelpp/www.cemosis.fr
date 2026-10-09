import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const common = {
  title: z.string(),
  description: z.string(),
  lang: z.enum(['fr', 'en']),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  draft: z.boolean().default(false),
};
// Keep translation IDs distinct even though their public slugs match.
const generateId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects', generateId }),
  schema: z.object({
    ...common,
    date: z.coerce.date(),
    category: z.string(),
    image: z.string().startsWith('/images/'),
    imageAlt: z.string(),
    featured: z.boolean().default(false),
    source: z.url().optional(),
    historical: z.boolean().default(false),
  }),
});
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news', generateId }),
  schema: z.object({ ...common, date: z.coerce.date(), category: z.string(), image: z.string().startsWith('/images/').optional(), source: z.url().optional(), historical: z.boolean().default(false) }),
});
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages', generateId }),
  schema: z.object(common),
});
const funding = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/funding', generateId }),
  schema: z.object({ ...common, category: z.string(), period: z.string(), order: z.number(), source: z.url().optional() }),
});
export const collections = { projects, news, pages, funding };
