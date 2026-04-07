import React from 'react';
import { ArrowRight } from 'lucide-react';

export function AssessmentCTA() {
  return (
    <section className="py-2 bg-warm-cream px-4 border-t border-brand-dark/8">
      <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl bg-brand-dark relative shadow-[0_20px_50px_rgba(0,0,0,0.3),0_10px_30px_rgba(151,114,64,0.15)] border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 p-2 md:p-3 flex flex-row items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-4 flex-1">
            {/* Profile photo */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary/20 p-0.5 relative z-10">
                <div className="w-full h-full rounded-full overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src="/alex-pavlenko.jpg"
                    alt="Alex Pavlenko"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/alex-profile.png";
                    }}
                  />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 z-20 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-brand-dark animate-pulse"></div>
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-black leading-tight tracking-tight text-white">
                Get a <span className="text-primary">free website review</span> from AdHello
              </h2>
              <p className="text-xs md:text-sm font-medium text-white/50">
                Strategy Team at AdHello.ai — Message us on X and we'll personally review your site.
              </p>
            </div>
          </div>
          {/* Button */}
          <div className="flex-shrink-0">
            <a
              href="https://x.com/messages/compose?recipient_id=adhello"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-primary hover:bg-white text-brand-dark px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-black text-[10px] md:text-xs transition-all duration-300 shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {/* X logo */}
              <svg className="w-3.5 h-3.5 relative" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
              <span className="relative">GET YOUR REVIEW</span>
              <div className="w-4 h-4 rounded-full bg-brand-dark text-white flex items-center justify-center group-hover:bg-brand-dark transition-colors relative">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
