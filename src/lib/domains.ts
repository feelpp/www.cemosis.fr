export const domainIds = ['health', 'cities-buildings', 'environment', 'energy', 'industry'] as const;
export type DomainId = typeof domainIds[number];
export const domains = [
  { id: 'health', en: 'Health and biomedical engineering', fr: 'Santé et ingénierie biomédicale' },
  { id: 'cities-buildings', en: 'Cities and buildings', fr: 'Villes et bâtiments' },
  { id: 'environment', en: 'Environment and natural hazards', fr: 'Environnement et risques naturels' },
  { id: 'energy', en: 'Energy', fr: 'Énergie' },
  { id: 'industry', en: 'Industry and engineering', fr: 'Industrie et ingénierie' },
] satisfies { id: DomainId; en: string; fr: string }[];
