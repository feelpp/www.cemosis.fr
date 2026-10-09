export const languages = ['fr', 'en'] as const;
export type Language = typeof languages[number];
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;
export const route = (lang: Language, path = '') => url(`${lang}/${path ? `${path.replace(/\/$/, '')}/` : ''}`);
export const dateLabel = (date: Date, lang: Language) => new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);

export const labels = {
  fr: {
    publications: 'Publications', home: 'Accueil', services: 'Recherche', projects: 'Projets', software: 'Logiciels', about: 'À propos', news: 'Actualités', contact: 'Contact',
    skip: 'Aller au contenu', menu: 'Menu', close: 'Fermer', read: 'Découvrir le projet', allProjects: 'Tous les projets',
    eyebrow: 'Université de Strasbourg',
    heroA: 'Modélisation', heroB: 'et simulation', heroC: '',
    heroText: 'Cemosis est une plateforme de recherche de l’Université de Strasbourg, dédiée à la modélisation, à la simulation et au calcul scientifique.',
    explore: 'Nos activités', meshCaption: 'Surface paramétrique', meshNote: 'Surface mathématique illustrative',
    mission: 'Domaines de recherche', missionText: 'Mathématiques appliquées, méthodes numériques et collaborations interdisciplinaires.',
    hosted: 'Une plateforme de l’Université de Strasbourg, à l’IRMA.',
    projectsEyebrow: 'Projets', projectsTitle: 'Projets de recherche',
    projectsIntro: 'Énergie, santé, mobilité : une sélection de projets des archives.',
    softwareEyebrow: 'Logiciels', softwareTitle: 'Logiciels scientifiques',
    softwareText: 'Feel++ et AngioTK : des outils ouverts pour la simulation numérique et le traitement d’images.',
    softwareLink: 'Nos logiciels', archive: 'Archives', newsTitle: 'Actualités', allNews: 'Toutes les actualités',
    ctaEyebrow: 'Contact', ctaTitle: 'Contacter la plateforme', ctaText: 'Recherche, ingénierie, projets et collaborations.',
    footerText: 'Plateforme de recherche de l’Université de Strasbourg.', footerLinks: 'Explorer', footerContact: 'Nous retrouver',
    projectPageTitle: 'Projets et financements', projectPageIntro: 'Les programmes qui soutiennent la recherche et le développement des logiciels de Cemosis.',
    newsIntro: 'La vie de Cemosis et les publications de la communauté Feel++, Ktirio, Swimmer et HiFiMagnet.',
    published: 'Publié le', source: 'Source originale', backProjects: 'Retour aux projets', backNews: 'Retour aux actualités',
    archiveNote: 'Cette page présente un projet issu des archives de Cemosis. La date correspond à sa publication originale.',
    newsArchiveNote: 'Cette actualité provient des archives de Cemosis et décrit un événement passé.',
    noNews: 'Aucune actualité publiée pour le moment.', noProjects: 'Aucun projet publié pour le moment.',
    notFound: 'Page introuvable', notFoundText: 'La page demandée est introuvable. Retrouvez nos expertises et projets depuis l’accueil.',
  },
  en: {
    publications: 'Publications', home: 'Home', services: 'Research', projects: 'Projects', software: 'Software', about: 'About', news: 'News', contact: 'Contact',
    skip: 'Skip to content', menu: 'Menu', close: 'Close', read: 'Explore the project', allProjects: 'All projects',
    eyebrow: 'University of Strasbourg',
    heroA: 'Modelling', heroB: 'and simulation', heroC: '',
    heroText: 'Cemosis is a University of Strasbourg research platform for modelling, simulation and scientific computing.',
    explore: 'Research activities', meshCaption: 'Parametric surface', meshNote: 'Illustrative mathematical surface',
    mission: 'Research areas', missionText: 'Applied mathematics, numerical methods and interdisciplinary collaboration.',
    hosted: 'A University of Strasbourg platform, hosted at IRMA.',
    projectsEyebrow: 'Projects', projectsTitle: 'Research projects',
    projectsIntro: 'Selected projects from our archives: energy, health and mobility.',
    softwareEyebrow: 'Software', softwareTitle: 'Scientific software',
    softwareText: 'Feel++ and AngioTK: open tools for numerical simulation and image processing.',
    softwareLink: 'Our software', archive: 'Archive', newsTitle: 'News', allNews: 'All news',
    ctaEyebrow: 'Contact', ctaTitle: 'Contact the platform', ctaText: 'Research, engineering, projects and collaborations.',
    footerText: 'A University of Strasbourg research platform.', footerLinks: 'Explore', footerContact: 'Find us',
    projectPageTitle: 'Projects and funding', projectPageIntro: 'Programmes supporting Cemosis research and scientific software development.',
    newsIntro: 'Cemosis news and publications from the Feel++, Ktirio, Swimmer and HiFiMagnet community.',
    published: 'Published on', source: 'Original source', backProjects: 'Back to projects', backNews: 'Back to news',
    archiveNote: 'This page presents a project from the Cemosis archive. The date is its original publication date.',
    newsArchiveNote: 'This story comes from the Cemosis archive and describes a past event.',
    noNews: 'No published news yet.', noProjects: 'No published projects yet.',
    notFound: 'Page not found', notFoundText: 'We could not find this page. Explore our expertise and projects from the homepage.',
  },
};
export const expertise = {
  fr: [
    { code: '01 / MSO', title: 'Modélisation & simulation', text: 'Modèles mathématiques, méthodes numériques et optimisation.' },
    { code: '02 / DATA', title: 'Science des données', text: 'Analyse statistique et apprentissage.' },
    { code: '03 / HPC', title: 'Calcul haute performance', text: 'Calcul parallèle et infrastructures scientifiques.' },
    { code: '04 / IMAGE', title: 'Signal & images', text: 'Traitement, reconstruction et analyse.' },
  ],
  en: [
    { code: '01 / MSO', title: 'Modelling & simulation', text: 'Mathematical models, numerical methods and optimisation.' },
    { code: '02 / DATA', title: 'Data science', text: 'Statistical analysis and machine learning.' },
    { code: '03 / HPC', title: 'High-performance computing', text: 'Parallel computing and scientific infrastructure.' },
    { code: '04 / IMAGE', title: 'Signal & images', text: 'Processing, reconstruction and analysis.' },
  ],
};

export const newsDateLabel = (date: Date, lang: Language, endDate?: Date) => endDate
  ? new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).formatRange(date, endDate)
  : dateLabel(date, lang);
