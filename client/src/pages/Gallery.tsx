import { PageTransition, SectionReveal } from "@/components/PageTransition";
import { motion } from "framer-motion";

// Mock images since we don't have a backend for image uploads yet
// Using Unsplash specific themes (cinematic, concert, portrait)
const images = [
  "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1459749411177-d28994719784?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=800",
];

export default function Gallery() {
  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-16 px-6 container mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-white">Visuals</h1>
      </div>

      <PageTransition>
        <div className="container mx-auto px-6 mb-24">
          {/* Masonry-style Layout */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {images.map((src, idx) => (
              <SectionReveal key={idx} delay={idx * 0.1}>
                <motion.div 
                  className="relative group overflow-hidden bg-card break-inside-avoid"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={src} 
                    alt={`Gallery item ${idx + 1}`}
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
