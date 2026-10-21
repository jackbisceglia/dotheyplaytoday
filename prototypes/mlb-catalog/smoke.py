"""Fake agent: exercises patch plumbing without research or model calls."""
import json
from pathlib import Path

events = Path("packages/data/src/sports/mlb/events.ts")
events.write_text(events.read_text() + "\n// Hosted agent smoke fixture; never publish.\n")
config = Path("packages/data/src/seed/config.ts")
import re
config.write_text(re.sub(r'(CatalogSeedVersion = ")[^"]+', r'\g<1>2099-01-01.1', config.read_text()))
print(json.dumps({"is_error": False, "subtype": "success", "structured_output": {
    "outcome": "changed", "summary": "FAKE model smoke fixture; not schedule research.",
    "sources": ["https://www.mlb.com/", "https://www.espn.com/mlb/"], "excluded": []
}}))
