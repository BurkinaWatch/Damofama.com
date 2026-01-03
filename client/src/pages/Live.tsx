import { motion } from "framer-motion";
import { useVideos } from "@/hooks/use-content";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SiYoutube } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function Live() {
  const { data: videos = [], isLoading } = useVideos();
  const liveVideos = videos.filter(v => v.type === 'live' && !v.hidden);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Skeleton className="h-12 w-48 mb-8 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-video w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-24 sm:pt-32">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-16 text-center"
        >
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent tracking-tighter">
            LIVE
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg uppercase tracking-widest">
            Vivez l'énergie des performances de Damo Fama en direct.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
          {liveVideos.length > 0 ? (
            liveVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-20 uppercase tracking-widest opacity-50">
              Aucune performance live disponible pour le moment.
            </p>
          )}
        </div>

        <div className="mt-20 text-center">
          <Button size="lg" variant="outline" asChild>
            <a href="https://youtube.com/@damofama5246" target="_blank" rel="noopener noreferrer">
              <SiYoutube className="mr-2 h-5 w-5" /> REJOINDRE SUR YOUTUBE
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }: { video: any }) {
  const videoId = video.youtubeUrl.includes('v=') 
    ? video.youtubeUrl.split('v=')[1]?.split('&')[0]
    : video.youtubeUrl.split('/').pop();

  return (
    <Card className="overflow-hidden border-white/5 bg-white/5 backdrop-blur-sm group hover:border-primary/50 transition-all duration-500">
      <CardContent className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-6">
          <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
            {video.title}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
