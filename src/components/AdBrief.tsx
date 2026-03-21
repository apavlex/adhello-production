import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  BarChart3, 
  Target, 
  Lightbulb, 
  CheckCircle2,
  Instagram,
  Facebook,
  Music,
  Copy,
  X,
  TrendingUp,
  FileText,
  Loader2,
  Share2,
  Download,
  Check
} from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.38 6.38 0 0 1-1.87-1.5c-.02 3.14-.03 6.28-.04 9.42-.01 1.05-.09 2.1-.44 3.1-.58 1.73-2.02 3.18-3.72 3.79-1.7.61-3.62.54-5.26-.25-1.64-.79-2.92-2.36-3.41-4.12-.49-1.75-.22-3.68.75-5.23.97-1.55 2.59-2.62 4.4-2.81.18-.02.36-.03.54-.03v4.09c-.31.03-.63.08-.93.17-1.14.34-2.02 1.41-2.14 2.6-.12 1.19.46 2.41 1.45 3.07.99.66 2.32.74 3.4.2.98-.49 1.63-1.54 1.75-2.62.12-1.12.11-2.24.11-3.36V.02z"/>
  </svg>
);

interface AdBriefData {
  productAnalysis: string;
  visualPrompt: string;
  targetAudience: string[];
  marketInsights: string[];
  competitiveAdvantages: string[];
  adConcepts: {
    platform: string;
    headline: string;
    body: string;
    cta: string;
  }[];
}

