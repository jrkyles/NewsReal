# NewsReal

NewsReal generates a short spoken news briefing. The frontend calls a small FastAPI backend, which talks to NewsAPI, OpenAI, and ElevenLabs.

## Features

- Select news categories and an optional location for local news
- Choose a presentation tone
- Generate a single audio briefing
- Basic playback controls (seek, speed, volume)

## Requirements

- Node.js 18+
- Python 3.10+
- API keys for NewsAPI, OpenAI, and ElevenLabs

## Setup

1. Install frontend dependencies:

npm install

2. Create env files:

cp .env.example .env

Edit `.env` and point `VITE_API_BASE_URL` to your backend.

Create a backend env (e.g., `backend/.env`) with:

NEWS_API_KEY=...
OPENAI_API_KEY=...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...

3. Install backend dependencies and run the server:

pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

4. Start the frontend:

npm run dev

Open http://localhost:8080.

## Scripts

- npm run dev — start the dev server
- npm run build — build for production
- npm run preview — preview the production build
- npm run type-check — TypeScript type checking
- npm run lint — run ESLint
- npm test — run unit tests

## Testing

This project uses Vitest and Testing Library. To run tests:

npm test

## Project Structure

- src/components — UI components
- src/hooks — custom hooks
- src/services — API calls
- src/types — TypeScript types
- src/constants — shared constants
- src/pages — page components

## How it works

- Frontend requests `/news`, `/script`, and `/audio` from the backend
- Backend caches news and script results in memory for a short time
- Backend coalesces identical in-flight requests to avoid duplicate upstream calls

## Notes

- In-memory caching is per process. Use Redis for shared caching if needed.
- Audio responses are streamed from ElevenLabs.
- Keep API keys server-side only.

## License

MIT
