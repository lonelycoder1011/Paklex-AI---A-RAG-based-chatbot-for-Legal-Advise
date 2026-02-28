from langchain_ollama import OllamaLLM
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from loguru import logger

from app.core.config import settings
from app.rag.prompts import legal_query_prompt
from app.rag.retriever import get_retriever


def format_docs(docs):
    formatted = []
    for i, doc in enumerate(docs):
        meta = doc.metadata
        law_header = f"[LAW {i+1}] {meta.get('law_name', 'Unknown')} | {meta.get('law_number', 'N/A')} | Section {meta.get('section', 'N/A')}"
        formatted.append(f"{law_header}\n{doc.page_content}")
    return "\n\n{'='*60}\n\n".join(formatted)


def build_rag_chain():
    llm = OllamaLLM(
        base_url=settings.OLLAMA_BASE_URL,
        model=settings.OLLAMA_MODEL,
        temperature=0.1,
        num_predict=2048,
        timeout=300,
        num_ctx=2048,
    )

    retriever = get_retriever()

    chain = (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
        }
        | legal_query_prompt
        | llm
        | StrOutputParser()
    )

    logger.info("✅ RAG chain built successfully")
    return chain


async def query_laws(question: str) -> dict:
    """Query the RAG chain and return response with source documents."""
    retriever = get_retriever()
    docs = retriever.invoke(question)

    chain = build_rag_chain()
    response = chain.invoke(question)

    sources = []
    for doc in docs:
        sources.append({
            "law_name": doc.metadata.get("law_name", "Unknown"),
            "law_number": doc.metadata.get("law_number", "N/A"),
            "section": doc.metadata.get("section", "N/A"),
            "year": doc.metadata.get("year", "N/A"),
            "excerpt": doc.page_content[:300] + "...",
        })

    return {
        "answer": response,
        "sources": sources,
        "total_sources": len(sources),
    }
