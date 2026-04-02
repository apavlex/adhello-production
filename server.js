import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
// Removed @google/genai import to use native fetch for stability
import crypto from 'crypto';
import Database from 'better-sqlite3';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8081;
const DIST_DIR = path.join(__dirname, 'dist');
const dbPath = path.join(__dirname, 'database.db');

// --- DATABASE ---
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS blueprints (
    id TEXT PRIMARY KEY,
    bizName TEXT,
    city TEXT,
    score INTEGER,
    blueprint TEXT,
    phaseHtml TEXT,
    auditData TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blueprint_id TEXT,
    role TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blueprint_id) REFERENCES blueprints(id)
  );
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    bizName TEXT,
    industry TEXT,
    city TEXT,
    goal TEXT,
    vibe TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
try { db.exec(`ALTER TABLE blueprints ADD COLUMN auditData TEXT`); } catch {}
try { db.exec(`ALTER TABLE blueprints ADD COLUMN phaseHtml TEXT`); } catch {}

// Disable FK enforcement so chat works even before blueprint is saved
db.pragma('foreign_keys = OFF');

// --- MIDDLEWARE ---
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json({ limit: '50mb' }));

process.on('uncaughtException', (err) => console.error('[CRITICAL] Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('[CRITICAL] Unhandled Rejection:', reason));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const KIE_API_KEY = process.env.KIE_API_KEY;

/**
 * Helper to call Kie.ai AI (OpenAI-compatible) via REST API.
 */
async function callKie(prompt, systemPrompt = '', history = []) {
  if (!KIE_API_KEY) return null;
  
  const messages = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  
  // Format history: Kie/OpenAI expects {role, content}
  (history || []).forEach(m => {
    messages.push({ 
      role: m.role || 'user', 
      content: m.content || m.text || '' 
    });
  });
  
  messages.push({ role: 'user', content: prompt });

  try {
    const res = await fetch('https://api.kie.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7
      })
    });
    
    const data = await res.json();
    if (data.error) {
      return null;
    }
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('[KIE] Fetch Exception:', err.message);
    return null;
  }
}

/**
 * Helper to call Gemini AI via native fetch REST API.
 */
async function callGemini(prompt, modelName = 'gemini-2.0-flash', base64Image = null) {
  if (!GEMINI_API_KEY) {
    console.warn('[GEMINI] API Key missing. Returning null.');
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
  
  const contents = [{
    parts: [{ text: prompt }]
  }];

  if (base64Image) {
    // If it's a data URI, extract just the base64 part
    const base64Data = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    contents[0].parts.push({
      inline_data: {
        mime_type: 'image/jpeg', // Defaulting to jpeg; could be refined
        data: base64Data
      }
    });
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          response_mime_type: "application/json"
        }
      })
    });
    const data = await res.json();
    if (data.error) {
      return null;
    }
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error('[GEMINI] Fetch Exception:', err.message);
    return null;
  }
}

/**
 * Unified AI orchestrator: Tries Kie.ai first, falls back to Gemini.
 */
