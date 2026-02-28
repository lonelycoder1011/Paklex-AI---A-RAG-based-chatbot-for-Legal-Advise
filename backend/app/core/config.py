from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Ollama
    OLLAMA_BASE_URL: str = "http://ollama:11434"
    OLLAMA_MODEL: str = "llama3.2:1b"
    EMBEDDING_MODEL: str = "nomic-embed-text"
    # ChromaDB
    CHROMA_HOST: str = "chromadb"
    CHROMA_PORT: int = 8000
    COLLECTION_NAME: str = "pakistan_laws"
    # API
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost", "http://localhost:80"]
    LOG_LEVEL: str = "info"
    # RAG
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K_RESULTS: int = 5

    class Config:
        env_file = ".env"

settings = Settings()