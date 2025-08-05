import { useState } from "react";
import { CategorySelector } from "@/components/CategorySelector";
import { ToneSelector } from "@/components/ToneSelector";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";
import { generatePodcast } from "@/lib/podcast";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [localQuery, setLocalQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "No categories selected",
        description: "Please select at least one news category",
        variant: "destructive"
      });
      return;
    }

    if (selectedCategories.includes("Local News") && !localQuery) {
      toast({
        title: "Location Required",
        description: "Please enter a city or ZIP code for local news",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const url = await generatePodcast(selectedCategories, selectedTone, localQuery);
      setAudioUrl(url);
      toast({ title: "Podcast Generated!", description: "Your daily news podcast is ready" });
    } catch (err) {
      console.error(err);
      toast({ title: "Generation Failed", description: "Please check your API keys", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-5xl font-bold text-red-500">NewsReal</h1>
            <Newspaper className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personalized AI news anchor delivers the day's top stories in your preferred style
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Player */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <AudioPlayer audioUrl={audioUrl} />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Settings */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  Select News Categories
                </h2>
                <CategorySelector
                  selectedCategories={selectedCategories}
                  onCategoriesChange={setSelectedCategories}
                  localQuery={localQuery}
                  onLocalQueryChange={setLocalQuery}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-foreground">
                    Choose Your Tone
                  </h2>
                  <ToneSelector
                    selectedTone={selectedTone}
                    onToneChange={setSelectedTone}
                  />
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? "Generating..." : "Generate Podcast"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
