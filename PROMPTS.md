# 🔨 PakLex AI — 7 Powerful Build Prompts
## Use these in sequence to build the full project from scratch

---

## PROMPT 1 — Project Scaffold & Backend Foundation

```
You are an expert Python + FastAPI developer. Create a production-ready FastAPI backend for a Pakistan Legal AI system with RAG.

REQUIREMENTS:
- FastAPI with async endpoints: POST /api/query and POST /api/ingest
- LangChain RAG pipeline using OllamaLLM (llama3.2:1b) at http://localhost:11434
- ChromaDB as vector store at http://localhost:8001 with collection "pakistan_laws"
- Embeddings: nomic-embed-text via Ollama
- Document chunking: RecursiveCharacterTextSplitter with chunk_size=1000, overlap=200
- MMR retrieval (k=5) for diverse law retrieval
- Each document chunk must store metadata: {law_name, law_number, section, year, chunk_index}
- Pydantic v2 for request/response models
- Loguru for logging
- CORS enabled for http://localhost:3000
- /health endpoint

FOLDER STRUCTURE:
backend/
  main.py, app/api/routes/{query.py,ingest.py}, app/rag/{chain.py,retriever.py,prompts.py,embeddings.py}, app/services/{chroma_service.py,ollama_service.py}, app/core/config.py, app/schemas/query.py

Output all files with complete, working code. No placeholders.
```

---

## PROMPT 2 — LangChain RAG Chain with Expert Legal Prompts

```
You are a LangChain expert and legal domain specialist. Build the complete RAG chain for a Pakistan Law AI assistant.

CHAIN REQUIREMENTS:
- Input: user's legal case scenario (string)
- Retrieve: top 5 relevant law chunks from ChromaDB using MMR
- Format docs with: [LAW N] {law_name} | {law_number} | Section {section}\n{content}
- LLM: OllamaLLM llama3.2:1b, temperature=0.1, num_predict=2048
- Output: structured legal analysis

SYSTEM PROMPT (use exactly):
"You are PakLex AI, an expert legal assistant specializing exclusively in Pakistan law. You have deep knowledge of Constitution of Pakistan, PPC (Pakistan Penal Code), CrPC (Code of Criminal Procedure), CPC (Civil Procedure Code), all ordinances and statutes.

Analyze the case scenario and:
1. Identify ALL relevant laws from the context with exact law numbers, section numbers, and full titles
2. Connect each law directly to the case facts
3. Propose a clear legal opinion based on Pakistani jurisprudence
4. Recommend concrete next steps

RESPONSE STRUCTURE:
## Relevant Laws Found
## Legal Analysis  
## Legal Opinion & Proposed Stance
## Recommended Actions

RULES: Only cite laws from provided context. Never hallucinate law numbers. If context is insufficient, say so."

Return: {answer: str, sources: list[{law_name, law_number, section, year, excerpt}], total_sources: int}
```

---

## PROMPT 3 — Next.js Frontend with Liquid Glass UI

```
You are a senior Next.js 14 + TypeScript developer with exceptional UI/UX skills. Build a stunning legal AI frontend.

DESIGN DIRECTION:
- Aesthetic: Dark luxury — deep forest green + obsidian black + gold (#f5c842) accents
- Typography: Playfair Display (serif, display) + DM Sans (body)
- Background: Animated liquid morphing blobs (CSS keyframes, borderRadius animation) with blur filter
- Grid overlay: subtle gold grid lines at 5% opacity
- Glass morphism cards: backdrop-filter blur + border rgba gold
- Shimmer effect on hero title using background-clip gradient animation
- Noise texture overlay (SVG feTurbulence)

PAGES:
1. / (Landing) — full-screen hero with animated blobs, shimmer title "Pakistan Legal Intelligence", CTA button "Start Legal Query" with gold gradient + pulse shadow animation, floating Scale icon, stats row (400+ laws, 12K+ sections, Local AI)

2. /query (Main App) — textarea for case input (glass card, gold focus ring), Ctrl+Enter shortcut label, "Find Laws" button, loading state with pulsing rings + Scale icon, results section showing: source tags (law number + section chips in gold), AI response formatted as legal analysis (h2 headings in gold, paragraph text), source detail cards with excerpt, disclaimer notice

ANIMATIONS: All entry animations via Framer Motion (opacity+y), staggered source cards, button hover scale, loading ping rings

OUTPUT: Complete working files — page.tsx (both), globals.css, tailwind.config.ts, layout.tsx, lib/api.ts, types/index.ts. No placeholders.
```

---

## PROMPT 4 — Document Ingestion Pipeline & Data Scripts

```
You are a data engineering expert. Build a complete document ingestion system for Pakistan laws.

CREATE:
1. backend/scripts/ingest_laws.py — bulk ingestion script that:
   - Accepts a folder of PDF/TXT files
   - Reads law metadata from a laws_manifest.json file
   - Chunks each document with RecursiveCharacterTextSplitter
   - Detects section numbers using regex: r'(Section|Article|Clause)\s+(\d+[A-Z]?)'
   - Stores section number in chunk metadata
   - Shows progress bar (tqdm)
   - Reports: X docs ingested, Y chunks created, Z errors

2. backend/data/laws_manifest.json — sample manifest with 10 Pakistan laws:
   {Pakistan Penal Code 1860, Constitution of Pakistan 1973, CrPC 1898, CPC 1908, Contract Act 1872, Transfer of Property Act 1882, Qanun-e-Shahadat Order 1984, PECA 2016, Drugs Act 1976, Companies Act 2017}
   Format: [{law_name, law_number, year, file_path, category}]

3. backend/scripts/verify_collection.py — verification script that:
   - Connects to ChromaDB
   - Lists all unique law_names in collection
   - Shows count per law
   - Does a test query: "murder punishment" and displays top 3 results

All scripts must be runnable: python scripts/ingest_laws.py --data-dir ./data/raw
```

