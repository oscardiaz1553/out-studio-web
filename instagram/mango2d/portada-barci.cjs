// Portada del reel de BARCI: node portada-barci.cjs <salida.png>
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), http = require('http');
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const p = path.join(__dirname, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TIPOS[path.extname(p)] || 'application/octet-stream' }); r.end(d); }); }).listen(8768);
(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('http://localhost:8768/reel-barci.html');
  await p.evaluate(() => window.cargar());
  await p.waitForTimeout(400);
  await p.evaluate(() => {
    window.render(1.55);
    const t = document.getElementById('titulo'); t.dataset.txt = 'x'; t.innerHTML = 'Su tienda,<br>lista en<br>4 semanas.'; t.style.top = '300px'; t.style.fontSize = '120px'; t.style.opacity = 1; t.style.color = '#3a2118'; t.style.textAlign = 'center';
    [...document.querySelectorAll('.it')].forEach((e) => { const im = e.querySelector('img'); if (e.textContent.includes('Infinitas')) e.style.display = 'none'; else if (im && im.src.includes('logo-barci')) e.style.top = '830px'; else if (im && im.src.includes('favicon')) e.style.top = '650px'; });
  });
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.resolve(process.argv[2]) });
  await br.close(); srv.close(); console.log('ok');
})();
