from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from loguru import logger
import json

from app.rag.chain import query_laws

router = APIRouter()


class QueryRequest(BaseModel):
    question: str
    stream: bool = False


class QueryResponse(BaseModel):
    answer: str
    sources: list
    total_sources: int


@router.post("/query", response_model=QueryResponse)
async def query_legal_database(request: QueryRequest):
    """
    Submit a legal case scenario and receive relevant Pakistan laws + legal opinion.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    if len(request.question) > 5000:
        raise HTTPException(status_code=400, detail="Question too long (max 5000 chars)")

    try:
        logger.info(f"📜 Legal query received: {request.question[:100]}...")
        result = await query_laws(request.question)
        logger.info(f"✅ Query answered with {result['total_sources']} sources")
        return result
    except Exception as e:
        logger.error(f"❌ Query failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")
