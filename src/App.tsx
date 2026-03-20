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
// Inline AI brand icon components (replaces @lobehub/icons to avoid peer-dep build errors)
// ── AI Brand Icons ────────────────────────────────────────────
// OpenAI — official knot logo
const OpenAI = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.786a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.401-.674zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

// Gemini — 4-pointed star (blue→red gradient, official shape)
const GeminiColor = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gem-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4B90FF"/>
        <stop offset="100%" stopColor="#FF5546"/>
      </linearGradient>
    </defs>
    <path d="M14 28C14 26.0633 13.6267 24.2433 12.88 22.54C12.1567 20.8367 11.165 19.355 9.905 18.095C8.645 16.835 7.16333 15.8433 5.46 15.12C3.75667 14.3733 1.93667 14 0 14C1.93667 14 3.75667 13.6383 5.46 12.915C7.16333 12.1683 8.645 11.165 9.905 9.905C11.165 8.645 12.1567 7.16333 12.88 5.46C13.6267 3.75667 14 1.93667 14 0C14 1.93667 14.3617 3.75667 15.085 5.46C15.8317 7.16333 16.835 8.645 18.095 9.905C19.355 11.165 20.8367 12.1683 22.54 12.915C24.2433 13.6383 26.0633 14 28 14C26.0633 14 24.2433 14.3733 22.54 15.12C20.8367 15.8433 19.355 16.835 18.095 18.095C16.835 19.355 15.8317 20.8367 15.085 22.54C14.3617 24.2433 14 26.0633 14 28Z" fill="url(#gem-a)"/>
  </svg>
);
const Gemini = { Color: GeminiColor };

// Claude — Anthropic official logomark (coral squircle with A-shape)
const ClaudeColor = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="46" height="46" rx="10" fill="#D4956A"/>
    <path d="M27.5 12L35 34H30.5L29 29.5H20.5L19 34H14.5L22 12H27.5ZM24.75 17.5L21.75 26H27.75L24.75 17.5Z" fill="white"/>
  </svg>
);
const Claude = { Color: ClaudeColor };

// Meta — official infinity figure-8 wordmark
const MetaColor = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 287 191" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mg1" x1="62.5" y1="95.4" x2="140" y2="52.8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0064E1"/>
        <stop offset="0.4" stopColor="#0064E1"/>
        <stop offset="0.83" stopColor="#0073EE"/>
        <stop offset="1" stopColor="#0082FB"/>
      </linearGradient>
      <linearGradient id="mg2" x1="116.5" y1="107" x2="116.5" y2="65.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0082FB"/>
        <stop offset="1" stopColor="#0064E0"/>
      </linearGradient>
    </defs>
    <path d="M31.1 109.6C31.1 125.7 34.6 138.1 39.9 146.1c5.8 8.6 13.8 12.9 23.3 12.9 11.1 0 19.1-3.2 29.3-14c3.8-4.1 7.8-9 11.5-14.7l7-10.1 14-20.7C165.3 65 183.9 46 206.5 46c18 0 31.3 9.5 40.7 26.8 8 14.8 12.5 36.1 12.5 58.4 0 18.4-3.7 33.4-11.2 44.5-5.5 8.2-13.7 14.3-24.5 14.3v-36.5c9.8 0 12.2-9 12.2-22.8 0-19.6-5-37.4-14-46.3-4.3-4.2-9.2-6-14.6-6-11.1 0-19.7 7.1-30.7 23.8l-7.2 10.8-14.4 21.5c-9.4 14.1-19.2 26.4-28.5 34.1-11.7 9.7-23.6 14.6-37 14.6-18.3 0-33.1-8.9-43.1-24.3C38.2 147 31.1 129.1 31.1 109.6z" fill="url(#mg1)"/>
    <path d="M89 74c-8.6-12-16.8-18-26.2-18-18 0-31.7 18.5-31.7 53.6 0 13 2.5 24.2 7.2 32.7L5 165.9C-3.5 150.8-8 130.8-8 109.5-8 60.3 18.1 20 63.3 20c21.8 0 38.4 8.2 54 25.8L89 74z" fill="url(#mg2)"/>
    <path d="M160.3 93.9l-13-20.2C133 50.3 118.9 34 96.7 34c-3.7 0-7.2.5-10.5 1.5L61 67.7c6.7-3.3 13.3-4.6 20-4.6 21.6 0 36 13.7 51.3 35.7l8.6 13z" fill="#0082FB"/>
  </svg>
);
const Meta = { Color: MetaColor };

