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
    <section className="py-4 bg-white px-4">
      <div className="max-w-6xl mx-auto overflow-hidden rounded-3xl bg-brand-dark relative shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/5">
        {/* Subtle Background Texture/Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-yellow-400/5 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 p-4 md:p-5 flex flex-row items-center gap-4 md:gap-8">
          {/* Circular Image with Glow */}
          <div className="relative flex-shrink-0 group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors pointer-events-none"></div>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-primary/20 p-1 relative z-10 transition-transform duration-500 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-2xl relative">
                <img 
                  src="/alex.jpg" 
                  alt="Alex Pavlenko" 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=400&h=400&q=80";
                  }}
                />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 z-20 w-3 h-3 bg-green-500 rounded-full border-4 border-brand-dark animate-pulse"></div>
          </div>

          {/* Content Wrapper */}
          <div className="flex-1 flex flex-row items-center gap-4 md:gap-8 text-left w-full">
            {/* Text Content */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-2 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-[9px] font-bold text-white/60 tracking-widest uppercase">Limited Availability</span>
              </div>
              
              <h2 className="text-xl md:text-2xl font-black mb-1 leading-tight tracking-tighter uppercase">
                <span className="text-primary italic inline-block mr-2">FREE</span>
                <span className="text-white">Website Assessment Video</span>
              </h2>
              
              <p className="text-white/60 text-sm md:text-base max-w-xl leading-relaxed font-medium">
                Get a personal video recording from <span className="text-white font-bold">Alex Pavlenko</span> reviewing your website.
              </p>
            </div>

            {/* Button */}
            <div className="flex-shrink-0">
              <button
                onClick={openChat}
                className="group relative bg-primary hover:bg-white text-brand-dark px-6 py-3 rounded-xl font-black text-sm transition-all duration-300 shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative">GET STARTED</span>
                <div className="w-5 h-5 rounded-full bg-brand-dark text-white flex items-center justify-center group-hover:bg-brand-dark transition-colors relative">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
