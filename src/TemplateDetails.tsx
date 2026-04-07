import { useAnalytics } from './hooks/useAnalytics';
import { EventBanner } from './components/EventBanner';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SITE_ORIGIN } from './lib/site';
import { ArrowLeft, CheckCircle2, Star, ChevronRight, Monitor, Smartphone, Zap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getTemplateById, getRelatedTemplates } from './data/templates';
import { Logo } from './components/Logo';
import SEO from './components/SEO';

// Fallback dynamic icon renderer
const IconComponent = ({ name, className }: { name: string, className?: string }) => {
    // @ts-ignore
    const Icon = LucideIcons[name] || LucideIcons.CheckCircle;
    return <Icon className={className} />;
};

export default function TemplateDetails() { useAnalytics(); useAnalytics();
    const { category, templateId } = useParams<{ category: string; templateId: string }>();
    const [activeImage, setActiveImage] = useState(0);

    // In a real SPA, you'd handle 404s better, but for now just return null
    const template = templateId ? getTemplateById(templateId) : undefined;

    useEffect(() => {
        // Basic SEO meta update simulating a real framework
        if (template) {
            document.title = `${template.name} | AdHello.ai Templates`;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', template.seoDescription);
            }
        }
    }, [template]);

    if (!template || template.categoryId !== category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warm-cream">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-brand-dark mb-4">Template Not Found</h1>
                    <Link to="/templates" className="text-primary hover:underline">Return to Templates</Link>
                </div>
            </div>
        );
    }

    const related = getRelatedTemplates(template.id, template.categoryId, 3);

    return (
        <div className="min-h-screen bg-warm-cream font-sans selection:bg-primary/40 pb-24">
            <EventBanner />
            <SEO
              title={`${template?.name || 'Website Template'} — AdHello.ai Contractor Templates`}
              description={`Preview the ${template?.name || ''} website template by AdHello.ai — built for local home service contractors with SEO and GEO optimization.`}
              canonical={`${SITE_ORIGIN}/templates/${category}/${templateId}`}
            />
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-6">
                            <Link to={`/templates/${template.categoryId}`} className="text-brand-dark/50 hover:text-brand-dark transition-colors flex items-center gap-2 font-bold text-sm bg-gray-50 px-4 py-2 rounded-full">
                                <ArrowLeft className="w-4 h-4" />
                                Back to {template.categoryName}
                            </Link>
                            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                            <Logo className="hidden md:flex ml-2" />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank');
                                }}
                                className="bg-primary hover:bg-primary-hover text-brand-dark text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                Start Building
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* SEO Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 mt-8 mb-4">
                <nav className="flex text-sm font-medium text-brand-dark/50">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link to="/templates" className="hover:text-brand-dark transition-colors">Templates</Link>
                        </li>
                        <li><ChevronRight className="w-4 h-4" /></li>
                        <li>
                            <Link to={`/templates/${template.categoryId}`} className="hover:text-brand-dark transition-colors">{template.categoryName}</Link>
                        </li>
                        <li><ChevronRight className="w-4 h-4" /></li>
                        <li className="text-brand-dark" aria-current="page">{template.name}</li>
                    </ol>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                {/* Left Column: Massive Image Gallery */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Stage */}
                    <div className="bg-white rounded-[2rem] p-2 border border-gray-100 shadow-xl overflow-hidden relative group">
                        <div className="absolute top-4 left-4 flex gap-2 z-10">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md text-brand-dark text-xs font-bold rounded-lg shadow-sm border border-gray-100">
                                <Monitor className="w-3.5 h-3.5 text-blue-500" /> Desktop
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md text-brand-dark text-xs font-bold rounded-lg shadow-sm border border-gray-100">
                                <Smartphone className="w-3.5 h-3.5 text-gray-400" /> Mobile Opt
                            </span>
                        </div>
                        <img
                            src={template.images[activeImage]}
                            alt={`${template.name} screenshot view ${activeImage + 1}`}
                            className="w-full h-auto rounded-[1.5rem] object-top"
                        />
                    </div>

                    {/* Thumbnails (if multiple pages exist) */}
                    {template.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {template.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'}`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-top" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                        <span className="text-white text-xs font-bold">Page {idx + 1}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Long form SEO Content area */}
                    <div className="prose prose-lg max-w-none text-brand-dark/80 bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm mt-12">
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-6">Why the {template.name} Converts</h2>
                        <p className="lead text-xl mb-8 leading-relaxed">
                            {template.fullDescription}
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-12">
                            <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                                <h3 className="text-brand-dark font-bold flex items-center gap-2 mb-3">
                                    <Zap className="w-5 h-5 text-yellow-500" /> SEO Optimized Structure
                                </h3>
                                <p className="text-sm">Built with semantic HTML, automatic schema markup, and rapid-load architecture to rank higher in local search results.</p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <h3 className="text-brand-dark font-bold flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Mobile-First Indexing
                                </h3>
                                <p className="text-sm">Over 70% of local service queries happen on phones. This template provides a frictionless, app-like experience on mobile.</p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-brand-dark mb-4">Core Conversion Features:</h3>
                        <ul className="space-y-4">
                            {template.features.map((feat, idx) => (
                                <li key={idx} className="flex gap-4 my-2">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                                        <IconComponent name={feat.icon} className="w-4 h-4 text-brand-dark" />
                                    </div>
                                    <div>
                                        <strong className="block text-brand-dark">{feat.title}</strong>
                                        <span className="text-brand-dark/70 text-sm">{feat.description}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Sticky Conversion & Nav Panel */}
                <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-8">
                    <div className="bg-brand-dark text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>

                        <h1 className="text-4xl font-extrabold mb-4 relative z-10 leading-tight">{template.name}</h1>
                        <div className="flex gap-2 flex-wrap mb-6 relative z-10">
                            {template.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-white/10 text-white/90 text-xs font-bold uppercase tracking-wider rounded border border-white/5">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <ul className="space-y-4 mb-8 relative z-10 text-white/80 font-medium">
                            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Done-for-you copywriting</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Free hosting included</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> AI Webchat installed</li>
                        </ul>

                        <button
                            onClick={() => {
                                window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank');
                            }}
                            className="w-full py-4 bg-primary hover:bg-primary-hover text-brand-dark font-extrabold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 relative z-10"
                        >
                            <Star className="w-5 h-5 fill-brand-dark" /> Build with this Design
                        </button>

                        <p className="text-center text-xs text-white/40 mt-6 font-medium relative z-10">
                            No credit card required. Cancel anytime.
                        </p>
                    </div>

                    {/* Related Templates Cross-Sell */}
                    {related.length > 0 && (
                        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-brand-dark mb-4 px-2">More for {template.categoryName}</h4>
                            <div className="space-y-4">
                                {related.map(rel => (
                                    <Link to={`/templates/${rel.categoryId}/${rel.id}`} key={rel.id} className="flex gap-4 group p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                        <img src={rel.images[0]} className="w-20 h-20 rounded-lg object-cover border border-gray-200" alt={rel.name} />
                                        <div className="flex flex-col justify-center">
                                            <span className="font-bold text-brand-dark group-hover:text-primary-dark transition-colors line-clamp-1">{rel.name}</span>
                                            <span className="text-xs text-brand-dark/50 mt-1">{rel.images.length} Page{rel.images.length > 1 ? 's' : ''}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
