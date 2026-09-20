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
}

// El lockup de marca que se muestra en cada tarjeta: Out.Web, Out.Design…
export function categoryLabel(type: ProjectType): string {
  return `Out.${type}`;
}

export const PROJECTS: Project[] = [
  {
    number: '01',
    name: 'BARCI',
    type: 'Web',
    status: 'launched',
    summary: 'Tienda Shopify lista para vender en línea desde el día uno.',
    url: 'https://barci.com.co',
    featured: true,
  },
  {
    number: '02',
    name: 'Diario Deportes',
    type: 'Web',
    status: 'in-progress',
    summary: 'Rediseño y desarrollo completo de un medio deportivo digital.',
    url: 'https://diariodeportes.com.co',
    featured: true,
  },
  {
    number: '03',
    name: 'Rugs N Home',
    type: 'Web',
    status: 'in-progress',
    summary:
      'Tienda en línea para una marca de alfombras y decoración para el hogar.',
    url: 'https://rugsnhome.mx',
  },
  {
    number: '04',
    name: 'Eticolor',
    type: 'Web',
    status: 'launched',
    summary: 'Sitio web para Eticolor, en línea y funcionando.',
    url: 'https://eticolor.com',
    featured: true,
  },
  {
    number: '05',
    name: 'Habla Deportes',
    type: 'Web',
    status: 'in-progress',
    summary:
      'Rediseño completo de un medio de fútbol colombiano: video, radio y marca propia.',
    url: 'https://habladeportes.co',
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
