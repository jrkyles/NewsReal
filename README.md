# NewsReal

NewsReal is a small web app that generates a short spoken news briefing based on the categories you select and a tone of delivery. It fetches recent articles, drafts a script, and converts it to audio so you can listen in the browser.

## Features

- Select news categories and an optional location for local news
- Choose a presentation tone
- Generate a single audio briefing
- Basic playback controls (seek, speed, volume)

## Requirements

- Node.js 18+
- Accounts and API keys for these services:
  - NewsAPI (news data)
  - OpenAI (script generation)
  - ElevenLabs (text-to-speech)

## Setup

1. Install dependencies:
   
   npm install

2. Configure environment variables:
   
   cp .env.example .env
   
   Edit `.env` and set these values:
   
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
   VITE_ELEVEN_LABS_VOICE_ID=your_voice_id

3. Start the development server:
   
   npm run dev

Open http://localhost:8080 in your browser.

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

## Notes

- API keys should not be committed. Keep `.env` local.
- External services may have rate limits and usage costs. Review their terms before use.

## License

MIT
