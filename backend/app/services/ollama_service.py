import httpx
from app.core.config import settings
from loguru import logger


class OllamaService:
    async def health_check(self):
        async with httpx.AsyncClient() as client:
            try:
                r = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags", timeout=10)
                models = [m["name"] for m in r.json().get("models", [])]
                if settings.OLLAMA_MODEL not in " ".join(models):
                    logger.warning(f"⚠️ Model {settings.OLLAMA_MODEL} not found. Pulling...")
                    await self.pull_model()
                else:
                    logger.info(f"✅ Ollama model {settings.OLLAMA_MODEL} ready")
            except Exception as e:
                logger.error(f"❌ Ollama unreachable: {e}")

    async def pull_model(self):
        async with httpx.AsyncClient(timeout=300) as client:
            await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/pull",
                json={"name": settings.OLLAMA_MODEL},
            )
            logger.info(f"✅ Model {settings.OLLAMA_MODEL} pulled")
