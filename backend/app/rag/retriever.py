import chromadb
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from app.core.config import settings


def get_embeddings():
    return OllamaEmbeddings(
        model=settings.EMBEDDING_MODEL,
    )


def get_vectorstore():
    client = chromadb.HttpClient(
        host=settings.CHROMA_HOST,
        port=settings.CHROMA_PORT,
    )
    return Chroma(
        client=client,
        collection_name=settings.COLLECTION_NAME,
        embedding_function=get_embeddings(),
    )


def get_retriever():
    vectorstore = get_vectorstore()
    return vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": settings.TOP_K_RESULTS,
            "fetch_k": 20,
            "lambda_mult": 0.7,
        },
    )