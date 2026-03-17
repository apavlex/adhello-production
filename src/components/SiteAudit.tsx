import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Eye, Target, Sparkles, CheckCircle2, Circle, Loader2, Wrench, AlertTriangle, XCircle, Share2, Download, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface AuditCheck {
  label: string;
  status: 'pass' | 'fail' | 'warning';
  value: string;
  reason?: string;
}

interface Report {
  score: number;
  mobileFirstScore: number;
  leadsEstimatesScore: number;
  googleAiReadyScore: number;
  summary: string;
  brandAnalysis: string;
  url?: string;
  technicalAudit: {
    mobileSpeed: AuditCheck;
    contactForm: AuditCheck;
    sslCertificate: AuditCheck;
    metaDescription: AuditCheck;
    googleBusinessProfile: AuditCheck;
    reviewSentiment: AuditCheck;
  };
  strengths: { indicator: string; description: string }[];
  weaknesses: { indicator: string; description: string }[];
  recommendations: {
    title: string;
    description: string;
    action: string;
  }[];
}

export function SiteAudit({ isStudio = false }: { isStudio?: boolean }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<Report | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for shared report in URL
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('report');
    if (sharedData) {
      try {
        // Use UTF-8 safe base64 decoding
        const decodedStr = decodeURIComponent(atob(sharedData).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(decodedStr);
        setReport(decoded);
        setStatus('complete');
      } catch (e) {
        console.error("Failed to decode shared report", e);
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'analyzing') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99) {
            clearInterval(interval);
            return 99;
          }
          if (prev >= 95) {
            return prev + 0.1; // Very slow crawl after 95%
          }
          return prev + 5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [status]);

  const [errorInfo, setErrorInfo] = useState<{ message: string, detail?: string } | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    setStatus('analyzing');
    setProgress(0);
    setReport(null);
    setErrorInfo(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s client-side timeout

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: "Server Error", 
          detail: `The server returned a ${response.status} error. This usually indicates a temporary service interruption.` 
        }));
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      data.url = targetUrl;
      
      setProgress(100);
      setReport(data);
      setStatus('complete');
    } catch (error: any) {
      console.error("Error analyzing website:", error);
      setStatus('idle');

      let errorMessage = "Analysis Failed";
      let detailMessage = "We encountered an unexpected issue while analyzing your site. Please try again in a moment.";

      if (error.name === 'AbortError') {
        errorMessage = "Analysis Timeout";
        detailMessage = "The analysis is taking longer than expected. We have tried multiple AI engines, but the request timed out. Please try a different URL.";
      } else {
        try {
          // Attempt to parse structured error from server
          const parsed = JSON.parse(error.message);
          if (parsed.error) {
            errorMessage = parsed.error;
            detailMessage = parsed.detail || detailMessage;
          }
        } catch (e) {
          // Fallback for non-JSON errors
          if (error.message?.includes("fetch")) {
            errorMessage = "Connection Error";
            detailMessage = "Could not reach the analysis server. Please check your internet connection and try again.";
          } else if (error.message) {
            errorMessage = "Processing Error";
            detailMessage = error.message;
          }
        }
      }

      setErrorInfo({ message: errorMessage, detail: detailMessage });
    }
  };

  const handleShare = () => {
    if (!report) return;
    try {
      // Use UTF-8 safe base64 encoding
      const jsonStr = JSON.stringify(report);
      const encoded = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => 
        String.fromCharCode(parseInt(p1, 16))
      ));
      const shareUrl = `${window.location.origin}${window.location.pathname}?report=${encoded}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    } catch (err) {
      console.error("Failed to share report", err);
    }
  };

  const handleDownload = async () => {
    if (!reportRef.current || !report) return;
    
    setIsDownloading(true);
    try {
      const element = reportRef.current;
      const opt = {
        margin: [10, 10] as [number, number],
        filename: `AEO-Report-${report.url?.replace(/https?:\/\//, '').replace(/\//g, '-') || 'site'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          backgroundColor: isStudio ? '#121417' : '#ffffff',
          onclone: (clonedDoc: Document) => {
            // Remove oklch color functions which html2canvas doesn't support
            const elements = clonedDoc.getElementsByTagName('*');
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i] as HTMLElement;
              const style = window.getComputedStyle(el);
              
              // Check common color properties
              ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
                const val = (el.style as any)[prop] || style.getPropertyValue(prop);
                if (val && val.includes('oklch')) {
                  // Fallback to a safe color if oklch is detected
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
      alert("PDF generation failed due to modern CSS features. Opening print dialog as a fallback...");
      // Fallback to print if library fails
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const renderSteps = () => {
    const steps = [
      { label: 'Fetching website content', threshold: 20 },
      { label: 'Extracting brand signals', threshold: 50 },
      { label: 'Analyzing competitive landscape', threshold: 80 },
      { label: 'Generating recommendations', threshold: 100 },
    ];

    return (
      <div className="flex flex-col gap-4 max-w-sm mx-auto mt-8 text-left">
        {steps.map((step, index) => {
          const isComplete = progress >= step.threshold;
          const isCurrent = progress < step.threshold && (index === 0 || progress >= steps[index - 1].threshold);
          const isPending = progress < (index === 0 ? 0 : steps[index - 1].threshold);

          return (
            <div key={index} className="flex items-center gap-3">
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
              <span className={`text-sm md:text-base font-medium ${isComplete ? 'text-brand-dark/40' : isCurrent ? 'text-brand-dark' : 'text-brand-dark/30'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className={`${isStudio ? 'bg-transparent py-0' : 'full-screen-section bg-warm-cream py-0'} text-brand-dark font-sans`} id="site-audit">
      <div className={`${isStudio ? 'max-w-full' : 'max-w-4xl'} mx-auto px-4 w-full`}>

        {status === 'idle' && errorInfo && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500 max-w-2xl mx-auto">
            <div className={`${isStudio ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'} rounded-[2.5rem] p-8 border text-left shadow-lg`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>
                    {errorInfo.message}
                  </h3>
                  {errorInfo.detail && (
                    <p className={`text-sm mb-6 leading-relaxed ${isStudio ? 'text-white/60' : 'text-brand-dark/70'}`}>
                      {errorInfo.detail}
                    </p>
                  )}
                  <button
                    onClick={() => setErrorInfo(null)}
                    className="bg-brand-dark text-white hover:bg-black font-bold py-2.5 px-6 rounded-full transition-all text-sm shadow-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === 'idle' && !errorInfo && (
          <div className="text-center animate-in fade-in duration-500">
            <h2 className={`text-5xl md:text-6xl font-extrabold mb-4 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>
              Get Found by <span className="text-primary">AI & Customers</span>
            </h2>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed ${isStudio ? 'text-white/60' : 'text-brand-dark/70'}`}>
              Analyze your website to discover your brand strengths, find improvement
              opportunities, and optimize for AI search engines like ChatGPT and Perplexity.
            </p>

            {/* Input Card */}
            <div className={`${isStudio ? 'bg-[#1C1F26] border-white/5' : 'bg-white border-gray-100 shadow-xl'} rounded-[2.5rem] p-6 md:p-8 mb-8 border text-left`}>
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-primary" />
                <h3 className={`text-xl font-bold ${isStudio ? 'text-white' : 'text-brand-dark'}`}>Your Website</h3>
              </div>
              <form onSubmit={handleScan} className="relative flex items-center">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com or https://example.com"
                  className={`w-full ${isStudio ? 'bg-[#121417] text-white border-white/10' : 'bg-gray-50 text-brand-dark border-gray-200'} rounded-full py-4 pl-6 pr-32 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium border`}
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 bg-primary hover:bg-primary-hover text-brand-dark font-bold py-2.5 px-6 rounded-full flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  Scan
                </button>
              </form>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { icon: <Eye className="w-6 h-6 text-primary mb-4" />, title: 'Brand Analysis', desc: 'Understand your positioning and messaging' },
                { icon: <Target className="w-6 h-6 text-primary mb-4" />, title: 'Improvement Areas', desc: 'Find opportunities to improve' },
                { icon: <Sparkles className="w-6 h-6 text-primary mb-4" />, title: 'AI Search Ready', desc: 'Optimize for ChatGPT & AI search' }
              ].map((feature, i) => (
                <div key={i} className={`${isStudio ? 'bg-[#1C1F26] border-white/5' : 'bg-white border-gray-100 shadow-sm'} rounded-3xl p-6 border`}>
                  {feature.icon}
                  <h4 className={`text-lg font-bold mb-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>{feature.title}</h4>
                  <p className={`text-sm leading-relaxed font-medium ${isStudio ? 'text-white/40' : 'text-brand-dark/60'}`}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === 'analyzing' && (
          <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className={`${isStudio ? 'text-white/5' : 'text-gray-100'} stroke-current`}
                  strokeWidth="8"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  className="text-primary stroke-current transition-all duration-500 ease-out"
                  strokeWidth="8"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${progress * 2.51327} 251.327`}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-10 h-10 text-primary" />
              </div>
            </div>

            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>
              Analyzing your website...
            </h2>
            <p className={`text-lg mb-12 font-medium ${isStudio ? 'text-white/40' : 'text-brand-dark/60'}`}>
              Discovering your strengths and optimization opportunities
            </p>

            <div className={`w-full max-w-md mx-auto h-2 rounded-full overflow-hidden mb-8 ${isStudio ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div
                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {renderSteps()}
          </div>
        )}

        {status === 'complete' && report && (
          <div ref={reportRef} className="animate-in fade-in slide-in-from-bottom-8 duration-700 print:p-0">
            {/* Print-only Header */}
            <div className="hidden print:block mb-10 border-b-2 border-primary pb-6">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-brand-dark mb-2">AEO Readiness Report</h1>
                  <p className="text-brand-dark/60 font-bold">{report.url || url}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-widest text-brand-dark/40">Generated by</p>
                  <p className="text-xl font-black text-primary-dark">AdHello AI</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 print:hidden">
              <h2 className={`text-3xl font-extrabold ${isStudio ? 'text-white' : 'text-brand-dark'}`}>Audit Results</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border shadow-sm transition-all ${
                    isStudio ? 'bg-white/5 border-white/10 text-white/60 hover:text-primary' : 'bg-white border-gray-100 text-brand-dark/60 hover:text-primary'
                  }`}
                >
                  {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  {copySuccess ? 'Link Copied!' : 'Share Report'}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border shadow-sm transition-all disabled:opacity-50 ${
                    isStudio ? 'bg-white/5 border-white/10 text-white/60 hover:text-primary' : 'bg-white border-gray-100 text-brand-dark/60 hover:text-primary'
                  }`}
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isDownloading ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={() => setStatus('idle')}
                  className={`text-sm font-bold transition-colors ${isStudio ? 'text-white/40 hover:text-white' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                >
                  Scan another site
                </button>
              </div>
            </div>

            <div className={`${isStudio ? 'bg-[#1C1F26] border-white/5' : 'bg-white border-gray-100 shadow-xl'} rounded-[2.5rem] p-8 border mb-8 print:shadow-none print:border-none`}>
              <div className={`flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b ${isStudio ? 'border-white/5' : 'border-gray-100'}`}>
                <div className="relative w-32 h-32 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className={`${isStudio ? 'text-white/5' : 'text-gray-100'} stroke-current`}
                      strokeWidth="8"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <circle
                      className={`${report.score >= 80 ? 'text-green-500' : report.score >= 50 ? 'text-yellow-500' : 'text-red-500'} stroke-current transition-all duration-1000 ease-out`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${report.score * 2.51327} 251.327`}
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-extrabold ${isStudio ? 'text-white' : 'text-brand-dark'}`}>{report.score}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isStudio ? 'text-white/40' : 'text-brand-dark/50'}`}>Score</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-2xl font-extrabold ${isStudio ? 'text-white' : 'text-brand-dark'}`}>AEO Readiness Score</h3>
                    {report.score < 70 && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter animate-pulse print:hidden">
                        Critical Action Required
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-bold mb-2 flex items-center gap-1 ${isStudio ? 'text-primary' : 'text-brand-dark/40'}`}>
                    <Globe className="w-3 h-3" />
                    {report.url || url}
                  </p>
                  <p className={`leading-relaxed text-xl font-medium mb-4 ${isStudio ? 'text-white/60' : 'text-brand-dark/70'}`}>{report.summary}</p>
                  
                  <div className={`mb-6 p-6 rounded-3xl border ${isStudio ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${isStudio ? 'text-primary' : 'text-brand-dark/40'}`}>
                      <Target className="w-4 h-4" />
                      Brand Analysis & Positioning
                    </h4>
                    <p className={`leading-relaxed text-lg font-medium ${isStudio ? 'text-white/80' : 'text-brand-dark/80'}`}>
                      {report.brandAnalysis}
                    </p>
                  </div>
                  
                  {report.score < 60 && (
                    <div className={`${isStudio ? 'bg-primary/5 border-primary/20' : 'bg-primary/10 border-primary'} border-l-4 p-4 mb-6 rounded-r-2xl`}>
                      <p className={`font-bold text-sm ${isStudio ? 'text-white' : 'text-brand-dark'}`}>
                        ⚠️ Your site is at risk of being ignored by AI Search (ChatGPT, Gemini). 
                        Our "AI-First" upgrade can bridge this gap in 7 days.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Mobile-First', score: report.mobileFirstScore },
                      { label: 'Leads & Estimates', score: report.leadsEstimatesScore },
                      { label: 'Google & AI Ready', score: report.googleAiReadyScore },
                    ].map((item, i) => (
                      <div key={i} className={`${isStudio ? 'bg-white/5 border-white/5' : 'bg-warm-cream/50 border-brand-dark/5'} rounded-2xl p-4 border`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-black uppercase tracking-wider ${isStudio ? 'text-white/40' : 'text-brand-dark/40'}`}>{item.label}</span>
                          <span className={`text-sm font-black ${item.score >= 80 ? 'text-green-500' : item.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {item.score}%
                          </span>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isStudio ? 'bg-white/5' : 'bg-white'}`}>
                          <div
                            className={`h-full transition-all duration-1000 ${item.score >= 80 ? 'bg-green-500' : item.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Audit Grid */}
              <div className="mb-8">
                <h4 className={`text-lg font-extrabold mb-4 flex items-center gap-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>
                  <Wrench className="w-5 h-5 text-primary" />
                  Technical Audit
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(report.technicalAudit).map(([key, check]) => {
                    const auditCheck = check as AuditCheck;
                    return (
                    <div key={key} className={`${isStudio ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} rounded-2xl p-4 border flex flex-col gap-2`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isStudio ? 'text-white/40' : 'text-brand-dark/40'}`}>{auditCheck.label}</span>
                          <span className={`text-sm font-bold ${isStudio ? 'text-white' : 'text-brand-dark'}`}>{auditCheck.value}</span>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          auditCheck.status === 'pass' ? 'bg-green-500/10 text-green-500' : 
                          auditCheck.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 
                          'bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        }`}>
                          {auditCheck.status === 'pass' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : auditCheck.status === 'warning' ? (
                            <AlertTriangle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5 animate-pulse" />
                          )}
                        </div>
                      </div>
                      {auditCheck.reason && (
                        <p className={`text-sm leading-relaxed border-t pt-2 mt-auto ${isStudio ? 'text-white/60 border-white/10' : 'text-brand-dark/60 border-gray-200'}`}>
                          {auditCheck.reason}
                        </p>
                      )}
                    </div>
                  );})}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className={`${isStudio ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} rounded-3xl p-6 border`}>
                  <h4 className={`text-lg font-extrabold mb-4 flex items-center gap-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Strengths
                  </h4>
                  <ul className="space-y-4">
                    {report.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-3 font-medium">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <span className={`font-bold block mb-0.5 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>{strength.indicator}</span>
                          <span className={`text-sm ${isStudio ? 'text-white/60' : 'text-brand-dark/70'}`}>{strength.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${isStudio ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} rounded-3xl p-6 border`}>
                  <h4 className={`text-lg font-extrabold mb-4 flex items-center gap-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>
                    <Target className="w-5 h-5 text-yellow-500" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-4">
                    {report.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex items-start gap-3 font-medium">
                        <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Target className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div>
                          <span className={`font-bold block mb-0.5 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>{weakness.indicator}</span>
                          <span className={`text-sm ${isStudio ? 'text-white/60' : 'text-brand-dark/70'}`}>{weakness.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <h3 className={`text-2xl font-extrabold mb-6 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>Actionable Recommendations</h3>
            <div className="space-y-4">
              {report.recommendations.map((rec, i) => (
                <div key={i} className={`${isStudio ? 'bg-[#1C1F26] border-white/5' : 'bg-white border-gray-100 shadow-sm'} rounded-2xl p-6 border text-left flex flex-col md:flex-row gap-6 items-start`}>
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold mb-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>{rec.title}</h4>
                    <p className={`leading-relaxed font-medium mb-4 md:mb-0 ${isStudio ? 'text-white/60' : 'text-brand-dark/70'}`}>{rec.description}</p>
                  </div>
                  <div className={`${isStudio ? 'bg-primary/10 text-primary border-primary/20' : 'bg-blue-50 text-blue-800 border-blue-100'} px-4 py-3 rounded-xl text-sm font-bold md:w-1/3 shrink-0 border`}>
                    <span className={`block text-xs uppercase tracking-wider mb-1 ${isStudio ? 'text-primary/60' : 'text-blue-600/70'}`}>Action Step</span>
                    {rec.action}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center print:hidden">
              <button
                onClick={() => {
                  window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank');
                }}
                className="bg-primary hover:bg-primary-hover text-brand-dark font-bold py-4 px-10 rounded-full transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Get Expert Help Implementing This
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
