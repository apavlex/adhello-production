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

// API Key fallbacks (environment variables from .env or platform should take precedence)
const KIE_API_KEY = process.env.KIE_API_KEY || '947d584b060f8c7bc799b6e3f1a100ec';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''; 

console.log(`[STARTUP] AdHello AI Server initializing...`);
console.log(`[STARTUP] Node Version: ${process.version}`);
console.log(`[STARTUP] Target Port: ${PORT}`);
console.log(`[STARTUP] Serving static files from: ${DIST_DIR}`);
console.log(`[STARTUP] KIE_API_KEY status: ${KIE_API_KEY ? 'Present' : 'MISSING'}`);
console.log(`[STARTUP] GEMINI_API_KEY status: ${GEMINI_API_KEY ? 'Present' : 'MISSING'}`);

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
          console.error('[TIMEOUT] Analysis took too long, sending 504/503 fallback');
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Analysis timeout', 
            detail: 'The website analysis took too long to respond. Please try again with a different URL or at a later time.' 
          }));
        }
      }, 28000); // 28s global timeout to beat most proxy timeouts

      try {
        const { url } = JSON.parse(body);
        if (!url) {
          clearTimeout(globalTimeout);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'URL is required' }));
        }
        
        const prompt = `Analyze the website ${url} and provide an AEO (Answer Engine Optimization) report in JSON format.
        
        CRITICAL: Be extremely stringent. Most sites are NOT ready for the AI-first search era. 
        If a site is just standard SEO, score it poorly (40-60) as it lacks semantic structure for AI agents.

        The JSON must have this exact structure:
        {
          "score": number (0-100),
          "mobileFirstScore": number (0-100),
          "leadsEstimatesScore": number (0-100),
          "googleAiReadyScore": number (0-100),
          "summary": "string",
          "brandAnalysis": "string",
          "technicalAudit": {
            "mobileSpeed": { "label": "Mobile Load Speed", "status": "pass|fail|warning", "value": "string", "reason": "string" },
            "contactForm": { "label": "Contact Form", "status": "pass|fail|warning", "value": "string", "reason": "string" },
            "sslCertificate": { "label": "SSL Certificate", "status": "pass|fail|warning", "value": "string", "reason": "string" },
            "metaDescription": { "label": "Meta Description", "status": "pass|fail|warning", "value": "string", "reason": "string" },
            "googleBusinessProfile": { "label": "Google Business Profile", "status": "pass|fail|warning", "value": "string", "reason": "string" },
            "reviewSentiment": { "label": "Review Sentiment", "status": "pass|fail|warning", "value": "string", "reason": "string" }
          },
          "strengths": [{"indicator": "string", "description": "string"}],
          "weaknesses": [{"indicator": "string", "description": "string"}],
          "recommendations": [{"title": "string", "description": "string", "action": "string"}]
        }`;

        let reportContent = null;
        let usedModel = null;

        // Attempt Kie.ai first
        if (KIE_API_KEY && !res.writableEnded) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // Tightened to 15s

          try {
            console.log('Attempting analysis with Kie.ai...');
            const kieResponse = await fetch('https://api.kie.ai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KIE_API_KEY}`
              },
              body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' }
              }),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (kieResponse.ok) {
              const data = await kieResponse.json();
              if (data.choices && data.choices[0] && data.choices[0].message) {
                reportContent = data.choices[0].message.content;
                usedModel = 'Kie.ai';
              }
            } else {
              console.warn(`Kie.ai failed with status: ${kieResponse.status}`);
            }
          } catch (e) {
            clearTimeout(timeoutId);
            if (e.name === 'AbortError') {
              console.error('Kie.ai request timed out after 15s');
            } else {
              console.error('Kie.ai error:', e.message);
            }
          }
        }

        // Fallback to Gemini
        if (!reportContent && GEMINI_API_KEY && !res.writableEnded) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // Tightened to 10s

          try {
            console.log('Attempting analysis with Gemini fallback...');
            const genAI = new GoogleGenAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ 
              model: 'gemini-1.5-flash',
              generationConfig: { responseMimeType: 'application/json' }
            });
            
            const geminiPromise = model.generateContent(prompt);
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('GeminiTimeout')), 10000));

            const result = await Promise.race([geminiPromise, timeoutPromise]);
            
            if (result && result.response) {
              reportContent = result.response.text();
              usedModel = 'Gemini';
            }
            clearTimeout(timeoutId);
          } catch (e) {
            clearTimeout(timeoutId);
            if (e.message === 'GeminiTimeout') {
              console.error('Gemini attempt timed out after 10s');
            } else {
              console.error('Gemini fallback error:', e.message);
            }
          }
        }

        if (res.writableEnded) return;
        clearTimeout(globalTimeout);

        if (!reportContent) {
          throw new Error('All AI analysis providers failed or are misconfigured.');
        }

        console.log(`Website analysis complete using ${usedModel}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(reportContent);
      } catch (error) {
        if (res.writableEnded) return;
        clearTimeout(globalTimeout);
        console.error('Critical analysis error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        const errorMessage = error.message || 'Internal Server Error during analysis';
        res.end(JSON.stringify({ 
          error: errorMessage,
          detail: 'No AI providers were able to process the request. Check API key status in logs.',
          model: usedModel || 'None'
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


