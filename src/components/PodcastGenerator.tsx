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
  const [newsApiKey, setNewsApiKey] = useState(
    import.meta.env.VITE_NEWS_API_KEY || ""
  );
  const [openAiApiKey, setOpenAiApiKey] = useState(
    import.meta.env.VITE_OPENAI_API_KEY || ""
  );
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState(
    import.meta.env.VITE_ELEVEN_LABS_API_KEY || ""
  );
  const [generatedScript, setGeneratedScript] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedNews = localStorage.getItem("newsApiKey");
    const storedOpenAi = localStorage.getItem("openAiApiKey");
    const storedEleven = localStorage.getItem("elevenLabsApiKey");
    if (storedNews) setNewsApiKey(storedNews);
    if (storedOpenAi) setOpenAiApiKey(storedOpenAi);
    if (storedEleven) setElevenLabsApiKey(storedEleven);
  }, []);

  useEffect(() => {
    if (newsApiKey) localStorage.setItem("newsApiKey", newsApiKey);
  }, [newsApiKey]);

  useEffect(() => {
    if (openAiApiKey) localStorage.setItem("openAiApiKey", openAiApiKey);
  }, [openAiApiKey]);

  useEffect(() => {
    if (elevenLabsApiKey) localStorage.setItem("elevenLabsApiKey", elevenLabsApiKey);
  }, [elevenLabsApiKey]);

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

    const messages = [
      {
        role: "system",
        content: `You are a journalist writing a short podcast script in a ${tone} tone. Summarize and make the stories engaging.`
      },
      {
        role: "user",
        content
      }
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "OpenAI API error");

    return data.choices[0].message.content.trim();
  };
  const generateAudio = async (script: string, apiKey: string) => {
    const voiceId = "21m00Tcm4TlvDq8ikWAM";
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: {"xi-api-key": apiKey, "Content-Type": "application/json"},
      body: JSON.stringify({ text: script, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.35, similarity_boost: 0.75 } })
    });
    if (!res.ok) { const err = await res.text(); throw new Error(err); }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="news-api">News API Key</Label>
          <Input
            id="news-api"
            type="password"
            placeholder="Enter your News API key"
            value={newsApiKey}
            onChange={(e) => setNewsApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Get your free key at newsapi.org
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="openai-api">OpenAI API Key</Label>
          <Input
            id="openai-api"
            type="password"
            placeholder="Enter your OpenAI API key"
            value={openAiApiKey}
            onChange={(e) => setOpenAiApiKey(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="elevenlabs-api">ElevenLabs API Key</Label>
          <Input
            id="elevenlabs-api"
            type="password"
            placeholder="Enter your ElevenLabs API key"
            value={elevenLabsApiKey}
            onChange={(e) => setElevenLabsApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Get your key at elevenlabs.io
          </p>
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