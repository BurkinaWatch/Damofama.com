import { createContext, useContext, useState, useRef, ReactNode } from "react";
import type { Track } from "@shared/schema";

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  currentTime: number;
  duration: number;
  volume: number;
  play: (track: Track, tracks?: Track[]) => void;
  pause: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  const play = (track: Track, tracks: Track[] = [track]) => {
    setCurrentTrack(track);
    setQueue(tracks);
    setCurrentTime(0);
    
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    play(queue[nextIndex], queue);
  };

  const prevTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    
    if (currentTime > 3) {
      seek(0);
    } else {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
      play(queue[prevIndex], queue);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => {
    const clampedVol = Math.max(0, Math.min(1, vol));
    setVolumeState(clampedVol);
    if (audioRef.current) {
      audioRef.current.volume = clampedVol;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        queue,
        currentTime,
        duration,
        volume,
        play,
        pause,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        audioRef,
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        crossOrigin="anonymous"
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
}
