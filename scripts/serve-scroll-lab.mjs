import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile, stat} from 'node:fs/promises';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../web');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css', '.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.otf':'font/otf','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
export function createServer() {
  return http.createServer(async (request, response) => {
    try {
      if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
      const url = new URL(request.url, 'http://localhost');
      let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
      if (file !== root && !file.startsWith(root + path.sep)) throw new Error('Outside web root');
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const content = await readFile(file);
      response.writeHead(200, {'content-type':types[path.extname(file)] || 'application/octet-stream', 'cache-control':'no-store'});
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 8137);
  createServer().listen(port,'127.0.0.1', () => console.log(`http://127.0.0.1:${port}/labs/chapter-scroll/`));
}
