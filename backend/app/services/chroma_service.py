import chromadb
from chromadb import HttpClient
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from app.core.config import settings
from loguru import logger


def get_chroma_client():
    return HttpClient(
        host=settings.CHROMA_HOST,
        port=settings.CHROMA_PORT,
    )


class ChromaService:
    def __init__(self):
        # Don't connect at import time — connect lazily
        self._client = None
        self.embeddings = OllamaEmbeddings(
            model=settings.EMBEDDING_MODEL,
        )

    @property
    def client(self):
        if self._client is None:
            self._client = get_chroma_client()
        return self._client

    async def initialize(self):
        try:
            self.client.get_or_create_collection(
                name=settings.COLLECTION_NAME,
            )
            logger.info(f"✅ Collection '{settings.COLLECTION_NAME}' ready")
        except Exception as e:
            logger.error(f"❌ ChromaDB init failed: {e}")
            raise

    async def add_documents(self, documents: list) -> int:
        vectorstore = Chroma(
            client=self.client,
            collection_name=settings.COLLECTION_NAME,
            embedding_function=self.embeddings,
        )
        vectorstore.add_documents(documents)
        return len(documents)

    async def get_stats(self) -> dict:
        collection = self.client.get_or_create_collection(settings.COLLECTION_NAME)
        return {
            "collection": settings.COLLECTION_NAME,
            "total_documents": collection.count(),
        }