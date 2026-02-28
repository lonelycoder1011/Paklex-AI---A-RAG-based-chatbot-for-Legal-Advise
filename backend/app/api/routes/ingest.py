from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from loguru import logger
import tempfile, os

from app.services.chroma_service import ChromaService
from app.core.config import settings
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

router = APIRouter()

@router.post("/ingest")
async def ingest_law_document(
    file: UploadFile = File(...),
    law_name: str = Form(...),
    law_number: str = Form(...),
    year: str = Form(...),
):
    chroma = ChromaService()
    """
    Ingest a Pakistan law document (PDF or TXT) into ChromaDB vector store.
    """
    if not file.filename.endswith((".pdf", ".txt")):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files supported")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Load document
        if file.filename.endswith(".pdf"):
            loader = PyPDFLoader(tmp_path)
        else:
            loader = TextLoader(tmp_path)

        documents = loader.load()

        # Chunk documents
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", "Section", "Article", ". ", " "],
        )
        chunks = splitter.split_documents(documents)

        # Add metadata to each chunk
        for i, chunk in enumerate(chunks):
            chunk.metadata.update({
                "law_name": law_name,
                "law_number": law_number,
                "year": year,
                "chunk_index": i,
                "source_file": file.filename,
            })

        # Store in ChromaDB
        count = await chroma.add_documents(chunks)
        os.unlink(tmp_path)

        logger.info(f"✅ Ingested {count} chunks from {file.filename}")
        return {
            "status": "success",
            "chunks_ingested": count,
            "law_name": law_name,
            "law_number": law_number,
        }

    except Exception as e:
        logger.error(f"❌ Ingestion failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/collection/stats")
async def get_collection_stats():
    """Get ChromaDB collection statistics."""
    chroma = ChromaService()
    stats = await chroma.get_stats()
    return stats
