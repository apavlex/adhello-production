import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  HeartHandshake,
  Laptop,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MousePointerClick,
  Phone,
  Search,
  Smile,
  Smartphone,
  TrendingUp,
  Unlock,
  Users,
  X,
  Zap,
  BarChart3,
  Wrench,
  Stethoscope,
  Layout,
  Hammer,
  ThermometerSnowflake,
  Home,
  Star,
  Droplets,
  Sparkles,
  Paintbrush,
  Truck
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SiteAudit } from './components/SiteAudit';
import { AdBrief } from './components/AdBrief';
import { ROICalculator } from './components/ROICalculator';
import { SalesChatbot } from './components/SalesChatbot';
import { Link } from 'react-router-dom';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { AssessmentCTA } from './components/AssessmentCTA';
import { Logo } from './components/Logo';
import SEO from './components/SEO';
import { EventBanner } from './components/EventBanner';
import { SmartSiteQuiz } from './components/SmartSiteQuiz';
import { SatisfactionGuarantee } from './components/SatisfactionGuarantee';

const HERO_VARIANTS = [
  {
    trade: "HVAC",
    tagline: "Built for HVAC Services",
    headline: "Get more HVAC leads with a website built for comfort.",
    subheadline: "Your smart website works for you 24/7. It automatically optimizes your content, improves your rank, and finds new leads while you're fixing an AC.",
    image: "https://drive.google.com/thumbnail?id=1e4CPR8UPUMtsTQyKGUnil51Cf9qg2S1b&sz=w1000"
  },
  {
    trade: "Electrical",
    tagline: "Built for Electrical Services",
    headline: "Power up your business with more electrical leads.",
    subheadline: "While you’re wiring a panel, AdHello is working on autopilot—optimizing your site, boosting your search rank, and finding new lead opportunities automatically.",
    image: "/electrician.png"
  },
  {
    trade: "Plumbing",
    tagline: "Built for Plumbing Services",
    headline: "Fill your plumbing schedule with high-quality leads.",
    subheadline: "Put your marketing on autopilot. AdHello handles the technical stuff, constantly improving your rank and suggesting growth strategies so you can focus on the pipes.",
    image: "/plumber.png"
  },
  {
    trade: "Roofing",
    tagline: "Built for Roofing Services",
    headline: "Get more roofing estimates without lifting a finger.",
    subheadline: "Marketing that grows your business for you. AdHello automates your search optimization 24/7, finding the best ways to capture more roofing leads.",
    image: "https://drive.google.com/thumbnail?id=1oCWDHteOB-GWTxZAA73MktTXMb0dD6to&sz=w1000"
  },
  {
    trade: "Flooring",
    tagline: "Built for Flooring",
    headline: "Step up your business with more flooring leads.",
    subheadline: "While you’re installing hardwood or laying tile, your smart website helps book your next job. Built to convert local traffic from Google, Maps, and AI search.",
    image: "/flooring-workers.jpg"
  }
];

