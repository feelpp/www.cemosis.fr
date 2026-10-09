# Local review

The first design is ready for local review. Publishing, domain cutover, and the
remaining archive migration are pending that review.

## Pages to review

- `/fr/` and `/en/`: homepage, expertise, selected projects, software and contact.
- `/fr/about/` and `/en/about/`: the current five-person team, supplied by the site
  owner on 9 October 2026. Historical personnel have not been carried into the
  current roster.
- `/fr/services/`, `/fr/software/`, `/fr/contact/` and their English versions.
- Project listings and the three translated project descriptions.
- The dated Open Access Week news item and its English version.

## Editorial checks

- Team spellings are as confirmed: Christophe Prud'homme, Vincent Chabannes,
  Juliette Antonczak, Gwenolle Chappron, Philippe Pincon.
- Roles reflect the owner's instructions. Confirm whether “civil engineer” /
  “ingénieure en génie civil” is the intended public wording for Gwenolle.
- Review the new French and English copy and the proposed visual palette.
- Contact details are copied from the existing site; confirm they are still current.
- Institutional context comes from the existing site and needs an owner review.
- Confirm rights/credits for the reused project images before launch.
- Review the legal notice and hosting information before domain cutover; the
  existing legal page describes WordPress/SiteGround and cannot be copied as a
  current notice for the replacement.

## Remaining migration

`migration-inventory.json` records the public REST API's 131 posts, 17 pages,
and top-level project links discovered on the existing projects page. Three
projects and one news article have been adapted into both languages. Structural
pages have been rewritten rather than copied. Remaining items are explicitly
pending, including old team pages, vacancies, events, legacy legal text and
category pages. No historical material has been silently classified as current.

Source API responses have been saved locally under `.migration-source/`, which is
ignored by Git. This is a public-content snapshot, not a full WordPress backup.
Before final migration, obtain a full export if available and check for additional
content types, media attachments and pages absent from these public endpoints.

## Publishing

The GitHub Actions workflow is prepared but has not been pushed or run. GitHub
Pages has not been enabled and the existing domain is unchanged. Review locally
first, then publish to the repository URL, verify redirects and HTTPS, and only
then arrange the custom-domain cutover.

## Projects, software and homepage update — 9 October 2026

- Funding presentations: Exa-MA, SAGE-HPC, ANR JNL-G and CoE HiDALGO2.
- Exa-MA URL and open repository supplied by the platform director:
  https://exa-ma.numpex.fr/ and https://github.com/numpex/exa-ma.
- JNL-G scientific summary checked against the supplied Drive overview and poster,
  and https://anr.fr/Projet-ANR-25-CE46-1157. Internal documents are not published.
  ANR lists November 2025 as the start; the kickoff deck lists December 2025.
  The public summary uses the confirmed 48-month duration without an exact start.
- HiFiMagnet's 2011 origin follows the director's correction; Cemosis as a platform
  was created later, so this refers to the collaboration's origins.
- Software foregrounded: Feel++, Ktirio Urban Building, Ktirio GeoM, Ktirio GUI.
- Homepage news comes from the latest selected GitHub discussions by publication
  date. Old WordPress news remains in the Archives disclosure on the news page.

SAGE-HPC summary updated from the supplied 21 January 2026 presentation;
Cemosis modelling/HPC expertise and Christophe Prud’homme’s WP4 leadership
verified on slides 18 and 21. Public presentation link is on the project page.


## CIFRE / AVNIR Energy announcement — 9 October 2026

Names confirmed by the director: Hanna Chetouane and AVNIR Energy. The public
announcement and funding summary use only a short scientific abstract, former
CSMI affiliation and Christophe Prud’homme’s supervision. The confidential
application is neither copied into the site nor linked from its pages. No exact
PhD start date, application details or experimental specifications are published.
The news date is the announcement date; the start is described as supplied by
the director. French and English summaries link to one another's corresponding
news/project pages within each language.

FLOOD: public summaries use the scientific scope of the supplied CNRS proposal (Google Doc 1P6uT5u_Mvkdeznf-5qRPVpyecgazSM0z9ewzO5PamMw), without reproducing contact details, CVs or the application. The public name FLOOD, award status, January submission, May response and late September–late November 2026 visit follow the user’s updated information; the proposal’s March–May schedule was tentative. Publication date is the announcement date, not the visit start.

Pierre-Antoine Senger announcement: 6 January 2026 start supplied by the owner. CSMI degree, Christophe Prud’homme as advisor and FOM/ROM scope verified against the JNL-G kickoff overview (Google Slides 1dI9xkoMzHbR1rinRnB53TdPOkxRCXCXYOBz0jGdk_Xg). Internal slides and personal profile details are not published.

JNL-G general assembly news: dates 9–10 September 2026 and LNCMI Grenoble location confirmed in work calendar event AG JNL-G; scientific programme checked against Christophe Trophime’s 7 September agenda email. Calendar end 11 September is exclusive. Public summary excludes addresses, contact information, private links, correspondence and unverified meeting outcomes.
