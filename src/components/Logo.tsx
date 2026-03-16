import React from 'react';
import { Smile } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'dark', className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-primary rounded-full shadow-sm transition-transform hover:scale-105`}>
        <Smile className="w-5 h-5 md:w-6 h-6 text-brand-dark" />
      </div>
      <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${variant === 'light' ? 'text-white' : 'text-brand-dark'}`}>
        AdHello<span className="text-primary italic">.ai</span>
      </h2>
    </div>
  );
}

