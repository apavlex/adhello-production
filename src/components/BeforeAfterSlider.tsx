import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Old Site",
  afterLabel = "AdHello Smart Site"
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeContainerRef = useRef<HTMLDivElement>(null);
  const afterContainerRef = useRef<HTMLDivElement>(null);

  // Sync scrolling between containers
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    setScrollPosition(scrollTop);

    if (beforeContainerRef.current) beforeContainerRef.current.scrollTop = scrollTop;
    if (afterContainerRef.current) afterContainerRef.current.scrollTop = scrollTop;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (clientX: number) => {
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
      
      setSliderPosition(percent);
      container.style.setProperty('--slider-pos', `${percent}%`);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };

    const onEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  const highlights = [
    { top: '15%', left: '20%', text: 'Smart Lead Capture' },
    { top: '35%', left: '70%', text: 'Conversion-Optimized Layout' },
    { top: '55%', left: '30%', text: 'Dynamic Portfolio Gallery' },
    { top: '80%', left: '60%', text: 'Integrated Trust Signals' },
  ];

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 select-none bg-gray-50 group h-[600px]"
      ref={containerRef}
      style={{ 
        ['--slider-pos' as any]: `${sliderPosition}%`
      }} 
    >
      {/* Scrollable Wrapper */}
      <div 
        className="absolute inset-0 overflow-y-auto scrollbar-hide"
        onScroll={handleScroll}
      >
        <div className="relative h-[2000px] w-full">
          {/* After Image (Background) */}
          <div 
            ref={afterContainerRef}
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          >
            <img
              src={afterImage}
              alt="New AdHello Smart Site"
              className="w-full h-auto object-top"
            />

            {/* Feature Highlights Overlay */}
            {highlights.map((h, i) => (
              <div 
                key={i}
                className="absolute z-30 transition-all duration-500"
                style={{ 
                  top: h.top, 
                  left: h.left,
                  opacity: sliderPosition < (parseFloat(h.left) + 10) ? 1 : 0,
                  transform: `scale(${sliderPosition < (parseFloat(h.left) + 10) ? 1 : 0.5})`
                }}
              >
                <div className="bg-primary/90 backdrop-blur-md text-brand-dark px-4 py-2 rounded-full font-black text-[10px] shadow-2xl border border-white/20 flex items-center gap-2 whitespace-nowrap">
                   <Sparkles className="w-3 h-3" />
                   {h.text}
                </div>
              </div>
            ))}
          </div>

          {/* Before Image (Foreground, Clipped) */}
          <div 
            ref={beforeContainerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-75"
            style={{ clipPath: `inset(0 calc(100% - var(--slider-pos)) 0 0)` }}
          >
            <img
              src={beforeImage}
              alt="Old Site"
              className="w-full h-auto object-top filter blur-[0.5px] grayscale-[0.2]"
            />
            {/* Dark overlay specifically for the old site */}
            <div className="absolute inset-0 bg-black/15 mix-blend-multiply h-full"></div>
          </div>
        </div>
      </div>

      {/* Slider Handle (Interactive Layer) */}
      <div 
        className="absolute inset-0 z-40 pointer-events-none"
      >
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white/80 backdrop-blur-sm cursor-ew-resize pointer-events-auto"
          style={{ left: `calc(var(--slider-pos) - 2px)` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex items-center justify-center border-4 border-white transition-transform duration-300 hover:scale-110 active:scale-95">
            <div className="flex gap-0.5 items-center text-brand-dark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 w-12 -left-[22px] bg-white/10 blur-xl pointer-events-none"></div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <div 
          className="transition-all duration-500 ease-out"
          style={{ 
            opacity: sliderPosition > 15 ? 1 : 0,
            transform: `translateX(${sliderPosition > 15 ? 0 : -20}px)`
          }}
        >
          <div className="bg-brand-dark/80 backdrop-blur-xl text-white px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm border border-white/10 shadow-2xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
            {beforeLabel.toUpperCase()}
          </div>
        </div>
      </div>
      
      <div className="absolute top-8 right-8 z-10 pointer-events-none">
        <div 
          className="transition-all duration-500 ease-out"
          style={{ 
            opacity: sliderPosition < 85 ? 1 : 0,
            transform: `translateX(${sliderPosition < 85 ? 0 : 20}px)`
          }}
        >
          <div className="bg-primary/90 backdrop-blur-xl text-brand-dark px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm border border-brand-dark/10 shadow-2xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce"></div>
            {afterLabel.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Dynamic Info Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
         <div className="bg-white/20 backdrop-blur-md text-white/80 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow-lg">
           Slide to compare • Scroll to see full site
         </div>
      </div>
    </div>
  );
}
