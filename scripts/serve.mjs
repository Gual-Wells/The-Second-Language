import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const web = path.join(root, 'web');
const port = Number(process.env.PORT || 4173);
const type = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.md': 'text/markdown; charset=utf-8' };
const index = JSON.parse(await readFile(path.join(root, 'chapters/demo/index.json'), 'utf8'));
const chapter = await readFile(path.join(root, 'chapters/demo/chapter.md'), 'utf8');

http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === '/api/session') return send({ authenticated: true, demo: true });
    if (url.pathname === '/api/chapters') return send({ chapters: index.chapters });
    if (url.pathname === '/api/chapters/demo-2026-09-30') return send({ ...index.chapters[0], markdown: chapter });
    if (url.pathname === '/auth/status') return send({ authenticated: true, enrolled: false, enrollmentOpen: false });
    const requested = url.pathname === '/' ? '/index.html' : url.pathname;
    const file = path.resolve(web, `.${requested}`);
    if (!file.startsWith(web + path.sep)) { response.writeHead(403); return response.end(); }
    const bytes = await readFile(file);
    response.writeHead(200, { 'content-type': type[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' }); response.end(bytes);
  } catch { response.writeHead(404); response.end('Not found'); }
  function send(value) { response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); response.end(JSON.stringify(value)); }
}).listen(port, '127.0.0.1', () => console.log(`Second Language preview: http://127.0.0.1:${port}`));
