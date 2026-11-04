// Cloudflare Worker: envía por correo (con Resend) la cotización en PDF que
// genera cotizar.html. No usa dependencias: se pega tal cual en el editor del
// Worker (Cloudflare dashboard → Workers & Pages → tu Worker → Edit code).
//
// Variables (Settings → Variables and Secrets):
//   RESEND_API_KEY   (Secret)  API key de Resend.
//   SEND_PASSPHRASE  (Secret)  Clave que escribes en el generador para poder enviar.
//   FROM             (Text, opcional)  Remitente. Por defecto: Out Studio <cotizaciones@outstudio.online>
//   BCC              (Text, opcional)  Copia oculta. Por defecto: oscar.diaz@outstudio.online
//   REPLY_TO         (Text, opcional)  A dónde llegan las respuestas. Por defecto: oscar.diaz@outstudio.online
//   FORM_TO          (Text, opcional)  Quién recibe los cuestionarios públicos (Habla Deportes). Por defecto: REPLY_TO.
//   RATE_KV          (KV binding, opcional)  Para limitar envíos por IP entre servidores. Sin él se limita en memoria (menos estricto).
//
// Rutas: la cotización en PDF (con SEND_PASSPHRASE) y el cuestionario público de
// Habla Deportes (`form: 'habla-deportes'`, sin clave, con señuelo y límite por IP).

const ALLOWED_ORIGINS = [
  'https://outstudio.online',
  'https://www.outstudio.online',
  'http://localhost:5173',
  'http://localhost:4173',
];
const MAX_PDF_BASE64_CHARS = 14_000_000; // ~10 MB de PDF
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (data, status, headers) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Comparación en tiempo constante para no filtrar la clave por tiempos de respuesta.
function safeEqual(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(String(a));
  const y = enc.encode(String(b));
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  }
  return diff === 0;
}

// ───────────────────────── Cuestionario de Habla Deportes ─────────────────────────
// Los títulos y topes repiten los de src/data/habla-deportes.ts (el Worker es un
// solo archivo que se pega en Cloudflare, no importa nada del sitio).
const HD_VERSION = 2; // debe ser igual a HD_VERSION de src/data/habla-deportes.ts
const HD_QUESTIONS = [
  { n: 1, priority: true, kind: 'multi', max: 2, text: '¿Qué quieres que haga la gente al entrar a la web?' },
  { n: 2, priority: true, kind: 'orden', max: 3, text: '¿Qué es lo más importante para ti? (en orden)' },
  { n: 3, kind: 'texto', text: 'Aparte de Junior, ¿de qué otros equipos van a publicar noticias?' },
  { n: 4, kind: 'uno', text: '¿Quieren resultados y tabla de posiciones en la web?', extra: '¿Tienen proveedor de datos, como Data Factory?' },
  { n: 5, kind: 'multi', text: '¿Qué redes usan más?' },
  { n: 6, kind: 'uno', text: '¿Juan Salvador debe tener su propio espacio en la web, con sus videos y sus publicaciones de X?' },
  { n: 7, kind: 'uno', text: '¿Quieren que la transmisión del programa en YouTube se vea dentro de la web?', extra: 'Enlace de su canal o de la transmisión en YouTube' },
  { n: 8, priority: true, kind: 'texto', text: '¿Quiénes son sus patrocinadores hoy? (un nombre por línea)' },
  { n: 9, kind: 'multi', text: '¿Dónde quieren que se vean?' },
  { n: 10, kind: 'uno', text: '¿Quién va a cambiar las imágenes o GIFs de los patrocinadores dentro de la web?', extra: '¿Cada cuánto cambian las imágenes o GIFs?' },
  { n: 11, kind: 'uno', text: '¿Venden publicidad en la web, o solo patrocinios fijos?', extra: '¿Algún tipo de patrocinador que NO quieran mostrar?' },
  { n: 12, priority: true, kind: 'texto', text: 'Nombra 3 sitios de deportes que te gusten y 1 que no. ¿Qué te gusta de cada uno?' },
  { n: 13, kind: 'multi', max: 2, text: '¿Cómo quieres que se sienta la web?' },
  { n: 14, kind: 'multi', text: '¿Qué material visual de la marca tienen?' },
  { n: 15, kind: 'texto', text: '¿Quién va a actualizar la web y cuántas veces al día?' },
];

