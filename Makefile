.PHONY: up down dev logs pull-models ingest-sample build clean

## ─── Local Development ──────────────────────────────────────────
up:
	docker compose up -d
	@echo "✅ PakLex AI running at http://localhost"

down:
	docker compose down

dev:
	docker compose up

logs:
	docker compose logs -f backend frontend

## ─── Ollama Model Setup ─────────────────────────────────────────
pull-models:
	docker compose exec ollama ollama pull llama3.2:1b
	docker compose exec ollama ollama pull nomic-embed-text
	@echo "✅ Models ready"

## ─── Data Ingestion ─────────────────────────────────────────────
ingest-sample:
	@echo "Ingesting sample law document..."
	curl -X POST http://localhost:8000/api/ingest \
		-F "file=@./backend/data/raw/sample_ppc.txt" \
		-F "law_name=Pakistan Penal Code" \
		-F "law_number=Act XLV of 1860" \
		-F "year=1860"

## ─── Build ──────────────────────────────────────────────────────
build:
	docker compose build --no-cache

## ─── K8s Deploy ─────────────────────────────────────────────────
k8s-apply:
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/chromadb/
	kubectl apply -f k8s/ollama/
	kubectl apply -f k8s/backend/
	kubectl apply -f k8s/frontend/
	kubectl apply -f k8s/nginx/

k8s-status:
	kubectl get all -n paklex

## ─── Clean ──────────────────────────────────────────────────────
clean:
	docker compose down -v
	docker system prune -f
