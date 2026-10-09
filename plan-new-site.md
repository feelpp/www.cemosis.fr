# Plan for the new Cemosis website

## Objective

Rebuild **www.cemosis.fr** as an appealing, accessible, bilingual website using
**Astro**, with content maintained in GitHub and static hosting on **GitHub Pages**.
Routine content updates should require editing Markdown or structured data, without
changing page layouts or application code.

- Working directory: `/Users/prudhomm/Devel/Cemosis/www.cemosis.fr`
- GitHub repository: <https://github.com/feelpp/www.cemosis.fr>
- Existing website and migration source: <https://www.cemosis.fr/>
- Framework decision: **Astro**, agreed on 9 October 2026.
- Initial publishing target: `https://feelpp.github.io/www.cemosis.fr/`
- Final publishing target: `https://www.cemosis.fr/`, after review and domain setup.

## Current state

The bilingual Astro site is implemented locally with concise institutional text,
the confirmed current team, the supplied Cemosis logo, the official Unistra signature
and locally hosted Unistra A fonts. It includes selected archived projects and news,
46 relevant public Feel++ discussions with locally imported illustrations and a
movie, and eight Ktirio Urban Building videos from the Cemosis YouTube channel.
The homepage now prioritises recent GitHub publications and real simulation
visuals. Four funding projects (Exa-MA, SAGE-HPC, JNL-G, HiDALGO2) are distinct
from the four main software products (Feel++, Ktirio Urban Building, GeoM, GUI).

Editing documentation, asset provenance, legacy redirects, metadata, a link checker
and a GitHub Pages workflow are in place. Local review remains the current stage;
full archive migration and publication are pending. No GitHub publication or domain
change has been performed.

## Proposed technical approach

| Area | Approach |
| --- | --- |
| Framework | Astro with static output |
| Styling | A small shared CSS design system and reusable Astro components |
| Editorial content | Markdown with YAML frontmatter |
| Structured content | JSON or YAML for institutional links, partners, and other repeated data |
| Validation | Astro content collection schemas and TypeScript checks |
| Languages | French and English, with French as the default entry point |
| Deployment | GitHub Actions builds and deploys to GitHub Pages |
| Dependency management | pnpm with a committed lockfile; Node 24 |
| Search visibility | Page titles, descriptions, canonical URLs, language alternatives, sitemap, and social metadata |
| Optional editor | Pages CMS if contributors want a browser form instead of Markdown |

Use ordinary Markdown for editorial content. Reserve custom components for pages
that need scientific visuals or interactions. Keep the initial dependency set
small and avoid requiring a database or server for routine publishing.

Astro is MIT licensed. The repository's code license and the treatment of existing
content, photographs, and logos should be documented separately.

## Design direction

Create a contemporary scientific identity that makes Cemosis's work understandable
to researchers, companies, institutions, and prospective collaborators.

- Preserve the Cemosis name and existing logo.
- Use generous whitespace, readable typography, clear navigation, and strong page
  hierarchy.
- Explore an off-white background with deep green or teal and restrained warm
  accents; reconcile the palette with the existing brand before finalizing it.
- Feature authentic simulation imagery and project illustrations where available.
- Use a mathematical surface illustration on the homepage, explicitly presented
  as an illustration rather than a research result.
- Keep motion subtle and honor reduced-motion preferences.
- Make project cards, calls to action, and article layouts work well on mobile.

The homepage should explain what Cemosis does, present its expertise, show selected
collaborations, introduce its open-source software, and make contact easy.

## Site structure

| Section | Purpose and content |
| --- | --- |
| Home | Mission, expertise, selected projects, software, news, and contact invitation |
| Expertise / services | Modeling, simulation, optimization, data science, HPC, signal and image processing; collaboration, training, and computing services |
| Projects | Browsable project cards and individual project pages |
| Software | Feel++, AngioTK, and verified links to code and documentation |
| About | Mission, institutional context, collaboration approach, and reviewed team information |
| News | Dated news articles, publications, and event reports |
| Contact | Email, telephone, address, and collaboration invitation |

Inventory the existing legal pages, events, institutional links, partner lists, and
other sections before deciding where each belongs. Add dedicated sections when
the content justifies them. Do not silently discard useful existing pages.

Use `/fr/` and `/en/` routes. Match translation pairs using a stable slug so the
language switch can preserve the current page. If a translation is unavailable,
provide an explicit fallback and omit misleading language-alternative metadata.

## Content organization and editing

Proposed repository structure:

```text
src/
  components/             Reusable visual components
  layouts/                Shared page layouts
  styles/                 Design tokens and global CSS
  lib/                    Language labels and URL helpers
  content.config.ts       Content schemas
  content/
    pages/{fr,en}/        Expertise, about, software, contact
    projects/{fr,en}/     One Markdown file per project and language
    news/{fr,en}/         One Markdown file per article and language
  data/                   Shared institutional and partner data
  pages/                  Static route definitions
public/
  images/                 Local logos, project images, and social artwork
templates/                Copyable project and news templates
scripts/                  Production-output verification
.github/workflows/        Pull-request checks and Pages deployment
```

