import { useState } from "react";
import { CategorySelector } from "@/components/CategorySelector";
import { ToneSelector } from "@/components/ToneSelector";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [localQuery, setLocalQuery] = useState("");

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
          {/* Left Panel - Settings */}
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
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  Choose Your Tone
                </h2>
                <ToneSelector
                  selectedTone={selectedTone}
                  onToneChange={setSelectedTone}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Player */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <AudioPlayer
                  audioUrl={audioUrl}
                  categories={selectedCategories}
                  tone={selectedTone}
                  localQuery={localQuery}
                  onAudioGenerated={setAudioUrl}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
