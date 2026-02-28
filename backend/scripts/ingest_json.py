import os
import sys
import json
import re
import time

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import chromadb
from chromadb.config import Settings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

# ── Config ────────────────────────────────────────────────────────
CHROMA_HOST   = os.getenv("CHROMA_HOST", "localhost")
CHROMA_PORT   = int(os.getenv("CHROMA_PORT", "8001"))
COLLECTION    = os.getenv("COLLECTION_NAME", "pakistan_laws")
EMBED_MODEL   = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")

# ── PERFORMANCE SETTINGS ──────────────────────────────────────────
CHUNK_SIZE        = 1500   # bigger chunks = fewer HTTP calls to Ollama
CHUNK_OVERLAP     = 150    # reduced overlap
EMBED_BATCH_SIZE  = 50     # embed 50 chunks per Ollama call (huge speedup)
STORE_BATCH_SIZE  = 200    # store 200 docs to ChromaDB at once
LAWS_PER_COMMIT   = 10     # commit every 10 laws

# ── Helpers ───────────────────────────────────────────────────────
def clean_law_name(filename: str) -> str:
    name = re.sub(r'^[a-z0-9]{10,}', '', filename)
    name = name.replace(".pdf.txt", "").replace(".pdf", "").replace(".txt", "")
    name = name.replace("_", " ").replace("-", " ").strip()
    return name.title() if name else filename

def extract_year(text: str) -> str:
    match = re.search(r'(18|19|20)\d{2}', text[:500])
    return match.group(0) if match else "N/A"

def extract_section(text: str) -> str:
    match = re.search(r'(Section|SECTION|Article|ARTICLE|Clause)\s+(\d+[A-Z]?)', text)
    return match.group(2) if match else "General"

def extract_title(text: str) -> str:
    lines = [l.strip() for l in text[:1000].split('\n') if len(l.strip()) > 10]
    for line in lines:
        if any(word in line.upper() for word in ['ACT', 'ORDINANCE', 'CODE', 'ORDER', 'RULES']):
            return line.strip()[:80]
    return lines[0][:80] if lines else "Unknown Law"

def batch_embed_and_store(vectorstore, documents: list, embeddings_model):
    """
    Core speedup: embed ALL chunks in one batch call instead of one-by-one.
    nomic-embed-text supports batch embedding natively.
    """
    if not documents:
        return

    texts = [doc.page_content for doc in documents]
    metadatas = [doc.metadata for doc in documents]

    # Single batch call to Ollama — this is the key optimization
    vectors = embeddings_model.embed_documents(texts)

    # Store directly into ChromaDB with pre-computed vectors
    collection = vectorstore._collection
    ids = [f"doc_{hash(t) % 10**12}_{i}" for i, t in enumerate(texts)]

    # Store in chunks to avoid memory issues
    for start in range(0, len(texts), STORE_BATCH_SIZE):
        end = min(start + STORE_BATCH_SIZE, len(texts))
        collection.add(
            ids=ids[start:end],
            embeddings=vectors[start:end],
            documents=texts[start:end],
            metadatas=metadatas[start:end],
        )

# ── Main ──────────────────────────────────────────────────────────
def ingest_json(json_path: str, start_from: int = 0):
    print(f"📂 Loading JSON: {json_path}")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    total = len(data)
    print(f"📋 Total laws: {total}")
    if start_from > 0:
        print(f"⏩ Resuming from law #{start_from + 1}")
    print()

    # Setup — create once, reuse always
    print("🔌 Connecting to ChromaDB and Ollama...")
    embeddings = OllamaEmbeddings(model=EMBED_MODEL)
    client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
    vectorstore = Chroma(
        client=client,
        collection_name=COLLECTION,
        embedding_function=embeddings,
    )
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", "Section", "Article", ". ", " "],
    )
    print("✅ Connected!\n")

    total_chunks = 0
    total_docs   = 0
    errors       = []
    start_time   = time.time()

    # Accumulate documents across laws before embedding (mega-batch)
    pending_documents = []

    for i, entry in enumerate(data[start_from:], start_from + 1):
        filename = entry.get("file_name", f"unknown_{i}")
        text     = entry.get("text", "").strip()

        if not text:
            print(f"[{i}/{total}] ⚠️  Empty, skipping")
            continue

        law_name     = extract_title(text)
        year         = extract_year(text)
        clean_name   = clean_law_name(filename)
        display_name = law_name if len(clean_name) < 5 else clean_name

        print(f"[{i}/{total}] {display_name[:55]}...", end=" ", flush=True)

        try:
            chunks = splitter.split_text(text)

            for j, chunk in enumerate(chunks):
                pending_documents.append(Document(
                    page_content=chunk,
                    metadata={
                        "law_name"   : display_name,
                        "law_number" : f"Source: {filename[:30]}",
                        "section"    : extract_section(chunk),
                        "year"       : year,
                        "chunk_index": j,
                        "source_file": filename,
                    }
                ))

            total_docs += 1
            print(f"({len(chunks)} chunks)", flush=True)

            # Flush to ChromaDB every LAWS_PER_COMMIT laws
            if total_docs % LAWS_PER_COMMIT == 0 or i == total:
                chunk_count = len(pending_documents)
                print(f"\n  💾 Embedding & storing {chunk_count} chunks...", end=" ", flush=True)
                t = time.time()
                batch_embed_and_store(vectorstore, pending_documents, embeddings)
                elapsed = time.time() - t
                total_chunks += chunk_count
                pending_documents = []

                # Speed stats
                laws_done = total_docs
                elapsed_total = time.time() - start_time
                rate = laws_done / elapsed_total * 60
                remaining = (total - start_from - laws_done) / (rate / 60) / 60 if rate > 0 else 0
                print(f"done in {elapsed:.1f}s | {rate:.1f} laws/min | ~{remaining:.1f}h left\n")

        except Exception as e:
            errors.append(filename)
            print(f"\n  ❌ {str(e)[:100]}")
            # Still flush pending to not lose progress
            if len(pending_documents) >= EMBED_BATCH_SIZE * 5:
                try:
                    batch_embed_and_store(vectorstore, pending_documents, embeddings)
                    total_chunks += len(pending_documents)
                    pending_documents = []
                except:
                    pass
            continue

    # Final flush
    if pending_documents:
        print(f"\n  💾 Final flush: {len(pending_documents)} chunks...")
        batch_embed_and_store(vectorstore, pending_documents, embeddings)
        total_chunks += len(pending_documents)

    elapsed_total = time.time() - start_time
    print(f"\n{'='*55}")
    print(f"🎉 Ingestion Complete!")
    print(f"   Laws ingested  : {total_docs}/{total - start_from}")
    print(f"   Total chunks   : {total_chunks}")
    print(f"   Total time     : {elapsed_total/60:.1f} minutes")
    print(f"   Errors         : {len(errors)}")
    print(f"{'='*55}")
    print(f"\n✅ Test at: http://localhost:8000/api/collection/stats")


if __name__ == "__main__":
    json_path  = "D:/projects/paklex-ai/backend/data/raw/pdf_data.json"

    # ── RESUME SUPPORT ─────────────────────────────────────────────
    # If previous run processed 23 laws, set this to 23 to skip them
    # Set to 0 to start fresh
    START_FROM = 23   # ← change this if you want to resume

    if not os.path.exists(json_path):
        print(f"❌ File not found: {json_path}")
        sys.exit(1)

    ingest_json(json_path, start_from=START_FROM)