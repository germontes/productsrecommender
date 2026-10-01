// Tiny static server for local preview of /dist. Usage: node serve.js  (PORT env optional)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 8080;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

http
  .createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.normalize(path.join(DIST, pathname));
    if (!file.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: pathname + '/' }).end();
        return;
      }
      file = path.join(file, 'index.html');
    }
    const found = fs.existsSync(file);
    const target = found ? file : path.join(DIST, '404.html');
    res.writeHead(found ? 200 : 404, {
      'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(target).pipe(res);
  })
  .listen(PORT, () => console.log(`Products Recommender running at http://localhost:${PORT}/`));
