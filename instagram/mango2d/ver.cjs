const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const p = await br.newPage({ viewport: { width: 1200, height: 560 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve(process.argv[2] || 'prueba.html'));
  await p.waitForTimeout(300);
  await p.screenshot({ path: process.argv[3] || 'prueba.png' });
  await br.close();
})();
