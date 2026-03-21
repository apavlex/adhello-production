import http from 'http';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, 'dist');

// Global error handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

// API Keys — set these in your .env.local or Cloud Run environment variables
const KIE_API_KEY = process.env.KIE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log(`[STARTUP] AdHello AI Server initializing...`);
console.log(`[STARTUP] Node Version: ${process.version}`);
console.log(`[STARTUP] Target Port: ${PORT}`);
console.log(`[STARTUP] Serving static files from: ${DIST_DIR}`);
console.log(`[STARTUP] GEMINI_API_KEY status: ${GEMINI_API_KEY ? 'Present ✓' : 'MISSING ✗ — set GEMINI_API_KEY env var'}`);

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer(async (req, res) => {
  const reqPath = req.url.split('?')[0]; // strip query string for all routing
  console.log(`${req.method} ${reqPath}`);
  // v2.2 — clean path routing, iCal events + GEO audit + lead gate + email

  // API Endpoint for website analysis
  if (req.method === 'POST' && reqPath === '/api/analyze') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      const globalTimeout = setTimeout(() => {
        if (!res.writableEnded) {
          console.error('[TIMEOUT] Analysis watchdog triggered (25s), aborting request');
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Analysis timeout', 
            detail: 'The AI analysis took too long. We have tightened limits to ensure the server responds before your connection drops. Please try a simpler URL.' 
          }));
        }
      }, 25000); // 25s global watchdog

      try {
        const body_parsed = JSON.parse(body);
        const { url } = body_parsed;
        if (!url) {
          clearTimeout(globalTimeout);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'URL is required' }));
        }
        
        console.log(`[ANALYSIS] Starting check for: ${url}`);
        console.log(`[DEBUG] GEMINI_API_KEY present: ${!!GEMINI_API_KEY}`);
        
        const prompt = `Analyze the website ${url} and provide an GEO (Generative Engine Optimization) report in JSON format.
        
        The JSON must have this exact structure:
        {
          "score": number (0-100),
          "mobileFirstScore": number (0-100),
          "leadsEstimatesScore": number (0-100),
          "googleAiReadyScore": number (0-100),
          "summary": "string",
          "brandAnalysis": "string",
          "technicalAudit": {
            "mobileSpeed": { "label": "Mobile Load Speed", "status": "pass" or "fail" or "warning", "value": "string", "reason": "string" },
            "contactForm": { "label": "Contact Form", "status": "pass" or "fail" or "warning", "value": "string", "reason": "string" },
            "sslCertificate": { "label": "SSL Certificate", "status": "pass" or "fail" or "warning", "value": "string", "reason": "string" },
            "metaDescription": { "label": "Meta Description", "status": "pass" or "fail" or "warning", "value": "string", "reason": "string" },
            "googleBusinessProfile": { "label": "Google Business Profile", "status": "pass" or "fail" or "warning", "value": "string", "reason": "string" },
            "reviewSentiment": { "label": "Review Sentiment", "status": "pass" or "fail" or "warning", "value": "string", "reason": "string" }
          },
          "strengths": [{"indicator": "string", "description": "string"}],
          "weaknesses": [{"indicator": "string", "description": "string"}],
          "recommendations": [{"title": "string", "description": "string", "action": "string"}]
        }
        
        IMPORTANT: Return only raw JSON. Do not wrap in markdown code fences or add any text before or after the JSON.`;

        let reportContent = null;
        let usedModel = null;

        // Gemini only analysis
        if (GEMINI_API_KEY && !res.writableEnded) {
          try {
            console.log("[AI] Attempting Gemini analysis...");
            const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

            // Promise.race to ensure Gemini does not hang the thread
            // Using gemini-2.0-flash (nano banana 2)
            const modelName = "gemini-2.0-flash";
            console.log(`[AI] Using model: ${modelName}`);
            // Lite mode: request shorter output for faster response
            const isLite = body_parsed.lite !== false; // default to lite
            const lengthHint = isLite
              ? "Keep ALL text fields concise (1-2 sentences max). Return max 3 strengths, 3 weaknesses, 3 recommendations."
              : "Provide detailed analysis.";
            const fullPrompt = prompt + "\n\n" + lengthHint;

            const geminiPromise = genAI.models.generateContent({
              model: modelName,
              contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
              config: { responseMimeType: "application/json" }
            });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("GeminiTimeout")), 10000));

            const result = await Promise.race([geminiPromise, timeoutPromise]);

            const geminiText = result.text;
            if (geminiText) {
              reportContent = geminiText;
              usedModel = "Gemini";
            }
          } catch (e) {
            if (e.message === "GeminiTimeout") {
              console.error("[AI] Gemini error: Timed out (10s)");
            } else {
              console.error("[AI] Gemini error:", e.message);
              console.error("[AI] Gemini error details:", JSON.stringify(e?.errorDetails || e?.status || "no details"));
            }
          }
        }

        if (res.writableEnded) return;
        clearTimeout(globalTimeout);

        if (!reportContent) {
          console.error('[ANALYSIS] All AI providers failed.');
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ 
            error: 'Analysis failed', 
            detail: GEMINI_API_KEY ? 'Gemini was unable to provide a report. Please check server logs for details.' : 'GEMINI_API_KEY is missing. Please configure it in your environment.'
          }));
        }

        // Strip markdown code fences if AI wrapped the JSON (e.g. ```json ... ```)
        const cleanedContent = reportContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

        // Validate it's actually parseable JSON before sending
        try {
          JSON.parse(cleanedContent);
        } catch (parseErr) {
          console.error('[ANALYSIS] AI returned invalid JSON:', parseErr.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            error: 'Analysis failed',
            detail: 'The AI returned a malformed report. Please try again.'
          }));
        }

        console.log(`[SUCCESS] Analysis complete using ${usedModel}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(cleanedContent);
      } catch (error) {
        if (res.writableEnded) return;
        clearTimeout(globalTimeout);
        console.error('[CRITICAL] Analysis error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Internal processing error',
          detail: error.message || 'An unexpected error occurred during website analysis.'
        }));
      }
    });
    return;
  }

  // API Endpoint for ad brief image analysis
  if (req.method === 'POST' && reqPath === '/api/ad-brief') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { imageBase64, mimeType } = JSON.parse(body);
        if (!imageBase64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'imageBase64 is required' }));
        }

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'GEMINI_API_KEY is missing. Please configure it in your environment.' }));
        }

        const { GoogleGenAI } = await import('@google/genai');
        const genAI = new GoogleGenAI({ apiKey: geminiKey });

        console.log('[AD-BRIEF] Starting image analysis with gemini-2.0-flash');

        const result = await genAI.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType || 'image/jpeg',
                    data: imageBase64
                  }
                },
                {
                  text: `Analyze this product/service image and provide a comprehensive marketing brief for a home service or local business. Return ONLY valid JSON with this exact structure:
{
  "productAnalysis": "A detailed 2-3 sentence description of what is shown in the image and what service/product it represents.",
  "visualPrompt": "A highly detailed visual description for generating similar ad images.",
  "targetAudience": ["Audience segment 1", "Audience segment 2", "Audience segment 3"],
  "marketInsights": ["Key market insight 1", "Key market insight 2"],
  "competitiveAdvantages": ["Advantage 1", "Advantage 2"],
  "adConcepts": [
    { "platform": "Instagram", "headline": "Catchy headline under 10 words", "body": "Persuasive 1-2 sentence ad copy", "cta": "Call to action" },
    { "platform": "Facebook", "headline": "Catchy headline under 10 words", "body": "Persuasive 1-2 sentence ad copy", "cta": "Call to action" },
    { "platform": "Google", "headline": "Search ad headline under 30 chars", "body": "Description under 90 chars", "cta": "Call to action" }
  ]
}`
                }
              ]
            }
          ],
          config: { responseMimeType: 'application/json' }
        });

        const text = result.text;
        // Strip markdown fences if present
        const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(clean);

        console.log('[AD-BRIEF] Analysis complete');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(parsed));
      } catch (err) {
        console.error('[AD-BRIEF] Error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Ad brief analysis failed' }));
      }
    });
    return;
  }

  // API Endpoint for ad image generation (Imagen 3)
  if (req.method === 'POST' && reqPath === '/api/generate-ad-image') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { prompt } = JSON.parse(body);
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'GEMINI_API_KEY is missing.' }));
        }
        const { GoogleGenAI } = await import('@google/genai');
        const genAI = new GoogleGenAI({ apiKey: geminiKey });
        console.log('[AD-IMAGE] Generating image with gemini-2.0-flash');
        const response = await genAI.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: [{ parts: [{ text: prompt }] }],
          config: { responseModalities: ['IMAGE', 'TEXT'] }
        });

        // Extract inline image data from response parts
        let imageBytes = null;
        let mimeType = 'image/jpeg';
        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            imageBytes = part.inlineData.data;
            mimeType = part.inlineData.mimeType || 'image/jpeg';
            break;
          }
        }
        if (!imageBytes) throw new Error('No image returned by model');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ imageBase64: imageBytes, mimeType }));
      } catch (err) {
        console.error('[AD-IMAGE] Error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Image generation failed' }));
      }
    });
    return;
  }

  // API Endpoint for sales chatbot
  if (req.method === 'POST' && reqPath === '/api/chat') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { messages, userMessage } = JSON.parse(body);
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'GEMINI_API_KEY is missing.' }));
        }
        const { GoogleGenAI } = await import('@google/genai');
        const genAI = new GoogleGenAI({ apiKey: geminiKey });

        const systemInstruction = `You are the AdHello Growth Coach — a sharp, practical AI advisor for local home service businesses (painters, plumbers, HVAC, electricians, roofers, flooring, etc.).

YOUR ROLE: Be a genuinely useful growth advisor. Give real, specific, actionable advice on marketing, lead generation, pricing, customer retention, seasonal strategy, online presence, and AI tools for their trade. Think like a business consultant who actually knows the home services industry.

KNOWLEDGE YOU DRAW FROM:
- Local SEO tactics that actually work for contractors (Google Business Profile, reviews, service-area pages)
- How AI search (ChatGPT, Perplexity, Google AI) is changing how homeowners find contractors
- Seasonal lead generation (e.g. AC tune-ups before summer, heating before winter, exterior painting in spring)
- Winning back past customers via text/email campaigns
- Pricing strategy, upselling, and job ticket size
- How to turn a website into a 24/7 lead machine vs a digital business card
- Social proof, review generation, and trust signals
- Ad strategy for Google/Meta on contractor budgets

CONVERSATION STYLE:
- Ask ONE follow-up question per response to go deeper before giving advice
- Lead with curiosity — understand their situation first, then give targeted advice
- Keep responses to 2-3 sentences MAX before asking a follow-up question
- Don't dump a wall of advice on the first message — earn it through questions

HOW TO HANDLE BOOKING:
- After giving a concrete piece of advice, end with ONE short line offering AdHello's help
- Use the CORRECT booking link: https://calendar.app.google/QQsVbiAt4QdCX8mx8
- Example: "Want us to handle this for you? Book a free call: https://calendar.app.google/QQsVbiAt4QdCX8mx8"
- Keep it one sentence. Never paste it twice. Never make it the focus.

FORMATTING RULES:
- No markdown bolding (**text**) — plain text only
- Conversational, direct, like a smart friend in the industry
- 2-4 sentences per response max — be punchy, not preachy
- Ask one follow-up question at a time to go deeper

If they want to talk to a human: click the phone icon above or call (360) 773-1505.`;

        // Build conversation history for context
        const history = (messages || []).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

        const result = await genAI.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: [
            { role: 'user', parts: [{ text: systemInstruction + '\n\nConversation so far:\n' + history.map(h => h.role + ': ' + h.parts[0].text).join('\n') + '\n\nUser: ' + userMessage }] }
          ]
        });

        const responseText = result.text;
        console.log('[CHAT] Response generated');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text: responseText }));
      } catch (err) {
        console.error('[CHAT] Error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API Endpoint for networking events — reads public iCal feed + hardcoded fallback
  if (req.method === 'GET' && reqPath === '/api/events') {
    // Hardcoded fallback events (always shown if still in future)
    const FALLBACK_EVENTS = [
      {
        id: '01avmdgt3eamai522ls90r3ane',
        title: 'Coffee/Tea Business Networking & AI',
        description: 'Join fellow small business owners, founders, and professionals for an in-person networking event focused on how AI is already changing local business.',
        location: 'Presso Coffee Co, 2011 SE 192nd Ave Ste 103, Camas, WA 98607, USA',
        start: '2026-04-02T18:00:00-07:00',
        end: '2026-04-02T20:00:00-07:00',
        url: 'https://calendar.google.com/calendar/embed?src=c_02916cf18d360ab381023fabc7b420ec226d7579ae2a08ce0507e574cc1c1a96%40group.calendar.google.com&ctz=America%2FLos_Angeles'
      }
    ].filter(e => new Date(e.start).getTime() > Date.now());

    try {
      const icalUrl = 'https://calendar.google.com/calendar/ical/c_02916cf18d360ab381023fabc7b420ec226d7579ae2a08ce0507e574cc1c1a96%40group.calendar.google.com/public/basic.ics';
      const calPageUrl = 'https://calendar.google.com/calendar/embed?src=c_02916cf18d360ab381023fabc7b420ec226d7579ae2a08ce0507e574cc1c1a96%40group.calendar.google.com&ctz=America%2FLos_Angeles';

      const response = await fetch(icalUrl);
      if (!response.ok) {
        console.log('[EVENTS] iCal fetch failed:', response.status);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ events: [] }));
      }

      const ical = await response.text();
      console.log('[EVENTS] iCal length:', ical.length, 'chars, contains VEVENT:', ical.includes('VEVENT'));
      const now = Date.now();
      const events = [];

      // Parse VEVENT blocks from iCal
      const veventRegex = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
      let match;
      while ((match = veventRegex.exec(ical)) !== null) {
        const block = match[1];

        const get = (key) => {
          const m = block.match(new RegExp(`${key}[^:]*:([^\r\n]+(?:\r?\n[ \t][^\r\n]+)*)`));
          if (!m) return '';
          return m[1].replace(/\r?\n[ \t]/g, '').replace(/\\,/g, ',').replace(/\\n/g, ' ').trim();
        };

        const dtstart = get('DTSTART');
        const dtend = get('DTEND');
        const summary = get('SUMMARY');
        const location = get('LOCATION');
        const uid = get('UID');

        if (!dtstart || !summary) continue;

        // Parse iCal date format: 20260403T010000Z or 20260403T010000
        const parseIcalDate = (s) => {
          const clean = s.replace(/[^0-9TZ]/g, '');
          if (clean.endsWith('Z')) {
            const y=clean.slice(0,4), mo=clean.slice(4,6), d=clean.slice(6,8);
            const h=clean.slice(9,11), mi=clean.slice(11,13), sc=clean.slice(13,15);
            return new Date(`${y}-${mo}-${d}T${h}:${mi}:${sc}Z`);
          }
          const y=clean.slice(0,4), mo=clean.slice(4,6), d=clean.slice(6,8);
          if (clean.length === 8) return new Date(`${y}-${mo}-${d}`);
          const h=clean.slice(9,11), mi=clean.slice(11,13), sc=clean.slice(13,15);
          return new Date(`${y}-${mo}-${d}T${h}:${mi}:${sc}-07:00`);
        };

        const startDate = parseIcalDate(dtstart);
        const endDate = parseIcalDate(dtend || dtstart);

        // Only show future events
        if (startDate.getTime() < now) continue;

        const description = get('DESCRIPTION') || calDescription;
        events.push({
          id: uid,
          title: summary,
          description: description,
          location: location,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          url: calPageUrl
        });
      }

      // Sort by start time
      events.sort((a, b) => new Date(a.start) - new Date(b.start));

      const finalEvents = events.length > 0 ? events.slice(0, 5) : FALLBACK_EVENTS;
      console.log(`[EVENTS] iCal parsed: ${events.length} events, serving: ${finalEvents.length}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ events: finalEvents }));
    } catch (err) {
      console.error('[EVENTS] iCal error:', err.message, '— using fallback');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ events: FALLBACK_EVENTS }));
    }
    return;
  }

  // API Endpoint for GEO (Generative Engine Optimization) audit
  if (req.method === 'POST' && reqPath === '/api/geo-analyze') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      const globalTimeout = setTimeout(() => {
        if (!res.writableEnded) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'GEO analysis timeout', detail: 'Analysis took too long. Please try again.' }));
        }
      }, 28000);

      try {
        const { url } = JSON.parse(body);
        if (!url) {
          clearTimeout(globalTimeout);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'URL is required' }));
        }

        if (!GEMINI_API_KEY) {
          clearTimeout(globalTimeout);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'GEMINI_API_KEY is missing.' }));
        }

        console.log(`[GEO] Starting GEO audit for: ${url}`);

        const geoPrompt = `You are an expert in GEO (Generative Engine Optimization) — the practice of optimizing websites to be cited by AI-powered search engines like ChatGPT, Perplexity, Gemini, and Google AI Overviews.

Analyze the website at this URL: ${url}

Based on what you know or can infer about this site, provide a comprehensive GEO audit. Return ONLY valid JSON with this exact structure:

{
  "geoScore": number (0-100, the overall GEO readiness score),
  "citabilityScore": number (0-100),
  "brandAuthorityScore": number (0-100),
  "eeeatScore": number (0-100),
  "technicalScore": number (0-100),
  "schemaScore": number (0-100),
  "platformScore": number (0-100),
  "geoSummary": "string (2-3 sentence executive summary of GEO health)",
  "crawlerAccess": [
    { "name": "GPTBot", "operator": "OpenAI", "status": "allowed" or "blocked" or "unknown", "impact": "string" },
    { "name": "ClaudeBot", "operator": "Anthropic", "status": "allowed" or "blocked" or "unknown", "impact": "string" },
    { "name": "PerplexityBot", "operator": "Perplexity", "status": "allowed" or "blocked" or "unknown", "impact": "string" },
    { "name": "Google-Extended", "operator": "Google", "status": "allowed" or "blocked" or "unknown", "impact": "string" },
    { "name": "Applebot-Extended", "operator": "Apple", "status": "allowed" or "blocked" or "unknown", "impact": "string" }
  ],
  "platformReadiness": [
    { "platform": "Google AI Overviews", "score": number, "gap": "string", "action": "string" },
    { "platform": "ChatGPT Search", "score": number, "gap": "string", "action": "string" },
    { "platform": "Perplexity AI", "score": number, "gap": "string", "action": "string" },
    { "platform": "Gemini", "score": number, "gap": "string", "action": "string" }
  ],
  "criticalIssues": ["string", "string"],
  "quickWins": [
    { "action": "string", "impact": "High" or "Medium", "effort": "string" },
    { "action": "string", "impact": "High" or "Medium", "effort": "string" },
    { "action": "string", "impact": "High" or "Medium", "effort": "string" }
  ],
  "llmsTxtStatus": "present" or "missing" or "unknown",
  "schemaTypes": ["string"],
  "missingSchemas": ["string"],
  "brandPresence": {
    "wikipedia": "present" or "missing",
    "wikidata": "present" or "missing",
    "youtube": "present" or "missing",
    "reddit": "present" or "missing",
    "linkedin": "present" or "missing"
  }
}

IMPORTANT: Return only raw JSON with no markdown fences or extra text.`;

        const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const geoPromise = genAI.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: [{ role: 'user', parts: [{ text: geoPrompt }] }],
          config: { responseMimeType: 'application/json' }
        });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('GeminiTimeout')), 20000));

        const result = await Promise.race([geoPromise, timeoutPromise]);
        const raw = result.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

        try {
          JSON.parse(raw);
        } catch (e) {
          throw new Error('AI returned invalid JSON for GEO report');
        }

        if (res.writableEnded) return;
        clearTimeout(globalTimeout);
        console.log('[GEO] Audit complete');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(raw);
      } catch (err) {
        if (res.writableEnded) return;
        clearTimeout(globalTimeout);
        console.error('[GEO] Error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'GEO analysis failed', detail: err.message }));
      }
    });
    return;
  }

  // API Endpoint — capture site audit leads and email notification
  if (req.method === 'POST' && reqPath === '/api/lead') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { name, email, source, url: siteUrl, message } = JSON.parse(body);
        const ts = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        console.log(`[LEAD] New lead: ${name} <${email}> via ${source || 'unknown'} at ${ts}${siteUrl ? ' — '+siteUrl : ''}`);

        // Send email via Resend (free tier: 100 emails/day, no 2FA needed)
        const resendKey = process.env.RESEND_API_KEY;

        if (resendKey) {
          try {
            const { Resend } = await import('resend');
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: 'AdHello Leads <leads@adhello.ai>',
              to: 'alex@adhello.ai',
              subject: `🔥 New Lead: ${name} — ${source === 'ad-brief' ? 'Ad Brief' : 'Site Audit'}`,
              html: `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
                  <div style="background:#0d1520;border-radius:16px;padding:24px;margin-bottom:20px">
                    <h2 style="color:#E8B84B;margin:0 0 4px;font-size:20px">🔥 New Lead</h2>
                    <p style="color:rgba(255,255,255,0.5);margin:0;font-size:13px">via AdHello.ai — ${source === 'ad-brief' ? 'Ad Brief Generator' : 'Site Audit Tool'}</p>
                  </div>
                  <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
                    <tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;width:110px">Name</td><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-weight:700;color:#0d1520;font-size:15px">${name}</td></tr>
                    <tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Email</td><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-weight:700;font-size:15px"><a href="mailto:${email}" style="color:#E8B84B;text-decoration:none">${email}</a></td></tr>
                    ${siteUrl ? `<tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Website</td><td style="padding:12px 0;font-weight:700;font-size:15px"><a href="https://${siteUrl}" style="color:#E8B84B;text-decoration:none">${siteUrl}</a></td></tr>` : ''}
                    ${message ? `<tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Notes</td><td style="padding:12px 0;font-weight:600;color:#555;font-size:13px">${message}</td></tr>` : ''}
                    <tr><td style="padding:12px 0;color:#888;font-size:13px">Time</td><td style="padding:12px 0;font-weight:600;color:#555;font-size:13px">${ts} PT</td></tr>
                  </table>
                  <a href="mailto:${email}?subject=Your Free AdHello.ai Report is Ready&body=Hi ${name},%0D%0A%0D%0AThanks for trying AdHello.ai! I wanted to personally follow up..." style="display:inline-block;background:#E8B84B;color:#0d1520;font-weight:900;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px">Reply to ${name} →</a>
                  <p style="color:#ccc;font-size:11px;margin-top:24px">AdHello.ai · Camas, WA · adhello.ai</p>
                </div>
              `
            });
            console.log('[LEAD] Email sent via Resend to alex@adhello.ai');
          } catch (emailErr) {
            console.error('[LEAD] Resend error:', emailErr.message);
          }
        } else {
          console.log('[LEAD] RESEND_API_KEY not set — skipping email (lead still logged above)');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        console.error('[LEAD] Error:', err.message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false }));
      }
    });
    return;
  }

  // API Endpoint — email the full GEO report to the business
  if (req.method === 'POST' && reqPath === '/api/send-report') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { name, email, url, aeoReport, geoReport } = JSON.parse(body);
        const resendKey = process.env.RESEND_API_KEY;
        if (!resendKey) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ ok: false, reason: 'No RESEND_API_KEY' }));
        }

        const score = aeoReport?.score ?? 0;
        const geoScore = geoReport?.geoScore ?? 0;
        const scoreColor = score >= 80 ? '#22c55e' : score >= 50 ? '#E8B84B' : '#ef4444';
        const geoColor = geoScore >= 80 ? '#22c55e' : geoScore >= 50 ? '#E8B84B' : '#ef4444';

        const strengthsList = (aeoReport?.strengths || []).slice(0, 3)
          .map(s => `<li style="margin-bottom:6px;color:#374151">✅ ${s.indicator} — ${s.description}</li>`).join('');
        const weaknessList = (aeoReport?.weaknesses || []).slice(0, 3)
          .map(w => `<li style="margin-bottom:6px;color:#374151">⚠️ ${w.indicator} — ${w.description}</li>`).join('');
        const quickWins = (geoReport?.quickWins || []).slice(0, 3)
          .map(q => `<li style="margin-bottom:6px;color:#374151">🎯 <strong>${q.action}</strong> — Impact: ${q.impact}</li>`).join('');
        const criticalIssues = (geoReport?.criticalIssues || []).slice(0, 3)
          .map(i => `<li style="margin-bottom:6px;color:#dc2626">🚨 ${i}</li>`).join('');

        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: 'AdHello.ai <results@adhello.ai>',
          to: email,
          bcc: 'alex@adhello.ai',
          subject: `Your Free GEO Report for ${url} — AdHello.ai`,
          html: `
            <div style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:0;background:#f9f9f6">
              <!-- Header -->
              <div style="background:#0d1520;padding:32px 40px;border-radius:16px 16px 0 0;text-align:center">
                <h1 style="color:#E8B84B;margin:0 0 6px;font-size:24px;font-weight:900">AdHello.ai</h1>
                <p style="color:rgba(255,255,255,0.5);margin:0;font-size:13px">AI-Powered Marketing for Home Service Businesses</p>
              </div>

              <!-- Body -->
              <div style="background:white;padding:36px 40px">
                <h2 style="color:#0d1520;font-size:22px;margin:0 0 8px">Hi ${name},</h2>
                <p style="color:#555;margin:0 0 24px;line-height:1.6">Here's your free GEO report for <strong>${url}</strong>. We analyzed your site for AI search readiness, citation potential, and technical optimization.</p>

                <!-- Score cards -->
                <div style="display:flex;gap:16px;margin-bottom:28px">
                  <div style="flex:1;background:#f9f9f6;border-radius:12px;padding:20px;text-align:center;border:2px solid ${scoreColor}20">
                    <div style="font-size:48px;font-weight:900;color:${scoreColor};line-height:1">${score}</div>
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-top:4px">GEO Score</div>
                  </div>
                  <div style="flex:1;background:#f9f9f6;border-radius:12px;padding:20px;text-align:center;border:2px solid ${geoColor}20">
                    <div style="font-size:48px;font-weight:900;color:${geoColor};line-height:1">${geoScore}</div>
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-top:4px">GEO Score</div>
                  </div>
                </div>

                <!-- Summary -->
                ${aeoReport?.summary ? `<p style="color:#555;line-height:1.7;background:#f9f9f6;padding:16px;border-radius:10px;margin-bottom:24px">${aeoReport.summary}</p>` : ''}

                ${strengthsList ? `
                <h3 style="color:#0d1520;font-size:15px;margin:0 0 10px">✅ What's Working</h3>
                <ul style="margin:0 0 24px;padding-left:0;list-style:none">${strengthsList}</ul>` : ''}

                ${weaknessList ? `
                <h3 style="color:#0d1520;font-size:15px;margin:0 0 10px">⚠️ Areas to Improve</h3>
                <ul style="margin:0 0 24px;padding-left:0;list-style:none">${weaknessList}</ul>` : ''}

                ${criticalIssues ? `
                <h3 style="color:#dc2626;font-size:15px;margin:0 0 10px">🚨 Critical Issues</h3>
                <ul style="margin:0 0 24px;padding-left:0;list-style:none">${criticalIssues}</ul>` : ''}

                ${quickWins ? `
                <h3 style="color:#0d1520;font-size:15px;margin:0 0 10px">🎯 Quick Wins</h3>
                <ul style="margin:0 0 24px;padding-left:0;list-style:none">${quickWins}</ul>` : ''}

                <!-- GEO summary -->
                ${geoReport?.geoSummary ? `<p style="color:#555;line-height:1.7;background:#f0fdf4;padding:16px;border-radius:10px;border-left:3px solid #22c55e;margin-bottom:28px">${geoReport.geoSummary}</p>` : ''}

                <!-- CTA -->
                <div style="background:#0d1520;border-radius:14px;padding:28px;text-align:center;margin-top:8px">
                  <p style="color:rgba(255,255,255,0.7);margin:0 0 16px;font-size:14px">Want AdHello to fix these issues and get your business showing up on Google, ChatGPT, and Perplexity?</p>
                  <a href="https://calendar.app.google/QQsVbiAt4QdCX8mx8" style="display:inline-block;background:#E8B84B;color:#0d1520;font-weight:900;padding:14px 32px;border-radius:999px;text-decoration:none;font-size:15px">Book a Free Strategy Call →</a>
                </div>
              </div>

              <!-- Footer -->
              <div style="padding:20px 40px;text-align:center">
                <p style="color:#aaa;font-size:11px;margin:0">AdHello.ai · Camas, WA · <a href="https://adhello.ai" style="color:#E8B84B">adhello.ai</a></p>
                <p style="color:#ccc;font-size:10px;margin:6px 0 0">You received this because you requested a free site audit at adhello.ai</p>
              </div>
            </div>
          `
        });

        console.log(`[REPORT] Emailed report to ${email} for ${url}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        console.error('[REPORT] Email error:', err.message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  filePath = filePath.split('?')[0];

  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile(path.join(DIST_DIR, 'index.html'), (err, indexContent) => {
          if (err) {
            res.writeHead(500);
            res.end(`Error: ${err.code}`);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const addr = server.address();
  console.log(`[SUCCESS] Server running at http://${addr.address}:${addr.port}/`);
  console.log(`[INFO] Serving static assets from ${DIST_DIR}`);
}).on('error', (err) => {
  if (err.code === 'EPERM') {
    console.error(`CRITICAL: Port ${PORT} is restricted (EPERM). Use PORT=<available_port> to override.`);
  } else if (err.code === 'EADDRINUSE') {
    console.error(`CRITICAL: Port ${PORT} is already in use.`);
  } else {
    console.error('Server failed to start:', err);
  }
  process.exit(1);
});
// Fri Mar 20 22:35:06 UTC 2026
