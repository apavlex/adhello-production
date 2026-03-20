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
  console.log(`${req.method} ${req.url}`);

  // API Endpoint for website analysis
  if (req.method === 'POST' && req.url === '/api/analyze') {
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
        const { url } = JSON.parse(body);
        if (!url) {
          clearTimeout(globalTimeout);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'URL is required' }));
        }
        
        console.log(`[ANALYSIS] Starting check for: ${url}`);
        console.log(`[DEBUG] GEMINI_API_KEY present: ${!!GEMINI_API_KEY}`);
        
        const prompt = `Analyze the website ${url} and provide an AEO (Answer Engine Optimization) report in JSON format.
        
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
            const geminiPromise = genAI.models.generateContent({
              model: modelName,
              contents: [{ role: "user", parts: [{ text: prompt }] }],
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
  if (req.method === 'POST' && req.url === '/api/ad-brief') {
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
  if (req.method === 'POST' && req.url === '/api/generate-ad-image') {
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
  if (req.method === 'POST' && req.url === '/api/chat') {
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

        const systemInstruction = `You are a helpful, professional, and friendly sales assistant for AdHello.ai.
AdHello.ai provides smart websites, AI-powered local SEO, and AEO optimization for home service businesses (HVAC, Plumbing, Electrical, Roofing, Flooring, Painting, etc.).

YOUR GOAL: Discover the user needs and guide them to book a demo meeting.

DISCOVERY QUESTIONS TO ASK:
- What kind of home service business do you run?
- How are you currently getting leads?
- What is your biggest challenge with your current website or marketing?

Once you understand their pain points, explain how AdHello solves them (e.g., 24/7 lead capture, SEO automation, AI search optimization, sites live in 7 days) and suggest booking a demo at https://calendar.app.google/QQsVbiAt4QdCX8mx8

FORMATTING RULES:
- DO NOT use markdown bolding (like **text**).
- Use plain text only.
- Keep responses concise and conversational (2-3 sentences max).

If they want to talk to a human, tell them to click the phone icon in the chat header or call (360) 773-1505.`;

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

  // API Endpoint for networking events — reads public iCal feed (no API key needed)
  if (req.method === 'GET' && req.url === '/api/events') {
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

      console.log(`[EVENTS] iCal parsed: ${events.length} upcoming events`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ events: events.slice(0, 5) }));
    } catch (err) {
      console.error('[EVENTS] Error:', err.message);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ events: [] }));
    }
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
