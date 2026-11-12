/** Match only explicit funding evidence, never publication topics or authors. */
export interface FundingMetadata {
  funding_s?: string[];
  anrProjectReference_s?: string[];
  anrProjectAcronym_s?: string[];
  anrProjectTitle_s?: string[];
  europeanProjectReference_s?: string[];
  europeanProjectAcronym_s?: string[];
  europeanProjectTitle_s?: string[];
}
export interface PublicationProject {
  slug: string;
  title: string;
  aliases?: string[];
  publicationMatching: { references: string[]; names: string[] };
}
export interface ProjectMatch {
  slug: string;
  title: string;
  evidence: { field: keyof FundingMetadata; value: string }[];
}
/** Project-specific grants are exact matching keys; institutional source grants
 * are displayed for provenance and never inherited by supported projects. */
export function projectPublicationRules(project: {
  grants?: { reference: string }[];
  publicationMatching?: { references?: string[]; names?: string[] };
}) {
  return {
    references: [...new Set([...(project.grants ?? []).map(grant => grant.reference), ...(project.publicationMatching?.references ?? [])])],
    names: project.publicationMatching?.names ?? [],
  };
}
export const normalizeFunding = (value: string) => value.normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

const referenceFields = ['anrProjectReference_s', 'europeanProjectReference_s'] as const;
const nameFields = ['anrProjectAcronym_s', 'anrProjectTitle_s', 'europeanProjectAcronym_s', 'europeanProjectTitle_s'] as const;
const contains = (value: string, alias: string) => {
  const normalized = normalizeFunding(alias);
  return Boolean(normalized) && ` ${normalizeFunding(value)} `.includes(` ${normalized} `);
};

export function matchPublicationProjects(publication: { funding?: FundingMetadata }, projects: PublicationProject[]): ProjectMatch[] {
  const funding = publication.funding ?? {};
  return projects.flatMap(project => {
    const { references } = project.publicationMatching;
    const names = [...project.publicationMatching.names, ...(project.aliases ?? [])];
    const evidence: ProjectMatch['evidence'] = [];
    for (const field of referenceFields) {
      for (const value of funding[field] ?? []) {
        if (references.some(alias => normalizeFunding(alias) === normalizeFunding(value))) evidence.push({ field, value });
      }
    }
    for (const field of nameFields) {
      for (const value of funding[field] ?? []) {
        if (names.some(alias => normalizeFunding(alias) === normalizeFunding(value))) evidence.push({ field, value });
      }
    }
    for (const value of funding.funding_s ?? []) {
      if ([...references, ...names].some(alias => contains(value, alias))) evidence.push({ field: 'funding_s', value });
    }
    return evidence.length ? [{ slug: project.slug, title: project.title, evidence }] : [];
  });
}
