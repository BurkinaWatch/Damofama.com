import { PageTransition, SectionReveal } from "@/components/PageTransition";
import { useEvents } from "@/hooks/use-content";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";

export default function Events() {
  const { data: events, isLoading } = useEvents();

  // Sort by date
  const sortedEvents = events?.sort((a, b) => a.date.getTime() - b.date.getTime()) || [];

  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-16 px-6 container mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-primary">Dates</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Vivez l'expérience en direct.
        </p>
      </div>

      <PageTransition>
        <div className="container mx-auto px-6 max-w-4xl pb-24">
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-12">Chargement des dates...</div>
            ) : sortedEvents.length > 0 ? (
              sortedEvents.map((event, i) => (
                <SectionReveal key={event.id} delay={i * 0.1}>
                  <div className="group bg-card border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-start md:items-center gap-6 md:gap-12">
                      <div className="text-center min-w-[60px] md:min-w-[80px]">
                        <span className="block text-2xl md:text-3xl font-bold font-display text-primary">{format(event.date, "dd")}</span>
                        <span className="block text-sm uppercase tracking-wider text-muted-foreground">{format(event.date, "MMM yyyy")}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">{event.location}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <MapPin size={14} />
                          <span>{event.venue}</span>
                        </div>
                        <span className="inline-block mt-2 text-xs uppercase tracking-widest px-2 py-0.5 border border-white/10 rounded-full text-muted-foreground">
                          {event.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end gap-4 mt-2 md:mt-0">
                      <a 
                        href="tel:+22664290393"
                        className="bg-white text-black px-8 py-3 md:py-2 text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors w-full md:w-auto text-center"
                      >
                        Réserver
                      </a>
                    </div>
                  </div>
                </SectionReveal>
              ))
            ) : (
              <div className="py-24 text-center border border-dashed border-white/10 rounded-lg">
                <Calendar className="w-12 h-12 mx-auto mb-6 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground text-lg">Aucune date annoncée pour le moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Revenez bientôt pour de nouvelles annonces.</p>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
