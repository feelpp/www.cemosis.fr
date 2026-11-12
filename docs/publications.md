# HAL publications

The bilingual `/en/publications/` and `/fr/publications/` pages use the complete
**CEMOSIS HAL collection**, including publications by former platform members.
The exact query is `collCode_s:CEMOSIS`; no author, year or scientific-domain
filter is applied. This is the collection's bibliography, not a claim that every
publication ever produced by Cemosis has been deposited or assigned to it.

## Harvest locally

Python 3.10 or newer is required. The tools use only the Python standard library:
no pip installation, credentials or third-party Python dependencies are needed.

```sh
python3 scripts/import-publications.py
python3 scripts/import-publications.py --strict
python3 scripts/test-publications.py
# With the Node toolchain activated as described in AGENTS.md:
node scripts/test-publication-projects.mjs
corepack pnpm import:publications
corepack pnpm build
corepack pnpm verify:links
```

The snapshot is `src/data/publications.json`. A complete successful harvest
replaces it atomically. Pagination retrieves every result and rejects a changing
or incomplete response. Multiple versions of one HAL identifier are reduced to
one reference using the upstream published-metadata/version preference. Different
HAL identifiers are retained even if titles match; do not silently merge distinct
records. Public titles and author names remain in their source language.

On network/API failure a valid existing CEMOSIS snapshot is retained with a
visible workflow warning. `--strict` instead fails, useful for diagnosing an
import. The displayed harvest date always belongs to the last successful
snapshot. Review and commit the snapshot after a local refresh if the repository's
offline fallback should be updated.

## Automatic updates

`.github/workflows/site.yml` harvests before every main-branch deployment and on
a weekly schedule (Monday 05:23 UTC). A scheduled run builds and deploys fresh
references and statistics through the existing GitHub Pages workflow. It does
not commit generated data back to Git. Pull requests and offline local builds use
the checked-in snapshot. The schedule starts working once the workflow is on the
repository's default `main` branch; GitHub can delay scheduled runs.

The existing `SITE_URL` and `SITE_BASE` deployment variables are preserved.
Local development still defaults to `/www.cemosis.fr`; the custom domain can
build at `/`.

Statistics count deduplicated records, publication years and HAL document types;
DOI/full-text counts indicate recorded links, and the open-access count reflects
HAL's `openAccess_bool`. These are not citation metrics. Filters affect the
publication list, while overview statistics always describe the full collection.

## Publication ↔ project links

Both language versions use one shared association index in
`src/lib/publications.ts`. Each project page lists its associated publications;
each publication links back to its associated published projects in the same
language. The publication page also supports a project filter and shareable
`?project=exama#publication-list` URLs. Without JavaScript all references and
project links remain visible.

The harvest retains HAL's `funding_s` statements and the ANR/European project
reference, acronym and title fields under each publication's `funding` object.
These are also available in expandable details alongside the reference. HAL's
multi-valued fields are kept separately, since their array positions do not
necessarily identify the same project. No PDF downloads or full-text extraction
are performed; acknowledgments not exposed in HAL metadata cannot be matched.

The shared `src/data/project-funding.yaml` is the source of truth for both
languages. Keys are project page slugs. Each entry can define publication matching
rules and funding relationships, with optional bilingual descriptions of the
supported work:

```yaml
projects:
  exama:
    grants:
      - reference: ANR-22-EXNU-0002
        program: ANR · NumPEx
        source: https://anr.fr/Projet-ANR-22-EXNU-0002
    publicationMatching:
      names: [Exa-MA, ExaMA, Methods and Algorithms for Exascale]
  brain-organ-on-chip:
    publicationMatching:
      names: [Brain Organ-on-Chip]
    fundedBy:
      - project: exama
        aspects:
          en: [High-performance computing (HPC), High-performance data analytics (HPDA), Inverse problems]
          fr: [Calcul haute performance (HPC), Analyse de données haute performance (HPDA), Problèmes inverses]
```

Funding relationships appear on the supported project's page and in a reverse
“Supported projects” list on the funding project's page. OOC records Exa-MA
support for HPC, HPDA and inverse problems; Ktirio records Exa-MA and HiDALGO2
support, already described in its project text. These relationships do not
propagate publication attribution: a paper acknowledging Exa-MA needs separate
evidence to be attributed to OOC or Ktirio. HAL matching rules stay specific to
each project. Exa-MA support is also recorded for SAGE-HPC, JNL-G, CIFRE AVNIR
Energy (partial funding) and FLOOD.

