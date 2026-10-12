// Opciones de imagen de perfil para el grupo de WhatsApp Out × Diario Deportes.
// Uso: node opciones.cjs  → escribe opcion-a.png … opcion-e.png (1080 × 1080).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const uri = (f, type) => `data:${type};base64,${fs.readFileSync(f).toString('base64')}`;
const PUB = (n) => path.join(ROOT, 'public', n);

const FONT = uri(path.join(ROOT, 'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2'), 'font/woff2');
const DD = uri(path.join(__dirname, 'diario-deportes.png'), 'image/png');
const DD_DARK = uri(path.join(__dirname, 'diario-deportes-oscuro.png'), 'image/png');
const AZULEJO = uri(PUB('azulejo.webp'), 'image/webp');
const BAND = uri(PUB('azulejo-band.webp'), 'image/webp');
const ASOMA = uri(PUB('mono-asoma.webp'), 'image/webp');
const AVATAR = uri(PUB('mono-avatar.webp'), 'image/webp');
const LAPTOP = uri(PUB('mono-laptop.webp'), 'image/webp');

const OUT_PATHS = [
  'M29.19,72.04c-3.3,0-6.27-.52-8.93-1.55-2.66-1.04-4.93-2.57-6.82-4.59-1.88-2.02-3.32-4.54-4.31-7.56-.99-3.01-1.48-6.47-1.48-10.38,0-5.55,.93-10.13,2.79-13.74,1.86-3.6,4.45-6.3,7.77-8.09,3.32-1.79,7.12-2.68,11.41-2.68,3.34,0,6.33,.51,8.97,1.52,2.64,1.01,4.9,2.53,6.78,4.56,1.88,2.02,3.32,4.55,4.31,7.59,.99,3.04,1.48,6.56,1.48,10.56s-.52,7.6-1.55,10.66c-1.04,3.06-2.53,5.6-4.48,7.63-1.95,2.02-4.27,3.54-6.96,4.56-2.68,1.01-5.67,1.52-8.97,1.52Zm.42-9.25c2.17,0,3.98-.54,5.44-1.62,1.46-1.08,2.54-2.71,3.25-4.87,.71-2.16,1.06-4.85,1.06-8.05,0-3.44-.38-6.29-1.13-8.55-.75-2.26-1.87-3.98-3.35-5.16-1.48-1.18-3.35-1.77-5.61-1.77-2.12,0-3.91,.57-5.37,1.7-1.46,1.13-2.57,2.8-3.32,5.01-.75,2.21-1.13,4.97-1.13,8.26,0,2.45,.21,4.63,.64,6.53,.42,1.91,1.07,3.48,1.94,4.73,.87,1.25,1.94,2.19,3.21,2.82,1.27,.64,2.73,.95,4.38,.95Z',
  'M65.42,72.04c-4.19,0-7.3-1.44-9.32-4.31-2.02-2.87-3.04-7.27-3.04-13.21v-20.76h11.44v20.27c0,2.92,.42,5.01,1.27,6.29s2.09,1.91,3.74,1.91c1.08,0,2.07-.28,2.97-.85,.89-.56,1.67-1.41,2.33-2.54,.66-1.13,1.15-2.53,1.48-4.2,.33-1.67,.49-3.61,.49-5.83v-15.04h11.44v37.29h-9.53l-.07-13.63h-.78c-.38,3.39-1.07,6.17-2.08,8.33-1.01,2.17-2.38,3.76-4.1,4.77-1.72,1.01-3.8,1.52-6.25,1.52Z',
  'M113.05,65.87c0-1.83,.51-3.55,1.4-5.01-.59,.31-1.24,.55-1.94,.73-.73,.19-1.45,.28-2.15,.28-1.41,0-2.54-.37-3.39-1.13s-1.27-2-1.27-3.74v-14.05h8.69v-9.18h-8.69v-8.47h-6.57l-.05,1.36c-.02,.5-.06,1.01-.16,1.5-.36,1.89-1,2.57-2.01,3.47-1.21,1.09-2.99,1.85-5.49,2.13h-1.27l-.07,8.9h4.45v15.25c0,4.8,1.06,8.33,3.18,10.59,2.12,2.26,5.37,3.39,9.75,3.39,.9,0,1.92-.06,3.07-.18,1.14-.12,2.45-.38,3.93-.8-.9-1.48-1.42-3.21-1.42-5.06Z',
];
const out = (color, style = '') =>
  `<svg viewBox="0 0 126.12 91.76" style="${style}">${OUT_PATHS.map((d) => `<path fill="${color}" d="${d}"/>`).join('')}</svg>`;

const SYM = {
  square: 'M38.19,26.4 H23.28 V65.4 H38.19',
  curly: 'M38.19,26.4 H34 Q29,26.4 29,31.4 V40.9 Q29,45.9 23.3,45.9 Q29,45.9 29,50.9 V60.4 Q29,65.4 34,65.4 H38.19',
};
const sym = (kind, color, style = '', flip = false) =>
  `<svg viewBox="18.58 21.7 19.61 48.4" style="${style}${flip ? ';transform:scaleX(-1)' : ''}"><path d="${SYM[kind]}" fill="none" stroke="${color}" stroke-width="9.4"/></svg>`;

const BASE = `@font-face{font-family:B;src:url(${FONT});font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;position:relative;font-family:B}
.abs{position:absolute}`;

