import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const target = path.resolve(root, relative);
    if (!target.startsWith(root) || !(await stat(target)).isFile()) throw new Error('Not found');
    const body = await readFile(target);
    res.writeHead(200, {'Content-Type':types[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"});
    res.end(body);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    res.end('Page not found. Return to http://127.0.0.1:' + port);
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port}\nOnly public/ is served. Press Ctrl+C to stop.`));
server.on('error', error => {console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Try PORT=4174 npm start.` : error.message);process.exit(1);});
