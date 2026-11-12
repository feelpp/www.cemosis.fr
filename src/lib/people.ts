import { parse } from 'yaml';
import source from '../data/people.yaml?raw';
import { peopleSchema } from './people-schema';
import { canonicalProjectSlug, fundingSources, getProjectCatalog } from './project-funding';
import { route, type Language } from './site';

export const peopleData = peopleSchema.parse(parse(source));
export async function getPeopleDirectory(lang: Language) {
  const catalog = await getProjectCatalog(lang);
  function projectLink(slug: string) {
    const canonical = canonicalProjectSlug(slug);
    const project = catalog.find(project => project.slug === canonical);
    if (!project) throw new Error(`Unknown or unpublished people project: ${slug}`);
    return { slug: canonical, title: project.title, href: route(lang, `projects/${canonical}`) };
  }
  return peopleData.people.map(person => {
    const projects = person.projects.map(({ project, role }) => ({ ...projectLink(project), role: role?.[lang] }));
    const contracts = person.contracts.map(contract => ({
      ...contract,
      projectLinks: contract.projects.map(projectLink),
      funders: contract.funding.map(funding => {
        if (funding.project) return { ...projectLink(funding.project), project: canonicalProjectSlug(funding.project) };
        const source = fundingSources[funding.source!];
        if (!source) throw new Error(`Unknown people funding source: ${funding.source}`);
        return { title: source.title[lang], href: source.url, project: undefined };
      }),
    }));
    return { ...person, projects, contracts };
  });
}
