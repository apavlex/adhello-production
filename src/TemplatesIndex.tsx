import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, LayoutTemplate, Star, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TEMPLATES, CATEGORIES, getTemplatesByCategory } from './data/templates';
import SEO from './components/SEO';
import { EventBanner } from './components/EventBanner';

export default function TemplatesIndex() {
    const { category = 'all' } = useParams();
    const navigate = useNavigate();
    const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});

    const displayedTemplates = getTemplatesByCategory(category);

    // Derive dynamic headings based on the category
    const categoryData = CATEGORIES.find(c => c.id === category);
    const displayTitle = category === 'all'
        ? "Choose Your Growth Engine"
        : `High-Converting ${categoryData?.name || ''} Website Templates`;

    const displaySubtitle = category === 'all'
        ? "We don't do 'brochure' websites. Every design is built from the ground up to rank on Google, capture leads 24/7, and turn visitors into booked jobs."
        : `Stop bleeding leads to your competitors. Explore our battle-tested, SEO-optimized website templates designed specifically for ${categoryData?.name?.toLowerCase() || 'local contractors'}.`;

    const handleCategoryChange = (newCategory: string) => {
        if (newCategory === 'all') {
            navigate('/templates');
        } else {
            navigate(`/templates/${newCategory}`);
        }
    };

    const nextImage = (e: React.MouseEvent, templateId: string, maxImages: number) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveImageIndices(prev => ({
            ...prev,
            [templateId]: ((prev[templateId] || 0) + 1) % maxImages
        }));
    };

    const prevImage = (e: React.MouseEvent, templateId: string, maxImages: number) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveImageIndices(prev => ({
            ...prev,
            [templateId]: ((prev[templateId] || 0) - 1 + maxImages) % maxImages
        }));
    };

    const templatesSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "url": "https://adhello.ai/templates",
      "name": "Contractor Website Templates — AdHello.ai",
      "description": "Browse website templates built for home service businesses. SEO and GEO optimized to rank on Google and AI search engines.",
      "isPartOf": { "@id": "https://adhello.ai/#website" }
    };

    return (
        <div className="min-h-screen bg-warm-cream font-sans selection:bg-primary/40 pb-24">
            <EventBanner />
            <SEO
              title="Website Templates for Home Service Contractors — AdHello.ai"
              description="Browse professionally designed website templates for painters, electricians, plumbers, HVAC, roofers, flooring and movers. SEO and GEO optimized out of the box."
              canonical="https://adhello.ai/templates"
              schema={templatesSchema}
            />
            {/* Header */}
            <header data-nav="main" className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-[100] transition-[top] duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-6">
                            <Link to="/" className="text-brand-dark/50 hover:text-brand-dark transition-colors flex items-center gap-2 font-bold text-sm bg-gray-50 px-4 py-2 rounded-full">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Link>
                            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                            <img src="/logo-light.png" alt="AdHello.ai Logo" className="h-8 w-auto hidden md:block" />
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

            {/* Hero */}
            <section className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-bold mb-6 border border-yellow-200">
                        <LayoutTemplate className="w-4 h-4" />
                        {category === 'all' ? 'All Templates' : `${categoryData?.name || 'Industry'} Templates`}
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight">
                        {displayTitle}
                    </h1>
                    <p className="text-xl text-brand-dark/70 leading-relaxed max-w-2xl mx-auto font-medium">
                        {displaySubtitle}
                    </p>
                </div>
            </section>

            {/* Category Filters */}
            <section className="max-w-7xl mx-auto px-4 mb-16">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${category === cat.id
                                    ? 'bg-brand-dark text-white shadow-md'
                                    : 'bg-white text-brand-dark border border-gray-200 hover:border-brand-dark/30 hover:bg-gray-50'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="px-4 max-w-7xl mx-auto">
                {displayedTemplates.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-2xl font-bold text-brand-dark mb-2">More templates coming soon!</h3>
                        <p className="text-brand-dark/60">We are currently migrating our designs into this new showcase.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {displayedTemplates.map((template) => {
                            const hasMultipleImages = template.images.length > 1;
                            const currentIndex = activeImageIndices[template.id] || 0;

                            return (
                                <Link
                                    to={`/templates/${template.categoryId}/${template.id}`}
                                    key={template.id}
                                    className="group bg-white rounded-[2rem] p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgba(243,221,109,0.15)] hover:border-primary/50 transition-all duration-500 flex flex-col h-full cursor-pointer"
                                >
                                    {/* Image Display */}
                                    <div className="relative rounded-[1.5rem] overflow-hidden bg-gray-50 border border-gray-100 aspect-[16/10] mb-6">
                                        <img
                                            src={template.images[currentIndex]}
                                            alt={`${template.name} preview`}
                                            className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                                        />

                                        {/* Gradient Overlay for Text Readability if needed, or simple hover state */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-brand-dark/0 to-brand-dark/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* View Details Pill */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-white text-brand-dark font-bold text-sm rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 whitespace-nowrap">
                                            View Full Details
                                        </div>

                                        {/* Navigation for multiple images */}
                                        {hasMultipleImages && (
                                            <div className="absolute top-4 right-4 flex gap-2 z-30">
                                                <button
                                                    onClick={(e) => prevImage(e, template.id, template.images.length)}
                                                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-brand-dark hover:bg-primary transition-colors hover:scale-105"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <div className="h-10 bg-white/90 backdrop-blur shadow-md rounded-full px-4 flex items-center justify-center text-sm font-bold text-brand-dark">
                                                    {currentIndex + 1} / {template.images.length}
                                                </div>
                                                <button
                                                    onClick={(e) => nextImage(e, template.id, template.images.length)}
                                                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-brand-dark hover:bg-primary transition-colors hover:scale-105"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Template Details */}
                                    <div className="px-2 flex flex-col flex-grow">
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            {template.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-gray-100 text-brand-dark/70 text-xs font-bold uppercase tracking-wider rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h2 className="text-2xl font-extrabold text-brand-dark mb-2 group-hover:text-primary-dark transition-colors">{template.name}</h2>
                                        <p className="text-brand-dark/60 text-base leading-relaxed mb-6 font-medium line-clamp-2">
                                            {template.shortDescription}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-sm font-bold text-brand-dark/50 hover:text-brand-dark transition-colors flex items-center gap-1">
                                                Designed for {template.categoryName} <ChevronRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Call to Action */}
            <div className="max-w-4xl mx-auto px-4 mt-24">
                <div className="bg-primary rounded-[3rem] p-12 text-center shadow-xl">
                    <h2 className="text-3xl font-extrabold text-brand-dark mb-4">Don't see exactly what you need?</h2>
                    <p className="text-brand-dark/80 text-lg mb-8 font-medium max-w-xl mx-auto">
                        These are just starting points. We customize every site to match your brand colors, services, and voice perfectly.
                    </p>
                    <button
                        onClick={() => {
                            window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank');
                        }}
                        className="bg-white hover:bg-gray-50 text-brand-dark font-bold py-4 px-10 rounded-full transition-all shadow-sm"
                    >
                        Talk to our team
                    </button>
                </div>
            </div>
        </div>
    );
}
