from typing import AsyncIterator, Dict, Any
import httpx
from backend.core.config import ELEVENLABS_API_KEY

async def stream_tts_audio(text: str, voice_id: str, model_id: str = "eleven_monolingual_v1") -> AsyncIterator[bytes]:
    if not ELEVENLABS_API_KEY:
        raise RuntimeError("ELEVENLABS_API_KEY not set")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Accept": "audio/mpeg", "Content-Type": "application/json"}
    body: Dict[str, Any] = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.5},
    }
    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", url, headers=headers, json=body) as resp:
            resp.raise_for_status()
            async for chunk in resp.aiter_bytes():
                yield chunk
