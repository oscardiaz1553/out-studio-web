// Lote 1 de Instagram: carrusel "3 errores que frenan tu tienda online",
// carrusel de Out Emprende y portada del reel de Diario Deportes.
// Uso: node design-src/instagram/lote-1.cjs   (escribe en design-src/instagram/lote-1/)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const OUT_DIR = path.join(__dirname, 'lote-1');
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

// ── Carrusel: 3 errores que frenan tu tienda online ─────────────────────────
const ERR_N = 6;
const ERRORS = [
  {
    kind: 'square',
    title: 'Tarda en cargar',
    problem: 'Fotos pesadas, apps que nadie usa y un tema cargado. En el celular, con datos, la gente se cansa de esperar y se va antes de ver un producto.',
    fix: 'Fotos livianas, solo las apps que necesitas y un diseño hecho para tu tienda.',
  },
  {
    kind: 'curly',
    title: 'No se ve bien en el celular',
    problem: 'Botones diminutos, textos que no se leen y un menú escondido. Si la tienda se pensó en computador, en el celular se siente rota.',
    fix: 'Diseñar primero para el celular, que es donde más se compra, y después adaptar a pantallas grandes.',
  },
  {
    kind: 'angle',
    title: 'Pagar es un enredo',
    problem: 'Crear cuenta a la fuerza, formularios largos y pocos medios de pago. Justo en el último paso, el cliente abandona el carrito.',
    fix: 'Compra sin crear cuenta, un checkout corto y los pagos que la gente usa: PSE, Nequi y tarjeta.',
  },
];

const errSlides = [
  // Portada
  page(1080, 1350, C.klein, `
    <div class="abs" style="right:-60px;top:120px;opacity:.08">${pair('curly', C.carne, 520)}</div>
    <div class="abs" style="left:80px;top:80px">${logo(C.pure, 120)}</div>
    <div class="abs" style="left:80px;top:250px;width:860px">
      <div class="d" style="font-size:150px;color:${C.pure}">3 errores que frenan tu tienda online</div>
      <p style="margin-top:40px;color:${C.carne};font-size:40px">Y cómo arreglarlos.</p>
    </div>
    <img class="abs" src="${IMG.asoma}" style="width:640px;right:-6px;bottom:150px">
    <div class="abs" style="left:80px;bottom:64px;display:flex;align-items:center;gap:16px;color:${C.carne};font:500 28px I">Desliza
      <svg width="40" height="20" viewBox="0 0 40 20"><path d="M2 10h34M28 2l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>`),
  // Un error por lámina
  ...ERRORS.map((e, k) =>
    page(1080, 1350, k === 1 ? C.carne : C.pure, `
      <div class="abs" style="left:80px;top:96px">${pair(e.kind, C.carneDeep, 84, e.kind === 'angle' ? 0.9 : 0.3)}</div>
      <div class="abs" style="left:80px;right:80px;top:230px">
        <div class="d" style="font-size:112px;color:${C.klein}">${e.title}</div>
        <p style="margin-top:44px;color:${C.deep};font-size:38px">${e.problem}</p>
      </div>
      <div class="abs" style="left:80px;right:80px;bottom:170px;background:${C.klein};border-radius:36px;padding:48px 52px">
        <div style="font:600 26px I;color:${C.carne};margin-bottom:16px">Cómo se arregla</div>
        <p style="color:${C.pure};font-size:36px">${e.fix}</p>
      </div>
      ${footer(k + 1, ERR_N, C.klein, 'rgba(27,47,204,.22)')}`),
  ),
  // Resumen
  page(1080, 1350, C.deep, `
    ${band(110, 'top:0')}
    <div class="abs" style="left:80px;right:80px;top:250px">
      <div class="d" style="font-size:104px;color:${C.carne}">Una tienda que vende es fácil de usar.</div>
      <div style="margin-top:64px;display:flex;flex-direction:column;gap:30px">
        ${['Carga rápido', 'Se ve bien en el celular', 'Cobra sin enredos'].map((t) => `<div style="display:flex;gap:22px;align-items:center">${check(C.carne, C.deep)}<span style="font:500 42px I;color:${C.pure}">${t}</span></div>`).join('')}
      </div>
    </div>
    ${footer(4, ERR_N, C.pure, 'rgba(251,248,245,.25)')}`),
  // Llamado
  page(1080, 1350, C.klein, `
    <div class="abs" style="left:80px;right:80px;top:150px">
      <div class="d" style="font-size:120px;color:${C.pure}">¿Tu tienda tiene alguno?</div>
      <p style="margin-top:40px;color:${C.carne};font-size:40px">Escríbenos y te decimos cómo mejorarla. Diseñamos y construimos tiendas Shopify a la medida.</p>
      <div style="margin-top:56px;display:inline-flex;background:${C.carne};color:${C.klein};font:600 36px I;padding:26px 44px;border-radius:999px">Cotiza en outstudio.online</div>
    </div>
    <img class="abs" src="${IMG.laptop}" style="width:600px;right:40px;bottom:150px">
    ${footer(5, ERR_N, C.pure, 'rgba(251,248,245,.3)')}`),
];