// Perplexity — official geometric diamond mark
const PerplexityColor = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1.5L4.5 7.5V10.5H2.25V13.5H4.5V16.5L12 22.5L19.5 16.5V13.5H21.75V10.5H19.5V7.5L12 1.5Z" fill="#1F9B7A"/>
    <rect x="7" y="10.5" width="10" height="3" fill="#1F9B7A" opacity="0.5"/>
    <line x1="12" y1="1.5" x2="12" y2="22.5" stroke="white" strokeWidth="1" strokeOpacity="0.25"/>
    <line x1="4.5" y1="10.5" x2="19.5" y2="10.5" stroke="white" strokeWidth="1" strokeOpacity="0.25"/>
    <line x1="4.5" y1="13.5" x2="19.5" y2="13.5" stroke="white" strokeWidth="1" strokeOpacity="0.25"/>
  </svg>
);
const Perplexity = { Color: PerplexityColor };

// Grok / X — official X letterform
const Grok = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
import { Link } from 'react-router-dom';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { AssessmentCTA } from './components/AssessmentCTA';
import { Logo } from './components/Logo';
import SEO from './components/SEO';

const HERO_VARIANTS = [
  {
    tagline: "Built for HVAC Services",
    headline: "Get more HVAC leads with a website built for comfort.",
    subheadline: "Your smart website works for you 24/7. It automatically optimizes your content, improves your rank, and finds new leads while you're fixing an AC.",
    image: "https://drive.google.com/thumbnail?id=1e4CPR8UPUMtsTQyKGUnil51Cf9qg2S1b&sz=w1000"
  },
  {
    tagline: "Built for Electrical Services",
    headline: "Power up your business with more electrical leads.",
    subheadline: "While you’re wiring a panel, AdHello is working on autopilot—optimizing your site, boosting your search rank, and finding new lead opportunities automatically.",
    image: "https://drive.google.com/thumbnail?id=1zbMCrvpcoCBuzJk60gE9k2_eIFnYZoYB&sz=w1000"
  },
  {
    tagline: "Built for Plumbing Services",
    headline: "Fill your plumbing schedule with high-quality leads.",
    subheadline: "Put your marketing on autopilot. AdHello handles the technical stuff, constantly improving your rank and suggesting growth strategies so you can focus on the pipes.",
    image: "https://drive.google.com/thumbnail?id=1iH1uKlOuXDQ2zBjvzjF82eOcJz2u0k6P&sz=w1000"
  },
  {
    tagline: "Built for Roofing Services",
    headline: "Get more roofing estimates without lifting a finger.",
    subheadline: "Marketing that grows your business for you. AdHello automates your search optimization 24/7, finding the best ways to capture more roofing leads.",
    image: "https://drive.google.com/thumbnail?id=1oCWDHteOB-GWTxZAA73MktTXMb0dD6to&sz=w1000"
  },
  {
    tagline: "Built for Flooring",
    headline: "Step up your business with more flooring leads.",
    subheadline: "While you’re installing hardwood or laying tile, your smart website helps book your next job. Built to convert local traffic from Google, Maps, and AI search.",
    image: "/flooring-workers.jpg"
  }
];

