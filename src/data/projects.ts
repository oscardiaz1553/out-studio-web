// Fuente única de proyectos, compartida por el home (muestra destacada) y la
// página /proyectos (catálogo filtrable). Cada proyecto se clasifica por tipo
// para poder filtrarlo.

// Los tipos de proyecto de Out. Se alinean con los servicios de la marca.
export const PROJECT_TYPES = ['Web', 'Design', 'Brand'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export type ProjectStatus = 'launched' | 'in-progress';

export interface Project {
  number: string;
  name: string;
  /** Tipo para clasificar y filtrar. */
  type: ProjectType;
  /** launched = ya está en línea. in-progress = seguimos construyéndolo. */
  status: ProjectStatus;
  /** Una línea de contexto para las tarjetas del catálogo. */
  summary: string;
  /**
   * Capturas reales. Mientras no las tengamos, se omiten y las tarjetas
   * muestran un placeholder de marca (ver ProjectMedia) en vez de fotos de
   * stock que no corresponden al cliente real.
   */
  leftImages?: [string, string];
  rightImage?: string;
  url?: string;
  /** true = aparece en la muestra destacada del home. */
  featured?: boolean;
  /** true = lleva la etiqueta "New" (proyecto recién publicado). */
  isNew?: boolean;
  /** true = proyecto hecho en colaboración (no es un proyecto propio de Out). */
  collab?: boolean;
}

// El lockup de marca que se muestra en cada tarjeta: Out.Web, Out.Design…
export function categoryLabel(type: ProjectType): string {
  return `Out.${type}`;
}

/**
 * Interruptor de las seis tiendas nuevas (Rugs N Home, Eticolor, Maison Caviar,
 * The Black Box Snack, Osere y Daza Organic). En `false` desaparecen de
 * Proyectos sin borrar nada: `node scripts/tiendas-nuevas.mjs off|on`.
 */
const SHOW_NEW_STORES = true;

// Tiendas online hechas en colaboración (los proyectos propios de Out son BARCI y Diario Deportes).
// La plataforma de cada una no está confirmada: no se nombra en la descripción.
const NEW_STORES: Project[] = [
  ['Rugs N Home', 'https://rugsnhome.mx'],
  ['Eticolor', 'https://eticolor.com.co'],
  ['Maison Caviar', 'https://maisoncaviar.com.co'],
  ['The Black Box Snack', 'https://theblackboxsnack.com'],
  ['Osere', 'https://osere.co'],
  ['Daza Organic', 'https://dazaorganic.com'],
].map(
  ([name, url], i): Project => ({
    number: String(i + 3).padStart(2, '0'),
    name,
    type: 'Web',
    status: 'launched',
    summary: 'Tienda online desarrollada en colaboración, lista para vender.',
    url,
    collab: true,
  }),
);

export const PROJECTS: Project[] = [
  {
    number: '01',
    name: 'Diario Deportes',
    type: 'Web',
    status: 'launched',
    summary: 'Rediseño y desarrollo completo de un medio deportivo digital.',
    url: 'https://diariodeportes.com.co',
    featured: true,
    isNew: true,
  },
  {
    number: '02',
    name: 'BARCI',
    type: 'Web',
    status: 'launched',
    summary: 'Tienda Shopify lista para vender en línea desde el día uno.',
    url: 'https://barci.com.co',
    featured: true,
  },
  ...(SHOW_NEW_STORES ? NEW_STORES : []),
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