// ── Carrusel: Out Emprende ──────────────────────────────────────────────────
const EMP_N = 3;
const empSlides = [
  page(1080, 1350, C.carne, `
    <div class="abs" style="left:80px;top:80px">${logo(C.klein, 120)}</div>
    <div class="abs" style="left:80px;top:230px">${pair('curly', C.klein, 120)}</div>
    <div class="abs" style="left:80px;right:80px;top:410px">
      <div class="d" style="font-size:128px;color:${C.klein}">¿Estás arrancando tu negocio?</div>
      <p style="margin-top:40px;color:${C.deep};font-size:40px;max-width:600px">Out Emprende: tu proyecto web, hasta en 3 cuotas sin intereses.</p>
      <div style="margin-top:44px;display:flex;gap:22px">${[0, 1, 2].map(() => `<span style="width:56px;height:56px;border-radius:50%;background:${C.carneDeep}"></span>`).join('')}</div>
    </div>
    <img class="abs" src="${IMG.mango}" style="width:620px;right:-150px;bottom:40px;transform:rotate(-14deg)">
    <div class="abs" style="left:80px;bottom:64px">${dots(0, EMP_N, C.klein, 'rgba(27,47,204,.22)')}</div>`),
  page(1080, 1350, C.deep, `
    <div class="abs" style="left:80px;top:110px">${pair('square', C.carne, 80)}</div>
    <div class="abs" style="left:80px;right:80px;top:240px">
      <div class="d" style="font-size:112px;color:${C.carne}">Es para ti si…</div>
      <div style="margin-top:64px;display:flex;flex-direction:column;gap:40px">
        ${[
          'Tu negocio está empezando o tiene menos de 2 años.',
          'Es tu primera tienda, sitio web o marca profesional, u hoy vendes solo por redes y WhatsApp.',
          'Si es una tienda online, tiene hasta 40 productos.',
        ].map((t) => `<div style="display:flex;gap:26px;align-items:flex-start">${check(C.carne, C.deep)}<p style="color:${C.pure};font-size:42px">${t}</p></div>`).join('')}
      </div>
    </div>
    ${footer(1, EMP_N, C.pure, 'rgba(251,248,245,.25)')}`),
  page(1080, 1350, C.klein, `
    <div class="abs" style="right:-40px;top:60px;opacity:.08">${pair('curly', C.carne, 440)}</div>
    <div class="abs" style="left:80px;right:80px;top:130px">
      <div class="d" style="font-size:96px;color:${C.pure}">Tienda online, sitio web, landing page o tu marca.</div>
      <p style="margin-top:40px;color:${C.carne};font-size:38px;max-width:820px">Diseño UX/UI a la medida, sin plantillas. Y lo pagas hasta en 3 cuotas sin intereses.</p>
      <div style="margin-top:52px;display:inline-flex;background:${C.carne};color:${C.klein};font:600 34px I;padding:26px 44px;border-radius:999px">outstudio.online/out-emprende</div>
    </div>
    <img class="abs" src="${IMG.asoma}" style="width:560px;right:-6px;bottom:150px">
    ${footer(2, EMP_N, C.pure, 'rgba(251,248,245,.3)')}`),
];

// ── Portada del reel de Diario Deportes (9:16, lo central se lee en la grilla 4:5)
const reelCover = page(1080, 1920, C.klein, `
  <div class="abs" style="left:-80px;top:380px;opacity:.08">${pair('square', C.carne, 760, 0.6)}</div>
  <div class="abs" style="left:90px;right:90px;top:430px">
    <div style="display:flex;align-items:center;gap:30px">${logo(C.pure, 170)}<span class="d" style="font-size:90px;color:${C.carne}">×</span></div>
    <div style="margin-top:40px;background:${C.deep};border-radius:32px;padding:40px 48px;display:inline-block"><img src="${IMG.dd}" style="height:110px;display:block"></div>
    <div class="d" style="margin-top:70px;font-size:130px;color:${C.pure}">Así rediseñamos Diario Deportes</div>
    <p style="margin-top:36px;color:${C.carne};font-size:44px">Antes y después de un medio deportivo.</p>
  </div>
  ${band(150, 'bottom:0')}`);

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const shoot = async (html, w, h, name) => {
    const p = await br.newPage({ viewport: { width: w, height: h } });
    await p.setContent(html);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(OUT_DIR, name) });
    await p.close();
  };
  const ERR_NAMES = ['portada', 'carga', 'celular', 'pago', 'resumen', 'cotiza'];
  for (const [i, html] of errSlides.entries()) await shoot(html, 1080, 1350, `errores-${String(i + 1).padStart(2, '0')}-${ERR_NAMES[i]}.png`);
  const EMP_NAMES = ['portada', 'para-ti', 'cotiza'];
  for (const [i, html] of empSlides.entries()) await shoot(html, 1080, 1350, `emprende-${String(i + 1).padStart(2, '0')}-${EMP_NAMES[i]}.png`);
  await shoot(reelCover, 1080, 1920, 'reel-diario-deportes-portada.png');
  await br.close();
  console.log('ok', OUT_DIR);
})();
