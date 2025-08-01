import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
}

const tones = [
  {
    id: "professional",
    name: "Professional",
    description: "Formal, objective reporting style"
  },
  {
    id: "funny",
    name: "Funny",
    description: "Humorous, entertaining delivery"
  },
  {
    id: "laid-back",
    name: "Laid Back",
    description: "Casual, relaxed presentation"
  },
  {
    id: "friendly",
    name: "Friendly",
    description: "Warm, approachable tone"
  }
];

export const ToneSelector = ({ selectedTone, onToneChange }: ToneSelectorProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose the tone for your daily podcast:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tones.map((tone) => (
          <Card
            key={tone.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedTone === tone.id
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
            onClick={() => onToneChange(tone.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{tone.name}</h3>
                {selectedTone === tone.id && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{tone.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};