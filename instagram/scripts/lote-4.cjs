// Lote 4: la imagen «La venta perdida» (1080 × 1350), publicación de una sola imagen.
// Mismo concepto del reel: una clienta quería comprar, la tienda falló de tres formas
// y el contador de ventas perdidas sube.
const path = require('path');
const { ROOT, C, logo, pair, footer, page, render } = require('./kit.cjs');

const fila = (chip, texto) => `
  <div style="display:flex;align-items:center;gap:26px;height:132px;border-radius:38px;background:${C.deep};padding:0 26px 0 22px">
    <div class="d" style="flex:none;width:236px;height:88px;border-radius:24px;background:${C.carne};color:${C.klein};display:flex;align-items:center;justify-content:center;font-size:45px;padding:0">${chip}</div>
    <div style="flex:1;font:500 40px/1.1 I;color:${C.pure}">${texto}</div>
    <div class="d" style="flex:none;height:68px;border-radius:34px;background:${C.carne};color:${C.klein};display:flex;align-items:center;padding:0 28px;font-size:34px;letter-spacing:-0.03em">Se fue.</div>
  </div>`;

const imagen = page(1080, 1350, C.klein, `
  <div class="abs" style="right:-150px;top:250px;opacity:.10;transform:rotate(-4deg)">${pair('angle', C.carne, 640, 0.35)}</div>

  <!-- Contador -->
  <div class="abs" style="left:80px;top:78px;width:920px;height:150px;border-radius:75px;background:${C.deep};display:flex;align-items:center;justify-content:space-between;padding:0 54px 0 62px">
    <span style="font:500 38px/1.12 I;color:${C.pure};opacity:.85">Ventas<br>perdidas</span>
    <span class="d" style="font-size:96px;color:${C.carne}">$540.000</span>
  </div>

  <!-- Gancho -->
  <div class="abs d" style="left:80px;right:80px;top:268px;font-size:104px;color:${C.pure}">
    Esta clienta<br><span style="color:${C.carne}">quiere comprar</span><br>en tu tienda.
  </div>

  <!-- Lo que falló -->
  <div class="abs" style="left:80px;right:80px;top:606px;display:flex;flex-direction:column;gap:18px">
    ${fila('7,4 s', 'Tarda en cargar')}
    ${fila('Zoom', 'No se ve bien en el celular')}
    ${fila('9 campos', 'Pagar es un enredo')}
  </div>

  <!-- Cierre -->
  <div class="abs d" style="left:80px;right:80px;top:1076px;font-size:66px;color:${C.pure}">
    Las tres tienen <span style="color:${C.carne}">arreglo.</span>
  </div>
  <div class="abs" style="left:80px;top:1160px;font:400 26px/1.3 I;color:${C.pure};opacity:.7">Los montos son un ejemplo para que se entienda la idea.</div>

  ${footer(0, 1, C.pure, 'rgba(251,248,245,.35)')}
`);

render(path.join(ROOT, 'instagram/lote-4'), [[imagen, 1080, 1350, 'venta-perdida-imagen.png']]);
