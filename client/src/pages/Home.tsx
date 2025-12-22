import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Calendar, Music } from "lucide-react";
import { PageTransition, SectionReveal } from "@/components/PageTransition";
import { useEvents } from "@/hooks/use-content";
import { format } from "date-fns";

export default function Home() {
  const { data: events, isLoading: eventsLoading } = useEvents();

  // Sort events by date and take top 3
  const upcomingEvents = events
    ?.sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3) || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background - using a dark moody cinematic image */}
        {/* cinematic dark stage lighting atmosphere */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          style={{ backgroundImage: 'url("/images/home_hero.jpg")' }}
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40 z-20" />
        
        <div className="relative z-30 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-primary tracking-[0.2em] uppercase text-sm md:text-base font-medium mb-6">Nouvel Album Disponible</h2>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight tracking-tight text-white mix-blend-overlay"
          >
            DAMO <br/> FAMA
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button className="bg-primary text-primary-foreground px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
              Écouter Maintenant
            </button>
            <Link href="/music" asChild>
              <a className="text-white uppercase tracking-widest text-sm font-bold border-b border-white/30 pb-1 hover:border-white transition-colors">
                Voir la Discographie
              </a>
            </Link>
          </motion.div>
        </div>
      </div>

      <PageTransition>
        <div className="container mx-auto px-6 py-24 space-y-32">
          
          {/* About Teaser */}
          <SectionReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="aspect-[3/4] overflow-hidden rounded-sm relative">
                  {/* Portrait of artist in dark lighting */}
                  {/* dramatic portrait of black musician */}
                  <img 
                    src="/images/LS2C6650_1766230961643.jpg" 
                    alt="Damo Fama Portrait" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 border border-white/10 m-4" />
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <h2 className="text-4xl md:text-6xl font-display font-medium leading-tight">
                  L'univers de <span className="text-primary">Damo Fama</span>
                </h2>
                <div className="w-12 h-1 bg-primary" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Fusionnant les rythmes ancestraux et les sonorités contemporaines.
                  Un voyage émotionnel qui transcende les frontières.
                </p>
                <Link href="/about" asChild>
                  <a className="inline-flex items-center gap-2 text-white border-b border-primary pb-1 hover:text-primary transition-colors uppercase tracking-widest text-sm">
                    Découvrir la Biographie <ArrowRight size={16} />
                  </a>
                </Link>
              </div>
            </div>
          </SectionReveal>

          {/* Tour Dates */}
          <SectionReveal>
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-end mb-12">
                <h3 className="text-3xl md:text-5xl font-display">Prochaines Dates</h3>
                <Link href="/events" asChild>
                  <a className="hidden md:block text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                    Toutes les dates
                  </a>
                </Link>
              </div>

              <div className="space-y-4">
                {eventsLoading ? (
                  <div className="text-muted-foreground">Chargement des dates...</div>
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/10 hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-8">
                        <div className="text-center w-16">
                          <span className="block text-xl font-bold font-display text-primary">{format(event.date, "dd")}</span>
                          <span className="block text-xs uppercase tracking-wider text-muted-foreground">{format(event.date, "MMM")}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-medium group-hover:text-primary transition-colors">{event.location}</h4>
                          <p className="text-muted-foreground text-sm">{event.venue}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <span className="text-xs uppercase tracking-widest px-3 py-1 border border-white/10 rounded-full">{event.type}</span>
                        <a 
                          href={event.ticketUrl || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
                        >
                          Billets
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center border border-dashed border-white/10 rounded">
                    <Calendar className="w-8 h-8 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Aucune date annoncée pour le moment.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 md:hidden text-center">
                <Link href="/events" asChild>
                  <a className="text-sm uppercase tracking-widest text-primary border-b border-primary/30 pb-1">
                    Toutes les dates
                  </a>
                </Link>
              </div>
            </div>
          </SectionReveal>

          {/* Latest Release */}
          <SectionReveal>
            <div className="relative overflow-hidden bg-card rounded-lg border border-white/5 p-8 md:p-16 text-center">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                {/* abstract geometric texture */}
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000" 
                  alt="Texture" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <Music className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-4xl md:text-5xl font-display">Écouter la Collection</h3>
                <p className="text-muted-foreground">
                  Disponible sur toutes les plateformes de streaming.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  {['Spotify', 'Apple Music', 'YouTube', 'Deezer'].map((platform) => (
                    <button 
                      key={platform}
                      className="px-6 py-3 bg-white/5 hover:bg-primary hover:text-black border border-white/10 rounded transition-all duration-300 uppercase tracking-widest text-xs font-bold"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>

        </div>
      </PageTransition>
    </div>
  );
}
