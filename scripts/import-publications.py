"""Refresh the public CEMOSIS HAL collection; preserve last good data on failure."""
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from harvest.hal import fetch_publications, format_publication

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src/data/publications.json"
QUERY = "collCode_s:CEMOSIS"

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--strict", action="store_true", help="Fail instead of using the cached snapshot")
    args = parser.parse_args()
    try:
        records = fetch_publications(query=QUERY, domains=[], years=[])
        publications = [format_publication(record) for record in records]
        if not publications or any(not p["hal_id"] or not p["title"] or not p["url"].startswith("https://") for p in publications):
            raise ValueError("Empty or invalid harvest; refusing to overwrite the snapshot")
        publications.sort(key=lambda p: (str(p["year"]), p["date"], p["hal_id"]), reverse=True)
        snapshot = {"metadata": {"source": "HAL", "collection": "CEMOSIS", "query": QUERY,
                    "harvested_at": datetime.now(timezone.utc).isoformat(), "total_count": len(publications)},
                    "publications": publications}
        temporary = OUTPUT.with_suffix(".tmp")
        temporary.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        temporary.replace(OUTPUT)
        print(f"Saved {len(publications)} publications to {OUTPUT.relative_to(ROOT)}")
    except Exception as error:
        if args.strict or not OUTPUT.exists():
            raise
        cached = json.loads(OUTPUT.read_text(encoding="utf-8"))
        if cached.get("metadata", {}).get("query") != QUERY or not cached.get("publications"):
            raise ValueError("No valid CEMOSIS fallback snapshot") from error
        message = f"HAL refresh failed: {error}. Using cached snapshot from {cached['metadata']['harvested_at']}."
        print(f"::warning::{message}", file=sys.stderr)

if __name__ == "__main__":
    main()
