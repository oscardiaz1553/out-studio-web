// Cuestionario de Habla Deportes (medio deportivo de Barranquilla) para saber
// qué quiere en su nueva web. Vive en /habla-deportes/preguntas/, sin indexar.
// Las respuestas viajan al Worker (worker/cotizaciones.js), que arma y envía el
// correo: en el navegador no hay claves ni el correo de destino.
// ⚠️ Los títulos y los topes de cada pregunta también están en el Worker (para
// validar y armar el correo): si cambias algo aquí, cámbialo allá.

export type HdKind = 'multi' | 'uno' | 'orden' | 'texto';

export interface HdQuestion {
  n: number;
  text: string;
  kind: HdKind;
  options?: string[];
  /** Tope de opciones (multi y orden). */
  max?: number;
  /** Agrega «Otro» con un campo de texto opcional. */
  otro?: boolean;
  /** Campo de texto extra debajo de las opciones. */
  extra?: string;
  priority?: boolean;
  help?: string;
  placeholder?: string;
}

export interface HdSection {
  id: string;
  title: string;
  questions: HdQuestion[];
}

export const HD_SECTIONS: HdSection[] = [
  {
    id: 'primeros',
    title: 'Los primeros pasos',
    questions: [
      {
        n: 1, priority: true, kind: 'multi', max: 2, otro: true,
        text: '¿Qué quieres que haga la gente al entrar a la web?',
        options: ['Ver videos', 'Leer noticias', 'Escuchar la radio', 'Ver resultados y tablas', 'Seguirlos en redes'],
      },
      {
        n: 2, priority: true, kind: 'orden', max: 3,
        text: '¿Qué es lo más importante para ti?',
        help: 'Toca en orden, primero el más importante.',
        options: ['Videos del programa', 'Clips cortos (Shorts)', 'Noticias escritas', 'Radio en vivo', 'Resultados y datos', 'Opinión'],
      },
      {
        n: 3, kind: 'uno', otro: true,
        text: '¿La web será sobre todo de video, o también publicarán notas escritas?',
        options: ['Sobre todo video', 'Video y notas', 'Sobre todo notas'],
        extra: 'Si publican notas, ¿quién las escribe?',
      },
    ],
  },
  {
    id: 'enfoque',
    title: 'Enfoque',
    questions: [
      {
        n: 4, kind: 'uno', otro: true,
        text: '¿Sobre qué equipos es la web?',
        options: ['Solo Junior y la Selección', 'Más Junior que todos los demás', 'Todos los equipos por igual'],
      },
      {
        n: 5, kind: 'uno',
        text: '¿Quieren resultados y tabla de posiciones en la web?',
        options: ['Sí', 'No', 'No sé'],
        extra: '¿Tienen proveedor de datos, como Data Factory?',
      },
    ],
  },
  {
    id: 'redes',
    title: 'Redes y talento',
    questions: [
      {
        n: 6, kind: 'multi', otro: true,
        text: '¿Qué redes usan más?',
        options: ['YouTube', 'Instagram', 'X', 'TikTok', 'WhatsApp', 'Facebook'],
      },
      {
        n: 7, kind: 'uno',
        text: '¿Juan Salvador debe tener su propio espacio en la web, con sus videos y sus publicaciones de X?',
        options: ['Sí', 'No', 'No sé'],
      },
      {
        n: 8, kind: 'uno',
        text: '¿Quieren reproductor de radio en vivo en la web?',
        options: ['Sí', 'No', 'Más adelante'],
        extra: 'Enlace de la transmisión, si lo tienen',
      },
    ],
  },
  {
    id: 'patrocinadores',
    title: 'Patrocinadores',
    questions: [
      {
        n: 9, priority: true, kind: 'texto',
        text: '¿Quiénes son sus patrocinadores hoy?',
        help: 'Un nombre por línea.',
        placeholder: 'Un nombre por línea',
      },
      {
        n: 10, kind: 'multi', otro: true,
        text: '¿Dónde quieren que se vean?',
        options: ['En el encabezado', 'Banners en la portada', 'Dentro de las secciones', 'En videos y radio', 'No sé'],
      },
      {
        n: 11, kind: 'uno',
        text: '¿Venden publicidad en la web, o solo patrocinios fijos?',
        options: ['Publicidad (banners)', 'Solo patrocinios fijos', 'Las dos', 'No sé'],
        extra: '¿Algún tipo de patrocinador que NO quieran mostrar?',
      },
    ],
  },
  {
    id: 'estilo',
    title: 'Estilo',
    questions: [
      {
        n: 12, priority: true, kind: 'texto',
        text: 'Nombra 3 sitios de deportes que te gusten y 1 que no. ¿Qué te gusta de cada uno?',
        help: 'Si puedes, pega los enlaces.',
        placeholder: 'Nombre o enlace, y qué te gusta',
      },
      {
        n: 13, kind: 'multi', max: 2, otro: true,
        text: '¿Cómo quieres que se sienta la web?',
        options: ['Seria', 'Cercana', 'Juvenil', 'De barrio', 'Moderna'],
      },
      {
        n: 14, kind: 'uno',
        text: '¿Mantienen el azul del logo?',
        options: ['Sí, el azul', 'Quieren cambiarlo', 'No sé'],
        extra: '¿Tienen manual de marca?',
      },
    ],
  },
  {
    id: 'operacion',
    title: 'Operación',
    questions: [
      {
        n: 15, kind: 'texto',
        text: '¿Quién va a actualizar la web y cuántas veces al día?',
        placeholder: 'Ej.: dos personas, unas 4 veces al día',
      },
      {
        n: 16, kind: 'uno',
        text: '¿Para cuándo la quieren lista?',
        options: ['Este mes', 'En 1 o 2 meses', 'En 3 meses o más', 'Sin prisa'],
      },
    ],
  },
  {
    id: 'material',
    title: 'Material',
    questions: [
      {
        n: 17, kind: 'multi', otro: true,
        text: '¿Qué nos pueden enviar?',
        options: ['Logos en buena calidad', 'Fotos del programa y el estudio', 'Manual de marca', 'Acceso a YouTube y redes'],
      },
    ],
  },
];

export const HD_QUESTIONS = HD_SECTIONS.flatMap((s) => s.questions);
export const HD_TOTAL = HD_QUESTIONS.length;

/** Lo que se guarda por pregunta. */
export interface HdAnswer {
  /** Opciones elegidas (en «orden», en el orden en que se tocaron). */
  sel?: string[];
  /** Texto de «Otro» (solo si «Otro» está elegido). */
  otro?: string;
  /** Texto del campo extra. */
  extra?: string;
  /** Respuesta abierta. */
  texto?: string;
}
export type HdAnswers = Record<number, HdAnswer>;

export const OTRO = 'Otro';

export const hdHasAnswer = (q: HdQuestion, a: HdAnswer | undefined) => {
  if (!a) return false;
  if (q.kind === 'texto') return (a.texto ?? '').trim() !== '';
  return (a.sel?.length ?? 0) > 0 || (a.extra ?? '').trim() !== '';
};
