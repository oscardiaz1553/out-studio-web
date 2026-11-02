/* Mango ilustrado por capas, listo para animar con código.
 *
 *   const m = MangoRig.crear(contenedor, { src: "mango-sin-boca.png" });
 *   m.boca(abierta 0..1, redonda 0..1)    // forma continua de la boca
 *   m.visema(n)                            // 0 cerrada, 1 rendija, 2 media, 3 abierta, 4 a_tope, 5 o
 *
 * La ilustración base no tiene boca (se borró la sonrisa original); la boca se dibuja encima en
 * SVG con los colores y el grosor de línea de la ilustración, así que se mezcla con el dibujo.
 * Coordenadas en píxeles de la imagen original (1254 × 1254).
 */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const C = { linea: "#2a0703", fondo: "#5c1210", lengua: "#e46a5c", lenguaOsc: "#b9443e", diente: "#fff6ea", dienteSombra: "#e8d2bd", labio: "#d98856" };
  const f = (n) => Math.round(n * 10) / 10;
  const el = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const VISEMAS = [[0, 0], [0.16, 0], [0.42, 0], [0.7, 0], [1, 0], [0.62, 1]];

  /* Profundidad aproximada de la cabeza (0 en el borde, ~1.5 en la nariz y las gafas), en coordenadas 0..1. */
  const LENTES = [[0.395, 0.397], [0.642, 0.397]];
  function profundidad(x, y) {
    const qx = (x - 0.5) / 0.38, qy = (y - 0.5) / 0.49, e = 1 - qx * qx - qy * qy;
    let d = e > 0 ? Math.sqrt(e) : 0;
    const g = (cx, cy, s) => Math.exp(-(((x - cx) / s) ** 2 + ((y - cy) / s) ** 2));
    d += 0.35 * g(0.52, 0.47, 0.07) + 0.22 * g(0.52, 0.54, 0.13);
    for (const [lx, ly] of LENTES) if (Math.hypot(x - lx, y - ly) < 0.092) d += 0.25;
    return d;
  }
  function webgl(cv, img) {
    const gl = cv.getContext("webgl", { premultipliedAlpha: false, preserveDrawingBuffer: true, alpha: true });
    const vs = "attribute vec2 p; varying vec2 v; void main(){ v = vec2(p.x*0.5+0.5, 0.5-p.y*0.5); gl_Position = vec4(p,0.,1.); }";
    const fs = `precision mediump float; varying vec2 v; uniform sampler2D t; uniform vec2 r;
      float g(vec2 c, float s){ vec2 q=(v-c)/s; return exp(-dot(q,q)); }
      float prof(){ vec2 q=(v-vec2(0.5,0.5))/vec2(0.38,0.49); float e=1.0-dot(q,q); float d = e>0.0 ? sqrt(e) : 0.0;
        d += 0.35*g(vec2(0.52,0.47),0.07) + 0.22*g(vec2(0.52,0.54),0.13);
        d += 0.25*(1.0-smoothstep(0.088,0.094,distance(v,vec2(0.395,0.397))));
        d += 0.25*(1.0-smoothstep(0.088,0.094,distance(v,vec2(0.642,0.397))));
        return d; }
      void main(){ vec2 o = r*prof()*0.035; gl_FragColor = texture2D(t, v - o); }`;
    const sh = (tipo, src) => { const x = gl.createShader(tipo); gl.shaderSource(x, src); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture();
    let cargada = false;
    const subir = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      cargada = true;
    };
    const ur = gl.getUniformLocation(pr, "r");
    return (yaw, pitch) => {
      if (!cargada) { if (!img.complete) return; subir(); }
      gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(ur, yaw, pitch); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
  }

  let n = 0;
  function crear(host, opc = {}) {
    const S = 1254, id = "rig-boca-" + n++;
    const caja = document.createElement("div");
    caja.style.cssText = `position:relative;width:${S}px;height:${S}px`;
    host.appendChild(caja);
    const img = new Image();
    img.src = opc.src || "mango-sin-boca.png";
    let giro = null;
    if (opc.webgl) {
      const cv = document.createElement("canvas");
      cv.width = S; cv.height = S;
      cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
      caja.appendChild(cv);
      giro = webgl(cv, img);
    } else {
      img.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
      caja.appendChild(img);
    }
    const svg = el("svg", { viewBox: `0 0 ${S} ${S}`, width: S, height: S, style: "position:absolute;inset:0;overflow:visible" });
    caja.appendChild(svg);
    const defs = el("defs", {}, svg);
    const clip = el("clipPath", { id }, defs);
    const pClip = el("path", {}, clip);
    const g0 = el("g", {}, svg);          // se mueve con el giro (paralaje de la boca)
    const g = el("g", {}, g0);
    const fondo = el("path", { fill: C.fondo }, g);
    const dentro = el("g", { "clip-path": `url(#${id})` }, g);
    const lengua = el("ellipse", { fill: C.lengua }, dentro);
    const lenguaRaya = el("path", { fill: "none", stroke: C.lenguaOsc, "stroke-width": 4, "stroke-linecap": "round" }, dentro);
    const dientes = el("path", { fill: C.diente }, dentro);
    const dientesLinea = el("path", { fill: "none", stroke: C.dienteSombra, "stroke-width": 3 }, dentro);
    const contorno = el("path", { fill: "none", stroke: C.linea, "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    const comisuras = el("path", { fill: "none", stroke: C.linea, "stroke-width": 6, "stroke-linecap": "round" }, g);
    const menton = el("path", { fill: "none", stroke: "#c56a3c", "stroke-width": 5, "stroke-linecap": "round", opacity: 0.6 }, g);

    function boca(ab, re) {
      ab = Math.max(0, Math.min(1, ab)); re = Math.max(0, Math.min(1, re));
      const cx = 652;
      const hw = 172 * (1 - 0.66 * re) - 10 * ab * (1 - re);           // semiancho
      const yc = 653 + 34 * re + 8 * ab;                                 // altura de las comisuras
      const curva = (1 - re) * (102 - 46 * ab);                          // cuánto baja el centro del labio de arriba (sonrisa)
      const up = yc + curva - 70 * ab * re;                              // control del labio de arriba
      const hondo = 14 + 128 * ab * (1 - 0.25 * re);                      // abertura
      const L = [cx - hw, yc], R = [cx + hw, yc];
      const yLo = yc + curva * 0.5 + hondo;                              // punto más bajo
      const kLo = yLo + (yLo - yc) * 0.33;
      const arriba = `M${f(L[0])},${f(L[1])} Q${cx},${f(up)} ${f(R[0])},${f(R[1])}`;
      const ins = hw * (0.22 * (1 - re));
      const abajo = `C${f(R[0] - ins)},${f(kLo)} ${f(L[0] + ins)},${f(kLo)} ${f(L[0])},${f(L[1])}`;
      const d = arriba + " " + abajo + " Z";
      const cerrada = ab < 0.04;
      pClip.setAttribute("d", d);
      fondo.setAttribute("d", cerrada ? "" : d);
      // dientes de arriba: franja que sigue el labio superior
      const td = 18 + 20 * Math.min(1, ab * 2.5);
      const upT = up + td, yT = yc + td * 0.55;
      dientes.setAttribute("d", cerrada || re > 0.5 ? "" : `${arriba} L${f(R[0])},${f(yT)} Q${cx},${f(upT)} ${f(L[0])},${f(yT)} Z`);
      dientesLinea.setAttribute("d", cerrada || re > 0.5 ? "" : `M${f(L[0] + 20)},${f(yT - 2)} Q${cx},${f(upT - 2)} ${f(R[0] - 20)},${f(yT - 2)}`);
      // lengua
      lengua.setAttribute("cx", cx); lengua.setAttribute("cy", f(yLo - hondo * 0.12)); lengua.setAttribute("rx", f(hw * 0.5)); lengua.setAttribute("ry", f(Math.max(6, hondo * 0.36)));
      lengua.setAttribute("opacity", ab > 0.2 ? 1 : 0);
      lenguaRaya.setAttribute("d", ab > 0.35 ? `M${cx},${f(yLo - hondo * 0.4)} L${cx},${f(yLo - hondo * 0.12)}` : "");
      contorno.setAttribute("d", cerrada ? arriba : d);
      contorno.setAttribute("stroke-width", cerrada ? 8 : 7);
      // comisuras: pequeño pliegue en los extremos, como en la ilustración
      const k = (1 - re) * (1 - 0.6 * ab);
      comisuras.setAttribute("d", k < 0.15 ? "" : `M${f(L[0] - 4)},${f(L[1] + 12 * k)} q${f(-10 * k)},${f(-10 * k)} ${f(-6 * k)},${f(-24 * k)} M${f(R[0] + 4)},${f(R[1] + 12 * k)} q${f(10 * k)},${f(-10 * k)} ${f(6 * k)},${f(-24 * k)}`);
      // pliegue suave del mentón bajo la boca
      const ym = Math.max(yLo, up) + 26;
      menton.setAttribute("d", `M${f(cx - hw * 0.45)},${f(ym)} Q${cx},${f(ym + 14)} ${f(cx + hw * 0.45)},${f(ym)}`);
    }
    boca(0, 0);
    // bocas dibujadas (hoja de bocas encajada en la cara): una imagen por boca, se muestra una sola
    const imgs = {};
    if (opc.bocas) {
      g.style.display = "none";
      for (const [nombre, pos] of Object.entries(opc.bocas.indice)) {
        imgs[nombre] = el("image", { href: `${opc.bocas.carpeta}/boca-${nombre}.png`, x: pos.x, y: pos.y, width: 406, height: 190, visibility: "hidden" }, g0);
      }
    }
    let actual = null;
    function bocaImg(nombre) {
      if (actual === nombre || !imgs[nombre]) return;
      if (actual) imgs[actual].setAttribute("visibility", "hidden");
      imgs[nombre].setAttribute("visibility", "visible");
      actual = nombre;
    }
    // brillo que cruza los lentes
    const lentes = [[495, 498], [805, 498]];
    const gl0 = el("g", {}, svg);
    const brillos = lentes.map(([x, y], i) => {
      const cid = id + "-l" + i;
      el("clipPath", { id: cid }, defs).appendChild(el("circle", { cx: x, cy: y, r: 112 }));
      const gg = el("g", { "clip-path": `url(#${cid})` }, gl0);
      return el("rect", { x: x - 260, y: y - 200, width: 46, height: 400, fill: "#fff", opacity: 0.55, transform: `rotate(28 ${x} ${y})` }, gg);
    });
    function brillo(p) {          // p: 0..1 recorrido del destello
      brillos.forEach((r, i) => r.setAttribute("x", f(lentes[i][0] - 260 + p * 520)));
    }
    brillo(1);
    function girar(yaw, pitch) {
      if (giro) giro(yaw, pitch);
      const k = 0.035 * S;
      const dm = profundidad(0.52, 0.55), dl = profundidad(0.52, 0.4);
      g0.setAttribute("transform", `translate(${f(yaw * dm * k)} ${f(pitch * dm * k)})`);
      gl0.setAttribute("transform", `translate(${f(yaw * dl * k)} ${f(pitch * dl * k)})`);
    }
    const listo = new Promise((r) => (img.complete ? r() : (img.onload = r)));
    return { caja, img, svg, boca, bocaImg, visema: (n) => boca(...VISEMAS[n]), girar, brillo, listo };
  }
  window.MangoRig = { crear, VISEMAS, profundidad };
})();
