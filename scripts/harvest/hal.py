"""HAL harvesting core adapted from numpex/exa-ma harvest/hal.py.
Upstream commit: 7b3c1bb4b071e3a893babfa10972aa1713c94e64.
See docs/publications.md for provenance and local changes.
"""
import json
import sys
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

# HAL API endpoint
HAL_API_URL = "https://api.archives-ouvertes.fr/search/"

# Default search parameters matching the Exa-MA deliverables query
# ANR-22-EXNU-0002 is the official ANR project identifier for Exa-MA
# Using anrProjectReference_s field for precise matching (not general text search)
DEFAULT_ANR_PROJECT = "ANR-22-EXNU-0002"
DEFAULT_QUERY = f"anrProjectReference_s:{DEFAULT_ANR_PROJECT}"
DEFAULT_DOMAINS = ["math", "info", "stat", "phys"]
DEFAULT_YEARS = [2023, 2024, 2025]
DEFAULT_ROWS = 100  # Max results per request

# Fields to retrieve from HAL
FIELDS = [
    "docid",
    "halId_s",
    "version_i",
    "uri_s",
    "doiId_s",
    "title_s",
    "authFullName_s",
    "authFirstName_s",
    "authLastName_s",
    "publicationDate_s",
    "volume_s",
    "issue_s",
    "page_s",
    "publisher_s",
    "language_s",
    "producedDate_s",
    "publicationDateY_i",
    "docType_s",
    "docTypeLabel_s",
    "journalTitle_s",
    "conferenceTitle_s",
    "abstract_s",
    "keyword_s",
    "domain_s",
    "openAccess_bool",
    "citationFull_s",
    "fileMain_s",
]


# HAL document type codes to normalized publication types.
#
# Notes:
# - HAL uses short codes like ART/COMM/REPORT/etc.
# - This mapping intentionally stays coarse and user-facing.
HAL_DOC_TYPE_TO_PUBLICATION_TYPE: dict[str, tuple[str, str]] = {
    # Peer-reviewed / scholarly
    "ART": ("journal-article", "Article in journal"),
    "COMM": ("conference-paper", "Conference paper"),
    "COUV": ("book-chapter", "Book chapter"),
    "OUV": ("book", "Book"),
    # Grey literature / theses
    "REPORT": ("report", "Report"),
    "THESE": ("thesis", "Thesis"),
    "HDR": ("thesis", "HDR"),
    # Other scholarly outputs
    "POSTER": ("poster", "Poster"),
    "PATENT": ("patent", "Patent"),
    "SOFTWARE": ("software", "Software"),
    "DATA": ("dataset", "Dataset"),
    # Catch-alls
    "UNDEFINED": ("preprint", "Preprint / unpublished"),
    "OTHER": ("other", "Other"),
}


def _first_str(value: Any) -> str:
    if isinstance(value, list):
        return str(value[0]) if value else ""
    return str(value) if value is not None else ""


def infer_publication_type(
    doc_type_code: str,
    *,
    doc_type_label: str = "",
    journal_title: str = "",
    conference_title: str = "",
    doi: str = "",
) -> dict[str, str]:
    """Infer a normalized publication type from HAL fields.

    Returns a small dict with:
      - publication_type: a stable, machine-friendly key
      - publication_type_label: user-friendly English label
      - hal_doc_type: raw HAL docType code
      - hal_doc_type_label: raw HAL label if available
    """

    code = (doc_type_code or "").strip()
    label = (doc_type_label or "").strip()

    if code in HAL_DOC_TYPE_TO_PUBLICATION_TYPE:
        normalized, normalized_label = HAL_DOC_TYPE_TO_PUBLICATION_TYPE[code]

        # HAL sometimes keeps docType as UNDEFINED/OTHER across versions, while
        # later versions gain journal/DOI metadata after validation/review.
        # In that case, infer a more specific "published" type.
        if normalized in {"preprint", "other"}:
            if journal_title or doi:
                normalized, normalized_label = ("journal-article", "Article in journal")
            elif conference_title:
                normalized, normalized_label = ("conference-paper", "Conference paper")

        return {
            "publication_type": normalized,
            "publication_type_label": normalized_label,
            "hal_doc_type": code,
            "hal_doc_type_label": label,
        }

    # Heuristic fallback when docType is missing/unknown.
    if journal_title or doi:
        normalized, normalized_label = ("journal-article", "Article in journal")
    elif conference_title:
        normalized, normalized_label = ("conference-paper", "Conference paper")
    else:
        normalized, normalized_label = ("other", "Other")

    return {
        "publication_type": normalized,
        "publication_type_label": normalized_label,
        "hal_doc_type": code,
        "hal_doc_type_label": label,
    }


def _score_publication_version(pub: dict[str, Any]) -> tuple[int, int, str]:
    """Score HAL record for selecting best version for the same HAL id.

    Higher is better.
    Primary goal: prefer records that look 'published' (journal/DOI metadata)
    over earlier preprint versions, then pick the highest version number.
    """

    doc_type_code = _first_str(pub.get("docType_s", "")).strip()
    journal_title = _first_str(pub.get("journalTitle_s", "")).strip()
    conference_title = _first_str(pub.get("conferenceTitle_s", "")).strip()
    doi = _first_str(pub.get("doiId_s", "")).strip()

    score = 0
    if doc_type_code == "ART" or journal_title or doi:
        score += 30
    if doi:
        score += 10
    if doc_type_code == "COMM" or conference_title:
        score += 20
    if doc_type_code in {"COUV", "OUV", "REPORT", "THESE", "HDR"}:
        score += 15

    version = pub.get("version_i")
    try:
        version_i = int(version) if version is not None else 0
    except (TypeError, ValueError):
        version_i = 0

    produced_date = _first_str(pub.get("producedDate_s", ""))
    return (score, version_i, produced_date)


