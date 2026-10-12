// Lote 3 de Instagram: carrusel "¿De qué depende el precio de una página
// web?" y carrusel "Así trabajamos". El reel "3 señales de que tu página
// necesita un rediseño" se hace con HyperFrames: instagram/hyperframes/reel-senales/.
// Uso: node instagram/scripts/lote-3.cjs   (escribe en instagram/lote-3/)
const path = require('path');
const { IMG, C, logo, pair, check, footer, page, band, render } = require('./kit.cjs');

const OUT = path.join(__dirname, '..', 'lote-3');
const n2 = (i) => String(i + 1).padStart(2, '0');
const gap = (kind) => (kind === 'angle' ? 0.9 : 0.3);

const button = (text, bg, fg) =>
  `<div style="display:inline-flex;background:${bg};color:${fg};font:600 34px I;padding:24px 42px;border-radius:999px">${text}</div>`;
const swipe = (color) => `
  <div class="abs" style="left:80px;bottom:64px;display:flex;align-items:center;gap:16px;color:${color};font:500 28px I">Desliza
    <svg width="40" height="20" viewBox="0 0 40 20"><path d="M2 10h34M28 2l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </div>`;
// Par de símbolos grande y sólido, como en las láminas de servicios.
const bigPair = (kind, color, h, style) =>
  `<div class="abs" style="${style}">${pair(kind, color, h, gap(kind))}</div>`;

// ── Carrusel: ¿de qué depende el precio de una página web? ────────────────
const PRICE_N = 7;
const FACTORS = [
  { kind: 'square', title: 'Cuántas páginas o productos', text: 'No es lo mismo una landing de una sola página que una tienda con 200 productos. Más contenido, más trabajo de diseño y de carga.' },
  { kind: 'curly', title: 'Diseño a medida o plantilla', text: 'Una plantilla sale más barata al inicio. Un diseño a medida se piensa para tu negocio y para cómo compran tus clientes.' },
  { kind: 'angle', title: 'Lo que tiene que hacer', text: 'Pagos, envíos, reservas, conexión con tu inventario o tu facturación: cada función suma.' },
  { kind: 'square', title: 'El contenido', text: 'Si ya tienes fotos y textos, se avanza más rápido. Si hay que crearlos, entra en la cuenta.' },
  { kind: 'curly', title: 'Lo que pasa después', text: 'Soporte, ajustes y mejoras: quién te acompaña cuando la página ya está publicada.' },
];
const priceSlides = [
  page(1080, 1350, C.deep, `
    ${band(110, 'top:0')}
    <div class="abs" style="left:80px;top:190px">${logo(C.pure, 110)}</div>
    <div class="abs" style="left:80px;right:80px;top:370px">
      <div class="d" style="font-size:118px;color:${C.pure}">¿De qué depende el precio de una página web?</div>
      <p style="margin-top:44px;color:${C.carne};font-size:40px">Por qué no te damos una cifra al azar.</p>
    </div>
    ${swipe(C.carne)}`),
  ...FACTORS.map((f, k) => {
    const bg = k % 2 ? C.pure : C.carne;
    return page(1080, 1350, bg, `
      ${bigPair(f.kind, C.klein, 300, 'right:80px;bottom:190px')}
      <div class="abs" style="left:80px;top:96px">${pair(f.kind, C.carneDeep, 84, gap(f.kind))}</div>
      <div class="abs" style="left:80px;right:80px;top:240px">
        <div class="d" style="font-size:108px;color:${C.klein};max-width:860px">${f.title}</div>
        <p style="margin-top:50px;color:${C.deep};font-size:42px;max-width:860px">${f.text}</p>
      </div>
      ${footer(k + 1, PRICE_N, C.klein, 'rgba(27,47,204,.22)')}`);
  }),
  page(1080, 1350, C.klein, `
    <div class="abs" style="left:80px;right:80px;top:140px">
      <div class="d" style="font-size:116px;color:${C.pure}">Por eso cotizamos a la medida.</div>
      <p style="margin-top:40px;color:${C.carne};font-size:40px;max-width:860px">Cuéntanos tu proyecto y en 6 a 24 horas tienes tu cotización. Si estás empezando, pregunta por Out Emprende: hasta en 3 cuotas sin intereses.</p>
      <div style="margin-top:52px">${button('Cotiza en outstudio.online', C.carne, C.klein)}</div>
    </div>
    <img class="abs" src="${IMG.laptop}" style="width:560px;right:40px;bottom:150px">
    ${footer(6, PRICE_N, C.pure, 'rgba(251,248,245,.3)')}`),
];

