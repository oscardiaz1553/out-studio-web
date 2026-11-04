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
  /** Guía con recomendaciones que se muestra bajo la pregunta. */
  guide?: { title: string; rows: { place: string; desktop: string; mobile: string }[]; notes: string[] };
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
    ],
  },
  {
    id: 'enfoque',
    title: 'Enfoque',
    questions: [
      {
        n: 3, kind: 'texto',
        text: 'Aparte de Junior, ¿de qué otros equipos van a publicar noticias?',
        help: 'Escribe los que se te ocurran, uno por línea.',
        placeholder: 'Ej.: Selección Colombia',
      },
      {
        n: 4, kind: 'uno',
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
        n: 5, kind: 'multi', otro: true,
        text: '¿Qué redes usan más?',
        options: ['YouTube', 'Instagram', 'X', 'TikTok', 'WhatsApp', 'Facebook'],
      },
      {
        n: 6, kind: 'uno',
        text: '¿Juan Salvador debe tener su propio espacio en la web, con sus videos y sus publicaciones de X?',
        options: ['Sí', 'No', 'No sé'],
      },
      {
        n: 7, kind: 'uno',
        text: '¿Quieren que la transmisión del programa en YouTube se vea dentro de la web?',
        help: 'El programa se transmite por YouTube. Aquí se vería el mismo video, sin salir de la web.',
        options: ['Sí', 'No', 'Más adelante'],
        extra: 'Enlace de su canal o de la transmisión en YouTube',
      },
    ],
  },
  {
    id: 'patrocinadores',
    title: 'Patrocinadores',
    questions: [
      {
        n: 8, priority: true, kind: 'texto',
        text: '¿Quiénes son sus patrocinadores hoy?',
        help: 'Un nombre por línea.',
        placeholder: 'Un nombre por línea',
      },
      {
        n: 9, kind: 'multi', otro: true,
        text: '¿Dónde quieren que se vean?',
        options: ['En el encabezado', 'Banners en la portada', 'Dentro de las secciones', 'En videos y radio', 'No sé'],
      },
      {
        n: 10, kind: 'uno',
        text: '¿Quién va a cambiar las imágenes o GIFs de los patrocinadores dentro de la web?',
        help: 'Podrías hacerlo tú mismo desde un panel, sin pedirle nada a nadie.',
        options: ['Nosotros mismos, desde un panel', 'Se las enviamos a Out y Out las cambia', 'No sé'],
        extra: '¿Cada cuánto cambian las imágenes o GIFs?',
        guide: {
          title: 'Tamaños recomendados para las imágenes',
          rows: [
            { place: 'Encabezado (franja de arriba)', desktop: '728 × 90 px', mobile: '320 × 50 px' },
            { place: 'Banner grande en la portada', desktop: '970 × 250 px', mobile: '320 × 100 px' },
            { place: 'Cuadro dentro de las secciones', desktop: '300 × 250 px', mobile: '300 × 250 px' },
            { place: 'Lateral largo', desktop: '300 × 600 px', mobile: 'No se muestra en celular' },
          ],
          notes: [
            'Entrega cada imagen al doble de tamaño para que se vea nítida. Por ejemplo, 1456 × 180 px para la de 728 × 90.',
            'Formatos: JPG, PNG, WebP o GIF. Peso: hasta 150 KB cada imagen y hasta 500 KB cada GIF.',
            'Deja un margen en los bordes para que no se corte el texto en pantallas más pequeñas.',
          ],
        },
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
        n: 14, kind: 'multi', otro: true,
        text: '¿Qué material visual de la marca tienen?',
        help: 'Marca todo lo que ya exista.',
        options: ['Manual de marca', 'Logo en alta calidad', 'Colores y tipografías definidos', 'Fotos del programa y del estudio', 'Gráficos del programa (cortinillas, fondos)', 'Todavía no tenemos nada'],
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
    ],
  },
];

/** Versión del cuestionario: el Worker la compara para no mezclar preguntas de versiones distintas. */
export const HD_VERSION = 2;

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
