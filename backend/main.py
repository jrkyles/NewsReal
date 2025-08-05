from fastapi import FastAPI, HTTPException, Response
import os
import httpx
from openai import OpenAI

app = FastAPI()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

@app.get("/news")
async def get_news(category: str = "general"):
    if not NEWS_API_KEY:
        raise HTTPException(status_code=500, detail="NEWS_API_KEY not set")
    url = "https://newsapi.org/v2/top-headlines"
    params = {"country": "us", "category": category, "apiKey": NEWS_API_KEY}
    async with httpx.AsyncClient() as http_client:
        resp = await http_client.get(url, params=params)
    resp.raise_for_status()
    return resp.json()

@app.post("/script")
async def generate_script(data: dict):
    if not client:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set")
    title = data.get("title", "")
    content = data.get("content", "")
    tone = data.get("tone", "neutral")
    prompt = f"Write a {tone} news script titled '{title}'. {content}"
    completion = client.responses.create(
        model="gpt-4o-mini",
        input=prompt,
    )
    return {"script": completion.output[0].content[0].text}

@app.post("/audio")
async def generate_audio(data: dict):
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="ELEVENLABS_API_KEY not set")
    text = data.get("text")
    voice = data.get("voice", "21m00Tcm4TlvDq8ikWAM")
    if not text:
        raise HTTPException(status_code=400, detail="text required")
    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Accept": "audio/mpeg"}
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}"
    payload = {"text": text}
    async with httpx.AsyncClient() as http_client:
        resp = await http_client.post(url, headers=headers, json=payload)
    resp.raise_for_status()
    return Response(content=resp.content, media_type="audio/mpeg")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
