// Captura larga (home en celular) para el reel: node larga.cjs  -> capturas/celular-home-larga.jpg
const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await (await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })).newPage();
  await p.goto('https://barci.com.co/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important} dialog, dialog-modal, .email-popup__content, [class*="email-popup"]{display:none!important}' });
  for (let y = 0; y < 6000; y += 600) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(350); }   // dispara las cargas perezosas
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
  await p.screenshot({ path: 'capturas/celular-home-larga.jpg', type: 'jpeg', quality: 90, fullPage: true });
  await br.close();
})();
