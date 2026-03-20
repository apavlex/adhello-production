import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Eye, Target, Sparkles, CheckCircle2, Circle, Loader2, Wrench, AlertTriangle, XCircle, Share2, Download, Link as LinkIcon, Copy, Check, Bot, ShieldCheck, ShieldX, ShieldAlert, BarChart3, Zap, TrendingUp } from 'lucide-react';

interface AuditCheck {
  label: string;
  status: 'pass' | 'fail' | 'warning';
  value: string;
  reason?: string;
}

interface GeoReport {
  geoScore: number;
  citabilityScore: number;
  brandAuthorityScore: number;
  eeeatScore: number;
  technicalScore: number;
  schemaScore: number;
  platformScore: number;
  geoSummary: string;
  crawlerAccess: { name: string; operator: string; status: 'allowed' | 'blocked' | 'unknown'; impact: string }[];
  platformReadiness: { platform: string; score: number; gap: string; action: string }[];
  criticalIssues: string[];
  quickWins: { action: string; impact: string; effort: string }[];
  llmsTxtStatus: 'present' | 'missing' | 'unknown';
  schemaTypes: string[];
  missingSchemas: string[];
  brandPresence: Record<string, 'present' | 'missing'>;
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

// ── GEO Score helpers ──────────────────────────────────────────────────────
function geoScoreColor(score: number) {
  if (score >= 75) return '#2ecc71';
  if (score >= 50) return '#e67e22';
  return '#e74c3c';
}

function geoScoreLabel(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

// ── GEO Score Ring ─────────────────────────────────────────────────────────
function ScoreRing({ score, size = 80, label }: { score: number; size?: number; label?: string }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 100);
  const color = geoScoreColor(score);
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={`${fill} ${circ}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-brand-dark font-extrabold" style={{ fontSize: size > 70 ? 22 : 13, lineHeight: 1 }}>{score}</span>
        {label && <span className="text-brand-dark/40 font-bold uppercase tracking-wider" style={{ fontSize: 8 }}>{label}</span>}
      </div>
    </div>
  );
}

// ── Crawler status icon ────────────────────────────────────────────────────
function CrawlerIcon({ status }: { status: string }) {
  if (status === 'allowed') return <ShieldCheck className="w-5 h-5 text-green-500" />;
  if (status === 'blocked') return <ShieldX className="w-5 h-5 text-red-500" />;
  return <ShieldAlert className="w-5 h-5 text-yellow-500" />;
}

// ── Mini score bar ─────────────────────────────────────────────────────────
function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider">{label}</span>
        <span className="text-xs font-extrabold" style={{ color: geoScoreColor(score) }}>{score}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: geoScoreColor(score) }} />
      </div>
    </div>
  );
}

// ── GEO Report panel ───────────────────────────────────────────────────────
function GeoReportPanel({ geo, isStudio }: { geo: GeoReport; isStudio: boolean }) {
  const card = isStudio ? 'bg-[#1C1F26] border-white/5' : 'bg-white border-gray-100 shadow-sm';
  const textMain = isStudio ? 'text-white' : 'text-brand-dark';
  const textMuted = isStudio ? 'text-white/50' : 'text-brand-dark/60';

  const categories = [
    { label: 'AI Citability', score: geo.citabilityScore },
    { label: 'Brand Authority', score: geo.brandAuthorityScore },
    { label: 'E-E-A-T Content', score: geo.eeeatScore },
    { label: 'Technical GEO', score: geo.technicalScore },
    { label: 'Schema & Data', score: geo.schemaScore },
    { label: 'Platform Opt.', score: geo.platformScore },
  ];

  const brandPlatforms = [
    { key: 'wikipedia', label: 'Wikipedia' },
    { key: 'wikidata', label: 'Wikidata' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'reddit', label: 'Reddit' },
    { key: 'linkedin', label: 'LinkedIn' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Hero score card */}
      <div className={`${card} rounded-[2rem] p-8 border`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <ScoreRing score={geo.geoScore} size={110} label="GEO" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-2xl font-extrabold ${textMain}`}>GEO Readiness Score</h3>
              <span className="text-xs font-black px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: geoScoreColor(geo.geoScore) }}>
                {geoScoreLabel(geo.geoScore)}
              </span>
            </div>
            <p className={`${textMuted} text-base leading-relaxed mb-4`}>{geo.geoSummary}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map(c => <ScoreBar key={c.label} score={c.score} label={c.label} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Critical issues */}
      {geo.criticalIssues?.length > 0 && (
        <div className="rounded-[1.5rem] p-6 border border-red-100 bg-red-50">
          <h4 className="text-sm font-black uppercase tracking-widest text-red-600 mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Critical Issues
          </h4>
          <ul className="space-y-2">
            {geo.criticalIssues.map((issue, i) => (
              <li key={i} className="text-sm text-red-800 font-medium flex items-start gap-2">
                <span className="text-red-400 mt-0.5">→</span>{issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Two-col: crawlers + brand presence */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* AI Crawler access */}
        <div className={`${card} rounded-[2rem] p-6 border`}>
          <h4 className={`text-base font-extrabold ${textMain} mb-4 flex items-center gap-2`}>
            <Bot className="w-5 h-5 text-primary" /> AI Crawler Access
          </h4>
          <div className="space-y-3">
            {geo.crawlerAccess?.map((c, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${isStudio ? 'bg-white/5' : 'bg-gray-50'}`}>
                <CrawlerIcon status={c.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-bold ${textMain}`}>{c.name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'allowed' ? 'bg-green-100 text-green-700' :
                      c.status === 'blocked' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{c.status}</span>
                  </div>
                  <p className={`text-xs ${textMuted} mt-0.5`}>{c.operator}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-3 rounded-xl text-xs font-medium ${isStudio ? 'bg-white/5 text-white/50' : 'bg-gray-50 text-brand-dark/50'}`}>
            llms.txt: <span className={`font-bold ${geo.llmsTxtStatus === 'present' ? 'text-green-600' : 'text-red-500'}`}>
              {geo.llmsTxtStatus === 'present' ? '✓ Present' : geo.llmsTxtStatus === 'missing' ? '✗ Missing' : '? Unknown'}
            </span>
          </div>
        </div>

        {/* Brand presence */}
        <div className={`${card} rounded-[2rem] p-6 border`}>
          <h4 className={`text-base font-extrabold ${textMain} mb-4 flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5 text-primary" /> Brand Authority
          </h4>
          <div className="space-y-3 mb-4">
            {brandPlatforms.map(p => (
              <div key={p.key} className="flex items-center justify-between">
                <span className={`text-sm font-bold ${textMain}`}>{p.label}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  geo.brandPresence?.[p.key] === 'present'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-brand-dark/40'
                }`}>
                  {geo.brandPresence?.[p.key] === 'present' ? '✓ Present' : '✗ Missing'}
                </span>
              </div>
            ))}
          </div>
          <div className={`p-3 rounded-xl ${isStudio ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs ${textMuted} font-medium`}>Brand mentions correlate 3× more strongly with AI visibility than backlinks. (Ahrefs 2025)</p>
          </div>
        </div>
      </div>

      {/* Platform readiness */}
      <div className={`${card} rounded-[2rem] p-6 border`}>
        <h4 className={`text-base font-extrabold ${textMain} mb-4 flex items-center gap-2`}>
          <BarChart3 className="w-5 h-5 text-primary" /> AI Platform Readiness
        </h4>
        <div className="space-y-4">
          {geo.platformReadiness?.map((p, i) => (
            <div key={i} className={`rounded-xl p-4 ${isStudio ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-extrabold ${textMain}`}>{p.platform}</span>
                <ScoreRing score={p.score} size={40} />
              </div>
              <p className={`text-xs ${textMuted} mb-1`}><span className="font-bold text-red-500">Gap:</span> {p.gap}</p>
              <p className={`text-xs font-bold text-primary`}>→ {p.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick wins */}
      {geo.quickWins?.length > 0 && (
        <div className={`${card} rounded-[2rem] p-6 border`}>
          <h4 className={`text-base font-extrabold ${textMain} mb-4 flex items-center gap-2`}>
            <Zap className="w-5 h-5 text-primary" /> Quick Wins — Implement This Week
          </h4>
          <div className="space-y-3">
            {geo.quickWins.map((w, i) => (
              <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${isStudio ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="w-7 h-7 bg-primary/20 text-brand-dark rounded-full flex items-center justify-center shrink-0 text-sm font-black">{i + 1}</div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${textMain} mb-0.5`}>{w.action}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${w.impact === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{w.impact} Impact</span>
                    <span className={`text-xs ${textMuted}`}>{w.effort}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schema summary */}
      {(geo.schemaTypes?.length > 0 || geo.missingSchemas?.length > 0) && (
        <div className={`${card} rounded-[2rem] p-6 border`}>
          <h4 className={`text-base font-extrabold ${textMain} mb-4 flex items-center gap-2`}>
            <Wrench className="w-5 h-5 text-primary" /> Schema & Structured Data
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {geo.schemaTypes?.length > 0 && (
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-green-600 mb-2">✓ Detected</p>
                <div className="flex flex-wrap gap-2">
                  {geo.schemaTypes.map((s, i) => (
                    <span key={i} className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {geo.missingSchemas?.length > 0 && (
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">✗ Missing</p>
                <div className="flex flex-wrap gap-2">
                  {geo.missingSchemas.map((s, i) => (
                    <span key={i} className="text-xs font-bold bg-red-50 text-red-600 px-2 py-1 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center pt-2">
        <button
          onClick={() => window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank')}
          className="bg-primary hover:bg-primary-hover text-brand-dark font-bold py-4 px-10 rounded-full transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-1"
        >
          Get Help Implementing These GEO Fixes
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function SiteAudit({ isStudio = false }: { isStudio?: boolean }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  // Email capture modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalDone, setModalDone] = useState(false);
  // Aliases so report-email code still works
  const gateName = modalName;
  const gateEmail = modalEmail;
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<Report | null>(null);
  const [geoReport, setGeoReport] = useState<GeoReport | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'complete' | 'error'>('idle');
  // (tab state removed — single combined report)
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('report');
    if (sharedData) {
      try {
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
          if (prev >= 99) { clearInterval(interval); return 99; }
          if (prev >= 95) return prev + 0.1;
          return prev + 5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [status]);

  const [errorInfo, setErrorInfo] = useState<{ message: string, detail?: string } | null>(null);

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateName.trim() || !gateEmail.trim()) return;
    setModalSubmitting(true);
    try {
      // Send lead to server
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: gateName, email: gateEmail, source: 'site-audit' })
      });
    } catch (_) {}
    sessionStorage.setItem('adhello-gate-passed', '1');
    setModalSubmitting(false);
    setModalDone(true);
    setTimeout(() => setShowEmailModal(false), 2000);
  };

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
    setGeoReport(null);
    setGeoStatus('idle');
    setErrorInfo(null);
    setActiveTab('geo');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Server Error",
          detail: `The server returned a ${response.status} error.`
        }));
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      data.url = targetUrl;

      setProgress(100);
      setReport(data);
      setStatus('complete');
      // Show email capture modal after 3s if not already done
      if (!sessionStorage.getItem('adhello-gate-passed')) {
        setTimeout(() => setShowEmailModal(true), 3000);
      }

      // Kick off GEO analysis in parallel
      setGeoStatus('loading');
      fetch('/api/geo-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      })
        .then(r => r.json())
        .then(geo => {
          if (geo.error) { setGeoStatus('error'); return; }
          setGeoReport(geo);
          setGeoStatus('complete');

          // Email the full report to the business if we have their info
          if (gateEmail && gateName) {
            fetch('/api/send-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: gateName,
                email: gateEmail,
                url: targetUrl,
                geoReport: data,
                geoReport: geo,
              })
            }).catch(() => {});
          }
        })
        .catch(() => setGeoStatus('error'));

    } catch (error: any) {
      console.error("Error analyzing website:", error);
      setStatus('idle');

      let errorMessage = "Analysis Failed";
      let detailMessage = "We encountered an unexpected issue. Please try again.";

      if (error.name === 'AbortError') {
        errorMessage = "Analysis Timeout";
        detailMessage = "The analysis took too long. Please try a different URL.";
      } else {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed.error) { errorMessage = parsed.error; detailMessage = parsed.detail || detailMessage; }
        } catch (e) {
          if (error.message?.includes("fetch")) { errorMessage = "Connection Error"; detailMessage = "Could not reach the analysis server."; }
        }
      }
      setErrorInfo({ message: errorMessage, detail: detailMessage });
    }
  };

  const handleShare = () => {
    if (!report) return;
    try {
      const jsonStr = JSON.stringify(report);
      const encoded = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      ));
      const shareUrl = `${window.location.origin}${window.location.pathname}?report=${encoded}`;
      const copyToClipboard = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return Promise.resolve();
      };
      copyToClipboard(shareUrl).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      }).catch(err => window.prompt("Copy this link:", shareUrl));
    } catch (err) { console.error("Failed to share report", err); }
  };

  const handleDownload = () => {
    if (!reportRef.current || !report) return;
    setIsDownloading(true);
    const styleId = 'adhello-print-style';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #audit-report-print, #audit-report-print * { visibility: visible; }
        #audit-report-print { position: fixed; top: 0; left: 0; width: 100%; }
        * { color: #1a1a1a !important; background-color: #ffffff !important; border-color: #e0e0e0 !important; box-shadow: none !important; }
        .text-white { color: #1a1a1a !important; }
        .bg-brand-dark, .bg-primary { background-color: #f5f5f5 !important; }
        .text-primary { color: #b8922a !important; }
        .print\\:hidden { display: none !important; }
        @page { margin: 15mm; size: A4; }
      }
    `;
    if (reportRef.current) reportRef.current.id = 'audit-report-print';
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        if (style) style.textContent = '';
        if (reportRef.current) reportRef.current.removeAttribute('id');
        setIsDownloading(false);
      }, 1000);
    }, 200);
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
          return (
            <div key={index} className="flex items-center gap-3">
              {isComplete ? <CheckCircle2 className="w-5 h-5 text-primary" />
                : isCurrent ? <Loader2 className="w-5 h-5 text-primary animate-spin" />
                : <Circle className="w-5 h-5 text-gray-300" />}
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
                  <h3 className={`text-xl font-bold mb-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>{errorInfo.message}</h3>
                  {errorInfo.detail && <p className={`text-sm mb-6 leading-relaxed ${isStudio ? 'text-white/60' : 'text-brand-dark/70'}`}>{errorInfo.detail}</p>}
                  <button onClick={() => setErrorInfo(null)} className="bg-brand-dark text-white hover:bg-black font-bold py-2.5 px-6 rounded-full transition-all text-sm shadow-sm">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── GATE FORM ── */}
        {status === 'idle' && !errorInfo && (
          <div className="text-center animate-in fade-in duration-500">
            <h2 className={`text-5xl md:text-6xl font-extrabold mb-4 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>
              Get Found by <span className="text-primary">AI & Customers</span>
            </h2>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed ${isStudio ? 'text-white/60' : 'text-brand-dark/70'}`}>
              Analyze your website for GEO readiness, AI search visibility, and GEO optimization — all in one scan.
            </p>
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
                <button type="submit" className="absolute right-2 bg-primary hover:bg-primary-hover text-brand-dark font-bold py-2.5 px-6 rounded-full flex items-center gap-2 transition-colors shadow-sm">
                  <Search className="w-4 h-4" /> Scan
                </button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { icon: <Eye className="w-6 h-6 text-primary mb-4" />, title: 'Brand Analysis', desc: 'Understand your positioning and messaging' },
                { icon: <Target className="w-6 h-6 text-primary mb-4" />, title: 'GEO Audit', desc: 'Score your AI search readiness across 6 dimensions' },
                { icon: <Sparkles className="w-6 h-6 text-primary mb-4" />, title: 'AI Search Ready', desc: 'Optimize for ChatGPT, Perplexity & AI Overviews' }
              ].map((feature, i) => (
                <div key={i} className={`${isStudio ? 'bg-[#1C1F26] border-white/5' : 'bg-white border-gray-100 shadow-sm'} rounded-3xl p-6 border`}>
                  {feature.icon}
                  <h4 className={`text-lg font-bold mb-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>{feature.title}</h4>
                  <p className={`text-sm leading-relaxed font-medium ${isStudio ? 'text-white/40' : 'text-brand-dark/60'}`}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === 'analyzing' && (
          <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className={`${isStudio ? 'text-white/5' : 'text-gray-100'} stroke-current`} strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                <circle className="text-primary stroke-current transition-all duration-500 ease-out" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray={`${progress * 2.51327} 251.327`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>Analyzing your website...</h2>
            <p className={`text-lg mb-12 font-medium ${isStudio ? 'text-white/40' : 'text-brand-dark/60'}`}>Discovering your strengths and optimization opportunities</p>
            <div className={`w-full max-w-md mx-auto h-2 rounded-full overflow-hidden mb-8 ${isStudio ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div className="h-full bg-primary transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%` }} />
            </div>
            {renderSteps()}
          </div>
        )}

        {status === 'complete' && report && (
          <div ref={reportRef} className="animate-in fade-in slide-in-from-bottom-8 duration-700 print:p-0">
            {/* Print-only header */}
            <div className="hidden print:block mb-10 border-b-2 border-primary pb-6">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-brand-dark mb-2">GEO Readiness Report</h1>
                  <p className="text-brand-dark/60 font-bold">{report.url || url}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-widest text-brand-dark/40">Generated by</p>
                  <p className="text-xl font-black text-primary-dark">AdHello AI</p>
                </div>
              </div>
            </div>

            {/* Header row */}
            <div className="flex items-center justify-between mb-6 print:hidden">
              <h2 className={`text-3xl font-extrabold ${isStudio ? 'text-white' : 'text-brand-dark'}`}>Audit Results</h2>
              <div className="flex items-center gap-4">
                <button onClick={handleShare} className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border shadow-sm transition-all ${isStudio ? 'bg-white/5 border-white/10 text-white/60 hover:text-primary' : 'bg-white border-gray-100 text-brand-dark/60 hover:text-primary'}`}>
                  {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  {copySuccess ? 'Link Copied!' : 'Share Report'}
                </button>
                <button onClick={handleDownload} disabled={isDownloading} className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border shadow-sm transition-all disabled:opacity-50 ${isStudio ? 'bg-white/5 border-white/10 text-white/60 hover:text-primary' : 'bg-white border-gray-100 text-brand-dark/60 hover:text-primary'}`}>
                  {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isDownloading ? 'Generating...' : 'Download PDF'}
                </button>
                <button onClick={() => { setStatus('idle'); setGeoReport(null); setGeoStatus('idle'); }} className={`text-sm font-bold transition-colors ${isStudio ? 'text-white/40 hover:text-white' : 'text-brand-dark/60 hover:text-brand-dark'}`}>
                  Scan another site
                </button>
              </div>
            </div>

            {/* GEO loading indicator (inline, no tab) */}
            {geoStatus === 'loading' && (
              <div className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-full w-fit text-xs font-bold ${isStudio ? 'bg-white/5 text-white/50' : 'bg-primary/10 text-brand-dark/60'}`}>
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                Running GEO analysis in background...
              </div>
            )}

            {/* ── AEO REPORT ── */}
            <>
                <div className={`${isStudio ? 'bg-[#1C1F26] border-white/5' : 'bg-white border-gray-100 shadow-xl'} rounded-[2.5rem] p-8 border mb-8 print:shadow-none print:border-none`}>
                  <div className={`flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b ${isStudio ? 'border-white/5' : 'border-gray-100'}`}>
                    <div className="relative w-32 h-32 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle className={`${isStudio ? 'text-white/5' : 'text-gray-100'} stroke-current`} strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                        <circle className={`${report.score >= 80 ? 'text-green-500' : report.score >= 50 ? 'text-yellow-500' : 'text-red-500'} stroke-current transition-all duration-1000 ease-out`} strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray={`${report.score * 2.51327} 251.327`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-extrabold ${isStudio ? 'text-white' : 'text-brand-dark'}`}>{report.score}</span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isStudio ? 'text-white/40' : 'text-brand-dark/50'}`}>Score</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-2xl font-extrabold ${isStudio ? 'text-white' : 'text-brand-dark'}`}>GEO Readiness Score</h3>
                        {report.score < 70 && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter animate-pulse print:hidden">Critical Action Required</span>}
                      </div>
                      <p className={`text-sm font-bold mb-2 flex items-center gap-1 ${isStudio ? 'text-primary' : 'text-brand-dark/40'}`}><Globe className="w-3 h-3" />{report.url || url}</p>
                      <p className={`leading-relaxed text-xl font-medium mb-4 ${isStudio ? 'text-white/60' : 'text-brand-dark/70'}`}>{report.summary}</p>
                      <div className={`mb-6 p-6 rounded-3xl border ${isStudio ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                        <h4 className={`text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${isStudio ? 'text-primary' : 'text-brand-dark/40'}`}><Target className="w-4 h-4" />Brand Analysis & Positioning</h4>
                        <p className={`leading-relaxed text-lg font-medium ${isStudio ? 'text-white/80' : 'text-brand-dark/80'}`}>{report.brandAnalysis}</p>
                      </div>
                      {report.score < 60 && (
                        <div className={`${isStudio ? 'bg-primary/5 border-primary/20' : 'bg-primary/10 border-primary'} border-l-4 p-4 mb-6 rounded-r-2xl`}>
                          <p className={`font-bold text-sm ${isStudio ? 'text-white' : 'text-brand-dark'}`}>⚠️ Your site is at risk of being ignored by AI Search. Our "AI-First" upgrade can bridge this gap in 7 days.</p>
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
                              <span className={`text-sm font-black ${item.score >= 80 ? 'text-green-500' : item.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{item.score}%</span>
                            </div>
                            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isStudio ? 'bg-white/5' : 'bg-white'}`}>
                              <div className={`h-full transition-all duration-1000 ${item.score >= 80 ? 'bg-green-500' : item.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.score}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className={`text-lg font-extrabold mb-4 flex items-center gap-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}><Wrench className="w-5 h-5 text-primary" />Technical Audit</h4>
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
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${auditCheck.status === 'pass' ? 'bg-green-500/10 text-green-500' : auditCheck.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>
                                {auditCheck.status === 'pass' ? <CheckCircle2 className="w-5 h-5" /> : auditCheck.status === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <XCircle className="w-5 h-5 animate-pulse" />}
                              </div>
                            </div>
                            {auditCheck.reason && <p className={`text-sm leading-relaxed border-t pt-2 mt-auto ${isStudio ? 'text-white/60 border-white/10' : 'text-brand-dark/60 border-gray-200'}`}>{auditCheck.reason}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className={`${isStudio ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} rounded-3xl p-6 border`}>
                      <h4 className={`text-lg font-extrabold mb-4 flex items-center gap-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}><CheckCircle2 className="w-5 h-5 text-green-500" />Strengths</h4>
                      <ul className="space-y-4">
                        {report.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-3 font-medium">
                            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
                            <div>
                              <span className={`font-bold block mb-0.5 ${isStudio ? 'text-white' : 'text-brand-dark'}`}>{strength.indicator}</span>
                              <span className={`text-sm ${isStudio ? 'text-white/60' : 'text-brand-dark/70'}`}>{strength.description}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={`${isStudio ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} rounded-3xl p-6 border`}>
                      <h4 className={`text-lg font-extrabold mb-4 flex items-center gap-2 ${isStudio ? 'text-white' : 'text-brand-dark'}`}><Target className="w-5 h-5 text-yellow-500" />Areas for Improvement</h4>
                      <ul className="space-y-4">
                        {report.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex items-start gap-3 font-medium">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5"><Target className="w-4 h-4 text-yellow-500" /></div>
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
                  <button onClick={() => window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank')} className="bg-primary hover:bg-primary-hover text-brand-dark font-bold py-4 px-10 rounded-full transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-1">
                    Get Expert Help Implementing This <Sparkles className="w-5 h-5" />
                  </button>
                </div>
            </>

            {/* ── GEO REPORT (shown below AEO when ready) ── */}
            {(geoStatus === 'complete' && geoReport) && (
              <GeoReportPanel geo={geoReport} isStudio={isStudio} />
            )}
            {geoStatus === 'error' && (
              <div className={`mt-6 flex items-center gap-3 px-5 py-4 rounded-2xl border ${isStudio ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100 text-red-500'}`}>
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold">GEO analysis failed</p>
                  <p className="text-xs opacity-70">The GEO report could not be generated. AEO results above are still valid.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    {/* ── Email Capture Modal (slide-up after report loads) ── */}
    {showEmailModal && (
      <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowEmailModal(false)}
        />
        {/* Modal */}
        <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-8 duration-500 overflow-hidden">
          {/* Close button */}
          <button
            onClick={() => setShowEmailModal(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-brand-dark/50 hover:text-brand-dark transition-all z-10"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          {/* Header strip */}
          <div className="bg-brand-dark px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-brand-dark" />
              </div>
              <div>
                <p className="text-white font-extrabold text-base leading-tight">Get your report in your inbox</p>
                <p className="text-white/50 text-xs">We'll email you a copy to reference anytime</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {modalDone ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                </div>
                <p className="font-extrabold text-brand-dark text-lg mb-1">Report on its way!</p>
                <p className="text-brand-dark/50 text-sm">Check your inbox in a few seconds.</p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={modalName}
                    onChange={e => setModalName(e.target.value)}
                    placeholder="Business name"
                    className="w-full rounded-xl py-3 px-4 font-medium border bg-gray-50 text-brand-dark border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={modalEmail}
                    onChange={e => setModalEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-xl py-3 px-4 font-medium border bg-gray-50 text-brand-dark border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover text-brand-dark font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-sm"
                >
                  {modalSubmitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : <>📩 Email Me My Report</>
                  }
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="w-full text-brand-dark/40 hover:text-brand-dark/60 text-xs py-1 transition-colors"
                >
                  No thanks, I'll just read it here
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    )}

    </section>
  );
}
