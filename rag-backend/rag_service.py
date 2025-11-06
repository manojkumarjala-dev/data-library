from fastapi import FastAPI
from pydantic import BaseModel
import chromadb
from chromadb.utils import embedding_functions

# Persist vectors in ./chroma (folder auto-created)
client = chromadb.PersistentClient(path="./chroma")

# Fast local embedding model (downloads on first run)
embedder = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# One collection for your site content
COLLECTION = client.get_or_create_collection(
    name="site_content",
    embedding_function=embedder
)

app = FastAPI(title="RAG (Chroma) Service")

class UpsertItem(BaseModel):
    id: str
    text: str
    metadata: dict = {}

class QueryBody(BaseModel):
    q: str
    k: int = 5
    route: str | None = None  # optional page filter like "/sector-1"

@app.post("/upsert")
def upsert(items: list[UpsertItem]):
    ids = [i.id for i in items]
    docs = [i.text for i in items]
    metas = [i.metadata for i in items]
    COLLECTION.upsert(ids=ids, documents=docs, metadatas=metas)
    return {"ok": True, "count": len(items)}

@app.post("/query")
def query(body: QueryBody):
    where = {"route": body.route} if body.route else None
    res = COLLECTION.query(query_texts=[body.q], n_results=body.k, where=where)
    out = []
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    ids = res.get("ids", [[]])[0]
    dists = res.get("distances", [[]])[0] if "distances" in res else [None]*len(docs)
    for i in range(len(docs)):
        out.append({"id": ids[i], "text": docs[i], "metadata": metas[i], "distance": dists[i]})

    print(f"Query '{body.q}' (k={body.k}) -> {out} results")
    return {"ok": True, "results": out}