export function AdBrief() {
  const [briefStep, setBriefStep] = useState<'gate' | 'upload' | 'analyzing' | 'results'>(
    () => 'upload'
  );
  const [gateName, setGateName] = useState('');
  const [gateEmail, setGateEmail] = useState('');
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [briefData, setBriefData] = useState<AdBriefData | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const [approvedAdIndex, setApprovedAdIndex] = useState<number | null>(null);
  const [generatedAds, setGeneratedAds] = useState<Record<number, string>>({});
  const [generatingAd, setGeneratingAd] = useState<number | null>(null);

  const handleShare = async () => {
    const shareData = {
      title: 'Ad Brief Report',
      text: `Check out this AI-generated ad brief for my product!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDownload = async () => {
    if (!reportRef.current || !briefData) return;
    
    setIsDownloading(true);
    try {
      const element = reportRef.current;
      const opt = {
        margin: [10, 10] as [number, number],
        filename: `Ad-Brief-${briefData.productAnalysis?.substring(0, 20).replace(/\s+/g, '-') || 'report'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc: Document) => {
            // Remove oklch color functions which html2canvas doesn't support
            const elements = clonedDoc.getElementsByTagName('*');
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i] as HTMLElement;
              const style = window.getComputedStyle(el);
              
              ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
                const val = (el.style as any)[prop] || style.getPropertyValue(prop);
                if (val && val.includes('oklch')) {
                  if (prop === 'color') el.style.color = '#2d3436';
                  if (prop === 'backgroundColor') el.style.backgroundColor = 'transparent';
                  if (prop === 'borderColor') el.style.borderColor = '#eeeeee';
                }
              });
            }
          }
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert("PDF generation failed. Opening print dialog as a fallback...");
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateName.trim() || !gateEmail.trim()) return;
    setGateSubmitting(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: gateName, email: gateEmail, source: 'ad-brief' })
      });
    } catch (_) {}
    sessionStorage.setItem('adhello-gate-passed', '1');
    setGateSubmitting(false);
    setBriefStep('upload');
  };

  const generateAdImage = async (adIndex: number, ad: { platform: string; headline: string; body: string; cta: string }) => {
    if (!selectedImage) return;
    setGeneratingAd(adIndex);
    try {
      // Extract base64 from data URL
      const parts = selectedImage.split(',');
      const base64 = parts[1];
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      // Pick a random ad style for variety
      const adStyles = [
        `lifestyle scene with a real person using or holding the product in a natural environment. Use the uploaded product image as the product shown. Add bold headline text "${ad.headline}" at the top in large white font with a dark background strip. Include 3 bullet benefit points on the side. CTA button "${ad.cta}" at the bottom in a contrasting color. Style: scroll-stopping social ad.`,
        `split composition: product on one side against a clean colored background, lifestyle element on the other side. Overlaid bold stat or claim text. Headline "${ad.headline}" in large modern typography. Small body copy "${ad.body}". CTA "${ad.cta}" as a pill button. Clean, premium DTC brand aesthetic.`,
        `full bleed lifestyle photo with the product prominently featured. Person in the background or foreground interacting with it. Large oversized headline "${ad.headline}" overlaid with semi-transparent backing. "${ad.body}" as subtext. Bold "${ad.cta}" button. Style similar to Athletic Greens or Lemme ads.`,
        `flat lay or product-hero shot with styled props and background that matches the product's vibe. Large bold typography "${ad.headline}" taking up top third. Clean stats or benefit callouts with icons. "${ad.cta}" button styled as a modern pill. Feels like a premium Instagram ad.`,
        `phone-screen style creative optimized for ${ad.platform}. Product shown in use by a person in a relatable everyday moment. Hook text "${ad.headline}" at top in bold. "${ad.body}" as supporting copy mid-frame. Bright "${ad.cta}" CTA button at bottom. High contrast, scroll-stopping design.`
      ];
      const chosenStyle = adStyles[Math.floor(Math.random() * adStyles.length)];

      const prompt = `You are a world-class ad creative designer. Create a high-quality ${ad.platform} advertisement image using the uploaded product photo as the featured product.

STYLE DIRECTION: ${chosenStyle}

CRITICAL RULES:
- The uploaded product must appear clearly and prominently in the final image — do not replace or obscure it
- Use the product's actual appearance, colors, and branding from the uploaded image
- PROPORTION IS CRITICAL: maintain 100% accurate real-world scale — a 12oz cup must look like a 12oz cup when held by a human hand, a bottle must fit naturally in a palm, packaging must be its true physical size relative to hands, tables, and people. Never make products oversized or disproportionate
- If a person holds the product, their hand size must be anatomically correct relative to the product size
- Generate a realistic lifestyle scene or styled composition AROUND the product
- Include real people if the style calls for it (diverse, relatable, not stock-photo looking)
- Typography must be bold, large, and legible — not thin or small
- The overall image must look like a real paid ad from a top DTC brand, not a mockup
- Aspect ratio: square (1:1) for ${ad.platform === 'Instagram' ? 'Instagram feed' : ad.platform === 'Facebook' ? 'Facebook feed' : 'Google display'}
- Quality: photorealistic, high-resolution, professionally lit`;

      const res = await fetch('/api/generate-ad-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageBase64: base64, imageMimeType: mime })
      });
      const data = await res.json();
      if (data.imageBase64) {
        setGeneratedAds(prev => ({ ...prev, [adIndex]: `data:${data.mimeType};base64,${data.imageBase64}` }));
      }
    } catch (err) {
      console.error('Ad generation failed:', err);
    }
    setGeneratingAd(null);
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;

    setBriefStep('analyzing');
    setAnalysisProgress(10);

    try {
      // Extract base64 + mime type from the data URL
      const [header, base64Data] = selectedImage.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';

      setAnalysisProgress(30);

      // Call the server-side endpoint (which has access to GEMINI_API_KEY at runtime)
      const response = await fetch('/api/ad-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, mimeType })
      });

      setAnalysisProgress(75);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Server error' }));
        throw new Error(err.error || `Server error ${response.status}`);
      }

      const data = await response.json();
      setBriefData(data);

      setAnalysisProgress(100);
      setTimeout(() => setBriefStep('results'), 500);

    } catch (error: any) {
      console.error("Analysis failed:", error);
      alert(`Analysis failed: ${error.message}`);
      setBriefStep('upload');
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-500">

      {/* ── GATE ── */}
      {briefStep === 'gate' && (
        <div className="max-w-lg mx-auto animate-in fade-in duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 bg-primary/10 text-brand-dark">
              <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Free AI Ad Brief
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-brand-dark leading-tight">
              Launch Your <span className="text-primary">Ad Strategy</span><br />in Seconds
            </h2>
            <p className="text-base text-brand-dark/60 leading-relaxed">
              Upload one photo and our AI builds your complete market brief, target audiences, and platform-ready ad creatives — free.
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-xl rounded-[2.5rem] p-8">
            <form onSubmit={handleGateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-brand-dark/50">Business Name</label>
                <input
                  type="text"
                  value={gateName}
                  onChange={e => setGateName(e.target.value)}
                  placeholder="e.g. Portland Pro Plumbing"
                  className="w-full rounded-2xl py-3.5 px-5 font-medium border bg-gray-50 text-brand-dark border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-brand-dark/50">Email Address</label>
                <input
                  type="email"
                  value={gateEmail}
                  onChange={e => setGateEmail(e.target.value)}
                  placeholder="you@yourbusiness.com"
                  className="w-full rounded-2xl py-3.5 px-5 font-medium border bg-gray-50 text-brand-dark border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={gateSubmitting}
                className="w-full bg-primary hover:bg-primary-hover text-brand-dark font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-60 text-base"
              >
                {gateSubmitting ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                )}
                {gateSubmitting ? 'Getting ready...' : 'Generate My Free Ad Brief →'}
              </button>
              <p className="text-center text-xs text-brand-dark/40">No credit card. No spam. Just your ads.</p>
            </form>
          </div>
        </div>
      )}

      {briefStep === 'upload' && (
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-brand-dark">
            Launch Your <span className="text-primary">Ad Strategy</span> in Seconds
          </h2>
          <p className="text-lg md:text-xl text-brand-dark/70 mb-6 max-w-2xl mx-auto leading-relaxed">
            Upload one photo and let our AI build your complete market brief, target audiences, and platform-ready ad creatives.
          </p>

          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-yellow-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 transition-all hover:border-primary/50 shadow-xl">
              {selectedImage ? (
                <div className="relative inline-block">
                  <img src={selectedImage} alt="Preview" className="max-h-[400px] rounded-2xl shadow-2xl" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-xl hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <span className="text-2xl font-bold mb-2 text-brand-dark">Drop your product photo here</span>
                  <span className="text-brand-dark/40">or click to browse files</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {selectedImage && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={startAnalysis}
              className="mt-10 bg-primary hover:bg-primary-hover text-brand-dark px-10 py-5 rounded-full font-black text-xl flex items-center gap-3 mx-auto transition-all hover:scale-105 shadow-2xl shadow-primary/20"
            >
              <Sparkles className="w-6 h-6" />
              Analyze & Generate Ads
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-brand-dark">Market Analysis</h4>
              <p className="text-brand-dark/60 text-sm">Identify target audiences and positioning</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-brand-dark">Competitive Insights</h4>
              <p className="text-brand-dark/60 text-sm">Discover your unique advantages</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-brand-dark">Ready-to-Use Ads</h4>
              <p className="text-brand-dark/60 text-sm">Generate platform-specific ad creatives</p>
            </div>
          </div>
        </div>
      )}

      {briefStep === 'analyzing' && (
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="relative w-48 h-48 mx-auto mb-12">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-primary stroke-current transition-all duration-300"
                strokeWidth="4"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="48"
                fill="transparent"
                strokeDasharray={`${analysisProgress * 3.0159} 301.59`}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border border-gray-50">
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold mb-4 text-brand-dark">Analyzing your product...</h2>
          <p className="text-brand-dark/60 text-xl mb-12">Our AI is studying your image to create the perfect ads</p>

          <div className="space-y-4 max-w-sm mx-auto">
            <div className="flex items-center gap-3 text-left">
              {analysisProgress > 30 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 animate-spin border-t-primary"></div>}
              <span className={`font-bold ${analysisProgress > 30 ? 'text-brand-dark' : 'text-brand-dark/40'}`}>Identifying product features</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              {analysisProgress > 60 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 animate-spin border-t-primary"></div>}
              <span className={`font-bold ${analysisProgress > 60 ? 'text-brand-dark' : 'text-brand-dark/40'}`}>Analyzing market positioning</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              {analysisProgress > 90 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 animate-spin border-t-primary"></div>}
              <span className={`font-bold ${analysisProgress > 90 ? 'text-brand-dark' : 'text-brand-dark/40'}`}>Generating ad concepts</span>
            </div>
          </div>
        </div>
      )}

      {briefStep === 'results' && (
        <div ref={reportRef} className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <img src={selectedImage || ''} alt="Product" className="w-12 h-12 object-cover rounded-lg" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-brand-dark">Ad Brief</h2>
                <p className="text-brand-dark/40 font-medium">Market research and ad concepts for your product</p>
              </div>
            </div>
            <div className="flex items-center gap-4 print:hidden">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border border-gray-100 bg-white text-brand-dark/60 hover:text-primary shadow-sm transition-all"
              >
                {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                {copySuccess ? 'Link Copied!' : 'Share Report'}
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border border-gray-100 bg-white text-brand-dark/60 hover:text-primary shadow-sm transition-all disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isDownloading ? 'Generating...' : 'Download Report'}
              </button>
              <button 
                onClick={() => setBriefStep('upload')}
                className="flex items-center gap-2 text-brand-dark/60 hover:text-brand-dark transition-colors font-bold"
              >
                <RotateCcw className="w-5 h-5" />
                Start Over
              </button>
            </div>
          </div>



          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-bold text-brand-dark">Product Analysis</h3>
                    </div>
                    <p className="text-brand-dark/70 text-lg leading-relaxed font-medium">
                      {briefData?.productAnalysis}
                    </p>
                  </div>

                  <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <Target className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-bold text-brand-dark">Target Audience</h3>
                    </div>
                    <ul className="space-y-4">
                      {briefData?.targetAudience.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                          <span className="text-brand-dark/70 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <Lightbulb className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-bold text-brand-dark">Market Insights</h3>
                    </div>
                    <ul className="space-y-4">
                      {briefData?.marketInsights.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-1" />
                          <span className="text-brand-dark/70 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-bold text-brand-dark">Competitive Advantages</h3>
                    </div>
                    <ul className="space-y-4">
                      {briefData?.competitiveAdvantages.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                          <span className="text-brand-dark/70 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-brand-dark">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Recommended Platforms
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {['Instagram', 'Facebook', 'TikTok'].map((platform) => (
                      <div key={platform} className="bg-warm-cream px-6 py-3 rounded-2xl border border-brand-dark/5 font-bold text-brand-dark">
                        {platform}
                      </div>
                    ))}
                  </div>
                </div>
            </motion.div>

            {/* Ad Concepts — shown below insights */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl"
            >
                <h3 className="text-2xl font-bold mb-8 text-brand-dark">Ad Brief</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {briefData?.adConcepts.map((ad, i) => (
                    <div 
                      key={i} 
                      className={`bg-gray-50 rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col shadow-sm relative ${
                        approvedAdIndex === i 
                          ? 'border-green-500 ring-4 ring-green-500/10 scale-[1.02] bg-green-50/30' 
                          : 'border-gray-100 hover:border-primary/30'
                      }`}
                    >
                      {approvedAdIndex === i && (
                        <div className="absolute top-4 right-4 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg animate-in zoom-in duration-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </div>
                      )}
                      <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        <img
                          src={generatedAds[i] || selectedImage || ''}
                          alt="Ad"
                          className="w-full h-full object-cover transition-all duration-500"
                        />
                        {generatingAd === i ? (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin border-[3px]" />
                            <span className="text-white text-xs font-bold">Creating ad...</span>
                          </div>
                        ) : generatedAds[i] ? (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-between px-3 pb-3 print:hidden">
                            <span className="text-white text-[10px] font-bold px-2 py-1 bg-green-500/80 backdrop-blur-sm rounded-full">✓ AI Generated</span>
                            <button onClick={() => generateAdImage(i, ad)} className="text-white text-[10px] font-bold px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">Regenerate</button>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end pb-4 gap-2 print:hidden">
                            <button
                              onClick={() => generateAdImage(i, ad)}
                              className="flex items-center gap-1.5 bg-primary text-brand-dark text-xs font-black px-4 py-2 rounded-full hover:bg-primary-hover transition-all shadow-lg hover:-translate-y-0.5"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Create Ad with AI
                            </button>
                            <span className="text-white/60 text-[10px]">Nano Banana 2</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-4">
                          {ad.platform === 'Instagram' ? <Instagram className="w-5 h-5" /> : ad.platform === 'Facebook' ? <Facebook className="w-5 h-5" /> : <TikTokIcon className="w-5 h-5" />}
                          {ad.platform}
                        </div>
                        <h4 className="text-xl font-bold mb-2 text-brand-dark">{ad.headline}</h4>
                        <p className="text-brand-dark/80 text-base leading-relaxed mb-6 flex-grow font-medium">{ad.body}</p>
                        <div className="flex flex-col gap-3 print:hidden">
                          <div className="flex items-center gap-2">
                            <button className="flex-grow bg-primary hover:bg-primary-hover text-brand-dark px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                              {ad.cta}
                            </button>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`${ad.headline}\n\n${ad.body}`);
                              }}
                              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-brand-dark border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                            >
                              <Copy className="w-4 h-4" />
                              Copy
                            </button>
                          </div>
                          {generatedAds[i] ? (
                            <button
                              onClick={() => {
                                const a = document.createElement('a');
                                a.href = generatedAds[i];
                                a.download = `ad-${ad.platform.toLowerCase()}-${ad.headline.replace(/\s+/g, '-').toLowerCase()}.png`;
                                a.click();
                              }}
                              className="w-full py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border bg-brand-dark text-white border-brand-dark hover:bg-black"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                              Download Ad
                            </button>
                          ) : (
                            <button
                              onClick={() => setApprovedAdIndex(approvedAdIndex === i ? null : i)}
                              className={`w-full py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
                                approvedAdIndex === i
                                  ? 'bg-green-500 text-white border-green-500'
                                  : 'bg-white text-brand-dark/60 border-gray-100 hover:border-green-500/30 hover:text-green-600'
                              }`}
                            >
                              {approvedAdIndex === i ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                              {approvedAdIndex === i ? 'Approved' : 'Approve Concept'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
          </div>

          <div className="text-center py-12 print:hidden">
            <h3 className="text-3xl font-extrabold mb-4 text-brand-dark">Ready to create more?</h3>
            <p className="text-brand-dark/40 mb-8 font-bold">Start your 7-day free trial to unlock unlimited ad generation and save your work</p>
            <button 
              onClick={() => window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank')}
              className="bg-primary hover:bg-primary-hover text-brand-dark px-10 py-5 rounded-full font-black text-xl transition-all hover:scale-105 shadow-xl shadow-primary/20"
            >
              Start 7-Day Free Trial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
