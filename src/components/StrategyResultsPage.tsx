import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  Clock, 
  MousePointerClick,
  ChevronRight,
  Lock,
  Mail,
  User,
  Phone,
  Search,
  Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';

export default function StrategyResultsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const data = sessionStorage.getItem('quizData');
    if (data) {
      setFormData(JSON.parse(data));
    } else {
      // Fallback if no data (rare)
      setFormData({
        bizName: 'Your Business',
        industry: 'Home Services',
        city: 'Local Area',
        goal: 'Leads',
        vibe: 'Modern'
      });
    }
  }, []);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to save lead
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      // In a real app, we'd send leadInfo + formData to our backend/CRM
    } catch (error) {
      console.error('Lead submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) return null;

  const promptString = `Create a high-converting, premium website for ${formData.bizName} in ${formData.city}. Industry: ${formData.industry}. Primary Goal: ${formData.goal}. Design Vibe: ${formData.vibe}. Focus on mobile-first architecture, local GEO relevance, and high-trust conversion elements.`;

  return (
    <div className="min-h-screen bg-warm-cream selection:bg-primary/40 text-brand-dark font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-brand-dark/5 px-6 py-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <Logo variant="dark" />
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-primary/20">
            <Sparkles className="w-3 h-3" />
            Strategic Blueprint Ready
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-brand-dark text-xs font-black mb-6 shadow-sm uppercase tracking-widest"
          >
            Phase 1: Architecture Complete
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight"
          >
            Your Strategy for <br />
            <span className="text-primary italic">{formData.bizName}</span> is Prepared.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-brand-dark/60 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            We've distilled your goals into a high-converting blueprint. Now, choose the fastest path to launch.
          </motion.p>
        </div>

        {/* The Prompt Card */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-dark text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Personalized AI Prompt</h3>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Base44 Compatible</p>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl mb-8">
                <p className="text-lg md:text-xl font-medium leading-relaxed italic text-white/90">
                  "{promptString}"
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                  <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Vibe</p>
                  <p className="font-bold">{formData.vibe}</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                  <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Goal</p>
                  <p className="font-bold">{formData.goal}</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                  <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Industry</p>
                  <p className="font-bold">{formData.industry}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Sales Pitch & Lead Form */}
        <section className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              Why Go Professional <br />
              <span className="text-primary italic">with AdHello.ai?</span>
            </h2>
            <div className="space-y-6">
              {[
                { 
                  icon: <Smartphone className="w-6 h-6" />, 
                  title: "Concierge Build", 
                  desc: "Stop wrestling with DIY builders. Our team handles the design, copy, and technical SEO structure for you." 
                },
                { 
                  icon: <Globe className="w-6 h-6" />, 
                  title: "Managed Hosting & Speed", 
                  desc: "We host your site on ultra-fast edge servers, ensuring 99.9% uptime and lightning-fast load speeds." 
                },
                { 
                  icon: <Search className="w-6 h-6" />, 
                  title: "Ongoing GEO Optimization", 
                  desc: "The world changes. We continuously update your site's metadata to ensure you dominate local search as AI evolves." 
                },
                { 
                  icon: <Bot className="w-6 h-6" />, 
                  title: "Built-in AI Automation", 
                  desc: "Your site comes with 24/7 lead capture and smart CRM syncing ready to go from Day 1." 
                }
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <div className="text-primary">{benefit.icon}</div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black mb-1">{benefit.title}</h4>
                    <p className="text-brand-dark/60 font-medium leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Form Card */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-brand-dark/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-2 bg-primary"></div>
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Request Sent!</h3>
                  <p className="text-lg text-brand-dark/60 font-bold mb-8">
                    Our team is reviewing your {formData.bizName} strategy. We'll be in touch in technical-seconds.
                  </p>
                  <button 
                    onClick={() => navigate('/')}
                    className="text-primary font-black uppercase tracking-widest text-sm hover:underline"
                  >
                    Return Home
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0, x: -20 }}>
                  <div className="mb-10">
                    <h3 className="text-2xl font-black mb-2">Claim Your Smart Site</h3>
                    <p className="text-brand-dark/50 font-bold">Submit this request to have our pros build your site based on this strategy.</p>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/30" />
                        <input 
                          required
                          type="text" 
                          placeholder="Your Full Name"
                          value={leadInfo.name}
                          onChange={e => setLeadInfo({ ...leadInfo, name: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/30" />
                        <input 
                          required
                          type="email" 
                          placeholder="Email Address"
                          value={leadInfo.email}
                          onChange={e => setLeadInfo({ ...leadInfo, email: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/30" />
                        <input 
                          required
                          type="tel" 
                          placeholder="Phone Number"
                          value={leadInfo.phone}
                          onChange={e => setLeadInfo({ ...leadInfo, phone: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary-hover text-brand-dark py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <>Architecting Request... <div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" /></>
                      ) : (
                        <>Build My Professional Site <ArrowRight className="w-6 h-6" /></>
                      )}
                    </button>

                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-black uppercase tracking-widest text-brand-dark/40">Includes Automation + Geo-Ranking</span>
                      </div>
                      <p className="text-xs text-brand-dark/30 font-bold">
                        By submitting, you agree to have an AdHello expert contact you regarding your ${formData.bizName} build. No-obligation consultation included.
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* DIY Last Resort */}
        <section className="text-center pt-20 border-t border-brand-dark/5">
          <div className="max-w-xl mx-auto">
            <h4 className="text-lg font-black text-brand-dark/40 uppercase tracking-widest mb-4">The DIY Route</h4>
            <p className="text-brand-dark/60 font-medium mb-8">
              Want to do it all yourself? You can take your prompt and build it manually. Keep in mind you'll need to handle your own hosting, design updates, and SEO maintenance.
            </p>
            <a 
              href="https://base44.ai?ref=adhello" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-dark/40 hover:text-brand-dark font-black transition-colors"
            >
              Design Myself on Base44 <MousePointerClick className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-brand-dark/5 text-center px-4">
        <p className="text-sm font-bold text-brand-dark/40 uppercase tracking-widest">© 2024 AdHello.ai &bull; Concierge Build Division &bull; Smart Strategy #{(Math.random() * 1000000).toFixed(0)}</p>
      </footer>
    </div>
  );
}
