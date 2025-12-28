import { Link } from "wouter";
import logoImage from "@assets/LOGO_1766926032524.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-10",
    md: "h-12",
    lg: "h-20"
  };

  return (
    <Link href="/" asChild>
      <a className={`flex items-center group ${className}`} data-testid="link-logo">
        <img 
          src={logoImage} 
          alt="Damo Fama" 
          className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
        />
      </a>
    </Link>
  );
}

export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <img 
      src={logoImage} 
      alt="Damo Fama" 
      className={`h-10 w-auto object-contain ${className}`}
    />
  );
}