// ── Carrusel: así trabajamos ───────────────────────────────────────────────
const WORK_N = 6;
const STEPS = [
  { kind: 'square', verb: 'Escuchamos', text: 'Entendemos tu negocio y lo que tiene que lograr el proyecto.', gets: 'Una propuesta clara, con alcance y tiempos.' },
  { kind: 'curly', verb: 'Construimos', text: 'Diseñamos la experiencia y la desarrollamos con código propio.', gets: 'Avances reales que ves y apruebas.' },
  { kind: 'angle', verb: 'Lanzamos', text: 'Probamos todo antes de salir: velocidad, pagos y formularios.', gets: 'Tu página publicada y lista para usar.' },
  { kind: 'square', verb: 'Seguimos', text: 'No desaparecemos después del lanzamiento.', gets: 'Soporte, ajustes y mejoras cuando los necesites.' },
];
const workSlides = [
  page(1080, 1350, C.klein, `
    <div class="abs" style="left:80px;top:80px">${logo(C.pure, 120)}</div>
    <div class="abs" style="left:80px;top:250px;display:flex;gap:40px;align-items:center">
      ${STEPS.map((s) => pair(s.kind, C.carne, 90, gap(s.kind))).join('')}
    </div>
    <div class="abs" style="left:80px;right:80px;top:430px">
      <div class="d" style="font-size:150px;color:${C.pure}">Así trabajamos</div>
      <p style="margin-top:40px;color:${C.carne};font-size:42px;max-width:620px">De tu idea al lanzamiento, y después.</p>
    </div>
    <img class="abs" src="${IMG.asoma}" style="width:540px;right:-6px;bottom:120px">
    ${swipe(C.carne)}`),
  ...STEPS.map((s, k) => {
    const dark = k % 2 === 1;
    const bg = dark ? C.deep : C.pure;
    return page(1080, 1350, bg, `
      <div class="abs" style="left:80px;top:110px">${pair(s.kind, dark ? C.carne : C.carneDeep, 130, gap(s.kind))}</div>
      <div class="abs" style="left:80px;right:80px;top:330px">
        <div class="d" style="font-size:140px;color:${dark ? C.carne : C.klein}">${s.verb}.</div>
        <p style="margin-top:44px;color:${dark ? C.pure : C.deep};font-size:42px;max-width:860px">${s.text}</p>
      </div>
      <div class="abs" style="left:80px;right:80px;bottom:170px;background:${dark ? C.carne : C.klein};border-radius:36px;padding:44px 52px">
        <div style="font:600 26px I;color:${dark ? C.carneDeep : C.carne};margin-bottom:14px">Lo que recibes</div>
        <p style="color:${dark ? C.deep : C.pure};font-size:38px">${s.gets}</p>
      </div>
      ${footer(k + 1, WORK_N, dark ? C.pure : C.klein, dark ? 'rgba(251,248,245,.25)' : 'rgba(27,47,204,.22)')}`);
  }),
  page(1080, 1350, C.carne, `
    <div class="abs" style="left:80px;right:80px;top:150px">
      <div class="d" style="font-size:120px;color:${C.klein}">¿Empezamos por escucharte?</div>
      <p style="margin-top:40px;color:${C.deep};font-size:40px;max-width:820px">Cuéntanos tu proyecto. Cotización a la medida en 6 a 24 horas.</p>
      <div style="margin-top:56px">${button('Cotiza en outstudio.online', C.klein, C.carne)}</div>
    </div>
    <img class="abs" src="${IMG.laptop}" style="width:600px;right:40px;bottom:150px">
    ${footer(5, WORK_N, C.klein, 'rgba(27,47,204,.22)')}`),
];

(async () => {
  await render(OUT, [
    ...priceSlides.map((html, i) => [html, 1080, 1350, `precio-${n2(i)}-${['portada', 'paginas', 'diseno', 'funciones', 'contenido', 'despues', 'cotiza'][i]}.png`]),
    ...workSlides.map((html, i) => [html, 1080, 1350, `trabajamos-${n2(i)}-${['portada', 'escuchamos', 'construimos', 'lanzamos', 'seguimos', 'cotiza'][i]}.png`]),
  ]);
})();
