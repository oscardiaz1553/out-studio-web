// Lote 2 de Instagram: carrusel "¿Shopify, WordPress o landing page?",
// carrusel "Antes de pedir tu página web, ten esto listo" y Mango
// (publicación y historia).
// Uso: node instagram/scripts/lote-2.cjs   (escribe en instagram/lote-2/)
const path = require('path');
const { IMG, C, logo, pair, check, dots, footer, page, band, render } = require('./kit.cjs');

const n2 = (i) => String(i + 1).padStart(2, '0');

// Botón: el texto toma el color del fondo donde está el botón.
const button = (text, bg, fg) =>
  `<div style="display:inline-flex;background:${bg};color:${fg};font:600 34px I;padding:24px 42px;border-radius:999px">${text}</div>`;

const bullets = (items, color, mark) =>
  `<div style="display:flex;flex-direction:column;gap:30px">${items
    .map((t) => `<div style="display:flex;gap:24px;align-items:flex-start">${mark}<p style="color:${color};font-size:38px">${t}</p></div>`)
    .join('')}</div>`;

// ── Carrusel: ¿Shopify, WordPress o landing page? ──────────────────────────
const PLAT_N = 6;
const PLATFORMS = [
  {
    kind: 'curly', bg: C.carne, title: 'Tienda Shopify', lead: 'Si quieres vender en línea.', fg: C.klein, text: C.deep,
    items: ['Tienes productos y quieres cobrar en la página.', 'Necesitas pagos, envíos e inventario.', 'Quieres administrarla tú, sin depender de nadie.'],
    art: `<img class="abs" src="${IMG.mango}" style="width:420px;right:-90px;top:70px;transform:rotate(14deg)">`,
  },
  {
    kind: 'square', bg: C.pure, title: 'Sitio en WordPress', lead: 'Si quieres que te encuentren y te escriban.', fg: C.klein, text: C.deep,
    items: ['Vendes servicios, no productos en línea.', 'Quieres blog, portafolio o varias páginas.', 'Necesitas actualizar el contenido seguido.'],
    art: '',
  },
  {
    kind: 'angle', bg: C.deep, title: 'Landing page', lead: 'Si tienes una campaña o un lanzamiento.', fg: C.carne, text: C.pure,
    items: ['Una sola página con un solo objetivo.', 'Pensada para anuncios: que la gente compre o te escriba.', 'Lista en poco tiempo.'],
    art: '',
  },
];

