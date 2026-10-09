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
