/* Mango en 2D, dibujado con código (SVG) y armado por piezas para animarlo.
 *
 *   const m = MangoSVG.crear(contenedor, { ancho: 600 });
 *   m.boca(abierta 0..1, redonda 0..1);   // vocales: a (0.9, 0), e (0.45, 0), i (0.15, 0), o (0.6, 1), u (0.3, 1)
 *   m.mirar(x, y);                         // -1..1: gira un poco la cabeza y mueve la cara
 *   m.gafas(0..1);                         // sube las gafas (cejas arriba) para gestos
 *
 * Todo el pelo se genera con una semilla fija, así que el dibujo es siempre el mismo.
 */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const C = {
    tinta: "#2b0d06", n1: "#e8470f", n2: "#ff6a1f", n3: "#ff9442", n0: "#b9300a",
    piel: "#8d4a2c", pielClara: "#b97048", pielOsc: "#5e2c18", oro: "#ffc24a", oroOsc: "#c98a14",
    diente: "#fff3df", lengua: "#e8626e", boca: "#4a0d14",
  };
  let sem = 1;
  const rnd = () => { sem = (sem * 16807) % 2147483647; return sem / 2147483647; };
  const f = (n) => Math.round(n * 10) / 10;

  /* Contorno peludo: puntas de llama alrededor de una elipse (de a0 a a1, en grados; 0 = derecha, 90 = abajo). */
  function puntas(cx, cy, rx, ry, n, amp, a0, a1, sesgo, ryb) {
    ryb = ryb || ry;
    const P = (a) => [cx + Math.cos(a) * rx, cy + Math.sin(a) * (Math.sin(a) > 0 ? ryb : ry)];
    const ang = (i) => ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    let d = `M${f(P(ang(0))[0])},${f(P(ang(0))[1])}`;
    for (let i = 0; i < n; i++) {
      const A0 = ang(i), A1 = ang(i + 1), Am = (A0 + A1) / 2;
      const p0 = P(A0), p1 = P(A1), pm = P(Am);
      const nx = pm[0] - cx, ny = pm[1] - cy, nl = Math.hypot(nx, ny) || 1;
      const l = amp * (0.5 + rnd() * 0.9);
      const tx = pm[0] + (nx / nl) * l + (-ny / nl) * sesgo * l, ty = pm[1] + (ny / nl) * l + (nx / nl) * sesgo * l;
      d += ` Q${f((p0[0] + tx) / 2)},${f((p0[1] + ty) / 2)} ${f(tx)},${f(ty)} Q${f((p1[0] + tx) / 2)},${f((p1[1] + ty) / 2)} ${f(p1[0])},${f(p1[1])}`;
    }
    return d;
  }

  function el(tipo, attrs, padre) {
    const e = document.createElementNS(NS, tipo);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(e);
    return e;
  }

  function crear(host, opc = {}) {
    sem = 7;
    const W = 600, H = 780;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: opc.ancho || W, style: "overflow:visible;display:block" });
    host.appendChild(svg);
    const defs = el("defs", {}, svg);
    const grad = (id, tipo, attrs, stops) => {
      const g = el(tipo, { id, ...attrs }, defs);
      stops.forEach(([o, c, op]) => el("stop", { offset: o, "stop-color": c, ...(op != null ? { "stop-opacity": op } : {}) }, g));
    };
    grad("g-pelo", "radialGradient", { cx: "50%", cy: "30%", r: "75%" }, [[0, C.n3], [0.45, C.n2], [1, C.n1]]);
    grad("g-barba", "linearGradient", { x1: 0, y1: 0, x2: 0, y2: 1 }, [[0, C.n2], [1, C.n0]]);
    grad("g-cara", "radialGradient", { cx: "50%", cy: "55%", r: "60%" }, [[0, C.pielClara], [1, C.piel]]);
    grad("g-lente", "linearGradient", { x1: 0, y1: 0, x2: 0, y2: 1 },
      [[0, "#0b1c6e"], [0.36, "#1f56e6"], [0.54, "#ff9a2e"], [0.6, "#ff6a1f"], [0.62, "#10206e"], [1, "#07104a"]]);

    const raiz = el("g", {}, svg);                       // todo el personaje
    const cuerpo = el("g", { id: "m-cuerpo" }, raiz);
    const cabeza = el("g", { id: "m-cabeza" }, raiz);
    const tinta = { stroke: C.tinta, "stroke-width": 5, "stroke-linejoin": "round" };

    /* ── torso (busto): hombros peludos detrás de la barba ── */
    sem = 21;
    el("path", { d: puntas(300, 735, 262, 120, 44, 6, 180, 360, 0.3, 120).replace(/^M[^Q]*/, "M38,735 ") + " Z", fill: "url(#g-barba)", ...tinta }, cuerpo);

    /* ── cabeza ── */
    const CX = 300, CY = 330, RX = 214, RY = 250, RYB = 360;
    sem = 11;
    const silueta = puntas(CX, CY, RX, RY, 30, 13, 0, 360, 0.5, RYB) + " Z";
    const sId = "m-silueta";
    el("clipPath", { id: sId }, defs).appendChild(el("path", { d: silueta }));
    // orejas (detrás del pelo)
    for (const s of [-1, 1]) {
      el("ellipse", { cx: CX + s * 200, cy: 392, rx: 38, ry: 50, fill: C.pielClara, ...tinta }, cabeza);
      el("ellipse", { cx: CX + s * 202, cy: 394, rx: 22, ry: 31, fill: C.piel }, cabeza);
    }
    el("path", { d: silueta, fill: "url(#g-pelo)", ...tinta, "stroke-width": 6 }, cabeza);

    // mechones de pelo: líneas curvas que salen de la raya (arriba, un poco a la derecha)
    const mech = el("g", { "clip-path": `url(#${sId})`, fill: "none", "stroke-linecap": "round" }, cabeza);
    sem = 33;
    const raya = [328, 120];
    for (let i = 0; i < 150; i++) {
      const x = CX + (rnd() * 2 - 1) * RX * 0.95, y = CY + (rnd() * 2 - 1) * (rnd() > 0.5 ? RYB : RY) * 0.95;
      if (((x - CX) / RX) ** 2 + ((y - CY) / (y > CY ? RYB : RY)) ** 2 > 0.92) continue;
      let dx = x - raya[0], dy = y - raya[1] + 70;
      const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
      const len = 40 + rnd() * 70, cur = (rnd() - 0.5) * 28;
      const ex = x + dx * len, ey = y + dy * len;
      const claro = rnd() > 0.45;
      el("path", { d: `M${f(x)},${f(y)} Q${f((x + ex) / 2 - dy * cur)},${f((y + ey) / 2 + dx * cur)} ${f(ex)},${f(ey)}`,
        stroke: claro ? C.n3 : C.n0, "stroke-width": f(3 + rnd() * 5), opacity: claro ? 0.6 : 0.4 }, mech);
    }

    /* ── cara (con óvalo de piel) ── */
    const cara = el("g", { id: "m-cara" }, cabeza);
    el("ellipse", { cx: 300, cy: 372, rx: 152, ry: 134, fill: "url(#g-cara)", ...tinta, "stroke-width": 4 }, cara);
    el("ellipse", { cx: 300, cy: 452, rx: 112, ry: 74, fill: C.pielClara, opacity: 0.5 }, cara);   // hocico
    el("path", { d: "M262,408 Q300,380 338,408 Q344,436 300,440 Q256,436 262,408 Z", fill: C.piel, stroke: C.pielOsc, "stroke-width": 3 }, cara);
    el("ellipse", { cx: 284, cy: 420, rx: 8, ry: 6, fill: C.tinta, transform: "rotate(-16 284 420)" }, cara);
    el("ellipse", { cx: 316, cy: 420, rx: 8, ry: 6, fill: C.tinta, transform: "rotate(16 316 420)" }, cara);

    /* ── boca (curva continua: se abre y se redondea) ── */
    const boca = el("g", { id: "m-boca", transform: "translate(300 480)" }, cara);
    const clipB = el("clipPath", { id: "m-clip-boca" }, defs);
    const pClip = el("path", {}, clipB);
    const fondo = el("path", { fill: C.boca }, boca);
    const dentro = el("g", { "clip-path": "url(#m-clip-boca)" }, boca);
    const dientes = el("rect", { fill: C.diente }, dentro);
    const lengua = el("ellipse", { fill: C.lengua }, dentro);
    const dientesB = el("rect", { fill: C.diente }, dentro);
    const labio = el("path", { fill: "none", stroke: C.pielOsc, "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" }, boca);
    function bocaForma(ab, re) {
      ab = Math.max(0, Math.min(1, ab)); re = Math.max(0, Math.min(1, re));
      const w = 100 * (1 - 0.62 * re) + 8 * ab;           // semiancho
      const sonrisa = (1 - re) * 22;                     // las comisuras suben al sonreír
      const alto = 10 + 84 * ab * (1 - 0.15 * re);        // abertura
      const L = [-w, -sonrisa * 0.75], R = [w, -sonrisa * 0.75];
      const yUp = 12 - 6 * re + sonrisa * 0.35;
      const yLo = yUp + alto;
      const d = `M${f(L[0])},${f(L[1])} Q0,${f(yUp * 2 - 6)} ${f(R[0])},${f(R[1])} C${f(w * 0.98)},${f(yLo * 1.34)} ${f(-w * 0.98)},${f(yLo * 1.34)} ${f(L[0])},${f(L[1])} Z`;
      pClip.setAttribute("d", d); fondo.setAttribute("d", d);
      const arriba = yUp - 3;
      dientes.setAttribute("x", -w); dientes.setAttribute("y", -30); dientes.setAttribute("width", w * 2); dientes.setAttribute("height", 30 + arriba + 12 * Math.min(1, ab * 3));
      dientes.setAttribute("rx", 6);
      dientesB.setAttribute("x", -w * 0.8); dientesB.setAttribute("y", yLo - 4 - 12 * ab); dientesB.setAttribute("width", w * 1.6); dientesB.setAttribute("height", 30); dientesB.setAttribute("rx", 6);
      dientesB.setAttribute("opacity", ab > 0.45 && !re ? 1 : 0);
      lengua.setAttribute("cx", 0); lengua.setAttribute("cy", yLo - 2); lengua.setAttribute("rx", w * 0.62); lengua.setAttribute("ry", Math.max(4, alto * 0.45));
      lengua.setAttribute("opacity", ab > 0.12 ? 1 : 0);
      // labios: línea superior de la boca (si está casi cerrada se ve como sonrisa)
      labio.setAttribute("d", `M${f(L[0])},${f(L[1])} Q0,${f(yUp * 2 - 6)} ${f(R[0])},${f(R[1])}` + (ab < 0.08 ? "" : `C${f(w * 0.98)},${f(yLo * 1.34)} ${f(-w * 0.98)},${f(yLo * 1.34)} ${f(L[0])},${f(L[1])}`));
    }
    bocaForma(0.18, 0);

    /* ── gafas con reflejo de atardecer ── */
    const gafas = el("g", { id: "m-gafas" }, cara);
    const lentes = [[212, 332], [388, 332]];
    lentes.forEach(([x, y], i) => {
      const cid = "m-lente-" + i;
      el("clipPath", { id: cid }, defs).appendChild(el("circle", { cx: x, cy: y, r: 76 }));
      const g = el("g", { "clip-path": `url(#${cid})` }, gafas);
      el("rect", { x: x - 80, y: y - 80, width: 160, height: 160, fill: "url(#g-lente)" }, g);
      el("ellipse", { cx: x + (i ? -8 : 10), cy: y + 12, rx: 50, ry: 12, fill: "#ffd38a", opacity: 0.8 }, g);   // sol en el horizonte
      // palmera
      const px = x + (i ? 26 : -26);
      el("path", { d: `M${px},${y + 28} Q${px + 5},${y - 10} ${px - 2},${y - 38}`, stroke: "#0a1450", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, g);
      [[-30, -8], [-26, -26], [-6, -34], [20, -26], [30, -6], [14, -14], [-16, -18]].forEach(([dx, dy]) => {
        el("path", { d: `M${px - 2},${y - 38} Q${px - 2 + dx * 0.7},${y - 38 + dy - 16} ${px - 2 + dx * 1.2},${y - 38 + dy + 14}`, stroke: "#0a1450", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, g);
      });
      el("path", { d: `M${x - 62},${y - 26} Q${x - 38},${y - 62} ${x + 8},${y - 64}`, stroke: "#fff", "stroke-width": 6, fill: "none", opacity: 0.55, "stroke-linecap": "round" }, g);   // brillo
      el("circle", { cx: x, cy: y, r: 76, fill: "none", stroke: C.oro, "stroke-width": 8 }, gafas);
      el("circle", { cx: x, cy: y, r: 80, fill: "none", stroke: C.oroOsc, "stroke-width": 2, opacity: 0.8 }, gafas);
    });
    el("path", { d: "M288,322 Q300,304 312,322", stroke: C.oro, "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, gafas);
    el("path", { d: "M136,330 L110,352", stroke: C.oro, "stroke-width": 5, "stroke-linecap": "round" }, gafas);
    el("path", { d: "M464,330 L490,352", stroke: C.oro, "stroke-width": 5, "stroke-linecap": "round" }, gafas);

    /* ── flequillo: cresta barrida de izquierda a derecha por encima de las gafas ── */
    sem = 44;
    const cresta = el("g", { id: "m-cresta" }, cabeza);
    el("path", { d: "M92,300 C80,176 196,78 318,76 C436,74 520,170 512,306 C482,238 430,204 366,220 C306,236 252,212 196,232 C146,248 118,272 92,300 Z", fill: "url(#g-pelo)" }, cresta);
    el("path", { d: "M92,300 C80,176 196,78 318,76 C436,74 520,170 512,306", fill: "none", ...tinta, "stroke-width": 6 }, cresta);
    // flequillo: mechones en punta a lo largo del borde de abajo
    sem = 47;
    const borde = [[100, 292], [150, 250], [200, 232], [250, 222], [300, 232], [350, 224], [400, 214], [450, 236], [494, 276], [508, 300]];
    for (let i = 0; i < borde.length - 1; i++) {
      const [x0, y0] = borde[i], [x1, y1] = borde[i + 1], l = 30 + rnd() * 26;
      el("path", { d: `M${x0 - 8},${y0 - 14} Q${x0 + 4},${y0 + l * 0.5} ${(x0 + x1) / 2 + 6},${(y0 + y1) / 2 + l} Q${x1 - 6},${y1 + l * 0.3} ${x1 + 8},${y1 - 14} Z`, fill: i % 2 ? C.n2 : C.n3, ...tinta, "stroke-width": 3.5 }, cresta);
    }
    sem = 45;
    const cs = el("g", { "clip-path": `url(#${sId})` }, cresta);
    for (let i = 0; i < 26; i++) {
      const t = i / 25, x = 110 + t * 390, y0 = 236 - Math.sin(t * Math.PI) * 6;
      const a2 = -20 - t * 40;
      const len = 70 + rnd() * 60;
      el("path", { d: `M${f(x)},${f(y0)} q${f(len * 0.2)},${f(-len * 0.55)} ${f(len * 0.5 * Math.cos(((a2 - 20) * Math.PI) / 180) + 6)},${f(-len)}`, stroke: rnd() > 0.5 ? C.n3 : C.n0, "stroke-width": f(3 + rnd() * 5), fill: "none", opacity: 0.55, "stroke-linecap": "round" }, cs);
    }
    // mechón que cae sobre la frente, como en el original
    el("path", { d: "M300,100 C262,96 224,140 236,196 C262,160 296,156 334,164 C350,134 338,106 300,100 Z", fill: C.n3, ...tinta, "stroke-width": 4 }, cresta);

    /* ── barba: mechones largos que caen sobre el pelo de abajo ── */
    sem = 55;
    const barba = el("g", { id: "m-barba", "clip-path": `url(#${sId})`, fill: "none", "stroke-linecap": "round" }, cabeza);
    for (let i = 0; i < 70; i++) {
      const t = i / 69, x = 120 + t * 360 + (rnd() - 0.5) * 10;
      const y = 470 + rnd() * 40, cx2 = 300 + (x - 300) * 0.5;
      const ey = Math.min(690, y + 90 + (1 - Math.abs(t - 0.5) * 1.6) * 130 + rnd() * 40);
      el("path", { d: `M${f(x)},${f(y)} Q${f(x + (rnd() - 0.5) * 16)},${f((y + ey) / 2)} ${f(x + (cx2 - x) * 0.35)},${f(ey)}`, stroke: rnd() > 0.45 ? C.n3 : C.n0, "stroke-width": f(4 + rnd() * 6), opacity: 0.6 }, barba);
    }
    // la boca queda sobre la barba: se vuelve a pintar el óvalo de piel de la boca por encima
    cabeza.appendChild(cara);
    cabeza.appendChild(cresta);

    const api = {
      svg, cabeza, cuerpo, raiz,
      boca: bocaForma,
      mirar(x, y) {
        cara.setAttribute("transform", `translate(${f(x * 16)} ${f(y * 8)})`);
        cresta.setAttribute("transform", `translate(${f(x * 6)} ${f(y * 3)})`);
        barba.setAttribute("transform", `translate(${f(x * 8)} ${f(y * 2)})`);
      },
      gafas(v) { gafas.setAttribute("transform", `translate(0 ${f(-v * 12)})`); },
    };
    return api;
  }
  window.MangoSVG = { crear, C };
})();
