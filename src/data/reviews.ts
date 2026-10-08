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
