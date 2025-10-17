# NewsReal 🎙️

<div align="center">
  <img src="public/favicon.svg" alt="NewsReal Logo" width="64" height="64">
  
  **Your AI-powered personalized news podcast generator**
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4-yellow.svg)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan.svg)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
</div>

## 🌟 Features

- **🎯 Personalized Content**: Select from 10+ news categories
- **🎭 Custom Tone**: Choose from 5 different presentation styles
- **🌍 Local News**: Get location-specific news by city or ZIP code
- **🎵 Audio Controls**: Full-featured audio player with speed control
- **⚡ Real-time Generation**: Live progress tracking during podcast creation
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **🔐 Secure**: Environment-based API key management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys from:
  - [NewsAPI](https://newsapi.org/) - for news content
  - [OpenAI](https://openai.com/) - for script generation  
  - [ElevenLabs](https://elevenlabs.io/) - for text-to-speech

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/newsreal.git
   cd newsreal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_NEWS_API_KEY=your_news_api_key_here
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_ELEVEN_LABS_API_KEY=your_eleven_labs_api_key_here
   VITE_ELEVEN_LABS_VOICE_ID=your_preferred_voice_id_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:8080`

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking

# Testing
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadcnUI components
│   ├── AudioPlayer.tsx # Audio player component
│   ├── CategorySelector.tsx
│   └── ToneSelector.tsx
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── constants/          # App constants and configuration
├── pages/              # Page components
└── lib/                # Utility functions
```

## 🎨 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: ShadcnUI + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + TanStack Query
- **Routing**: React Router

### Backend Integration
- **News Data**: NewsAPI
- **AI Script Generation**: OpenAI GPT-4
- **Text-to-Speech**: ElevenLabs

### Development Tools
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint
- **Type Checking**: TypeScript strict mode
- **Package Manager**: npm

## 🔧 Configuration

### API Setup

1. **NewsAPI**: Get your free API key at [newsapi.org](https://newsapi.org/)
2. **OpenAI**: Create an API key at [platform.openai.com](https://platform.openai.com/)
3. **ElevenLabs**: Sign up and get your API key at [elevenlabs.io](https://elevenlabs.io/)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_NEWS_API_KEY` | NewsAPI key for fetching news | Yes |
| `VITE_OPENAI_API_KEY` | OpenAI API key for script generation | Yes |
| `VITE_ELEVEN_LABS_API_KEY` | ElevenLabs API key for TTS | Yes |
| `VITE_ELEVEN_LABS_VOICE_ID` | Voice ID for text-to-speech | Yes |

## 📚 How It Works

1. **Category Selection**: Users choose news categories and optionally specify a location for local news
2. **Tone Selection**: Users pick their preferred presentation style
3. **News Fetching**: The app fetches latest articles from NewsAPI
4. **Script Generation**: OpenAI generates a natural, conversational podcast script
5. **Audio Generation**: ElevenLabs converts the script to realistic speech
6. **Playback**: Users can listen with full audio controls

## 🧪 Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

Test coverage includes:
- ✅ Component rendering and interactions
- ✅ Custom hooks behavior
- ✅ API service integration
- ✅ Type safety validation

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Deployment Options

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Any Static Host**: Upload the `dist` folder contents

### Environment Variables in Production

Make sure to set all required environment variables in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- GitHub Pages: Repository Settings → Secrets and Variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Use semantic commit messages
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ShadcnUI](https://ui.shadcn.com/) for the beautiful component library
- [NewsAPI](https://newsapi.org/) for news data
- [OpenAI](https://openai.com/) for AI-powered script generation
- [ElevenLabs](https://elevenlabs.io/) for realistic text-to-speech

## 📞 Support

- 📧 Email: support@newsreal.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/newsreal/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/newsreal/discussions)

---

<div align="center">
  Made with ❤️ by [Your Name]
</div>
