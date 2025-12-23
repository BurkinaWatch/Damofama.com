import { Link } from "wouter";
import { Facebook, Instagram, Youtube, Music } from "lucide-react";

export function Footer() {
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/1AHvShS3Qc/",
      icon: Facebook,
      color: "text-blue-600"
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/damodamsool?igsh=cDd6dG93MjNkcHZu",
      icon: Instagram,
      color: "text-pink-500"
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@damofama5246?si=0488M76i0AEFvVjD",
      icon: Youtube,
      color: "text-red-600"
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@damofama",
      icon: Music,
      color: "text-black dark:text-white"
    }
  ];

  return (
    <footer className="py-20 bg-black border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/">
              <a className="text-4xl font-display font-bold tracking-tighter mb-6 block">DamoFama</a>
            </Link>
            <p className="text-muted-foreground max-w-md font-light">
              Afro-contemporary sounds meeting cinematic landscapes. 
              Creating auditory experiences that transcend borders and genres.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-6 text-lg">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/music"><a className="text-muted-foreground hover:text-primary transition-colors">Music</a></Link></li>
              <li><Link href="/events"><a className="text-muted-foreground hover:text-primary transition-colors">Live</a></Link></li>
              <li><Link href="/gallery"><a className="text-muted-foreground hover:text-primary transition-colors">Gallery</a></Link></li>
              <li><Link href="/contact"><a className="text-muted-foreground hover:text-primary transition-colors">Contact</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-6 text-lg">Connect</h4>
            <div className="flex flex-col gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group hover-elevate"
                    data-testid={`link-${social.name.toLowerCase()}`}
                  >
                    <IconComponent size={20} className={`${social.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-muted-foreground group-hover:text-white transition-colors">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground/50">
          <p>&copy; {new Date().getFullYear()} DamoFama. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/admin"><a className="hover:text-muted-foreground">Admin</a></Link>
            <a href="#" className="hover:text-muted-foreground">Privacy</a>
            <a href="#" className="hover:text-muted-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
