// Capturas de barci.com.co (escritorio y celular): NODE_PATH=$(npm root -g) node capturar.cjs
const { chromium } = require('playwright');
const B = 'https://barci.com.co';
const PAGS = [['home', '/'], ['esenciales', '/collections/esenciales'], ['brava', '/collections/brava'], ['producto', '/products/bar-004-tank-top-serena'], ['nosotras', '/pages/nosotras'], ['accesorios', '/collections/accesorios']];
(async () => {
  const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  for (const [modo, ctxOpt] of [['escritorio', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }], ['celular', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
    const ctx = await br.newContext({ ...ctxOpt, reducedMotion: 'reduce' }); const p = await ctx.newPage();
    for (const [nombre, ruta] of PAGS) {
      try {
        await p.goto(B + ruta, { waitUntil: 'networkidle', timeout: 45000 });
        await p.waitForTimeout(1500);
        // cierra posibles popups
        await p.addStyleTag({ content: '*{animation:none!important;transition:none!important} dialog, dialog-modal, .email-popup__content, [class*="email-popup"], .modal-overlay, [class*="overlay"]{display:none!important}' });
        for (const sel of ['button[aria-label*="errar"]', 'button[aria-label*="lose"]', '[role=dialog] button']) { const b = await p.$(sel); if (b && await b.isVisible()) { await b.click().catch(() => {}); await p.waitForTimeout(600); break; } }
        await p.waitForTimeout(800);
        await p.screenshot({ path: `capturas/${modo}-${nombre}.png` });
        await p.screenshot({ path: `capturas/${modo}-${nombre}-larga.png`, fullPage: true });
        console.log('ok', modo, nombre);
      } catch (e) { console.log('FALLO', modo, nombre, e.message.slice(0, 100)); }
    }
    await ctx.close();
  }
  await br.close();
})();