---

## PROMPT 5 — Docker + Docker Compose Full Setup

```
You are a DevOps expert specializing in containerization. Create complete Docker setup for PakLex AI.

SERVICES (docker-compose.yml):
1. ollama — ollama/ollama:latest, port 11434, volume for models, healthcheck on /api/tags
2. chromadb — chromadb/chroma:latest, port 8001:8000, volume chroma_data, healthcheck on /api/v1/heartbeat
3. backend — custom Dockerfile, depends_on ollama+chromadb healthy, env vars for URLs, port 8000, volume for ./data, healthcheck on /health, 2 uvicorn workers
4. frontend — custom multi-stage Dockerfile (node:20-alpine, next build, standalone output), port 3000, ARG for NEXT_PUBLIC_API_URL
5. nginx — custom image from nginx:alpine, ports 80+443, upstream proxy to frontend+backend, 300s timeout for AI responses

DOCKERFILES:
- backend/Dockerfile: python:3.11-slim, non-root user appuser, --no-cache pip install
- frontend/Dockerfile: 3-stage (deps/builder/runner), non-root nextjs user, output=standalone
- nginx/Dockerfile: nginx:alpine + copy nginx.conf

Also create:
- .dockerignore for each service (exclude node_modules, __pycache__, .env, .git)
- docker-compose.prod.yml with resource limits and restart:always
- Makefile targets: up, down, logs, pull-models, ingest-sample, build, clean
```

---

## PROMPT 6 — Kubernetes Manifests + Helm Chart

```
You are a Kubernetes architect. Create complete K8s deployment manifests and a Helm chart for PakLex AI.

NAMESPACE: paklex

DEPLOYMENTS:
1. paklex-backend: replicas=2, resources requests=500m/512Mi limits=2000m/2Gi, liveness+readiness probes on /health, env from ConfigMap
2. paklex-frontend: replicas=2, resources requests=250m/256Mi limits=1000m/512Mi  
3. paklex-chromadb: replicas=1 (StatefulSet), PVC 10Gi ReadWriteOnce, resources requests=250m/512Mi limits=1000m/2Gi
4. paklex-ollama: replicas=1, resources requests=1000m/2Gi limits=4000m/6Gi (GPU node selector optional), postStart hook to pull models, emptyDir volume for models

SERVICES: ClusterIP for all internal, LoadBalancer for nginx

INGRESS: nginx ingress controller, routes /api → backend:8000, / → frontend:3000, annotations for 300s timeout and 50m body size

HPA: backend HPA minReplicas=2 maxReplicas=6 targetCPU=70%, frontend HPA minReplicas=2 maxReplicas=4

CONFIGMAP: paklex-config with all env vars

HELM CHART:
- Chart.yaml, values.yaml (with image tags, replicas, resources all configurable)
- Templates for all above resources
- _helpers.tpl with labels

Output all YAML files. Ensure they work with: helm install paklex ./helm/paklex-chart -n paklex
```

---

## PROMPT 7 — GitHub Actions CI/CD + Monitoring

```
You are a senior DevOps/Platform engineer. Create complete CI/CD pipelines and monitoring for PakLex AI.

CI PIPELINE (.github/workflows/ci.yml) triggered on push to main/develop and PRs:
- Job 1 "backend-test": python:3.11, install deps, run pytest tests/, type check with mypy
- Job 2 "frontend-test": node:20, npm ci, run tsc --noEmit, run eslint, run next build dry-run
- Job 3 "docker-build": docker/setup-buildx, build both images without pushing, use GitHub Actions cache

CD PIPELINE (.github/workflows/cd.yml) triggered on push to main and version tags v*:
- Job 1 "build-push": login to ghcr.io, docker/metadata-action for tags (branch/sha/semver), build+push backend and frontend with BuildKit cache
- Job 2 "deploy" (needs build-push, environment=production): setup kubectl, decode KUBE_CONFIG secret, kubectl set image for both deployments, kubectl rollout status with 5m timeout, notify on success/failure

Also create:
- backend/tests/test_api.py — pytest tests for /health, /api/query (mocked), /api/collection/stats
- backend/tests/conftest.py — FastAPI TestClient fixture
- monitoring/prometheus.yaml — scrape config for FastAPI metrics
- monitoring/grafana-dashboard.json — basic dashboard with: request rate, p95 latency, error rate, active pods
- README.md — complete setup guide: Prerequisites, Quick Start (3 commands), API docs, Ingesting laws, Production deploy, Architecture diagram (ASCII)

All files must be complete and production-ready.
```

---

## 🚀 Execution Order

```bash
# 1. Scaffold project
mkdir paklex-ai && cd paklex-ai
git init

# 2. Use Prompt 1 → create backend
# 3. Use Prompt 2 → build RAG chain
# 4. Use Prompt 3 → build frontend
# 5. Use Prompt 4 → ingest pipeline

# 6. Start services
make up
make pull-models  # wait ~5 min

# 7. Ingest Pakistan laws
python backend/scripts/ingest_laws.py --data-dir ./backend/data/raw

# 8. Test
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the penalties for theft under Pakistan law?"}'

# 9. Use Prompt 5 → finalize Docker
# 10. Use Prompt 6 → K8s deploy
kubectl apply -f k8s/
# 11. Use Prompt 7 → CI/CD + monitoring
```
