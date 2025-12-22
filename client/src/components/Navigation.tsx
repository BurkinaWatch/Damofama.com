import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/music", label: "Musique" },
  { href: "/events", label: "Live" },
  { href: "/about", label: "Bio" },
  { href: "/gallery", label: "Galerie" },
  { href: "/press", label: "Presse" },
  { href: "/contact", label: "Contact" },
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
          "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out py-6 px-6 md:px-12 flex justify-between items-center",
          scrolled || isOpen ? "bg-background/95 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent"
        )}
      >
        <Link href="/">
          <a className="text-2xl font-display font-bold tracking-tighter hover:text-primary transition-colors duration-300 z-50 relative uppercase text-white drop-shadow-lg">
            Damo Fama
          </a>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
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
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 text-xs border border-primary/50 text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            ÉCOUTER
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 relative text-foreground hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            <div className="flex flex-col gap-8 text-center">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a className="text-3xl font-display font-bold hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </Link>
              ))}
              <div className="w-12 h-[1px] bg-border mx-auto my-4" />
              <a href="#" className="text-sm text-muted-foreground uppercase tracking-widest">
                Instagram
              </a>
              <a href="#" className="text-sm text-muted-foreground uppercase tracking-widest">
                Spotify
              </a>
              <a href="#" className="text-sm text-muted-foreground uppercase tracking-widest">
                Youtube
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