const platSlides = [
  page(1080, 1350, C.klein, `
    <div class="abs" style="left:80px;top:80px">${logo(C.pure, 120)}</div>
    <div class="abs" style="left:80px;top:240px;display:flex;gap:44px;align-items:center">
      ${pair('curly', C.carne, 96)}${pair('square', C.carne, 96)}${pair('angle', C.carne, 96, 0.9)}
    </div>
    <div class="abs" style="left:80px;right:80px;top:420px">
      <div class="d" style="font-size:132px;color:${C.pure}">¿Shopify, WordPress o landing page?</div>
      <p style="margin-top:40px;color:${C.carne};font-size:40px;max-width:560px">Cuál te conviene según lo que quieres lograr.</p>
    </div>
    <img class="abs" src="${IMG.asoma}" style="width:560px;right:-6px;bottom:120px">
    <div class="abs" style="left:80px;bottom:64px;display:flex;align-items:center;gap:16px;color:${C.carne};font:500 28px I">Desliza
      <svg width="40" height="20" viewBox="0 0 40 20"><path d="M2 10h34M28 2l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>`),
  ...PLATFORMS.map((pl, k) => {
    const dark = pl.bg === C.deep;
    return page(1080, 1350, pl.bg, `
      ${pl.art}
      <div class="abs" style="left:80px;top:96px">${pair(pl.kind, C.carneDeep === pl.bg ? C.pure : dark ? C.carne : C.carneDeep, 84, pl.kind === 'angle' ? 0.9 : 0.3)}</div>
      <div class="abs" style="left:80px;right:80px;top:240px">
        <div class="d" style="font-size:118px;color:${pl.fg};max-width:760px">${pl.title}</div>
        <p style="margin-top:30px;color:${pl.text};font:600 42px/1.3 I">${pl.lead}</p>
        <div style="margin-top:64px">${bullets(pl.items, pl.text, check(dark ? C.carne : C.klein, dark ? C.deep : C.pure))}</div>
      </div>
      ${footer(k + 1, PLAT_N, dark ? C.pure : C.klein, dark ? 'rgba(251,248,245,.25)' : 'rgba(27,47,204,.22)')}`);
  }),
  page(1080, 1350, C.klein, `
    <div class="abs" style="left:80px;right:80px;top:150px">
      <div class="d" style="font-size:112px;color:${C.carne}">En corto</div>
      <div style="margin-top:70px;display:flex;flex-direction:column">
        ${[['Quieres vender', 'Shopify'], ['Quieres que te encuentren', 'WordPress'], ['Tienes una campaña', 'Landing page']]
          .map(([a, b2]) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:40px 0;border-bottom:2px solid rgba(251,248,245,.2)"><span style="font:500 40px I;color:${C.pure}">${a}</span><span class="d" style="font-size:54px;color:${C.carne};letter-spacing:-0.03em">${b2}</span></div>`)
          .join('')}
      </div>
      <p style="margin-top:56px;color:${C.pure};opacity:.85">Y si necesitas varias, se pueden combinar.</p>
    </div>
    ${footer(4, PLAT_N, C.pure, 'rgba(251,248,245,.3)')}`),
  page(1080, 1350, C.carne, `
    <div class="abs" style="left:80px;right:80px;top:150px">
      <div class="d" style="font-size:120px;color:${C.klein}">¿Todavía no sabes cuál?</div>
      <p style="margin-top:40px;color:${C.deep};font-size:40px;max-width:820px">Cuéntanos tu idea y te recomendamos el camino. Cotización a la medida en 6 a 24 horas.</p>
      <div style="margin-top:56px">${button('Cotiza en outstudio.online', C.klein, C.carne)}</div>
    </div>
    <img class="abs" src="${IMG.laptop}" style="width:600px;right:40px;bottom:150px">
    ${footer(5, PLAT_N, C.klein, 'rgba(27,47,204,.22)')}`),
];

// ── Carrusel: antes de pedir tu página web, ten esto listo ─────────────────
const LIST_N = 6;
const box = (color) =>
  `<span style="flex:none;width:44px;height:44px;border-radius:10px;border:4px solid ${color};margin-top:2px"></span>`;
const LIST = [
  { kind: 'square', title: 'Tu marca', items: ['Tu logo en buena calidad.', 'Tus colores y tipografías, si ya los tienes.'], extra: 'Si todavía no tienes marca, también la hacemos.' },
  { kind: 'curly', title: 'Fotos', items: ['Fotos de tus productos o de tu trabajo, con buena luz.', 'Fotos tuyas o de tu equipo, si quieres mostrarte.'], extra: 'Si no tienes, te ayudamos con un estudio de fotografía aliado.' },
  { kind: 'angle', title: 'Textos', items: ['Quiénes son y qué venden.', 'Preguntas frecuentes.', 'Políticas de envío, cambios y devoluciones.'], extra: 'Si te cuesta escribirlos, te ayudamos a ordenarlos.' },
  { kind: 'square', title: 'Lo que vendes y cómo cobras', items: ['Lista de productos o servicios con precios.', 'Medios de pago que quieres recibir.', 'El nombre de tu dominio, o la idea.'], extra: 'Con esto te recomendamos la plataforma y la pasarela de pagos que más te convienen.' },
];
const listSlides = [
  page(1080, 1350, C.deep, `
    ${band(110, 'top:0')}
    <div class="abs" style="left:80px;top:190px">${logo(C.pure, 110)}</div>
    <div class="abs" style="left:80px;right:80px;top:370px">
      <div class="d" style="font-size:122px;color:${C.pure}">Antes de pedir tu página web, ten esto listo</div>
      <p style="margin-top:44px;color:${C.carne};font-size:40px">Guárdalo para cuando la vayas a pedir.</p>
    </div>
    <div class="abs" style="left:80px;bottom:64px;display:flex;align-items:center;gap:16px;color:${C.carne};font:500 28px I">Desliza
      <svg width="40" height="20" viewBox="0 0 40 20"><path d="M2 10h34M28 2l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>`),
  ...LIST.map((it, k) => {
    const bg = k % 2 ? C.carne : C.pure;
    return page(1080, 1350, bg, `
      <div class="abs" style="left:80px;top:96px">${pair(it.kind, C.carneDeep, 84, it.kind === 'angle' ? 0.9 : 0.3)}</div>
      <div class="abs" style="left:80px;right:80px;top:240px">
        <div class="d" style="font-size:112px;color:${C.klein};max-width:820px">${it.title}</div>
        <div style="margin-top:70px">${bullets(it.items, C.deep, box(C.klein))}</div>
      </div>
      ${it.extra ? `<div class="abs" style="left:80px;right:80px;bottom:170px;background:${C.klein};border-radius:36px;padding:44px 52px"><p style="color:${C.pure};font-size:36px">${it.extra}</p></div>` : ''}
      ${footer(k + 1, LIST_N, C.klein, 'rgba(27,47,204,.22)')}`);
  }),
  page(1080, 1350, C.klein, `
    <div class="abs" style="right:-40px;top:60px;opacity:.08">${pair('curly', C.carne, 440)}</div>
    <div class="abs" style="left:80px;right:80px;top:150px">
      <div class="d" style="font-size:120px;color:${C.pure}">¿No tienes todo? Igual escríbenos.</div>
      <p style="margin-top:40px;color:${C.carne};font-size:40px;max-width:760px">Lo armamos contigo, paso a paso.</p>
      <div style="margin-top:56px">${button('Cotiza en outstudio.online', C.carne, C.klein)}</div>
    </div>
    <img class="abs" src="${IMG.asoma}" style="width:560px;right:-6px;bottom:150px">
    ${footer(5, LIST_N, C.pure, 'rgba(251,248,245,.3)')}`),
];

