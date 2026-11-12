import snapshot from '../data/publications.json';
import { matchPublicationProjects } from './publication-projects';
import { getProjectCatalog } from './project-funding';
import type { Language } from './site';

// Both directions use this one index and only published, translated projects.
export async function getPublicationIndex(lang: Language) {
  const projects = await getProjectCatalog(lang);
  const publications = snapshot.publications.map(publication => {
    // Older valid offline snapshots predate funding metadata.
    const funding = publication.funding ?? {
      funding_s: [], anrProjectReference_s: [], anrProjectAcronym_s: [],
      anrProjectTitle_s: [], europeanProjectReference_s: [],
      europeanProjectAcronym_s: [], europeanProjectTitle_s: [],
    };
    return { ...publication, funding, projects: matchPublicationProjects({ funding }, projects) };
  });
  return { publications, projects: projects.filter(project => publications.some(p => p.projects.some(match => match.slug === project.slug))) };
}

export type LinkedPublication = Awaited<ReturnType<typeof getPublicationIndex>>['publications'][number];
export const publicationTypes: Record<string, string[]> = { ART: ['Article de revue', 'Journal article'], COMM: ['Communication', 'Conference paper'], COUV: ['Chapitre', 'Book chapter'], OUV: ['Ouvrage', 'Book'], REPORT: ['Rapport', 'Report'], THESE: ['Thèse', 'PhD thesis'], HDR: ['HDR', 'HDR'], POSTER: ['Poster', 'Poster'], UNDEFINED: ['Prépublication', 'Preprint'], SOFTWARE: ['Logiciel', 'Software'], DATA: ['Données', 'Dataset'] };
export const publicationTypeLabel = (code: string, lang: Language) => publicationTypes[code]?.[lang === 'fr' ? 0 : 1] ?? code;
export const publicationYear = (p: { year: string | number; date: string }, lang: Language) => String(p.year || p.date.slice(0, 4) || (lang === 'fr' ? 'Sans date' : 'Undated'));
