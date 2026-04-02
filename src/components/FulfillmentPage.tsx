import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
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
  MapPin, 
  Globe, 
  Video, 
  Share2, 
  TrendingUp, 
  BookOpen,
  PieChart,
  Signal,
  Award,
  Bot,
  MessageSquare,
  X,
  Send,
  Info,
  ExternalLink,
  Copy
} from 'lucide-react';
import { Logo } from './Logo';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';

export default function FulfillmentPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State for Blueprint & Status
  const [status, setStatus] = useState<'loading' | 'analyzing' | 'complete' | 'error'>('loading');
  const [progress, setProgress] = useState(0);
  const [blueprint, setBlueprint] = useState<string | null>(null);
  const [bizName, setBizName] = useState('Your Business');
  const [city, setCity] = useState('');
  const [score, setScore] = useState('78');
  const [themes, setThemes] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);

  // Parse Initial Search Params (only for new generations)
  useEffect(() => {
    if (!id) {
      const bizRaw = searchParams.get('biz') || 'Your Business';
      const formattedBiz = bizRaw
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[-_]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      setBizName(formattedBiz);
      setScore(searchParams.get('score') || '78');
      setCity(searchParams.get('city') || '');
      setThemes(searchParams.get('themes')?.split(',') || []);
      setStatus('analyzing');
    } else {
      fetchBlueprint(id);
    }
  }, [id, searchParams]);

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
      
      handleInitialGeneration();
    }
    return () => clearInterval(interval);
  }, [status]);

  const fetchBlueprint = async (blueprintId: string) => {
    try {
      const response = await fetch(`/api/fulfill/${blueprintId}`);
      if (!response.ok) throw new Error('Not found');
      const data = await response.json();
      setBlueprint(data.blueprint);
      setBizName(data.bizName);
      setCity(data.city);
      setScore(data.score.toString());
      setChatMessages(data.messages || []);
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleInitialGeneration = async () => {
    try {
      // 1. Generate via Gemini
      const response = await fetch('/api/fulfill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bizName, city, score: parseInt(score), reviewThemes: themes })
      });

      if (!response.ok) throw new Error('Fulfillment failed');
      const data = await response.json();
      
      // 2. Save to Persistence
      const saveResponse = await fetch('/api/fulfill/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bizName, 
          city, 
          score: parseInt(score), 
          blueprint: data.blueprint 
        })
      });

      const saveData = await saveResponse.json();
      if (saveData.id) {
        // 3. Redirect to Persistent URL
        navigate(`/fulfillment/${saveData.id}`, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !id) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch(`/api/fulfill/${id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          blueprintInfo: { bizName, city, blueprint }
        })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

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
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
                        { 
                          name: 'Phase 1: Foundation', 
                          icon: Layout, 
                          desc: 'High-velocity grid for ' + city, 
                          color: 'bg-blue-50 text-blue-600',
                          img: 'https://lh3.googleusercontent.com/aida/ADBb0uijG3rTrsWfhYDANe2sDIZ7QrdTsJpwoBa0t_VJfHfRZu01qv3wNh-h3ajdrsSAhp0flucJ5u4n_wOtmF3JgTYMMDH6oSaXYd746Cv-yWALpt8eHtm1j8M2hfDZcRr7R0bsXnwhHbNXbjO1d_tGYZXJiChDanbBDJiLzR_CpPdLTosg0_nYgYrWwZJTpba85cqge_DIKTm4IyaL9jkeRazVtcUg8PkSPu6C1pY9XBiJNOqVmHkiOXg58Mo'
                        },
                        { 
                          name: 'Phase 2: Conversion', 
                          icon: Zap, 
                          desc: 'Conversion-first structural engine', 
                          color: 'bg-purple-50 text-purple-600',
                          img: '/assets/designs/split-hero.png'
                        },
                        { 
                          name: 'Phase 3: Elite Authority', 
                          icon: ShieldCheck, 
                          desc: 'Premium B2B architectural status', 
                          color: 'bg-zinc-900 text-zinc-100',
                          img: '/assets/designs/dark-elite.png'
                        }
                      ].map((style, i) => (
                        <div key={i} className={`p-6 rounded-3xl border border-brand-dark/5 shadow-sm transition-all hover:shadow-xl group overflow-hidden ${style.color}`}>
                          <div className="h-32 mb-4 rounded-2xl bg-white/50 overflow-hidden relative border border-current/5 shadow-inner">
                            <img src={style.img} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" alt={style.name} />
                          </div>
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

                  <div className="pdf-page-break html2pdf__page-break" />

                  {/* DIGITAL AUTHORITY ROADMAP VISUALS */}
                  <div className="border-t border-brand-dark/5 pt-20 mt-20">
                    <div className="flex items-center gap-4 mb-12">
                      <div className="p-3 bg-brand-dark text-white rounded-2xl shadow-xl">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black tracking-tight">The Digital Authority Roadmap</h3>
                        <p className="text-sm font-bold text-brand-dark/40 uppercase tracking-widest">A Modern B2B Growth Strategy</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                      {/* Graphics: The Brand Signal Hub */}
                      <div className="bg-brand-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-700" />
                        <h4 className="text-xl font-black mb-8 relative z-10 flex items-center gap-3">
                          <PieChart className="w-5 h-5 text-primary" />
                          Authority Core: Hub & Spoke
                        </h4>
                        
                        <div className="relative h-64 flex items-center justify-center">
                          {/* The Hub */}
                          <motion.div 
                            animate={{ scale: [1, 1.05, 1] }} 
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center relative z-20 shadow-2xl"
                          >
                            <Globe className="w-10 h-10 text-primary" />
                            <div className="absolute -bottom-6 text-[10px] uppercase font-black tracking-tighter whitespace-nowrap">Your Website</div>
                          </motion.div>

                          {/* The Spokes (Signals) */}
                          {[
                            { icon: Video, label: 'YouTube', angle: -45, offset: 80 },
                            { icon: Share2, label: 'Socials', angle: 45, offset: 80 },
                            { icon: BookOpen, label: 'Articles', angle: 135, offset: 80 },
                            { icon: MapPin, label: 'GEO/GBP', angle: 225, offset: 80 }
                          ].map((spoke, i) => (
                            <div key={i} className="absolute inset-0 flex items-center justify-center">
                              <div 
                                className="w-px h-20 bg-white/20 origin-bottom"
                                style={{ transform: `rotate(${spoke.angle}deg) translateY(-40px)` }}
                              />
                              <div 
                                className="absolute bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md shadow-xl flex flex-col items-center gap-1 transition-transform hover:scale-110 cursor-pointer"
                                style={{ transform: `rotate(${spoke.angle}deg) translate(0, -${spoke.offset}px) rotate(-${spoke.angle}deg)` }}
                              >
                                <spoke.icon className="w-4 h-4 text-white" />
                                <span className="text-[8px] uppercase font-black tracking-tighter">{spoke.label}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-12 text-sm font-bold text-white/60 leading-relaxed relative z-10">
                          Modern search engines no longer just look at backlinks. They look for total **Brand Signals**. Our architectural approach turns your site into a high-authority "Hub" powered by specific "Spoke" assets across the web.
                        </div>
                      </div>

                      {/* Tactical Pillars */}
                      <div className="space-y-8">
                        {[
                          { title: 'GEO-Signal Matrix', desc: 'Dominating Search Precision.', icon: MapPin, color: 'text-blue-500' },
                          { title: 'Omni-Channel Signals', desc: 'YouTube & Social Authority.', icon: Signal, color: 'text-purple-500' },
                          { title: 'Freshness Protocol', desc: 'Real-time Authority Tracking.', icon: Zap, color: 'text-orange-500' }
                        ].map((pillar, i) => (
                          <div key={i} className="flex gap-6 p-6 rounded-3xl bg-brand-dark/5 border border-brand-dark/5 hover:border-brand-dark/10 transition-all group">
                            <div className={`p-4 rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform ${pillar.color}`}>
                              <pillar.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="text-xl font-black mb-1">{pillar.title}</h4>
                              <p className="text-sm font-bold text-brand-dark/40">{pillar.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pdf-page-break html2pdf__page-break" />

                  {/* Implementation Protocol Guide */}
                  <div className="mt-20 pt-20 border-t border-brand-dark/5">
                    <div className="flex items-center gap-4 mb-12">
                      <div className="p-3 bg-primary text-brand-dark rounded-2xl shadow-xl">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black tracking-tight">Technical Implementation Protocol</h3>
                        <p className="text-sm font-bold text-brand-dark/40 uppercase tracking-widest">A Step-by-Step Execution Guide</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      {[
                        { 
                          phase: 'Phase 1: Launch', 
                          title: 'Connecting the Foundation', 
                          steps: [
                            'Purchase your domain on Base44',
                            'Inject the "Modern Bento" vibe prompt into the AI Site Builder',
                            'Connect Google Business Profile for local GEO-signal syncing'
                          ],
                          icon: Globe
                        },
                        { 
                          phase: 'Phase 2: Scale', 
                          title: 'Activating the Conversion Engine', 
                          steps: [
                            'Set up CRM automated follow-ups',
                            'Activate the AI Receptionist for 24/7 lead capture',
                            'Launch local search ad campaign using provided briefs'
                          ],
                          icon: Zap
                        },
                        { 
                          phase: 'Phase 3: Dominate', 
                          title: 'Achieving Elite Authority', 
                          steps: [
                            'Publish weekly Authority Articles to the Brand Hub',
                            'Record and upload monthly service showcase videos to YouTube',
                            'Monitor rank improvements in the AdHello Growth Dashboard'
                          ],
                          icon: ShieldCheck
                        }
                      ].map((prot, idx) => (
                        <div key={idx} className="bg-warm-cream p-10 rounded-[3.5rem] border border-brand-dark/5 shadow-sm group hover:shadow-xl transition-all">
                          <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-primary shrink-0">
                              <prot.icon className="w-8 h-8" />
                            </div>
                            <div>
                              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 block">{prot.phase}</span>
                              <h4 className="text-2xl font-black mb-6">{prot.title}</h4>
                              <ul className="space-y-4">
                                {prot.steps.map((s, si) => (
                                  <li key={si} className="flex gap-4 font-bold text-brand-dark/70">
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] text-brand-dark shadow-sm shrink-0 mt-1">{si+1}</div>
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pdf-page-break html2pdf__page-break" />

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

              {/* AI Architect Chat Widget */}
              <div className="fixed bottom-6 right-6 z-[100]">
                <AnimatePresence>
                  {isChatOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 100, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 100, scale: 0.9 }}
                      className="absolute bottom-20 right-0 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[70vh] bg-white rounded-[2.5rem] shadow-2xl border border-brand-dark/10 flex flex-col overflow-hidden"
                    >
                      {/* Chat Header */}
                      <div className="bg-brand-dark p-6 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary rounded-xl text-brand-dark">
                            <Bot className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm uppercase tracking-widest">Architect Coach</h4>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-[10px] font-black text-white/50 tracking-tighter">THE ARCHITECT IS ONLINE</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Chat Body */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {chatMessages.length === 0 && (
                          <div className="text-center py-10">
                            <Bot className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                            <p className="text-sm font-bold text-brand-dark/40">I'm "The Architect". How can I help you grow your business today?</p>
                          </div>
                        )}
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed font-medium ${
                              msg.role === 'user' 
                                ? 'bg-primary text-brand-dark rounded-br-none' 
                                : 'bg-brand-dark/5 text-brand-dark rounded-bl-none prose-chat'
                            }`}>
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-brand-dark/5 p-4 rounded-2xl rounded-bl-none flex gap-1">
                              <span className="w-1.5 h-1.5 bg-brand-dark/20 rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-1.5 h-1.5 bg-brand-dark/20 rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-1.5 h-1.5 bg-brand-dark/20 rounded-full animate-bounce" />
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Chat Input */}
                      <form onSubmit={handleSendMessage} className="p-6 border-t border-brand-dark/5 bg-warm-cream">
                        <div className="relative">
                          <input 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask about your strategy..."
                            className="w-full bg-white border border-brand-dark/10 p-4 rounded-2xl pr-12 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                          />
                          <button 
                            type="submit"
                            disabled={!chatInput.trim()}
                            className="absolute right-2 top-2 p-2 bg-brand-dark text-white rounded-xl disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="bg-brand-dark text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="relative flex items-center gap-3 font-black uppercase text-xs tracking-widest">
                    <MessageSquare className="w-6 h-6 group-hover:text-brand-dark transition-colors" />
                    <span className="group-hover:text-brand-dark transition-colors">Architect Assistant</span>
                  </div>
                </motion.button>
              </div>

              {/* Share Link Toast/Toolbar */}
              <div className="fixed bottom-6 left-6 z-[100] hidden md:block">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Share link copied! You can use this to return to your blueprint later.");
                  }}
                  className="bg-white/80 backdrop-blur-xl border border-brand-dark/5 p-4 rounded-2xl shadow-xl flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
                >
                  <Copy className="w-4 h-4" />
                  Save & Copy Share Link
                </button>
              </div>
            </motion.div>
          )}

          {status === 'loading' && (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="font-bold text-brand-dark/40">Retrieving Secure Architecture...</p>
            </div>
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
