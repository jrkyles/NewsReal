// Utility functions for generating podcast audio

interface NewsArticle {
  title: string;
  description: string;
}

interface NewsSection {
  category: string;
  articles: NewsArticle[];
}

const fetchNews = async (
  apiKey: string,
  categories: string[],
  localQuery: string
): Promise<NewsSection[]> => {
  const sections: NewsSection[] = [];

  for (const category of categories) {
    let url: string;

    if (category === "Local News") {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(localQuery)}&language=en&pageSize=3&sortBy=publishedAt&apiKey=${apiKey}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=3&category=${encodeURIComponent(
        category.toLowerCase()
      )}&apiKey=${apiKey}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    const articles: NewsArticle[] = [];
    if (data.articles) {
      (data.articles as Array<{ title: string; description: string; content?: string }>)
        .slice(0, 3)
        .forEach((a) => {
          articles.push({
            title: a.title,
            description: a.description || a.content || ""
          });
        });
    }

    const sectionTitle =
      category === "Local News" && localQuery ? `${category} - ${localQuery}` : category;
    sections.push({ category: sectionTitle, articles });
  }

  return sections;
};

const generateScript = async (
  news: NewsSection[],
  tone: string,
  apiKey: string
): Promise<string> => {
  const content = news
    .map((section) => {
      const stories = section.articles
        .map((item, idx) => `${idx + 1}. ${item.title} - ${item.description}`)
        .join("\n");
      return `${section.category}:\n${stories}`;
    })
    .join("\n\n");

  const toneInstructions = {
    funny: "You are News Nelson, a witty news anchor with a sharp sense of humor. Use clever wordplay, subtle irony, and tasteful mature humor. Keep jokes sophisticated but accessible. Focus on delivering real news while adding your signature wit.",
    "laid back": "You are News Nelson, a relaxed and conversational news anchor. Speak like you're chatting with a friend over coffee. Use casual language and a calm, unhurried delivery style.",
    friendly: "You are News Nelson, a warm and approachable news anchor. Be enthusiastic and positive while maintaining credibility. Make listeners feel like they're getting news from a trusted friend.",
    professional: "You are News Nelson, a seasoned professional news anchor. Deliver news with authority, clarity, and gravitas. Maintain a formal but engaging tone throughout."
  } as const;

  const messages = [
    {
      role: "system",
      content: `${toneInstructions[tone as keyof typeof toneInstructions]}

Write a natural, conversational news summary. Include ONLY what News Nelson should say - no stage directions, sound effects, music cues, or script formatting. Just the actual spoken words. Start with a brief greeting, then present each selected category in order, introducing the category name followed by its top 2-3 stories. End with a simple sign-off. Keep it between 3-5 minutes of speaking time (about 450-750 words).`
    },
    {
      role: "user",
      content: `Please summarize these top news stories, covering each category in order with their top items:\n\n${content}`
    }
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 800
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "OpenAI API error");

  return data.choices[0].message.content.trim();
};

const generateAudio = async (script: string, apiKey: string, voiceId: string) => {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {"xi-api-key": apiKey, "Content-Type": "application/json"},
    body: JSON.stringify({
      text: script,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.35,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs API Error: ${err}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

export const generatePodcast = async (
  categories: string[],
  tone: string,
  localQuery: string
): Promise<string> => {
  const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
  const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const elevenLabsApiKey = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVEN_LABS_VOICE_ID;

  if (!newsApiKey || !openAiApiKey || !elevenLabsApiKey) {
    throw new Error("Missing API keys");
  }

  const news = await fetchNews(newsApiKey, categories, localQuery);
  const script = await generateScript(news, tone, openAiApiKey);
  const audioUrl = await generateAudio(script, elevenLabsApiKey, voiceId);
  return audioUrl;
};
