// Assets del perfil de Instagram de Out: foto de perfil, portadas de
// destacados y las historias que van dentro de cada destacado.
// Uso: node instagram/scripts/perfil.cjs   (escribe en instagram/perfil/)
const path = require('path');
const { IMG, C, logo, pair, page, band, render } = require('./kit.cjs');

const OUT = path.join(__dirname, '..', 'perfil');
const gap = (kind) => (kind === 'angle' ? 0.9 : 0.3);

// ── Foto de perfil (se recorta en círculo: todo va en el 70 % central) ─────
const profile = [
  [page(1080, 1080, C.klein, `<div class="abs" style="left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center">${logo(C.pure, 520)}</div>`), 1080, 1080, 'foto-perfil-out.png'],
  [page(1080, 1080, C.klein, `<img class="abs" src="${IMG.avatar}" style="width:820px;left:130px;top:150px">`), 1080, 1080, 'foto-perfil-mango.png'],
];

// ── Portadas de destacados (Instagram muestra el centro, en círculo) ───────
const cover = (bg, inner) =>
  page(1080, 1920, bg, `<div class="abs" style="left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center">${inner}</div>`);
const covers = [
  [cover(C.klein, pair('curly', C.carne, 330, gap('curly'))), 'portada-servicios.png'],
  [cover(C.carne, pair('square', C.klein, 330, gap('square'))), 'portada-out-emprende.png'],
  [cover(C.deep, pair('angle', C.carne, 330, gap('angle'))), 'portada-asi-trabajamos.png'],
  [cover(C.klein, `<img src="${IMG.avatar}" style="width:620px">`), 'portada-cotiza.png'],
  [cover(C.pure, pair('curly', C.carneDeep, 330, gap('curly'))), 'portada-consejos.png'],
  [cover(C.carne, logo(C.klein, 600)), 'portada-quien-soy.png'],
].map(([html, name]) => [html, 1080, 1920, name]);

// ── Historias (1080 × 1920; las zonas de arriba y abajo quedan libres) ─────
const cta = (color) =>
  `<div class="abs" style="left:80px;right:80px;bottom:260px;display:flex;align-items:center;justify-content:space-between">${logo(color, 110)}<span style="font:500 30px I;color:${color}">outstudio.online</span></div>`;

const story = (bg, fg, accent, kind, title, text, extra = '') =>
  page(1080, 1920, bg, `
    <div class="abs" style="left:80px;top:300px">${pair(kind, accent, 150, gap(kind))}</div>
    <div class="abs" style="left:80px;right:80px;top:560px">
      <div class="d" style="font-size:136px;color:${fg}">${title}</div>
      <p style="margin-top:54px;font-size:56px;line-height:1.36;color:${fg};opacity:.92;max-width:900px">${text}</p>
    </div>
    ${extra}${cta(fg)}`);

const intro = (bg, fg, accent, kind, title, sub) =>
  page(1080, 1920, bg, `
    ${band(120, 'top:0')}
    <div class="abs" style="left:80px;top:300px">${logo(fg, 150)}</div>
    <div class="abs" style="left:80px;right:80px;top:640px">
      <div class="d" style="font-size:170px;color:${fg}">${title}</div>
      <p style="margin-top:54px;font-size:50px;line-height:1.35;color:${accent};max-width:800px">${sub}</p>
    </div>
    <img class="abs" src="${IMG.asoma}" style="width:600px;right:-6px;bottom:200px">`);

const stories = [];
const add = (prefix, list) => list.forEach((html, k) => stories.push([html, 1080, 1920, `${prefix}-${String(k + 1).padStart(2, '0')}.png`]));

add('servicios', [
  intro(C.klein, C.pure, C.carne, 'curly', 'Lo que hacemos', 'Diseño UX/UI y desarrollo web con código propio.'),
  story(C.pure, C.klein, C.carneDeep, 'curly', 'Desarrollo web a medida', 'Sitios y tiendas con código propio, sin plantillas. Cada proyecto parte de un objetivo: que quien llega compre, escriba o reserve.'),
  story(C.carne, C.klein, C.carneDeep, 'square', 'Tiendas Shopify', 'Tu tienda online con diseño propio, pasarela de pagos y envíos, lista para vender desde el primer día.'),
  story(C.deep, C.pure, C.carne, 'angle', 'Sitios en WordPress', 'Un sitio rápido y con diseño propio que actualizas tú mismo, sin depender de nadie.'),
  story(C.pure, C.klein, C.carneDeep, 'square', 'Landing pages', 'Páginas de campaña con un solo objetivo: que quien llega actúe.'),
  story(C.klein, C.pure, C.carne, 'curly', 'Branding', 'Logo e identidad visual con carácter, igual de bien en tu sitio, tus redes y tus empaques.'),
]);

