// Graba una página cuadro a cuadro (por defecto habla.html; otra con PAGINA=reel.html):
//   node grabar.cjs <bocas.json> <eventos.json> <carpeta> <segundos> [fps] [desde]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const [bocasF, evF, out, dur, fpsA, desdeA] = process.argv.slice(2);
const DESDE = +desdeA || 0;
const FPS = +fpsA || 30;
const raiz = __dirname;
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, r) => { const p = path.join(raiz, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TIPOS[path.extname(p)] || 'application/octet-stream' }); r.end(d); }); }).listen(8765);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  p.on('console', (m) => console.log('LOG', m.text()));
  await p.goto('http://localhost:8765/' + (process.env.PAGINA || 'habla.html'));
  await p.evaluate(() => document.fonts.ready);
  const b = JSON.parse(fs.readFileSync(bocasF)).estados, e = JSON.parse(fs.readFileSync(evF));
  const h = process.env.HOJA ? JSON.parse(fs.readFileSync(process.env.HOJA)) : null;
  const inb = fs.existsSync(path.join(raiz, 'inb/manifest.json')) && h ? JSON.parse(fs.readFileSync(path.join(raiz, 'inb/manifest.json'))) : [];
  await p.evaluate(([b, e, h, inb]) => window.cargar(b, e, h, inb), [b, e, h, inb]);
  await p.waitForTimeout(300);
  const n = Math.round(+dur * FPS);
  for (let i = 0; i < n; i++) {
    await p.evaluate((t) => window.render(t), DESDE + i / FPS);
    await p.screenshot({ path: path.join(out, `f_${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 });
  }
  await br.close(); srv.close();
  console.log('cuadros', n);
})();
