import { motion } from "framer-motion";
import { useVideos } from "@/hooks/use-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "lucide-react";

export default function Videos() {
  const { data: videos = [], isLoading } = useVideos();

  const clips = videos.filter(v => (v.type === 'clip' || v.type === 'music_video') && !v.hidden);
  const lives = videos.filter(v => v.type === 'live' && !v.hidden);
  const otherVideos = videos.filter(v => v.type !== 'clip' && v.type !== 'live' && !v.hidden);

  const VideoGrid = ({ items }: { items: any[] }) => {
    if (items.length === 0) return (
      <p className="text-center text-white/40 py-12 uppercase tracking-widest text-sm">
        Aucune vidéo disponible dans cette catégorie.
      </p>
    );
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((video) => {
          const videoId = video.youtubeUrl.includes('v=') 
            ? video.youtubeUrl.split('v=')[1]?.split('&')[0]
            : video.youtubeUrl.split('/').pop();

          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-white/5 hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video relative group cursor-pointer">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-medium line-clamp-1">{video.title}</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
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
        <Tabs defaultValue="clips" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="clips" className="data-[state=active]:bg-primary">CLIPS VIDÉOS</TabsTrigger>
              <TabsTrigger value="lives" className="data-[state=active]:bg-primary">LIVE / CONCERTS</TabsTrigger>
              {otherVideos.length > 0 && <TabsTrigger value="others" className="data-[state=active]:bg-primary">AUTRES</TabsTrigger>}
            </TabsList>
          </div>

          <TabsContent value="clips" className="mt-0">
            <VideoGrid items={clips} />
          </TabsContent>

          <TabsContent value="lives" className="mt-0">
            <VideoGrid items={lives} />
          </TabsContent>

          <TabsContent value="others" className="mt-0">
            <VideoGrid items={otherVideos} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
