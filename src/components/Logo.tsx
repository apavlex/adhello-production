import React from 'react';
import { Smile } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'dark', className = "" }: LogoProps) {
  // variant="light" means ON a light background (needs dark logo)
  // variant="dark" means ON a dark background (needs light/white logo)
  const logoSrc = variant === 'light' ? '/logo-dark.png' : '/logo-light.png';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoSrc} 
        alt="AdHello.ai" 
        className="h-9 md:h-12 w-auto object-contain transition-all hover:scale-105 active:scale-95 saturate-[1.1]"
      />
    </div>
  );
}