// ── Mango: publicación y historia ──────────────────────────────────────────
const mangoCopy = (big) => `
  <div class="d" style="font-size:${big}px;color:${C.pure};white-space:nowrap">Hola, soy Mango 🥭</div>
  <p style="margin-top:40px;color:${C.carne};font-size:42px;max-width:820px">Atiendo las cotizaciones de Out. Te hago unas preguntas rápidas y en 6 a 24 horas tienes tu cotización.</p>`;

// Mango entre corchetes, como en la lámina de WordPress.
const framedMango = (top, h, avatarW, gap) => `
  <div class="abs" style="left:0;right:0;top:${top}px;display:flex;justify-content:center">${pair('square', C.carne, h, gap)}</div>
  <img class="abs" src="${IMG.avatar}" style="width:${avatarW}px;left:50%;transform:translateX(-50%);top:${top + h * 0.5 - avatarW * 0.62}px">`;

const mangoPost = page(1080, 1350, C.klein, `
  <div class="abs" style="left:80px;top:80px">${logo(C.pure, 120)}</div>
  <div class="abs" style="left:80px;right:80px;top:230px">${mangoCopy(104)}</div>
  ${framedMango(620, 420, 330, 1.0)}
  <div class="abs" style="left:0;right:0;bottom:84px;display:flex;justify-content:center">${button('Háblame en outstudio.online', C.carne, C.klein)}</div>`);

// Historia: deja libre la franja de abajo para el sticker de enlace.
const mangoStory = page(1080, 1920, C.klein, `
  <div class="abs" style="left:80px;top:180px">${logo(C.pure, 130)}</div>
  <div class="abs" style="left:80px;right:80px;top:360px">${mangoCopy(108)}</div>
  ${framedMango(880, 520, 400, 0.8)}
  ${band(150, 'bottom:0')}`);

render(path.join(__dirname, '..', 'lote-2'), [
  ...platSlides.map((html, i) => [html, 1080, 1350, `plataformas-${n2(i)}-${['portada', 'shopify', 'wordpress', 'landing', 'resumen', 'cotiza'][i]}.png`]),
  ...listSlides.map((html, i) => [html, 1080, 1350, `lista-${n2(i)}-${['portada', 'marca', 'fotos', 'textos', 'ventas', 'cotiza'][i]}.png`]),
  [mangoPost, 1080, 1350, 'mango-publicacion.png'],
  [mangoStory, 1080, 1920, 'mango-historia.png'],
]);
