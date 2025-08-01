import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface PodcastGeneratorProps {
  categories: string[];
  tone: string;
  onAudioGenerated: (audioUrl: string) => void;
}

export const PodcastGenerator = ({ categories, tone, onAudioGenerated }: PodcastGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
  const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const elevenLabsApiKey = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVEN_LABS_VOICE_ID;
  const [generatedScript, setGeneratedScript] = useState("");
  const { toast } = useToast();


  const generatePodcast = async () => {
    if (categories.length === 0) {
      toast({
        title: "No categories selected",
        description: "Please select at least one news category",
        variant: "destructive"
      });
      return;
    }

    if (!newsApiKey || !openAiApiKey || !elevenLabsApiKey) {
      toast({
        title: "API Keys Required",
        description: "Please enter your News API, OpenAI, and ElevenLabs keys",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Step 1: Fetch news
      setProgress(25);
      const news = await fetchNews(newsApiKey, categories);
      
      // Step 2: Generate script
      setProgress(50);
      const script = await generateScript(news, tone, openAiApiKey);
      setGeneratedScript(script);
      
      // Step 3: Generate audio
      setProgress(75);
      const audioUrl = await generateAudio(script, elevenLabsApiKey);
      
      setProgress(100);
      onAudioGenerated(audioUrl);
      
      toast({
        title: "Podcast Generated!",
        description: "Your daily news podcast is ready to listen"
      });
    } catch (error) {
      console.error('Error generating podcast:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate podcast. Please check your API keys and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  interface NewsArticle {
    title: string;
    description: string;
  }

  const fetchNews = async (
    apiKey: string,
    categories: string[]
  ): Promise<NewsArticle[]> => {
    const allArticles: NewsArticle[] = [];

    for (const category of categories) {
      const url =
        `https://newsapi.org/v2/top-headlines?language=en&pageSize=3&category=${encodeURIComponent(
          category.toLowerCase()
        )}&apiKey=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) {
        (data.articles as Array<{ title: string; description: string; content?: string }>).forEach(
          (a) => {
            allArticles.push({
              title: a.title,
              description: a.description || a.content || ""
            });
          }
        );
      }
    }

    return allArticles;
  };

  const generateScript = async (
    news: NewsArticle[],
    tone: string,
    apiKey: string
  ): Promise<string> => {
    const content = news
      .map((item, idx) => `${idx + 1}. ${item.title} - ${item.description}`)
      .join("\n");

    const toneInstructions = {
      funny: "You are News Nelson, a witty news anchor with a sharp sense of humor. Use clever wordplay, subtle irony, and tasteful mature humor. Keep jokes sophisticated but accessible. Focus on delivering real news while adding your signature wit.",
      "laid back": "You are News Nelson, a relaxed and conversational news anchor. Speak like you're chatting with a friend over coffee. Use casual language and a calm, unhurried delivery style.",
      friendly: "You are News Nelson, a warm and approachable news anchor. Be enthusiastic and positive while maintaining credibility. Make listeners feel like they're getting news from a trusted friend.",
      professional: "You are News Nelson, a seasoned professional news anchor. Deliver news with authority, clarity, and gravitas. Maintain a formal but engaging tone throughout."
    };

    const messages = [
      {
        role: "system",
        content: `${toneInstructions[tone as keyof typeof toneInstructions]} 

Write a natural, conversational news summary. Include ONLY what News Nelson should say - no stage directions, sound effects, music cues, or script formatting. Just the actual spoken words. Start with a brief greeting, cover the most important stories from each category, and end with a simple sign-off. Keep it between 3-5 minutes of speaking time (about 450-750 words).`
      },
      {
        role: "user",
        content: `Please summarize these top news stories: ${content}`
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
  const generateAudio = async (script: string, apiKey: string) => {
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
      console.error('ElevenLabs API Error:', err);
      throw new Error(`ElevenLabs API Error: ${err}`); 
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          API keys are configured via environment variables
        </p>
        <div className="inline-flex items-center space-x-4 text-xs">
          <span className={newsApiKey ? "text-green-600" : "text-red-600"}>
            News API: {newsApiKey ? "✓" : "✗"}
          </span>
          <span className={openAiApiKey ? "text-green-600" : "text-red-600"}>
            OpenAI: {openAiApiKey ? "✓" : "✗"}
          </span>
          <span className={elevenLabsApiKey ? "text-green-600" : "text-red-600"}>
            ElevenLabs: {elevenLabsApiKey ? "✓" : "✗"}
          </span>
        </div>
      </div>

      {isGenerating && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Generating podcast...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      <Button 
        onClick={generatePodcast}
        disabled={isGenerating || categories.length === 0}
        className="w-full"
        size="lg"
      >
        {isGenerating ? "Generating..." : "Generate Daily Podcast"}
      </Button>

      {generatedScript && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Script</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedScript}
              readOnly
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};