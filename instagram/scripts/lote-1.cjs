// Lote 1 de Instagram: carrusel "3 errores que frenan tu tienda online" y
// carrusel de Out Emprende. El reel de Diario Deportes se hace con
// HyperFrames: instagram/hyperframes/reel-diario-deportes/.
// Uso: node instagram/scripts/lote-1.cjs   (escribe en instagram/lote-1/)
const path = require('path');
const { IMG, C, logo, pair, check, dots, footer, page, band, render } = require('./kit.cjs');

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

const ERR_NAMES = ['portada', 'carga', 'celular', 'pago', 'resumen', 'cotiza'];
const EMP_NAMES = ['portada', 'para-ti', 'cotiza'];
const n2 = (i) => String(i + 1).padStart(2, '0');
render(path.join(__dirname, '..', 'lote-1'), [
  ...errSlides.map((html, i) => [html, 1080, 1350, `errores-${n2(i)}-${ERR_NAMES[i]}.png`]),
  ...empSlides.map((html, i) => [html, 1080, 1350, `emprende-${n2(i)}-${EMP_NAMES[i]}.png`]),
]);
