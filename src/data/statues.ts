/*
  Imágenes de estatuaria clásica (griega/antigua) para el tratamiento
  editorial en dúotono.

  NOTA: estas URLs de Unsplash no pudieron verificarse desde el entorno de
  build (la red de la sesión bloquea unsplash.com). En un navegador real
  cargan; si alguna diera 404, la imagen degrada a un panel azul Klein con
  la retícula de puntos (siempre on-brand). Para cambiarlas, busca en
  https://unsplash.com/s/photos/greek-statue , abre la foto, botón derecho
  "Copiar dirección de imagen" y pega aquí la URL de images.unsplash.com.
*/

const UNSPLASH = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const STATUES = {
  hero: UNSPLASH('photo-1608376630927-31d5d2e0d0f8', 1600),
  services: UNSPLASH('photo-1568480289356-5a75d0fd47fc', 1200),
  about: UNSPLASH('photo-1599110364868-364e4d0c9e0d', 1200),
  contact: UNSPLASH('photo-1605218427368-5a8e0f0e5a4f', 1400),
} as const;
