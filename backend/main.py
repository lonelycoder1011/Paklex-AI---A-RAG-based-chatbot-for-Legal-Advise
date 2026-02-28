from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from loguru import logger

from app.api.routes import query, ingest
from app.core.config import settings
from app.services.chroma_service import ChromaService
from app.services.ollama_service import OllamaService


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 PakLex AI Backend starting up...")
    # Initialize ChromaDB collection
    chroma = ChromaService()
    await chroma.initialize()
    logger.info("✅ ChromaDB collection ready")
    # Ping Ollama
    ollama = OllamaService()
    await ollama.health_check()
    logger.info("✅ Ollama model ready")
    yield
    logger.info("🛑 Shutting down PakLex AI Backend")


app = FastAPI(
    title="PakLex AI - Pakistan Legal RAG API",
    description="AI-powered Pakistan Law assistant using RAG + LangChain + Ollama",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query.router, prefix="/api", tags=["Query"])
app.include_router(ingest.router, prefix="/api", tags=["Ingest"])


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "PakLex AI Backend"}
