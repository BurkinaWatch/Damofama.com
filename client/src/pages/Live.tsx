import { motion } from "framer-motion";
import { useVideos } from "@/hooks/use-content";
import { Button } from "@/components/ui/button";
import { SiYoutube } from "react-icons/si";

export default function Live() {
  const { data: videos = [] } = useVideos();
  const featuredVideo = videos.find(v => v.isFeatured && v.category === "music_video") || videos[0];

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-12"
      >
        {featuredVideo ? (
          <iframe
            src={featuredVideo.youtubeUrl.replace("watch?v=", "embed/") + "?autoplay=1&mute=0"}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-card flex items-center justify-center">
            <p className="text-white/40">Chargement du live...</p>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse uppercase tracking-wider">
            LIVE
          </span>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight">
            VIBRATIONS EN DIRECT
          </h1>
          <p className="text-lg text-white/70 mb-6 leading-relaxed">
            Plongez dans l'expérience immersive de DAMO FAMA. Retrouvez ici nos diffusions en direct, concerts virtuels et moments exclusifs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8">
              REJOINDRE LE CHAT
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://youtube.com/@damofama5246" target="_blank" rel="noopener noreferrer">
                <SiYoutube className="mr-2 h-5 w-5" /> S'ABONNER SUR YOUTUBE
              </a>
            </Button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-4 text-primary uppercase tracking-widest text-sm">Prochain Direct</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                15
              </div>
              <div>
                <p className="font-bold">Session Acoustique</p>
                <p className="text-xs text-white/50">Juin 2024 • 20:00 GMT</p>
              </div>
            </div>
            <p className="text-sm text-white/60">
              Une soirée intime avec DAMO FAMA, explorant les racines de l'Afro-Fusion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
