from typing import Any, Dict, List
import httpx
from backend.core.config import OPENAI_API_KEY

SYSTEM_PROMPT = "You are a professional news anchor and podcast script writer."

async def generate_script_from_sections(news_sections: List[Dict[str, Any]], tone: str) -> str:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY not set")

    content_blocks: List[str] = []
    for section in news_sections:
        cat = section.get("category") or ""
        lines: List[str] = []
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

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    body = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 2000,
    }
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(url, headers=headers, json=body)
        resp.raise_for_status()
        data = resp.json()
        return (data.get("choices") or [{}])[0].get("message", {}).get("content", "")
