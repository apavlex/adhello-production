const portlandProBlue = '/templates/template-portland-pro-blue.png';
const portlandProYellow = '/templates/template-portland-pro-yellow.png';
const portlandElectricHome = '/templates/template-portland-electric-home.png';
const portlandElectricServices = '/templates/template-portland-electric-services.png';
const portlandElectricQuote = '/templates/template-portland-electric-quote.png';

const plumbingLight = '/templates/template-plumbing-light.png';
const proPlumb = '/templates/template-proplumb.png';
const joesHome = '/templates/template-joes-home.png';
const joesEmergency = '/templates/template-joes-emergency.png';
const joesDashboard = '/templates/template-joes-dashboard.png';

const roofingLight = '/templates/template-roofing-light.png';
const roofingEmergency = '/templates/template-roofing-emergency.png';
const roofingCorporate = '/templates/template-roofing-corporate.png';
const roofingDashboard = '/templates/template-roofing-dashboard.png';
const roofingHome = '/templates/template-roofing-home.png';

export interface TemplateFeature {
    icon: string; // lucide-react icon name as a string, e.g., 'ShieldCheck'
    title: string;
    description: string;
}

export interface Template {
    id: string;
    name: string;
    categoryId: string; // The URL slug for the category (e.g., 'electrician', 'plumbing')
    categoryName: string; // Display name (e.g., 'Electricians', 'Plumbers')
    shortDescription: string;
    fullDescription: string;
    images: string[]; // Array of imported image paths
    tags: string[];
    features: TemplateFeature[];
    seoKeywords: string[];
    seoDescription: string;
}

// Ensure this matches the categories used in the actual templates
export const CATEGORIES = [
    { id: 'all', name: 'All Trades' },
    { id: 'electrician', name: 'Electricians' },
    { id: 'plumbing', name: 'Plumbers' },
    { id: 'roofing', name: 'Roofers' },
    // Future categories:
    // { id: 'hvac', name: 'HVAC' },
];

