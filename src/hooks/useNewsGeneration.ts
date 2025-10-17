import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/services/api';
import type { NewsSection, GenerationProgress } from '@/types';

interface UseNewsGenerationReturn {
  isGenerating: boolean;
  progress: number;
  generatePodcast: (categories: string[], tone: string, localQuery: string) => Promise<string | null>;
}

export const useNewsGeneration = (): UseNewsGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const generatePodcast = useCallback(async (
    categories: string[], 
    tone: string, 
    localQuery: string
  ): Promise<string | null> => {
    if (categories.length === 0) {
      toast({
        title: "No categories selected",
        description: "Please select at least one news category",
        variant: "destructive"
      });
      return null;
    }

    if (categories.includes("Local News") && !localQuery) {
      toast({
        title: "Location Required",
        description: "Please enter a city or ZIP code for local news",
        variant: "destructive"
      });
      return null;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Step 1: Fetch news
      setProgress(25);
      const newsSections = await apiService.fetchNews(categories, localQuery);
      
      if (newsSections.length === 0) {
        throw new Error('No news articles found');
      }
      
      // Step 2: Generate script
      setProgress(50);
      const script = await apiService.generateScript(newsSections, tone);
      
      // Step 3: Generate audio
      setProgress(75);
      const audioUrl = await apiService.generateAudio(script);
      
      setProgress(100);
      
      toast({
        title: "Podcast Generated!",
        description: "Your daily news podcast is ready to listen"
      });

      return audioUrl;
    } catch (error) {
      console.error('Error generating podcast:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate podcast. Please check your API keys and try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [toast]);

  return {
    isGenerating,
    progress,
    generatePodcast
  };
};
