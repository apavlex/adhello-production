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
  Copy,
  Clipboard,
  ChevronDown
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
  const [phaseHtml, setPhaseHtml] = useState<string[]>([]);
  const [bizName, setBizName] = useState('Your Business');
  const [city, setCity] = useState('');
  const [score, setScore] = useState('78');
  const [themes, setThemes] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);
  
  // Audit Report (from sessionStorage)
  const [auditReport, setAuditReport] = useState<any>(null);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);
  const [chatInitialized, setChatInitialized] = useState(false);

  // Load audit report from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('adhello_audit_report');
      if (stored) setAuditReport(JSON.parse(stored));
    } catch {}
  }, []);

  // Parse Initial Search Params (only for new generations)
  useEffect(() => {
    if (!id) {
      const bizRaw = searchParams.get('biz') || 'Your Business';
      const formattedBiz = bizRaw
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/(Presso)(Coffee)/gi, '$1 $2')
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

  // Inject audit-aware intro message when status becomes complete
  useEffect(() => {
    if (status === 'complete' && !chatInitialized) {
      setChatInitialized(true);

      // Build a personalized intro from the actual audit report
      const currentScore = auditReport?.score || parseInt(score) || 78;
      const failingChecks = auditReport?.technicalAudit
        ? Object.values(auditReport.technicalAudit)
            .filter((item: any) => item.status === 'fail')
            .map((item: any) => `❌ ${item.label}${item.reason ? ` — ${item.reason}` : ''}`)
        : [];
      const warningChecks = auditReport?.technicalAudit
        ? Object.values(auditReport.technicalAudit)
            .filter((item: any) => item.status === 'warning')
            .map((item: any) => `⚠️ ${item.label}${item.reason ? ` — ${item.reason}` : ''}`)
        : [];
      const topWeakness = auditReport?.weaknesses?.[0]?.description || '';
      const scoreEmoji = currentScore >= 85 ? '🟢' : currentScore >= 65 ? '🟡' : '🔴';
      const scoreLabel = currentScore >= 85 ? 'strong' : currentScore >= 65 ? 'moderate' : 'critical';

      let intro = `👋 I've finished reading your **${bizName}** audit report — and I have some important findings to share.\n\n`;
      intro += `${scoreEmoji} **Your AEO Score: ${currentScore}/100** — This is a ${scoreLabel} score for local AI search visibility.\n\n`;

      if (failingChecks.length > 0) {
        intro += `**Critical Issues Found (Failing):**\n${failingChecks.join('\n')}\n\n`;
      }
      if (warningChecks.length > 0) {
        intro += `**Warnings to Address:**\n${warningChecks.join('\n')}\n\n`;
      }
      if (topWeakness) {
        intro += `**Top Priority:** ${topWeakness}\n\n`;
      }

      intro += `I'll coach you through fixing each of these to dominate the "${city || 'local'}" search results. **Which issue would you like to tackle first?**`;

      setChatMessages([{ role: 'assistant', content: intro }]);
    }
  }, [status, chatInitialized, bizName, city, score, auditReport]);

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
      if (data.phaseHtml) setPhaseHtml(data.phaseHtml);
      setBizName(data.bizName);
      setCity(data.city);
      setScore(data.score.toString());
      const msgs = data.messages || [];
      setChatMessages(msgs);
      if (msgs.length > 0) setChatInitialized(true);
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleInitialGeneration = async () => {
    try {
      const response = await fetch('/api/fulfill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bizName, city, score: parseInt(score), reviewThemes: themes, brandColors: auditReport?.brandColors || null })
      });

      if (!response.ok) throw new Error('Fulfillment failed');
      const data = await response.json();
      if (data.phaseHtml) setPhaseHtml(data.phaseHtml);
      
      const saveResponse = await fetch('/api/fulfill/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bizName, 
          city, 
          score: parseInt(score), 
          blueprint: data.blueprint,
          phaseHtml: data.phaseHtml || null,
          auditData: auditReport || null
        })
      });

      const saveData = await saveResponse.json();
      if (saveData.id) {
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
          blueprintInfo: { bizName, city, blueprint, score },
          auditReport: auditReport || null
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
      console.log("[PDF] Starting generation...");
      const element = blueprintRef.current;
      
      // html2pdf options refined for better rendering of complex layouts/iframes
      const opt = {
        margin: [10, 10] as [number, number],
        filename: `Strategic-Blueprint-${bizName.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          allowTaint: true,
          windowWidth: 1400 // Fixed width for consistent PDF layout
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Use the promise-based API for better error handling
      await html2pdf().set(opt).from(element).save();
      console.log("[PDF] Generation successful");
    } catch (err) {
      console.error("[PDF] Error:", err);
      // More helpful error with fallback suggestion
      const confirmPrint = window.confirm("PDF generation encountered a technical limitation with the interactive previews. Would you like to use the system print dialog instead? It often works better for high-fidelity designs.");
      if (confirmPrint) {
        window.print();
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Share link copied! You can use this to return to your blueprint at any time.");
  };

  const copyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(idx);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const steps = [
    { label: 'Verifying Transaction & Audit Data', threshold: 25 },
    { label: 'Initializing B2B Web Architect Engine', threshold: 50 },
    { label: 'Architecting Design & Copy Assets', threshold: 75 },
    { label: 'Finalizing Local SEO Implementation', threshold: 99 },
  ];

  const phaseCards = [
    { 
      name: 'Phase 1: Foundation', 
      icon: Layout, 
      desc: 'High-velocity modern grid layout optimized for local lead capture and Google AI visibility.',
      color: 'bg-blue-50 text-blue-600',
      img: 'https://lh3.googleusercontent.com/aida/ADBb0uijG3rTrsWfhYDANe2sDIZ7QrdTsJpwoBa0t_VJfHfRZu01qv3wNh-h3ajdrsSAhp0flucJ5u4n_wOtmF3JgTYMMDH6oSaXYd746Cv-yWALpt8eHtm1j8M2hfDZcRr7R0bsXnwhHbNXbjO1d_tGYZXJiChDanbBDJiLzR_CpPdLTosg0_nYgYrWwZJTpba85cqge_DIKTm4IyaL9jkeRazVtcUg8PkSPu6C1pY9XBiJNOqVmHkiOXg58Mo',
      base44Prompt: `Build a modern bento-grid homepage for ${bizName} in ${city || 'my city'}. Warm cream background (#F5F0E8), dark navy headings. Features: bold hero with a "Get Free Quote" CTA, a 3-column service grid with icons, Google review stars widget, and a contact form. Mobile-first. Clean, premium feel. Add local schema markup for GEO signals.`
    },
    { 
      name: 'Phase 2: Conversion', 
      icon: Zap, 
      desc: 'Conversion-first structural engine with AI booking widget and trust-signal framework.',
      color: 'bg-purple-50 text-purple-600',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
      base44Prompt: `Enhance the ${bizName} website with a high-conversion layout. Add: a sticky "Book Now" button in the header, an AI chat widget in the bottom-right corner, a before/after testimonial section with photo reviews, a FAQ accordion with local keywords (e.g. "best [service] in ${city || 'your city'}"), and a urgency banner "Only 3 slots left this week". Make the CTA buttons use the brand's primary gold/amber accent color.`
    },
    { 
      name: 'Phase 3: Elite Authority', 
      icon: ShieldCheck, 
      desc: 'Premium B2B authority architecture with omni-channel brand signals and GEO dominance.',
      color: 'bg-zinc-900 text-zinc-100',
      img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80',
      base44Prompt: `Build an elite authority hub page for ${bizName}. Dark (#0D0D0D) background, gold accent. Include: a "Press & Media" section with logos, a case study carousel with measurable results (e.g. "+40% leads in 30 days"), an embedded YouTube Brand Video section, a "GEO Dominance" map widget showing service areas around ${city || 'your city'}, and a professional team bio grid. This is the B2B trust-builder that positions us as the #1 local authority.`
    }
  ];

  const protocolSteps = [
    { 
      phase: 'Phase 1: Launch', 
      title: 'Connecting the Foundation',
      description: `This first phase is about establishing your digital presence on a rock-solid, GEO-optimized foundation. Most local businesses have websites built on outdated templates that Google's AI cannot understand. We fix this by building a modern, structured web experience that clearly communicates WHO you are, WHERE you serve, and WHAT problems you solve — in the exact language that both humans and search AI respond to.`,
      steps: [
        { action: 'Purchase your domain on Base44', detail: 'Choose a domain that includes your primary service keyword if possible (e.g. "seattlecoffeeco.com"). This alone is a powerful GEO signal.' },
        { action: 'Inject the "Modern Bento" vibe prompt into the AI Site Builder', detail: 'Use the Phase 1 Base44 prompt from your blueprint cards above. This generates your exact branded layout in minutes — no designer needed.' },
        { action: 'Connect Google Business Profile for local GEO-signal syncing', detail: 'Link your GBP to your website. Consistent NAP (Name, Address, Phone) data across both is one of the highest-impact local SEO actions you can take.' },
        { action: 'Install Google Analytics 4 + Search Console', detail: 'Track which "near me" searches are already finding you and identify your biggest keyword opportunities in the first 30 days.' }
      ],
      icon: Globe
    },
    { 
      phase: 'Phase 2: Scale', 
      title: 'Activating the Conversion Engine',
      description: `Traffic without conversion is just vanity metrics. Phase 2 transforms your new website from a digital brochure into a 24/7 lead-generation machine. We layer in automated follow-up sequences, AI-powered booking tools, and trackable ad campaigns — turning every visitor into a potential revenue event. Most businesses see a 30–60% increase in booked appointments within 90 days of implementing this phase.`,
      steps: [
        { action: 'Set up CRM automated follow-ups', detail: 'When a visitor fills out a form, they receive an immediate confirmation email + a follow-up text 24 hours later. Most competitors never follow up — this alone puts you in the top 10%.' },
        { action: 'Activate the AI Receptionist for 24/7 lead capture', detail: 'The AI chat widget on your site handles after-hours inquiries, books appointments, and qualifies leads — so you never miss a customer again, even while sleeping.' },
        { action: 'Launch local search ad campaign using provided briefs', detail: 'Use the AdHello ad briefs from your blueprint to run hyper-targeted Google Ads for your service area. Budget: start at $15/day and scale based on conversion data.' },
        { action: 'Activate the Review Generation System', detail: 'After every job, send an automated SMS asking for a Google review. 4.8+ star ratings are the #1 trust signal for new customers finding you via AI search.' }
      ],
      icon: Zap
    },
    { 
      phase: 'Phase 3: Dominate', 
      title: 'Achieving Elite Authority',
      description: `Phase 3 is where you separate from every competitor in your market. Modern AI search engines (Google AI Overviews, Bing Copilot, ChatGPT) don't just index your website — they look for a complete "brand signal ecosystem." Businesses with a YouTube channel, active social presence, consistent blog content, and strong GBP reviews are the ones that get featured in AI-generated answers. This phase makes you the undeniable #1 authority in your local market.`,
      steps: [
        { action: 'Publish weekly Authority Articles to the Brand Hub', detail: 'Write a 500-word blog post answering a common customer question (e.g. "How much does [service] cost in [city]?"). These articles are directly picked up by Google AI Overviews and position you as the expert.' },
        { action: 'Record and upload monthly service showcase videos to YouTube', detail: 'A 2–3 minute walkthrough of a recent job is all you need. YouTube is owned by Google — having an active channel dramatically boosts your local search authority.' },
        { action: 'Monitor rank improvements in the AdHello Growth Dashboard', detail: 'Track your position for target keywords monthly. Celebrate wins and identify new keyword opportunities as your authority grows.' },
        { action: 'Expand GEO targeting to neighboring cities', detail: 'Once you dominate your primary city, create dedicated service-area landing pages for neighboring towns (e.g. "Coffee Catering in Bellevue"). Each page is a new revenue channel.' }
      ],
      icon: ShieldCheck
    }
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
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleCopyLink}
                    className="bg-white border border-brand-dark/10 text-brand-dark px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-brand-dark/5 transition-all shadow-md h-fit"
                  >
                    <Share2 className="w-5 h-5" />
                    Save Share Link
                  </button>
                  <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50 h-fit"
                  >
                    {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    Download Blueprint PDF
                  </button>
                </div>
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

                  {/* ===== PHASE CARDS — LARGE IFRAME-STYLE PREVIEWS ===== */}
                  <div className="grid grid-cols-1 gap-10 mb-16">
                    {phaseCards.map((style, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-[2.5rem] border border-brand-dark/8 shadow-xl overflow-hidden bg-white"
                      >
                        {/* Live personalized iframe preview */}
                        <div className="relative w-full" style={{ height: '460px' }}>
                          {/* Browser chrome bar */}
                          <div className="absolute top-0 left-0 right-0 z-10 bg-zinc-100 border-b border-zinc-200 px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-400" />
                              <div className="w-3 h-3 rounded-full bg-yellow-400" />
                              <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 bg-white rounded-md px-3 py-1 text-[11px] text-zinc-400 font-mono ml-2 border border-zinc-200">
                              {bizName.toLowerCase().replace(/\s/g, '')}.com — {style.name}
                            </div>
                          </div>
                          {/* Iframe with live client-personalized HTML */}
                          <iframe
                            srcDoc={phaseHtml[i] || undefined}
                            sandbox="allow-same-origin"
                            className="absolute top-10 left-0 right-0 bottom-0 w-full border-0"
                            style={{ height: 'calc(100% - 40px)' }}
                            scrolling="yes"
                            title={`${style.name} Preview`}
                          />
                          {/* Phase badge */}
                          <div className={`absolute top-14 right-4 z-20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                            i === 2 ? 'bg-zinc-900 text-zinc-100' : i === 1 ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                          }`}>
                            {style.name}
                          </div>
                        </div>

                        {/* Card info */}
                        <div className={`p-8 ${i === 2 ? 'bg-zinc-900 text-zinc-100' : i === 1 ? 'bg-purple-50' : 'bg-blue-50'}`}>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-xl ${i === 2 ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                                <style.icon className={`w-6 h-6 ${i === 2 ? 'text-primary' : i === 1 ? 'text-purple-600' : 'text-blue-600'}`} />
                              </div>
                              <div>
                                <h4 className="text-lg font-black">{style.name}</h4>
                                <p className={`text-sm font-medium ${i === 2 ? 'text-zinc-400' : 'opacity-60'}`}>{style.desc}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] uppercase font-black tracking-widest shrink-0 ${i === 2 ? 'text-green-400' : 'text-green-600'}`}>Architected ✓</span>
                          </div>

                          {/* Base44 Prompt */}
                          <div className={`rounded-2xl p-5 mt-4 border ${i === 2 ? 'bg-white/5 border-white/10' : 'bg-white/70 border-brand-dark/8'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Zap className={`w-4 h-4 ${i === 2 ? 'text-primary' : i === 1 ? 'text-purple-600' : 'text-blue-600'}`} />
                                <span className={`text-[11px] font-black uppercase tracking-widest ${i === 2 ? 'text-zinc-400' : 'text-brand-dark/50'}`}>
                                  Base44 Vibe Prompt — Copy & Paste
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => copyPrompt(style.base44Prompt, i)}
                                  className={`flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-lg transition-all ${
                                    copiedPrompt === i 
                                      ? 'bg-green-500 text-white' 
                                      : i === 2 ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-brand-dark text-white hover:bg-black'
                                  }`}
                                >
                                  {copiedPrompt === i ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  {copiedPrompt === i ? 'Copied!' : 'Copy'}
                                </button>
                                <a
                                  href="https://base44.pxf.io/c/6926562/2049275/25619?trafcat=base"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-lg transition-all ${
                                    i === 2 ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'bg-primary text-brand-dark hover:bg-primary-hover'
                                  }`}
                                >
                                  <Zap className="w-3 h-3 fill-current" />
                                  Open Base44
                                </a>
                              </div>
                            </div>
                            <p className={`text-xs font-mono leading-relaxed ${i === 2 ? 'text-zinc-300' : 'text-brand-dark/70'}`}>
                              {style.base44Prompt}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="max-w-none mb-20 [&_h1]:text-4xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:mb-6 [&_h1]:mt-0 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-brand-dark [&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:mb-3 [&_h3]:mt-6 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-brand-dark/75 [&_p]:mb-4 [&_p]:font-medium [&_li]:text-base [&_li]:leading-relaxed [&_li]:text-brand-dark/75 [&_li]:mb-2 [&_li]:font-medium [&_ul]:mb-5 [&_ul]:pl-6 [&_ul]:list-disc [&_strong]:text-brand-dark [&_strong]:font-black [&_hr]:my-10 [&_hr]:border-brand-dark/10">
                    <ReactMarkdown>{blueprint || ''}</ReactMarkdown>
                  </div>

                  <div className="pdf-page-break html2pdf__page-break" />

                  {/* DIGITAL AUTHORITY ROADMAP */}
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
                      {/* Hub & Spoke Visual */}
                      <div className="bg-brand-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-700" />
                        <h4 className="text-xl font-black mb-8 relative z-10 flex items-center gap-3">
                          <PieChart className="w-5 h-5 text-primary" />
                          Authority Core: Hub & Spoke
                        </h4>
                        
                        <div className="relative h-64 flex items-center justify-center">
                          <motion.div 
                            animate={{ scale: [1, 1.05, 1] }} 
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center relative z-20 shadow-2xl"
                          >
                            <Globe className="w-10 h-10 text-primary" />
                            <div className="absolute -bottom-6 text-[10px] uppercase font-black tracking-tighter whitespace-nowrap">Your Website</div>
                          </motion.div>

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
                          { title: 'GEO-Signal Matrix', desc: 'Dominating Search Precision.', detail: 'Your Google Business Profile, NAP consistency, and geo-tagged content create a geographic authority signal that AI search engines use to decide who ranks #1 for local queries.', icon: MapPin, color: 'text-blue-500' },
                          { title: 'Omni-Channel Signals', desc: 'YouTube & Social Authority.', detail: 'Every YouTube video, Instagram post, and LinkedIn article links back to your website hub. Each one is a signal that tells Google: "This is a real, active, trusted business."', icon: Signal, color: 'text-purple-500' },
                          { title: 'Freshness Protocol', desc: 'Real-time Authority Tracking.', detail: 'Weekly blog posts and monthly video uploads keep your site "fresh" in Google\'s eyes. Fresh sites rank faster and hold their positions longer than static brochure websites.', icon: Zap, color: 'text-orange-500' }
                        ].map((pillar, i) => (
                          <div key={i} className="flex gap-6 p-6 rounded-3xl bg-brand-dark/5 border border-brand-dark/5 hover:border-brand-dark/10 transition-all group">
                            <div className={`p-4 rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform ${pillar.color} shrink-0`}>
                              <pillar.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="text-xl font-black mb-1">{pillar.title}</h4>
                              <p className="text-sm font-bold text-brand-dark/50 mb-2">{pillar.desc}</p>
                              <p className="text-sm text-brand-dark/60 leading-relaxed">{pillar.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pdf-page-break html2pdf__page-break" />

                  {/* ===== IMPLEMENTATION PROTOCOL — DETAILED ===== */}
                  <div className="mt-20 pt-20 border-t border-brand-dark/5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary text-brand-dark rounded-2xl shadow-xl">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black tracking-tight">Technical Implementation Protocol</h3>
                        <p className="text-sm font-bold text-brand-dark/40 uppercase tracking-widest">A Step-by-Step Execution Guide</p>
                      </div>
                    </div>
                    <p className="text-brand-dark/60 font-medium text-base mb-12 max-w-3xl leading-relaxed">
                      This protocol is your operational playbook — a clear, sequenced action plan to transform your online presence from invisible to undeniable. Each phase builds on the last. Follow the steps in order and you will have a fully dominant digital presence within 90 days.
                    </p>

                    <div className="grid grid-cols-1 gap-10">
                      {protocolSteps.map((prot, idx) => (
                        <div key={idx} className="bg-warm-cream rounded-[3.5rem] border border-brand-dark/5 shadow-sm group hover:shadow-xl transition-all overflow-hidden">
                          <div className="p-10">
                            <div className="flex flex-col md:flex-row gap-6 mb-8">
                              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-primary shrink-0">
                                <prot.icon className="w-8 h-8" />
                              </div>
                              <div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 block">{prot.phase}</span>
                                <h4 className="text-2xl font-black mb-3">{prot.title}</h4>
                                <p className="text-brand-dark/60 font-medium leading-relaxed text-sm">{prot.description}</p>
                              </div>
                            </div>

                            <div className="border-t border-brand-dark/5 pt-8 space-y-5">
                              {prot.steps.map((s, si) => (
                                <div key={si} className="flex gap-4 group/step">
                                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[11px] font-black text-brand-dark shadow-sm shrink-0 mt-0.5 group-hover/step:bg-primary group-hover/step:text-white transition-colors">
                                    {si + 1}
                                  </div>
                                  <div>
                                    <p className="font-black text-brand-dark text-base mb-1.5">{s.action}</p>
                                    <p className="text-brand-dark/60 text-base leading-relaxed font-medium">{s.detail}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pdf-page-break html2pdf__page-break" />

                  {/* CTA Block — Base44 Pitch */}
                  <div className="mt-20 pt-12 border-t border-brand-dark/5">
                    <div className="bg-brand-dark rounded-[2.5rem] text-white overflow-hidden">
                      {/* Header */}
                      <div className="p-10 pb-0 text-center">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          Next Step: Activation
                        </div>
                        <h3 className="text-3xl font-black mb-4 tracking-tight">Why Base44 Is the<br /><span className="text-primary">Smartest Move</span> for Your Business</h3>
                        <p className="text-white/60 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                          Your blueprint is architected. Now you need to <em>build it</em> — and Base44 is the only platform designed from the ground up to make that effortless for non-technical business owners.
                        </p>
                      </div>

                      {/* Feature Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-white/10 mt-10">
                        {[
                          {
                            icon: '⚡',
                            title: 'AI Site Builder in Minutes',
                            desc: `No designers. No developers. No waiting weeks. Paste your custom Vibe Prompt above directly into Base44's AI builder and watch it generate a complete, branded, GEO-optimized website for ${bizName} in under 5 minutes — with all the conversion architecture already baked in.`
                          },
                          {
                            icon: '🤖',
                            title: 'Superagents Do the Work For You',
                            desc: `Base44's built-in AI Superagents can be configured to automatically handle your entire implementation: writing GEO-optimized blog posts weekly, updating your Google Business Profile, generating review request messages, and even managing customer follow-up sequences — all on autopilot while you run your business.`
                          },
                          {
                            icon: '💰',
                            title: 'Fraction of the Cost',
                            desc: `A traditional web agency charges $5,000–$15,000 for a website that takes 3–6 months to deliver. Base44 gives small businesses the same quality output — fully customized, conversion-optimized, and GEO-ready — for a fraction of the price, with no ongoing developer dependency.`
                          },
                          {
                            icon: '🗺️',
                            title: 'Built for Local GEO Domination',
                            desc: `Base44 natively supports local schema markup, Google Business Profile integration, and geo-targeted landing pages — the exact technical signals that Google's AI uses to rank local businesses. It's the only builder engineered for the "near me" search era.`
                          },
                          {
                            icon: '📈',
                            title: 'Scale Without an IT Team',
                            desc: `As ${bizName} grows, Base44 scales with you. Add new service pages, launch seasonal campaigns, A/B test your CTAs, and expand to new neighborhoods — all from a single dashboard, without needing to hire anyone or touch a line of code.`
                          },
                          {
                            icon: '🔗',
                            title: 'Your Blueprint Connects Directly',
                            desc: `Every Vibe Prompt in your blueprint above was written specifically for Base44's AI engine. Copy → Paste → Launch. It's the fastest path from "I have a plan" to "I have a live, revenue-generating website" that exists for a local business today.`
                          }
                        ].map((feat, fi) => (
                          <div key={fi} className={`p-8 border-white/10 ${
                            fi % 2 === 0 ? 'border-r' : ''
                          } ${
                            fi < 4 ? 'border-b' : ''
                          }`}>
                            <div className="text-3xl mb-4">{feat.icon}</div>
                            <h4 className="text-lg font-black mb-3 text-white">{feat.title}</h4>
                            <p className="text-white/55 text-sm leading-relaxed font-medium">{feat.desc}</p>
                          </div>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="p-10 text-center border-t border-white/10">
                        <p className="text-white/50 text-sm font-bold uppercase tracking-widest mb-6">Ready to launch {bizName}? Start here:</p>
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
                </div>
              </div>

              {/* ===== GEO RANKING COACH CHAT WIDGET ===== */}
              <div className="fixed bottom-6 right-6 z-[100]">
                <AnimatePresence>
                  {isChatOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 100, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 100, scale: 0.9 }}
                      className="absolute bottom-20 right-0 w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[75vh] bg-white rounded-[2.5rem] shadow-2xl border border-brand-dark/10 flex flex-col overflow-hidden"
                    >
                      {/* Chat Header */}
                      <div className="bg-brand-dark p-6 text-white flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-primary rounded-xl text-brand-dark">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm uppercase tracking-widest">GEO Ranking Coach</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-[10px] font-black text-white/50 tracking-tighter">ONLINE · {bizName.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Chat Body */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role !== 'user' && (
                              <div className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center shrink-0 mr-2 mt-1">
                                <MapPin className="w-3.5 h-3.5 text-brand-dark" />
                              </div>
                            )}
                            <div className={`max-w-[82%] p-4 rounded-2xl text-[13.5px] leading-relaxed font-medium ${
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
                            <div className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center shrink-0 mr-2">
                              <MapPin className="w-3.5 h-3.5 text-brand-dark" />
                            </div>
                            <div className="bg-brand-dark/5 p-4 rounded-2xl rounded-bl-none flex gap-1 items-center">
                              <span className="w-2 h-2 bg-brand-dark/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-2 h-2 bg-brand-dark/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-2 h-2 bg-brand-dark/30 rounded-full animate-bounce" />
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Quick Prompt Chips */}
                      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
                        {['How do I rank #1 locally?', 'Best Base44 prompt for me?', 'How to get more reviews?'].map((chip) => (
                          <button
                            key={chip}
                            onClick={() => { setChatInput(chip); }}
                            className="shrink-0 text-[11px] font-bold bg-brand-dark/5 hover:bg-primary hover:text-brand-dark transition-all px-3 py-1.5 rounded-full whitespace-nowrap"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <form onSubmit={handleSendMessage} className="p-4 border-t border-brand-dark/5 bg-warm-cream shrink-0">
                        <div className="relative">
                          <input 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask your GEO Ranking Coach..."
                            className="w-full bg-white border border-brand-dark/10 p-4 rounded-2xl pr-14 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner text-sm font-medium"
                          />
                          <button 
                            type="submit"
                            disabled={!chatInput.trim()}
                            className="absolute right-2 top-2 p-2.5 bg-brand-dark text-white rounded-xl disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </form>

                      {/* Support Footer */}
                      <div className="shrink-0 px-4 pb-4 pt-2 border-t border-brand-dark/5 bg-gradient-to-b from-warm-cream to-white">
                        <p className="text-[10px] text-brand-dark/40 font-bold uppercase tracking-widest text-center mb-2.5">Need hands-on help?</p>
                        <div className="flex gap-2">
                          <a
                            href={`mailto:hello@adhello.ai?subject=Help Implementing Blueprint for ${encodeURIComponent(bizName)}&body=Hi AdHello team,%0A%0AI'd like help implementing my Digital Blueprint for ${encodeURIComponent(bizName)} in ${encodeURIComponent(city || 'my area')}.%0A%0AMy blueprint link: ${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}%0A%0APlease reach out to discuss implementation options.%0A%0AThanks!`}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-brand-dark text-white text-[11px] font-black py-2.5 px-3 rounded-xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            Email for Help
                          </a>
                          <a
                            href="https://cal.adhello.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-brand-dark text-[11px] font-black py-2.5 px-3 rounded-xl hover:bg-primary-hover transition-all hover:scale-[1.02] active:scale-95"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                            Book a Call
                          </a>
                        </div>
                      </div>
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
                    <MapPin className="w-6 h-6 group-hover:text-brand-dark transition-colors" />
                    <span className="group-hover:text-brand-dark transition-colors">GEO Ranking Coach</span>
                  </div>
                </motion.button>
              </div>

              {/* Share Link */}
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
        <p className="text-sm font-bold text-brand-dark/40 uppercase tracking-widest">© 2024 AdHello.ai • Fulfillment Division • Secure AI Operations</p>
      </footer>
    </div>
  );
}
