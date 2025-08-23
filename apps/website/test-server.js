// Simple test server to verify Node.js deployment
// Upload this file to your server and run: node test-server.js

const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 4321;

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Node.js server is working!',
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        port: PORT
      }
    }));
    return;
  }
  
  if (req.url === '/contact') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contact Test - Networkk</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>Contact Page Test</h1>
        <p>This is a test contact page served by Node.js</p>
        <p>If you can see this, your server supports Node.js!</p>
        <script>
          fetch('/test')
            .then(r => r.json())
            .then(data => {
              document.body.innerHTML += '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            });
        </script>
      </body>
      </html>
    `);
    return;
  }
  
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📝 Test URLs:`);
  console.log(`   http://localhost:${PORT}/contact`);
  console.log(`   http://localhost:${PORT}/test`);
  console.log(`💡 If you can access these URLs, your server supports Node.js!`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
