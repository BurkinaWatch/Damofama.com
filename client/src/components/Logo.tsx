import { Link } from "wouter";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14"
  };

  return (
    <Link href="/" asChild>
      <a className={`flex items-center gap-1 group ${className}`} data-testid="link-logo">
        <svg 
          viewBox="0 0 280 50" 
          className={`${sizeClasses[size]} w-auto`}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="guitarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(45, 80%, 45%)" />
            </linearGradient>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="hsl(0, 0%, 95%)" />
            </linearGradient>
          </defs>
          
          <g className="transition-transform duration-300 group-hover:translate-x-1">
            <path 
              d="M12 8 L12 42 M8 38 C8 42 16 42 16 38 L16 12 C16 8 8 8 8 12 L8 38 M10 20 L14 20 M10 24 L14 24 M10 28 L14 28 M6 35 L4 40 M18 35 L20 40 M9 6 L9 10 M12 5 L12 10 M15 6 L15 10"
              stroke="url(#guitarGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-300 group-hover:stroke-[2]"
            />
            
            <ellipse cx="12" cy="30" rx="4" ry="6" stroke="url(#guitarGradient)" strokeWidth="1" fill="none" opacity="0.6" />
            <circle cx="12" cy="30" r="1.5" fill="url(#guitarGradient)" opacity="0.8" />
          </g>
          
          <text 
            x="30" 
            y="35" 
            className="font-display font-bold uppercase tracking-tight"
            style={{ 
              fontSize: '28px',
              fontFamily: "'Playfair Display', serif",
              letterSpacing: '-0.02em'
            }}
            fill="url(#textGradient)"
          >
            Damo
          </text>
          
          <text 
            x="115" 
            y="35" 
            className="font-display font-bold uppercase"
            style={{ 
              fontSize: '28px',
              fontFamily: "'Playfair Display', serif",
              letterSpacing: '0.05em'
            }}
            fill="url(#guitarGradient)"
          >
            Fama
          </text>
          
          <line 
            x1="30" 
            y1="42" 
            x2="195" 
            y2="42" 
            stroke="url(#guitarGradient)" 
            strokeWidth="1"
            opacity="0.3"
            className="transition-all duration-300 group-hover:opacity-60"
          />
          
          <g opacity="0.4" className="transition-opacity duration-300 group-hover:opacity-70">
            <circle cx="205" cy="25" r="1" fill="url(#guitarGradient)" />
            <circle cx="212" cy="25" r="0.8" fill="url(#guitarGradient)" />
            <circle cx="218" cy="25" r="0.6" fill="url(#guitarGradient)" />
          </g>
        </svg>
      </a>
    </Link>
  );
}

export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 48" 
      className={`h-10 w-auto ${className}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="guitarIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(45, 80%, 45%)" />
        </linearGradient>
      </defs>
      
      <path 
        d="M12 8 L12 42 M8 38 C8 42 16 42 16 38 L16 12 C16 8 8 8 8 12 L8 38 M10 20 L14 20 M10 24 L14 24 M10 28 L14 28 M6 35 L4 40 M18 35 L20 40 M9 6 L9 10 M12 5 L12 10 M15 6 L15 10"
        stroke="url(#guitarIconGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      <ellipse cx="12" cy="30" rx="4" ry="6" stroke="url(#guitarIconGradient)" strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="12" cy="30" r="1.5" fill="url(#guitarIconGradient)" opacity="0.8" />
    </svg>
  );
}
