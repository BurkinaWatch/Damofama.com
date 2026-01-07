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
    <div className="min-h-screen bg-background pb-20">
      {/* Artistic Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="/attached_assets/10_1767776421949.jpg" 
            alt="Damo Fama Live" 
            className="w-full h-full object-contain"
          />
          {/* Artistic Wash Gradient - Subtle and focused on quality */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container relative z-10 mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-bold mb-4 tracking-tighter text-white drop-shadow-2xl">
              LIVE
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-1 bg-primary mx-auto mb-8 shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-white/80 text-lg sm:text-xl uppercase tracking-[0.3em] font-light max-w-2xl mx-auto px-4"
          >
            Vivez l'énergie des performances de Damo Fama en direct.
          </motion.p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
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
