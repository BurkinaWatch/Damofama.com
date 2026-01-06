import { Play, Pause, SkipForward, SkipBack, Volume2, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useIncrementPlayCount } from "@/hooks/use-content";
import { SocialShare } from "@/components/SocialShare";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer() {
  const [isMinimized, setIsMinimized] = useState(false);
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, seek, duration, currentTime, setVolume, volume } = useAudio();
  const incrementPlayCount = useIncrementPlayCount();

  useEffect(() => {
    if (currentTrack?.id) {
      incrementPlayCount.mutate(currentTrack.id);
    }
  }, [currentTrack?.id]);

  if (!currentTrack) {
    return null;
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const newTime = (e.clientX - rect.left) / rect.width * duration;
    seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-white/5 px-6 py-4"
      data-testid="audio-player"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with minimize button */}
        <div className="flex items-center justify-between mb-0 pb-4">
          <div className="flex items-center gap-4 min-w-[150px]">
            <div className="w-12 h-12 bg-neutral-800 rounded overflow-hidden relative group">
              <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center">
                <div className="text-xs font-bold text-primary-foreground">{currentTrack.title.charAt(0)}</div>
              </div>
            </div>
            <div className="hidden sm:block min-w-0">
              <h4 className="text-sm font-bold leading-none mb-1 truncate" data-testid="track-title">{currentTrack.title}</h4>
              <p className="text-xs text-muted-foreground">DamoFama</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SocialShare 
              title={currentTrack.title} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            />
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-minimize-player"
            >
              {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Controls - only show when not minimized */}
        {!isMinimized && (
          <>
            {/* Controls */}
            <div className="flex flex-col items-center gap-2 max-w-md mx-auto">
              <div className="flex items-center gap-6">
                <button 
                  onClick={prevTrack}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-prev-track"
                >
                  <SkipBack size={20} />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  data-testid="button-play-pause"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
                <button 
                  onClick={nextTrack}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-next-track"
                >
                  <SkipForward size={20} />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-8" data-testid="text-current-time">{formatTime(currentTime)}</span>
                <div 
                  className="h-1 bg-white/10 rounded-full overflow-hidden flex-1 group cursor-pointer hover:h-1.5 transition-all"
                  onClick={handleProgressClick}
                  data-testid="progress-bar"
                >
                  <div 
                    className="h-full bg-primary relative transition-all" 
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow transition-opacity" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right" data-testid="text-duration">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2 justify-center mt-2">
              <Volume2 size={18} className="text-muted-foreground" />
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                data-testid="volume-slider"
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