export const TEMPLATES: Template[] = [
    {
        id: 'portland-pro-light',
        name: 'Portland Pro (Light Edition)',
        categoryId: 'electrician',
        categoryName: 'Electricians',
        shortDescription: 'A clean, modern light theme optimized for high trust and quick conversions. Perfect for established local brands.',
        fullDescription: 'The Portland Pro Light Edition is designed specifically for established residential electrical contractors who want to project a clean, highly professional image. Light themes inherently build trust through a "clean" aesthetic, mimicking the feeling of a well-lit, organized workspace. This template prioritizes trust signals (badges, reviews) above the fold, ensuring visitors immediately feel confident in your services.',
        images: [portlandProBlue],
        tags: ['High Trust', 'Clean', 'Service-First'],
        seoKeywords: ['electrician website template', 'electrical contractor web design', 'light theme local business site', 'high conversion electrician site'],
        seoDescription: 'Discover the Portland Pro Light Edition website template, designed specifically for electrical contractors looking to build trust and increase local leads.',
        features: [
            {
                icon: 'ShieldCheck',
                title: 'Prominent Trust Badges',
                description: 'Instantly display licensing, bonding, and insurance information to establish credibility before they even scroll.'
            },
            {
                icon: 'Zap',
                title: 'Emergency Service CTA',
                description: 'A dedicated, high-contrast button specifically routing emergency calls for immediate dispatch.'
            },
            {
                icon: 'MessageSquare',
                title: 'Integrated Webchat',
                description: 'Turn passive visitors into active leads with our 24/7 AI-powered chat system built right into the design.'
            }
        ]
    },
    {
        id: 'portland-pro-dark',
        name: 'Portland Pro (Dark Edition)',
        categoryId: 'electrician',
        categoryName: 'Electricians',
        shortDescription: 'A bold, high-contrast dark theme designed to stand out. Emphasizes urgency and 24/7 availability.',
        fullDescription: 'For electrical businesses focusing on fast response times and 24/7 emergency services, the Portland Pro Dark Edition delivers a bold, urgent aesthetic. Dark mode designs reduce eye strain and make high-contrast "Call Now" buttons pop spectacularly. This template uses striking neon yellow accents against deep charcoal backgrounds to command attention and drive immediate phone calls.',
        images: [portlandProYellow],
        tags: ['High Conversion', 'Bold', 'Emergency Focus'],
        seoKeywords: ['dark theme electrician website', 'emergency electrician template', 'high contrast contractor site', 'local service dark mode design'],
        seoDescription: 'Stand out from competitors with the Portland Pro Dark Edition template. Specifically engineered to drive emergency electrical service calls.',
        features: [
            {
                icon: 'PhoneCall',
                title: 'Urgent Call-to-Actions',
                description: 'High-contrast neon primary buttons that draw the eye immediately to your dispatch number.'
            },
            {
                icon: 'Moon',
                title: 'Sleek Dark Aesthetic',
                description: 'A modern, premium look that differentiates your brand from the standard white/blue contractor templates.'
            },
            {
                icon: 'Clock',
                title: '24/7 Focus Area',
                description: 'Dedicated hero section emphasizing round-the-clock availability for emergency repairs.'
            }
        ]
    },
    {
        id: 'portland-electric-multi',
        name: 'Portland Electric (Full Suite)',
        categoryId: 'electrician',
        categoryName: 'Electricians',
        shortDescription: 'A comprehensive multi-page experience showcasing exactly how a customer interacts with your brand from homepage to getting a quote.',
        fullDescription: 'The Portland Electric Full Suite is our most comprehensive setup, designed for larger electrical contractors offering a wide array of residential, commercial, and industrial services. This template demonstrates a deep, multi-page architecture that is crucial for advanced local SEO. It features a stunning homepage, a detailed services directory page, and a streamlined, conversion-optimized multi-step quote request system that pre-qualifies your leads.',
        images: [portlandElectricHome, portlandElectricServices, portlandElectricQuote],
        tags: ['Multi-Page', 'Dashboard', 'Detailed Services'],
        seoKeywords: ['multi page electrician website', 'comprehensive electrical contractor site', 'SEO optimized trade website', 'lead generation web design'],
        seoDescription: 'Explore the full suite of Portland Electric templates. Includes homepage, service directories, and custom quoting workflows for serious contractors.',
        features: [
            {
                icon: 'Layers',
                title: 'Deep Page Architecture',
                description: 'Dedicated pages for every service you offer, maximizing your chances of ranking for specific long-tail local searches.'
            },
            {
                icon: 'ClipboardList',
                title: 'Multi-Step Quoting',
                description: 'A friction-less quote request flow that gathers necessary project details without overwhelming the visitor.'
            },
            {
                icon: 'LayoutDashboard',
                title: 'Client Portal Ready',
                description: 'Designed seamlessly to integrate with CRMs or backend dashboards for managing incoming jobs.'
            }
        ]
    },
    {
        id: 'joes-plumbing-light',
        name: "Joe's Plumbing (Light Edition)",
        categoryId: 'plumbing',
        categoryName: 'Plumbers',
        shortDescription: 'A clean, modern light theme optimized for high trust. Perfect for established local plumbing brands.',
        fullDescription: 'The Joe\'s Plumbing Light Edition is designed specifically for established residential plumbing contractors who want to project a clean, highly professional image. Light themes inherently build trust through a "clean" aesthetic. This template prioritizes trust signals (badges, reviews) above the fold.',
        images: [plumbingLight],
        tags: ['High Trust', 'Clean', 'Service-First'],
        seoKeywords: ['plumber website template', 'plumbing contractor web design', 'light theme local business site', 'high conversion plumber site'],
        seoDescription: 'Discover the Joe\'s Plumbing Light Edition website template, designed specifically for plumbing contractors looking to build trust and increase local leads.',
        features: [
            {
                icon: 'ShieldCheck',
                title: 'Prominent Trust Badges',
                description: 'Instantly display licensing, bonding, and insurance information to establish credibility before they even scroll.'
            },
            {
                icon: 'Droplets',
                title: 'Emergency Service CTA',
                description: 'A dedicated button specifically routing emergency calls for immediate dispatch.'
            },
            {
                icon: 'CheckCircle2',
                title: 'Upfront Pricing',
                description: 'Highlight transparent pricing policies to build customer confidence immediately.'
            }
        ]
    },
    {
        id: 'proplumb-services',
        name: 'ProPlumb Services',
        categoryId: 'plumbing',
        categoryName: 'Plumbers',
        shortDescription: 'A professional, corporate-style theme for high-volume residential and commercial plumbers.',
        fullDescription: 'For plumbing businesses focusing on large-scale operations, the ProPlumb Services theme delivers a highly structured, corporate aesthetic. It neatly categorizes a wide array of services from leak detection to bathroom remodels, ensuring visitors find exactly what they need quickly.',
        images: [proPlumb],
        tags: ['Corporate', 'High Volume', 'Comprehensive'],
        seoKeywords: ['commercial plumber website', 'corporate plumbing template', 'comprehensive plumbing site', 'professional contractor design'],
        seoDescription: 'Scale your operations with the ProPlumb Services template. Engineered to organize multiple service lines into a clean, easy-to-navigate experience.',
        features: [
            {
                icon: 'Grid',
                title: 'Service Grids',
                description: 'Organize extensive service offerings with beautifully designed grid layouts.'
            },
            {
                icon: 'Star',
                title: 'Integrated Reviews',
                description: 'Pull in 5-star Google reviews directly onto the homepage to boost conversion rates.'
            },
            {
                icon: 'PhoneCall',
                title: 'Persistent 24/7 Hotline',
                description: 'Ensure your emergency contact number is visible at all times across devices.'
            }
        ]
    },
    {
        id: 'joes-plumbing-multi',
        name: "Joe's Plumbing (Full Suite)",
        categoryId: 'plumbing',
        categoryName: 'Plumbers',
        shortDescription: 'A comprehensive multi-page experience showing homepage, emergency landing page, and a custom marketing dashboard.',
        fullDescription: 'The Joe\'s Plumbing Full Suite is our most comprehensive setup for ambitious plumbing contractors. It features a stunning high-converting homepage, a dedicated dark-themed emergency services landing page, and a custom PlumberPro AI marketing dashboard to help you generate local content.',
        images: [joesHome, joesEmergency, joesDashboard],
        tags: ['Multi-Page', 'Emergency Landing Page', 'AI Dashboard'],
        seoKeywords: ['multi page plumber website', 'emergency plumbing landing page', 'AI marketing for plumbers', 'lead generation plumbing design'],
        seoDescription: 'Explore the full suite of Joe\'s Plumbing templates. Includes homepage, emergency landing pages, and a custom AI content dashboard.',
        features: [
            {
                icon: 'AlertTriangle',
                title: 'Dedicated Emergency Hub',
                description: 'A dark, high-contrast landing page specifically designed to convert stressed customers with burst pipes instantly.'
            },
            {
                icon: 'Brain',
                title: 'PlumberPro AI Dashboard',
                description: 'Your own content strategy dashboard using AI to generate location-specific plumbing blog posts and guides.'
            },
            {
                icon: 'MapPin',
                title: 'Interactive Coverage Maps',
                description: 'Visually demonstrate your exact service areas to reassure local searchers you operate in their neighborhood.'
            }
        ]
    },
    {
        id: 'portland-peak-light',
        name: 'Portland Peak (Light Edition)',
        categoryId: 'roofing',
        categoryName: 'Roofers',
        shortDescription: 'A clean, modern light theme optimized for high trust. Perfect for established local roofing brands.',
        fullDescription: 'The Portland Peak Light Edition is designed specifically for established residential roofing contractors who want to project a clean, highly professional image. Light themes inherently build trust through a "clean" aesthetic. This template prioritizes trust signals (badges, reviews) above the fold.',
        images: [roofingLight],
        tags: ['High Trust', 'Clean', 'Service-First'],
        seoKeywords: ['roofer website template', 'roofing contractor web design', 'light theme local business site', 'high conversion roofer site'],
        seoDescription: 'Discover the Portland Peak Light Edition website template, designed specifically for roofing contractors looking to build trust and increase local leads.',
        features: [
            {
                icon: 'ShieldCheck',
                title: 'Prominent Trust Badges',
                description: 'Instantly display licensing, bonding, and insurance information to establish credibility before they even scroll.'
            },
            {
                icon: 'Home',
                title: 'Comprehensive Solutions',
                description: 'Clearly outline your full range of roofing services designed for your specific climate.'
            },
            {
                icon: 'CheckCircle2',
                title: 'Free Inspection Form',
                description: 'A prominently placed lead-capture form to schedule free roof inspections within 24 hours.'
            }
        ]
    },
    {
        id: 'portland-roofing-co',
        name: 'Portland Roofing Co.',
        categoryId: 'roofing',
        categoryName: 'Roofers',
        shortDescription: 'A professional, corporate-style theme for high-volume residential and commercial roofers.',
        fullDescription: 'For roofing businesses focusing on large-scale operations, the Portland Roofing Co. theme delivers a highly structured, corporate aesthetic. It neatly categorizes a wide array of services from shingle replacement to commercial flat roofs, ensuring visitors find exactly what they need quickly.',
        images: [roofingCorporate],
        tags: ['Corporate', 'High Volume', 'Comprehensive'],
        seoKeywords: ['commercial roofer website', 'corporate roofing template', 'comprehensive roofing site', 'professional contractor design'],
        seoDescription: 'Scale your operations with the Portland Roofing Co. template. Engineered to organize multiple service lines into a clean, easy-to-navigate experience.',
        features: [
            {
                icon: 'Grid',
                title: 'Materials Showcase',
                description: 'Organize extensive material options like architectural shingles and metal roofing with beautifully designed grid layouts.'
            },
            {
                icon: 'Star',
                title: 'Integrated Reviews',
                description: 'Pull in 5-star Google reviews directly onto the homepage to boost conversion rates.'
            },
            {
                icon: 'Building',
                title: 'Recent Projects Gallery',
                description: 'Highlight your best completed projects to provide visual proof of your craftsmanship.'
            }
        ]
    },
    {
        id: 'portland-peak-multi',
        name: 'Portland Peak (Full Suite)',
        categoryId: 'roofing',
        categoryName: 'Roofers',
        shortDescription: 'A comprehensive multi-page experience showing homepage, emergency landing page, and a custom SEO dashboard.',
        fullDescription: 'The Portland Peak Full Suite is our most comprehensive setup for ambitious roofing contractors. It features a stunning high-converting homepage, a dedicated dark-themed emergency services landing page, and a custom Content & SEO dashboard to help you generate local traffic.',
        images: [roofingHome, roofingEmergency, roofingDashboard],
        tags: ['Multi-Page', 'Emergency Landing Page', 'SEO Dashboard'],
        seoKeywords: ['multi page roofer website', 'emergency roofing landing page', 'SEO marketing for roofers', 'lead generation roofing design'],
        seoDescription: 'Explore the full suite of Portland Peak templates. Includes homepage, emergency landing pages, and a custom SEO content dashboard.',
        features: [
            {
                icon: 'AlertTriangle',
                title: 'Dedicated Emergency Hub',
                description: 'A dark, high-contrast landing page specifically designed to convert stressed customers with active roof leaks instantly.'
            },
            {
                icon: 'Brain',
                title: 'SEO Performance Dashboard',
                description: 'Your own content strategy dashboard using AI to generate location-specific roofing blog posts and guides.'
            },
            {
                icon: 'MapPin',
                title: 'Interactive Coverage Maps',
                description: 'Visually demonstrate your exact service areas to reassure local searchers you operate in their neighborhood.'
            }
        ]
    }
];

export const getTemplatesByCategory = (categoryId: string): Template[] => {
    if (categoryId === 'all') return TEMPLATES;
    return TEMPLATES.filter(t => t.categoryId === categoryId);
};

export const getTemplateById = (templateId: string): Template | undefined => {
    return TEMPLATES.find(t => t.id === templateId);
};

export const getRelatedTemplates = (currentTemplateId: string, categoryId: string, limit: number = 2): Template[] => {
    return TEMPLATES
        .filter(t => t.categoryId === categoryId && t.id !== currentTemplateId)
        .slice(0, limit);
};
