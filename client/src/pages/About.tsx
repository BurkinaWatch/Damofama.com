import { PageTransition, SectionReveal } from "@/components/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { ContentBlock } from "@shared/schema";
import { useLocation } from "wouter";

export default function About() {
  const [location] = useLocation();
  const lang = location.startsWith('/en') ? 'en' : 'fr';
  
  const { data: content } = useQuery<ContentBlock[]>({
    queryKey: ["/api/content"],
  });

  const bio = content?.find(c => c.key === `bio_${lang}`);

  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-16 px-6 container mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-white">
          {lang === 'fr' ? 'Biographie' : 'Biography'}
        </h1>
      </div>

      <PageTransition>
        <div className="container mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            
            <div className="lg:col-span-5 order-2 lg:order-1 sticky top-32">
              <SectionReveal>
                <div className="aspect-[3/4] overflow-hidden rounded relative">
                  <img 
                    src="/images/LS2C6651_1766230961643.jpg" 
                    alt="Damo Fama Portrait" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 border border-white/10 m-4 pointer-events-none" />
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 text-xs uppercase tracking-widest text-muted-foreground">
                  <div>
                    <span className="block text-white mb-1">{lang === 'fr' ? 'Origine' : 'Origin'}</span>
                    Burkina Faso
                  </div>
                  <div>
                    <span className="block text-white mb-1">Genre</span>
                    Afro-Fusion
                  </div>
                  <div>
                    <span className="block text-white mb-1">{lang === 'fr' ? 'Formation' : 'Background'}</span>
                    Géographe / Geographer
                  </div>
                  <div>
                    <span className="block text-white mb-1">{lang === 'fr' ? 'Depuis' : 'Active Since'}</span>
                    2010
                  </div>
                </div>
              </SectionReveal>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-8 text-lg leading-relaxed text-muted-foreground font-light">
              <SectionReveal delay={0.2}>
                <div className="space-y-6">
                  {bio?.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className={i === 0 ? "text-foreground" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </SectionReveal>

              <SectionReveal delay={0.4}>
                <blockquote className="border-l-2 border-primary pl-8 my-12 italic text-2xl font-display text-white">
                  {lang === 'fr' 
                    ? "« Mon art est une boussole qui s’arrange à ce que les cœurs ne se perdent pas. »"
                    : "\"My art is a compass that ensures hearts do not lose their way.\""}
                </blockquote>
              </SectionReveal>
            </div>
            
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
