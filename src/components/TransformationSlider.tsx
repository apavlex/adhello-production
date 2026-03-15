import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight, MousePointer2, Zap, XCircle, CheckCircle2 } from 'lucide-react';

export const TransformationSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isResizing || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    setSliderPos(Math.max(0, Math.min(100, position)));
  };

  useEffect(() => {
    const onUp = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isResizing]);

  return (
    <section className="py-24 bg-white overflow-hidden" id="transformations">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 tracking-tight">
            The AdHello Transformation
          </h2>
          <p className="text-brand-dark/60 max-w-2xl mx-auto text-xl">
            See how we turn cluttered, slow-loading agency sites into high-performance lead machines.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Comparison Container */}
          <div 
            ref={containerRef}
            className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 cursor-ew-resize select-none group"
            onMouseDown={() => setIsResizing(true)}
            onTouchStart={() => setIsResizing(true)}
          >
            {/* After Image (The "New" Site) */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2426&q=80" 
                alt="After AdHello"
                className="w-full h-full object-cover"
              />
              {/* Overlay Label */}
              <div className="absolute top-8 right-8 bg-primary text-brand-dark px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg z-20">
                AdHello Smart Site
              </div>
              
              {/* Feature Tags (Only visible on "After" side) */}
              <div className="absolute bottom-12 right-12 space-y-3 z-20 hidden md:block">
                <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-primary/20 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-brand-dark">98/100 SEO Score</span>
                </div>
                <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-primary/20 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="font-bold text-brand-dark">Instant Load Speed</span>
                </div>
              </div>
            </div>

            {/* Before Image (The "Old" Site) */}
            <div 
              className="absolute inset-0 z-10 grayscale-[0.5] brightness-[0.8]"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=2344&q=80" 
                alt="Before AdHello"
                className="w-full h-full object-cover"
              />
              {/* Overlay Label */}
              <div className="absolute top-8 left-8 bg-gray-800 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg">
                Old Agency Site
              </div>

              {/* Pain Points (Only visible on "Before" side) */}
              <div className="absolute bottom-12 left-12 space-y-3 hidden md:block">
                <div className="bg-black/60 backdrop-blur p-4 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-white">Slow & Clunky</span>
                </div>
                <div className="bg-black/60 backdrop-blur p-4 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-white">Zero Lead Capture</span>
                </div>
              </div>
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 z-30 w-1 bg-white cursor-ew-resize"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-primary transition-transform group-hover:scale-110">
                <ArrowLeftRight className="w-6 h-6 text-brand-dark" />
              </div>
            </div>
          </div>

          {/* Interaction Prompt */}
          <div className="mt-8 flex items-center justify-center gap-3 text-brand-dark/40 font-bold animate-pulse">
            <MousePointer2 className="w-5 h-5" />
            <span>Drag the slider to compare</span>
          </div>
        </div>
      </div>
    </section>
  );
};
