import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './components/SEO';
import {
  Zap,
  ArrowRight,
  Activity,
  Bot,
  Timer,
  MapPinOff,
  CheckCircle2,
  ChevronDown,
  Plus,
  Minus,
  Smartphone,
  RefreshCw,
  Search,
  Smile,
  Sparkles
} from 'lucide-react';

export default function AeoLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How long does it take to launch?",
      answer: "Usually within 7–10 days. We handle everything from design to content."
    },
    {
      question: "Do I own the domain and content?",
      answer: "Yes, you own your domain and all the content we create for you."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, there are no long-term contracts. You can cancel your $97/month subscription at any time."
    },
    {
      question: "What is AEO and why does it matter?",
      answer: "AEO stands for Generative Engine Optimization. It's the process of optimizing your website so that AI search engines like ChatGPT, Google Gemini, and AI Overviews recommend your business when local customers ask questions."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const openChat = () => {
    window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank');
  };

  return (
    <div className="min-h-screen bg-warm-cream text-brand-dark font-sans selection:bg-primary/40">
      <EventBanner />
      <SEO
        title="GEO Optimization for Contractors — AdHello.ai | Get Found on ChatGPT and Perplexity"
        description="AI search engines like ChatGPT, Perplexity, and Google AI Overviews are stealing your leads. AdHello.ai GEO optimization makes your business the answer AI gives to local customers."
        canonical="https://adhello.ai/geo"
        schema={geoSchema}
      />
      {/* Navigation */}
      <nav data-nav="main" className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-yellow-100 transition-[top] duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 text-brand-dark flex items-center justify-center bg-primary rounded-full shadow-sm">
              <Smile className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark">
              AdHello<span className="text-yellow-500">.ai</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-bold text-brand-dark/70 hover:text-brand-dark transition-colors">Home</a>
            <a href="#process" className="text-sm font-bold text-brand-dark/70 hover:text-brand-dark transition-colors">Process</a>
            <a href="#pricing" className="text-sm font-bold text-brand-dark/70 hover:text-brand-dark transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-bold text-brand-dark/70 hover:text-brand-dark transition-colors">FAQ</a>
            <a href="#reviews" className="text-sm font-bold text-brand-dark/70 hover:text-brand-dark transition-colors">Reviews</a>
            <button
              onClick={openChat}
              className="bg-primary hover:bg-primary-hover text-brand-dark px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(243,221,109,0.6)] hover:-translate-y-0.5 hover:scale-105"
            >
              Build My Smart Site
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden relative hero-gradient">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 text-brand-dark text-sm font-bold mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-dark"></span>
            </span>
            New: GEO Optimization Included
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-dark mb-6 leading-[1.1]">
            Your Google Ads are losing leads to <span className="hand-underline">AI Search.</span>
          </h1>

          <p className="text-xl md:text-2xl text-brand-dark/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            High-speed, AI-optimized websites built specifically for local contractors. Only $97/month.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={openChat}
              className="w-full sm:w-auto px-10 py-5 bg-primary hover:bg-primary-hover text-brand-dark text-xl font-bold rounded-full transition-all shadow-[6px_6px_0px_rgba(45,52,54,0.1)] hover:shadow-none hover:translate-y-[4px] flex items-center justify-center gap-2 border-2 border-transparent group"
            >
              <Sparkles className="w-6 h-6 text-brand-dark group-hover:animate-pulse" />
              Build My Smart Site
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-brand-dark/50 font-bold">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-8 h-8 rounded-full border-2 border-warm-cream" />
              ))}
            </div>
            <span className="ml-2">Trusted by 200+ contractors</span>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-white border-y border-gray-100" id="process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Activity className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-dark mb-4">The search game changed in 2026</h2>
            <p className="text-xl text-brand-dark/70 max-w-2xl mx-auto leading-relaxed">
              Traditional SEO is dead. If your site isn't built for AI Overviews, you're invisible to your local customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-warm-cream p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/20 text-primary-dark rounded-xl flex items-center justify-center mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">AI Overviews</h3>
              <p className="text-brand-dark/70 leading-relaxed font-medium">
                Old sites are ignored by modern AI search engines like ChatGPT and Google Gemini. We ensure you show up in the results.
              </p>
            </div>
            <div className="bg-warm-cream p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Timer className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">The 3-Second Rule</h3>
              <p className="text-brand-dark/70 leading-relaxed font-medium">
                If it doesn't load instantly, they've already called your competitor. Our sites score 99+ on Google PageSpeed.
              </p>
            </div>
            <div className="bg-warm-cream p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-200 text-brand-dark/60 rounded-xl flex items-center justify-center mb-6">
                <MapPinOff className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">The Ghost Town</h3>
              <p className="text-brand-dark/70 leading-relaxed font-medium">
                An outdated site tells customers you're out of business. We provide fresh, AI-driven content updates daily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-warm-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-dark mb-4">Built for Calls, Optimized for AI</h2>
            <p className="text-xl text-brand-dark/70 max-w-2xl mx-auto leading-relaxed">
              Our AI automation engine builds high-performance sites at a fraction of the cost.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/20 text-primary-dark rounded-xl flex items-center justify-center shrink-0">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-brand-dark">AEO Optimized</h3>
                  <p className="text-brand-dark/70 font-medium">Generative Engine Optimization ensures AI agents recommend your services.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/20 text-primary-dark rounded-xl flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-brand-dark">Mobile-First Design</h3>
                  <p className="text-brand-dark/70 font-medium">90% of home service calls come from phones. We optimize for the thumb.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/20 text-primary-dark rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-brand-dark">Blazing Speed</h3>
                  <p className="text-brand-dark/70 font-medium">Sub-1s load times globally for maximum lead conversion.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/20 text-primary-dark rounded-xl flex items-center justify-center shrink-0">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-brand-dark">Instant Updates</h3>
                  <p className="text-brand-dark/70 font-medium">AI-driven content refreshes keep your business current and relevant.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Contractor using mobile phone"
                className="relative rounded-3xl shadow-2xl object-cover h-[500px] w-full border-[8px] border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why so affordable / Pricing */}
      <section className="py-24 bg-brand-dark text-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-8">Why so affordable?</h2>
              <ul className="space-y-6 mb-8">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <strong className="block text-lg mb-1 font-bold">AI Automation:</strong>
                    <span className="text-white/70 font-medium">We use proprietary AI to handle the manual coding and content writing that agencies charge thousands for.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <strong className="block text-lg mb-1 font-bold">Focused niche:</strong>
                    <span className="text-white/70 font-medium">We only work with local contractors, meaning we have the perfect templates ready to go.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <strong className="block text-lg mb-1 font-bold">No bloated overhead:</strong>
                    <span className="text-white/70 font-medium">No sales teams or fancy offices—just pure performance tech.</span>
                  </div>
                </li>
              </ul>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold mb-2">Enterprise tech for local business prices.</h3>
                <p className="text-white/70 font-medium leading-relaxed">
                  Most agencies will charge you $5,000 for a site that's outdated by the time it launches. Our platform evolves with the AI search landscape every single week.
                </p>
              </div>
            </div>

            <div className="bg-white text-brand-dark rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-brand-dark text-xs font-black px-4 py-1 rounded-bl-xl uppercase tracking-wider">Best Value</div>
              <h3 className="text-2xl font-extrabold mb-2 text-center">The "One Call" Math</h3>
              <p className="text-brand-dark/50 text-center mb-8 font-bold">Average contractor service call = $350 - $1,200+</p>

              <div className="flex justify-between items-end border-b border-gray-100 pb-6 mb-6">
                <div>
                  <div className="text-sm font-bold text-brand-dark/40 uppercase tracking-wider mb-1">Yearly Cost</div>
                  <div className="text-4xl font-black text-brand-dark">$1,164</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-brand-dark/40 uppercase tracking-wider mb-1">Break Even</div>
                  <div className="text-2xl font-extrabold text-primary-dark">1 Lead</div>
                </div>
              </div>

              <p className="text-lg font-medium text-brand-dark/70 mb-8 text-center leading-relaxed">
                If we send you just <strong className="text-brand-dark font-black">ONE</strong> more customer per <strong className="text-brand-dark font-black">YEAR</strong>, the site pays for itself. Everything else is pure profit.
              </p>

              <button
                onClick={openChat}
                className="w-full py-5 bg-primary hover:bg-primary-hover text-brand-dark text-xl font-bold rounded-full transition-all shadow-[6px_6px_0px_rgba(45,52,54,0.1)] hover:shadow-none hover:translate-y-[4px] border-2 border-transparent flex items-center justify-center gap-3 group"
              >
                <Sparkles className="w-7 h-7 text-brand-dark group-hover:scale-110 transition-transform" />
                Build My Smart Site for $97/mo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-dark mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-warm-cream border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-sm"
              >
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-bold text-lg text-brand-dark">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === index ? 'bg-primary/20 text-primary-dark' : 'bg-white text-brand-dark/40 border border-gray-200'}`}>
                    {openFaq === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-brand-dark/70 leading-relaxed border-t border-gray-100 pt-4 font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warm-cream border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 text-brand-dark flex items-center justify-center bg-primary rounded-full shadow-sm">
                  <Smile className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-brand-dark">
                  AdHello<span className="text-yellow-500">.ai</span>
                </h2>
              </div>
              <p className="text-brand-dark/60 max-w-sm font-medium leading-relaxed">
                Modernizing the way local home services acquire leads through AI-driven web technologies.
              </p>
            </div>
            <div>
              <h4 className="font-extrabold text-brand-dark mb-4">Services</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-brand-dark/60 hover:text-primary-dark font-medium transition-colors">GEO Optimization</a></li>
                <li><a href="#" className="text-brand-dark/60 hover:text-primary-dark font-medium transition-colors">Speed Optimization</a></li>
                <li><a href="#" className="text-brand-dark/60 hover:text-primary-dark font-medium transition-colors">AI Content</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-brand-dark mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-brand-dark/60 hover:text-primary-dark font-medium transition-colors">About Us</a></li>
                <li><a href="tel:3607731505" target="_top" className="text-brand-dark/60 hover:text-primary-dark font-medium transition-colors">360-773-1505</a></li>
                <li><a href="https://calendar.app.google/QQsVbiAt4QdCX8mx8" target="_blank" rel="noopener noreferrer" className="text-brand-dark/60 hover:text-primary-dark font-medium transition-colors">Book Demo Today</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-brand-dark/40 text-sm font-bold">© 2026 AdHello.ai. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-brand-dark/40 font-bold">
              <a href="#" className="hover:text-brand-dark transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-dark transition-colors">Terms</a>
              <a href="#" className="hover:text-brand-dark transition-colors">Legal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
