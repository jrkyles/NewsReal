from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Any, Dict, List

from backend.core.config import (
    ALLOWED_ORIGINS,
    NEWS_TTL_SECONDS,
    SCRIPT_TTL_SECONDS,
    ELEVENLABS_VOICE_ID,
    NEWS_API_KEY,
    OPENAI_API_KEY,
    ELEVENLABS_API_KEY,
)
from backend.core.cache import make_key, get_if_fresh, get_or_create_task, now
from backend.services.news_client import fetch_news_sections
from backend.services.openai_client import generate_script_from_sections
from backend.services.tts_client import stream_tts_audio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# in-memory caches and inflight maps
news_cache: Dict[str, Any] = {}
news_cache_expiry: Dict[str, float] = {}
news_inflight: Dict[str, Any] = {}

script_cache: Dict[str, str] = {}
script_cache_expiry: Dict[str, float] = {}
script_inflight: Dict[str, Any] = {}


@app.get("/health")
async def health():
    return {"ok": True}


@app.get("/news")
async def get_news(categories: str = "general", localQuery: str | None = None, language: str = "en", pageSize: int = 3):
    if not NEWS_API_KEY:
        raise HTTPException(status_code=500, detail="NEWS_API_KEY not set")

    cat_list = [c.strip() for c in categories.split(",") if c.strip()]
    key = make_key("news", cat_list, localQuery or "", language, pageSize)

    cached = get_if_fresh(news_cache, news_cache_expiry, key)
    if cached is not None:
        return cached

    async def fetch():
        return await fetch_news_sections(cat_list, localQuery, language, pageSize)

    result = await get_or_create_task(news_inflight, key, fetch)
    news_cache[key] = result
    news_cache_expiry[key] = now() + NEWS_TTL_SECONDS
    return result


@app.post("/script")
async def script(payload: Dict[str, Any]):
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set")

    sections = payload.get("news_sections") or []
    tone = (payload.get("tone") or "neutral").strip()

    key = make_key("script", sections, tone)

    cached = get_if_fresh(script_cache, script_cache_expiry, key)
    if cached is not None:
        return {"script": cached}

    async def generate():
        return await generate_script_from_sections(sections, tone)

    text = await get_or_create_task(script_inflight, key, generate)
    script_cache[key] = text
    script_cache_expiry[key] = now() + SCRIPT_TTL_SECONDS
    return {"script": text}


@app.post("/audio")
async def audio(payload: Dict[str, Any]):
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="ELEVENLABS_API_KEY not set")

    text = payload.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="text required")

    voice_id = payload.get("voice_id") or ELEVENLABS_VOICE_ID

    return StreamingResponse(stream_tts_audio(text, voice_id), media_type="audio/mpeg")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
