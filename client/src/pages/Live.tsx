import { PageTransition, SectionReveal } from "@/components/PageTransition";
import { useVideos } from "@/hooks/use-content";
import { Play, Video, Mic, Music } from "lucide-react";

export default function Live() {
  const { data: videos, isLoading } = useVideos();

  const liveVideos = videos?.filter(v => v.category === 'live') || [];
  const interviews = videos?.filter(v => v.category === 'interview') || [];
  const musicVideos = videos?.filter(v => v.category === 'music_video') || [];

  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-16 px-6 container mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-primary">Live</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Concerts, performances live et interviews de Damo Fama.
        </p>
      </div>

      <PageTransition>
        <div className="container mx-auto px-6 space-y-24 pb-24">
          
          {isLoading ? (
            <div className="text-center text-muted-foreground">Chargement des vidéos...</div>
          ) : (
            <>
              {liveVideos.length > 0 && (
                <section>
                  <SectionReveal>
                    <div className="flex items-center gap-4 mb-12">
                      <div className="h-[1px] bg-white/10 flex-1" />
                      <div className="flex items-center gap-3">
                        <Video size={24} className="text-primary" />
                        <h2 className="text-2xl uppercase tracking-[0.2em] font-light">Concerts & Lives</h2>
                      </div>
                      <div className="h-[1px] bg-white/10 flex-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {liveVideos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  </SectionReveal>
                </section>
              )}

              {interviews.length > 0 && (
                <section>
                  <SectionReveal delay={0.2}>
                    <div className="flex items-center gap-4 mb-12">
                      <div className="h-[1px] bg-white/10 flex-1" />
                      <div className="flex items-center gap-3">
                        <Mic size={24} className="text-primary" />
                        <h2 className="text-2xl uppercase tracking-[0.2em] font-light">Interviews</h2>
                      </div>
                      <div className="h-[1px] bg-white/10 flex-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {interviews.map((video) => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  </SectionReveal>
                </section>
              )}

              {musicVideos.length > 0 && (
                <section>
                  <SectionReveal delay={0.4}>
                    <div className="flex items-center gap-4 mb-12">
                      <div className="h-[1px] bg-white/10 flex-1" />
                      <div className="flex items-center gap-3">
                        <Music size={24} className="text-primary" />
                        <h2 className="text-2xl uppercase tracking-[0.2em] font-light">Clips Officiels</h2>
                      </div>
                      <div className="h-[1px] bg-white/10 flex-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {musicVideos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  </SectionReveal>
                </section>
              )}

              {videos?.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  Aucune vidéo disponible pour le moment.
                </div>
              )}
            </>
          )}
        </div>
      </PageTransition>
    </div>
  );
}

function VideoCard({ video }: { video: { id: number; title: string; youtubeUrl: string; thumbnailUrl: string | null; category: string | null } }) {
  return (
    <div className="group" data-testid={`video-card-${video.id}`}>
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
          data-testid={`link-video-${video.id}`}
        >
          <div className="w-16 h-16 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
            <Play size={24} fill="currentColor" className="ml-1" />
          </div>
        </a>
      </div>
      <h3 className="text-xl font-display font-bold group-hover:text-primary transition-colors">{video.title}</h3>
    </div>
  );
}
