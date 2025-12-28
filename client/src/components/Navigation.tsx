import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/music", label: "Musique" },
  { href: "/events", label: "Dates" },
  { href: "/about", label: "Bio" },
  { href: "/gallery", label: "Galerie" },
  { href: "/press", label: "Presse" },
  { href: "/contact", label: "Contact" },
  { href: "/live", label: "Live" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out py-2 px-2 sm:px-4 md:px-12 flex justify-between items-center gap-2 sm:gap-4",
          scrolled || isOpen ? "bg-background/95 backdrop-blur-md border-b border-white/5 py-2" : "bg-transparent"
        )}
      >
        <Link href="/" asChild>
          <a className="text-sm sm:text-base md:text-2xl font-display font-bold tracking-tighter hover:text-primary transition-colors duration-300 z-50 relative uppercase text-white drop-shadow-lg whitespace-nowrap flex-shrink-0">
            Damo Fama
          </a>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 lg:gap-8 items-center flex-shrink-0">
          {links.map((link) => (
            <Link key={link.href} href={link.href} asChild>
              <a
                className={clsx(
                  "text-sm uppercase tracking-widest font-medium transition-all duration-300 hover:text-primary relative group drop-shadow-md",
                  location === link.href ? "text-primary" : "text-white/90 hover:text-white"
                )}
              >
                {link.label}
                <span className={clsx(
                  "absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full",
                  location === link.href ? "w-full" : ""
                )} />
              </a>
            </Link>
          ))}
          <Link href="/live" asChild>
            <a className="ml-4 text-xs border border-primary/50 text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              LIVE
            </a>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 relative text-foreground hover:text-primary transition-colors flex-shrink-0 p-1 flex items-center gap-1"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-menu-toggle"
        >
          <span className="text-xs uppercase tracking-wide font-medium">Menu</span>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background flex flex-col justify-center items-center md:hidden"
          >
            <div className="flex flex-col gap-4 sm:gap-6 text-center w-full px-3 sm:px-4">
              {links.map((link) => (
                <Link key={link.href} href={link.href} asChild>
                  <a className={clsx(
                    "text-lg sm:text-xl font-display font-bold transition-colors",
                    location === link.href ? "text-primary" : "hover:text-primary"
                  )}>
                    {link.label}
                  </a>
                </Link>
              ))}
              <div className="w-10 h-px bg-border mx-auto my-2" />
              <div className="flex flex-col gap-3 sm:gap-4">
                <a href="https://www.facebook.com/share/1AHvShS3Qc/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-primary uppercase tracking-widest font-medium hover:text-primary/80 transition-colors">
                  Facebook
                </a>
                <a href="https://www.instagram.com/damodamsool?igsh=cDd6dG93MjNkcHZu" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-primary uppercase tracking-widest font-medium hover:text-primary/80 transition-colors">
                  Instagram
                </a>
                <a href="https://youtube.com/@damofama5246?si=0488M76i0AEFvVjD" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-primary uppercase tracking-widest font-medium hover:text-primary/80 transition-colors">
                  Youtube
                </a>
                <a href="https://www.tiktok.com/@damofama" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-primary uppercase tracking-widest font-medium hover:text-primary/80 transition-colors">
                  TikTok
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
