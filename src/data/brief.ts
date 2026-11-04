// Brief de tienda online: un formulario corto que Out le manda por link a un
// cliente nuevo (outstudio.online/brief.html?c=NombreDeLaEmpresa) para saber
// qué necesita y qué ya tiene antes de cotizar. Las respuestas llegan por
// correo a Out. No se indexa ni sale en el sitemap.

export type BriefKind = 'single' | 'multi' | 'text' | 'long';

export interface BriefQuestion {
  id: string;
  label: string;
  help?: string;
  kind: BriefKind;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface BriefSection {
  id: string;
  title: string;
  intro?: string;
  questions: BriefQuestion[];
}

export const BRIEF_SECTIONS: BriefSection[] = [
  {
    id: 'negocio',
    title: 'Tu negocio',
    intro: 'Para entender qué vendes y a quién.',
    questions: [
      {
        id: 'vende',
        label: '¿Qué venden y de qué marcas?',
        help: 'Con una frase basta. Si son distribuidores, importadores o fabrican, cuéntanos.',
        kind: 'long',
        required: true,
        placeholder: 'Ej. Equipos de refrigeración comercial e industrial de varias marcas…',
      },
      {
        id: 'clientes',
        label: '¿Quién les compra?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        options: ['Hogares', 'Restaurantes y comercios', 'Empresas e industria', 'Otros distribuidores', 'Entidades o gobierno'],
      },
      {
        id: 'objetivo',
        label: '¿Qué esperan de la tienda?',
        kind: 'single',
        required: true,
        options: [
          'Vender con pago directo en la web',
          'Recibir solicitudes de cotización',
          'Las dos: algunos productos se compran y otros se cotizan',
        ],
      },
      {
        id: 'hoy',
        label: '¿Cómo venden hoy?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        options: ['Tienda o punto físico', 'WhatsApp', 'Catálogo en PDF', 'Una página web', 'Mercado Libre u otro marketplace', 'Redes sociales', 'Visitas comerciales'],
      },
    ],
  },
  {
    id: 'catalogo',
    title: 'Productos',
    intro: 'Esto define cuánto trabajo lleva la tienda.',
    questions: [
      {
        id: 'cuantos',
        label: '¿Cuántos productos tendrá la tienda?',
        kind: 'single',
        required: true,
        options: ['1 a 20', '21 a 50', '51 a 100', '101 a 500', 'Más de 500', 'No lo sé todavía'],
      },
      {
        id: 'variantes',
        label: '¿En qué se diferencian las versiones de un mismo producto?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        options: ['Capacidad o tamaño', 'Voltaje o potencia', 'Color o acabado', 'Marca o modelo', 'Talla', 'No hay versiones'],
      },
      {
        id: 'precios',
        label: '¿Cómo se manejan los precios?',
        kind: 'single',
        required: true,
        options: [
          'Un precio público para todos',
          'Precios distintos según el cliente o el volumen',
          'Casi todo se cotiza caso por caso',
        ],
      },
      {
        id: 'datos',
        label: '¿Dónde están los datos de los productos hoy?',
        kind: 'single',
        options: ['En una hoja de cálculo', 'En un sistema o programa de inventario', 'En catálogos en PDF', 'Sin organizar'],
      },
    ],
  },
  {
    id: 'ventas',
    title: 'Pagos, envíos y servicio',
    intro: 'Lo que pasa después de que alguien decide comprar.',
    questions: [
      {
        id: 'pagos',
        label: '¿Qué medios de pago necesitan?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        options: ['Tarjeta de crédito y débito', 'PSE', 'Transferencia', 'Financiación (Addi, Sistecrédito…)', 'Crédito a empresas', 'Contra entrega'],
      },
      {
        id: 'envios',
        label: '¿Cómo envían los productos grandes o pesados?',
        help: 'Transportadora, ciudades a las que llegan, cómo cobran el envío, si hay recogida en tienda.',
        kind: 'long',
      },
      {
        id: 'servicio',
        label: '¿Qué servicios acompañan la venta?',
        help: 'Marca todo lo que aplique.',
        kind: 'multi',
        options: ['Instalación', 'Puesta en marcha', 'Mantenimiento', 'Servicio técnico', 'Repuestos', 'Garantía del fabricante', 'Ninguno'],
      },
      {
        id: 'factura',
        label: '¿Facturan con factura electrónica?',
        kind: 'single',
        options: ['Sí', 'No', 'No estoy seguro'],
      },
      {
        id: 'programa',
        label: '¿Qué programa usan para facturar o llevar el inventario?',
        help: 'Por ejemplo Siigo, World Office u otro. Si ninguno, déjalo en blanco.',
        kind: 'text',
      },
    ],
  },
  {
    id: 'tienen',
    title: 'Lo que ya tienen',
    intro: 'Marca, contenido y presencia en internet.',
    questions: [
      {
        id: 'logo',
        label: '¿Cómo está su logo y su marca?',
        kind: 'single',
        required: true,
        options: [
          'Tenemos logo en vector y guía de marca',
          'Tenemos el logo en vector (AI, SVG o PDF)',
          'Solo tenemos el logo como imagen (JPG o PNG)',
          'No tenemos logo todavía',
        ],
      },
      {
        id: 'contenido',
        label: '¿Tienen fotos y fichas técnicas de los productos?',
        kind: 'single',
        required: true,
        options: [
          'Sí, de todos',
          'De una parte',
          'No, necesitamos ayuda con fotos y textos',
        ],
      },
      {
        id: 'dominio',
        label: '¿Tienen dominio y página web?',
        kind: 'single',
        options: ['Tenemos dominio y página', 'Solo el dominio', 'Ninguno'],
      },
      {
        id: 'web',
        label: 'Si ya tienen página o tienda, ¿cuál es?',
        kind: 'text',
        placeholder: 'Enlace',
      },
      {
        id: 'archivos',
        label: '¿Tienen una carpeta con el logo, fotos y catálogos?',
        help: 'Pega el enlace de Drive, Dropbox o WeTransfer. Si no, la pedimos después.',
        kind: 'text',
        placeholder: 'Enlace',
      },
    ],
  },
  {
    id: 'tiempo',
    title: 'Tiempo y presupuesto',
    intro: 'Para proponerte algo que sí te quepa.',
    questions: [
      {
        id: 'cuando',
        label: '¿Para cuándo necesitan estar vendiendo?',
        kind: 'single',
        required: true,
        options: ['Lo antes posible', 'En 1 o 2 meses', 'En 3 meses o más', 'No hay fecha'],
      },
      {
        id: 'presupuesto',
        label: '¿Qué presupuesto tienen en mente?',
        help: 'Es para ajustar la propuesta, no para fijar el precio.',
        kind: 'single',
        options: ['Menos de $3.000.000', '$3.000.000 a $6.000.000', '$6.000.000 a $10.000.000', 'Más de $10.000.000', 'No lo sé, necesito orientación'],
      },
      {
        id: 'soporte',
        label: '¿Les interesa soporte mensual después del lanzamiento?',
        kind: 'single',
        options: ['Sí', 'No', 'No estoy seguro'],
      },
      {
        id: 'notas',
        label: '¿Algo más que debamos saber?',
        help: 'Referencias de otras páginas que les gusten, dudas, lo que sea.',
        kind: 'long',
      },
    ],
  },
];

export type BriefAnswer = string | string[];
export type BriefAnswers = Record<string, BriefAnswer>;

export interface BriefContact {
  name: string;
  email: string;
  phone: string;
  company: string;
}

export const answerKey = (section: string, id: string) => `${section}.${id}`;

export const isAnswered = (v: BriefAnswer | undefined) =>
  Array.isArray(v) ? v.length > 0 : (v ?? '').trim() !== '';

/** Texto del correo que recibe Out: una línea por pregunta contestada. */
export function buildBriefText(contact: BriefContact, answers: BriefAnswers): string {
  const lines: string[] = [
    '=== BRIEF DE TIENDA ONLINE ===',
    '',
    `Nombre: ${contact.name}`,
    `Empresa o marca: ${contact.company || '—'}`,
    `Correo: ${contact.email}`,
    `WhatsApp: ${contact.phone || '—'}`,
  ];
  for (const s of BRIEF_SECTIONS) {
    lines.push('', `--- ${s.title.toUpperCase()} ---`);
    for (const q of s.questions) {
      const v = answers[answerKey(s.id, q.id)];
      const txt = Array.isArray(v) ? v.join(', ') : (v ?? '').trim();
      lines.push(`${q.label}\n  → ${txt || '(sin responder)'}`);
    }
  }
  return lines.join('\n');
}
