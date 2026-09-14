const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2] || process.env.PORT || '80', 10);
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let safePath = path.normalize(decodeURIComponent(req.url)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(PUBLIC_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Not Found</h1><p>The requested file was not found.</p>');
        console.log(`[404] ${req.method} ${req.url}`);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>500 Internal Server Error</h1>');
        console.error(`[500] ${req.method} ${req.url}:`, err);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
      console.log(`[200] ${req.method} ${req.url}`);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`================================================`);
  console.log(`  Server is running on http://localhost:${PORT}`);
  console.log(`  LAN Access: http://192.168.1.37:${PORT}`);
  console.log(`  Press Ctrl+C to stop the server`);
  console.log(`================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EACCES') {
    console.error(`\n[ERROR] Permission denied to listen on port ${PORT}.`);
    console.error(`Port ${PORT} requires Administrator / Root privileges.`);
    console.error(`On Windows: Run PowerShell / Command Prompt as Administrator, or right-click start.bat and "Run as administrator".`);
    console.error(`On Linux: Run with 'sudo ./start.sh'\n`);
  } else if (err.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] Port ${PORT} is already in use by another process (e.g., IIS, Skype, Nginx, Apache).`);
    console.error(`Please stop the service using port ${PORT} or change the port.\n`);
  } else {
    console.error(`Server error:`, err);
  }
  process.exit(1);
});
