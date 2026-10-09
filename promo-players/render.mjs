// usage: node render.mjs <outDir> <fps> [w] [h] [nick] [onlyTimes,comma,sep]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [outDir, fpsArg, wArg, hArg, nick = 'SHZ4TW', only] = process.argv.slice(2);
const fps = +fpsArg || 120, w = +wArg || 1920, h = +hArg || 1080;
fs.mkdirSync(outDir, { recursive: true });

const root = path.dirname(new URL(import.meta.url).pathname);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: w, height: h } });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto(`http://localhost:${port}/index.html?w=${w}&h=${h}&nick=${encodeURIComponent(nick)}`);
await page.waitForFunction('window.READY === true', null, { timeout: 120000 });
const dur = await page.evaluate('window.DUR');

const times = only ? only.split(',').map(Number) : Array.from({ length: Math.round(dur * fps) }, (_, i) => i / fps);
const t0 = Date.now();
for (let i = 0; i < times.length; i++) {
  const data = await page.evaluate(t => { window.renderAt(t); return document.querySelector('canvas').toDataURL('image/png'); }, times[i]);
  fs.writeFileSync(path.join(outDir, `f${String(i).padStart(5, '0')}.png`), Buffer.from(data.split(',')[1], 'base64'));
  if (i % 20 === 0) console.log(`frame ${i}/${times.length} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close();
server.close();
