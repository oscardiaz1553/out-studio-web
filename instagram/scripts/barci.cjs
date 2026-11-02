// Carrusel «BARCI»: caso de la tienda Shopify de la marca de ropa femenina de una clienta de Out (7 láminas 1080 × 1350).
// Las capturas salen de instagram/barci/capturas (barci.com.co en celular; ver instagram/barci/capturar.cjs y secciones.cjs).
const path = require('path'), fs = require('fs');
const { ROOT, C, logo, footer, page, render } = require('./kit.cjs');
const cap = (n) => `data:image/png;base64,${fs.readFileSync(path.join(ROOT, 'instagram/barci/capturas', n)).toString('base64')}`;

// Teléfono con captura (390 × 844 lógicos). recorte = px de la captura (a 2x) que se esconden arriba (barra de anuncio).
const tel = (img, w, { recorte = 0, desde = 0, alto = 1688 } = {}) => {
  const k = w / 780, pad = Math.round(w * 0.034), h = Math.round((alto - recorte) * k);
  return `<div style="width:${w + pad * 2}px;height:${h + pad * 2}px;border-radius:${Math.round(w * 0.14)}px;background:${C.deep};padding:${pad}px;box-shadow:0 30px 60px rgba(20,30,92,.35)">
    <div style="width:${w}px;height:${h}px;border-radius:${Math.round(w * 0.11)}px;overflow:hidden;background:#fff"><img src="${img}" style="width:${w}px;display:block;margin-top:${-Math.round((recorte + desde) * k)}px"></div></div>`;
};
const chip = (t, bg = C.carne, fg = C.klein) => `<span style="display:inline-block;font:600 28px I;padding:12px 26px;border-radius:40px;background:${bg};color:${fg}">${t}</span>`;
const N = 7;
const slides = [];

// 1. Portada
slides.push(page(1080, 1350, C.klein, `
  <div class="abs" style="left:80px;top:84px">${chip('Caso · Tienda Shopify')}</div>
  <div class="abs d" style="left:80px;right:80px;top:170px;font-size:98px;color:${C.pure}">Infinitas formas<br>de ser tú.<br><span style="color:${C.carne}">Así armamos<br>la tienda.</span></div>
  <div class="abs" style="left:80px;top:640px;font:500 38px/1.25 I;color:${C.pure};opacity:.85;width:470px">BARCI, moda femenina colombiana, vendiendo en línea en 4 semanas.</div>
  <div class="abs" style="right:70px;top:470px;transform:rotate(3deg)">${tel(cap('celular-home-00.png'), 330, { recorte: 108 })}</div>
  ${footer(0, N, C.pure, 'rgba(251,248,245,.35)')}`));

// 2. La marca
slides.push(page(1080, 1350, C.carne, `
  <div class="abs" style="left:80px;top:84px">${chip('La marca', C.klein, C.pure)}</div>
  <div class="abs d" style="left:80px;right:80px;top:170px;font-size:92px;color:${C.klein}">Una marca que<br>no cabe en una<br>sola forma.</div>
  <div class="abs" style="left:80px;top:560px;width:470px;font:500 38px/1.3 I;color:${C.deep}">BARCI nació en 2018 con una idea: <b>no hay una sola forma de ser tú</b>. Básicos para combinar, cápsulas para atreverse y accesorios para completar.</div>
  <div class="abs" style="right:70px;top:470px;transform:rotate(-3deg)">${tel(cap('celular-home-03.png'), 330, { desde: 0 })}</div>
  ${footer(1, N, C.klein, 'rgba(27,47,204,.3)')}`));

// 3. El reto
slides.push(page(1080, 1350, C.pure, `
  <div class="abs" style="left:80px;top:84px">${chip('El reto', C.klein, C.pure)}</div>
  <div class="abs d" style="left:80px;right:80px;top:170px;font-size:92px;color:${C.klein}">Una tienda que<br>crece con<br>cada cápsula.</div>
  <div class="abs" style="left:80px;right:80px;top:560px;display:flex;flex-direction:column;gap:20px;width:520px">
    ${['Básicos que son la base', 'Cápsulas que cambian', 'Accesorios y Barci Box'].map((t, i) => `<div style="display:flex;gap:20px;align-items:center;background:${C.paper};border-radius:30px;padding:26px 30px"><span class="d" style="font-size:54px;color:${C.klein}">${i + 1}</span><span style="font:500 36px/1.15 I;color:${C.deep}">${t}</span></div>`).join('')}
  </div>
  <div class="abs" style="right:70px;top:470px;transform:rotate(2deg)">${tel(cap('celular-home-01.png'), 330, {})}</div>
  ${footer(2, N, C.klein, 'rgba(27,47,204,.3)')}`));

