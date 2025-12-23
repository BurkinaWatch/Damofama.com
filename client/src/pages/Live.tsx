import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Live() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const { data: videos = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/videos", "live"],
  });

  const liveVideos = videos.filter((v) => v.category === "live");

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight">
            LIVE
          </h1>
          <p className="text-muted-foreground text-lg">
            Regardez les performances live de Damo Fama
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : liveVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune vidéo live disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedVideo(video.youtubeUrl)}
              >
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Play className="w-12 h-12 text-primary/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <Play className="w-12 h-12 text-white fill-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedVideo(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl aspect-video"
          >
            <iframe
              width="100%"
              height="100%"
              src={selectedVideo.replace("watch?v=", "embed/")}
              title="Live Performance"
              allowFullScreen
              className="rounded-lg"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
