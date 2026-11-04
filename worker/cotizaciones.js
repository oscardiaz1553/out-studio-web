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
const HD_QUESTIONS = [
  { n: 1, kind: 'multi', max: 2, text: '¿Qué quieres que haga la gente al entrar a la web?' },
  { n: 2, kind: 'orden', max: 3, text: '¿Qué es lo más importante para ti? (en orden)' },
  { n: 3, kind: 'uno', text: '¿La web será sobre todo de video, o también publicarán notas escritas?', extra: 'Si publican notas, ¿quién las escribe?' },
  { n: 4, kind: 'uno', text: '¿Sobre qué equipos es la web?' },
  { n: 5, kind: 'uno', text: '¿Quieren resultados y tabla de posiciones en la web?', extra: '¿Tienen proveedor de datos, como Data Factory?' },
  { n: 6, kind: 'multi', text: '¿Qué redes usan más?' },
  { n: 7, kind: 'uno', text: '¿Juan Salvador debe tener su propio espacio en la web, con sus videos y sus publicaciones de X?' },
  { n: 8, kind: 'uno', text: '¿Quieren reproductor de radio en vivo en la web?', extra: 'Enlace de la transmisión, si lo tienen' },
  { n: 9, kind: 'texto', text: '¿Quiénes son sus patrocinadores hoy? (un nombre por línea)' },
  { n: 10, kind: 'multi', text: '¿Dónde quieren que se vean?' },
  { n: 11, kind: 'uno', text: '¿Venden publicidad en la web, o solo patrocinios fijos?', extra: '¿Algún tipo de patrocinador que NO quieran mostrar?' },
  { n: 12, kind: 'texto', text: 'Nombra 3 sitios de deportes que te gusten y 1 que no. ¿Qué te gusta de cada uno?' },
  { n: 13, kind: 'multi', max: 2, text: '¿Cómo quieres que se sienta la web?' },
  { n: 14, kind: 'uno', text: '¿Mantienen el azul del logo?', extra: '¿Tienen manual de marca?' },
  { n: 15, kind: 'texto', text: '¿Quién va a actualizar la web y cuántas veces al día?' },
  { n: 16, kind: 'uno', text: '¿Para cuándo la quieren lista?' },
  { n: 17, kind: 'multi', text: '¿Qué nos pueden enviar?' },
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

async function handleHablaDeportes(request, env, body, cors) {
  // Señuelo: si un bot llena el campo oculto, se responde «ok» y no se envía nada.
  if (clean(body.hp, 50)) return json({ ok: true }, 200, cors);

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