add('out-emprende', [
  intro(C.deep, C.pure, C.carne, 'square', 'Out Emprende', 'Tu proyecto web, hasta en 3 cuotas sin intereses.'),
  story(C.carne, C.klein, C.carneDeep, 'square', 'Para negocios que están arrancando', 'Tu tienda online, tu sitio web, una landing page o tu marca, con el mismo cuidado de diseño de todos nuestros proyectos.'),
  story(C.klein, C.pure, C.carne, 'curly', 'Cómo empezar', 'Cuéntale tu idea a Mango en outstudio.online. En 6 a 24 horas te llega tu cotización.'),
]);

const STEPS = [
  { kind: 'square', verb: 'Escuchamos.', text: 'Entendemos tu negocio y lo que tiene que lograr el proyecto. Recibes una propuesta clara, con alcance y tiempos.' },
  { kind: 'curly', verb: 'Construimos.', text: 'Diseñamos la experiencia y la desarrollamos con código propio. Ves avances reales y los apruebas.' },
  { kind: 'angle', verb: 'Lanzamos.', text: 'Probamos todo antes de salir: velocidad, pagos y formularios. Tu página queda publicada y lista para usar.' },
  { kind: 'square', verb: 'Seguimos.', text: 'No desaparecemos después del lanzamiento. Soporte, ajustes y mejoras cuando los necesites.' },
];
add('asi-trabajamos', [
  intro(C.klein, C.pure, C.carne, 'angle', 'Así trabajamos', 'De tu idea al lanzamiento, y después.'),
  ...STEPS.map((s, k) => (k % 2 ? story(C.deep, C.carne, C.carne, s.kind, s.verb, s.text) : story(C.pure, C.klein, C.carneDeep, s.kind, s.verb, s.text))),
]);

add('cotiza', [
  page(1080, 1920, C.klein, `
    <div class="abs" style="left:80px;right:80px;top:300px">
      <div class="d" style="font-size:170px;color:${C.pure}">Hola, soy Mango</div>
      <p style="margin-top:50px;font-size:50px;line-height:1.35;color:${C.carne};max-width:860px">Atiendo las cotizaciones de Out. Te hago unas preguntas rápidas, con opciones para que no tengas que escribir mucho.</p>
    </div>
    <img class="abs" src="${IMG.laptop}" style="width:760px;right:-10px;bottom:440px">
    ${cta(C.pure)}`),
  story(C.carne, C.klein, C.carneDeep, 'curly', 'Tu cotización en 6 a 24 horas', 'Respondes unas preguntas en outstudio.online y el equipo te manda tu cotización. Si estás empezando, pregunta por Out Emprende.'),
]);

// ── Publicación de presentación (se deja fija en el perfil) ────────────────
const presentacion = [
  [page(1080, 1350, C.klein, `
    ${band(110, 'top:0')}
    <div class="abs" style="left:80px;top:190px">${logo(C.pure, 130)}</div>
    <div class="abs" style="left:80px;right:80px;top:400px">
      <div class="d" style="font-size:128px;color:${C.pure}">Diseño UX/UI y desarrollo web.</div>
      <p style="margin-top:44px;color:${C.carne};font-size:42px;line-height:1.35;max-width:620px">Tiendas Shopify, sitios, landing pages y marca.</p>
    </div>
    <img class="abs" src="${IMG.laptop}" style="width:560px;right:20px;bottom:130px">
    <div class="abs" style="left:80px;bottom:64px;font:500 28px I;color:${C.pure}">Never the usual. · outstudio.online</div>`), 1080, 1350, 'publicacion-presentacion.png'],
];

(async () => {
  await render(OUT, profile);
  await render(OUT, presentacion);
  await render(path.join(OUT, 'portadas'), covers);
  await render(path.join(OUT, 'historias'), stories);
})();
