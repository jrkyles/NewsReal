import type { NewsApiResponse, NewsSection, ApiError } from '@/types';
import { API_ENDPOINTS, APP_CONFIG } from '@/constants';

class ApiService {
  private getApiKey(key: string): string {
    const value = import.meta.env[key];
    if (!value) {
      throw new Error(`${key} is not configured`);
    }
    return value;
  }

  async fetchNews(categories: string[], localQuery: string): Promise<NewsSection[]> {
    const apiKey = this.getApiKey('VITE_NEWS_API_KEY');
    const sections: NewsSection[] = [];

    for (const category of categories) {
      try {
        let url: string;
        
        if (category === "Local News") {
          url = `${API_ENDPOINTS.NEWS_API}/everything?q=${encodeURIComponent(localQuery)}&language=en&pageSize=${APP_CONFIG.MAX_ARTICLES_PER_CATEGORY}&sortBy=publishedAt&apiKey=${apiKey}`;
        } else {
          url = `${API_ENDPOINTS.NEWS_API}/top-headlines?language=en&pageSize=${APP_CONFIG.MAX_ARTICLES_PER_CATEGORY}&category=${encodeURIComponent(category.toLowerCase())}&apiKey=${apiKey}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${category} news: ${response.statusText}`);
        }

        const data: NewsApiResponse = await response.json();
        
        if (data.status === 'error') {
          throw new Error(`News API error for ${category}`);
        }

        const articles = data.articles
          .slice(0, APP_CONFIG.MAX_ARTICLES_PER_CATEGORY)
          .map(article => ({
            title: article.title,
            description: article.description || article.content || '',
            content: article.content,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source
          }));

        sections.push({
          category,
          articles
        });
      } catch (error) {
        console.error(`Error fetching news for ${category}:`, error);
        // Continue with other categories even if one fails
      }
    }

    return sections;
  }

  async generateScript(newsSections: NewsSection[], tone: string): Promise<string> {
    const openAiApiKey = this.getApiKey('VITE_OPENAI_API_KEY');
    
    const newsContent = newsSections
      .map(section => {
        const articles = section.articles
          .map(article => `- ${article.title}: ${article.description}`)
          .join('\n');
        return `${section.category}:\n${articles}`;
      })
      .join('\n\n');

    const prompt = `
      Create a ${tone} news podcast script based on the following news content. 
      Make it engaging, informative, and suitable for audio consumption.
      Keep it conversational and natural for a voice narrator.
      Include smooth transitions between topics.
      Target length: 3-5 minutes when spoken.
      
      News Content:
      ${newsContent}
    `;

    try {
      const response = await fetch(`${API_ENDPOINTS.OPENAI_API}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a professional news anchor and podcast script writer.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Failed to generate script';
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate news script');
    }
  }

  async generateAudio(script: string): Promise<string> {
    const elevenLabsApiKey = this.getApiKey('VITE_ELEVEN_LABS_API_KEY');
    const voiceId = this.getApiKey('VITE_ELEVEN_LABS_VOICE_ID');

    try {
      const response = await fetch(`${API_ENDPOINTS.ELEVENLABS_API}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text: script,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error generating audio:', error);
      throw new Error('Failed to generate audio');
    }
  }
}

export const apiService = new ApiService();
