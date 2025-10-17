import type { NewsCategory, ToneType } from '@/types';

export const NEWS_CATEGORIES: NewsCategory[] = [
  "Technology",
  "Business",
  "Politics",
  "Sports",
  "Entertainment",
  "Health",
  "Science",
  "World News",
  "Local News",
  "Weather"
];

export const TONE_OPTIONS: { value: ToneType; label: string; description: string }[] = [
  {
    value: "professional",
    label: "Professional",
    description: "Formal, business-like tone"
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm and approachable"
  },
  {
    value: "casual",
    label: "Casual",
    description: "Relaxed and conversational"
  },
  {
    value: "authoritative",
    label: "Authoritative",
    description: "Confident and informative"
  },
  {
    value: "conversational",
    label: "Conversational",
    description: "Like talking to a friend"
  }
];

export const API_ENDPOINTS = {
  NEWS_API: 'https://newsapi.org/v2',
  OPENAI_API: 'https://api.openai.com/v1',
  ELEVENLABS_API: 'https://api.elevenlabs.io/v1'
} as const;

export const APP_CONFIG = {
  NAME: 'NewsReal',
  DESCRIPTION: 'Your personalized AI news anchor delivers the day\'s top stories in your preferred style',
  MAX_ARTICLES_PER_CATEGORY: 3,
  AUDIO_SKIP_SECONDS: 15,
  DEFAULT_VOLUME: 0.7,
  DEFAULT_PLAYBACK_SPEED: 1
} as const;
