import { useState, useRef, useEffect, useCallback } from 'react';
import { APP_CONFIG } from '@/constants';

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  togglePlayPause: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  handleSeek: (value: number[]) => void;
  setVolume: (volume: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  formatTime: (time: number) => string;
}

export const useAudioPlayer = (audioUrl: string | null): UseAudioPlayerReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(APP_CONFIG.DEFAULT_VOLUME);
  const [playbackSpeed, setPlaybackSpeedState] = useState(APP_CONFIG.DEFAULT_PLAYBACK_SPEED);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + APP_CONFIG.AUDIO_SKIP_SECONDS, 
        duration
      );
    }
  }, [duration]);

  const skipBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - APP_CONFIG.AUDIO_SKIP_SECONDS, 
        0
      );
    }
  }, []);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeedState(speed);
  }, []);

  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
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
  };
};
