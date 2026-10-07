// Cotizador por encuesta: el cliente elige uno o varios tipos de proyecto y
// responde las preguntas de cada uno. Las respuestas llegan completas al
// correo de Out para armar una cotización a la medida (sin cifra automática).

export type QuestionKind = 'single' | 'multi' | 'text' | 'long';

export interface Question {
  id: string;
  label: string;
  help?: string;
  kind: QuestionKind;
  /** Para single/multi: el valor que se guarda es el mismo texto mostrado. */
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface ProjectType {
  id: string;
  label: string;
  blurb: string;
  questions: Question[];
}

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'shopify',
    label: 'Tienda Shopify',
    blurb: 'Vender online, con catálogo, pagos y envíos.',
    questions: [
      {
        id: 'situacion',
        label: '¿En qué punto está tu tienda?',
        kind: 'single',
        required: true,
        options: [
          'Es mi primera tienda online',
          'Ya vendo en otra plataforma y quiero migrar',
          'Ya tengo Shopify y quiero rediseñarla o mejorarla',
        ],
      },
      {
        id: 'productos',
        label: '¿Cuántos productos tendrá aproximadamente?',
        kind: 'single',
        required: true,
        options: ['1 a 20', '21 a 100', '101 a 500', 'Más de 500'],
      },
      {
        id: 'funciones',
        label: '¿Qué necesitas que tenga?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        options: [
          'Pasarela de pagos (Wompi, Mercado Pago, PayU…)',
          'Envíos y transportadoras',
          'Cupones y descuentos',
          'Venta por suscripción o recurrente',
          'Varios idiomas o monedas',
          'Facturación electrónica o inventario (ERP)',
          'Reseñas y programa de fidelización',
          'Blog',
        ],
      },
      {
        id: 'contenido',
        label: '¿Ya tienes fotos y textos de tus productos?',
        kind: 'single',
        required: true,
        options: [
          'Sí, todo listo',
          'Tengo una parte',
          'No, necesito ayuda con fotos y textos',
        ],
      },
      {
        id: 'marca',
        label: '¿Cómo está tu marca?',
        kind: 'single',
        required: true,
        options: [
          'Tengo logo y guía de marca',
          'Solo tengo el logo',
          'Aún no tengo marca definida',
        ],
      },
      {
        id: 'capacitacion',
        label: '¿Necesitas capacitación para administrarla?',
        kind: 'single',
        options: ['Sí', 'No', 'No estoy seguro'],
      },
    ],
  },
  {
    id: 'wordpress',
    label: 'Sitio WordPress',
    blurb: 'Un sitio web profesional que tú mismo puedes actualizar.',
    questions: [
      {
        id: 'tipo',
        label: '¿Qué tipo de sitio necesitas?',
        kind: 'single',
        required: true,
        options: [
          'Corporativo o institucional',
          'Portafolio o catálogo',
          'Blog o medio',
          'Tienda con WooCommerce',
          'Cursos o membresías',
          'Otro',
        ],
      },
      {
        id: 'paginas',
        label: '¿Cuántas páginas tendrá aproximadamente?',
        kind: 'single',
        required: true,
        options: ['1 a 5', '6 a 10', '11 a 20', 'Más de 20'],
      },
      {
        id: 'funciones',
        label: '¿Qué funciones necesitas?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        options: [
          'Formularios conectados a correo o CRM',
          'Blog',
          'Varios idiomas',
          'Reservas o agenda',
          'Área privada con login',
          'Botón y chat de WhatsApp',
          'SEO técnico avanzado',
        ],
      },
      {
        id: 'situacion',
        label: '¿Ya tienes un sitio web?',
        kind: 'single',
        required: true,
        options: [
          'No, es el primero',
          'Sí, en WordPress y quiero rediseñarlo',
          'Sí, en otra plataforma y quiero migrar',
        ],
      },
      {
        id: 'contenido',
        label: '¿Tienes los textos e imágenes?',
        kind: 'single',
        required: true,
        options: [
          'Sí, todo listo',
          'Tengo una parte',
          'No, necesito ayuda con el contenido',
        ],
      },
      {
        id: 'hosting',
        label: '¿Tienes dominio y hosting?',
        kind: 'single',
        required: true,
        options: [
          'Ya tengo ambos',
          'Solo el dominio',
          'Ninguno, necesito asesoría',
        ],
      },
    ],
  },
  {
    id: 'landing',
    label: 'Landing page',
    blurb: 'Una página de campaña pensada para convertir.',
    questions: [
      {
        id: 'objetivo',
        label: '¿Cuál es el objetivo principal?',
        kind: 'single',
        required: true,
        options: [
          'Captar contactos (leads)',
          'Vender un producto o servicio',
          'Promocionar un lanzamiento o evento',
          'Promocionar una app',
          'Otro',
        ],
      },
      {
        id: 'cantidad',
        label: '¿Cuántas landing pages necesitas?',
        kind: 'single',
        required: true,
        options: ['1', '2 o 3', 'Más de 3'],
      },
      {
        id: 'funciones',
        label: '¿Qué debe incluir?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        options: [
          'Formulario conectado a correo o CRM',
          'Botón de WhatsApp',
          'Pasarela de pago',
          'Agendamiento de citas',
          'Video',
          'Pixel y analítica (Meta, Google Analytics)',
          'Varios idiomas',
        ],
      },
      {
        id: 'copy',
        label: '¿Tienes los textos de la página?',
        kind: 'single',
        required: true,
        options: [
          'Sí, ya están listos',
          'Tengo ideas, necesito ayuda para redactarlos',
          'No, necesito redacción completa',
        ],
      },
      {
        id: 'pauta',
        label: '¿Vas a pautar con Meta Ads o Google Ads?',
        kind: 'single',
        options: ['Sí', 'No', 'Aún no lo sé'],
      },
    ],
  },
  {
    id: 'app',
    label: 'App o desarrollo a medida',
    blurb: 'Aplicaciones, plataformas y sistemas desde cero.',
    questions: [
      {
        id: 'tipo',
        label: '¿Qué tipo de producto tienes en mente?',
        kind: 'single',
        required: true,
        options: [
          'App web',
          'App móvil (iOS / Android)',
          'Plataforma o panel interno',
          'MVP para validar una idea',
          'Otro',
        ],
      },
      {
        id: 'problema',
        label: '¿Qué problema resuelve o qué debe hacer?',
        help: 'Cuéntanos la idea con tus palabras, no hace falta que sea técnico.',
        kind: 'long',
        required: true,
        placeholder: 'Ej: una app para que mis clientes agenden y paguen…',
      },
      {
        id: 'usuarios',
        label: '¿Quién la va a usar?',
        kind: 'single',
        required: true,
        options: ['Solo mi equipo', 'Mis clientes', 'Ambos'],
      },
      {
        id: 'funciones',
        label: '¿Qué funciones clave imaginas?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        options: [
          'Registro e inicio de sesión',
          'Pagos o suscripciones',
          'Panel de administración',
          'Notificaciones',
          'Mapas y geolocalización',
          'Chat o mensajería',
          'Reportes y analítica',
          'Inteligencia artificial',
          'Conexión con otros sistemas (APIs)',
        ],
      },
      {
        id: 'diseno',
        label: '¿Ya tienes diseño, prototipo o documento de requisitos?',
        kind: 'single',
        required: true,
        options: ['Sí, completo', 'Algo básico', 'No, partimos de cero'],
      },
    ],
  },
  {
    id: 'automatizacion',
    label: 'Integraciones y automatizaciones',
    blurb: 'Conectar tus herramientas y quitarte trabajo repetitivo.',
    questions: [
      {
        id: 'proceso',
        label: '¿Qué proceso quieres automatizar?',
        help: 'Descríbelo paso a paso, como se hace hoy.',
        kind: 'long',
        required: true,
        placeholder: 'Ej: cuando llega un pedido, copiamos los datos a Excel y facturamos a mano…',
      },
      {
        id: 'herramientas',
        label: '¿Qué herramientas usas o quieres conectar?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        options: [
          'Shopify o WooCommerce',
          'CRM (HubSpot, Zoho, Odoo…)',
          'Facturación electrónica (Siigo, Alegra…)',
          'WhatsApp Business',
          'Google Sheets o Workspace',
          'Correo y marketing (Mailchimp, Klaviyo…)',
          'ERP o inventarios',
          'Otra',
        ],
      },
      {
        id: 'volumen',
        label: '¿Cuánto volumen maneja ese proceso?',
        kind: 'single',
        required: true,
        options: [
          'Pocas veces al día',
          'Cientos al mes',
          'Miles al mes o más',
          'No lo sé',
        ],
      },
      {
        id: 'herramienta_auto',
        label: '¿Ya usas Zapier, Make o n8n?',
        kind: 'single',
        options: ['Sí', 'No', 'No sé qué es'],
      },
    ],
  },
  {
    id: 'branding',
    label: 'Branding e identidad visual',
    blurb: 'Logo, identidad y todo lo que hace reconocible tu marca.',
    questions: [
      {
        id: 'situacion',
        label: '¿Es una marca nueva o ya existe?',
        kind: 'single',
        required: true,
        options: [
          'Marca nueva',
          'Rediseño completo (rebranding)',
          'Actualización de lo que ya tengo',
        ],
      },
      {
        id: 'entregables',
        label: '¿Qué necesitas?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        required: true,
        options: [
          'Naming (nombre de la marca)',
          'Logo',
          'Identidad visual (paleta, tipografías, estilo)',
          'Manual de marca',
          'Papelería (tarjetas, membretes…)',
          'Empaques y etiquetas',
          'Plantillas para redes sociales',
          'Señalética o aplicaciones físicas',
        ],
      },
      {
        id: 'marca',
        label: 'Cuéntanos sobre tu marca',
        help: 'A qué se dedica, a quién le habla y cómo quieres que se sienta.',
        kind: 'long',
        required: true,
        placeholder: 'Ej: una marca de café de origen, para gente joven, cálida pero con carácter…',
      },
      {
        id: 'estilo',
        label: '¿Qué estilo te atrae?',
        kind: 'multi',
        options: [
          'Minimalista',
          'Editorial',
          'Colorido y juguetón',
          'Elegante o de lujo',
          'Artesanal',
          'Tecnológico',
          'Aún no lo sé',
        ],
      },
      {
        id: 'inspiracion',
        label: 'Marcas que te inspiran',
        help: 'Opcional. Nombres o links.',
        kind: 'long',
      },
    ],
  },
  {
    id: 'soporte',
    label: 'Soporte y optimización',
    blurb: 'Mantener, mejorar y acelerar un sitio que ya existe.',
    questions: [
      {
        id: 'url',
        label: '¿Cuál es la dirección de tu sitio?',
        kind: 'text',
        required: true,
        placeholder: 'https://',
      },
      {
        id: 'plataforma',
        label: '¿En qué plataforma está?',
        kind: 'single',
        required: true,
        options: ['Shopify', 'WordPress', 'A medida', 'Otra', 'No lo sé'],
      },
      {
        id: 'necesidad',
        label: '¿Qué necesitas?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        required: true,
        options: [
          'Mantenimiento mensual',
          'Cambios y mejoras',
          'Corregir errores',
          'Optimizar velocidad',
          'SEO técnico',
          'Seguridad y copias de respaldo',
        ],
      },
      {
        id: 'urgencia',
        label: '¿Qué tan urgente es?',
        kind: 'single',
        options: ['Muy urgente', 'En las próximas semanas', 'Sin afán'],
      },
    ],
  },
];

