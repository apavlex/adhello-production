import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Loader2, 
  Download, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft,
  Zap,
  Layout,
  MousePointerClick,
  Palette,
  Search,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Logo } from './Logo';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';

export default function FulfillmentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bizRaw = searchParams.get('biz') || 'Your Business';
  const bizName = bizRaw
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  const score = searchParams.get('score') || '78';
  const city = searchParams.get('city') || '';
  const themes = searchParams.get('themes')?.split(',') || [];
  
  const [status, setStatus] = useState<'analyzing' | 'complete' | 'error'>('analyzing');
  const [progress, setProgress] = useState(0);
  const [blueprint, setBlueprint] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const blueprintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'analyzing') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 2;
        });
      }, 200);
      
      generateBlueprint();
    }
    return () => clearInterval(interval);
  }, [status]);

  const generateBlueprint = async () => {
    try {
      const response = await fetch('/api/fulfill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bizName, 
          city, 
          score: parseInt(score), 
          reviewThemes: themes 
        })
      });

      if (!response.ok) throw new Error('Fulfillment failed');
      
      const data = await response.json();
      setBlueprint(data.blueprint);
      setProgress(100);
      setTimeout(() => setStatus('complete'), 500);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleDownload = async () => {
    if (!blueprintRef.current) return;
    setIsDownloading(true);
    try {
      const element = blueprintRef.current;
      const opt = {
        margin: [15, 15] as [number, number],
        filename: `Strategic-Blueprint-${bizName.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      alert("PDF generation failed. Please try printing the page instead.");
    } finally {
      setIsDownloading(false);
    }
  };

  const steps = [
    { label: 'Verifying Transaction & Audit Data', threshold: 25 },
    { label: 'Initializing B2B Web Architect Engine', threshold: 50 },
    { label: 'Architecting Design & Copy Assets', threshold: 75 },
    { label: 'Finalizing Local SEO Implementation', threshold: 99 },
  ];

  return (
    <div className="min-h-screen bg-warm-cream selection:bg-primary/40 text-brand-dark font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-brand-dark/5 px-6 py-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <Logo variant="dark" />
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Payment Confirmed
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {status === 'analyzing' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center py-20"
            >
              <div className="relative w-40 h-40 mx-auto mb-12">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-brand-dark/5 stroke-current" strokeWidth="6" cx="50" cy="50" r="44" fill="transparent" />
                  <motion.circle 
                    className="text-primary stroke-current" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    cx="50" cy="50" r="44" 
                    fill="transparent"
                    strokeDasharray="276"
                    animate={{ strokeDashoffset: 276 - (276 * progress) / 100 }}
                    transition={{ ease: "easeOut", duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Architecting Your Blueprint...</h1>
              <p className="text-lg text-brand-dark/60 font-bold mb-12">Building a conversion-optimized identity for {bizName}</p>

              <div className="max-w-sm mx-auto space-y-4 text-left">
                {steps.map((step, idx) => {
                  const isDone = progress >= step.threshold;
                  const isCurrent = progress < step.threshold && (idx === 0 || progress >= steps[idx - 1].threshold);
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-brand-dark/10" />
                      )}
                      <span className={`font-bold ${isDone ? 'text-brand-dark/40' : isCurrent ? 'text-brand-dark' : 'text-brand-dark/20'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {status === 'complete' && (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">Build in Progress.</h1>
                  <p className="text-xl text-brand-dark/60 font-bold">Your Strategic Web Architecture is ready.</p>
                </div>
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50 h-fit"
                >
                  {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  Download Blueprint PDF
                </button>
              </div>

              {/* The Deliverable Document */}
              <div ref={blueprintRef} className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-brand-dark/5 mb-16 relative overflow-hidden">
                {/* PDF Header Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-16 pb-8 border-b border-brand-dark/5">
                    <div>
                      <Logo variant="dark" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30 mt-4">Confidential Strategic Blueprint</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-brand-dark/40 uppercase tracking-widest">Client Name</p>
                      <p className="text-xl font-black text-brand-dark">{bizName}</p>
                    </div>
                  </div>

                  {/* Visual Style Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                      { name: 'Modern Bento', icon: Layout, desc: 'High-velocity grid for ' + city, color: 'bg-blue-50 text-blue-600' },
                      { name: 'Split-Hero', icon: Zap, desc: 'Conversion-first structural layout', color: 'bg-purple-50 text-purple-600' },
                      { name: 'Dark Elite', icon: ShieldCheck, desc: 'Premium architectural authority', color: 'bg-zinc-900 text-zinc-100' }
                    ].map((style, i) => (
                      <div key={i} className={`p-6 rounded-3xl border border-brand-dark/5 shadow-sm transition-all hover:shadow-md ${style.color}`}>
                        <div className="mb-4">
                          <style.icon className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-black mb-2">{style.name}</h4>
                        <p className="text-xs font-bold opacity-70 leading-relaxed">{style.desc}</p>
                        <div className="mt-4 pt-4 border-t border-current/10 flex items-center justify-between">
                          <span className="text-[10px] uppercase font-black tracking-widest">Architected ✓</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="prose-manual max-w-none mb-20">
                    <ReactMarkdown>{blueprint || ''}</ReactMarkdown>
                  </div>

                  <div className="mt-20 pt-12 border-t border-brand-dark/5 text-center px-4 py-8 bg-brand-dark rounded-[2rem] text-white">
                    <TrendingUp className="w-12 h-12 text-primary mx-auto mb-6" />
                    <h3 className="text-2xl font-black mb-4 underline decoration-primary underline-offset-8 decoration-4 uppercase tracking-tighter">Next Step: Activation</h3>
                    <p className="text-lg font-bold text-white/70 max-w-xl mx-auto mb-8">
                      Your architecture is ready. To launch this design into a live revenue engine, use the Base44 AI Engine with your custom Vibe Prompts above.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button 
                        onClick={() => window.open('https://base44.pxf.io/c/6926562/2049275/25619?trafcat=base', '_blank')}
                        className="w-full sm:w-auto bg-primary text-brand-dark px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 active:scale-95"
                      >
                        <Zap className="w-6 h-6 fill-current" />
                        Launch Base44 Engine
                      </button>
                      <button 
                        onClick={() => window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank')}
                        className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        Book Scale Session
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Award className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-3xl font-black mb-4">Generation Interrupted</h2>
              <p className="text-lg text-brand-dark/60 font-bold mb-8">We encountered a temporary issue with the fulfillment engine while architecting your report.</p>
              <button 
                onClick={() => setStatus('analyzing')}
                className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold"
              >
                Retry Generation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-brand-dark/5 text-center px-4">
        <p className="text-sm font-bold text-brand-dark/40 uppercase tracking-widest">© 2024 AdHello.ai &bull; Fulfillment Division &bull; Secure AI Operations</p>
      </footer>
    </div>
  );
}
