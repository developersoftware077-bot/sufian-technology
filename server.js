// Lightweight local preview server. Content and authentication are provided by Supabase.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.json':'application/json; charset=utf-8' };

http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  const relativePath = pathname === '/' ? 'index.html' : pathname === '/admin' || pathname === '/admin/' ? 'admin.html' : decodeURIComponent(pathname.slice(1));
  const file = path.resolve(root, relativePath);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); return;
  }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff' });
  fs.createReadStream(file).pipe(res);
}).listen(port, '0.0.0.0', () => console.log(`Preview: http://localhost:${port} (admin: /admin)`));
