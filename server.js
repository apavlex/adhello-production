import http from 'http';
// import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const DIST_DIR = path.join(__dirname, 'dist');

// Hardcoded environment variables to bypass .env EPERM and ensure startup in all environments
process.env.KIE_API_KEY = '947d584b060f8c7bc799b6e3f1a100ec';
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''; 

console.log(`[STARTUP] AdHello AI Server initializing on port ${PORT}`);
console.log(`[STARTUP] Serving static files from: ${DIST_DIR}`);
console.log(`[STARTUP] KIE_API_KEY status: ${process.env.KIE_API_KEY ? 'Present' : 'MISSING'}`);
console.log(`[STARTUP] GEMINI_API_KEY status: ${process.env.GEMINI_API_KEY ? 'Present' : 'MISSING'}`);

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
      try {
        const { url } = JSON.parse(body);
        if (!url) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'URL is required' }));
        }

        const kieApiKey = process.env.KIE_API_KEY;
        const geminiApiKey = process.env.GEMINI_API_KEY;
        
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
        let usedModel = 'Kie.ai';

        // Attempt Kie.ai first
        if (kieApiKey && kieApiKey !== 'MY_KIE_API_KEY') {
          try {
            console.log('Attempting analysis with Kie.ai...');
            const kieResponse = await fetch('https://api.kie.ai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${kieApiKey}`
              },
              body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' }
              })
            });

            if (kieResponse.ok) {
              const data = await kieResponse.json();
              reportContent = data.choices[0].message.content;
            } else {
              console.warn(`Kie.ai failed with status: ${kieResponse.status}`);
            }
          } catch (e) {
            console.error('Kie.ai error:', e.message);
          }
        }

        // Fallback to Gemini if Kie.ai failed or no key
        if (!reportContent) {
          console.log('Gemini fallback is disabled due to missing dependency.');
          /*
          usedModel = 'Gemini';
          const genAI = new GoogleGenAI(geminiApiKey || 'MY_GEMINI_API_KEY');
          const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            generationConfig: { responseMimeType: 'application/json' }
          });
          
          const result = await model.generateContent(prompt);
          reportContent = result.response.text();
          */
          throw new Error('Kie.ai failed and Gemini fallback is unavailable.');
        }

        console.log(`Website analysis complete using ${usedModel}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(reportContent);
      } catch (error) {
        console.error('Critical analysis error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        const errorMessage = error.message || 'Internal Server Error during analysis';
        res.end(JSON.stringify({ 
          error: errorMessage,
          detail: 'This usually happens if the API keys are invalid or the AI service is overloaded.',
          model: usedModel || 'Unknown'
        }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Clean up URL (remove query strings, etc.)
  filePath = filePath.split('?')[0];

  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Fallback to index.html for SPA routing
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

server.listen(PORT, () => {
  const addr = server.address();
  console.log(`Server running at http://localhost:${addr.port}/`);
  console.log(`Serving files from ${DIST_DIR}`);
}).on('error', (err) => {
  if (err.code === 'EPERM') {
    console.error(`CRITICAL: Port ${PORT} is restricted by the environment (EPERM).`);
  } else if (err.code === 'EADDRINUSE') {
    console.error(`CRITICAL: Port ${PORT} is already in use.`);
  } else {
    console.error('Server failed to start:', err);
  }
  process.exit(1);
});

