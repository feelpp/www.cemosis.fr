# Cemosis website

A bilingual Astro website, with Markdown content and GitHub Pages deployment.
The first design is ready for **local review**. The existing website and domain
have not been changed. See [the plan](plan-new-site.md) and
[the review checklist](docs/review-checklist.md) for scope and remaining migration.

## Run locally

Install Node 24 and pnpm (the required versions are in `.nvmrc` and `package.json`).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:4321/www.cemosis.fr/fr/` or
`http://localhost:4321/www.cemosis.fr/en/`. The repository path is intentional:
it matches the first GitHub Pages publishing target.

```sh
pnpm check
pnpm build
pnpm verify:links
pnpm preview
```

`verify:links` checks generated page links, assets, anchors, canonical URLs,
metadata, publication/draft output and legacy redirects. To exercise the final
custom-domain configuration locally:

```sh
SITE_URL=https://www.cemosis.fr SITE_BASE=/ pnpm build
SITE_URL=https://www.cemosis.fr SITE_BASE=/ pnpm verify:links
```

Rebuild without those variables to restore the repository-path output.

## Edit content in GitHub

1. Open an existing Markdown file in `src/content/`, or copy a template from
   `templates/` into the appropriate collection/language folder.
2. Edit the YAML frontmatter and Markdown body.
3. Add images to `public/images/` and provide descriptive alternative text.
4. Submit a pull request and wait for validation.
5. Review and merge. After Pages is enabled, merges to `main` publish automatically.

### Add a project

Copy `templates/project.md` to `src/content/projects/fr/your-project.md` or
`src/content/projects/en/your-project.md`. Set `lang` to the folder's language,
choose a unique `slug`, and set the publication date. Keep `draft: true` while
editing; set it to `false` to publish. Set `featured: true` for homepage inclusion
(the homepage shows the three newest featured projects).

The `image` value starts with `/images/`; the route helper adds the publishing
base automatically. `historical: true` shows an archive notice. `source` is
optional and intended for migrated content; omit it for a new original project.
Do not label new work historical.

### Publish news

Copy `templates/news.md` into `src/content/news/fr/` or `src/content/news/en/`.
Use the actual publication date, update the summary, write the body and set
`draft: false`. Published articles appear automatically on the news listing and
the three newest appear on the homepage.

### Add a translation

Create a file in the other language's folder, keeping the same public `slug`.
Translate the title, description, category, image alternative text and body, and
set `lang` accordingly. The language switch preserves the detail page when both
published translations exist. Otherwise it links to the other-language homepage
and identifies that fallback in its accessible label. Alternative-language SEO
links are emitted only for published translation pairs.

### Update the team or contact details

- Current names and bilingual roles: `src/data/team.json`. Update its `updated`
  date when the roster changes. The About page renders this data automatically.
- Institutional links: `src/data/institutions.json`.
- Contact content: `src/content/pages/{fr,en}/contact.md`.
- Shared footer contact details: `src/layouts/Site.astro`.
- Navigation and interface labels: `src/lib/site.ts`.

Use ordinary Markdown links for external pages. For internal content links, use a
relative path between rendered pages (for example `../software/` from a general
page). Avoid root-relative links that omit the GitHub Pages repository prefix.

## Deploy after local review

The workflow `.github/workflows/site.yml` validates pull requests, checks a
custom-domain build, then creates the publishing build. Only a successful build
on `main` can deploy. This workflow is prepared locally; no publication has
occurred yet.

1. Push the reviewed changes to GitHub.
2. In repository **Settings → Pages**, select **GitHub Actions** as the source.
3. Merge to `main` or run the workflow manually on `main`.
4. Verify `https://feelpp.github.io/www.cemosis.fr/` before arranging domain cutover.

For the final domain, set repository Actions variables `SITE_URL` to
`https://www.cemosis.fr` and `SITE_BASE` to `/`. Configure the custom domain in
Pages and update DNS with the domain administrator. Ensure HTTPS is enabled and
decide how the apex `cemosis.fr` should redirect. If maintaining a `public/CNAME`
file, add it only as part of that reviewed cutover. Retain a backup of the old site.

Legacy static redirects are defined in `src/data/redirects.json`; add a mapping
when migrating another page. GitHub Pages serves these as HTML redirect pages,
not HTTP 301 responses. The 404 page provides French and English home links.

## Optional browser editor

GitHub's Markdown editor works without an additional service. Pages CMS can be
added after the content structure is reviewed if contributors prefer forms. No
CMS account, authentication service or integration has been configured.

## Sources and licensing

The current team was supplied by the site owner. Initial project and news text
was adapted from the existing Cemosis site; dates and source URLs are preserved.
See `docs/migration-inventory.json` and `docs/assets.md`.

Astro is MIT licensed. A license for this site's code and content has not yet been
selected. Existing logos and images retain their original rights. Review the
legal notice and asset credits before public launch.


### Discussions and videos

The local site includes selected public Feel++ discussions about Feel++, Ktirio
Urban Building, Swimmer and Hifimagnet. Topic rules are in
`src/data/discussion-topics.json`. Refresh using `pnpm import:discussions` with an
authenticated `gh` login or `GITHUB_TOKEN`, then `pnpm import:media`. The checked-in
snapshot remains usable when GitHub is unavailable. A `DISCUSSIONS_TOKEN` repository
secret can supply read access for the deployment workflow if its default token
cannot read the source repository's discussions.

The video gallery is curated in `src/data/videos.json`; add a YouTube ID, source
URL, title and topic, then run `pnpm import:media` to cache its thumbnail. Players
load only on click. GitHub movies are local; QuickTime conversion needs ffmpeg.
Media provenance and unavailable older videos are documented in `docs/assets.md`.

Funding summaries are edited in `src/content/funding/{fr,en}/`. They appear on
the homepage and the projects page, ahead of the archives. Software descriptions
and repository links are maintained in `src/data/software.json`. Homepage news
combines published platform announcements with imported GitHub discussions,
sorted by their original publication dates. Historical news stays in the archives.

### Link news to projects

Add `projects: ["jnl-g"]` to a news article’s frontmatter (in each translation). Use project slugs; an article can reference several projects. The corresponding project pages automatically show published news in the same language, newest first. Drafts are excluded.
