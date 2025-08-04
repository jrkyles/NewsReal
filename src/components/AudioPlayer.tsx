import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Volume2, Loader2, Timer } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

interface AudioPlayerProps {
  audioUrl: string | null;
  categories: string[];
  tone: string;
  localQuery: string;
  onAudioGenerated: (audioUrl: string) => void;
}

export const AudioPlayer = ({ audioUrl, categories, tone, localQuery, onAudioGenerated }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const generatePodcast = async () => {
    if (categories.length === 0) {
      toast({
        title: "No categories selected",
        description: "Please select at least one news category",
        variant: "destructive"
      });
      return;
    }

    const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
    const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const elevenLabsApiKey = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
    const voiceId = import.meta.env.VITE_ELEVEN_LABS_VOICE_ID;

    if (categories.includes("Local News") && !localQuery) {
      toast({
        title: "Location Required",
        description: "Please enter a city or ZIP code for local news",
        variant: "destructive"
      });
      return;
    }

    if (!newsApiKey || !openAiApiKey || !elevenLabsApiKey) {
      toast({
        title: "API Keys Required",
        description: "Please check your environment variables",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Step 1: Fetch news
      setGenerationProgress(25);
      const news = await fetchNews(newsApiKey, categories, localQuery);
      
      // Step 2: Generate script
      setGenerationProgress(50);
      const script = await generateScript(news, tone, openAiApiKey);
      
      // Step 3: Generate audio
      setGenerationProgress(75);
      const audioUrl = await generateAudio(script, elevenLabsApiKey, voiceId);
      
      setGenerationProgress(100);
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
      setGenerationProgress(0);
    }
  };

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
    };

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
      console.error('ElevenLabs API Error:', err);
      throw new Error(`ElevenLabs API Error: ${err}`); 
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const handlePlayClick = async () => {
    if (!audioUrl && !isGenerating) {
      await generatePodcast();
    } else if (audioUrl) {
      togglePlayPause();
    }
  };

  if (!audioUrl && !isGenerating) {
    return (
      <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">●</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Generate Your News
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Click play to generate and listen to News Nelson's daily briefing with your selected categories and tone.
            </p>
            <Button 
              onClick={handlePlayClick}
              disabled={categories.length === 0}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {categories.length === 0 ? "Select Categories First" : "Generate & Play News"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating) {
    return (
      <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="text-center w-full max-w-md">
            <div className="mb-6">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              News Nelson is preparing your briefing...
            </h3>
            <p className="text-gray-600 mb-6">
              Fetching latest stories, crafting the script, and generating audio
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <Progress 
            value={duration ? (currentTime / duration) * 100 : 0} 
            className="w-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              const newTime = percent * duration;
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
              }
            }}
          />
          
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              disabled={!audioUrl}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={handlePlayClick}
              disabled={!audioUrl}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              disabled={!audioUrl}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={1}
              step={0.1}
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <Slider
              value={[playbackSpeed]}
              onValueChange={(value) => setPlaybackSpeed(value[0])}
              min={0.5}
              max={2}
              step={0.25}
              className="flex-1"
            />
            <span className="text-sm w-12 text-right">{playbackSpeed.toFixed(2)}x</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};