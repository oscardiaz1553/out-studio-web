// Portada de un reel con Mango: node portada.cjs <salida.png> [pagina=portada.html]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const [salida, pagina] = process.argv.slice(2);
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const p = path.join(__dirname, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TIPOS[path.extname(p)] || 'application/octet-stream' }); r.end(d); }); }).listen(8766);
(async () => {
  const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('http://localhost:8766/' + (pagina || 'portada.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.listo);
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.resolve(salida) });
  await br.close(); srv.close(); console.log('ok', salida);
})();
