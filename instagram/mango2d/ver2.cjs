const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [archivo, salida, w, h] = process.argv.slice(2);
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await br.newPage({ viewport: { width: +w || 1400, height: +h || 640 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve(archivo));
  await p.waitForTimeout(500);
  await p.screenshot({ path: salida });
  await br.close();
})();