const PORTFOLIO_EXAMPLES = [
  {
    id: 'plumbing',
    name: 'Plumbers',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    afterImage: '/templates/template-plumbing-light.png'
  },
  {
    id: 'hvac',
    name: 'HVAC',
    beforeImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=800',
    afterImage: '/templates/template-joes-home.png'
  },
  {
    id: 'roofing',
    name: 'Roofing',
    beforeImage: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=800',
    afterImage: '/templates/template-roofing-light.png'
  },
  {
    id: 'emergency',
    name: 'Emergency',
    beforeImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    afterImage: '/templates/template-joes-emergency.png'
  },
  {
    id: 'dashboard',
    name: 'Client Portal',
    beforeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    afterImage: '/templates/template-joes-dashboard.png'
  }
];

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [siteAnalysisOpen, setSiteAnalysisOpen] = useState(false);
  const [analysisForm, setAnalysisForm] = useState({ name: '', email: '', url: '', message: '' });
  const [analysisSubmitting, setAnalysisSubmitting] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [activeStudioTab, setActiveStudioTab] = useState<'audit' | 'brief'>('audit');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [auditReport, setAuditReport] = useState<any>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const handleStartQuiz = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsQuizOpen(true);
  };

  const scrollToAudit = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveStudioTab('audit');
    const element = document.getElementById('studio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_VARIANTS.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      question: "I already have a website. Why do I need AdHello?",
      answer: "Most home service websites are digital brochures — they look nice but don't convert visitors into leads. AdHello sites are built specifically for conversion, optimized for local search, and include AI tools (like Webchat and the Growth Coach) that traditional sites don't have."
    },
    {
      question: "Do I have to build the website myself?",
      answer: "No. We build the entire site for you. You just tell us about your business, your services, and your service area. We handle the design, the copy, and the tech."
    },
    {
      question: "How long does it take to go live?",
      answer: "Your new smart website will be live in 7 days or less."
    },
    {
      question: "What happens if I need to change something on my site?",
      answer: "Just ask your AI Growth Coach or send us a message. We handle updates for you so you don't have to mess with a clunky website builder."
    },
    {
      question: "Am I locked into a contract?",
      answer: "Never. AdHello is flexible. You can choose a month-to-month plan or save significantly with our annual plan (which gives you 2 months free). If you're not getting value, you can cancel anytime."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const BOOKING_LINK = "https://calendar.app.google/QQsVbiAt4QdCX8mx8";

  const openChat = () => {
    window.open(BOOKING_LINK, '_blank');
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => {
        setIsContactModalOpen(false);
        setFormStatus('idle');
      }, 2000);
    }, 1000);
  };

  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://adhello.ai/#website",
      "url": "https://adhello.ai/",
      "name": "AdHello.ai",
      "description": "AI-powered websites and marketing for local home service businesses.",
      "publisher": { "@id": "https://adhello.ai/#organization" }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": "https://adhello.ai/#service",
      "name": "AdHello.ai",
      "url": "https://adhello.ai/",
      "telephone": "+1-360-773-1505",
      "description": "AI-powered websites and marketing for local home service businesses — painters, electricians, plumbers, roofers, flooring and movers.",
      "areaServed": { "@type": "GeoCircle", "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 45.5231, "longitude": -122.6765 }, "geoRadius": "80000" },
      "serviceType": ["Website Design", "Local SEO", "AI Search Optimization", "Lead Generation"]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What is AdHello.ai?", "acceptedAnswer": { "@type": "Answer", "text": "AdHello.ai builds AI-powered websites and handles local SEO and GEO for home service businesses — painters, electricians, plumbers, roofers, flooring companies, and movers." } },
        { "@type": "Question", "name": "How does AdHello.ai get more leads for contractors?", "acceptedAnswer": { "@type": "Answer", "text": "AdHello.ai builds a professional website optimized for Google and AI search engines like ChatGPT and Perplexity, so local customers find your business first." } },
        { "@type": "Question", "name": "Does AdHello.ai work for painters and electricians?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. AdHello.ai specializes in home service businesses including painters, electricians, plumbers, HVAC, roofers, flooring contractors, and movers." } },
        { "@type": "Question", "name": "What is GEO and why does it matter for contractors?", "acceptedAnswer": { "@type": "Answer", "text": "GEO (Generative Engine Optimization) makes your business appear as a trusted answer in AI-powered search results on ChatGPT, Perplexity, and Google AI Overviews — not just traditional search." } }
      ]
    }
  ];

  return (
    <div className="selection:bg-primary/40">
      <EventBanner />
      <SEO
        title="AdHello.ai — AI-Powered Websites &amp; Marketing for Home Service Businesses"
        description="AdHello.ai builds conversion-optimized websites and AI marketing for local contractors — painters, electricians, plumbers, roofers and more. Get found on Google and AI search engines from day one."
        canonical="https://adhello.ai/"
        schema={homeSchema}
      />
      <div data-nav="main" className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-xl border-b border-yellow-100 z-[100] transition-[top] duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <a href="/" aria-label="AdHello.ai home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Logo variant="dark" /></a>
            </div>
            <div className="hidden md:flex items-center gap-10">
              <nav className="flex gap-10">
                <a
                  className="text-sm font-bold text-brand-dark/70 hover:text-brand-dark transition-colors"
                  href="#how-it-works"
                >
                  How It Works
                </a>
                <Link
                  className="text-sm font-bold text-brand-dark/70 hover:text-brand-dark transition-colors"
                  to="/about"
                >
                  About
                </Link>
              </nav>
              <div className="flex items-center gap-8">
                <a
                  href="https://app.adhello.ai/login"
                  className="text-sm font-extrabold text-brand-dark hover:text-primary transition-colors"
                >
                  Sign In
                </a>
                <button
                  onClick={handleStartQuiz}
                  className="bg-primary hover:bg-primary-hover text-brand-dark text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(243,221,109,0.6)] hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
                >
                  Build My Smart Site
                </button>
              </div>
            </div>
            <button
              className="md:hidden p-2 text-brand-dark hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </header>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 shadow-lg absolute w-full">
            <nav className="flex flex-col gap-4">
              <a
                className="text-base font-bold text-brand-dark/70 hover:text-brand-dark transition-colors"
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <Link
                className="text-base font-bold text-brand-dark/70 hover:text-brand-dark transition-colors"
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <a
                className="text-base font-bold text-center text-brand-dark hover:text-primary transition-colors mt-2"
                href="https://app.adhello.ai/login"
              >
                Sign In
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleStartQuiz();
                }}
                className="flex bg-primary hover:bg-primary-hover text-brand-dark text-base font-bold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(243,221,109,0.6)] hover:-translate-y-0.5 hover:scale-105 items-center justify-center gap-2 mt-2"
              >
                Build My Smart Site
              </button>
            </nav>
          </div>
        )}
      </div>

      <section className="hero-gradient overflow-hidden py-32 lg:py-48 min-h-screen flex items-center relative" id="hero">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{
              x: [0, 250, 100, 0],
              y: [0, 150, -50, 0],
              scale: [1, 1.5, 0.8, 1],
              rotate: [0, 45, -45, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute top-[10%] left-[5%] w-80 h-80 bg-primary/40 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              x: [0, -200, 150, 0],
              y: [0, 200, 100, 0],
              scale: [1, 1.3, 1.1, 1],
              rotate: [0, -30, 30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-yellow-300/40 rounded-full blur-[140px]"
          />
          <motion.div
            animate={{
              x: [0, 100, -150, 0],
              y: [0, 250, 150, 0],
              scale: [1, 1.6, 0.7, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute top-[20%] right-[20%] w-64 h-64 bg-primary/30 rounded-full blur-[90px]"
          />
          <motion.div
            animate={{
              x: [0, -150, 50, 0],
              y: [0, -100, 200, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className="absolute bottom-[30%] left-[30%] w-96 h-96 bg-yellow-100/30 rounded-full blur-[110px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 md:mt-0 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left order-2 lg:order-1 relative h-auto lg:h-[450px] flex flex-col justify-center">
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-bold mb-6 border border-yellow-200 w-fit transition-all duration-500">
                  The AI Growth Engine for <span className="text-brand-dark font-black">{HERO_VARIANTS[heroIndex].trade}</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-brand-dark mb-8 leading-[1.05]">
                  More Leads. Less Headache. <span className="hand-underline">Smart Websites for Local Pros.</span>
                </h1>
                <p className="text-xl md:text-2xl text-brand-dark/70 mb-10 leading-relaxed max-w-xl">
                  AdHello gives your home service business a smart website, AI Webchat, and a built-in growth engine - all in one. No agency. No tech headaches. Just more leads.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <button
                    onClick={handleStartQuiz}
                    className="px-10 py-5 bg-primary hover:bg-primary-hover text-brand-dark font-bold rounded-full transition-all shadow-[6px_6px_0px_rgba(45,52,54,0.1)] hover:shadow-none hover:translate-y-[4px] flex items-center justify-center gap-2 text-xl w-full sm:w-auto border-2 border-transparent group"
                  >
                    <Sparkles className="w-6 h-6 text-brand-dark group-hover:animate-pulse" />
                    Build My Smart Site
                  </button>
                  <button
                    onClick={scrollToAudit}
                    className="px-10 py-5 bg-white hover:bg-gray-50 text-brand-dark font-bold rounded-full transition-all shadow-[6px_6px_0px_rgba(45,52,54,0.1)] hover:shadow-none hover:translate-y-[4px] flex items-center justify-center gap-2 text-xl w-full sm:w-auto border-2 border-brand-dark/5"
                  >
                    Get AI Site Audit
                  </button>
                </div>
                <p className="text-sm font-bold text-brand-dark/40 ml-4 mt-2">No long-term contracts. Setup in 7 days. Built for HVAC, Plumbing, Electrical, Roofing &amp; More.</p>
              </div>
            </div>
            <div className="hidden lg:flex relative order-1 lg:order-2 flex-col items-center justify-center h-[500px] lg:h-[650px]">
              <div className="relative z-10 petal-card-shape bg-white p-2 shadow-2xl max-w-lg w-full aspect-[4/5] overflow-hidden">
                <div className="petal-card-shape w-full h-full overflow-hidden bg-primary/10 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={heroIndex}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <img
                        alt="Home Service Professional"
                        className="w-full h-full object-cover"
                        src={HERO_VARIANTS[heroIndex].image}
                        referrerPolicy="no-referrer"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent flex flex-col justify-end p-10 pb-14">
                        <div className="inline-block bg-primary text-brand-dark text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3 w-fit">
                          {HERO_VARIANTS[heroIndex].tagline}
                        </div>
                        <h3 className="text-white text-3xl font-bold mb-2 leading-tight">
                          {HERO_VARIANTS[heroIndex].headline}
                        </h3>
                        <p className="text-white/80 text-lg font-medium">
                          {HERO_VARIANTS[heroIndex].subheadline}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="absolute top-10 -right-4 w-24 h-24 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
        <div className="scroll-down-indicator animate-bounce text-brand-dark/20">
          <ChevronDown className="w-10 h-10" />
        </div>
      </section >

      <section className="py-12 bg-white relative overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <p className="text-center text-sm font-bold text-brand-dark/40 uppercase tracking-widest mb-8">Optimized for the world's most advanced AI search models</p>
          <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-x-6 gap-y-4 md:gap-x-10 transition-all duration-500 overflow-x-auto no-scrollbar py-2">
            {/* OpenAI — lobe-icons/OpenAI/Mono path */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"/></svg>
              <span className="text-lg font-extrabold text-brand-dark">OpenAI</span>
            </div>
            {/* Gemini — lobe-icons/Gemini/Color path */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="#3186FF"/></svg>
              <span className="text-lg font-extrabold text-brand-dark">Gemini</span>
            </div>
            {/* Claude — lobe-icons/Claude/Color path */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" fill="#D97757"/></svg>
              <span className="text-lg font-extrabold text-brand-dark">Claude</span>
            </div>
            {/* Perplexity — lobe-icons/Perplexity/Color path */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z" fill="#22B8CD"/></svg>
              <span className="text-lg font-extrabold text-brand-dark">Perplexity</span>
            </div>
            {/* Grok — lobe-icons/Grok/Mono path */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"/></svg>
              <span className="text-lg font-extrabold text-brand-dark">Grok</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-12 bg-white relative overflow-hidden border-y border-gray-100"
        id="stats"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-50/50 organic-shape-2 -z-10 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-2 text-center p-6 rounded-[2rem] bg-warm-cream border border-gray-100 hover:border-primary transition-all">
              <p className="text-4xl md:text-5xl font-extrabold text-brand-dark">3x</p>
              <p className="text-sm font-bold text-brand-dark/60 uppercase tracking-wider">
                More Calls
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center p-6 rounded-[2rem] bg-warm-cream border border-gray-100 hover:border-primary transition-all">
              <p className="text-4xl md:text-5xl font-extrabold text-brand-dark">4.9/5</p>
              <p className="text-sm font-bold text-brand-dark/60 uppercase tracking-wider">
                Average Rating
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center p-6 rounded-[2rem] bg-warm-cream border border-gray-100 hover:border-primary transition-all">
              <p className="text-4xl md:text-5xl font-extrabold text-brand-dark">24/7</p>
              <p className="text-sm font-bold text-brand-dark/60 uppercase tracking-wider">
                Lead Capture
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center p-6 rounded-[2rem] bg-warm-cream border border-gray-100 hover:border-primary transition-all">
              <p className="text-4xl md:text-5xl font-extrabold text-brand-dark">Local</p>
              <p className="text-sm font-bold text-brand-dark/60 uppercase tracking-wider">
                Built for Local Markets
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white overflow-hidden" id="problem">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-8 leading-[1.1] tracking-tight">
              The Hard Truth About Home Service Marketing
            </h2>
            <p className="text-brand-dark/70 text-xl mb-6 leading-relaxed">
              Most home service businesses are losing leads every single day and they don't even know it. Your website looks fine, but it wasn't built to convert. Your phone goes unanswered after hours. You're invisible on AI search tools like ChatGPT and Google's AI overviews. And you're spending money guessing at what marketing actually works.
            </p>
            <p className="text-brand-dark/70 text-xl mb-8 leading-relaxed">
              Meanwhile, the competitor down the street — the one with the newer trucks and busier schedule — isn't smarter than you. They just have a better system.
            </p>
            <p className="text-2xl font-bold text-brand-dark">
              AdHello is that system.
            </p>
          </div>
        </div>
      </section>
      <section className="py-24 bg-warm-cream" id="comparison">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Why AdHello?
            </h2>
            <p className="text-brand-dark/70 text-xl md:text-2xl max-w-2xl mx-auto">
              Stop losing leads to a slow, outdated website. See the difference a smart, lead-generating site makes.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl flex flex-wrap items-center justify-center border border-brand-dark/5 shadow-xl">
              {PORTFOLIO_EXAMPLES.map((example, idx) => (
                <button
                  key={example.id}
                  onClick={() => setPortfolioIndex(idx)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                    portfolioIndex === idx 
                      ? 'bg-white text-brand-dark shadow-lg scale-105' 
                      : 'text-brand-dark/40 hover:text-brand-dark/60'
                  }`}
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={portfolioIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <BeforeAfterSlider 
                  beforeImage={PORTFOLIO_EXAMPLES[portfolioIndex].beforeImage}
                  afterImage={PORTFOLIO_EXAMPLES[portfolioIndex].afterImage}
                  beforeLabel="Old Site"
                  afterLabel="AdHello Smart Site"
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary rounded-full mix-blend-multiply filter blur-2xl opacity-40 pointer-events-none"></div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-warm-cream relative overflow-hidden" id="what-you-get">
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 tracking-tight">
              Everything You Need to Win Locally — Starting at $97/Month
            </h2>
            <p className="text-brand-dark/70 text-xl md:text-2xl">
              One platform. One price. Built to grow with you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-primary transition-all duration-500 group flex flex-col h-full shadow-sm">
              <div className="text-yellow-500 mb-6 bg-yellow-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Layout className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4">Your Smart Website</h3>
              <p className="text-brand-dark/70 text-lg leading-relaxed">
                A professionally built, mobile-first website designed specifically for home service businesses. Not a template you drag and drop yourself — a real, lead-focused site we build for you, live in 7 days. Optimized for Google, Google Maps, and AI search so customers find you first.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-primary transition-all duration-500 group flex flex-col h-full shadow-sm">
              <div className="text-yellow-500 mb-6 bg-yellow-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4">AI Webchat (Your 24/7 Receptionist)</h3>
              <p className="text-brand-dark/70 text-lg leading-relaxed">
                Never miss a lead again. AdHello's webchat answers customer questions, captures contact info, and qualifies leads — even at 2am when you are asleep. It's like having a receptionist who never takes a day off and never has a bad morning.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-primary transition-all duration-500 group flex flex-col h-full shadow-sm">
              <div className="text-yellow-500 mb-6 bg-yellow-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4">SEO & GEO Built In — and Kept Up</h3>
              <p className="text-brand-dark/70 text-lg leading-relaxed mb-4">
                Your site is optimized for Google and AI search from day one — with SEO and GEO (Generative Engine Optimization) best practices built into every page. And we don't stop there. We continuously refine your site over time so your business stays visible as search keeps evolving.
              </p>
              <p className="text-brand-dark/70 text-lg leading-relaxed font-bold italic">
                Show up on Google, Google Maps, and AI search engines like ChatGPT and Perplexity — from launch and beyond.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-primary transition-all duration-500 group flex flex-col h-full shadow-sm">
              <div className="text-yellow-500 mb-6 bg-yellow-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4">Self-Guided AI Growth Coach</h3>
              <p className="text-brand-dark/70 text-lg leading-relaxed mb-4">
                The technical and difficult parts of growing a website are gone. Your AI Growth Coach analyzes your market and competitors, then suggests specific, actionable ways to get more leads. It's a self-guided system that handles the heavy lifting so you don't have to.
              </p>
              <p className="text-brand-dark/70 text-lg leading-relaxed italic">
                "How do I get more reviews?" "What's my GEO score?" "Suggest a new lead strategy." — It's always ready.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-brand-dark text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
                Your Growth <br />
                <span className="text-primary">on Autopilot</span>
              </h2>
              <p className="text-white/70 text-xl md:text-2xl mb-10 leading-relaxed">
                Stop worrying about the technical stuff. AdHello automates the hard parts of growing your business online, so you can focus on your customers.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Automated Optimization", desc: "AdHello works 24/7 to improve your site's performance and conversion rates automatically." },
                  { title: "Search Domination", desc: "We automatically optimize your brand to be the #1 answer on Google and AI search engines." },
                  { title: "Proactive Lead Strategies", desc: "The system doesn't wait for you. It proactively finds and suggests new ways to capture more local leads." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <p className="text-white/50">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-brand-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold">Growth Autopilot</h4>
                    <p className="text-xs text-white/50">Status: Automating Your Growth</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-sm text-white/70 italic">"I've analyzed your local area. I'm automatically updating your site to target 'emergency repair' which is trending right now."</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-sm text-white/70 italic">"Your search rank has improved by 14%. You are now the top-cited business for local service queries."</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                    <p className="text-sm text-primary font-bold">New Suggestion: "I've drafted a new promotion to get you more leads this weekend. Click to approve."</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-yellow-50/30 relative overflow-hidden" id="how-it-works">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-brand-dark mb-6 tracking-tight"
            >
              Your Path to <span className="text-primary">Dominating</span> Local Search
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-brand-dark/60 max-w-2xl mx-auto font-medium"
            >
              We build the foundation, you bring the expertise, and together we scale your business into the AI era.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {[
              {
                step: 1,
                title: "The Professional Foundation",
                desc: "We build your high-converting, AI-ready website in just 7 days. No tech headaches or complex builders—just a professional, foundational asset that belongs in the modern era.",
                image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                highlight: false
              },
              {
                step: 2,
                title: "Capture Every Lead",
                desc: "Launch your AI receptionist to instantly stop lead leakage. Your intelligent assistant greets visitors, qualifies leads, and books jobs 24/7—while you're on a call or asleep.",
                image: "/ai-receptionist.jpg",
                highlight: true
              },
              {
                step: 3,
                title: "A Scalable Growth Journey",
                desc: "This is where the real journey begins. We provide the tools, AI-driven insights, and continuous support to help your business grow and become more optimized every single day.",
                image: "/dashboard.jpg",
                highlight: false
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className={`group relative flex flex-col h-full rounded-[3.5rem] overflow-hidden transition-all duration-500 hover:translate-y-[-12px] ${
                  card.highlight 
                    ? 'bg-white shadow-2xl z-20 border-2 border-primary ring-4 ring-primary/5' 
                    : 'bg-white/40 backdrop-blur-md border border-white/50 shadow-xl'
                }`}
              >
                <div className="h-64 w-full relative overflow-hidden">
                  <img
                    alt={card.title}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    src={card.image}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.highlight ? 'from-primary/20' : 'from-brand-dark/10'} to-transparent`} />
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                    <span className="text-xl font-black text-brand-dark">{card.step}</span>
                  </div>
                </div>
                
                <div className="p-10 flex-1 flex flex-col">
                  <h4 className="text-2xl md:text-3xl font-black text-brand-dark mb-4 leading-tight">
                    {card.title}
                  </h4>
                  <p className={`text-lg leading-relaxed font-bold ${card.highlight ? 'text-brand-dark/80' : 'text-brand-dark/60'}`}>
                    {card.desc}
                  </p>
                  
                  {card.highlight && (
                    <div className="mt-8 pt-6 border-t border-primary/10">
                      <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                        Live Optimization
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-warm-cream py-16" id="studio">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-full flex items-center border border-brand-dark/5 shadow-2xl">
              <button
                onClick={() => setActiveStudioTab('audit')}
                className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black transition-all ${
                  activeStudioTab === 'audit' ? 'bg-white text-brand-dark shadow-xl scale-105' : 'text-brand-dark/40 hover:text-brand-dark/60'
                }`}
              >
                <Globe className={`w-4 h-4 ${activeStudioTab === 'audit' ? 'text-primary' : ''}`} />
                Site Audit
              </button>
              <button
                onClick={() => setActiveStudioTab('brief')}
                className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black transition-all ${
                  activeStudioTab === 'brief' ? 'bg-white text-brand-dark shadow-xl scale-105' : 'text-brand-dark/40 hover:text-brand-dark/60'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${activeStudioTab === 'brief' ? 'text-primary' : ''}`} />
                Ad Brief
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeStudioTab === 'audit' ? (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <SiteAudit onAuditComplete={setAuditReport} />
              </motion.div>
            ) : (
              <motion.div
                key="brief"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <AdBrief auditReport={auditReport} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="bg-warm-cream py-6 text-brand-dark overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 flex-1">
              <div className="relative shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                  <img 
                    src="/alex-profile.png" 
                    alt="Alex Pavlenko" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-black mb-1 leading-tight text-brand-dark">
                  Get a <span className="italic underline underline-offset-4 decoration-primary">free</span> site analysis from Alex — founder of AdHello.ai
                </h2>
                <p className="text-sm md:text-base text-brand-dark/60 font-medium">
                  Submit your website and Alex will personally review it and send you feedback.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => setSiteAnalysisOpen(true)}
                className="bg-primary hover:bg-primary-hover text-brand-dark px-6 py-3 rounded-xl font-black text-base transition-all hover:scale-105 flex items-center gap-3 shadow-sm group"
              >
                <div className="w-5 h-5 bg-brand-dark rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowRight className="w-3 h-3 text-primary" />
                </div>
                REQUEST SITE ANALYSIS
              </button>
            </div>
          </div>
        </div>
      </section>
      <ROICalculator />
      <SalesChatbot />

      {/* Site Analysis Request Modal */}
      {siteAnalysisOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => { setSiteAnalysisOpen(false); setAnalysisDone(false); }} />
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-brand-dark px-6 py-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                <img src="/alex-profile.png" alt="Alex" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&q=80"; }} />
              </div>
              <div className="flex-1">
                <p className="text-white font-extrabold text-base leading-tight">Free Site Analysis</p>
                <p className="text-white/50 text-xs">Alex will personally review your website</p>
              </div>
              <button onClick={() => { setSiteAnalysisOpen(false); setAnalysisDone(false); }} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-6 py-6">
              {analysisDone ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p className="font-extrabold text-brand-dark text-xl mb-2">Request received!</p>
                  <p className="text-brand-dark/50 text-sm">Alex will review your site and get back to you within 1 business day.</p>
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setAnalysisSubmitting(true);
                  try {
                    await fetch('/api/lead', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...analysisForm, source: 'site-analysis-request' })
                    });
                  } catch (_) {}
                  setAnalysisSubmitting(false);
                  setAnalysisDone(true);
                }} className="space-y-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-brand-dark/40 mb-1.5">Your Name</label>
                    <input type="text" required placeholder="Mike Johnson" value={analysisForm.name} onChange={e => setAnalysisForm(f => ({...f, name: e.target.value}))} className="w-full rounded-xl py-3 px-4 text-sm font-medium border bg-gray-50 text-brand-dark border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-brand-dark/40 mb-1.5">Email Address</label>
                    <input type="email" required placeholder="you@yourbusiness.com" value={analysisForm.email} onChange={e => setAnalysisForm(f => ({...f, email: e.target.value}))} className="w-full rounded-xl py-3 px-4 text-sm font-medium border bg-gray-50 text-brand-dark border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-brand-dark/40 mb-1.5">Website URL</label>
                    <input type="text" required placeholder="yoursite.com" value={analysisForm.url} onChange={e => setAnalysisForm(f => ({...f, url: e.target.value}))} className="w-full rounded-xl py-3 px-4 text-sm font-medium border bg-gray-50 text-brand-dark border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-brand-dark/40 mb-1.5">Anything specific? <span className="text-brand-dark/25 normal-case font-medium">(optional)</span></label>
                    <textarea placeholder="e.g. not getting enough leads, bad mobile experience..." value={analysisForm.message} onChange={e => setAnalysisForm(f => ({...f, message: e.target.value}))} rows={2} className="w-full rounded-xl py-3 px-4 text-sm font-medium border bg-gray-50 text-brand-dark border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={analysisSubmitting} className="w-full bg-primary hover:bg-primary-hover text-brand-dark font-black py-3.5 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                    {analysisSubmitting ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Submitting...</> : 'Submit for Free Analysis →'}
                  </button>
                  <p className="text-center text-xs text-brand-dark/35">Free. No obligation. Alex replies within 1 business day.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <section className="py-24 bg-white" id="niches">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 tracking-tight">
              Built for the Trades. Built for You.
            </h2>
          </div>
          <div className="relative overflow-hidden py-10">
            {/* Gradient masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10"></div>

            <motion.div 
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {[
                { title: "Plumbers", icon: <Droplets className="w-8 h-8 text-primary" /> },
                { title: "HVAC", icon: <ThermometerSnowflake className="w-8 h-8 text-primary" /> },
                { title: "Electricians", icon: <Zap className="w-8 h-8 text-primary" /> },
                { title: "Roofers", icon: <Home className="w-8 h-8 text-primary" /> },
                { title: "Flooring", icon: <Layout className="w-8 h-8 text-primary" /> },
                { title: "Painters", icon: <Paintbrush className="w-8 h-8 text-primary" /> },
                { title: "Movers", icon: <Truck className="w-8 h-8 text-primary" /> }
              ].concat([
                { title: "Plumbers", icon: <Droplets className="w-8 h-8 text-primary" /> },
                { title: "HVAC", icon: <ThermometerSnowflake className="w-8 h-8 text-primary" /> },
                { title: "Electricians", icon: <Zap className="w-8 h-8 text-primary" /> },
                { title: "Roofers", icon: <Home className="w-8 h-8 text-primary" /> },
                { title: "Flooring", icon: <Layout className="w-8 h-8 text-primary" /> },
                { title: "Painters", icon: <Paintbrush className="w-8 h-8 text-primary" /> },
                { title: "Movers", icon: <Truck className="w-8 h-8 text-primary" /> }
              ]).map((niche, i) => (
                <div key={i} className="bg-warm-cream p-8 rounded-3xl text-center border border-gray-100 hover:border-primary transition-all duration-300 group flex flex-col items-center gap-4 min-w-[220px]">
                  <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {niche.icon}
                  </div>
                  <h3 className="text-xl font-black text-brand-dark">{niche.title}</h3>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-yellow-50" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 tracking-tight">
              Don't Just Take Our Word For It
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 relative">
              <div className="text-yellow-400 flex gap-1 mb-6">
                <Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" />
              </div>
              <p className="text-xl text-brand-dark/80 font-medium italic mb-8 leading-relaxed">
                "I had a Wix site that looked terrible on phones and I had no idea how to fix it. AdHello had a new site live in days. Now I'm getting calls from people who say they found me on Google — and I've never once touched the thing. Worth every penny."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Derek M." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-brand-dark">Derek M.</h4>
                  <p className="text-sm text-brand-dark/60 font-bold">Exterior Painter, Vancouver WA</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 relative">
              <div className="text-yellow-400 flex gap-1 mb-6">
                <Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" />
              </div>
              <p className="text-xl text-brand-dark/80 font-medium italic mb-8 leading-relaxed">
                "I was skeptical about AI stuff but my partner convinced me to try it. The Growth Coach told me exactly what to post, when to run ads, and even wrote the copy. We had our best April ever — 30% more booked jobs than last year."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Jessica R." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-brand-dark">Jessica R.</h4>
                  <p className="text-sm text-brand-dark/60 font-bold">HVAC Owner, Portland OR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 tracking-tight">
              Start Simple. Scale When You're Ready.
            </h2>
            <p className="text-brand-dark/60 max-w-2xl mx-auto text-xl md:text-2xl mb-12">
              AdHello grows with your business. Start with the foundation, add tools as you need them. No pressure. No lock-in.
            </p>

            <div className="flex items-center justify-center gap-4 mb-16">
              <span className={`text-sm font-black transition-colors ${billingCycle === 'monthly' ? 'text-brand-dark' : 'text-brand-dark/40'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-16 h-8 bg-brand-dark rounded-full relative p-1 transition-all duration-300"
              >
                <div className={`w-6 h-6 bg-primary rounded-full transition-transform duration-300 ${billingCycle === "annual" ? "translate-x-8" : "translate-x-0"}`}></div>
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black transition-colors ${billingCycle === 'annual' ? 'text-brand-dark' : 'text-brand-dark/40'}`}>Annual (optional)</span>
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">2 Months Free</span>
              </div>
            </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Tier 1 */}
            <div className="bg-warm-cream rounded-[3rem] p-10 flex flex-col h-full border-2 border-primary relative">
              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-primary text-brand-dark font-black px-6 py-2 rounded-full text-sm tracking-widest uppercase shadow-lg">
                Most Popular
              </div>
              <h3 className="text-3xl font-black text-brand-dark mb-2">Starter</h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-brand-dark">
                    ${billingCycle === 'monthly' ? '97' : '80'}
                  </span>
                  <span className="text-brand-dark/60 font-bold">/month</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-brand-dark/40 text-xs font-bold mt-1">Billed annually ($970/year)</p>
                )}
              </div>
              <p className="text-brand-dark/70 text-lg mb-8 font-medium">The foundation every home service business needs.</p>

              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-primary font-black">•</span> Smart website built for you</li>
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-primary font-black">•</span> AI Webchat (24/7 lead capture)</li>
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-primary font-black">•</span> Basic analytics dashboard</li>
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-primary font-black">•</span> AI Growth Coach</li>
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-primary font-black">•</span> Hosting & updates included</li>
              </ul>
              <button onClick={handleStartQuiz} className="w-full py-4 bg-brand-dark hover:bg-brand-dark/90 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 text-lg">
                Start Here
              </button>
            </div>

            {/* Tier 2 */}
            <div className="bg-white rounded-[3rem] p-10 flex flex-col h-full border border-gray-100 relative opacity-80">
              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-gray-200 text-brand-dark/60 font-black px-6 py-2 rounded-full text-sm tracking-widest uppercase">
                Coming Soon
              </div>
              <h3 className="text-3xl font-black text-brand-dark mb-2">Growth</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-extrabold text-brand-dark">TBD</span>
              </div>
              <p className="text-brand-dark/70 text-lg mb-8 font-medium">For businesses ready to scale their marketing.</p>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-gray-300 font-black">•</span> Everything in Starter</li>
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-gray-300 font-black">•</span> Continuous AI Optimization</li>
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-gray-300 font-black">•</span> Ad Briefs (AI-generated ad strategies ready to run)</li>
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-gray-300 font-black">•</span> Content Studio — create images, video, and audio for your brand</li>
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-gray-300 font-black">•</span> Advanced analytics & competitor tracking</li>
                <li className="flex items-start gap-3 text-brand-dark font-bold"><span className="text-gray-300 font-black">•</span> Credits system — use what you need, buy more as you grow</li>
              </ul>
              <button onClick={handleStartQuiz} className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-brand-dark font-bold rounded-full transition-all flex items-center justify-center gap-2 text-lg">
                Join the Waitlist
              </button>
            </div>

            {/* Tier 3 */}
            <div className="bg-brand-dark rounded-[3rem] p-10 flex flex-col h-full border border-brand-dark relative">
              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-white text-brand-dark font-black px-6 py-2 rounded-full text-sm tracking-widest uppercase">
                By Application
              </div>
              <h3 className="text-3xl font-black text-white mb-2">Managed</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-extrabold text-white">Custom</span>
              </div>
              <p className="text-white/70 text-lg mb-8 font-medium">We run your entire growth engine for you.</p>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3 text-white font-bold"><span className="text-white/30 font-black">•</span> Everything in Growth</li>
                <li className="flex items-start gap-3 text-white font-bold"><span className="text-white/30 font-black">•</span> Done-for-you ad management</li>
                <li className="flex items-start gap-3 text-white font-bold"><span className="text-white/30 font-black">•</span> Lead generation campaigns</li>
                <li className="flex items-start gap-3 text-white font-bold"><span className="text-white/30 font-black">•</span> Conversion optimization</li>
                <li className="flex items-start gap-3 text-white font-bold"><span className="text-white/30 font-black">•</span> Dedicated growth strategist</li>
                <li className="flex items-start gap-3 text-white font-bold"><span className="text-white/30 font-black">•</span> Monthly performance reporting</li>
                <li className="flex items-start gap-3 text-white font-bold"><span className="text-white/30 font-black">•</span> Agent Automation</li>
              </ul>
              <p className="text-white/50 text-sm mb-6 italic">This isn't for everyone — it's for businesses serious about dominating their local market.</p>
              <button onClick={handleStartQuiz} className="w-full py-4 bg-white hover:bg-gray-100 text-brand-dark font-bold rounded-full transition-all flex items-center justify-center gap-2 text-lg mt-auto">
                Apply for Managed
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white" id="faq">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-brand-dark/60 text-xl">
              Everything you need to know about growing with AdHello.ai.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${openFaqIndex === index ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-lg font-bold text-brand-dark pr-8">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openFaqIndex === index ? 'bg-primary text-brand-dark' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {openFaqIndex === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <p className="text-brand-dark/70 text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-dark relative overflow-hidden text-center flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8">
            Stop Guessing. <br />
            <span className="hand-underline">Get More Leads.</span>
          </h2>
          <p className="text-white/70 text-2xl md:text-3xl mb-12 max-w-2xl mx-auto">
            Join the local service businesses that are winning the AI search revolution.
          </p>
          <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white text-lg font-medium mb-12">
            <span className="inline-block w-3 h-3 bg-primary rounded-full mr-3 animate-pulse"></span>
            No long-term contracts. Cancel anytime.
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handleStartQuiz}
              className="bg-primary hover:bg-primary-hover text-brand-dark font-extrabold py-5 px-12 rounded-full shadow-[0px_0px_20px_rgba(243,221,109,0.3)] hover:shadow-[0px_0px_30px_rgba(243,221,109,0.5)] transition-all transform hover:scale-105 flex items-center justify-center gap-3 text-xl md:text-2xl group"
            >
              <Sparkles className="w-8 h-8 text-brand-dark group-hover:scale-110 transition-transform" />
              Build My Smart Site
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-warm-cream text-brand-dark/60 py-12 border-t border-brand-dark/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Logo variant="dark" className="h-12 w-auto" />
              </div>
              <SatisfactionGuarantee variant="compact" className="mb-8" />
              <div className="flex gap-4">
                <a
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-brand-dark transition-all text-brand-dark"
                  href="https://x.com/alexpavlenko"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow on X"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                </a>
                <a
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-brand-dark transition-all text-brand-dark"
                  href="https://x.com/messages/compose?recipient_id=alexpavlenko"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DM on X"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-brand-dark text-xl font-extrabold mb-6">
                Product
              </h4>
              <ul className="space-y-4 text-base font-medium">
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="#how-it-works">
                    How It Works
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="/#what-you-get">
                    What's Included
                  </a>
                </li>
                <li>
                  <Link className="hover:text-primary-dark transition-colors" to="/templates">
                    View Templates
                  </Link>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="/#faq">
                    Common Questions
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="/#pricing">
                    Pricing
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="https://leads.adhello.ai" target="_blank" rel="noopener noreferrer">
                    Agency OS
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-brand-dark text-xl font-extrabold mb-6">
                Company
              </h4>
              <ul className="space-y-4 text-base font-medium">
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="#testimonials">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors flex items-center gap-2" href="tel:3607731505" target="_top">
                    <Phone className="w-4 h-4" />
                    (360) 773-1505
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="https://calendar.app.google/QQsVbiAt4QdCX8mx8" target="_blank" rel="noopener noreferrer">
                    Book Demo Today
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="#">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-brand-dark text-xl font-extrabold mb-6">
                Legal
              </h4>
              <ul className="space-y-4 text-base font-medium">
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="#">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-brand-dark text-xl font-extrabold mb-6">
                X Presso
              </h4>
              <ul className="space-y-4 text-base font-medium">
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="/presso-home.html">
                    Presso Home
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="/presso-partners.html">
                    Partner Program
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="/presso-brands.html">
                    Brand Placement
                  </a>
                </li>
              </ul>
            </div>

          </div>
          <div className="pt-10 border-t border-brand-dark/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold tracking-widest uppercase">
            <p>© 2024 AdHello.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Contact Modal */}
      {
        isContactModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
              onClick={() => setIsContactModalOpen(false)}
            ></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 sm:p-8">
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                  <div className="w-12 h-12 bg-primary/20 text-brand-dark rounded-2xl flex items-center justify-center mb-4">
                    <Smile className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">Let's grow together</h3>
                  <p className="text-brand-dark/70">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>

                {formStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-brand-dark mb-2">Message Sent!</h4>
                    <p className="text-brand-dark/70">We're excited to chat with you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-brand-dark mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-brand-dark mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="business" className="block text-sm font-bold text-brand-dark mb-1">Business Name</label>
                      <input
                        type="text"
                        id="business"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Jane's Flowers"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-dark/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                      {formStatus === 'submitting' ? (
                        <span className="animate-pulse">Sending...</span>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )
      }
      <SmartSiteQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div >
  );
}
