import type { NewsSection } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  async fetchNews(categories: string[], localQuery: string): Promise<NewsSection[]> {
    const params = new URLSearchParams();
    params.set('categories', categories.join(','));
    if (localQuery) params.set('localQuery', localQuery);
    params.set('language', 'en');
    params.set('pageSize', '3');

    const res = await fetch(`${API_BASE}/news?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch news: ${res.statusText}`);
    }
    const data = await res.json();
    return (data.sections || []) as NewsSection[];
  }

  async generateScript(newsSections: NewsSection[], tone: string): Promise<string> {
    const res = await fetch(`${API_BASE}/script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ news_sections: newsSections, tone })
    });
    if (!res.ok) {
      throw new Error(`Failed to generate script: ${res.statusText}`);
    }
    const data = await res.json();
    return data.script as string;
  }

  async generateAudio(script: string): Promise<string> {
    const res = await fetch(`${API_BASE}/audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: script })
    });
    if (!res.ok) {
      throw new Error(`Failed to generate audio: ${res.statusText}`);
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }
}

export const apiService = new ApiService();
