import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Volume2, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useNewsGeneration } from "@/hooks/useNewsGeneration";
import type { AudioPlayerProps } from "@/types";

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl, 
  categories, 
  tone, 
  localQuery, 
  onAudioGenerated 
}) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackSpeed,
    audioRef,
    togglePlayPause,
    skipForward,
    skipBackward,
    handleSeek,
    setVolume,
    setPlaybackSpeed,
    formatTime
  } = useAudioPlayer(audioUrl);

  const { isGenerating, progress, generatePodcast } = useNewsGeneration();

  const handleGeneratePodcast = async () => {
    const newAudioUrl = await generatePodcast(categories, tone, localQuery);
    if (newAudioUrl) {
      onAudioGenerated(newAudioUrl);
    }
  };

  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your AI News Anchor</h2>
        <p className="text-muted-foreground">
          Generate and listen to your personalized news podcast
        </p>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGeneratePodcast}
          disabled={isGenerating || categories.length === 0}
          size="lg"
          className="px-8 py-3"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate News Podcast"
          )}
        </Button>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Generating your podcast...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Audio Player */}
      {audioUrl && (
        <Card className="p-6">
          <CardContent className="space-y-6 p-0">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={skipBackward}
                disabled={!audioUrl}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                size="icon"
                onClick={togglePlayPause}
                disabled={!audioUrl}
                className="w-12 h-12"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={skipForward}
                disabled={!audioUrl}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume and Speed Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Volume */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Volume</span>
                </div>
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => setVolume(value[0])}
                  className="w-full"
                />
              </div>

              {/* Playback Speed */}
              <div className="space-y-2">
                <span className="text-sm">Speed</span>
                <div className="flex space-x-1">
                  {playbackSpeeds.map((speed) => (
                    <Button
                      key={speed}
                      variant={playbackSpeed === speed ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPlaybackSpeed(speed)}
                      className="text-xs"
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
