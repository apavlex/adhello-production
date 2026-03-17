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
    <section className="py-2 bg-white px-4">
      <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl bg-brand-dark relative shadow-[0_20px_50px_rgba(0,0,0,0.3),0_10px_30px_rgba(151,114,64,0.15)] border border-white/5">
        {/* Subtle Background Texture/Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 p-2 md:p-3 flex flex-row items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-4 flex-1">
            {/* Circular Image with Glow */}
            <div className="relative flex-shrink-0 group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors pointer-events-none"></div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary/20 p-0.5 relative z-10 transition-transform duration-500 group-hover:scale-105">
                <div className="w-full h-full rounded-full overflow-hidden border border-white/10 shadow-lg relative">
                  <img 
                    src="/alex-profile.png" 
                    alt="Alex Pavlenko" 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=400&h=400&q=80";
                    }}
                  />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 z-20 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-brand-dark animate-pulse"></div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 mb-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-full">
                <Sparkles className="w-2.5 h-2.5 text-primary animate-pulse" />
                <span className="text-[8px] font-bold text-white/60 tracking-widest uppercase">Limited Availability</span>
              </div>
              
              <h2 className="text-sm md:text-base font-black leading-tight tracking-tight uppercase truncate">
                <span className="text-primary italic mr-1">FREE</span>
                <span className="text-white">Website Assessment Video</span>
              </h2>
              
              <p className="text-white/50 text-[10px] md:text-xs font-medium truncate hidden sm:block">
                Get a <span className="text-white italic">personal video</span> from <span className="text-white font-bold">Alex Pavlenko</span> <span className="italic">reviewing your site</span>.
              </p>
            </div>
          </div>

          {/* Button */}
          <div className="flex-shrink-0">
            <button
              onClick={openChat}
              className="group relative bg-primary hover:bg-white text-brand-dark px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-black text-[10px] md:text-xs transition-all duration-300 shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative">GET STARTED</span>
              <div className="w-4 h-4 rounded-full bg-brand-dark text-white flex items-center justify-center group-hover:bg-brand-dark transition-colors relative">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
