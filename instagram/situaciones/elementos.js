/* Elementos en código para las escenas de situaciones (se dibujan en canvas y no dependen de imágenes).
 *
 *   Cielo.dibujar(ctx, w, h, hora, clima)   hora: 0 a 24 (puede pasar de 24: da vueltas); clima: {lluvia 0..1, nieve 0..1, nubes 0..1}
 *   Reloj.dibujar(ctx, r, hora)             manecillas de un reloj redondo de radio r, centrado en (0,0)
 *   Pantalla.dibujar(ctx, w, h, estado)     celular: {fase: "producto"|"cargando"|"agotado", t: segundos, progreso: 0..1}
 * Todo es determinista: el mismo tiempo da siempre el mismo dibujo (el render cuadro a cuadro lo necesita).
 */
(function () {
  const mezcla = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const css = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
  const hash = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const suave = (t) => t * t * (3 - 2 * t);

  /* ── Cielo: paleta por hora (cielo arriba, cielo abajo) ── */
  const PAL = [
    [0, [10, 16, 52], [26, 38, 94]], [5, [16, 24, 70], [92, 70, 120]], [6.5, [70, 110, 200], [255, 170, 110]],
    [9, [60, 130, 235], [150, 200, 250]], [13, [48, 120, 235], [140, 200, 255]], [17, [70, 120, 220], [250, 190, 120]],
    [18.5, [90, 80, 160], [255, 120, 70]], [20, [26, 34, 100], [120, 60, 100]], [24, [10, 16, 52], [26, 38, 94]],
  ];
  function colorCielo(hora) {
    const h = ((hora % 24) + 24) % 24;
    for (let i = 0; i < PAL.length - 1; i++) {
      const [h0, a0, b0] = PAL[i], [h1, a1, b1] = PAL[i + 1];
      if (h >= h0 && h <= h1) { const t = suave((h - h0) / (h1 - h0)); return [mezcla(a0, a1, t), mezcla(b0, b1, t)]; }
    }
    return [PAL[0][1], PAL[0][2]];
  }
  const Cielo = {
    dibujar(ctx, w, h, hora, clima = {}) {
      const { lluvia = 0, nieve = 0, nubes = 0.25 } = clima;
      const [arriba, abajo] = colorCielo(hora);
      const gris = Math.max(lluvia, nieve * 0.8, nubes * 0.35);                       // el mal tiempo apaga el color
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, css(mezcla(arriba, [90, 96, 120], gris * 0.6))); g.addColorStop(1, css(mezcla(abajo, [130, 136, 156], gris * 0.6)));
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const hh = ((hora % 24) + 24) % 24;
      // estrellas (de noche)
      const noche = hh < 5.5 || hh > 19.5 ? 1 : hh < 7 ? (7 - hh) / 1.5 * 0 + Math.max(0, (6.5 - hh) / 1.5) : hh > 18.5 ? Math.min(1, (hh - 18.5) / 1.2) : 0;
      if (noche > 0) for (let i = 0; i < 40; i++) { ctx.globalAlpha = noche * (0.35 + 0.65 * Math.abs(Math.sin(hora * 0.9 + i))) * (1 - gris * 0.8); ctx.fillStyle = "#fff"; ctx.fillRect(hash(i, 1) * w, hash(i, 2) * h * 0.7, 2 + hash(i, 3) * 2, 2 + hash(i, 3) * 2); }
      ctx.globalAlpha = 1;
      // sol: sale a las 6, se oculta a las 18; luna: al revés
      const arco = (ini, fin) => { const t = (hh - ini + 24) % 24 / ((fin - ini + 24) % 24); return t >= 0 && t <= 1 ? { x: w * (0.1 + 0.8 * t), y: h * (0.9 - 0.7 * Math.sin(Math.PI * t)) } : null; };
      const sol = arco(6, 18), luna = arco(18, 6);
      if (sol) { const r = Math.min(w, h) * 0.1; ctx.globalAlpha = 1 - gris * 0.8; const gl = ctx.createRadialGradient(sol.x, sol.y, r * 0.3, sol.x, sol.y, r * 3); gl.addColorStop(0, "rgba(255,230,150,.9)"); gl.addColorStop(1, "rgba(255,200,100,0)"); ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h); ctx.fillStyle = "#ffe9a0"; ctx.beginPath(); ctx.arc(sol.x, sol.y, r, 0, 6.29); ctx.fill(); ctx.globalAlpha = 1; }
      if (luna) { const r = Math.min(w, h) * 0.08; ctx.globalAlpha = 1 - gris * 0.8; ctx.fillStyle = "#f3efe0"; ctx.beginPath(); ctx.arc(luna.x, luna.y, r, 0, 6.29); ctx.fill(); ctx.fillStyle = css(colorCielo(hora)[0]); ctx.beginPath(); ctx.arc(luna.x + r * 0.45, luna.y - r * 0.1, r * 0.85, 0, 6.29); ctx.fill(); ctx.globalAlpha = 1; }
      // nubes que van pasando
      const n = Math.round(3 + nubes * 7);
      for (let i = 0; i < n; i++) {
        const x = ((hash(i, 4) * (w + 240) + hora * 14 * (0.5 + hash(i, 5))) % (w + 240)) - 120, y = h * (0.08 + 0.5 * hash(i, 6)), s = 40 + 40 * hash(i, 7);
        ctx.globalAlpha = (0.55 + 0.3 * gris) * (noche > 0.5 ? 0.45 : 1); ctx.fillStyle = gris > 0.4 ? "#9aa0b4" : "#fbf8f5";
        ctx.beginPath(); ctx.arc(x, y, s * 0.5, 0, 6.29); ctx.arc(x + s * 0.5, y + 4, s * 0.4, 0, 6.29); ctx.arc(x - s * 0.5, y + 6, s * 0.35, 0, 6.29); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // lluvia
      if (lluvia > 0) { ctx.strokeStyle = "rgba(210,225,255,.7)"; ctx.lineWidth = 2; ctx.beginPath(); const k = Math.round(90 * lluvia); for (let i = 0; i < k; i++) { const x = hash(i, 8) * (w + 80), y = ((hash(i, 9) * h * 1.4 + hora * 260 * (1 + hash(i, 10))) % (h + 40)) - 20; ctx.moveTo(x, y); ctx.lineTo(x - 7, y + 22); } ctx.stroke(); }
      // nieve (cae despacio y se mece)
      if (nieve > 0) { ctx.fillStyle = "#fff"; const k = Math.round(70 * nieve); for (let i = 0; i < k; i++) { const x = hash(i, 11) * w + Math.sin(hora * 2 + i) * 14, y = ((hash(i, 12) * h * 1.2 + hora * 70 * (0.6 + hash(i, 13))) % (h + 20)) - 10; ctx.beginPath(); ctx.arc(x, y, 2 + hash(i, 14) * 3, 0, 6.29); ctx.fill(); } }
    },
  };

  const Reloj = {
    dibujar(ctx, r, hora) {
      const h = ((hora % 12) / 12) * 6.2832, m = ((hora * 12) % 12 / 12) * 6.2832;   // la aguja larga da 12 vueltas por cada vuelta de la corta
      ctx.lineCap = "round"; ctx.strokeStyle = "#2b0d06";
      ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(h) * r * 0.5, -Math.cos(h) * r * 0.5); ctx.stroke();
      ctx.lineWidth = r * 0.065; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(m) * r * 0.78, -Math.cos(m) * r * 0.78); ctx.stroke();
      ctx.fillStyle = "#2b0d06"; ctx.beginPath(); ctx.arc(0, 0, r * 0.08, 0, 6.29); ctx.fill();
    },
  };

  const Pantalla = {
    dibujar(ctx, w, h, { fase = "producto", t = 0, progreso = 0 } = {}) {
      ctx.fillStyle = "#fbf8f5"; ctx.fillRect(0, 0, w, h);
      const px = (n) => (n * w) / 400;
      if (fase === "producto") {
        ctx.fillStyle = "#f5e3b3"; ctx.fillRect(px(24), px(60), w - px(48), px(260));
        ctx.fillStyle = "#bc6039"; ctx.beginPath(); ctx.moveTo(px(90), px(250)); ctx.quadraticCurveTo(px(150), px(160), px(230), px(200)); ctx.quadraticCurveTo(px(300), px(215), px(310), px(250)); ctx.lineTo(px(90), px(250)); ctx.fill();
        ctx.fillStyle = "#141e5c"; ctx.fillRect(px(90), px(250), px(220), px(14));
        ctx.fillStyle = "#141e5c"; ctx.font = `500 ${px(30)}px Instrument Sans, sans-serif`; ctx.fillText("Tenis urbanos", px(28), px(370));
        ctx.fillStyle = "#1b2fcc"; ctx.font = `800 ${px(62)}px Bricolage Grotesque, sans-serif`; ctx.fillText("$180.000", px(28), px(440));
        ctx.fillStyle = "#1b2fcc"; ctx.beginPath(); ctx.roundRect(px(24), px(480), w - px(48), px(96), px(48)); ctx.fill();
        ctx.fillStyle = "#fbf8f5"; ctx.font = `800 ${px(42)}px Bricolage Grotesque, sans-serif`; ctx.textAlign = "center"; ctx.fillText("Comprar", w / 2, px(542)); ctx.textAlign = "left";
      } else if (fase === "cargando") {
        const cx = w / 2, cy = h * 0.4, r = px(70);
        ctx.lineWidth = px(18); ctx.strokeStyle = "#e6dfd8"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.29); ctx.stroke();
        ctx.strokeStyle = "#1b2fcc"; ctx.lineCap = "round"; ctx.beginPath(); const a = t * 6; ctx.arc(cx, cy, r, a, a + 1.6); ctx.stroke();
        ctx.fillStyle = "#e6dfd8"; ctx.beginPath(); ctx.roundRect(px(44), h * 0.62, w - px(88), px(24), px(12)); ctx.fill();
        ctx.fillStyle = "#bc6039"; ctx.beginPath(); ctx.roundRect(px(44), h * 0.62, Math.max(px(24), (w - px(88)) * progreso), px(24), px(12)); ctx.fill();
        ctx.fillStyle = "#585d88"; ctx.font = `500 ${px(30)}px Instrument Sans, sans-serif`; ctx.textAlign = "center"; ctx.fillText("Cargando…", cx, h * 0.62 + px(70)); ctx.textAlign = "left";
      } else {
        ctx.fillStyle = "#141e5c"; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#bc6039"; ctx.font = `800 ${px(92)}px Bricolage Grotesque, sans-serif`; ctx.textAlign = "center"; ctx.fillText("Agotado", w / 2, h * 0.47);
        ctx.fillStyle = "#f5e3b3"; ctx.font = `500 ${px(30)}px Instrument Sans, sans-serif`; ctx.fillText("Tenis urbanos", w / 2, h * 0.47 + px(64)); ctx.textAlign = "left";
      }
    },
  };
  window.Cielo = Cielo; window.Reloj = Reloj; window.Pantalla = Pantalla;
})();
