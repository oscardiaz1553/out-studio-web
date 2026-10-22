export const EMAIL = 'oscar.diaz@outstudio.online';
export const PHONE_DISPLAY = '+57 318 888 8392';
export const PHONE_TEL = '+573188888392';

// Access key de Web3Forms (pública por diseño: va en el front-end). Los
// formularios de contacto y cotizador envían con ella directo al inbox de
// oscar.diaz@outstudio.online. Si se vacía, abren el correo del visitante.
export const WEB3FORMS_ACCESS_KEY = 'd7b8bdbb-5202-4264-b1d3-d80b7b60f854';

// URL del Worker de Cloudflare que envía la cotización en PDF por correo
// (ver worker/cotizaciones.js). Mientras esté vacía, el generador solo ofrece
// "Descargar PDF" y "Preparar correo".
export const QUOTE_WORKER_URL = 'https://out-cotizaciones.oscar-diaz-dc0.workers.dev/';

// Franja "Marcas que confían en Out" de la portada (se alimenta de los
// proyectos). Apagada por ahora: se enciende con true.
export const SHOW_CLIENTS = false;

// Sección "Reseñas" de la portada. Se muestra mientras haya reseñas reales en
// src/data/reviews.ts; se apaga (false) si dejan de estar.
export const SHOW_REVIEWS = true;

// Sección "Quién está detrás de Out" de la portada. Apagada hasta tener la foto
// (public/oscar.webp) y el texto en src/data/founder.ts: se enciende con true.
export const SHOW_FOUNDER = false;

// Enlace para dejar una reseña en el perfil de Google de Out (Google Business
// Profile → "Pedir reseñas" → copiar el enlace). Mientras esté vacío, el botón
// de Google no aparece y queda sólo el formulario propio.
export const GOOGLE_REVIEW_URL = 'https://g.page/r/Cdj6HJbUUYDlEAI/review';

// WhatsApp: el mismo número del teléfono.
export const WHATSAPP_URL = `https://wa.me/${PHONE_TEL.replace('+', '')}`;

// Redes de Out. Las que estén vacías no se muestran en el footer.
export const SOCIAL = {
  instagram: '',
  linkedin: '',
  tiktok: '',
  behance: '',
};
