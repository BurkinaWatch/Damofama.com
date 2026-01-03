import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";

// Components
import { Navigation } from "@/components/Navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Footer } from "@/components/Footer";
import NotFound from "@/pages/not-found";
import { AudioProvider } from "@/contexts/AudioContext";

// Pages
import Home from "@/pages/Home";
import Music from "@/pages/Music";
import Events from "@/pages/Events";
import About from "@/pages/About";
import Gallery from "@/pages/Gallery";
import Press from "@/pages/Press";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Live from "@/pages/Live";
import Videos from "@/pages/Videos";

function Router() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <Switch location={location} key={location}>
            <Route path="/" component={Home} />
            <Route path="/music" component={Music} />
            <Route path="/videos" component={Videos} />
            <Route path="/events" component={Events} />
            <Route path="/about" component={About} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/press" component={Press} />
            <Route path="/contact" component={Contact} />
            <Route path="/admin" component={Admin} />
            <Route path="/login" component={Login} />
            <Route path="/live" component={Live} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </main>

      <Footer />
      <AudioPlayer />
      
      {/* Global Texture Overlay */}
      <div className="grain-overlay" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AudioProvider>
    </QueryClientProvider>
  );
}

export default App;