const OPTIONS = {
  // A: azulejo de fondo teñido de azul, corchetes enormes en crema y el mono
  // asomándose por la esquina.
  a: `
    <div class="abs" style="inset:0;background:#1B2FCC"></div>
    <div class="abs" style="inset:0;background:url(${AZULEJO}) center/520px;opacity:.22;mix-blend-mode:luminosity"></div>
    <div class="abs" style="inset:0;background:radial-gradient(circle at 50% 45%,rgba(27,47,204,.2) 0%,rgba(27,47,204,.85) 55%,#141E5C 100%)"></div>
    <div class="abs" style="left:150px;top:240px;height:420px;display:flex;gap:520px">${sym('square', '#F5E3B3', 'height:420px')}${sym('square', '#F5E3B3', 'height:420px', true)}</div>
    <div class="abs" style="left:0;right:0;top:300px;display:flex;justify-content:center">${out('#FBF8F5', 'width:300px')}</div>
    <img class="abs" src="${DD}" style="left:335px;top:525px;width:410px">
    <img class="abs" src="${ASOMA}" style="right:-60px;bottom:-40px;width:640px">`,

  // B: crema con azulejo arriba y abajo, las llaves enmarcan los dos logos;
  // el mono asoma por debajo.
  b: `
    <div class="abs" style="inset:0;background:#F5E3B3"></div>
    <div class="abs" style="left:0;right:0;top:0;height:170px;background:url(${BAND}) center/auto 100% repeat-x"></div>
    <div class="abs" style="left:150px;top:250px;height:400px;display:flex;gap:500px">${sym('curly', '#1B2FCC', 'height:400px')}${sym('curly', '#1B2FCC', 'height:400px', true)}</div>
    <div class="abs" style="left:0;right:0;top:280px;display:flex;justify-content:center">${out('#1B2FCC', 'width:250px')}</div>
    <div class="abs" style="left:0;right:0;top:470px;text-align:center;font-weight:800;font-size:56px;color:#BC6039;line-height:1">×</div>
    <img class="abs" src="${DD_DARK}" style="left:290px;top:545px;width:500px">
    <img class="abs" src="${ASOMA}" style="left:300px;bottom:-70px;width:560px">`,

  // C: mitad y mitad. Out arriba en azul, Diario Deportes abajo en azul
  // profundo, y la cara del mono en un círculo justo en la unión.
  c: `
    <div class="abs" style="left:0;right:0;top:0;height:540px;background:#1B2FCC"></div>
    <div class="abs" style="left:0;right:0;top:540px;bottom:0;background:#141E5C"></div>
    <div class="abs" style="left:0;right:0;top:540px;bottom:0;background:url(${AZULEJO}) center/420px;opacity:.12"></div>
    <div class="abs" style="left:0;right:0;top:225px;display:flex;justify-content:center;align-items:center;gap:26px">${sym('square', '#F5E3B3', 'height:150px')}${out('#FBF8F5', 'width:260px')}${sym('square', '#F5E3B3', 'height:150px', true)}</div>
    <div class="abs" style="left:420px;top:420px;width:240px;height:240px;border-radius:50%;background:#F5E3B3;border:10px solid #FBF8F5;overflow:hidden">
      <img src="${AVATAR}" style="position:absolute;left:-10px;top:-6px;width:240px">
    </div>
    <img class="abs" src="${DD}" style="left:250px;top:720px;width:580px">`,

  // D: el mono trabajando en el portátil, sobre azulejo, con los dos logos
  // arriba como si fueran el título del proyecto.
  d: `
    <div class="abs" style="inset:0;background:#141E5C"></div>
    <div class="abs" style="inset:0;background:url(${AZULEJO}) center/480px;opacity:.16"></div>
    <div class="abs" style="inset:0;background:radial-gradient(circle at 50% 80%,rgba(27,47,204,.9) 0%,rgba(20,30,92,.2) 60%)"></div>
    <div class="abs" style="left:0;right:0;top:170px;display:flex;justify-content:center;align-items:center;gap:30px">${out('#FBF8F5', 'width:220px')}<span style="font-weight:800;font-size:64px;color:#F5E3B3">×</span></div>
    <img class="abs" src="${DD}" style="left:240px;top:350px;width:600px">
    <img class="abs" src="${LAPTOP}" style="left:250px;top:520px;width:640px">`,

  // E: póster limpio. Llaves gigantes que salen del borde, "Out" grande y el
  // logo del cliente; la trama de símbolos de la marca de fondo.
  e: `
    <div class="abs" style="inset:0;background:#1B2FCC"></div>
    <div class="abs" style="inset:-40px;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);opacity:.09;transform:rotate(-12deg)">
      ${Array.from({ length: 64 }, (_, i) => `<div style="display:flex;justify-content:center;align-items:center;gap:4px">${sym(i % 2 ? 'curly' : 'square', '#F5E3B3', 'height:46px')}${sym(i % 2 ? 'curly' : 'square', '#F5E3B3', 'height:46px', true)}</div>`).join('')}
    </div>
    <div class="abs" style="left:110px;top:250px;height:580px">${sym('curly', '#F5E3B3', 'height:580px')}</div>
    <div class="abs" style="right:110px;top:250px;height:580px">${sym('curly', '#F5E3B3', 'height:580px', true)}</div>
    <div class="abs" style="left:0;right:0;top:290px;display:flex;justify-content:center">${out('#FBF8F5', 'width:340px')}</div>
    <div class="abs" style="left:0;right:0;top:590px;display:flex;justify-content:center"><div style="width:120px;height:10px;border-radius:5px;background:#F5E3B3"></div></div>
    <img class="abs" src="${DD}" style="left:355px;top:640px;width:370px">`,
};

(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await br.newPage({ viewport: { width: 1080, height: 1080 } });
  for (const [k, body] of Object.entries(OPTIONS)) {
    await p.setContent(`<!doctype html><html><head><style>${BASE}</style></head><body>${body}</body></html>`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(__dirname, `opcion-${k}.png`) });
    console.log('ok', k);
  }
  await br.close();
})();
