/*
  La ilustración botánica (florales azules = el sistema, fruta naranja = lo
  que se sale). Coloca el archivo en `public/botanica.png` y aquí se resuelve
  solo. Si el archivo no existe todavía, cada uso degrada a un panel Klein
  on-brand (nada se ve roto).

  Para subirla: GitHub → carpeta public/ → Add file → Upload files →
  renómbrala "botanica.png" → commit. El deploy la publica automáticamente.
*/
export const BOTANICA = `${import.meta.env.BASE_URL}botanica.png`;

/*
  Segunda lámina botánica: los mangos fugados (el naranja que se sale del
  sistema azul). Se usa para que el sitio no dependa de una sola imagen y
  cada plancha editorial tenga su propio motivo. Misma degradación on-brand
  si el archivo no existe.
*/
export const MANGOS = `${import.meta.env.BASE_URL}mangos_out.png`;
