import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Layout, 
  ChevronRight, 
  Lock, 
  MousePointerClick,
  Palette,
  FileText,
  Search,
  ShieldCheck
} from 'lucide-react';
import { Logo } from './Logo';

export default function BlueprintSalesPage() {
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
  const scoreRaw = searchParams.get('score');
  const score = scoreRaw ? parseInt(scoreRaw) : 78;
  const city = searchParams.get('city') || '';
  const themes = searchParams.get('themes') || '';
  
  // Calculate revenue leak (X%)
  const revenueLeak = 100 - score;

  return (
    <div className="min-h-screen bg-warm-cream selection:bg-primary/40 text-brand-dark font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-brand-dark/5 px-6 py-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <Logo variant="dark" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-brand-dark/40 uppercase tracking-widest hidden sm:inline">Blueprint ID: #B44-{Math.floor(Math.random() * 9000) + 1000}</span>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Verified Report
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary-dark text-sm font-black mb-6 border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            Personalized for {bizName}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-tight"
          >
            Your Audit is Done. <br />
            <span className="text-primary italic">Here is the Fix.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-brand-dark/70 max-w-3xl mx-auto leading-relaxed font-medium mb-12"
          >
            Don't waste weeks on a "redesign." Get the high-fidelity mockups, the high-converting copy, and the exact Base44 code to launch your new $5,000-quality website in under 20 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button 
              onClick={() => navigate(`/fulfillment?biz=${bizRaw}&score=${score}&city=${city}&themes=${themes}`)}
              className="bg-primary hover:bg-primary-hover text-brand-dark px-10 py-5 rounded-full font-black text-xl flex items-center gap-3 mx-auto transition-all hover:scale-105 shadow-2xl shadow-primary/20 w-fit group"
            >
              Get My Custom Blueprint & Base44 Code ($27)
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-4 text-sm font-bold text-brand-dark/40 uppercase tracking-widest">One-time payment. Instant Access.</p>
          </motion.div>
        </div>

        {/* Section 1: The Problem */}
        <section className="mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-brand-dark rounded-[4rem] -rotate-3 -z-10 hidden lg:block" />
          <div className="bg-brand-dark text-white p-10 md:p-20 rounded-[4rem] flex flex-col lg:flex-row items-center gap-16 shadow-2xl relative overflow-hidden">
            <div className="lg:w-1/3 flex flex-col items-center">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-white/10" strokeWidth="8" cx="50" cy="50" r="42" fill="transparent" stroke="currentColor" />
                  <motion.circle
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-primary"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50" cy="50" r="42"
                    fill="transparent"
                    stroke="currentColor"
                    strokeDasharray="264"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-6xl sm:text-7xl font-black">{score}</span>
                  <span className="block text-sm font-black uppercase tracking-widest text-primary">Audit Score</span>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                The <span className="text-primary italic">Revenue Leak</span> in {bizName}
              </h2>
              <div className="space-y-6 text-xl text-white/70 leading-relaxed font-medium">
                <p>
                  Your audit showed a <span className="text-white font-black underline decoration-primary underline-offset-4">{score} Score</span>. In plain English, that means for every 100 people who visit your site, you are losing <span className="text-primary font-black">{revenueLeak}%</span> of them to a competitor with a better 'Vibe' and clearer 'Trust Bar.'
                </p>
                <p>
                  You don't need a new hobby; you need a professional storefront that works while you sleep.
                </p>
              </div>
              <div className="mt-12 flex flex-wrap gap-4">
                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl">
                  <p className="text-2xl font-black text-primary">{revenueLeak}%</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">Lost Opportunity</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl">
                  <p className="text-2xl font-black text-white">95+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">Target Optimization</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: What's Inside */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              What’s Inside the <span className="text-primary">$27 Blueprint?</span>
            </h2>
            <p className="text-brand-dark/60 text-xl font-bold">
              We’ve used the data from your audit to architect a custom solution:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-brand-dark/5 shadow-xl hover:translate-y-[-8px] transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4">3 High-Fidelity Design Variants</h3>
              <p className="text-brand-dark/60 text-lg leading-relaxed font-medium">
                Professional Desktop and Mobile mockups tailored to your industry. No generic templates—these are built for your brand, maintaining your legacy while modernizing your vibe.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-brand-dark/5 shadow-xl hover:translate-y-[-8px] transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4">The 'Customer Gold' Copy Pack</h3>
              <p className="text-brand-dark/60 text-lg leading-relaxed font-medium">
                We’ve analyzed your top reviews to write headlines that actually make people click "Book Now." High-converting copy that addresses {bizName}'s customer pain points instantly.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-brand-dark/5 shadow-xl hover:translate-y-[-8px] transition-all duration-300 group md:col-span-1">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4">The Base44 'Vibe Code'</h3>
              <p className="text-brand-dark/60 text-lg leading-relaxed font-medium">
                A proprietary prompt string. Copy and paste it into Base44 to generate your pixel-perfect site instantly. Your new identity, architected by AI.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-brand-dark/5 shadow-xl hover:translate-y-[-8px] transition-all duration-300 group md:col-span-1">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4">The Local SEO Starter Kit</h3>
              <p className="text-brand-dark/60 text-lg leading-relaxed font-medium">
                Pre-written Meta Titles and Descriptions optimized for your specific city and service. Dominate Google and AI search from Day 1.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Speed Guarantee */}
        <section className="mb-32 text-center bg-white border border-brand-dark/5 p-12 md:p-24 rounded-[4rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <Zap className="w-16 h-16 text-primary mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">The "Speed to Market" Guarantee</h2>
            <p className="text-2xl md:text-4xl font-medium text-brand-dark/80 max-w-4xl mx-auto leading-tight italic">
              "Most agencies take 30 days and $3,000 to get to this stage. You’re getting the exact same strategic output for the cost of a pizza—delivered to your inbox in seconds."
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <div id="pricing" className="text-center pt-20 border-t border-brand-dark/5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-12">Upgrade your <span className="text-primary italic">{score} score</span> to a <span className="italic underline underline-offset-8 decoration-primary">95</span> today.</h2>
            <div className="bg-white p-12 rounded-[4rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] border border-brand-dark/5 relative max-w-2xl mx-auto">
               <div className="flex justify-between items-center mb-8">
                 <div className="text-left">
                   <p className="text-sm font-black text-brand-dark/40 uppercase tracking-widest">Base44 Blueprint</p>
                   <h3 className="text-3xl font-black">All-In-One Fix</h3>
                 </div>
                 <div className="text-right">
                    <p className="text-4xl font-black text-primary">$27</p>
                    <p className="text-xs font-bold text-brand-dark/40">One-time payment</p>
                 </div>
               </div>
               
               <button 
                onClick={() => navigate(`/fulfillment?biz=${bizRaw}&score=${score}&city=${city}&themes=${themes}`)}
                className="w-full py-6 bg-primary hover:bg-primary-hover text-brand-dark font-black rounded-3xl text-2xl transition-all hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(243,221,109,0.5)] flex items-center justify-center gap-3 mb-6"
               >
                 <Lock className="w-6 h-6" />
                 Get My Custom Blueprint Now
               </button>
               
               <div className="flex items-center justify-center gap-6 text-sm font-bold text-brand-dark/40">
                 <div className="flex items-center gap-1">
                   <ShieldCheck className="w-4 h-4" />
                   Secure SSL
                 </div>
                 <div className="flex items-center gap-1">
                   <Zap className="w-4 h-4" />
                   Instant Delivery
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="py-12 border-t border-brand-dark/5 text-center px-4">
        <p className="text-sm font-bold text-brand-dark/40 uppercase tracking-widest">© 2024 AdHello.ai &bull; Base44 Blueprint Division &bull; Built for growth.</p>
      </footer>
    </div>
  );
}
