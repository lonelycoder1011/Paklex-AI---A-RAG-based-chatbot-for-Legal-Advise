# ⚖️ PakLex AI — Pakistan Legal Intelligence Platform

> AI-powered RAG legal assistant for Pakistan law. Fully local, private, and production-ready.

```
 ____       _    _               _    ___ 
|  _ \ __ _| | _| |    _____  _| |  / _ \
| |_) / _` | |/ / |   / _ \ \/ / | | | | |
|  __/ (_| |   <| |__|  __/>  <| |_| |_| |
|_|   \__,_|_|\_\_____\___/_/\_\___|\___/
                              AI v1.0
```

## 🏗️ Architecture

```
User → Nginx → Next.js (UI)
                    ↕
             FastAPI Backend
               ↙        ↘
         ChromaDB      Ollama
       (Vector Store)  (llama3.2:1b)
            ↑
     Pakistan Law Corpus
     (PDFs/TXT ingested)
```

## 🚀 Quick Start (3 Commands)

```bash
# 1. Start all services
make up

# 2. Pull AI models (first time only, ~2-3 min)
make pull-models

# 3. Open browser
open http://localhost
```

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + TypeScript + Framer Motion |
| Styling | Tailwind CSS + custom CSS animations |
| Backend | FastAPI (Python 3.11) |
| RAG | LangChain |
| Vector DB | ChromaDB |
| LLM | Ollama llama3.2:1b (local) |
| Embeddings | nomic-embed-text (local) |
| Proxy | Nginx |
| Containers | Docker + Docker Compose |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |

## 📚 Ingesting Pakistan Laws

```bash
# Add your law PDFs to backend/data/raw/
# Update backend/data/laws_manifest.json

# Run ingestion
python backend/scripts/ingest_laws.py --data-dir ./backend/data/raw

# Verify
python backend/scripts/verify_collection.py
```

## 🔌 API Reference

### POST /api/query
```json
{
  "question": "A landlord evicted a tenant without court order in Lahore. What laws apply?"
}
```
Response:
```json
{
  "answer": "## Relevant Laws Found\n...",
  "sources": [{"law_name": "...", "law_number": "...", "section": "...", "year": "...", "excerpt": "..."}],
  "total_sources": 5
}
```

### POST /api/ingest
```
Multipart form: file (PDF/TXT), law_name, law_number, year
```

### GET /api/collection/stats
```json
{"collection": "pakistan_laws", "total_documents": 1240}
```

## 🐳 Production Deploy

```bash
# K8s deploy
kubectl apply -f k8s/

# Or with Helm
helm install paklex ./helm/paklex-chart -n paklex --create-namespace

# Check status
make k8s-status
```

## 🔒 Privacy
All inference runs **100% locally** via Ollama. No data leaves your machine/cluster.

## ⚠️ Legal Disclaimer
This tool provides legal information for reference only. It does not constitute legal advice. 
Consult a qualified lawyer admitted to the Bar Council of Pakistan for professional legal guidance.
