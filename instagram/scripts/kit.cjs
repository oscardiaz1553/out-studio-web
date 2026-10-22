// Kit compartido de las piezas de Instagram: fuentes, colores, imágenes de la
// marca, logo, símbolos y helpers para armar y renderizar láminas.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const uri = (f, type) => `data:${type};base64,${fs.readFileSync(f).toString('base64')}`;
const PUB = (n) => uri(path.join(ROOT, 'public', n), n.endsWith('.png') ? 'image/png' : 'image/webp');
const NM = (p) => path.join(ROOT, 'node_modules', p);

const DISPLAY = uri(NM('@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2'), 'font/woff2');
const BODY = (w) => uri(NM(`@fontsource/instrument-sans/files/instrument-sans-latin-${w}-normal.woff2`), 'font/woff2');

const IMG = {
  asoma: PUB('mono-asoma.webp'),
  laptop: PUB('mono-laptop.webp'),
  avatar: PUB('mono-avatar.webp'),
  mango: PUB('mango-hero.webp'),
  band: PUB('azulejo-band.webp'),
  dd: uri(path.join(ROOT, 'design-src/whatsapp/diario-deportes.png'), 'image/png'),
};

const C = {
  klein: '#1B2FCC', deep: '#141E5C', carne: '#F5E3B3', carneDeep: '#BC6039',
  paper: '#F3EDE7', pure: '#FBF8F5', ink: '#3C4375',
};

const OUT_PATHS = [
  'M29.19,72.04c-3.3,0-6.27-.52-8.93-1.55-2.66-1.04-4.93-2.57-6.82-4.59-1.88-2.02-3.32-4.54-4.31-7.56-.99-3.01-1.48-6.47-1.48-10.38,0-5.55,.93-10.13,2.79-13.74,1.86-3.6,4.45-6.3,7.77-8.09,3.32-1.79,7.12-2.68,11.41-2.68,3.34,0,6.33,.51,8.97,1.52,2.64,1.01,4.9,2.53,6.78,4.56,1.88,2.02,3.32,4.55,4.31,7.59,.99,3.04,1.48,6.56,1.48,10.56s-.52,7.6-1.55,10.66c-1.04,3.06-2.53,5.6-4.48,7.63-1.95,2.02-4.27,3.54-6.96,4.56-2.68,1.01-5.67,1.52-8.97,1.52Zm.42-9.25c2.17,0,3.98-.54,5.44-1.62,1.46-1.08,2.54-2.71,3.25-4.87,.71-2.16,1.06-4.85,1.06-8.05,0-3.44-.38-6.29-1.13-8.55-.75-2.26-1.87-3.98-3.35-5.16-1.48-1.18-3.35-1.77-5.61-1.77-2.12,0-3.91,.57-5.37,1.7-1.46,1.13-2.57,2.8-3.32,5.01-.75,2.21-1.13,4.97-1.13,8.26,0,2.45,.21,4.63,.64,6.53,.42,1.91,1.07,3.48,1.94,4.73,.87,1.25,1.94,2.19,3.21,2.82,1.27,.64,2.73,.95,4.38,.95Z',
  'M65.42,72.04c-4.19,0-7.3-1.44-9.32-4.31-2.02-2.87-3.04-7.27-3.04-13.21v-20.76h11.44v20.27c0,2.92,.42,5.01,1.27,6.29s2.09,1.91,3.74,1.91c1.08,0,2.07-.28,2.97-.85,.89-.56,1.67-1.41,2.33-2.54,.66-1.13,1.15-2.53,1.48-4.2,.33-1.67,.49-3.61,.49-5.83v-15.04h11.44v37.29h-9.53l-.07-13.63h-.78c-.38,3.39-1.07,6.17-2.08,8.33-1.01,2.17-2.38,3.76-4.1,4.77-1.72,1.01-3.8,1.52-6.25,1.52Z',
  'M113.05,65.87c0-1.83,.51-3.55,1.4-5.01-.59,.31-1.24,.55-1.94,.73-.73,.19-1.45,.28-2.15,.28-1.41,0-2.54-.37-3.39-1.13s-1.27-2-1.27-3.74v-14.05h8.69v-9.18h-8.69v-8.47h-6.57l-.05,1.36c-.02,.5-.06,1.01-.16,1.5-.36,1.89-1,2.57-2.01,3.47-1.21,1.09-2.99,1.85-5.49,2.13h-1.27l-.07,8.9h4.45v15.25c0,4.8,1.06,8.33,3.18,10.59,2.12,2.26,5.37,3.39,9.75,3.39,.9,0,1.92-.06,3.07-.18,1.14-.12,2.45-.38,3.93-.8-.9-1.48-1.42-3.21-1.42-5.06Z',
];
const logo = (color, w) =>
  `<svg viewBox="0 0 126.12 91.76" style="width:${w}px;display:block">${OUT_PATHS.map((d) => `<path fill="${color}" d="${d}"/>`).join('')}</svg>`;

