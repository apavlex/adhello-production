import React from 'react';
import { ShieldCheck, Star, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface SatisfactionGuaranteeProps {
  className?: string;
  variant?: 'compact' | 'full';
}

const containerVars = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1
    }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function SatisfactionGuarantee({ className = "", variant = 'full' }: SatisfactionGuaranteeProps) {
  if (variant === 'compact') {
    return (
      <motion.div 
        variants={containerVars}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`relative ${className}`}
      >
        <div className="flex items-start gap-6">
          <div className="shrink-0 relative">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-3.5 rounded-2xl shadow-lg shadow-amber-200 relative z-10">
              <ShieldCheck className="w-6 h-6 text-brand-dark" />
            </div>
            {/* Tiny "IT'S FREE" sticker for compact view */}
            <div className="absolute -top-4 -left-4 yellow-burst !py-1 !px-2 !text-[9px] font-black !rotate-[-12deg] z-20 whitespace-nowrap shadow-xl !transform-none">
              IT'S FREE!
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h4 className="text-xl font-black text-brand-dark">30-Day Happiness Guarantee</h4>
            </div>
            
            <p className="text-brand-dark/70 text-[13px] font-medium leading-relaxed mb-4">
              Not delighted? Just message us within 30 days for a prompt refund. <span className="text-brand-dark font-black underline decoration-amber-400/40 decoration-2 underline-offset-2">No questions asked.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-brand-dark/5">
              <div className="flex flex-col">
                <span className="digital-signature text-2xl -mt-1 scale-90 origin-left">Alex Pavlenko</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Founder, AdHello.ai</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`relative group ${className}`}
    >
      {/* Decorative Glows */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-400/20 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-[100px] opacity-60"></div>

      <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[3.5rem] p-10 md:p-16 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden ring-1 ring-black/[0.03]">
        <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-center relative z-10">
          
          <div className="space-y-8">
            <motion.div variants={itemVars} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-black uppercase tracking-widest">
              <Award className="w-4 h-4" />
              Direct Founder Accountability
            </motion.div>
            
            <motion.div variants={itemVars} className="space-y-4">
              <h3 className="text-5xl md:text-6xl font-black text-brand-dark leading-[1.1] tracking-tight">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Ironclad</span><br />
                30-Day Guarantee
              </h3>
              <p className="text-2xl text-brand-dark/70 font-medium leading-relaxed max-w-2xl">
                We're so confident AdHello will beat your best ads that we offer a full refund if you aren't <span className="text-brand-dark font-black underline decoration-amber-400 decoration-8 underline-offset-4">completely delighted</span>.
              </p>
            </motion.div>

            <motion.div variants={itemVars} className="grid sm:grid-cols-2 gap-6 pt-4">
              {[
                "Prompt, full refund within 30 days",
                "Zero risk to try AdHello",
                "No questions or hurdles",
                "Direct access to our founding team"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-brand-dark/80">{text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVars} className="pt-10 border-t border-brand-dark/5 flex flex-col sm:flex-row sm:items-center gap-8">
              <div className="space-y-1">
                <span className="digital-signature text-6xl text-brand-dark/90">Alex Pavlenko</span>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40 px-1">Founder, AdHello.ai</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVars}
            className="hidden lg:flex flex-col items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-3xl scale-125 animate-pulse"></div>
            <div className="yellow-burst relative z-10 p-12 text-center text-2xl font-black rotate-[-3deg] shadow-2xl scale-110">
              IT MUST BEAT<br/>YOUR BEST ADS<br/>OR IT'S FREE!
            </div>
            <p className="mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
              Validated Result Guarantee
            </p>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
