import { Link } from "wouter";

export function Footer() {
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
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Spotify</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Apple Music</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">YouTube</a></li>
            </ul>
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