// 4. Producto
slides.push(page(1080, 1350, C.klein, `
  <div class="abs" style="left:80px;top:84px">${chip('La página de producto')}</div>
  <div class="abs d" style="left:80px;right:80px;top:170px;font-size:92px;color:${C.pure}">Que elegir<br>talla y color<br><span style="color:${C.carne}">sea fácil.</span></div>
  <div class="abs" style="left:80px;top:560px;width:430px;font:500 38px/1.3 I;color:${C.pure};opacity:.9">Variantes claras, descripción con composición y cuidados, y las dudas de compra resueltas ahí mismo.</div>
  <div class="abs" style="right:70px;top:470px;transform:rotate(-3deg)">${tel(cap('celular-producto-02.png'), 330, {})}</div>
  ${footer(3, N, C.pure, 'rgba(251,248,245,.35)')}`));

// 5. Brava
slides.push(page(1080, 1350, C.carne, `
  <div class="abs" style="left:80px;top:84px">${chip('Una cápsula', C.klein, C.pure)}</div>
  <div class="abs d" style="left:80px;right:80px;top:170px;font-size:92px;color:${C.klein}">Lanzamientos<br>con personalidad<br>propia.</div>
  <div class="abs" style="left:80px;top:560px;width:430px;font:500 38px/1.3 I;color:${C.deep}">«Brava, porque sí»: su propia colección con identidad visual, dentro de la misma tienda.</div>
  <div class="abs" style="right:70px;top:470px;transform:rotate(3deg)">${tel(cap('celular-brava-00.png'), 330, { recorte: 108 })}</div>
  ${footer(4, N, C.klein, 'rgba(27,47,204,.3)')}`));

// 6. Lo que entregamos
const items = ['Diseño que traduce la marca: tipografía editorial y paleta cálida', 'Tienda en Shopify pensada primero para celular', 'Catálogo con colores y tallas cargado', 'Pagos y envíos para Colombia', 'Guía de tallas, cambios y preguntas frecuentes', 'Blog, suscripción y Barci Box mensual'];
slides.push(page(1080, 1350, C.pure, `
  <div class="abs" style="left:80px;top:84px">${chip('Lo que entregamos', C.klein, C.pure)}</div>
  <div class="abs d" style="left:80px;right:80px;top:170px;font-size:92px;color:${C.klein}">De la idea<br>a la tienda.</div>
  <div class="abs" style="left:80px;right:80px;top:420px;display:flex;flex-direction:column;gap:20px">
    ${items.map((t) => `<div style="display:flex;gap:26px;align-items:center;background:${C.klein};border-radius:34px;padding:26px 34px"><span style="flex:none;width:46px;height:46px;border-radius:50%;background:${C.carne};color:${C.klein};display:flex;align-items:center;justify-content:center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span style="font:500 36px/1.18 I;color:${C.pure}">${t}</span></div>`).join('')}
  </div>
  ${footer(5, N, C.klein, 'rgba(27,47,204,.3)')}`));

// 7. Cierre
slides.push(page(1080, 1350, C.klein, `
  <div class="abs d" style="left:80px;right:80px;top:150px;font-size:128px;color:${C.pure}">4 semanas<br>de la idea<br><span style="color:${C.carne}">a vender.</span></div>
  <div class="abs" style="left:80px;right:80px;top:640px;font:500 42px/1.3 I;color:${C.pure};opacity:.9">¿Tu marca necesita su tienda? Cuéntanos tu idea y la armamos contigo.</div>
  <div class="abs d" style="left:80px;top:900px;font-size:58px;color:${C.klein};background:${C.carne};border-radius:80px;padding:34px 64px">outstudio.online</div>
  <div class="abs" style="left:80px;top:1070px;font:500 28px/1.3 I;color:${C.pure};opacity:.7">Tienda de BARCI · barci.com.co</div>
  ${footer(6, N, C.pure, 'rgba(251,248,245,.35)')}`));

render(path.join(ROOT, 'instagram/barci/carrusel'), slides.map((h, i) => [h, 1080, 1350, `barci-${String(i + 1).padStart(2, '0')}.png`]));