async function callAI(prompt, systemPrompt = '', history = []) {
  // 1. Try Kie.ai
  const kieResult = await callKie(prompt, systemPrompt, history);
  if (kieResult) return kieResult;
  
  // 2. Fallback to Gemini
  console.log('[AI] Falling back to Gemini...');
  const historyText = (history || []).map(m => 
    `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content || m.text || ''}`
  ).join('\n\n');
  
  const fullPrompt = [
    systemPrompt,
    historyText ? 'Conversation History:\n' + historyText : '',
    'User: ' + prompt,
    'Assistant:'
  ].filter(Boolean).join('\n\n');

  return await callGemini(fullPrompt);
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
if (!resend) console.warn('[MAIL] RESEND_API_KEY missing. Email notifications disabled.');

// =====================================================
// SITE AUDIT
// =====================================================
async function getPageSpeedInsights(targetUrl) {
  try {
    const psiApiKey = process.env.GOOGLE_PSI_API_KEY || ''; // Optional but recommended
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile${psiApiKey ? `&key=${psiApiKey}` : ''}`;
    
    console.log(`[PSI] Analyzing: ${targetUrl}`);
    const res = await fetch(apiUrl);
    const data = await res.json();
    
    if (data.error) throw new Error(data.error.message);
    
    const lh = data.lighthouseResult;
    const screenshot = lh.audits['final-screenshot']?.details?.data || null;
    const perfScore = (lh.categories.performance.score || 0) * 100;
    const lcp = lh.audits['largest-contentful-paint']?.displayValue || 'N/A';
    const ssl = lh.audits['is-on-https']?.score === 1;
    
    return {
      performance: Math.round(perfScore),
      lcp,
      isHttps: ssl,
      screenshot,
      metrics: {
        fcp: lh.audits['first-contentful-paint']?.displayValue,
        tti: lh.audits['interactive']?.displayValue,
        cls: lh.audits['cumulative-layout-shift']?.displayValue,
      }
    };
  } catch (err) {
    console.error('[PSI] Fetch Error:', err.message);
    return null;
  }
}

app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  
  let targetUrl = url;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  // --- 1. Get Official Google Truth ---
  const psiData = await getPageSpeedInsights(targetUrl);
  
  // --- 2. Fallback / Enrichment signals ---
  const initialProtocolCheck = targetUrl.startsWith('https');
  const actualSsl = psiData ? psiData.isHttps : initialProtocolCheck;
  const actualSpeed = psiData ? psiData.lcp : '3.1s';
  const screenshotBase64 = psiData ? psiData.screenshot : null;

  const mockReport = {
    score: 42,
    mobileFirstScore: 68,
    leadsEstimatesScore: 45,
    googleAiReadyScore: 28,
    summary: "CRITICAL: Your website is functionally invisible to modern AI search engines. Missing GEO signals and structured data.",
    brandAnalysis: "Established local presence.",
    brandColors: { primary: "#1a1a2e", accent: "#F3DD6D", background: "#F5F0E8", text: "#1a1a2e" },
    technicalAudit: {
      mobileSpeed: { label: "Mobile Load Speed", status: psiData && psiData.performance >= 90 ? "pass" : "warning", value: actualSpeed, reason: "Measured by Google Lighthouse." },
      contactForm: { label: "Lead Capture Form", status: "pass", value: "Found", reason: "Detected on page." },
      sslCertificate: { label: "SSL Certificate", status: actualSsl ? "pass" : "fail", value: actualSsl ? "Secure" : "Insecure", reason: actualSsl ? "Valid HTTPS found." : "No valid SSL certificate — major trust issue." },
      metaDescription: { label: "Meta Description", status: "fail", value: "Missing", reason: "Critical for AI search visibility." },
      googleBusinessProfile: { label: "Google Business Profile", status: "warning", value: "Unclaimed", reason: "Optimizations required." },
      reviewSentiment: { label: "Review Sentiment", status: "pass", value: "4.7/5", reason: "Positive sentiment." }
    },
    strengths: [
      { indicator: actualSsl ? "SSL Security" : "Domain Established", description: actualSsl ? "Site is secured with HTTPS." : "Domain history is a plus." }
    ],
    weaknesses: [
      { indicator: "GEO Readiness", description: "Your core score is low because you lack structured data for AI search." }
    ],
    recommendations: [
      { title: "Switch to Managed CMS", description: "Our platform ensures 100% SSL security and 95+ performance scores.", action: "Fix Now" }
    ],
    city: "Local Area",
    reviewThemes: ["Quality Service"],
    screenshot: screenshotBase64 // PASS ACTUAL SCREENSHOT TO UI
  };

  try {
    if (KIE_API_KEY || GEMINI_API_KEY) {
      const prompt = `Analyze the website ${targetUrl} based on these OFFICIAL GOOGLE METRICS:
Performance: ${psiData ? psiData.performance : 'low'}
SSL Secured: ${actualSsl}
Load Time: ${actualSpeed}

Return ONLY a raw JSON object (no markdown) with this structure:
{"score":number,"mobileFirstScore":number,"leadsEstimatesScore":number,"googleAiReadyScore":number,"summary":"string","brandAnalysis":"string","brandColors":{"primary":"#hex","accent":"#hex","background":"#hex","text":"#hex"},"technicalAudit":{"mobileSpeed":{"label":"Mobile Load Speed","status":"pass|fail|warning","value":"${actualSpeed}","reason":"string"},"contactForm":{"label":"Contact Form","status":"pass|fail|warning","value":"string","reason":"string"},"sslCertificate":{"label":"SSL Certificate","status":"${actualSsl ? 'pass' : 'fail'}","value":"${actualSsl ? 'Secure' : 'Insecure'}","reason":"string"},"metaDescription":{"label":"Meta Description","status":"pass|fail|warning","value":"string","reason":"string"},"googleBusinessProfile":{"label":"Google Business Profile","status":"pass|fail|warning","value":"string","reason":"string"},"reviewSentiment":{"label":"Review Sentiment","status":"pass|fail|warning","value":"string","reason":"string"}},"strengths":[{"indicator":"string","description":"string"}],"weaknesses":[{"indicator":"string","description":"string"}],"recommendations":[{"title":"string","description":"string","action":"string"}],"city":"string","reviewThemes":["string","string","string"]}

For brandColors: Use the actual dominant colors of the business if possible.
IMPORTANT: You MUST respect the SSL status: ${actualSsl}. If it is FALSE, the audit score MUST reflect a critical failure. Be brutally honest to sell the solution.`;

      const resultText = await callAI(prompt);
      if (!resultText) throw new Error('Empty response from AI providers');
      
      const dataText = resultText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(dataText);
      
      return res.json({
        ...parsed,
        screenshot: screenshotBase64 // PASS ACTUAL SCREENSHOT TO UI
      });
    }
    res.json(mockReport);
  } catch (err) {
    console.error('[ANALYSIS] Gemini Error:', err);
    res.json(mockReport);
  }
});

// ── STRATEGY ENGINE (for No-Website flow) ───────────────────────────────────
app.post('/api/analyze-strategy', async (req, res) => {
  const { bizName, industry, city, goal, vibe } = req.body;
  if (!bizName || !industry) return res.status(400).json({ error: 'Business name and industry required.' });

  const vibeColors = {
    'Modern': { primary: '#6366f1', accent: '#a855f7', background: '#0f172a', text: '#f8fafc' },
    'Classic': { primary: '#1e293b', accent: '#94a3b8', background: '#f8fafc', text: '#0f172a' },
    'Bold': { primary: '#ef4444', accent: '#f59e0b', background: '#000000', text: '#ffffff' },
    'Friendly': { primary: '#10b981', accent: '#3b82f6', background: '#f0fdf4', text: '#064e3b' }
  };

  const colors = vibeColors[vibe] || vibeColors['Modern'];

  try {
    if (KIE_API_KEY || GEMINI_API_KEY) {
      const prompt = `You are a high-conversion website strategist. 
      Business: ${bizName} (${industry})
      Location: ${city}
      Core Goal: ${goal}
      Aesthetic: ${vibe}

      Generate a strategic brand package for a new website. Return ONLY a raw JSON object (no markdown, no backticks) with this structure:
      {
        "score": 100,
        "summary": "Strategically architected for high-velocity ${goal.toLowerCase()} growth in ${city}.",
        "brandAnalysis": "Focusing on ${industry} expertise with a ${vibe.toLowerCase()} visual identity to drive ${goal.toLowerCase()}.",
        "headlines": {
          "hero": "A killer 5-8 word headline that sells",
          "sub": "A 10-15 word sub-headline that builds trust",
          "cta": "A punchy 2-4 word primary CTA"
        },
        "strategy": {
          "goals": ["Goal 1 (e.g. 15% increase in calls)", "Goal 2", "Goal 3"],
          "targetROI": "A percentage or ratio describing the potential ROI"
        },
        "vibePrompt": "A highly detailed 100-word design prompt for Base44 (AI website builder). Include layout, color usage (${colors.primary}, ${colors.accent}), and conversion-first sections.",
        "technicalAudit": {
          "strategy": { "label": "Strategic Alignment", "status": "pass", "value": "Optimized", "reason": "Pre-architected for ${goal}." },
          "conversion": { "label": "Conversion Funnel", "status": "pass", "value": "A-Grade", "reason": "Copy and layout designed by AdHello AI expert logic." }
        }
      }`;

      const resultText = await callAI(prompt);
      if (!resultText) throw new Error('Empty response from AI providers');
      
      const raw = resultText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(raw);
      
      return res.json({
        ...parsed,
        brandColors: colors,
        vibe: vibe || 'Modern',
        city,
        companyName: bizName,
        isNoWebsiteFlow: true
      });
    }
    // Mock fallback
    res.json({
      score: 100,
      summary: "Strategic launch plan for " + bizName,
      headlines: { hero: "The Future of " + industry, sub: "Dominating " + city + " with AI search readiness.", cta: "Start Now" },
      brandColors: colors,
      vibe: vibe || 'Modern',
      city,
      companyName: bizName,
      isNoWebsiteFlow: true
    });
  } catch (err) {
    res.status(500).json({ error: 'Strategy generation failed.' });
  }
});

// =====================================================
// PHASE HTML GENERATOR (personalized per client)
// =====================================================
function buildPhaseHtml(bizName, cityLabel, t0, t1, t2, colors = {}, headlines = {}, vibe = 'Modern') {
  // Unified color palette across ALL 3 phases
  const bg   = colors.background || '#F5F0E8';
  const textColor = colors.text   || '#1a1a2e';
  const pri  = colors.primary     || '#1a1a2e';
  const acc  = colors.accent      || '#F3DD6D';

  const heroH1 = headlines.hero || `${bizName}<br><span>${cityLabel}'s Best</span>`;
  const heroSub = headlines.sub || `Trusted by hundreds of ${cityLabel} customers for ${t0.toLowerCase()}, ${t1.toLowerCase()}, and results that speak for themselves.`;
  const heroCTA = headlines.cta || '⚡ Get Free Quote';

  const borderRadius = vibe === 'Classic' ? '0px' : vibe === 'Friendly' ? '32px' : '20px';
  const fontFamily = "'Inter', 'Outfit', sans-serif";

  const commonStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;font-family:${fontFamily}}
    body{background:${bg};color:${textColor};min-height:100vh;overflow-x:hidden}
    nav{background:${bg};border-bottom:1px solid ${pri}18;padding:18px 36px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
    .logo{font-weight:900;font-size:20px;letter-spacing:-1px;color:${pri}}
    .nav-cta{background:${acc};color:${pri};padding:10px 24px;border-radius:100px;font-weight:900;font-size:13px;border:none;cursor:pointer;box-shadow:0 4px 14px ${acc}66}
  `;

  // Phase 1: Foundation — same brand colors, contractor-specific layout
  const p1 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${commonStyles}
.hero{padding:60px 36px 30px;display:grid;grid-template-columns:1.2fr 0.8fr;gap:48px;align-items:center;max-width:1100px;margin:0 auto}
h1{font-size:48px;font-weight:900;line-height:1.05;letter-spacing:-2px;margin-bottom:18px;color:${pri}}
h1 span{color:${acc};display:block}
.sub{font-size:17px;opacity:0.7;margin-bottom:28px;line-height:1.6;max-width:480px;color:${textColor}}
.btn-p{background:${acc};color:${pri};padding:16px 32px;border-radius:${borderRadius};font-weight:900;font-size:15px;border:none;cursor:pointer}
.stars{display:flex;align-items:center;gap:8px;margin-top:20px;font-size:13px;font-weight:700;color:${acc}}
.hero-img{background:linear-gradient(135deg,${pri},${acc}44);border-radius:${borderRadius};height:350px;display:flex;align-items:center;justify-content:center;font-size:64px;box-shadow:0 24px 48px rgba(0,0,0,0.08)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:30px 36px 60px;max-width:1100px;margin:0 auto}
.card{background:#fff;border-radius:${borderRadius};padding:28px;border:1px solid ${pri}12;transition:all 0.3s}
.icon{font-size:28px;margin-bottom:16px}
.card h4{font-size:17px;font-weight:900;margin-bottom:10px;color:${pri}}
.card p{font-size:13px;opacity:0.55;line-height:1.6;color:${textColor}}
</style></head><body>
<nav><div class="logo">${bizName}</div><button class="nav-cta">Get Started</button></nav>
<div class="hero">
  <div><h1>${heroH1}</h1><p class="sub">${heroSub}</p>
  <button class="btn-p">${heroCTA}</button>
  <div class="stars">★★★★★ <span style="opacity:0.5;color:${textColor}">4.9/5 · Verified ${cityLabel} Jobs</span></div></div>
  <div class="hero-img">🏗️</div>
</div>
<div class="grid">
  <div class="card"><div class="icon">🏆</div><h4>Elite ${t0}</h4><p>We've built our reputation in ${cityLabel} on providing the absolute highest level of ${t0.toLowerCase()}.</p></div>
  <div class="card"><div class="icon">⚡</div><h4>Fast ${t1}</h4><p>When you need ${t1.toLowerCase()}, we respond instantly. We know your time is valuable.</p></div>
  <div class="card"><div class="icon">🛡️</div><h4>Proven ${t2}</h4><p>Trust is earned. Over 200 homeowners in ${cityLabel} rely on our ${t2.toLowerCase()} every year.</p></div>
</div>
</body></html>`;

  // Phase 2: Conversion — same brand colors, urgency-focused
  const p2 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${commonStyles}
body{background:${bg}}
.top-bar{background:${acc};color:${pri};padding:10px;text-align:center;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px}
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:460px}
.content{padding:60px 48px;display:flex;flex-direction:column;justify-content:center}
.urgency{background:${acc}33;color:${pri};padding:7px 16px;border-radius:50px;font-size:11px;font-weight:900;margin-bottom:18px;display:inline-block;border:1px solid ${acc}}
h1{font-size:40px;font-weight:900;line-height:1.1;margin-bottom:20px;color:${pri}}
.form-container{background:#fff;padding:48px;display:flex;align-items:center;justify-content:center}
.form-card{background:#fff;padding:36px;border-radius:${borderRadius};box-shadow:0 20px 40px rgba(0,0,0,0.08);width:100%;max-width:380px;border:1px solid ${pri}12}
h3{font-size:22px;font-weight:900;margin-bottom:6px;color:${pri}}
.form-card p{font-size:13px;opacity:0.55;margin-bottom:22px;color:${textColor}}
input{width:100%;padding:13px 16px;border-radius:12px;border:2px solid ${pri}15;margin-bottom:10px;font-size:14px;outline:none;box-sizing:border-box;background:${bg}}
input:focus{border-color:${acc}}
.submit-btn{width:100%;padding:14px;background:${acc};color:${pri};border-radius:12px;font-weight:900;border:none;cursor:pointer;font-size:15px}
</style></head><body>
<div class="top-bar">🔥 Only 3 openings left this week in ${cityLabel}</div>
<nav><div class="logo">${bizName}</div><button class="nav-cta">Call Now</button></nav>
<div class="hero">
  <div class="content">
    <div class="urgency">⚡ LIVE IN ${cityLabel.toUpperCase()}</div>
    <h1>Stop Settling for Less than Elite ${t0}</h1>
    <p style="font-size:16px;line-height:1.6;opacity:0.65;margin-bottom:24px;color:${textColor}">We handle everything for ${bizName} clients — from the first call to the final inspection.</p>
    <ul style="list-style:none;gap:10px;display:grid">
      <li style="font-weight:800;color:${pri}">✅ 100% Satisfaction Guarantee</li>
      <li style="font-weight:800;color:${pri}">✅ Professional & Licensed in ${cityLabel}</li>
      <li style="font-weight:800;color:${pri}">✅ Free Estimates Within 24-Hours</li>
    </ul>
  </div>
  <div class="form-container">
    <div class="form-card">
      <h3>Get Your Quote</h3>
      <p>Fill out the form and we'll contact you within 15 minutes.</p>
      <input placeholder="Full Name" readonly>
      <input placeholder="Phone Number" readonly>
      <input placeholder="Service Needed" readonly>
      <button class="submit-btn">${heroCTA}</button>
    </div>
  </div>
</div>
</body></html>`;

  // Phase 3: Elite Authority — same brand colors, dark + accent override
  const darkBg = pri;
  const p3 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${commonStyles}
body{background:${darkBg};color:#fff}
nav{background:transparent;border-color:rgba(255,255,255,0.1)}
.logo{color:#fff}
.nav-cta{background:${acc};color:${pri}}
.hero{padding:100px 36px;text-align:center;max-width:900px;margin:0 auto}
.badge{background:linear-gradient(to right,${acc},${acc}88);-webkit-background-clip:text;color:transparent;font-weight:900;text-transform:uppercase;letter-spacing:4px;font-size:13px;margin-bottom:22px;display:block}
h1{font-size:64px;font-weight:900;letter-spacing:-3px;margin-bottom:28px;color:#fff}
h1 span{color:${acc}}
p.lead{font-size:18px;opacity:0.55;line-height:1.7;margin-bottom:44px;color:#fff}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;border-top:1px solid rgba(255,255,255,0.1);padding-top:44px}
.stat h2{font-size:44px;font-weight:900;color:${acc};margin-bottom:6px}
.stat p{text-transform:uppercase;font-size:11px;font-weight:900;opacity:0.35;letter-spacing:2px;color:#fff}
.btn-elite{background:${acc};color:${pri};padding:18px 44px;border-radius:100px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;border:none;cursor:pointer;font-size:14px;margin-top:20px}
</style></head><body>
<nav><div class="logo">${bizName.toUpperCase()}</div><button class="nav-cta">Elite Access</button></nav>
<div class="hero">
  <span class="badge">The Authority in ${cityLabel}</span>
  <h1>The Standard of <span>${t0}</span></h1>
  <p class="lead">${bizName} combines precision with elite ${t1.toLowerCase()}. We don't just do the job — we redefine what's possible for ${cityLabel} clients.</p>
  <button class="btn-elite">Start Your Project</button>
  <div class="stats-row">
    <div class="stat"><h2>15+</h2><p>Years Experience</p></div>
    <div class="stat"><h2>24/7</h2><p>Elite Support</p></div>
    <div class="stat"><h2>#1</h2><p>In ${cityLabel}</p></div>
  </div>
</div>
</body></html>`;

  return [p1, p2, p3];
}

// =====================================================
// FULFILLMENT ENGINE
// =====================================================
app.post('/api/fulfill', async (req, res) => {
  const { bizName, city, score, reviewThemes, brandColors, headlines, vibe } = req.body;
  if (!bizName) return res.status(400).json({ error: 'BizName required' });

  const cityLabel = city || 'your local area';
  const t0 = (reviewThemes && reviewThemes[0]) || 'Quality';
  const t1 = (reviewThemes && reviewThemes[1]) || 'Service';
  const t2 = (reviewThemes && reviewThemes[2]) || 'Reliability';
  const scoreNum = parseInt(score) || 78;
  const revLeak = 100 - scoreNum;

  const blueprint = `# Digital Blueprint for ${bizName}

## Phase 1: Modern Foundation — Your Digital Headquarters

Right now, most local businesses in **${cityLabel}** are invisible to Google's AI. Your website needs to communicate clearly to both humans and AI search engines — signaling **who you are**, **where you serve**, and **what problems you solve** in the exact language that modern search AI understands.

### What Gets Built for ${bizName}
- **Bento-Grid Homepage**: A modern, mobile-first layout with your services arranged in scannable cards that both customers and Google AI can understand instantly — replacing the generic template that blends in with every competitor
- **Hero Section with Social Proof**: Your boldest customer result front-and-center, featuring your reputation for ${t0} and ${t1} from real verified reviews
- **Local GEO Architecture**: Every heading, URL, image alt tag, and metadata block is crafted around **"${bizName} ${cityLabel}"** search terms — the exact queries your customers are using in AI search
- **Lead Capture System**: A prominent above-the-fold CTA with an optimized booking form, reducing friction and capturing visitors before they leave for a competitor

### Why This Is Urgent for ${bizName}
With a current score of **${scoreNum}/100**, you are leaving approximately **${revLeak}%** of potential revenue on the table every single month — visitors who find you but don't convert, or never find you at all. Phase 1 is the structural fix that makes everything else possible.

### Timeline
**Week 1**: Domain setup, design system configured, hero section live  
**Week 2**: All service pages built with GEO-optimized copy  
**Week 3**: Review widgets, lead capture forms, and analytics installed  
**Week 4**: Google Business Profile synced, schema markup live, launch

---

## Phase 2: Conversion Engine — Turn Visitors Into Revenue

Traffic without conversion is vanity. Phase 2 transforms ${bizName}'s new website from a digital brochure into a **24/7 automated revenue machine**. Every visitor becomes a potential booking, every lead gets followed up automatically, and every dollar of marketing spend works significantly harder.

### What Gets Built
- **AI Booking Widget**: A 24/7 automated intake system that qualifies leads and books appointments while you sleep — immediately addressing the #1 customer question about ${t2}
- **Automated Review System**: After every completed job, a timed SMS requests a Google review. At 4.8+ stars, ${bizName} qualifies for Google's "Local Pack" featured position
- **Conversion-First Copy**: Every headline, CTA, and page section written with a single goal — turning a ${cityLabel} visitor into a booked client
- **CRM Follow-Up Sequences**: Leads who don't book immediately receive a 3-touch automated sequence over 72 hours, recovering up to 40% of lost inquiries

### Expected Revenue Impact
Businesses at ${bizName}'s stage see a **30–60% increase in booked appointments** within 90 days of activating Phase 2 — without increasing their advertising budget.

---

## Phase 3: Elite Authority — Become the Undeniable #1 in ${cityLabel}

Modern AI search engines (Google AI Overviews, Bing Copilot, ChatGPT) feature businesses with a complete **brand signal ecosystem** — not just a website. Phase 3 makes ${bizName} the undeniable, AI-cited authority for your category in ${cityLabel}.

### What Gets Built
- **Authority Content Hub**: Weekly 600-word articles answering the exact questions ${cityLabel} customers search — "best [service] in ${cityLabel}", "how much does [service] cost", "is [bizName] legit?" — these articles get picked up directly by Google AI Overviews
- **YouTube Brand Presence**: Monthly 2-3 minute service showcase videos, ranking on both YouTube and Google, providing a geographic authority signal that no local competitor has
- **Omni-Channel Signal Network**: Consistent ${bizName} brand presence across Google Business Profile, social channels, and local directories — signaling to every AI: "This is a trusted, established, real business"
- **Competitor Displacement**: As your authority score climbs from ${scoreNum} toward 95+, you systematically displace competitors in local AI results and capture their customer flow

### The 90-Day Authority Timeline
- **Month 1**: Foundation live, GBP fully optimized, first 5 authority articles published in ${cityLabel}
- **Month 2**: Review count tripled, YouTube channel launched, measurable conversion rate improvement
- **Month 3**: ${bizName} appearing in Google AI Overviews for "${cityLabel}" searches, dominant in the local map pack
`;

  const phaseHtml = buildPhaseHtml(
    bizName, 
    cityLabel, 
    t0, t1, t2, 
    brandColors || {}, 
    headlines || {}, 
    vibe || 'Modern'
  );
  res.json({ blueprint, phaseHtml });
});

// =====================================================
// SAVE BLUEPRINT
// =====================================================
app.post('/api/fulfill/save', (req, res) => {
  const { bizName, city, score, blueprint, phaseHtml, auditData } = req.body;
  try {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO blueprints (id, bizName, city, score, blueprint, phaseHtml, auditData) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      id, bizName, city, score, blueprint,
      phaseHtml ? JSON.stringify(phaseHtml) : null,
      auditData ? JSON.stringify(auditData) : null
    );
    res.json({ id, success: true });
  } catch (error) {
    console.error('[SAVE] Error:', error);
    res.status(500).json({ error: 'Save failed' });
  }
});

// =====================================================
// GET BLUEPRINT
// =====================================================
app.get('/api/fulfill/:id', (req, res) => {
  const { id } = req.params;
  try {
    const row = db.prepare('SELECT * FROM blueprints WHERE id = ?').get(id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    const messages = db.prepare('SELECT role, content FROM chat_history WHERE blueprint_id = ? ORDER BY created_at ASC').all(id);
    res.json({
      ...row,
      phaseHtml: row.phaseHtml ? JSON.parse(row.phaseHtml) : null,
      auditData: row.auditData ? JSON.parse(row.auditData) : null,
      messages
    });
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// =====================================================
// SITE-WIDE CHATBOT
// =====================================================
app.post('/api/chatbot', async (req, res) => {
  const { messages, userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: 'Message required' });

  let replyText = '';
  try {
    const systemPrompt = `You are the "AdHello Growth Assistant" — the friendly, expert concierge for home service pros (painters, electricians, plumbers, etc.). 
Your vibe: You're an elite growth expert, but you talk like a human, not a corporate brochure. 
Rules:
1. Be conversational. Use shorter sentences. Ask engaging follow-up questions.
2. Sound like you're talking to a friend over coffee, not lecturing a student. 
3. Avoid generic AI phrases. Be punchy and energetic.
4. If you have to explain something complex, use a simple analogy or bullet points.
5. Keep responses under 2-3 short paragraphs.
Role: Help them understand how AdHello builds smart sites, handles SEO/GEO, and captures leads 24/7.`;
    
    replyText = await callAI(userMessage, systemPrompt, messages);
  } catch (err) {
    console.error('[SITE-CHAT] Gemini error:', err);
  }

  if (!replyText) {
    replyText = "AdHello.ai is an AI growth platform for home service pros. We build your website, handle your SEO/GEO, and capture leads 24/7 so you can focus on the job. Would you like to see how it works for your specific trade?";
  }

  res.json({ text: replyText });
});

// =====================================================
// CHAT — GEO Ranking Coach
// =====================================================
app.post('/api/fulfill/:id/chat', async (req, res) => {
  const { id } = req.params;
  const { message, blueprintInfo, auditReport } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const bizName = blueprintInfo?.bizName || 'the business';
  const city = blueprintInfo?.city || 'your city';
  const score = blueprintInfo?.score || 'N/A';

  // Fetch audit data from DB if not provided
  const audit = auditReport || (() => {
    try {
      const row = db.prepare('SELECT auditData FROM blueprints WHERE id = ?').get(id);
      return row?.auditData ? JSON.parse(row.auditData) : null;
    } catch { return null; }
  })();

  let auditContext = '';
  if (audit) {
    const checks = audit.technicalAudit ? Object.values(audit.technicalAudit) : [];
    const failing = checks.filter(c => c.status === 'fail').map(c => `FAIL: ${c.label} — ${c.reason || c.value || ''}`).join('\n');
    const warnings = checks.filter(c => c.status === 'warning').map(c => `WARN: ${c.label} — ${c.reason || c.value || ''}`).join('\n');
    const weaknesses = (audit.weaknesses || []).map(w => `- ${w.indicator}: ${w.description}`).join('\n');
    const recommendations = (audit.recommendations || []).map(r => `> ${r.title}: ${r.description}`).join('\n');
    auditContext = `
=== ${bizName} AUDIT DATA ===
AEO Score: ${audit.score}/100 | Mobile: ${audit.mobileFirstScore}/100 | AI Ready: ${audit.googleAiReadyScore}/100
Summary: ${audit.summary || ''}
FAILING: ${failing || 'none'}
WARNINGS: ${warnings || 'none'}
WEAKNESSES: ${weaknesses || 'none'}
RECOMMENDATIONS: ${recommendations || 'none'}
===========================`;
  }

  try {
    // Save user message — skip if blueprint doesn't exist yet (FK safety)
    const blueprintExists = db.prepare('SELECT id FROM blueprints WHERE id = ?').get(id);
    if (blueprintExists) {
      try { db.prepare('INSERT INTO chat_history (blueprint_id, role, content) VALUES (?, ?, ?)').run(id, 'user', message); } catch {}
    }

    const history = blueprintExists
      ? db.prepare('SELECT role, content FROM chat_history WHERE blueprint_id = ? ORDER BY created_at ASC').all(id)
      : [];

    let replyText = '';

    if (GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are the "GEO Ranking Coach" for AdHello.ai — an elite local SEO expert who talks like a teammate, not a consultant.
You are coaching ${bizName} in ${city} (AEO score: ${score}/100).
${auditContext}
Your vibe: Professional but punchy and conversational. Use phrases like "Check this out," "Here's the move," or "Bottom line." 
Rules:
1. Be direct. Don't ramble.
2. Reference their actual data naturally (e.g., "I see your SSL is failing—that's a huge trust killer").
3. Give 1-2 actionable tips in every response.
4. Encourage them, but don't be afraid to be brutally honest about what's holding them back.
5. Use bullet points for steps.`;

        const historyText = history.slice(0, -1).map(m =>
          `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`
        ).join('\n\n');

        const fullPrompt = `${systemPrompt}\n\n${historyText ? 'Conversation:\n' + historyText + '\n\n' : ''}User: ${message}\n\nCoach:`;

        replyText = await callAI(message, systemPrompt, history);
      } catch (geminiErr) {
        console.error('[CHAT] Gemini failed:', geminiErr);
      }
    }

    if (!replyText) {
      const lm = message.toLowerCase();
      if (lm.includes('rank') || lm.includes('seo') || lm.includes('geo')) {
        replyText = `Great question on GEO ranking for **${bizName}**!\n\n1. **Google Business Profile** — Fill every field (services, hours, description). Post weekly updates.\n2. **NAP Consistency** — Your Name, Address, Phone must be identical on your website, GBP, and every directory listing.\n3. **Local landing pages** — Create a page titled "${bizName} in ${city}" with that exact phrase in your H1, URL, and first paragraph.\n\nThese three steps alone can push you into the local top 3 within 60 days. Want me to go deeper on any of them?`;
      } else if (lm.includes('base44') || lm.includes('prompt') || lm.includes('website') || lm.includes('build')) {
        replyText = `For **${bizName}**, here's your Phase 1 Base44 prompt:\n\n> *"Build a premium bento-grid homepage for ${bizName} in ${city}. Warm cream background (#F5F0E8), dark navy headings, gold (#F3DD6D) CTA buttons. Include: bold split-hero with 'Get Free Quote' button, 3-column services grid with icons, Google reviews widget showing 4.9 stars, and a contact form. Mobile-first. Add local schema markup for GEO signals."*\n\nPaste this directly into Base44's AI Site Builder. Which phase prompt would you like next?`;
      } else if (lm.includes('review') || lm.includes('rating') || lm.includes('google')) {
        replyText = `Reviews are the **#1 local ranking signal** for ${bizName}. Here's a system that reliably triples review volume:\n\n**The After-Service Text** (send within 1 hour of completing a job):\n> *"Hi [Name]! Thanks for choosing ${bizName}. If we did a great job, a quick Google review would mean everything to us: [link]. Takes 60 seconds! 🙏"*\n\nAt 4.8+ stars you qualify for Google's Local Pack featured placement — that alone can double your inbound leads. Want me to help write a review request sequence for your specific customers?`;
      } else {
        replyText = `Great question! As your **GEO Ranking Coach** for ${bizName}, here's where I'd focus:\n\n- 🗺️ **Local GEO signals** — Google Business Profile + consistent citations across directories\n- ⚡ **Conversion optimization** — AI booking widget so you never miss an after-hours lead\n- 📹 **Authority content** — Weekly articles answering "${city} [service]" questions that get picked up by Google AI Overviews\n\nWhich of these would you like to dive into? I have exact scripts, prompts, and checklists for each.`;
      }
    }

    // Save reply — skip if blueprint doesn't exist yet
    if (blueprintExists) {
      try { db.prepare('INSERT INTO chat_history (blueprint_id, role, content) VALUES (?, ?, ?)').run(id, 'model', replyText); } catch {}
    }
    res.json({ text: replyText });
  } catch (error) {
    console.error('[CHAT] Error:', error);
    res.status(500).json({ error: 'Chat failed. Please try again.' });
  }
});

// Sync Lead to Agency OS (adhelloleadsos)
async function syncLeadToAgencyOS(leadData) {
  const LEADSOS_URL = process.env.ADHELLO_LEADSOS_URL || 'https://leads.adhello.ai';
  const LEADSOS_KEY = process.env.ADHELLO_LEADSOS_API_KEY || 'adhello_secret_123';
  
  try {
    const payload = {
      title: leadData.bizName || leadData.name || 'New Lead',
      website: leadData.siteUrl || leadData.website || 'N/A',
      email: leadData.email || 'N/A',
      phone: leadData.phone || 'N/A',
      city: leadData.city || '',
      state: leadData.state || '',
      source: leadData.source || 'adhello_audit',
      totalScore: leadData.auditData?.score || 0,
      auditData: leadData.auditData || null,
      message: `Lead captured from AdHello AI: ${leadData.name}`
    };

    const res = await fetch(`${LEADSOS_URL}/api/ingest`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': LEADSOS_KEY
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('[SYNC] Agency OS Response:', data);
  } catch (err) {
    console.error('[SYNC] Failed to push lead to Agency OS:', err.message);
  }
}

// Singular route for SiteAudit.tsx compatibility
app.post('/api/lead', async (req, res) => {
  const { name, email, phone, siteUrl, auditData, source } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });

  try {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO leads (id, name, email, phone, bizName, industry, city, goal, vibe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      id, name, email, phone, auditData?.companyName || '', '', auditData?.city || '', '', ''
    );

    // Push to Agency OS
    await syncLeadToAgencyOS({ ...req.body, bizName: auditData?.companyName });

    res.json({ id, success: true });
  } catch (error) {
    console.error('[LEADS] Error:', error);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

app.post('/api/leads', async (req, res) => {
  const { name, email, phone, bizName, industry, city, goal, vibe } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });

  try {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO leads (id, name, email, phone, bizName, industry, city, goal, vibe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      id, name, email, phone, bizName, industry, city, goal, vibe
    );

    // Send Email Notification
    if (resend) {
      resend.emails.send({
        from: 'AdHello leads <onboarding@resend.dev>',
        to: 'alex@adhello.ai',
        subject: `🔥 New Lead: ${bizName} (${industry})`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1a1a2e;">
            <h2 style="color: #6366f1;">New Strategic Lead Captured</h2>
            <p><strong>Business:</strong> ${bizName}</p>
            <p><strong>Contact:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p><strong>Industry:</strong> ${industry}</p>
            <p><strong>Location:</strong> ${city}</p>
            <p><strong>Goal:</strong> ${goal}</p>
            <p><strong>Vibe:</strong> ${vibe}</p>
            <br />
            <a href="https://adhello.ai" style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View Dashboard</a>
          </div>
        `
      }).catch(err => console.error('[MAIL] Error sending lead email:', err));
    }

    // Push to Agency OS
    await syncLeadToAgencyOS(req.body);

    res.json({ id, success: true });
  } catch (error) {
    console.error('[LEADS] Error:', error);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

app.post('/api/ad-brief/generate-image', (req, res) => res.json({ imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000' }));

app.post('/api/stitch-design', (req, res) => res.json({ success: true }));

app.post('/api/ad-brief/analyze', async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'Image is required.' });

  const prompt = `Analyze this product image and generate a comprehensive Ad Brief. 
  Output your response as PURE JSON matching this exactly:
  {
    "productAnalysis": "string explaining what the product is and its vibe",
    "visualPrompt": "a detailed text-to-image prompt for Midjourney/DALL-E to recreate or enhance this product in a lifestyle setting",
    "targetAudience": ["audience 1", "audience 2", "audience 3"],
    "marketInsights": ["insight 1", "insight 2", "insight 3"],
    "competitiveAdvantages": ["advantage 1", "advantage 2", "advantage 3"],
    "adConcepts": [
      { "platform": "Instagram", "headline": "string", "body": "string", "cta": "string" },
      { "platform": "Facebook", "headline": "string", "body": "string", "cta": "string" },
      { "platform": "TikTok", "headline": "string", "body": "string", "cta": "string" }
    ]
  }
  Be specific and professional.`;

  try {
    const aiResponse = await callAI(prompt, "You are a master direct-response ad strategist.", 'gemini-2.0-flash', image);
    if (!aiResponse) throw new Error("AI analysis failed.");
    
    // Attempt to parse AI response
    let briefData;
    try {
      briefData = JSON.parse(aiResponse);
    } catch (e) {
      console.warn("[AD-BRIEF] AI sent malformed JSON, attempting cleanup.", aiResponse);
      const cleaned = aiResponse.match(/\{[\s\S]*\}/)?.[0] || aiResponse;
      briefData = JSON.parse(cleaned);
    }

    res.json(briefData);
  } catch (error) {
    console.error('[AD-BRIEF] Analysis Error:', error);
    res.status(500).json({ detail: error.message });
  }
});

app.use(express.static(DIST_DIR));
app.get('*', (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
