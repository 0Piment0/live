// Grava a animação em MP4 quadro a quadro (fluido, sem perder frames).
// Requisitos: Node 18+, ffmpeg no PATH e Playwright (npm i playwright && npx playwright install chromium).
// Uso:  node gravar.mjs                 -> sorteio-16x9.mp4 (1920×1080)
//       node gravar.mjs vertical        -> sorteio-9x16.mp4 (1080×1920)
//       node gravar.mjs horizontal 30   -> muda o fps (padrão 60)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const formato = process.argv[2] === 'vertical' ? 'vertical' : 'horizontal';
const fps = Number(process.argv[3] || 60);
const dir = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(dir, formato === 'vertical' ? 'sorteio-9x16.mp4' : 'sorteio-16x9.mp4');
const [w, h] = formato === 'vertical' ? [1080, 1920] : [1920, 1080];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto(pathToFileURL(path.join(dir, 'index.html')).href + `?formato=${formato}&t=0`);
await page.evaluate(() => window.__ready);
const dur = await page.evaluate(() => window.__duration);
const total = Math.round(dur * fps);

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', saida],
  { stdio: ['pipe', 'inherit', 'inherit'] });

for (let f = 0; f < total; f++) {
  await page.evaluate(t => window.__seek(t), f / fps);
  const png = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % fps === 0) process.stdout.write(`\r${formato}: ${f}/${total} quadros`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log(`\nPronto: ${saida}`);
