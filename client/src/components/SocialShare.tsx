import { Share2, Twitter, Facebook, Link2, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  url?: string;
  className?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "sm" | "default";
}

export function SocialShare({ title, url, className, variant = "ghost", size = "icon" }: SocialShareProps) {
  const { toast } = useToast();
  const shareUrl = url || window.location.href;
  const shareText = `Écoutez "${title}" de Damo Fama`;

  const shareLinks = [
    {
      name: "X (Twitter)",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans votre presse-papiers.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} data-testid="button-share">
          <Share2 size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-white/10">
        {shareLinks.map((link) => (
          <DropdownMenuItem key={link.name} asChild className="hover:bg-white/5 cursor-pointer">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full"
            >
              <link.icon size={16} className="text-muted-foreground" />
              <span>{link.name}</span>
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem 
          onClick={copyToClipboard}
          className="hover:bg-white/5 cursor-pointer flex items-center gap-3"
        >
          <Link2 size={16} className="text-muted-foreground" />
          <span>Copier le lien</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
