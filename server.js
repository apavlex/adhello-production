import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import crypto from 'crypto';
import Database from 'better-sqlite3';

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
const genAI = GEMINI_API_KEY ? new GoogleGenAI(GEMINI_API_KEY) : null;

// =====================================================
// SITE AUDIT
// =====================================================
app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const mockReport = {
    score: 42,
    mobileFirstScore: 68,
    leadsEstimatesScore: 45,
    googleAiReadyScore: 28,
    summary: "CRITICAL: Your website is functionally invisible to modern AI search engines. You are missing established GEO (Generative Engine Optimization) signals, structured data, and the trust-layer that ChatGPT, Perplexity, and Google AI Overviews require to feature your business.",
    brandAnalysis: "Established local presence with growth potential.",
    brandColors: {
      primary: "#1a1a2e",
      accent: "#F3DD6D",
      background: "#F5F0E8",
      text: "#1a1a2e"
    },
    technicalAudit: {
      mobileSpeed: { label: "Mobile Load Speed", status: "warning", value: "3.1s", reason: "Page load exceeds 2s threshold. Images not optimized for mobile." },
      contactForm: { label: "Lead Capture Form", status: "pass", value: "Found", reason: "Contact form detected on homepage." },
      sslCertificate: { label: "SSL Certificate", status: "pass", value: "Secure", reason: "Valid HTTPS certificate found." },
      metaDescription: { label: "Meta Description", status: "fail", value: "Missing", reason: "No meta description found — critical for AI search visibility." },
      googleBusinessProfile: { label: "Google Business Profile", status: "warning", value: "Unclaimed", reason: "GBP found but not fully optimized. Missing service categories and posts." },
      reviewSentiment: { label: "Review Sentiment", status: "pass", value: "4.7/5", reason: "Positive sentiment detected across Google reviews." }
    },
    strengths: [
      { indicator: "SSL Security", description: "Site is secured with HTTPS, a baseline trust signal." },
      { indicator: "Review Sentiment", description: "4.7/5 rating shows strong customer satisfaction." }
    ],
    weaknesses: [
      { indicator: "No Meta Description", description: "Google AI cannot summarize your business for AI Overview results without proper meta descriptions." },
      { indicator: "Slow Mobile Speed", description: "3.1s load time causes 53% of mobile visitors to leave before the page loads." },
      { indicator: "GBP Not Optimized", description: "Unclaimed or incomplete Google Business Profile means you're losing direct local search placement." }
    ],
    recommendations: [
      { title: "Add Meta Descriptions", description: "Write a 155-character description for every page including target keywords.", action: "Fix Now" },
      { title: "Optimize Mobile Speed", description: "Compress images, enable lazy loading, and use a CDN to hit under 1.5s load time.", action: "Improve Speed" },
      { title: "Complete Your GBP", description: "Verify ownership, add all services, post weekly updates, and respond to all reviews.", action: "Claim GBP" }
    ],
    city: "Local Area",
    reviewThemes: ["Quality Service", "Reliability", "Professionalism"]
  };

  try {
    if (genAI) {
      const prompt = `Analyze the website ${url} and return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
{"score":number,"mobileFirstScore":number,"leadsEstimatesScore":number,"googleAiReadyScore":number,"summary":"string","brandAnalysis":"string","brandColors":{"primary":"#hex","accent":"#hex","background":"#hex","text":"#hex"},"technicalAudit":{"mobileSpeed":{"label":"Mobile Load Speed","status":"pass|fail|warning","value":"string","reason":"string"},"contactForm":{"label":"Contact Form","status":"pass|fail|warning","value":"string","reason":"string"},"sslCertificate":{"label":"SSL Certificate","status":"pass|fail|warning","value":"string","reason":"string"},"metaDescription":{"label":"Meta Description","status":"pass|fail|warning","value":"string","reason":"string"},"googleBusinessProfile":{"label":"Google Business Profile","status":"pass|fail|warning","value":"string","reason":"string"},"reviewSentiment":{"label":"Review Sentiment","status":"pass|fail|warning","value":"string","reason":"string"}},"strengths":[{"indicator":"string","description":"string"}],"weaknesses":[{"indicator":"string","description":"string"}],"recommendations":[{"title":"string","description":"string","action":"string"}],"city":"string","reviewThemes":["string","string","string"]}

For brandColors: extract the ACTUAL dominant colors used on the website. primary = main brand color (button bg, logo color), accent = highlight/CTA color, background = main page background, text = main text color. 
PENALTY SYSTEM: If a site lacks Schema Markup (json-ld), llms.txt, or geo-specific breadcrumbs, the score MUST be below 50. Most local businesses currently fail this. Be honest and critical to highlight the need for GEO optimization. Return real hex codes observed from the site.`;
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const raw = response.text().replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(raw);
      return res.json(parsed);
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
    if (genAI) {
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

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const raw = response.text().replace(/```json|```/g, '').trim();
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
  const bg   = colors.background || (vibe === 'Bold' ? '#000000' : vibe === 'Modern' ? '#0f172a' : '#F5F0E8');
  const text = colors.text       || (vibe === 'Bold' ? '#ffffff' : vibe === 'Modern' ? '#f8fafc' : '#1a1a2e');
  const pri  = colors.primary    || (vibe === 'Bold' ? '#ef4444' : vibe === 'Modern' ? '#6366f1' : '#1a1a2e');
  const acc  = colors.accent     || (vibe === 'Bold' ? '#f59e0b' : vibe === 'Modern' ? '#a855f7' : '#F3DD6D');

  const heroH1 = headlines.hero || `${bizName}<br><span>${cityLabel}'s Best</span>`;
  const heroSub = headlines.sub || `Trusted by hundreds of ${cityLabel} customers for ${t0.toLowerCase()}, ${t1.toLowerCase()}, and results that speak for themselves.`;
  const heroCTA = headlines.cta || '⚡ Get Free Quote';

  const isDark = bg.toLowerCase() === '#0d0d0d' || bg.toLowerCase() === '#000000' || bg.toLowerCase() === '#0f172a';
  const contrastText = isDark ? '#ffffff' : text;
  
  const borderRadius = vibe === 'Classic' ? '0px' : vibe === 'Friendly' ? '32px' : vibe === 'Modern' ? '24px' : '4px';
  const fontFamily = vibe === 'Classic' ? "'Playfair Display', serif" : vibe === 'Modern' ? "'Outfit', sans-serif" : "'Inter', sans-serif";
  const headingWeight = vibe === 'Bold' ? '900' : '800';

  const commonStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:wght@700;900&family=Outfit:wght@400;700;900&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;font-family:${fontFamily}}
    body{background:${bg};color:${contrastText};min-height:100vh;overflow-x:hidden}
    nav{background:${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'};backdrop-filter:blur(10px);padding:18px 36px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};position:sticky;top:0;z-index:100}
    .logo{font-weight:900;font-size:20px;letter-spacing:-1px;color:${contrastText}}
    .nav-cta{background:${acc};color:${pri};padding:10px 24px;border-radius:${borderRadius};font-weight:900;font-size:13px;border:none;box-shadow:0 4px 14px ${acc}44}
  `;

  // Phase 1: Bento Foundation
  const p1 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${commonStyles}
.hero{padding:80px 36px 40px;display:grid;grid-template-columns:1.2fr 0.8fr;gap:48px;align-items:center;max-width:1200px;margin:0 auto}
h1{font-size:52px;font-weight:${headingWeight};line-height:1.0;letter-spacing:-2px;margin-bottom:20px;color:${contrastText}}
h1 span{color:${acc};display:block}
.sub{font-size:18px;opacity:0.8;margin-bottom:32px;line-height:1.6;max-width:500px}
.cta-row{display:flex;gap:14px}
.btn-p{background:${acc};color:${pri};padding:16px 32px;border-radius:${borderRadius};font-weight:900;font-size:15px;border:none;cursor:pointer;transition:transform 0.2s}
.btn-p:hover{transform:translateY(-2px)}
.btn-s{background:transparent;color:${contrastText};padding:16px 28px;border-radius:${borderRadius};font-weight:700;font-size:15px;border:2px solid ${acc};cursor:pointer}
.stars{display:flex;align-items:center;gap:8px;margin-top:24px;font-size:14px;font-weight:700;color:${acc}}
.hero-img{background:linear-gradient(135deg,${pri},${acc}44);border-radius:${borderRadius};height:400px;position:relative;overflow:hidden;box-shadow:0 24px 48px rgba(0,0,0,0.2)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:40px 36px 80px;max-width:1200px;margin:0 auto}
.card{background:${isDark ? 'rgba(255,255,255,0.05)' : '#fff'};border-radius:${borderRadius};padding:32px;border:1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};transition:all 0.3s}
.card:hover{transform:translateY(-5px);border-color:${acc}}
.icon{font-size:32px;margin-bottom:20px}
.card h4{font-size:18px;font-weight:900;margin-bottom:12px;color:${contrastText}}
.card p{font-size:14px;opacity:0.6;line-height:1.6}
</style></head><body>
<nav><div class="logo">${bizName}</div><button class="nav-cta">Get Started</button></nav>
<div class="hero">
  <div><h1>${heroH1}</h1><p class="sub">${heroSub}</p>
  <div class="cta-row"><button class="btn-p">${heroCTA}</button><button class="btn-s">View Work</button></div>
  <div class="stars">★★★★★ <span style="opacity:0.6;color:${contrastText}">4.9/5 · Verified ${cityLabel} Jobs</span></div></div>
  <div class="hero-img"></div>
</div>
<div class="grid">
  <div class="card"><div class="icon">🏆</div><h4>Elite ${t0}</h4><p>We've built our reputation in ${cityLabel} on providing the absolute highest level of ${t0.toLowerCase()}.</p></div>
  <div class="card"><div class="icon">⚡</div><h4>Fast ${t1}</h4><p>When you need ${t1.toLowerCase()}, we respond instantly. We know your time is valueable.</p></div>
  <div class="card"><div class="icon">🛡️</div><h4>Proven ${t2}</h4><p>Trust is earned. Over 200 homeowners in ${cityLabel} rely on our ${t2.toLowerCase()} every year.</p></div>
</div>
</body></html>`;

  // Phase 2: Conversion (Landing Page Style)
  const p2 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${commonStyles}
body{background:#fff;color:#1a1a2e}
.top-bar{background:${pri};color:#fff;padding:12px;text-align:center;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1px}
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:500px}
.content{padding:80px 60px;background:${bg}${isDark ? '' : '11'};display:flex;flex-direction:column;justify-content:center}
h1{font-size:48px;font-weight:${headingWeight};line-height:1.1;margin-bottom:24px;color:${isDark ? contrastText : pri}}
.urgency{background:${acc}33;color:${pri};padding:8px 16px;border-radius:50px;font-size:12px;font-weight:900;margin-bottom:20px;display:inline-block;border:1px solid ${acc}}
.form-container{padding:80px 60px;display:flex;align-items:center;justify-content:center}
.form-card{background:#fff;padding:40px;border-radius:${borderRadius};box-shadow:0 30px 60px rgba(0,0,0,0.1);width:100%;max-width:400px;border:1px solid rgba(0,0,0,0.05)}
h3{font-size:24px;font-weight:900;margin-bottom:8px}
.form-card p{font-size:14px;opacity:0.6;margin-bottom:24px}
input{width:100%;padding:14px;border-radius:12px;border:2px solid #eee;margin-bottom:12px;font-size:15px;outline:none}
input:focus{border-color:${pri}}
.submit-btn{width:100%;padding:16px;background:${pri};color:#fff;border-radius:12px;font-weight:900;border:none;cursor:pointer;font-size:16px}
</style></head><body>
<div class="top-bar">🔥 LIMITED CAPACITY: Only 3 openings left this week in ${cityLabel}</div>
<nav><div class="logo">${bizName}</div><button class="nav-cta">Call Now</button></nav>
<div class="hero">
  <div class="content">
    <div class="urgency">⚡ LIVE IN ${cityLabel.toUpperCase()}</div>
    <h1>Stop Settling for Less than Elite ${t0}</h1>
    <p style="font-size:18px;line-height:1.6;opacity:0.7;margin-bottom:32px">We handle everything for ${bizName} clients — from the first call to the final inspection. Total ${t1.toLowerCase()} and ${t2.toLowerCase()} guaranteed.</p>
    <ul style="list-style:none;gap:12px;display:grid">
      <li style="font-weight:800">✅ 100% Satisfaction Guarantee</li>
      <li style="font-weight:800">✅ Professional & Licensed in ${cityLabel}</li>
      <li style="font-weight:800">✅ Free Estimates Within 24-Hours</li>
    </ul>
  </div>
  <div class="form-container">
    <div class="form-card">
      <h3>Get Your Quote</h3>
      <p>Fill out the form below and our team will contact you within 15 minutes.</p>
      <input placeholder="Full Name" readonly>
      <input placeholder="Phone Number" readonly>
      <input placeholder="Service Needed" readonly>
      <button class="submit-btn">${heroCTA}</button>
    </div>
  </div>
</div>
</body></html>`;

  // Phase 3: Authority (Elite Branding)
  const p3 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${commonStyles}
body{background:#000;color:#fff}
nav{background:transparent;border:none}
.hero{padding:120px 36px;text-align:center;max-width:900px;margin:0 auto}
.badge{background:linear-gradient(to right, ${acc}, ${acc}88);-webkit-background-clip:text;color:transparent;font-weight:900;text-transform:uppercase;letter-spacing:4px;font-size:14px;margin-bottom:24px;display:block}
h1{font-size:72px;font-weight:900;letter-spacing:-4px;margin-bottom:32px}
h1 span{color:${acc}}
p.lead{font-size:20px;opacity:0.6;line-height:1.6;margin-bottom:48px}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;border-top:1px solid rgba(255,255,255,0.1);padding-top:48px}
.stat h2{font-size:48px;font-weight:900;color:${acc};margin-bottom:8px}
.stat p{text-transform:uppercase;font-size:12px;font-weight:900;opacity:0.4;letter-spacing:2px}
.btn-elite{background:#fff;color:#000;padding:20px 48px;border-radius:100px;font-weight:900;text-transform:uppercase;letter-spacing:2px;border:none;cursor:pointer}
</style></head><body>
<nav><div class="logo">${bizName.toUpperCase()} <span>.</span></div><button class="nav-cta" style="background:#fff;color:#000">Elite Access</button></nav>
<div class="hero">
  <span class="badge">The Authority in ${cityLabel}</span>
  <h1>The Standard of <span>${t0}</span></h1>
  <p class="lead">${bizName} combines architectural precision with elite ${t1.toLowerCase()}. We don't just do the job — we redefine what's possible for ${cityLabel} clients.</p>
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
  if (genAI) {
    try {
      const systemPrompt = `You are the "AdHello Growth Assistant" — an expert in AI-powered marketing and websites for home service businesses (painters, electricians, plumbers, roofers, etc.).
Help the user understand how AdHello.ai works. We automate:
1. Smart Website building (conversion-optimized)
2. AI Search (GEO) ranking
3. AI Webchat for 24/7 lead capture
4. ROI Strategy Blueprints
Be professional, helpful, and energetic. Keep responses under 3 paragraphs.`;
      
      const history = (messages || []).slice(-5).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text || m.content}`).join('\n\n');
      const prompt = `${systemPrompt}\n\n${history}\n\nUser: ${userMessage}\n\nAssistant:`;

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      replyText = response.text();
    } catch (err) {
      console.error('[SITE-CHAT] Gemini error:', err);
    }
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

    if (genAI) {
      try {
        const systemPrompt = `You are the "GEO Ranking Coach" for AdHello.ai — an elite local SEO and digital growth expert.
You are coaching ${bizName} in ${city}. Their AEO score is ${score}/100.
${auditContext}
Give actionable advice that references their ACTUAL audit data. When they ask how to improve a score or fix an issue, cite the EXACT failing checks and explain step-by-step how to fix it.
Be concise (2-4 paragraphs max), conversational, and highly specific. Use bullet points. Be encouraging but direct.`;

        const historyText = history.slice(0, -1).map(m =>
          `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`
        ).join('\n\n');

        const fullPrompt = `${systemPrompt}\n\n${historyText ? 'Conversation:\n' + historyText + '\n\n' : ''}User: ${message}\n\nCoach:`;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        replyText = response.text();
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

app.post('/api/stitch-design', (req, res) => res.json({ success: true }));
app.post('/api/ad-brief/generate-image', (req, res) => res.json({ imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000' }));

app.use(express.static(DIST_DIR));
app.get('*', (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