def select_best_versions(publications: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Deduplicate publications by HAL id, selecting the best available version."""

    grouped: dict[str, list[dict[str, Any]]] = {}
    for pub in publications:
        key = (
            _first_str(pub.get("halId_s", "")).strip()
            or _first_str(pub.get("uri_s", "")).strip()
            or str(pub.get("docid", "")).strip()
        )
        grouped.setdefault(key, []).append(pub)

    selected: list[dict[str, Any]] = []
    for _, pubs in grouped.items():
        best = max(pubs, key=_score_publication_version)
        best_copy = dict(best)
        best_copy["_hal_versions_found_i"] = len(pubs)
        selected.append(best_copy)

    selected.sort(key=lambda x: _first_str(x.get("producedDate_s", "")), reverse=True)
    return selected


def build_query_params(
    query: str = DEFAULT_QUERY,
    domains: list[str] | None = None,
    years: list[int] | None = None,
    rows: int = DEFAULT_ROWS,
    start: int = 0,
) -> dict[str, Any]:
    """Build HAL API query parameters."""
    if domains is None:
        domains = DEFAULT_DOMAINS
    if years is None:
        years = DEFAULT_YEARS

    # Build domain filter: level0_domain_s:(math OR info OR stat OR phys)
    domain_filter = " OR ".join(domains)

    # Build year filter: publicationDateY_i:(2024 OR 2025)
    year_filter = " OR ".join(str(y) for y in years)

    params = {
        "q": query,
        # An explicit empty list disables a filter (used for Zotero ingestion).
        "fq": ([f"level0_domain_s:({domain_filter})"] if domains else [])
        + ([f"publicationDateY_i:({year_filter})"] if years else []),
        "fl": ",".join(FIELDS),
        "rows": str(rows),
        "start": str(start),
        "sort": "producedDate_s desc,docid asc",
        "wt": "json",
    }

    return params


def fetch_publications(
    query: str = DEFAULT_QUERY,
    domains: list[str] | None = None,
    years: list[int] | None = None,
    verbose: bool = True,
) -> list[dict[str, Any]]:
    """Fetch all publications matching the query from HAL API."""
    all_publications = []
    start = 0
    total = None

    if verbose:
        print(f"Searching HAL for: {query}")
        print(f"Domains: {DEFAULT_DOMAINS if domains is None else domains}")
        print(f"Years: {DEFAULT_YEARS if years is None else years}")
        print()

    while True:
        params = build_query_params(
            query=query,
            domains=domains,
            years=years,
            start=start,
        )

        url = HAL_API_URL + "?" + urlencode(params, doseq=True)

        try:
            request = Request(url, headers={"Accept": "application/json"})
            with urlopen(request, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8"))
        except HTTPError as e:
            print(f"HTTP Error {e.code}: {e.reason}", file=sys.stderr)
            raise RuntimeError("HAL request failed") from e
        except URLError as e:
            print(f"URL Error: {e.reason}", file=sys.stderr)
            raise RuntimeError("HAL request failed") from e
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}", file=sys.stderr)
            raise RuntimeError("HAL request failed") from e

        response_data = data["response"]
        if total is None:
            total = response_data["numFound"]
            if verbose:
                print(f"Found {total} publications")

        if response_data["numFound"] != total:
            raise RuntimeError("HAL results changed during pagination; retry the harvest")
        docs = response_data["docs"]
        if not docs:
            if start < total:
                raise RuntimeError("Incomplete HAL response; refusing partial harvest")
            break

        all_publications.extend(docs)
        start += len(docs)

        if verbose:
            print(f"  Fetched {len(all_publications)}/{total} publications...")

        if start >= total:
            break

    return select_best_versions(all_publications)


def format_publication(pub: dict[str, Any]) -> dict[str, Any]:
    """Format a publication record for output."""
    # Handle fields that may be lists or single values
    title = _first_str(pub.get("title_s", ""))
    authors = pub.get("authFullName_s", [])
    if isinstance(authors, str):
        authors = [authors]

    doc_type_code = _first_str(pub.get("docType_s", ""))
    doc_type_label = _first_str(pub.get("docTypeLabel_s", ""))
    journal_title = _first_str(pub.get("journalTitle_s", ""))
    conference_title = _first_str(pub.get("conferenceTitle_s", ""))
    doi = _first_str(pub.get("doiId_s", ""))
    type_info = infer_publication_type(
        doc_type_code,
        doc_type_label=doc_type_label,
        journal_title=journal_title,
        conference_title=conference_title,
        doi=doi,
    )

    return {
        **type_info,
        "hal_id": pub.get("halId_s", ""),
        "hal_version": pub.get("version_i", ""),
        "hal_versions_found": pub.get("_hal_versions_found_i", ""),
        "url": pub.get("uri_s", ""),
        "title": title,
        "authors": authors,
        "date": pub.get("producedDate_s", ""),
        "year": pub.get("publicationDateY_i", ""),
        # Backward-compatible raw HAL code (kept for existing consumers)
        "type": doc_type_code,
        "journal": journal_title,
        "conference": conference_title,
        "doi": doi,
        "abstract": (
            pub.get("abstract_s", [""])[0]
            if isinstance(pub.get("abstract_s"), list)
            else pub.get("abstract_s", "")
        ),
        "keywords": pub.get("keyword_s", []),
        "domains": pub.get("domain_s", []),
        "open_access": pub.get("openAccess_bool", False),
        "citation": pub.get("citationFull_s", ""),
        "pdf_url": pub.get("fileMain_s", ""),
    }
