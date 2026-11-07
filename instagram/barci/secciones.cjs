// Capturas por tramos (la página no usa scroll de documento completo): node secciones.cjs
const { chromium } = require('playwright');
const CSS = 'html,body{overflow:auto!important;height:auto!important;position:static!important} *{animation:none!important;transition:none!important} dialog, dialog-modal, .email-popup__content, [class*="email-popup"]{display:none!important}';
(async () => {
  const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  for (const [modo, o, paso] of [['escritorio', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, 800], ['celular', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, 760]]) {
    const p = await (await br.newContext({ ...o, reducedMotion: 'reduce' })).newPage();
    for (const [n, ruta] of [['home', '/'], ['producto', '/products/bar-004-tank-top-serena'], ['brava', '/collections/brava']]) {
      await p.goto('https://barci.com.co' + ruta, { waitUntil: 'networkidle' }); await p.addStyleTag({ content: CSS }); await p.waitForTimeout(1200);
      const alto = await p.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
      console.log(modo, n, alto);
      for (let i = 0, y = 0; y < (alto <= 1000 ? 4800 : Math.min(alto, 5200)); i++, y += paso) { await p.evaluate((y) => window.scrollTo(0, y), y); if (alto <= 1000 && i > 0) await p.mouse.wheel(0, paso); await p.waitForTimeout(700); await p.screenshot({ path: `capturas/${modo}-${n}-${String(i).padStart(2, '0')}.png` }); }
    }
  }
  await br.close();
})();
