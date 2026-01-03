import { motion } from "framer-motion";
import { useVideos } from "@/hooks/use-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

export default function Videos() {
  const { data: videos = [], isLoading } = useVideos();

  const musicVideos = videos.filter(v => v.category === "music_video");
  const liveVideos = videos.filter(v => v.category === "live");
  const otherVideos = videos.filter(v => v.category !== "music_video" && v.category !== "live");

  const VideoGrid = ({ title, items }: { title: string; items: any[] }) => {
    if (items.length === 0) return null;
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold mb-6 text-primary">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-white/5 hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video relative group cursor-pointer">
                  {video.youtubeUrl.includes("youtube.com") || video.youtubeUrl.includes("youtu.be") ? (
                    <iframe
                      src={video.youtubeUrl.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={video.youtubeUrl}
                      controls
                      poster={video.thumbnailUrl}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-medium">{video.title}</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter">
          VIDÉOS
        </h1>
        <div className="w-24 h-1 bg-primary mx-auto mb-6" />
        <p className="text-white/60 max-w-2xl mx-auto uppercase tracking-widest text-sm">
          Découvrez l'univers visuel de DAMO FAMA à travers ses clips et performances.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video bg-white/5 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <VideoGrid title="Clips Vidéos" items={musicVideos} />
          <VideoGrid title="Performances Live" items={liveVideos} />
          <VideoGrid title="Autres Vidéos" items={otherVideos} />
        </>
      )}
    </div>
  );
}
