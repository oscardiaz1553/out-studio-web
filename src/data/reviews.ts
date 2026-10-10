// Reseñas publicadas en la web. Llegan por el formulario de la sección (al
// correo de Out) y, una vez aprobadas, se agregan aquí.
export interface Review {
  quote: string;
  name: string;
  /** Cargo y/o empresa. */
  role?: string;
  /** 1 a 5 */
  rating?: number;
}

export const REVIEWS: Review[] = [];

// Reseñas de EJEMPLO, sólo para ver el diseño. Son ficticias y no se muestran
// al público: únicamente aparecen al abrir la web con ?resenas=demo. Cuando
// haya reseñas reales en REVIEWS, esto no se usa.
export const DEMO_REVIEWS: Review[] = [
  {
    quote:
      'Teníamos una tienda lenta y confusa. En pocas semanas quedó rápida, clara y con los pagos funcionando. Se nota que cada detalle está pensado para vender.',
    name: 'Nombre de ejemplo',
    role: 'Fundadora, Marca de ejemplo',
    rating: 5,
  },
  {
    quote:
      'Nos escucharon antes de diseñar y no nos dieron una plantilla. El resultado se ve distinto a todo lo que hay en nuestro sector.',
    name: 'Nombre de ejemplo',
    role: 'Director de marketing, Empresa de ejemplo',
    rating: 5,
  },
  {
    quote:
      'Lo mejor fue el acompañamiento después del lanzamiento: respondieron rápido cada ajuste y siguieron mejorando el sitio.',
    name: 'Nombre de ejemplo',
    role: 'Gerente, Negocio de ejemplo',
    rating: 5,
  },
];
