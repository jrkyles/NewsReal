import { useState } from "react";
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
  const [newsApiKey, setNewsApiKey] = useState("");
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState("");
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

    if (!newsApiKey || !elevenLabsApiKey) {
      toast({
        title: "API Keys Required",
        description: "Please enter both News API and ElevenLabs API keys",
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
      const script = generateScript(news, tone);
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

  const fetchNews = async (apiKey: string, categories: string[]) => {
    // For demo purposes, return mock news data
    // In a real app, you'd use a news API like NewsAPI
    return categories.map(category => ({
      title: `Breaking ${category} News`,
      description: `Latest updates in ${category.toLowerCase()} from around the world.`,
      category
    }));
  };

  const generateScript = (news: any[], tone: string) => {
    const toneMap = {
      professional: "Good morning. Here are today's top stories.",
      conversational: "Hey there! Let's dive into what's happening in the world today.",
      energetic: "Good morning, news enthusiasts! We've got some exciting stories to share!",
      calm: "Welcome to your peaceful morning news briefing."
    };

    const intro = toneMap[tone as keyof typeof toneMap] || toneMap.professional;
    
    let script = intro + "\n\n";
    
    news.forEach((item, index) => {
      script += `Story ${index + 1}: ${item.title}\n${item.description}\n\n`;
    });
    
    script += "That's all for today's news briefing. Have a great day!";
    
    return script;
  };

  const generateAudio = async (script: string, apiKey: string) => {
    // For demo purposes, return a placeholder audio URL
    // In a real app, you'd use ElevenLabs API to generate actual audio
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    return "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi+yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcdBi6yzfPNeSsF";
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