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
            console.log('[AI] Attempting Gemini analysis...');
            const genAI = new GoogleGenAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Promise.race to ensure Gemini doesn't hang the thread
            const geminiPromise = model.generateContent({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' }
            });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('GeminiTimeout')), 10000));

            const result = await Promise.race([geminiPromise, timeoutPromise]);
            
            const geminiText = result.response?.text?.() || result.text;
            if (geminiText) {
              reportContent = geminiText;
              usedModel = 'Gemini';
            }
          } catch (e) {
            console.error(`[AI] Gemini error: ${e.message === 'GeminiTimeout' ? 'Timed out (10s)' : e.message}`);
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
