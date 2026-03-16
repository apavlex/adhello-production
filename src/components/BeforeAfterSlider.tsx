import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Old Agency Site",
  afterLabel = "AdHello Smart Site"
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 select-none cursor-ew-resize bg-gray-50 group"
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      style={{ 
        aspectRatio: '16/22',
        ['--slider-pos' as any]: `${sliderPosition}%`
      }} 
    >
      {/* After Image (New Site - Background) */}
      <img
        src={afterImage}
        alt="New AdHello Smart Site"
        className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
        onDragStart={(e) => e.preventDefault()}
      />

      {/* Before Image (Old Site - Foreground, Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-75"
        style={{ clipPath: `inset(0 calc(100% - var(--slider-pos)) 0 0)` }}
      >
        <img
          src={beforeImage}
          alt="Old Agency Site"
          className="absolute inset-0 w-full h-full object-cover object-top filter blur-[0.5px] grayscale-[0.2]"
          onDragStart={(e) => e.preventDefault()}
        />
        {/* Dark overlay specifically for the old site to make it look "older/clunkier" */}
        <div className="absolute inset-0 bg-black/15 mix-blend-multiply"></div>
      </div>

      {/* Labels */}
      <div 
        className="absolute top-8 left-8 z-10 pointer-events-none transition-all duration-500 ease-out" 
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
      
      <div 
        className="absolute top-8 right-8 z-10 pointer-events-none transition-all duration-500 ease-out" 
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

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white/80 backdrop-blur-sm cursor-ew-resize z-20 shadow-[0_0_20_rgba(0,0,0,0.5)]"
        style={{ left: `calc(var(--slider-pos) - 2px)` }}
      >
        {/* Slider Handle */}
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
        
        {/* Glow effect around the line */}
        <div className="absolute inset-0 w-12 -left-[22px] bg-white/10 blur-xl pointer-events-none"></div>
      </div>

      {/* Dynamic Info Badge (optional) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="bg-white/20 backdrop-blur-md text-white/80 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
           Drag to compare
         </div>
      </div>
    </div>
  );
}

