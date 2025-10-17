from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import os
import asyncio
import hashlib
import json
from typing import Dict, Any, List
import httpx

# Environment
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

if not NEWS_API_KEY:
    # Keep lazy checks in handlers; allow server to boot without keys for local UI work
    pass

app = FastAPI()

# CORS for local dev and typical static hosting origins
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:8080,http://127.0.0.1:8080").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory caches and in-flight task maps
NEWS_TTL_SECONDS = int(os.getenv("NEWS_TTL_SECONDS", "120"))
SCRIPT_TTL_SECONDS = int(os.getenv("SCRIPT_TTL_SECONDS", "900"))

news_cache: Dict[str, Any] = {}
news_cache_expiry: Dict[str, float] = {}
news_inflight: Dict[str, asyncio.Task] = {}

script_cache: Dict[str, str] = {}
script_cache_expiry: Dict[str, float] = {}
script_inflight: Dict[str, asyncio.Task] = {}


def _now() -> float:
    return asyncio.get_event_loop().time()


def _make_key(*parts: Any) -> str:
    payload = json.dumps(parts, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def _get_if_fresh(store: Dict[str, Any], expiry: Dict[str, float], key: str) -> Any | None:
    ts = expiry.get(key)
    if ts is None:
        return None
    if ts < _now():
        # stale
        store.pop(key, None)
        expiry.pop(key, None)
        return None
    return store.get(key)


async def _get_or_create_task(
    inflight: Dict[str, asyncio.Task],
    key: str,
    coro_factory,
):
    task = inflight.get(key)
    if task is not None:
        return await task
    # create a new task and register it
    loop = asyncio.get_event_loop()
    task = loop.create_task(coro_factory())
    inflight[key] = task
    try:
        return await task
    finally:
        inflight.pop(key, None)


@app.get("/health")
async def health():
    return {"ok": True}


@app.get("/news")
async def get_news(categories: str = "general", localQuery: str | None = None, language: str = "en", pageSize: int = 3):
    if not NEWS_API_KEY:
        raise HTTPException(status_code=500, detail="NEWS_API_KEY not set")

    cat_list = [c.strip() for c in categories.split(",") if c.strip()]
    key = _make_key("news", cat_list, localQuery or "", language, pageSize)

    cached = _get_if_fresh(news_cache, news_cache_expiry, key)
    if cached is not None:
        return cached

    async def fetch_all():
        sections: List[Dict[str, Any]] = []
        async with httpx.AsyncClient(timeout=20) as client:
            for category in cat_list:
                if category.lower() == "local news" and localQuery:
                    url = "https://newsapi.org/v2/everything"
                    params = {
                        "q": localQuery,
                        "language": language,
                        "pageSize": pageSize,
                        "sortBy": "publishedAt",
                        "apiKey": NEWS_API_KEY,
                    }
                else:
                    url = "https://newsapi.org/v2/top-headlines"
                    params = {
                        "language": language,
                        "pageSize": pageSize,
                        "category": category.lower(),
                        "apiKey": NEWS_API_KEY,
                    }
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                data = resp.json()
                articles = []
                for a in (data.get("articles") or [])[:pageSize]:
                    articles.append({
                        "title": a.get("title"),
                        "description": a.get("description") or a.get("content") or "",
                        "url": a.get("url"),
                        "publishedAt": a.get("publishedAt"),
                        "source": a.get("source"),
                    })
                sections.append({
                    "category": category,
                    "articles": articles,
                })
        return {"sections": sections}

    result = await _get_or_create_task(news_inflight, key, fetch_all)
    news_cache[key] = result
    news_cache_expiry[key] = _now() + NEWS_TTL_SECONDS
    return result


@app.post("/script")
async def generate_script(payload: Dict[str, Any]):
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set")

    news_sections = payload.get("news_sections") or []
    tone = (payload.get("tone") or "neutral").strip()

    # Normalize content for keying
    key = _make_key("script", news_sections, tone)

    cached = _get_if_fresh(script_cache, script_cache_expiry, key)
    if cached is not None:
        return {"script": cached}

    content_blocks = []
    for section in news_sections:
        cat = section.get("category") or ""
        lines = []
        for art in section.get("articles") or []:
            title = art.get("title") or ""
            desc = art.get("description") or ""
            lines.append(f"- {title}: {desc}")
        content_blocks.append(f"{cat}:\n" + "\n".join(lines))
    news_text = "\n\n".join(content_blocks)

    prompt = (
        f"Create a {tone} news podcast script based on the following content. "
        "Make it concise, conversational, and suitable for audio. Include brief transitions between topics. "
        "Target length: about 3-5 minutes when spoken.\n\n"
        f"Content:\n{news_text}"
    )

    async def do_call():
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        }
        body = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a professional news anchor and podcast script writer."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 2000,
        }
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(url, headers=headers, json=body)
            resp.raise_for_status()
            data = resp.json()
            text = (data.get("choices") or [{}])[0].get("message", {}).get("content", "")
            return text

    text = await _get_or_create_task(script_inflight, key, do_call)
    script_cache[key] = text
    script_cache_expiry[key] = _now() + SCRIPT_TTL_SECONDS
    return {"script": text}


@app.post("/audio")
async def generate_audio(payload: Dict[str, Any]):
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="ELEVENLABS_API_KEY not set")

    text = payload.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="text required")

    voice_id = payload.get("voice_id") or ELEVENLABS_VOICE_ID

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Accept": "audio/mpeg", "Content-Type": "application/json"}
    body = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.5},
    }

    async def audio_stream():
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", url, headers=headers, json=body) as resp:
                resp.raise_for_status()
                async for chunk in resp.aiter_bytes():
                    yield chunk

    return StreamingResponse(audio_stream(), media_type="audio/mpeg")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