const PORTFOLIO_EXAMPLES = [
  {
    id: 'painter',
    name: 'Painting',
    beforeImage: '/old-site.png',
    afterImage: '/new-site.png'
  },
  {
    id: 'movers',
    name: 'Movers',
    beforeImage: '/old-movers-site.png',
    afterImage: '/new-movers-site.png'
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    beforeImage: '/old-plumbing-site.png',
    afterImage: '/templates/template-proplumb.png'
  },
  {
    id: 'hvac',
    name: 'HVAC',
    beforeImage: '/old-hvac-site.png',
    afterImage: '/templates/template-joes-home.png'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    beforeImage: '/old-electrical-site.png',
    afterImage: '/templates/template-portland-electric-home.png'
  },
  {
    id: 'roofing',
    name: 'Roofing',
    beforeImage: '/old-roofing-site.png',
    afterImage: '/templates/template-roofing-home.png'
  }
];

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeStudioTab, setActiveStudioTab] = useState<'audit' | 'brief'>('audit');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [portfolioIndex, setPortfolioIndex] = useState(0);

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
        { "@type": "Question", "name": "What is AdHello.ai?", "acceptedAnswer": { "@type": "Answer", "text": "AdHello.ai builds AI-powered websites and handles local SEO and AEO for home service businesses — painters, electricians, plumbers, roofers, flooring companies, and movers." } },
        { "@type": "Question", "name": "How does AdHello.ai get more leads for contractors?", "acceptedAnswer": { "@type": "Answer", "text": "AdHello.ai builds a professional website optimized for Google and AI search engines like ChatGPT and Perplexity, so local customers find your business first." } },
        { "@type": "Question", "name": "Does AdHello.ai work for painters and electricians?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. AdHello.ai specializes in home service businesses including painters, electricians, plumbers, HVAC, roofers, flooring contractors, and movers." } },
        { "@type": "Question", "name": "What is AEO and why does it matter for contractors?", "acceptedAnswer": { "@type": "Answer", "text": "AEO (Answer Engine Optimization) makes your business appear as a trusted answer in AI-powered search results on ChatGPT, Perplexity, and Google AI Overviews — not just traditional search." } }
      ]
    }
  ];

  return (
    <div className="selection:bg-primary/40">
      <SEO
        title="AdHello.ai — AI-Powered Websites &amp; Marketing for Home Service Businesses"
        description="AdHello.ai builds conversion-optimized websites and AI marketing for local contractors — painters, electricians, plumbers, roofers and more. Get found on Google and AI search engines from day one."
        canonical="https://adhello.ai/"
        schema={homeSchema}
      />
      <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-xl border-b border-yellow-100 z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <Logo variant="dark" />
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
                  onClick={openChat}
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
                  openChat();
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
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-bold mb-6 border border-yellow-200 w-fit">
                  The AI Growth Engine for Home Service Businesses
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-brand-dark mb-8 leading-[1.05]">
                  More Leads. Less Headache. <span className="hand-underline">Smart Websites for Local Pros.</span>
                </h1>
                <p className="text-xl md:text-2xl text-brand-dark/70 mb-10 leading-relaxed max-w-xl">
                  AdHello gives your home service business a smart website, AI Webchat, and a built-in growth engine - all in one. No agency. No tech headaches. Just more leads.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <button
                    onClick={openChat}
                    className="px-10 py-5 bg-primary hover:bg-primary-hover text-brand-dark font-bold rounded-full transition-all shadow-[6px_6px_0px_rgba(45,52,54,0.1)] hover:shadow-none hover:translate-y-[4px] flex items-center justify-center gap-2 text-xl w-full sm:w-auto border-2 border-transparent group"
                  >
                    <Sparkles className="w-6 h-6 text-brand-dark group-hover:animate-pulse" />
                    Build My Smart Site
                  </button>
                  <button
                    onClick={scrollToAudit}
                    className="px-10 py-5 bg-white hover:bg-gray-50 text-brand-dark font-bold rounded-full transition-all shadow-[6px_6px_0px_rgba(45,52,54,0.1)] hover:shadow-none hover:translate-y-[4px] flex items-center justify-center gap-2 text-xl w-full sm:w-auto border-2 border-brand-dark/5"
                  >
                    See How It Works
                  </button>
                </div>
                <p className="text-sm font-bold text-brand-dark/40 ml-4 mt-2">No long-term contracts. Setup in 7 days. Built for HVAC, Plumbing, Electrical, Roofing &amp; More.</p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2 flex flex-col items-center justify-center h-[500px] lg:h-[650px]">
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
            {/* OpenAI */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <OpenAI size={32} />
              <span className="text-lg font-extrabold text-brand-dark">OpenAI</span>
            </div>
            {/* Gemini */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Gemini.Color size={32} />
              <span className="text-lg font-extrabold text-brand-dark">Gemini</span>
            </div>
            {/* Claude (Anthropic) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Claude.Color size={32} />
              <span className="text-lg font-extrabold text-brand-dark">Claude</span>
            </div>
            {/* Meta */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Meta.Color size={32} />
              <span className="text-lg font-extrabold text-brand-dark">Meta</span>
            </div>
            {/* Perplexity */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Perplexity.Color size={32} />
              <span className="text-lg font-extrabold text-brand-dark">Perplexity</span>
            </div>
            {/* Grok */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Grok size={32} />
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

      <div className="max-w-7xl mx-auto px-4">
        <div className="hand-divider hand-divider-v2 opacity-20"></div>
      </div>

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

      <div className="max-w-7xl mx-auto px-4">
        <div className="hand-divider hand-divider-v2 opacity-20"></div>
      </div>

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
              <h3 className="text-2xl font-black text-brand-dark mb-4">SEO & AEO Built In — and Kept Up</h3>
              <p className="text-brand-dark/70 text-lg leading-relaxed mb-4">
                Your site is optimized for Google and AI search from day one — with SEO and AEO (Answer Engine Optimization) best practices built into every page. And we don't stop there. We continuously refine your site over time so your business stays visible as search keeps evolving.
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
                "How do I get more reviews?" "What's my current AEO rank?" "Suggest a new lead strategy." — It's always ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="hand-divider hand-divider-v2 opacity-20"></div>
      </div>

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

      <div className="max-w-7xl mx-auto px-4">
        <div className="hand-divider hand-divider-v2 opacity-20"></div>
      </div>

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

      <div className="max-w-7xl mx-auto px-4">
        <div className="hand-divider hand-divider-v2 opacity-20"></div>
      </div>

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
                <SiteAudit />
              </motion.div>
            ) : (
              <motion.div
                key="brief"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <AdBrief />
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
                  Get a <span className="italic underline underline-offset-4 decoration-primary">FREE</span> Assessment Video from Alex
                </h2>
                <p className="text-sm md:text-base text-brand-dark/60 font-medium">
                  Reviewing your website to help you grow.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <button 
                onClick={openChat}
                className="bg-primary hover:bg-primary-hover text-brand-dark px-6 py-3 rounded-xl font-black text-base transition-all hover:scale-105 flex items-center gap-3 shadow-sm group"
              >
                <div className="w-5 h-5 bg-brand-dark rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowRight className="w-3 h-3 text-primary" />
                </div>
                GET STARTED
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="hand-divider hand-divider-v4 opacity-20"></div>
      </div>

      <ROICalculator />
      <SalesChatbot />

      <div className="max-w-7xl mx-auto px-4">
        <div className="hand-divider hand-divider-v2 opacity-20"></div>
      </div>

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

      <div className="max-w-7xl mx-auto px-4">
        <div className="hand-divider hand-divider-v2 opacity-20"></div>
      </div>

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
                "I used to pay an agency $500 a month just to host my site and they never answered my emails. AdHello built me a better site in a week, the AI chat books jobs while I'm sleeping, and I'm paying a fraction of the cost. It's a no-brainer."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Mike T." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-brand-dark">Mike T.</h4>
                  <p className="text-sm text-brand-dark/60 font-bold">Local Plumber</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 relative">
              <div className="text-yellow-400 flex gap-1 mb-6">
                <Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" />
              </div>
              <p className="text-xl text-brand-dark/80 font-medium italic mb-8 leading-relaxed">
                "The Growth Coach is wild. I asked it how to get more AC tune-up jobs before summer, and it gave me an exact script to text my past customers. Booked 4 jobs the next day. Best investment I make for my business."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Sarah L." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-brand-dark">Sarah L.</h4>
                  <p className="text-sm text-brand-dark/60 font-bold">HVAC Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="hand-divider hand-divider-v2 opacity-20"></div>
      </div>

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
              <button onClick={openChat} className="w-full py-4 bg-brand-dark hover:bg-brand-dark/90 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 text-lg">
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
              <button onClick={openChat} className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-brand-dark font-bold rounded-full transition-all flex items-center justify-center gap-2 text-lg">
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
              <button onClick={openChat} className="w-full py-4 bg-white hover:bg-gray-100 text-brand-dark font-bold rounded-full transition-all flex items-center justify-center gap-2 text-lg mt-auto">
                Apply for Managed
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="hand-divider hand-divider-v2 opacity-20"></div>
      </div>

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
              onClick={openChat}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Logo variant="dark" className="h-12 w-auto" />
              </div>
              <p className="text-lg leading-relaxed mb-8 italic text-brand-dark/80">
                "Websites built for home service businesses that want more leads."
              </p>
              <div className="flex gap-4">
                <a
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-brand-dark transition-all text-brand-dark"
                  href="#"
                >
                  <Globe className="w-5 h-5" />
                </a>
                <a
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-brand-dark transition-all text-brand-dark"
                  href="#"
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
                  <a className="hover:text-primary-dark transition-colors" href="/presso-home.html">
                    AdHello × Presso
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-dark transition-colors" href="/#pricing">
                    Pricing
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
    </div >
  );
}