const SYM = {
  square: { d: 'M38.19,26.4 H23.28 V65.4 H38.19' },
  curly: { d: 'M38.19,26.4 H34 Q29,26.4 29,31.4 V40.9 Q29,45.9 23.3,45.9 Q29,45.9 29,50.9 V60.4 Q29,65.4 34,65.4 H38.19' },
  angle: { d: 'M46,21 L23.3,45.9 L46,70.8' },
};
const sym = (kind, color, h, flip = false) =>
  `<svg viewBox="18.58 21.7 19.61 48.4" style="height:${h}px;width:auto;display:block;overflow:visible${flip ? ';transform:scaleX(-1)' : ''}"><path d="${SYM[kind].d}" fill="none" stroke="${color}" stroke-width="9.4"/></svg>`;
const pair = (kind, color, h, gap = 0.3) =>
  `<div style="display:flex;gap:${h * gap}px">${sym(kind, color, h)}${sym(kind, color, h, true)}</div>`;

const check = (bg, fg) =>
  `<span style="flex:none;width:44px;height:44px;border-radius:50%;background:${bg};color:${fg};display:flex;align-items:center;justify-content:center;margin-top:2px"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;

// Puntos de avance del carrusel (sin números).
const dots = (i, n, on, off) =>
  `<div style="display:flex;gap:10px">${Array.from({ length: n }, (_, k) => `<span style="width:${k === i ? 34 : 12}px;height:12px;border-radius:6px;background:${k === i ? on : off}"></span>`).join('')}</div>`;

const footer = (i, n, color, dotOff) => `
  <div class="abs" style="left:80px;right:80px;bottom:64px;display:flex;align-items:center;justify-content:space-between">
    ${logo(color, 96)}
    ${n > 1 ? dots(i, n, color, dotOff) : ''}
    <span style="font:500 24px I;color:${color};opacity:.85">outstudio.online</span>
  </div>`;

const BASE = `@font-face{font-family:D;src:url(${DISPLAY});font-weight:100 900}
@font-face{font-family:I;src:url(${BODY(400)});font-weight:400}
@font-face{font-family:I;src:url(${BODY(500)});font-weight:500}
@font-face{font-family:I;src:url(${BODY(600)});font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
body{overflow:hidden;position:relative;font-family:I;-webkit-font-smoothing:antialiased}
.abs{position:absolute}
.d{font-family:D;font-weight:800;letter-spacing:-0.045em;line-height:.95}
p{font:400 34px/1.4 I}`;

const page = (w, h, bg, body) =>
  `<!doctype html><html><head><style>${BASE} body{width:${w}px;height:${h}px;background:${bg}}</style></head><body>${body}</body></html>`;

const band = (h, style = '') =>
  `<div class="abs" style="left:0;right:0;height:${h}px;background:url(${IMG.band}) repeat-x;background-size:auto 100%;${style}"></div>`;


/** Renderiza una lista de [html, ancho, alto, nombre] en la carpeta dada. */
async function render(outDir, items) {
  fs.mkdirSync(outDir, { recursive: true });
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [html, w, h, name] of items) {
    const p = await br.newPage({ viewport: { width: w, height: h } });
    await p.setContent(html);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(outDir, name) });
    await p.close();
  }
  await br.close();
  console.log('ok', outDir);
}

module.exports = { ROOT, uri, IMG, C, BASE, logo, sym, pair, check, dots, footer, page, band, render };
