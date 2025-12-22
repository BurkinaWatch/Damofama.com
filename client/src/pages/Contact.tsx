import { PageTransition, SectionReveal } from "@/components/PageTransition";
import { useSendMessage } from "@/hooks/use-content";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const sendMessage = useSendMessage();
  const { toast } = useToast();

  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = (data: InsertMessage) => {
    sendMessage.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "Thank you for reaching out. We'll get back to you soon.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen">
      <div className="pt-32 pb-16 px-6 container mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-primary">Contact</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Pour les réservations, les demandes de presse et les collaborations.
        </p>
      </div>

      <PageTransition>
        <div className="container mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            
            {/* Contact Info */}
            <SectionReveal>
              <div className="space-y-12">
                <div>
                  <h3 className="text-2xl font-display font-bold mb-4">Management</h3>
                  <p className="text-muted-foreground">DAMO FAMA Management</p>
                  <a href="mailto:diabatedamofama@gmail.com" className="text-primary hover:underline">diabatedamofama@gmail.com</a>
                </div>
                
                <div>
                  <h3 className="text-2xl font-display font-bold mb-4">Réservations</h3>
                  <p className="text-muted-foreground">Booking Direct</p>
                  <a href="tel:+22676338181" className="text-primary hover:underline">+226 76 33 81 81</a>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <h3 className="text-2xl font-display font-bold mb-6">Suivre</h3>
                  <div className="flex gap-6">
                    {['Instagram', 'Twitter', 'Facebook', 'TikTok'].map(social => (
                      <a key={social} href="#" className="text-sm uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* Form */}
            <SectionReveal delay={0.2}>
              <div className="bg-card border border-white/5 p-8 rounded-lg">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" {...form.register("name")} className="bg-background/50 border-white/10 focus:border-primary" />
                    {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...form.register("email")} className="bg-background/50 border-white/10 focus:border-primary" />
                    {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input id="subject" {...form.register("subject")} className="bg-background/50 border-white/10 focus:border-primary" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={6} {...form.register("message")} className="bg-background/50 border-white/10 focus:border-primary resize-none" />
                    {form.formState.errors.message && <p className="text-red-500 text-sm">{form.formState.errors.message.message}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
                    disabled={sendMessage.isPending}
                  >
                    {sendMessage.isPending ? "Envoi..." : "Envoyer le Message"}
                  </Button>
                </form>
              </div>
            </SectionReveal>

          </div>
        </div>
      </PageTransition>
    </div>
  );
}