const HD_LIMITS = { nombre: 120, contacto: 160, texto: 2000, otro: 200, extra: 300, opcion: 120, opciones: 12 };
const HD_RATE = { max: 5, windowMs: 60 * 60 * 1000 };
const hdHits = new Map(); // memoria del servidor: límite aproximado si no hay RATE_KV

// Texto limpio: sin caracteres de control, con espacios normales y largo limitado.
const clean = (v, max, keepLines = false) => {
  let t = String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[\u2028\u2029]/g, '\n')
    .replace(/\r\n?/g, '\n');
  t = keepLines ? t.replace(/[ \t]+/g, ' ').replace(/ ?\n[ \n]*/g, '\n') : t.replace(/\s+/g, ' ');
  return t.trim().slice(0, max);
};
const cleanList = (v, maxItems) =>
  Array.isArray(v) ? v.map((x) => clean(x, HD_LIMITS.opcion)).filter(Boolean).slice(0, maxItems) : [];

async function hdRateLimited(env, ip) {
  const now = Date.now();
  if (env.RATE_KV) {
    const key = `hd:${ip}:${Math.floor(now / HD_RATE.windowMs)}`;
    const n = Number((await env.RATE_KV.get(key)) || 0);
    if (n >= HD_RATE.max) return true;
    await env.RATE_KV.put(key, String(n + 1), { expirationTtl: 3700 });
    return false;
  }
  const recent = (hdHits.get(ip) || []).filter((t) => now - t < HD_RATE.windowMs);
  if (recent.length >= HD_RATE.max) {
    hdHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hdHits.set(ip, recent);
  if (hdHits.size > 5000) hdHits.clear();
  return false;
}

// Valida y normaliza lo que llega del formulario. Devuelve { data } o { error }.
function hdNormalize(body) {
  const answers = {};
  let count = 0;
  const raw = body && typeof body.answers === 'object' && body.answers ? body.answers : {};
  for (const q of HD_QUESTIONS) {
    const r = raw[q.n] && typeof raw[q.n] === 'object' ? raw[q.n] : {};
    const a = {};
    if (q.kind === 'texto') {
      a.texto = clean(r.texto, HD_LIMITS.texto, true);
      if (a.texto) count++;
    } else {
      a.sel = cleanList(r.sel, q.kind === 'uno' ? 1 : HD_LIMITS.opciones);
      if (q.max && a.sel.length > q.max) return { error: `La pregunta ${q.n} permite máximo ${q.max} opciones` };
      a.otro = a.sel.includes('Otro') ? clean(r.otro, HD_LIMITS.otro) : '';
      a.extra = q.extra ? clean(r.extra, HD_LIMITS.extra) : '';
      if (a.sel.length || a.extra) count++;
    }
    answers[q.n] = a;
  }
  if (count === 0) return { error: 'Responde al menos una pregunta' };
  return {
    data: {
      nombre: clean(body.nombre, HD_LIMITS.nombre),
      contacto: clean(body.contacto, HD_LIMITS.contacto),
      id: clean(body.id, 60).replace(/[^\w-]/g, '') || null,
      answers,
    },
  };
}

const DASH = '—';

// Respuesta de una pregunta en texto: lo vacío se muestra como «—».
function hdAnswerText(q, a) {
  if (q.kind === 'texto') return a.texto ? a.texto.split('\n').join('\n     ') : DASH;
  const sel = a.sel || [];
  const shown = sel.map((o) => (o === 'Otro' && a.otro ? `Otro: ${a.otro}` : o));
  const main = q.kind === 'orden' ? shown.map((o, i) => `${i + 1}) ${o}`).join('  ') : shown.join(', ');
  const lines = [main || DASH];
  if (q.extra) lines.push(`${q.extra}\n   → ${a.extra || DASH}`);
  return lines.join('\n   ');
}

function hdBuildEmail(d, when) {
  const email = (d.contacto.match(/[^\s@,;:<>()]+@[^\s@,;:<>()]+\.[^\s@,;:<>()]+/) || [])[0] || '';
  const lines = [
    'HABLA DEPORTES: respuestas del cuestionario',
    '',
    `Nombre y cargo: ${d.nombre || DASH}`,
    `CONTACTO: ${d.contacto || DASH}`,
    `Fecha: ${when} (hora de Bogotá)`,
    '',
    '────────────────',
    '',
  ];
  for (const q of HD_QUESTIONS) {
    lines.push(`${q.n}. ${q.text}`);
    lines.push(`   → ${hdAnswerText(q, d.answers[q.n] || {})}`);
    lines.push('');
  }
  return { text: lines.join('\n').trimEnd() + '\n', replyTo: email };
}

// ───────────────────────── PDF de respuestas (sin dependencias) ─────────────────────────
// Un PDF A4 con el estilo de las cotizaciones de Out (cabecera azul con el logo, tarjeta de
// datos, preguntas numeradas), escrito a mano con las fuentes estándar de PDF (Helvetica).
// Anchos de letra de Helvetica (por mil de em) para los códigos 32 a 255 de WinAnsi: sirven
// para partir las líneas de texto.
const PDF_WIDTH_N = [
  280,280,350,550,550,890,660,190,330,330,390,580,280,330,280,280,
  550,550,550,550,550,550,550,550,550,550,280,280,580,580,580,550,
  1010,660,660,720,720,660,610,780,720,280,500,660,550,830,720,780,
  660,780,720,660,610,720,660,940,660,660,610,280,280,280,470,550,
  330,550,550,500,550,550,280,550,550,220,220,500,220,830,550,550,
  550,550,330,500,280,550,500,720,500,500,500,330,260,330,580,530,
  530,500,220,550,330,1000,550,550,330,1000,530,330,530,500,530,500,
  500,220,220,330,330,350,550,1000,330,1000,530,330,530,500,530,660,
  530,330,550,550,550,550,530,550,330,730,370,550,580,530,730,330,
  400,580,530,530,330,550,530,280,330,530,360,550,530,530,530,610,
  660,660,660,660,660,660,1000,720,660,660,660,660,280,280,280,280,
  530,720,780,780,780,780,780,530,780,720,720,720,720,530,530,610,
  550,550,550,550,550,550,890,500,550,550,550,550,280,280,280,280,
  530,550,550,550,550,550,550,580,610,550,550,550,550,530,530,500
];
const PDF_WIDTH_B = [
  280,330,470,550,550,890,720,240,330,330,390,580,280,330,280,280,
  550,550,550,550,550,550,550,550,550,550,330,330,580,580,580,610,
  970,720,720,720,720,660,610,780,720,280,550,720,610,830,720,780,
  660,780,720,660,610,720,660,940,660,660,610,330,280,330,580,550,
  330,550,610,550,610,550,330,610,610,280,280,550,280,890,610,610,
  610,610,390,550,330,610,550,780,550,550,500,390,280,390,580,560,
  560,500,280,550,500,1000,550,550,330,1000,560,330,560,500,560,500,
  500,280,280,500,500,350,550,1000,330,1000,560,330,560,500,560,660,
  560,330,550,550,550,550,560,550,330,730,370,550,580,560,730,330,
  400,580,560,560,330,610,550,280,330,560,360,550,560,560,560,610,
  720,720,720,720,720,720,1000,720,660,660,660,660,280,280,280,280,
  560,720,780,780,780,780,780,560,780,720,720,720,720,560,560,610,
  550,550,550,550,550,550,890,550,550,550,550,550,280,280,280,280,
  560,610,610,610,610,610,610,580,610,610,610,610,610,560,560,550
];
// Logo «Out» (docs/marca-nueva/logos/Logo out-03.svg) como trazos de PDF, en un cuadro de 126.12 × 91.76.
const PDF_LOGO = '29.19 72.04 m 25.89 72.04 22.92 71.52 20.26 70.49 c 17.6 69.45 15.33 67.92 13.44 65.9 c 11.56 63.88 10.12 61.36 9.13 58.34 c 8.14 55.33 7.65 51.87 7.65 47.96 c 7.65 42.41 8.58 37.83 10.44 34.22 c 12.3 30.62 14.89 27.92 18.21 26.13 c 21.53 24.34 25.33 23.45 29.62 23.45 c 32.96 23.45 35.95 23.96 38.59 24.97 c 41.23 25.98 43.49 27.5 45.37 29.53 c 47.25 31.55 48.69 34.08 49.68 37.12 c 50.67 40.16 51.16 43.68 51.16 47.68 c 51.16 51.68 50.64 55.28 49.61 58.34 c 48.57 61.4 47.08 63.94 45.13 65.97 c 43.18 67.99 40.86 69.51 38.17 70.53 c 35.49 71.54 32.5 72.05 29.2 72.05 c h 29.61 62.79 m 31.78 62.79 33.59 62.25 35.05 61.17 c 36.51 60.09 37.59 58.46 38.3 56.3 c 39.01 54.14 39.36 51.45 39.36 48.25 c 39.36 44.81 38.98 41.96 38.23 39.7 c 37.48 37.44 36.36 35.72 34.88 34.54 c 33.4 33.36 31.53 32.77 29.27 32.77 c 27.15 32.77 25.36 33.34 23.9 34.47 c 22.44 35.6 21.33 37.27 20.58 39.48 c 19.83 41.69 19.45 44.45 19.45 47.74 c 19.45 50.19 19.66 52.37 20.09 54.27 c 20.51 56.18 21.16 57.75 22.03 59 c 22.9 60.25 23.97 61.19 25.24 61.82 c 26.51 62.46 27.97 62.77 29.62 62.77 c h 65.42 72.04 m 61.23 72.04 58.12 70.6 56.1 67.73 c 54.08 64.86 53.06 60.46 53.06 54.52 c 53.06 33.76 l 64.5 33.76 l 64.5 54.03 l 64.5 56.95 64.92 59.04 65.77 60.32 c 66.62 61.6 67.86 62.23 69.51 62.23 c 70.59 62.23 71.58 61.95 72.48 61.38 c 73.37 60.82 74.15 59.97 74.81 58.84 c 75.47 57.71 75.96 56.31 76.29 54.64 c 76.62 52.97 76.78 51.03 76.78 48.81 c 76.78 33.77 l 88.22 33.77 l 88.22 71.06 l 78.69 71.06 l 78.62 57.43 l 77.84 57.43 l 77.46 60.82 76.77 63.6 75.76 65.76 c 74.75 67.93 73.38 69.52 71.66 70.53 c 69.94 71.54 67.86 72.05 65.41 72.05 c h 113.05 65.87 m 113.05 64.04 113.56 62.32 114.45 60.86 c 113.86 61.17 113.21 61.41 112.51 61.59 c 111.78 61.78 111.06 61.87 110.36 61.87 c 108.95 61.87 107.82 61.5 106.97 60.74 c 106.12 59.98 105.7 58.74 105.7 57 c 105.7 42.95 l 114.39 42.95 l 114.39 33.77 l 105.7 33.77 l 105.7 25.3 l 99.13 25.3 l 99.08 26.66 l 99.06 27.16 99.02 27.67 98.92 28.16 c 98.56 30.05 97.92 30.73 96.91 31.63 c 95.7 32.72 93.92 33.48 91.42 33.76 c 90.15 33.76 l 90.08 42.66 l 94.53 42.66 l 94.53 57.91 l 94.53 62.71 95.59 66.24 97.71 68.5 c 99.83 70.76 103.08 71.89 107.46 71.89 c 108.36 71.89 109.38 71.83 110.53 71.71 c 111.67 71.59 112.98 71.33 114.46 70.91 c 113.56 69.43 113.04 67.7 113.04 65.85 c h';
const PDF_LOGO_W = 126.12;
const PDF_LOGO_H = 91.76;
const CP1252 = { 8364: 128, 8218: 130, 402: 131, 8222: 132, 8230: 133, 8224: 134, 8225: 135, 710: 136, 8240: 137, 352: 138, 8249: 139, 338: 140, 381: 142, 8216: 145, 8217: 146, 8220: 147, 8221: 148, 8226: 149, 8211: 150, 8212: 151, 732: 152, 8482: 153, 353: 154, 8250: 155, 339: 156, 382: 158, 376: 159 };
const PDF_C = {
  klein: [27, 47, 204], deep: [20, 30, 92], ink: [60, 67, 117], muted: [88, 93, 136],
  paper: [243, 237, 231], pure: [251, 248, 245], carne: [245, 227, 179], line: [222, 214, 206],
};

// Texto Unicode → texto de un byte por letra (WinAnsi). Lo que no existe se vuelve «?».
function pdfLatin(str) {
  let out = '';
  for (const ch of String(str)) {
    const c = ch.codePointAt(0);
    if (c < 128 || (c > 159 && c < 256)) out += String.fromCharCode(c);
    else out += String.fromCharCode(CP1252[c] ?? 63);
  }
  return out;
}
const pdfEsc = (s) => s.replace(/[\\()]/g, '\\$&');
function pdfWidth(latin, size, bold) {
  const w = bold ? PDF_WIDTH_B : PDF_WIDTH_N;
  let t = 0;
  for (let i = 0; i < latin.length; i++) {
    const c = latin.charCodeAt(i);
    t += c >= 32 ? w[c - 32] ?? 500 : 0;
  }
  return (t / 1000) * size;
}
// Parte un texto en líneas que caben en `max` puntos (respeta saltos de línea).
function pdfWrap(text, size, bold, max) {
  const lines = [];
  for (const para of pdfLatin(text).split('\n')) {
    if (!para.trim()) { lines.push(''); continue; }
    let cur = '';
    for (let word of para.split(' ')) {
      while (pdfWidth(word, size, bold) > max) { // palabra más larga que la línea (por ejemplo un enlace)
        let cut = word.length;
        while (cut > 1 && pdfWidth(word.slice(0, cut), size, bold) > max) cut--;
        if (cur) { lines.push(cur); cur = ''; }
        lines.push(word.slice(0, cut));
        word = word.slice(cut);
      }
      const test = cur ? `${cur} ${word}` : word;
      if (cur && pdfWidth(test, size, bold) > max) { lines.push(cur); cur = word; } else cur = test;
    }
    lines.push(cur);
  }
  return lines;
}
const rgb = (c) => c.map((v) => (v / 255).toFixed(3)).join(' ');

function hdBuildPdf(d, when) {
  const W = 595.28, H = 841.89, M = 48, CW = W - M * 2;
  const DL = pdfLatin('—');
  const pages = [];
  let ops, y;
  const Y = (top) => (H - top).toFixed(2);
  const rect = (x, top, w, h, c) => ops.push(`${rgb(c)} rg ${x.toFixed(2)} ${(H - top - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
  const rrect = (x, top, w, h, r, c) => {
    const k = r * 0.5523, x1 = x + w, yb = H - top - h, yt = H - top;
    ops.push(`${rgb(c)} rg ${(x + r).toFixed(2)} ${yb.toFixed(2)} m ${(x1 - r).toFixed(2)} ${yb.toFixed(2)} l ${(x1 - r + k).toFixed(2)} ${yb.toFixed(2)} ${x1.toFixed(2)} ${(yb + r - k).toFixed(2)} ${x1.toFixed(2)} ${(yb + r).toFixed(2)} c ${x1.toFixed(2)} ${(yt - r).toFixed(2)} l ${x1.toFixed(2)} ${(yt - r + k).toFixed(2)} ${(x1 - r + k).toFixed(2)} ${yt.toFixed(2)} ${(x1 - r).toFixed(2)} ${yt.toFixed(2)} c ${(x + r).toFixed(2)} ${yt.toFixed(2)} l ${(x + r - k).toFixed(2)} ${yt.toFixed(2)} ${x.toFixed(2)} ${(yt - r + k).toFixed(2)} ${x.toFixed(2)} ${(yt - r).toFixed(2)} c ${x.toFixed(2)} ${(yb + r).toFixed(2)} l ${x.toFixed(2)} ${(yb + r - k).toFixed(2)} ${(x + r - k).toFixed(2)} ${yb.toFixed(2)} ${(x + r).toFixed(2)} ${yb.toFixed(2)} c f`);
  };
  const text = (latin, x, top, size, bold, c) =>
    ops.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${rgb(c)} rg ${x.toFixed(2)} ${Y(top)} Td (${pdfEsc(latin)}) Tj ET`);
  const newPage = () => {
    ops = [];
    pages.push(ops);
    rect(0, 0, W, H, PDF_C.pure);
    y = M;
  };
  const ensure = (h) => { if (y + h > H - 56) newPage(); };

  // ── Página 1: cabecera azul con el logo
  newPage();
  rect(0, 0, W, 132, PDF_C.klein);
  const lw = 74, ls = lw / PDF_LOGO_W;
  ops.push(`q ${ls.toFixed(4)} 0 0 ${(-ls).toFixed(4)} ${M} ${(H - 44).toFixed(2)} cm ${rgb(PDF_C.pure)} rg ${PDF_LOGO} f Q`);
  const tag = pdfLatin('Habla Deportes');
  text(tag, W - M - pdfWidth(tag, 13, true), 52, 13, true, PDF_C.pure);
  const sub = pdfLatin('Cuestionario para la nueva web');
  text(sub, W - M - pdfWidth(sub, 10, false), 68, 10, false, PDF_C.carne);
  y = 178;
  for (const l of pdfWrap('Respuestas del cuestionario', 27, true, CW)) { text(l, M, y, 27, true, PDF_C.deep); y += 31; }
  text(pdfLatin(when), M, y + 2, 11, false, PDF_C.ink);
  y += 30;

  // ── Tarjeta de datos
  const rows = [
    ['NOMBRE Y CARGO', d.nombre || '—', false],
    ['CONTACTO', d.contacto || '—', true],
  ];
  const cardLines = rows.map(([, v]) => pdfWrap(v, 13, true, CW - 40));
  const cardH = 30 + cardLines.reduce((n, l) => n + 16 + l.length * 16 + 12, 0);
  rrect(M, y, CW, cardH, 14, PDF_C.paper);
  let cy = y + 26;
  rows.forEach(([label, , strong], i) => {
    text(pdfLatin(label), M + 20, cy, 8.5, true, PDF_C.muted);
    cy += 17;
    cardLines[i].forEach((l) => { text(l, M + 20, cy, 13, true, strong ? PDF_C.klein : PDF_C.deep); cy += 16; });
    cy += 12;
  });
  y += cardH + 30;

  // ── Preguntas
  for (const q of HD_QUESTIONS) {
    const a = d.answers[q.n] || {};
    const qLines = pdfWrap(q.text, 12.5, true, CW - 34);
    let aLines;
    if (q.kind === 'texto') aLines = a.texto ? pdfWrap(a.texto, 11.5, false, CW - 34) : [DL];
    else {
      const sel = (a.sel || []).map((o) => (o === 'Otro' && a.otro ? `Otro: ${a.otro}` : o));
      aLines = !sel.length ? [DL] : q.kind === 'orden' ? sel.flatMap((o, i) => pdfWrap(`${i + 1}) ${o}`, 11.5, false, CW - 34)) : pdfWrap(sel.join(', '), 11.5, false, CW - 34);
    }
    const extraLines = q.extra ? pdfWrap(a.extra || '—', 11.5, false, CW - 34) : [];
    const need = (q.priority ? 20 : 0) + qLines.length * 16 + 6 + aLines.length * 15.5 + (q.extra ? 22 + extraLines.length * 15.5 : 0) + 26;
    ensure(Math.min(need, 150));
    const x0 = M + 34;
    // número
    rrect(M, y - 4, 22, 22, 11, PDF_C.klein);
    const n = pdfLatin(String(q.n));
    text(n, M + 11 - pdfWidth(n, 10.5, true) / 2, y + 11, 10.5, true, PDF_C.pure);
    if (q.priority) {
      const pw = pdfWidth('PRIORIDAD', 7.5, true) + 14;
      rrect(x0, y - 4, pw, 14, 7, PDF_C.carne);
      text('PRIORIDAD', x0 + 7, y + 6.5, 7.5, true, PDF_C.deep);
      y += 20;
    }
    for (const l of qLines) { ensure(18); text(l, x0, y + 11, 12.5, true, PDF_C.deep); y += 16; }
    y += 6;
    const empty = aLines.length === 1 && aLines[0] === DL;
    for (const l of aLines) { ensure(17); text(l, x0, y + 10, 11.5, false, empty ? PDF_C.muted : PDF_C.ink); y += 15.5; }
    if (q.extra) {
      y += 6;
      ensure(40);
      for (const l of pdfWrap(q.extra, 9.5, true, CW - 34)) { text(l, x0, y + 9, 9.5, true, PDF_C.muted); y += 13; }
      const emptyX = extraLines.length === 1 && extraLines[0] === DL;
      for (const l of extraLines) { ensure(17); text(l, x0, y + 10, 11.5, false, emptyX ? PDF_C.muted : PDF_C.ink); y += 15.5; }
    }
    y += 12;
    rect(x0, y, CW - 34, 0.6, PDF_C.line);
    y += 18;
  }

  // ── Pie de página
  pages.forEach((p, i) => {
    ops = p;
    text(pdfLatin('Out Studio · outstudio.online'), M, H - 28, 8.5, false, PDF_C.muted);
    const pg = pdfLatin(`Página ${i + 1} de ${pages.length}`);
    text(pg, W - M - pdfWidth(pg, 8.5, false), H - 28, 8.5, false, PDF_C.muted);
  });

  // ── Ensamblado del archivo
  const objs = [];
  const add = (body) => objs.push(body) && objs.length;
  add('<< /Type /Catalog /Pages 2 0 R >>');
  add(`<< /Type /Pages /Kids [${pages.map((_, i) => `${5 + i * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`);
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  pages.forEach((p, i) => {
    const content = p.join('\n');
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + i * 2} 0 R >>`);
    add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });
  const info = add(`<< /Title (${pdfEsc(pdfLatin('Habla Deportes: respuestas del cuestionario'))}) /Producer (Out Studio) >>`);
  let pdf = '%PDF-1.4\n%âãÏÓ\n';
  const offs = [];
  objs.forEach((body, i) => { offs.push(pdf.length); pdf += `${i + 1} 0 obj\n${body}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offs.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('')}`;
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return btoa(pdf);
}

async function handleHablaDeportes(request, env, body, cors) {
  // Señuelo: si un bot llena el campo oculto, se responde «ok» y no se envía nada.
  if (clean(body.hp, 50)) return json({ ok: true }, 200, cors);

  // Versión: evita mezclar las respuestas de un cuestionario con las preguntas de otro.
  if (Number(body.v) !== HD_VERSION) {
    return json({ ok: false, error: 'El cuestionario cambió. Recarga la página e inténtalo de nuevo.' }, 409, cors);
  }

  const norm = hdNormalize(body);
  if (norm.error) return json({ ok: false, error: norm.error }, 400, cors);

  const ip = request.headers.get('CF-Connecting-IP') || 'sin-ip';
  if (await hdRateLimited(env, ip)) {
    return json({ ok: false, error: 'Demasiados envíos desde esta conexión. Intenta más tarde.' }, 429, cors);
  }

  const when = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short' }).format(new Date());
  const { text, replyTo } = hdBuildEmail(norm.data, when);
  const to = env.FORM_TO || env.REPLY_TO || 'oscar.diaz@outstudio.online';

  const payload = {
    from: env.FROM || 'Out Studio <cotizaciones@outstudio.online>',
    to: [to],
    subject: 'Habla Deportes: respuestas del cuestionario',
    text,
  };
  // PDF con el estilo de las cotizaciones. Si algo falla al armarlo, el correo sale igual, sin adjunto.
  try {
    payload.attachments = [{ filename: 'Habla Deportes - respuestas del cuestionario.pdf', content: hdBuildPdf(norm.data, when) }];
  } catch (err) {
    console.error('PDF de respuestas', err && err.message);
  }
  if (replyTo) payload.reply_to = replyTo;

  const headers = { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' };
  if (norm.data.id) headers['Idempotency-Key'] = `habla-deportes-${norm.data.id}`; // evita correos dobles si se reintenta

  const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('Resend error (habla-deportes)', res.status, detail);
    return json({ ok: false, error: 'No se pudo enviar el correo' }, 502, cors);
  }
  return json({ ok: true }, 200, cors);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ ok: false, error: 'Método no permitido' }, 405, cors);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: 'Origen no permitido' }, 403, cors);

    if (!env.RESEND_API_KEY) {
      return json({ ok: false, error: 'El Worker no está configurado (faltan variables)' }, 500, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'Solicitud inválida' }, 400, cors);
    }

    if (body && body.form === 'habla-deportes') return handleHablaDeportes(request, env, body, cors);

    if (!env.SEND_PASSPHRASE) {
      return json({ ok: false, error: 'El Worker no está configurado (faltan variables)' }, 500, cors);
    }

    if (!safeEqual(body.key ?? '', env.SEND_PASSPHRASE)) {
      return json({ ok: false, error: 'Clave de envío incorrecta' }, 401, cors);
    }

    const to = String(body.to ?? '').trim();
    const subject = String(body.subject ?? '').trim().slice(0, 200);
    const message = String(body.message ?? '').trim().slice(0, 5000);
    const pdf = String(body.pdfBase64 ?? '');
    const filename = String(body.filename ?? 'Cotizacion.pdf')
      .replace(/[^\w.\- áéíóúñÁÉÍÓÚÑ]/g, '')
      .slice(0, 120) || 'Cotizacion.pdf';

    if (!EMAIL_RE.test(to)) return json({ ok: false, error: 'Email del cliente inválido' }, 400, cors);
    if (!subject) return json({ ok: false, error: 'Falta el asunto' }, 400, cors);
    if (!pdf || pdf.length > MAX_PDF_BASE64_CHARS) {
      return json({ ok: false, error: 'PDF ausente o demasiado grande' }, 400, cors);
    }

    const replyTo = env.REPLY_TO || 'oscar.diaz@outstudio.online';
    const html = `<!doctype html><html><body style="margin:0;background:#F3EDE7;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#141E5C">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#FBF8F5;border-radius:16px"><tr><td style="padding:32px">
<img src="https://outstudio.online/email/out-logo.png" width="96" height="44" alt="Out" style="display:block;border:0;margin:0 0 22px;font-size:22px;font-weight:700;color:#1B2FCC">
<div style="font-size:15px;line-height:1.6;color:#141E5C">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
<p style="margin:24px 0 0;font-size:13px;color:#585D88">Adjuntamos la propuesta en PDF. Puedes responder directamente a este correo.</p>
</td></tr></table></body></html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FROM || 'Out Studio <cotizaciones@outstudio.online>',
        to: [to],
        bcc: [env.BCC || 'oscar.diaz@outstudio.online'],
        reply_to: replyTo,
        subject,
        html,
        text: `${message}\n\nAdjuntamos la propuesta en PDF. Puedes responder directamente a este correo.`,
        attachments: [{ filename, content: pdf }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Resend error', res.status, detail);
      return json({ ok: false, error: 'No se pudo enviar el correo', detail: detail.slice(0, 300) }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  },
};
