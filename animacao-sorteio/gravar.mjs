// Grava a animação em MP4 quadro a quadro (fluido, sem perder frames).
// Requisitos: Node 18+, ffmpeg no PATH e Playwright (npm i playwright && npx playwright install chromium).
// Uso:  node gravar.mjs                   -> sorteio-16x9.mp4 (1920×1080, 60 fps)
//       node gravar.mjs vertical          -> sorteio-9x16.mp4 (1080×1920, 60 fps)
//       node gravar.mjs horizontal 30 2   -> fps e nº de navegadores em paralelo (padrão 60 e 3)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const formato = process.argv[2] === 'vertical' ? 'vertical' : 'horizontal';
const fps = Number(process.argv[3] || 60);
const workers = Number(process.argv[4] || 3);
const dir = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(dir, formato === 'vertical' ? 'sorteio-9x16.mp4' : 'sorteio-16x9.mp4');
const [w, h] = formato === 'vertical' ? [1080, 1920] : [1920, 1080];
const url = pathToFileURL(path.join(dir, 'index.html')).href + `?formato=${formato}&t=0`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sorteio-'));

const run = (args, opts) => new Promise((ok, fail) => {
  const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...args], opts);
  p.on('close', c => c === 0 ? ok(p) : fail(new Error('ffmpeg saiu com código ' + c)));
  return p;
});

const browser = await chromium.launch();
const probe = await browser.newPage();
await probe.goto(url);
await probe.evaluate(() => window.__ready);
const total = Math.round(await probe.evaluate(() => window.__duration) * fps);
await probe.close();

let feitos = 0;
async function trecho(i) {
  const ini = Math.floor(total * i / workers), fim = Math.floor(total * (i + 1) / workers);
  const arq = path.join(tmp, `parte-${i}.mp4`);
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url);
  await page.evaluate(() => window.__ready);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', arq], { stdio: ['pipe', 'inherit', 'inherit'] });
  const fechou = new Promise(r => ff.on('close', r));
  for (let f = ini; f < fim; f++) {
    await page.evaluate(t => window.__seek(t), f / fps);
    const img = await page.screenshot({ type: 'jpeg', quality: 96 });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if (++feitos % 30 === 0) console.log(`${formato}: ${feitos}/${total} quadros`);
  }
  ff.stdin.end();
  await fechou;
  await page.close();
  return arq;
}

const partes = await Promise.all(Array.from({ length: workers }, (_, i) => trecho(i)));
await browser.close();
const lista = path.join(tmp, 'lista.txt');
fs.writeFileSync(lista, partes.map(p => `file '${p}'`).join('\n'));
await run(['-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', '-movflags', '+faststart', saida], { stdio: 'inherit' });
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`Pronto: ${saida}`);
