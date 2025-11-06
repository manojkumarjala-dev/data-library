# rag-backend/scripts/seed_rag.py
import json, requests, sys

URL = "http://localhost:8001/upsert"  # Chroma service must be running
with open("data/rag/seed.json", "r") as f:
    items = json.load(f)

r = requests.post(URL, json=items, timeout=30)
print(r.status_code, r.text)
if r.status_code != 200:
    sys.exit(1)
print("Seeded", len(items), "chunks.")


