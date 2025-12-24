import { PageTransition, SectionReveal } from "@/components/PageTransition";
import { motion } from "framer-motion";

import damoImg1 from "@assets/LS2C6649_1766230961643.jpg";
import damoImg2 from "@assets/LS2C6650_1766230961643.jpg";
import damoImg3 from "@assets/LS2C6651_1766230961643.jpg";
import damoImg4 from "@assets/LS2C6652_1766230961644.jpg";
import damoImg5 from "@assets/LS2C6653_1766230961644.jpg";
import damoImg6 from "@assets/LS2C6654_1766230961644.jpg";
import damoImg7 from "@assets/LS2C6667_1766230961644.jpg";
import damoImg8 from "@assets/LS2C6668_1766230961644.jpg";
import damoImg9 from "@assets/LS2C6669_1766230961645.jpg";
import damoImg10 from "@assets/LS2C6649_1766386247799.jpg";
import damoImg11 from "@assets/DAMO_FAMA-3_1766384989330.png";
import damoImg12 from "@assets/image_1766403514286.png";
import damoImg13 from "@assets/image_1766469216793.png";
import damoImg14 from "@assets/image_1766496579781.png";
import damoImg15 from "@assets/image_1766497436541.png";
import damoImg16 from "@assets/image_1766499128131.png";
import damoImg17 from "@assets/image_1766507207948.png";
import damoImg18 from "@assets/image_1766558168464.png";

const galleryItems = [
  { src: damoImg1, alt: "Damo Fama en concert - Performance live", category: "concert" },
  { src: damoImg11, alt: "Damo Fama - Portrait officiel", category: "portrait" },
  { src: damoImg2, alt: "Damo Fama sur scène", category: "concert" },
  { src: damoImg12, alt: "Damo Fama - Session studio", category: "studio" },
  { src: damoImg3, alt: "Damo Fama avec sa guitare", category: "portrait" },
  { src: damoImg13, alt: "Damo Fama - Événement musical", category: "event" },
  { src: damoImg4, alt: "Damo Fama - Performance acoustique", category: "concert" },
  { src: damoImg14, alt: "Damo Fama - Shooting photo", category: "portrait" },
  { src: damoImg5, alt: "Damo Fama en live", category: "concert" },
  { src: damoImg15, alt: "Damo Fama - Backstage", category: "backstage" },
  { src: damoImg6, alt: "Damo Fama - Moment scénique", category: "concert" },
  { src: damoImg16, alt: "Damo Fama - Interview", category: "media" },
  { src: damoImg7, alt: "Damo Fama - Ambiance concert", category: "concert" },
  { src: damoImg17, alt: "Damo Fama - Séance photo", category: "portrait" },
  { src: damoImg8, alt: "Damo Fama - Public en délire", category: "concert" },
  { src: damoImg18, alt: "Damo Fama - Portrait artistique", category: "portrait" },
  { src: damoImg9, alt: "Damo Fama - Final de concert", category: "concert" },
  { src: damoImg10, alt: "Damo Fama - Photo promotionnelle", category: "promo" },
];

export default function Gallery() {
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
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryItems.map((item, idx) => (
              <SectionReveal key={idx} delay={idx * 0.05}>
                <motion.div 
                  className="relative group overflow-hidden bg-card break-inside-avoid rounded-md"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  data-testid={`card-gallery-${idx}`}
                >
                  <img 
                    src={item.src} 
                    alt={item.alt}
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                    data-testid={`img-gallery-${idx}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{item.alt}</p>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
