import React from 'react';
import { Smile } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'dark', className = "" }: LogoProps) {
  const logoSrc = variant === 'light' ? '/logo-dark.png' : '/logo-light.png';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoSrc} 
        alt="AdHello.ai" 
        className="h-2.5 md:h-3.5 w-auto object-contain transition-transform hover:scale-105"
        onError={(e) => {
          // Fallback if specific variants are missing
          e.currentTarget.src = '/logo.png';
        }}
      />
    </div>
  );
}

