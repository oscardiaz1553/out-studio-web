// Reseñas publicadas en la web. Llegan por el formulario de la sección (al
// correo de Out) y, una vez aprobadas, se agregan aquí.
export interface Review {
  quote: string;
  name: string;
  /** Cargo y/o empresa. */
  role?: string;
  /** 1 a 5 */
  rating?: number;
  /** Foto de perfil (ruta en public/). Si falta, se muestra la inicial. */
  avatar?: string;
}

/** Testimonio en video (va de primero en el carrusel de reseñas). */
export const VIDEO_TESTIMONIAL = {
  src: 'resenas/hugo-illera-diario-deportes.mp4',
  poster: 'resenas/hugo-illera-diario-deportes.webp',
  name: 'Hugo Illera',
  role: 'Director de Diario Deportes',
  label: 'Testimonio en video',
};

export const REVIEWS: Review[] = [
  {
    quote:
      'Excelente experiencia. Se mostraron atentos y respondieron a la altura a las peticiones, sugerencias. Receptivos en pos del objetivo final. Demasiado satisfechos con el resultado obtenido',
    name: 'Lizeth Torres',
    role: 'Editora digital, Diario Deportes',
    rating: 5,
  },
  {
    quote:
      'Gran experiencia, propone ideas y siempre está atento a lo que el cliente necesita. Además de la calidez humana del equipo que hace sentir cómodo al cliente. La página quedó espectacular y lo recomendamos a ojo cerrado',
    name: 'Diar10 Deportes',
    role: 'Diario deportivo de Barranquilla',
    rating: 5,
    avatar: 'resenas/diario-deportes.webp',
  },
];

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
