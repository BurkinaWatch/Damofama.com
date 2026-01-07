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

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-12 text-lg leading-relaxed text-muted-foreground font-light">
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

              {/* Collaborations Section */}
              <SectionReveal delay={0.5}>
                <div className="space-y-6">
                  <h3 className="text-2xl font-display text-primary uppercase tracking-widest border-b border-primary/20 pb-2">
                    Collaborations
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm uppercase tracking-wider">
                    <li className="flex gap-2"><span>-</span> <span><strong>"L'autre"</strong> avec Négroïdes</span></li>
                    <li className="flex gap-2"><span>-</span> <span><strong>"Enfant du monde"</strong> avec Kaltchimo</span></li>
                    <li className="flex gap-2"><span>-</span> <span><strong>"Norbert ZONGO"</strong> avec Collectif Qu'on sonne et Voiles-ailes</span></li>
                    <li className="flex gap-2"><span>-</span> <span><strong>"Victor Deme"</strong> avec Majesty la parole</span></li>
                    <li className="flex gap-2"><span>-</span> <span><strong>"Taxi"</strong> avec Hamtusaint</span></li>
                    <li className="flex gap-2"><span>-</span> <span><strong>"Lettre à ma mère"</strong> avec Jacky le parolier</span></li>
                    <li className="flex gap-2"><span>-</span> <span><strong>"Africa"</strong> avec Phanuel Ouédraogo</span></li>
                    <li className="flex gap-2"><span>-</span> <span><strong>"Paix au Sahel"</strong> avec Sabari Le Lion...</span></li>
                  </ul>
                </div>
              </SectionReveal>

              {/* Scènes & Apparitions Section */}
              <SectionReveal delay={0.6}>
                <div className="space-y-6">
                  <h3 className="text-2xl font-display text-primary uppercase tracking-widest border-b border-primary/20 pb-2">
                    Aperçu de quelques scènes & apparitions
                  </h3>
                  <ul className="space-y-4 text-sm uppercase tracking-wider">
                    <li className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                      <span className="font-bold">Festival "Baba Village"</span>
                      <span className="text-muted-foreground/60">Décembre 2024</span>
                    </li>
                    <li className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                      <span className="font-bold">Concert - Goethe Institut (Ouaga)</span>
                      <span className="text-muted-foreground/60">09 Décembre 2024</span>
                    </li>
                    <li className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                      <span className="font-bold">In Out Dance Festival - Bobo Dioulasso</span>
                      <span className="text-muted-foreground/60">21 Décembre 2024</span>
                    </li>
                    <li className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                      <span className="font-bold">Polyphonie pour la paix</span>
                      <span className="text-muted-foreground/60">02 Novembre 2024</span>
                    </li>
                    <li className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                      <span className="font-bold">Tournée étape de Gaoua - Nos voix pour la paix</span>
                      <span className="text-muted-foreground/60">18 Novembre 2024</span>
                    </li>
                    <li className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                      <span className="font-bold">Les récréatrales</span>
                      <span className="text-muted-foreground/60">29 Octobre 2024</span>
                    </li>
                    <li className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                      <span className="font-bold">Festival "La voix de la Kora"</span>
                      <span className="text-muted-foreground/60">Décembre 2023</span>
                    </li>
                    <li className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                      <span className="font-bold">Festival "Rendez-vous chez nous"</span>
                      <span className="text-muted-foreground/60">Novembre 2021</span>
                    </li>
                    <li className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                      <span className="font-bold">Tanghin Festival édition 2021-2022</span>
                    </li>
                    <li className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                      <span className="font-bold">Rema</span>
                      <span className="text-muted-foreground/60">Octobre 2020</span>
                    </li>
                    <li className="flex flex-col border-b border-white/5 pb-2">
                      <span className="font-bold">Acteur-comédien-chanteur-musicien dans la pièce "Héritage"</span>
                      <span className="text-xs normal-case text-muted-foreground/60">mise en scène Noël MINOUGOU tiré de l'étrange destin de Wangrin de Ahmadou Hampaté BÂ</span>
                    </li>
                    <li className="flex flex-col border-b border-white/5 pb-2">
                      <span className="font-bold">Participation à l'émission "Toungakouna" avec Boncana Maïga</span>
                      <span className="text-muted-foreground/60">Décembre 2024 à Bamako</span>
                    </li>
                  </ul>
                </div>
              </SectionReveal>

              {/* Consecration Section */}
              <SectionReveal delay={0.7}>
                <div className="bg-primary/5 p-8 border border-primary/20 rounded-md space-y-4">
                  <h3 className="text-2xl font-display text-primary uppercase tracking-widest">
                    Consécration
                  </h3>
                  <p className="text-white font-medium">
                    Mention spéciale du jury au <span className="text-primary font-bold">ZECA 2024</span> avec le clip Tounganata
                  </p>
                </div>
              </SectionReveal>
            </div>
            
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
