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

    if (!env.RESEND_API_KEY || !env.SEND_PASSPHRASE) {
      return json({ ok: false, error: 'El Worker no está configurado (faltan variables)' }, 500, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'Solicitud inválida' }, 400, cors);
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
<p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#1B2FCC">Out Studio</p>
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
