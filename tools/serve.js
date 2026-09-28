#!/usr/bin/env node
/*
 * Minimal local dev server for this EDS project.
 *
 * A real EDS deployment resolves extensionless routes (e.g. "/products") to
 * their authored page automatically. Plain static servers don't, so this adds
 * just that one piece of routing so local preview matches deployed behavior.
 * It also serves the /nav.plain.html and /footer.plain.html fragments the
 * header/footer blocks fetch.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = process.env.PORT || 3000;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveFile(urlPath) {
  const clean = urlPath.split('?')[0].split('#')[0];
  const candidates = [];
  if (clean === '/') {
    candidates.push('index.html');
  } else {
    const withoutSlash = clean.replace(/^\//, '');
    candidates.push(withoutSlash);
    if (!path.extname(withoutSlash)) {
      candidates.push(`${withoutSlash}.html`);
      candidates.push(path.join(withoutSlash, 'index.html'));
    }
  }
  for (const candidate of candidates) {
    const filePath = path.join(ROOT, candidate);
    if (filePath.startsWith(ROOT) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }
  return null;
}

const server = http.createServer((req, res) => {
  const resolved = resolveFile(req.url);
  const filePath = resolved || path.join(ROOT, '404.html');
  const status = resolved ? 200 : 404;
  const ext = path.extname(filePath);
  res.writeHead(status, { 'Content-Type': CONTENT_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  process.stdout.write(`Rockwell EDS dev server running at http://localhost:${PORT}\n`);
});
