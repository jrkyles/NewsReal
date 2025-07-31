import { useState } from "react";
import { CategorySelector } from "@/components/CategorySelector";
import { ToneSelector } from "@/components/ToneSelector";
import { PodcastGenerator } from "@/components/PodcastGenerator";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState<string>("professional");
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Daily News Podcast</h1>
          <p className="text-xl text-muted-foreground">
            Generate personalized audio news briefings based on your interests
          </p>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="player">Listen</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>News Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <CategorySelector 
                  selectedCategories={selectedCategories}
                  onCategoriesChange={setSelectedCategories}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Podcast Tone</CardTitle>
              </CardHeader>
              <CardContent>
                <ToneSelector 
                  selectedTone={selectedTone}
                  onToneChange={setSelectedTone}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Generate Today's Podcast</CardTitle>
              </CardHeader>
              <CardContent>
                <PodcastGenerator 
                  categories={selectedCategories}
                  tone={selectedTone}
                  onAudioGenerated={setGeneratedAudio}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="player">
            <Card>
              <CardHeader>
                <CardTitle>Your Daily Podcast</CardTitle>
              </CardHeader>
              <CardContent>
                <AudioPlayer audioUrl={generatedAudio} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
