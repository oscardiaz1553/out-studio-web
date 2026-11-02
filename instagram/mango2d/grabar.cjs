// Graba habla.html cuadro a cuadro: node grabar.cjs <bocas.json> <eventos.json> <carpeta> <segundos> [fps]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const [bocasF, evF, out, dur, fpsA] = process.argv.slice(2);
const FPS = +fpsA || 30;
const raiz = __dirname;
const srv = http.createServer((q, r) => { const p = path.join(raiz, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': p.endsWith('.html') ? 'text/html' : p.endsWith('.js') ? 'text/javascript' : 'image/png' }); r.end(d); }); }).listen(8765);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  p.on('console', (m) => console.log('LOG', m.text()));
  await p.goto('http://localhost:8765/habla.html');
  const b = JSON.parse(fs.readFileSync(bocasF)).estados, e = JSON.parse(fs.readFileSync(evF));
  await p.evaluate(([b, e]) => window.cargar(b, e), [b, e]);
  await p.waitForTimeout(300);
  const n = Math.round(+dur * FPS);
  for (let i = 0; i < n; i++) {
    await p.evaluate((t) => window.render(t), i / FPS);
    await p.screenshot({ path: path.join(out, `f_${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 });
  }
  await br.close(); srv.close();
  console.log('cuadros', n);
})();
