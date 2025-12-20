import { PageTransition, SectionReveal } from "@/components/PageTransition";

export default function About() {
  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-16 px-6 container mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-white">Biography</h1>
      </div>

      <PageTransition>
        <div className="container mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            
            <div className="lg:col-span-5 order-2 lg:order-1 sticky top-32">
              <SectionReveal>
                <div className="aspect-[3/4] overflow-hidden rounded relative">
                   {/* artistic moody portrait */}
                  <img 
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" 
                    alt="Artist Portrait" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 border border-white/10 m-4 pointer-events-none" />
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 text-xs uppercase tracking-widest text-muted-foreground">
                  <div>
                    <span className="block text-white mb-1">Origin</span>
                    Paris, France
                  </div>
                  <div>
                    <span className="block text-white mb-1">Genre</span>
                    Neo-Soul / Alternative
                  </div>
                  <div>
                    <span className="block text-white mb-1">Label</span>
                    Independent
                  </div>
                  <div>
                    <span className="block text-white mb-1">Active Since</span>
                    2018
                  </div>
                </div>
              </SectionReveal>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-8 text-lg leading-relaxed text-muted-foreground font-light">
              <SectionReveal delay={0.2}>
                <p className="drop-cap text-foreground">
                  <span className="float-left text-7xl font-display font-bold text-primary mr-4 mt-[-10px] leading-none">N</span>
                  oire is not just a musician; she is a curator of moods, a weaver of sonic tapestries that bridge the gap between the ancestral and the futuristic. Born in Paris to Senegalese parents, her sound is a cosmopolitan blend of West African rhythms, Parisian jazz sophistication, and deep, resonant electronic textures.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.3}>
                <p>
                  Her journey began not on stages, but in the quiet corners of libraries and art galleries, where she sought to translate visual emotion into auditory experience. This synesthetic approach defines her work—music that feels like cinema for the ears.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.4}>
                <blockquote className="border-l-2 border-primary pl-8 my-12 italic text-2xl font-display text-white">
                  "I want my music to feel like a memory you haven't lived yet. Familiar, yet distinctly foreign."
                </blockquote>
              </SectionReveal>

              <SectionReveal delay={0.5}>
                <p>
                  With her debut EP "Shadows & Gold" (2020), she captured the attention of underground tastemakers. Her follow-up, "Midnight Echoes," expands her sonic palette, incorporating orchestral arrangements and spoken word poetry. It is a bold declaration of artistic independence, refusing to be categorized by simple genre labels.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.6}>
                <p>
                  On stage, Noire transforms. The shy observer becomes a commanding presence, guiding audiences through a carefully constructed narrative arc. Her performances are immersive experiences, often accompanied by custom visual projections that she designs herself.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.7}>
                <div className="pt-12 mt-12 border-t border-white/10">
                  <h3 className="font-display text-2xl text-white mb-6">Press Clippings</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="italic text-white">"A mesmerizing tour de force that redefines what modern soul can sound like."</p>
                      <span className="text-sm uppercase tracking-widest text-primary mt-2 block">— The Guardian</span>
                    </div>
                    <div>
                      <p className="italic text-white">"Noire builds worlds with her voice, inviting us to inhabit them."</p>
                      <span className="text-sm uppercase tracking-widest text-primary mt-2 block">— Pitchfork</span>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </div>
            
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
