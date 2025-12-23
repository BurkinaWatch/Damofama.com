import { PageTransition, SectionReveal } from "@/components/PageTransition";
import { useAlbums, useTracks, useVideos } from "@/hooks/use-content";
import { Play, Share2 } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

export default function Music() {
  const { data: albums } = useAlbums();
  const { data: tracks } = useTracks();
  const { data: videos } = useVideos();
  const { play, currentTrack } = useAudio();

  // Group tracks by album if needed, for now flat list
  const singles = tracks?.filter(t => t.isSingle) || [];

  const handlePlayTrack = (track: typeof singles[0]) => {
    if (tracks) {
      play(track, tracks);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pt-32 pb-16 px-6 container mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-primary">Discographie</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Une collection d'explorations sonores et de récits visuels.
        </p>
      </div>

      <PageTransition>
        <div className="container mx-auto px-6 space-y-24">
          
          {/* Albums Section */}
          <section>
            <SectionReveal>
              <div className="flex items-center gap-4 mb-12">
                <div className="h-[1px] bg-white/10 flex-1" />
                <h2 className="text-2xl uppercase tracking-[0.2em] font-light">En Solo (Albums & EPs)</h2>
                <div className="h-[1px] bg-white/10 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {albums?.filter(a => !["Dembé", "Un jour viendra", "Biko"].includes(a.title)).map((album) => (
                  <div key={album.id} className="group cursor-pointer">
                    <div className="aspect-square overflow-hidden mb-6 relative">
                      <img 
                        src={album.coverImage} 
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform">
                          <Play size={20} fill="currentColor" className="ml-1" />
                        </button>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-display font-bold mb-1 group-hover:text-primary transition-colors">{album.title}</h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                        {album.releaseDate ? new Date(album.releaseDate).getFullYear() : 'Coming Soon'}
                      </p>
                      <p className="text-xs text-muted-foreground px-4 mb-4 whitespace-pre-wrap">
                        {album.description}
                      </p>
                      <div className="flex justify-center gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <a href={album.spotifyUrl || '#'} className="text-xs border-b border-transparent hover:border-primary hover:text-primary transition-all">Spotify</a>
                        <a href={album.appleMusicUrl || '#'} className="text-xs border-b border-transparent hover:border-primary hover:text-primary transition-all">Apple Music</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </section>

          {/* Group Discography Section */}
          <section>
            <SectionReveal delay={0.1}>
              <div className="flex items-center gap-4 mb-12">
                <div className="h-[1px] bg-white/10 flex-1" />
                <h2 className="text-2xl uppercase tracking-[0.2em] font-light">En Groupe (KILÉ)</h2>
                <div className="h-[1px] bg-white/10 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {albums?.filter(a => ["Dembé", "Un jour viendra", "Biko"].includes(a.title)).map((album) => (
                  <div key={album.id} className="group">
                    <div className="aspect-square overflow-hidden mb-6 relative">
                      <img 
                        src={album.coverImage} 
                        alt={album.title}
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-display font-bold mb-1">{album.title}</h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                        {album.releaseDate ? new Date(album.releaseDate).getFullYear() : ''}
                      </p>
                      <p className="text-xs text-muted-foreground px-4">
                        {album.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </section>

          {/* Singles List */}
          <section className="max-w-4xl mx-auto">
            <SectionReveal delay={0.2}>
              <div className="flex items-center gap-4 mb-12">
                <div className="h-[1px] bg-white/10 flex-1" />
                <h2 className="text-2xl uppercase tracking-[0.2em] font-light">Singles</h2>
                <div className="h-[1px] bg-white/10 flex-1" />
              </div>

              <div className="space-y-2">
                {tracks?.map((track, i) => (
                  <div 
                    key={track.id} 
                    className={`group flex items-center justify-between p-4 border rounded transition-all cursor-pointer ${
                      currentTrack?.id === track.id 
                        ? 'border-primary/50 bg-white/10' 
                        : 'border-transparent hover:border-white/10 hover:bg-white/5'
                    }`}
                    onClick={() => handlePlayTrack(track)}
                    data-testid={`track-row-${track.id}`}
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-muted-foreground font-mono text-sm w-6">{(i + 1).toString().padStart(2, '0')}</span>
                      <div>
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{track.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-muted-foreground font-mono">{track.duration}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayTrack(track);
                        }}
                        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all"
                        data-testid={`button-play-track-${track.id}`}
                      >
                        <Play size={12} fill="currentColor" className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </section>

          {/* Videos */}
          <section>
            <SectionReveal delay={0.4}>
              <div className="flex items-center gap-4 mb-12">
                <div className="h-[1px] bg-white/10 flex-1" />
                <h2 className="text-2xl uppercase tracking-[0.2em] font-light">Visuals</h2>
                <div className="h-[1px] bg-white/10 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {videos?.map((video) => (
                  <div key={video.id} className="group">
                    <div className="aspect-video bg-neutral-900 overflow-hidden relative mb-4">
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-card">
                          <Play size={40} className="text-muted-foreground" />
                        </div>
                      )}
                      <a 
                        href={video.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
                          <Play size={24} fill="currentColor" className="ml-1" />
                        </div>
                      </a>
                    </div>
                    <h3 className="text-xl font-display font-bold">{video.title}</h3>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
                      {video.category?.replace('_', ' ') || 'Music Video'}
                    </p>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </section>

        </div>
      </PageTransition>
    </div>
  );
}
