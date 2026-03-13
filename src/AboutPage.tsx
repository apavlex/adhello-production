import React from 'react';
import { motion } from 'motion/react';
import {
    ArrowRight,
    Target,
    Workflow,
    Zap,
    Coffee,
    HardHat,
    LineChart,
    ShieldCheck,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import logoImg from './assets/logo.png';
import coffeeFoundersImg from './assets/coffee-shop-founders.jpg';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    const openChat = () => {
        window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank');
    };

    return (
        <div className="selection:bg-primary/40 bg-warm-cream min-h-screen">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-xl border-b border-yellow-100 z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="flex items-center justify-between h-16 sm:h-20">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logoImg} alt="AdHello.ai Logo" className="h-10 w-auto" />
                        </Link>
                        <nav className="hidden md:flex gap-10">
                            <Link to="/" className="text-sm font-bold text-brand-dark/70 hover:text-brand-dark transition-colors">Home</Link>
                            <a className="text-sm font-bold text-brand-dark/70 hover:text-brand-dark transition-colors" href="/#how-it-works">How It Works</a>
                            <a className="text-sm font-bold text-brand-dark/70 hover:text-brand-dark transition-colors" href="/#pricing">Pricing</a>
                            <Link to="/about" className="text-sm font-black text-brand-dark underline decoration-primary decoration-2 underline-offset-4">About</Link>
                        </nav>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="https://app.adhello.ai/login" className="text-sm font-extrabold text-brand-dark hover:text-primary transition-colors">Sign In</a>
                            <button
                                onClick={openChat}
                                className="bg-primary hover:bg-primary-hover text-brand-dark text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(243,221,109,0.6)] hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
                            >
                                Build My Smart Site
                            </button>
                        </div>
                    </header>
                </div>
            </div>

            {/* Hero Section */}
            <section className="pt-40 pb-24 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-brand-dark text-sm font-black mb-8 border border-primary/30 w-fit uppercase tracking-widest">
                            Our Story
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-brand-dark mb-8 leading-[1.05] tracking-tight">
                            Built in the Trenches. <br />
                            <span className="text-primary-hover">Designed for Growth.</span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-brand-dark/70 font-bold leading-relaxed max-w-3xl">
                            Scaling Isn't About Square Footage. It’s About Systems.
                        </p>
                    </motion.div>
                </div>

                {/* Animated Background Element */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            </section>

            {/* Main Narrative */}
            <section className="py-24 bg-white border-y border-yellow-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-7 space-y-10">
                            <div className="prose prose-2xl prose-brand max-w-none">
                                <p className="text-2xl text-brand-dark/80 font-medium leading-[1.6] mb-12">
                                    There is a common misconception that massive scale is purely a result of physical expansion. But if you look at the major players who successfully dominate their markets, you see they aren't just real estate companies—they are systems and logistics companies.
                                </p>
                                <p className="text-2xl text-brand-dark/80 font-medium leading-[1.6] mb-12">
                                    The problem for most small business owners is that we are taught to scale our footprint before we’ve mastered our efficiency. We add a second location, a third crew, or a new office, only to realize we’ve just multiplied our headaches.
                                </p>
                                <p className="text-2xl text-brand-dark/80 font-medium leading-[1.6]">
                                    For fifteen years, I lived this. I ran screen-printing, window-covering, coworking, and coffee businesses. I even worked in Real Estate, seeing the gap between those who were simply "busy" and those who were truly "systematized." I realized that most of us are missing the tech-driven efficiency that large-scale corporations use to maintain control.
                                </p>
                            </div>

                            {/* Founders Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl mb-16 aspect-[4/3]"
                            >
                                <img
                                    src={coffeeFoundersImg}
                                    className="w-full h-full object-cover object-center"
                                    alt="Presso Coffee Shop and Founders"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent pointer-events-none" />
                            </motion.div>

                            <div className="bg-warm-cream p-12 rounded-[3rem] border border-yellow-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                                    <Coffee size={120} strokeWidth={1} />
                                </div>
                                <h2 className="text-4xl font-black text-brand-dark mb-8 relative z-10">The Friday Night Realization</h2>
                                <div className="space-y-6 text-xl text-brand-dark/70 font-bold leading-relaxed relative z-10">
                                    <p>
                                        The idea for Adhello.ai came from the back of a coffee shop at 6:00 PM on a Friday.
                                    </p>
                                    <p>
                                        While my friends and family were heading out for dinner, I was elbows-deep in gray water, trying to clear a clogged main drain so we could open the next morning. It hit me: I had scaled my overhead, but I hadn't scaled my systems. I was an owner, a manager, and a part-time plumber, trading my life for a business that couldn't breathe without me.
                                    </p>
                                    <p>
                                        When my 5-year lease renewals came up, I chose a different path. I decided to stop fighting for more square footage and start building the technology that would allow my businesses to finally evolve.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="sticky top-32 space-y-8">
                                <div className="bg-brand-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                                    <h3 className="text-3xl font-black mb-6">Our Mission</h3>
                                    <p className="text-lg text-white/80 font-bold leading-relaxed">
                                        At Adhello, we believe the next era of small business growth won't come from just signing more leases—it will come from Digital Efficiency. I still run my flagship coffee shop as a "Living Lab." I don't build software in a vacuum; I build it for the person who is tired of the grind and ready to build a business that finally works for them.
                                    </p>
                                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-brand-dark">
                                            <Zap size={32} fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="font-black text-xl">The Living Lab</p>
                                            <p className="text-sm font-bold text-white/60">Built for operators, by operators.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary p-10 rounded-[3rem] shadow-xl border-4 border-white">
                                    <h3 className="text-3xl font-black text-brand-dark mb-6">Why Adhello.ai?</h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: <Target className="w-6 h-6" />, text: "Automated Lead Capture", sub: "Never miss a client on a job." },
                                            { icon: <Workflow className="w-6 h-6" />, text: "Intelligent Qualification", sub: "Stop chasing tire-kickers." },
                                            { icon: <Zap className="w-6 h-6" />, text: "Frictionless Follow-up", sub: "Win with repeatability." }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 items-start bg-white/40 p-5 rounded-2xl border border-white/50 hover:bg-white/60 transition-colors">
                                                <div className="p-2 bg-brand-dark text-white rounded-lg">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="font-black text-brand-dark">{item.text}</p>
                                                    <p className="text-sm font-bold text-brand-dark/60">{item.sub}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-32 bg-warm-cream relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black text-brand-dark mb-10 leading-tight">
                        Stop multiplying your overhead and <span className="hand-underline decoration-primary">start scaling your systems.</span>
                    </h2>
                    <p className="text-2xl text-brand-dark/60 font-bold mb-12 max-w-2xl mx-auto">
                        The gates are open. Build a business that finally works for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={openChat}
                            className="px-12 py-6 bg-primary hover:bg-primary-hover text-brand-dark font-black rounded-full transition-all shadow-[8px_8px_0px_rgba(45,52,54,0.1)] hover:shadow-none hover:translate-y-[4px] flex items-center justify-center gap-3 text-2xl group"
                        >
                            <Sparkles className="w-8 h-8 text-brand-dark group-hover:animate-pulse" />
                            Build My Smart Site for $97/mo <ArrowRight size={28} />
                        </button>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/20 blur-[120px] rounded-full" />
            </section>

            {/* Footer (Simplified for About) */}
            <footer className="bg-brand-dark text-white py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                        <div className="max-w-sm">
                            <img src={logoImg} alt="AdHello.ai" className="h-10 w-auto brightness-0 invert mb-8" />
                            <p className="text-lg text-white/60 font-bold leading-relaxed">
                                The AI Growth Engine for Home Service Businesses. Built in the trenches, designed for growth.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-16">
                            <div>
                                <h4 className="font-black text-xl mb-6">Navigate</h4>
                                <ul className="space-y-4 text-white/50 font-bold">
                                    <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                                    <li><a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                                    <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-black text-xl mb-6">Connect</h4>
                                <ul className="space-y-4 text-white/50 font-bold">
                                    <li><a href="tel:3607731505" target="_top" className="hover:text-primary transition-colors">360-773-1505</a></li>
                                    <li><a href="https://calendar.app.google/QQsVbiAt4QdCX8mx8" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Book Demo Today</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Legal</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-white/40 font-bold">© {new Date().getFullYear()} AdHello.ai. All rights reserved.</p>
                        <div className="flex gap-8 text-white/30 font-black text-sm uppercase tracking-widest">
                            <span>Built by Operators</span>
                            <span>•</span>
                            <span>Made in the Lab</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
