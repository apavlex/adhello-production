import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export function AssessmentCTA() {
  const openChat = () => {
    try {
      // @ts-ignore
      if (window.chatbase) {
        // @ts-ignore
        window.chatbase('open');
      }
    } catch (e) {
      console.error("Error opening chat:", e);
    }
  };

  return (
    <section className="py-12 bg-white px-4">
      <div className="max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-brand-dark relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5">
        {/* Logo in the corner */}
        <div className="absolute top-8 left-8 z-20 hidden md:block opacity-20 hover:opacity-100 transition-opacity">
          <Logo variant="light" className="h-6 w-auto" />
        </div>

        {/* Subtle Background Texture/Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-yellow-400/5 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Circular Image with Glow */}
          <div className="relative flex-shrink-0 group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors pointer-events-none"></div>
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-primary/20 p-1.5 relative z-10 transition-transform duration-500 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-2xl relative">
                <img 
                  src="/alex.jpg" 
                  alt="Alex Pavlenko" 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                  onError={(e) => {
                    // Fallback to a placeholder if image is missing
                    e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=400&h=400&q=80";
                  }}
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="absolute bottom-4 right-4 z-20 w-5 h-5 bg-green-500 rounded-full border-4 border-brand-dark animate-pulse"></div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Limited Availability</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] tracking-tighter">
              <span className="text-primary block italic">FREE</span>
              <span className="text-white">WEBSITE </span>
              <span className="text-white block">ASSESSMENT </span>
              <span className="text-white">VIDEO</span>
            </h2>
            
            <p className="text-white/60 text-lg md:text-xl mb-8 max-w-lg leading-relaxed font-medium">
              Get a personal video recording from <span className="text-white font-bold">Alex Pavlenko</span> reviewing your website to help you become more successful online.
            </p>

            <button
              onClick={openChat}
              className="group relative bg-primary hover:bg-white text-brand-dark px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative">GET STARTED</span>
              <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center group-hover:bg-brand-dark transition-colors relative">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
