import { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: "Midnight Echoes",
    artist: "NOIRE",
    duration: "3:45",
  });
  
  // In a real app, this would connect to an audio element and global state
  // This is a visual representation for the UI design

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-white/5 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-[150px]">
          <div className="w-12 h-12 bg-neutral-800 rounded overflow-hidden relative group">
            {/* Using Unsplash placeholder for abstract album art */}
            {/* dark artistic abstract texture */}
            <img 
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=100&h=100" 
              alt="Cover" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="hidden sm:block">
            <h4 className="text-sm font-bold leading-none mb-1">{currentTrack.title}</h4>
            <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-6">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <SkipForward size={20} />
            </button>
          </div>
          {/* Progress Bar Visual */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex items-center group cursor-pointer">
            <div className="w-1/3 h-full bg-primary relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow transition-opacity" />
            </div>
          </div>
        </div>

        {/* Volume / Extras */}
        <div className="hidden md:flex items-center gap-2 min-w-[150px] justify-end">
          <Volume2 size={18} className="text-muted-foreground" />
          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-muted-foreground" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
