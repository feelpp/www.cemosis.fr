"""Offline regression checks for complete harvesting and cache preservation."""
import importlib.util
import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from harvest import hal

spec = importlib.util.spec_from_file_location("import_publications", Path(__file__).with_name("import-publications.py"))
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)

class HarvestTests(unittest.TestCase):
    def test_collection_has_no_year_or_domain_filters(self):
        params = hal.build_query_params(query=importer.QUERY, domains=[], years=[])
        self.assertEqual(params["q"], "collCode_s:CEMOSIS")
        self.assertEqual(params["fq"], [])

    def test_deduplicates_versions_but_preserves_distinct_ids(self):
        records = [{"halId_s": "hal-one", "version_i": 1}, {"halId_s": "hal-one", "version_i": 2}, {"halId_s": "hal-two", "version_i": 1}]
        selected = hal.select_best_versions(records)
        self.assertEqual(len(selected), 2)
        self.assertEqual(next(p for p in selected if p["halId_s"] == "hal-one")["version_i"], 2)

    def test_rejects_incomplete_pagination(self):
        def response(docs):
            return io.BytesIO(json.dumps({"response": {"numFound": 2, "docs": docs}}).encode())
        with patch.object(hal, "urlopen", side_effect=[response([{"halId_s": "hal-one"}]), response([])]):
            with self.assertRaisesRegex(RuntimeError, "Incomplete"):
                hal.fetch_publications(query=importer.QUERY, domains=[], years=[], verbose=False)

    def test_failed_refresh_preserves_snapshot_and_strict_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "snapshot.json"
            before = json.dumps({"metadata": {"query": importer.QUERY, "harvested_at": "2026-01-01"}, "publications": [{"hal_id": "hal-one"}]})
            output.write_text(before)
            with patch.object(importer, "OUTPUT", output), patch.object(importer, "fetch_publications", side_effect=RuntimeError("offline")), patch("sys.argv", ["import-publications.py"]):
                importer.main()
            self.assertEqual(output.read_text(), before)
            with patch.object(importer, "OUTPUT", output), patch.object(importer, "fetch_publications", side_effect=RuntimeError("offline")), patch("sys.argv", ["import-publications.py", "--strict"]):
                with self.assertRaisesRegex(RuntimeError, "offline"):
                    importer.main()
            self.assertEqual(output.read_text(), before)

if __name__ == "__main__":
    unittest.main()