export const COMMON_QUESTIONS: Question[] = [
  {
    id: 'negocio',
    label: '¿A qué se dedica tu negocio y a quién le vendes?',
    kind: 'long',
    required: true,
    placeholder: 'Cuéntanos con tus palabras…',
  },
  {
    id: 'referencias',
    label: 'Sitios o marcas que te gustan',
    help: 'Opcional. Pega links o nombres: nos ayuda mucho a entender tu gusto.',
    kind: 'long',
  },
  {
    id: 'presupuesto',
    label: '¿Con qué presupuesto aproximado cuentas? (COP)',
    help: 'Nos sirve para proponerte algo realista. No es un compromiso.',
    kind: 'single',
    required: true,
    options: [
      'Menos de $2 millones',
      '$2 a $5 millones',
      '$5 a $10 millones',
      '$10 a $20 millones',
      'Más de $20 millones',
      'Prefiero que ustedes me propongan',
    ],
  },
  {
    id: 'plazo',
    label: '¿Para cuándo lo necesitas?',
    kind: 'single',
    required: true,
    options: [
      'Lo antes posible',
      'En 1 o 2 meses',
      'En 3 meses o más',
      'No tengo fecha fija',
    ],
  },
  {
    id: 'extra',
    label: '¿Algo más que debamos saber?',
    kind: 'long',
    help: 'Opcional.',
  },
];

