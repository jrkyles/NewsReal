export interface NewsArticle {
  title: string;
  description: string;
  content?: string;
  url?: string;
  publishedAt?: string;
  source?: {
    name: string;
  };
}

export interface NewsSection {
  category: string;
  articles: NewsArticle[];
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface AudioPlayerProps {
  audioUrl: string | null;
  categories: string[];
  tone: string;
  localQuery: string;
  onAudioGenerated: (audioUrl: string) => void;
}

export interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  localQuery: string;
  onLocalQueryChange: (value: string) => void;
}

export interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
}

export type NewsCategory = 
  | "Technology"
  | "Business" 
  | "Politics"
  | "Sports"
  | "Entertainment"
  | "Health"
  | "Science"
  | "World News"
  | "Local News"
  | "Weather";

export type ToneType = 
  | "professional"
  | "friendly"
  | "casual"
  | "authoritative"
  | "conversational";

export interface GenerationProgress {
  step: string;
  progress: number;
}

export interface ApiError {
  message: string;
  status?: number;
}