For institutional funding without a local project page, define a bilingual entry
under `fundingSources` and use `source` instead of `project` in `fundedBy`.
For example, FLOOD records `source: cnrs-poste-rouge` with
`recipient: Abdoulaye Samaké`. `coverage: partial` marks partial funding; omitted
coverage makes no claim about the share funded. Recipients, scopes and partial
funding labels are displayed on project pages in both languages.

Relationships can also specify `status: active` or `status: past`, plus a bilingual
`period` description when needed. These describe the support relationship, not
the lifecycle of the funding programme. Institutional sources can supply an
optional `grants` (each with `reference`, `program` and `source`) and a `url`. Micro-swimmer records active SAGE-HPC
support, past ANR NEMO support, and past ITI IRMiA++ funding for Céline Van
Landeghem ending around November–December 2025. Micro-swimmer also has active
Exa-MA support. The same statuses appear in the reverse supported-project lists
on the SAGE-HPC and Exa-MA pages.

Project renamings are stored as `aliases` on the canonical project. Ktirio Urban
Building has `aliases: [4fastsim-ibat]`. Historical funding acknowledgments using
the former name map to Ktirio, with one association even if both names occur.
Both localized old URLs and the original unlocalized URL redirect to Ktirio.
Alias pages are excluded from listings and the sitemap; the archived description
has been consolidated into Ktirio's history section. News project IDs also resolve
aliases to the canonical project.

Project-level `grants` are displayed on the project's own page and alongside
its funding contributions to other projects. They also supply exact publication
matching keys. SAGE-HPC uses **ANR-25-EXNU-0004**, verified in HAL's ANR project
registry (record 307157); JNL-G uses **ANR-25-CE46-1157** and Exa-MA uses
**ANR-22-EXNU-0002**.

ITI IRMiA++ lists two supporting grants from its official acknowledgment:
**ANR-10-IDEX-0002** (IdEx Unistra) and **ANR-20-SFRI-0012** (SFRI-STRAT’US).
These are shared institutional funding references, not unique micro-swimmer
project identifiers, and are not inherited as publication matching keys. The
older Labex IRMIA reference ANR-11-LABX-0055 is distinct from ITI IRMiA++.

The YAML is validated at build time, rejecting invalid fields,
unknown project slugs, self-funding links and duplicate funders.

`src/lib/publication-projects.ts` matches whole structured references and names,
or bounded mentions in funding statements, ignoring case, accents and punctuation
separators. Every association retains its source field and value as evidence in
the index. References and names must be specific to the project: a shared funder,
programme, software, author, abstract or research topic is not evidence of a
particular project's contribution. Micro-swimmer is explicitly associated with
NEMO grant ANR-21-CE45-0013; a generic IRMIA acknowledgment is not sufficient to
assign a paper to it. Brain Organ-on-Chip is not equated to every publication
funded by D3 4Health.

Projects without a match display a scoped empty message, not a claim that no
publications exist. Additional funders without a local project page remain
visible in funding details. New harvests automatically update both directions.
`verify:links` checks that each rendered association has its reciprocal link in
both languages, verifies reciprocal project-funding links, and runs the usual
internal-link checks.

## Tool provenance

`scripts/harvest/hal.py` imports/adapts the standalone API, formatting and
version-selection core from [`numpex/exa-ma/harvest/hal.py`](https://github.com/numpex/exa-ma/blob/7b3c1bb4b071e3a893babfa10972aa1713c94e64/harvest/hal.py).
Source commit: `7b3c1bb4b071e3a893babfa10972aa1713c94e64`.
The original ExaMA repository has not been modified. Its optional configuration,
CLI and AsciiDoc/BibTeX exporters are omitted; errors now raise exceptions so the
Cemosis wrapper can retain cached data. Empty domain/year filters are deliberately
passed, and their log messages correctly report the disabled filters.
No upstream license file was found in the supplied checkout; this attribution
makes no new license claim for the imported code.

The layout takes inspiration from the [Exa-MA HAL publications page](https://exa-ma.numpex.fr/publications-hal.html),
with Cemosis-specific collection scope, bilingual labels and accessible local
search/year/type filters. The site never downloads publication PDFs: full-text
links point to public HAL records/files.
