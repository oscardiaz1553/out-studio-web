// Fuente única de proyectos, compartida por el home (muestra destacada) y la
// página /proyectos (catálogo filtrable). Cada proyecto se clasifica por tipo
// para poder filtrarlo.

// Los tipos de proyecto de Out. Se alinean con los servicios de la marca.
export const PROJECT_TYPES = ['Web', 'Design', 'Brand'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface Project {
  number: string;
  name: string;
  /** Tipo para clasificar y filtrar. */
  type: ProjectType;
  /** Una línea de contexto para las tarjetas del catálogo. */
  summary: string;
  leftImages: [string, string];
  rightImage: string;
  url?: string;
  /** true = aparece en la muestra destacada del home. */
  featured?: boolean;
}

// El lockup de marca que se muestra en cada tarjeta: Out.Web, Out.Design…
export function categoryLabel(type: ProjectType): string {
  return `Out.${type}`;
}

// CASOS DE PRUEBA para visualizar el sistema. Reemplazar con los reales;
// con el array vacío, tanto el home como la página muestran "Próximamente".
export const PROJECTS: Project[] = [
  {
    number: '01',
    name: 'Andina Café',
    type: 'Brand',
    summary: 'Identidad y voz para una tostadora de café de origen.',
    leftImages: [
      'https://picsum.photos/seed/out-andina-detalle/900/560',
      'https://picsum.photos/seed/out-andina-producto/900/760',
    ],
    rightImage: 'https://picsum.photos/seed/out-andina-hero/1000/1300',
    url: '#',
    featured: true,
  },
  {
    number: '02',
    name: 'Nórdica Estudio',
    type: 'Design',
    summary: 'Sistema visual y editorial para un estudio de arquitectura.',
    leftImages: [
      'https://picsum.photos/seed/out-nordica-marca/900/560',
      'https://picsum.photos/seed/out-nordica-papeleria/900/760',
    ],
    rightImage: 'https://picsum.photos/seed/out-nordica-hero/1000/1300',
    url: '#',
    featured: true,
  },
  {
    number: '03',
    name: 'Kiro App',
    type: 'Web',
    summary: 'Producto y sitio para una app de hábitos.',
    leftImages: [
      'https://picsum.photos/seed/out-kiro-pantallas/900/560',
      'https://picsum.photos/seed/out-kiro-flujo/900/760',
    ],
    rightImage: 'https://picsum.photos/seed/out-kiro-hero/1000/1300',
    url: '#',
    featured: true,
  },
  {
    number: '04',
    name: 'Mesa Chica',
    type: 'Web',
    summary: 'Sitio y reservas para un restaurante de autor.',
    leftImages: [
      'https://picsum.photos/seed/out-mesa-menu/900/560',
      'https://picsum.photos/seed/out-mesa-salon/900/760',
    ],
    rightImage: 'https://picsum.photos/seed/out-mesa-hero/1000/1300',
    url: '#',
  },
  {
    number: '05',
    name: 'Herbario',
    type: 'Design',
    summary: 'Dirección de arte y packaging para una marca botánica.',
    leftImages: [
      'https://picsum.photos/seed/out-herbario-etiqueta/900/560',
      'https://picsum.photos/seed/out-herbario-lamina/900/760',
    ],
    rightImage: 'https://picsum.photos/seed/out-herbario-hero/1000/1300',
    url: '#',
  },
  {
    number: '06',
    name: 'Faro Náutico',
    type: 'Brand',
    summary: 'Naming y posicionamiento para una marca costera.',
    leftImages: [
      'https://picsum.photos/seed/out-faro-simbolo/900/560',
      'https://picsum.photos/seed/out-faro-aplicacion/900/760',
    ],
    rightImage: 'https://picsum.photos/seed/out-faro-hero/1000/1300',
    url: '#',
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
