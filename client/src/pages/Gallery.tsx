import { PageTransition, SectionReveal } from "@/components/PageTransition";
import { motion } from "framer-motion";
import { usePhotos } from "@/hooks/use-content";

import damoImg1 from "@assets/optimized/LS2C6649_1766230961643.webp";
import damoImg2 from "@assets/optimized/LS2C6650_1766230961643.webp";
import damoImg3 from "@assets/optimized/LS2C6651_1766230961643.webp";
import damoImg4 from "@assets/optimized/LS2C6652_1766230961644.webp";
import damoImg5 from "@assets/optimized/LS2C6653_1766230961644.webp";
import damoImg6 from "@assets/optimized/LS2C6654_1766230961644.webp";
import damoImg7 from "@assets/optimized/LS2C6667_1766230961644.webp";
import damoImg8 from "@assets/optimized/LS2C6668_1766230961644.webp";
import damoImg9 from "@assets/optimized/LS2C6669_1766230961645.webp";
import damoImg10 from "@assets/optimized/LS2C6649_1766386247799.webp";
import damoImg11 from "@assets/optimized/DAMO_FAMA-3_1766384989330.webp";

const defaultGalleryItems = [
  { src: damoImg1, alt: "Damo Fama en concert - Performance live", category: "concert" },
  { src: damoImg11, alt: "Damo Fama - Portrait officiel", category: "portrait" },
  { src: damoImg2, alt: "Damo Fama sur scène", category: "concert" },
  { src: damoImg3, alt: "Damo Fama avec sa guitare", category: "portrait" },
  { src: damoImg4, alt: "Damo Fama - Performance acoustique", category: "concert" },
  { src: damoImg5, alt: "Damo Fama en live", category: "concert" },
  { src: damoImg6, alt: "Damo Fama - Moment scénique", category: "concert" },
  { src: damoImg7, alt: "Damo Fama - Ambiance concert", category: "concert" },
  { src: damoImg8, alt: "Damo Fama - Public en délire", category: "concert" },
  { src: damoImg9, alt: "Damo Fama - Final de concert", category: "concert" },
  { src: damoImg10, alt: "Damo Fama - Photo promotionnelle", category: "promo" },
];

export default function Gallery() {
  const { data: photos = [], isLoading } = usePhotos();
  
  const galleryItems = photos.length > 0 
    ? photos
        .filter(p => p.imageUrl && p.imageUrl.trim() !== "")
        .map(p => {
          let src = p.imageUrl;
          // Si c'est une image de stockage cloud (commençant par /objects/), on l'utilise telle quelle
          // Si c'est une image téléchargée locale (commençant par /uploads/), on s'assure de l'extension
          if (src.startsWith('/uploads/') && !src.endsWith('.webp') && !src.includes('.')) {
            src = `${src}.webp`;
          }
          return {
            src,
            alt: p.title || "Damo Fama",
            category: p.category || "concert"
          };
        })
    : defaultGalleryItems;

  const finalItems = galleryItems.length > 0 ? galleryItems : defaultGalleryItems;

  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-16 px-6 container mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-white" data-testid="text-gallery-title">Galerie</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-gallery-subtitle">
          Moments capturés sur scène, en studio et lors des événements
        </p>
      </div>

      <PageTransition>
        <div className="container mx-auto px-6 mb-24">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-md h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalItems.map((item, idx) => (
                <SectionReveal key={idx} delay={idx * 0.05}>
                  <motion.div 
                    className="relative group overflow-hidden bg-card rounded-md h-full"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    data-testid={`card-gallery-${idx}`}
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img 
                        src={item.src} 
                        alt={item.alt}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.classList.add('flex', 'items-center', 'justify-center');
                            parent.innerHTML = '<span class="text-muted-foreground text-xs uppercase tracking-widest">Image non disponible</span>';
                          }
                        }}
                        data-testid={`img-gallery-${idx}`}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium">{item.alt}</p>
                    </div>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </div>
  );
}