Project entries should include title, summary, language, stable slug, original
publication date, category, image, alternative text, featured status, draft status,
and original source URL. The body describes the problem, objectives, methods,
software, collaborators, and results where supported by the source.

News entries should include title, summary, language, stable slug, publication
date, category, draft status, and source information for migrated articles.

Document this contributor workflow in the README:

1. Copy a content template or edit an existing Markdown file in GitHub.
2. Add or update text, metadata, and any local images.
3. Submit a pull request.
4. Let automated validation run, then review the content.
5. Merge to `main` to trigger publication once deployment is enabled.

Draft entries must be excluded from public listings and generated detail pages.
Provide examples of adding a project, publishing news, updating contact details,
and creating a translation.

## Migration approach

1. **Inventory the existing site.** Record URLs, page types, dates, assets, internal
   links, and the destination for each page. Include paginated news archives.
2. **Recover source content and assets.** Prefer an available WordPress export;
   otherwise extract public pages. Store necessary images locally with a source
   and attribution record.
3. **Build the first representative pages.** Use selected projects such as
   4fastsim-ibat, Magnetic micro-swimmer, and Data4Urbanism to validate layouts.
4. **Review facts and translations.** Keep original publication dates. Check team
   roles, institutional details, software links, and contact information before
   treating older statements as current.
5. **Migrate the remaining content in batches.** Track migrated, pending, archived,
   and intentionally retired pages in the inventory.
6. **Preserve URL continuity.** Retain existing paths where practical. For changed
   paths, create static redirect pages supported by GitHub Pages, linking to the
   new destination. Verify redirects under both deployment configurations.

Historical projects and news must be visibly dated. Do not present old vacancies,
past events, or unverified project statuses as current opportunities. Avoid
invented metrics, results, partner relationships, or personnel information.

## Implementation phases

### Phase 1 — Complete the foundation

- Complete styling, design tokens, and responsive navigation.
- Add verified local branding assets and image provenance notes.
- Populate the first French and English content entries.
- Confirm draft filtering and translation fallback behavior.
- Add editing templates and a practical README.
- Get a successful production build and content/type validation.

### Phase 2 — Review the first design

- Finish the homepage and representative project, news, and general pages.
- Inspect desktop and mobile layouts in a browser.
- Check contrast, keyboard navigation, focus visibility, menu behavior, image
  alternative text, heading order, and reduced-motion behavior.
- Review the visual direction and wording before expanding the migration.

### Phase 3 — Migrate and reconcile content

- Complete the source inventory and migration batches.
- Review translations, team information, partners, and institutions.
- Add legacy-path redirects and repair internal links.
- Verify source attribution and local image coverage.

### Phase 4 — Prepare GitHub Pages deployment

- Add pull-request checks for dependency installation, content/type validation,
  production build, and internal links.
- Add deployment from `main` using GitHub Actions and the committed lockfile.
- Restrict deployment permissions to what GitHub Pages needs.
- Configure the repository's Pages source as GitHub Actions.
- Publish and verify the repository-path site before changing the custom domain.

### Phase 5 — Move the domain

- Review the published replacement and migration inventory.
- Configure `www.cemosis.fr` in GitHub Pages and update DNS when the replacement
  is ready for launch.
- Set `SITE_URL=https://www.cemosis.fr` and `SITE_BASE=/` for the domain build.
- Add the custom-domain configuration as appropriate for the deployment workflow.
- Verify HTTPS, the apex-domain behavior, assets, canonical URLs, sitemap,
  language switching, and legacy URL redirects.
- Keep the previous site's content/export available for recovery during cutover.

## Verification and acceptance criteria

- `pnpm check` and `pnpm build` succeed.
- The generated output has no broken internal page or asset links.
- Both the repository-path build and the custom-domain build work correctly.
- French and English navigation and content routes work, including translations
  and fallback cases.
- Draft content does not appear in production output.
- Desktop and mobile layouts are inspected, including the navigation menu.
- Keyboard users can reach all navigation and primary actions.
- All published pages have appropriate titles, descriptions, canonical URLs, and
  language metadata; the 404 page is excluded from indexing.
- Images are local, appropriately sized, and have meaningful alternative text.
- Historical content preserves dates and is clearly distinguished from current
  information.
- A contributor can add a project or news item by following the README and copying
  a template, without modifying layout code.
- GitHub Actions validates pull requests and deploys successful `main` builds.

## Choices to confirm during review

- Final visual palette and any institutional branding requirements.
- French as the default language and which pages need both languages at launch.
- Current team, partners, institutional links, and contact details.
- Scope and priority of the historical archive migration.
- Whether contributors need Pages CMS in addition to GitHub editing.
- Code/content licensing and required legal-page information.

## Reference documentation

- Astro: <https://astro.build/>
- Content collections: <https://docs.astro.build/en/guides/content-collections/>
- GitHub Pages deployment: <https://docs.astro.build/en/guides/deploy/github/>
- Internationalization: <https://docs.astro.build/en/guides/internationalization/>
- Optional Pages CMS: <https://pagescms.org/docs/>