export type Answer = string | string[];
export type Answers = Record<string, Answer>;

/** Clave única de cada respuesta: `tipo.pregunta` (o `comun.pregunta`). */
export const answerKey = (scope: string, questionId: string) =>
  `${scope}.${questionId}`;

export function isAnswered(q: Question, value: Answer | undefined): boolean {
  if (!q.required) return true;
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === 'string' && value.trim().length > 0;
}

function formatAnswer(value: Answer | undefined): string {
  if (Array.isArray(value)) return value.length ? value.join('; ') : '—';
  return value && value.trim() ? value.trim() : '—';
}

function section(title: string, questions: Question[], scope: string, answers: Answers) {
  const lines = questions.map(
    (q) => `• ${q.label}\n  → ${formatAnswer(answers[answerKey(scope, q.id)])}`,
  );
  return `=== ${title.toUpperCase()} ===\n${lines.join('\n')}`;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  company: string;
}

/** Arma el brief completo en texto plano, listo para llegar al correo. */
export function buildBrief(
  typeIds: string[],
  answers: Answers,
  contact: Contact,
): string {
  const types = PROJECT_TYPES.filter((t) => typeIds.includes(t.id));
  const parts = [
    `Nombre: ${contact.name}`,
    `Email: ${contact.email}`,
    `WhatsApp / teléfono: ${contact.phone || '—'}`,
    `Empresa o marca: ${contact.company || '—'}`,
    `Proyectos solicitados: ${types.map((t) => t.label).join(', ')}`,
    ...types.map((t) => section(t.label, t.questions, t.id, answers)),
    section('Sobre el proyecto', COMMON_QUESTIONS, 'comun', answers),
  ];
  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Fase 2: del brief del cliente al dossier de cotización.
// ---------------------------------------------------------------------------

/** Entregables por defecto de cada tipo: punto de partida editable en el dossier. */
export const DEFAULT_SCOPE: Record<string, string[]> = {
  shopify: [
    'Diseño de la tienda a medida y adaptado a móvil',
    'Configuración de Shopify: productos, colecciones, páginas y menús',
    'Pasarela de pagos y métodos de envío',
    'Carga inicial de productos',
    'SEO básico y analítica instalada',
    'Capacitación para administrar la tienda',
  ],
  wordpress: [
    'Diseño a medida y adaptado a móvil',
    'Desarrollo en WordPress con un panel fácil de administrar',
    'Formularios conectados y optimización de velocidad',
    'SEO técnico básico',
    'Capacitación de uso',
  ],
  landing: [
    'Diseño y desarrollo de la página',
    'Formulario y/o botón de WhatsApp conectados',
    'Pixel y analítica instalados',
    'Optimización de velocidad y adaptación a móvil',
  ],
  app: [
    'Descubrimiento y definición del alcance',
    'Diseño de interfaz y experiencia (UI/UX)',
    'Desarrollo del producto',
    'Pruebas y puesta en producción',
    'Documentación y entrega',
  ],
  automatizacion: [
    'Levantamiento del proceso actual',
    'Diseño e implementación de las integraciones',
    'Pruebas con datos reales',
    'Documentación y acompañamiento inicial',
  ],
  branding: [
    'Investigación y definición de la marca',
    'Diseño del logo con sus variantes',
    'Paleta de color, tipografías y estilo visual',
    'Manual de marca',
    'Aplicaciones (papelería, redes, empaques) según lo acordado',
  ],
  soporte: [
    'Diagnóstico inicial del sitio',
    'Mantenimiento, copias de respaldo y actualizaciones',
    'Optimizaciones según lo acordado',
    'Reporte de lo realizado',
  ],
};

export interface QuotePayload {
  v: 1;
  contact: Contact;
  types: string[];
  answers: Answers;
}

export interface AnswerRow {
  question: string;
  answer: string;
}

export interface AnswerGroup {
  title: string;
  rows: AnswerRow[];
}

/** Respuestas contestadas, agrupadas por tipo de proyecto, para mostrarlas. */
export function answerGroups(
  typeIds: string[],
  answers: Answers,
): AnswerGroup[] {
  const make = (title: string, qs: Question[], scope: string): AnswerGroup => ({
    title,
    rows: qs
      .map((q) => ({
        question: q.label,
        answer: formatAnswer(answers[answerKey(scope, q.id)]),
      }))
      .filter((r) => r.answer !== '—'),
  });
  return [
    ...PROJECT_TYPES.filter((t) => typeIds.includes(t.id)).map((t) =>
      make(t.label, t.questions, t.id),
    ),
    make('Sobre el proyecto', COMMON_QUESTIONS, 'comun'),
  ].filter((g) => g.rows.length > 0);
}

// El payload viaja en el hash de un link (nunca llega a un servidor): JSON
// comprimido con deflate y en base64 "seguro para URL". Prefijo "z." si va
// comprimido, "j." si el navegador no soporta CompressionStream.
function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function pipe(bytes: Uint8Array, stream: GenericTransformStream) {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function encodePayload(payload: QuotePayload): Promise<string> {
  const raw = new TextEncoder().encode(JSON.stringify(payload));
  if (typeof CompressionStream === 'undefined') return `j.${toBase64Url(raw)}`;
  return `z.${toBase64Url(await pipe(raw, new CompressionStream('deflate-raw')))}`;
}

export async function decodePayload(
  encoded: string,
): Promise<QuotePayload | null> {
  try {
    const [kind, body] = [encoded.slice(0, 2), encoded.slice(2)];
    let bytes = fromBase64Url(body);
    if (kind === 'z.') {
      bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
    } else if (kind !== 'j.') {
      return null;
    }
    const data = JSON.parse(new TextDecoder().decode(bytes)) as QuotePayload;
    return data && data.v === 1 && Array.isArray(data.types) ? data : null;
  } catch {
    return null;
  }
}
