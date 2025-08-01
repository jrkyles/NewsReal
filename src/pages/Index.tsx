import { useState } from "react";
import { CategorySelector } from "@/components/CategorySelector";
import { ToneSelector } from "@/components/ToneSelector";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            News Nelson Daily
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personalized AI news anchor delivers the day's top stories in your preferred style
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Settings */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  Select News Categories
                </h2>
                <CategorySelector 
                  selectedCategories={selectedCategories}
                  onCategoriesChange={setSelectedCategories}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <AudioPlayer 
                  audioUrl={audioUrl}
                  categories={selectedCategories}
                  tone={selectedTone}
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
