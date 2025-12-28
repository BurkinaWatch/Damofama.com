import { Link } from "wouter";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16"
  };

  return (
    <Link href="/" asChild>
      <a className={`flex items-center group ${className}`} data-testid="link-logo">
        <svg 
          viewBox="0 0 320 60" 
          className={`${sizeClasses[size]} w-auto`}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(43, 74%, 49%)" />
            </linearGradient>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(43, 80%, 42%)" />
              <stop offset="100%" stopColor="hsl(35, 70%, 35%)" />
            </linearGradient>
            <linearGradient id="stringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(43, 60%, 60%)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          <g className="transition-transform duration-500 group-hover:translate-x-0.5">
            <ellipse 
              cx="28" 
              cy="30" 
              rx="24" 
              ry="26" 
              fill="url(#bodyGradient)"
              className="transition-all duration-300"
            />
            
            <ellipse 
              cx="28" 
              cy="30" 
              rx="18" 
              ry="20" 
              fill="none"
              stroke="hsl(35, 50%, 25%)"
              strokeWidth="1"
              opacity="0.5"
            />
            
            <ellipse cx="28" cy="32" rx="8" ry="10" fill="hsl(25, 40%, 15%)" />
            <ellipse cx="28" cy="32" rx="6" ry="8" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.6" />
            
            <circle cx="28" cy="18" r="3" fill="hsl(35, 60%, 25%)" />
            <circle cx="28" cy="18" r="2" fill="hsl(25, 40%, 15%)" />
          </g>
          
          <g>
            <rect 
              x="52" 
              y="26" 
              width="260" 
              height="8" 
              rx="2"
              fill="hsl(25, 50%, 20%)"
            />
            
            <rect 
              x="52" 
              y="27" 
              width="260" 
              height="6" 
              rx="1.5"
              fill="hsl(30, 45%, 25%)"
            />
            
            <g opacity="0.15">
              <rect x="80" y="26" width="2" height="8" fill="hsl(var(--primary))" />
              <rect x="120" y="26" width="2" height="8" fill="hsl(var(--primary))" />
              <rect x="160" y="26" width="2" height="8" fill="hsl(var(--primary))" />
              <rect x="200" y="26" width="2" height="8" fill="hsl(var(--primary))" />
              <rect x="240" y="26" width="2" height="8" fill="hsl(var(--primary))" />
              <rect x="280" y="26" width="2" height="8" fill="hsl(var(--primary))" />
            </g>
            
            <line x1="52" y1="27.5" x2="312" y2="27.5" stroke="url(#stringGradient)" strokeWidth="0.5" />
            <line x1="52" y1="29" x2="312" y2="29" stroke="url(#stringGradient)" strokeWidth="0.6" />
            <line x1="52" y1="30.5" x2="312" y2="30.5" stroke="url(#stringGradient)" strokeWidth="0.7" />
            <line x1="52" y1="32" x2="312" y2="32" stroke="url(#stringGradient)" strokeWidth="0.6" />
            
            <rect x="305" y="24" width="10" height="12" rx="2" fill="hsl(25, 40%, 18%)" />
            <g>
              <circle cx="308" cy="27" r="1" fill="url(#goldGradient)" />
              <circle cx="312" cy="27" r="1" fill="url(#goldGradient)" />
              <circle cx="308" cy="30" r="1" fill="url(#goldGradient)" />
              <circle cx="312" cy="30" r="1" fill="url(#goldGradient)" />
              <circle cx="308" cy="33" r="1" fill="url(#goldGradient)" />
              <circle cx="312" cy="33" r="1" fill="url(#goldGradient)" />
            </g>
          </g>
          
          <g>
            <text 
              x="28" 
              y="38" 
              textAnchor="middle"
              className="font-display font-bold"
              style={{ 
                fontSize: '26px',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700
              }}
              fill="hsl(25, 40%, 12%)"
            >
              D
            </text>
            
            <text 
              x="70" 
              y="24" 
              className="font-display font-bold uppercase"
              style={{ 
                fontSize: '18px',
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '0.15em',
                fontWeight: 600
              }}
              fill="white"
            >
              AMO
            </text>
            
            <text 
              x="138" 
              y="24" 
              className="font-display font-bold uppercase"
              style={{ 
                fontSize: '18px',
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '0.15em',
                fontWeight: 600
              }}
              fill="url(#goldGradient)"
            >
              FAMA
            </text>
          </g>
        </svg>
      </a>
    </Link>
  );
}

export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 50 60" 
      className={`h-10 w-auto ${className}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="iconBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(43, 80%, 42%)" />
          <stop offset="100%" stopColor="hsl(35, 70%, 35%)" />
        </linearGradient>
      </defs>
      
      <ellipse cx="25" cy="30" rx="22" ry="26" fill="url(#iconBodyGradient)" />
      <ellipse cx="25" cy="32" rx="8" ry="10" fill="hsl(25, 40%, 15%)" />
      <circle cx="25" cy="18" r="3" fill="hsl(35, 60%, 25%)" />
      
      <text 
        x="25" 
        y="38" 
        textAnchor="middle"
        style={{ 
          fontSize: '24px',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700
        }}
        fill="hsl(25, 40%, 12%)"
      >
        D
      </text>
    </svg>
  );
}
