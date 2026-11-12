import { z } from 'astro/zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text = z.string().trim().min(1);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Invalid calendar date');
const bilingual = z.object({ fr: text, en: text }).strict();
const year = z.number().int().min(1900).max(2200).nullable().default(null);
const funding = z.object({ project: slug.optional(), source: slug.optional() }).strict()
  .refine(value => Boolean(value.project) !== Boolean(value.source), 'Specify exactly one funding project or source');
const project = z.object({ project: slug, role: bilingual.optional() }).strict();
const doctorate = z.object({
  title: bilingual,
  university: text,
  status: z.enum(['ongoing', 'defended', 'announced']),
  startYear: year,
  defenseDate: isoDate.optional(),
  source: z.url(),
  periodSource: z.url().optional(),
  supervisors: z.array(text).default([]),
}).strict().superRefine((value, ctx) => {
  if (value.status === 'defended' && !value.defenseDate) ctx.addIssue({ code: 'custom', path: ['defenseDate'], message: 'Defended doctorates need a defense date' });
  if (value.status !== 'defended' && value.defenseDate) ctx.addIssue({ code: 'custom', path: ['defenseDate'], message: 'Only defended doctorates have a defense date' });
  if (value.startYear && value.defenseDate && value.startYear > Number(value.defenseDate.slice(0, 4))) ctx.addIssue({ code: 'custom', path: ['startYear'], message: 'Doctorate start must precede defense' });
});
export const contractSchema = z.object({
  role: bilingual.optional(),
  startYear: year,
  endYear: year,
  ongoing: z.boolean().default(false),
  durationYears: z.number().positive().max(100).optional(),
  projects: z.array(slug).default([]),
  funding: z.array(funding).default([]),
  note: bilingual.optional(),
}).strict().superRefine((contract, ctx) => {
  if (contract.startYear !== null && contract.endYear !== null && contract.startYear > contract.endYear) {
    ctx.addIssue({ code: 'custom', path: ['endYear'], message: 'Contract end year must not precede its start year' });
  }
  if (contract.ongoing && contract.endYear !== null) {
    ctx.addIssue({ code: 'custom', path: ['endYear'], message: 'An ongoing contract must have an open end year' });
  }
});
export const peopleSchema = z.object({
  updated: isoDate,
  source: text,
  doctoralSince: z.number().int().min(1900).max(2200).default(2012),
  people: z.array(z.object({
    id: slug,
    name: text,
    initials: text.optional(),
    role: bilingual.optional(),
    status: z.enum(['current', 'former', 'unspecified']).default('unspecified'),
    showInTeam: z.boolean().default(true),
    contractBased: z.boolean(),
    projects: z.array(project).default([]),
    contracts: z.array(contractSchema).default([]),
    doctorate: doctorate.optional(),
    sources: z.array(z.url()).default([]),
    notes: text.optional(), // Editorial notes are never rendered publicly.
  }).strict()).min(1),
}).strict().superRefine((data, ctx) => {
  const ids = new Set<string>();
  data.people.forEach((person, index) => {
    if (ids.has(person.id)) ctx.addIssue({ code: 'custom', path: ['people', index, 'id'], message: 'Duplicate person ID' });
    ids.add(person.id);
    if (!person.showInTeam && !person.doctorate) ctx.addIssue({ code: 'custom', path: ['people', index, 'showInTeam'], message: 'A person outside the main roster needs a doctoral record' });
    const projects = person.projects.map(p => p.project);
    if (new Set(projects).size !== projects.length) ctx.addIssue({ code: 'custom', path: ['people', index, 'projects'], message: 'Duplicate project association' });
  });
});

export type Contract = z.infer<typeof contractSchema>;
export function contractYears(contract: Contract, lang: 'fr' | 'en') {
  const { startYear: start, endYear: end, ongoing } = contract;
  if (start !== null && end !== null) return start === end ? String(start) : `${start}–${end}`;
  if (start !== null && ongoing) return `${start}–${lang === 'fr' ? 'aujourd’hui' : 'present'}`;
  if (start !== null) return `${lang === 'fr' ? 'Début :' : 'Started:'} ${start}`;
  if (end !== null) return `${lang === 'fr' ? 'Fin :' : 'Ended:'} ${end}`;
  return ongoing ? (lang === 'fr' ? 'Contrat en cours' : 'Ongoing contract') : '';
}
export function contractDuration(contract: Contract, lang: 'fr' | 'en') {
  if (!contract.durationYears) return '';
  const years = new Intl.NumberFormat(lang).format(contract.durationYears);
  return `${years} ${lang === 'fr' ? (contract.durationYears === 1 ? 'an' : 'ans') : (contract.durationYears === 1 ? 'year' : 'years')}`;
}
