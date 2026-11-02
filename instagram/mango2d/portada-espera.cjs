// Portada de «La espera»: node portada-espera.cjs <salida.png>  (usa el mismo mundo y Mango de espera.html)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const p = path.join(__dirname, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TIPOS[path.extname(p)] || 'application/octet-stream' }); r.end(d); }); }).listen(8767);
(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('http://localhost:8767/espera.html');
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.cargar());
  await p.waitForTimeout(400);
  await p.evaluate(() => { window.render(3.2); const t = document.getElementById('titulo'); t.style.top = '360px'; t.style.fontSize = '118px'; });
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.resolve(process.argv[2]) });
  await br.close(); srv.close(); console.log('ok');
})();
