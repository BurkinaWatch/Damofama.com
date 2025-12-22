import { PageTransition, SectionReveal } from "@/components/PageTransition";
import { usePress } from "@/hooks/use-content";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function Press() {
  const { data: pressItems, isLoading } = usePress();

  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-16 px-6 container mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-primary">Presse</h1>
      </div>

      <PageTransition>
        <div className="container mx-auto px-6 max-w-4xl pb-24">
          <div className="space-y-12">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading press...</div>
            ) : pressItems && pressItems.length > 0 ? (
              pressItems.map((item, i) => (
                <SectionReveal key={item.id} delay={i * 0.1}>
                  <div className="group border-b border-white/10 pb-12 hover:border-primary/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-2">
                      <h2 className="text-3xl font-display font-bold group-hover:text-primary transition-colors">
                        {item.source}
                      </h2>
                      <span className="text-sm text-muted-foreground uppercase tracking-widest">
                        {item.date ? format(item.date, "MMMM dd, yyyy") : ""}
                      </span>
                    </div>
                    
                    <h3 className="text-xl text-white mb-4 font-medium">{item.title}</h3>
                    
                    {item.snippet && (
                      <p className="text-muted-foreground italic mb-6 leading-relaxed border-l-2 border-white/10 pl-4">
                        "{item.snippet}"
                      </p>
                    )}

                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-white hover:text-primary transition-colors"
                    >
                      Read Full Article <ExternalLink size={14} />
                    </a>
                  </div>
                </SectionReveal>
              ))
            ) : (
              <div className="text-center text-muted-foreground">No press items yet.</div>
            )}
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
