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
import { GoogleGenAI, Type } from "@google/genai";
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
  const [briefStep, setBriefStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [resultsTab, setResultsTab] = useState<'insights' | 'concepts'>('insights');
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<number, boolean>>({});
  const [briefData, setBriefData] = useState<AdBriefData | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const [approvedAdIndex, setApprovedAdIndex] = useState<number | null>(null);

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

  const handleGenerateImage = async (index: number, adConcept: any) => {
    if (!briefData) return;
    setIsGenerating(prev => ({ ...prev, [index]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

      const prompt = `Professional advertisement image for ${adConcept.platform}. 
      Product: ${adConcept.headline}. 
      Visual Style: ${briefData.visualPrompt}. 
      The image should be a close visual match to the original product photo but optimized for ${adConcept.platform}. 
      High-end commercial photography, 8k resolution, vibrant lighting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let imageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageUrl) {
        throw new Error("No image was generated by the model.");
      }

      setGeneratedImages(prev => ({ ...prev, [index]: imageUrl }));
    } catch (error: any) {
      console.error("Image generation failed:", error);
      alert(`Image generation failed: ${error.message}`);
    } finally {
      setIsGenerating(prev => ({ ...prev, [index]: false }));
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

  const startAnalysis = async () => {
    if (!selectedImage) return;
    
    setBriefStep('analyzing');
    setAnalysisProgress(10);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      // Extract base64 data
      const base64Data = selectedImage.split(',')[1];
      
      setAnalysisProgress(30);
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data
                }
              },
              {
                text: `Analyze this product image and provide a comprehensive marketing brief. 
                Return the result in strict JSON format with the following structure:
                {
                  "productAnalysis": "A detailed 2-3 sentence description of the product based on the image.",
                  "visualPrompt": "A highly detailed visual description of the product, its packaging, colors, textures, and lighting as seen in the image. This will be used as a prompt to generate similar images, so be extremely specific about the visual details to ensure a close match.",
                  "targetAudience": ["Audience 1", "Audience 2", "Audience 3"],
                  "marketInsights": ["Insight 1", "Insight 2"],
                  "competitiveAdvantages": ["Advantage 1", "Advantage 2"],
                  "adConcepts": [
                    { "platform": "Instagram", "headline": "Catchy headline", "body": "Persuasive ad copy", "cta": "Shop Now" },
                    { "platform": "Facebook", "headline": "Catchy headline", "body": "Persuasive ad copy", "cta": "Learn More" },
                    { "platform": "TikTok", "headline": "Catchy headline", "body": "Persuasive ad copy", "cta": "Get Started" }
                  ]
                }`
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productAnalysis: { type: Type.STRING },
              visualPrompt: { type: Type.STRING },
              targetAudience: { type: Type.ARRAY, items: { type: Type.STRING } },
              marketInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
              competitiveAdvantages: { type: Type.ARRAY, items: { type: Type.STRING } },
              adConcepts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platform: { type: Type.STRING },
                    headline: { type: Type.STRING },
                    body: { type: Type.STRING },
                    cta: { type: Type.STRING }
                  },
                  required: ["platform", "headline", "body", "cta"]
                }
              }
            },
            required: ["productAnalysis", "visualPrompt", "targetAudience", "marketInsights", "competitiveAdvantages", "adConcepts"]
          }
        }
      });

      setAnalysisProgress(80);
      
      const data = JSON.parse(response.text);
      setBriefData(data);
      
      setAnalysisProgress(100);
      setTimeout(() => setBriefStep('results'), 500);
      
    } catch (error) {
      console.error("Analysis failed:", error);
      // Fallback or error state could be added here
      setBriefStep('upload');
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
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

          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl w-fit border border-gray-100 shadow-md print:hidden">
            <button 
              onClick={() => setResultsTab('insights')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                resultsTab === 'insights' ? 'bg-primary text-brand-dark shadow-lg' : 'text-brand-dark/40 hover:text-brand-dark/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Market Insights
            </button>
            <button 
              onClick={() => setResultsTab('concepts')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                resultsTab === 'concepts' ? 'bg-primary text-brand-dark shadow-lg' : 'text-brand-dark/40 hover:text-brand-dark/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Ad Concepts (3)
            </button>
          </div>

          <AnimatePresence mode="wait">
            {resultsTab === 'insights' ? (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
            ) : (
              <motion.div
                key="concepts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
                      <div className="aspect-square bg-gray-200 flex items-center justify-center relative group">
                        <img 
                          src={generatedImages[i] || selectedImage || ''} 
                          alt="Ad" 
                          className={`w-full h-full object-cover transition-opacity duration-500 ${!generatedImages[i] ? 'opacity-50' : 'opacity-100'}`} 
                        />
                        <button 
                          onClick={() => handleGenerateImage(i, ad)}
                          disabled={isGenerating[i]}
                          className="absolute bg-primary text-brand-dark px-6 py-3 rounded-full font-bold flex items-center gap-2 transform transition-transform group-hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed print:hidden"
                        >
                          {isGenerating[i] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          {isGenerating[i] ? 'Generating...' : 'Generate Image'}
                        </button>
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
