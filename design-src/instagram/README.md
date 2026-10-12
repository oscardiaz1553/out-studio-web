# Instagram

Piezas para Instagram, armadas con el material de la marca (Bricolage e
Instrument Sans, láminas, símbolos, azulejo y Mango) y renderizadas con
Playwright a 1080 × 1350 (carrusel) o 1080 × 1920 (reel e historias).

Cada lote tiene su script y su carpeta:

- `lote-1.cjs` → `lote-1/`: carrusel de 3 errores de tiendas online, carrusel
  de Out Emprende y portada del reel de Diario Deportes. Textos en
  `lote-1/textos.md`.

Para regenerar: `node design-src/instagram/lote-1.cjs`.

Reglas: sin emojis en las piezas (salvo 🥭 de Mango), sin numerar láminas
(el avance va con puntos), y el texto de cada botón toma el color del fondo
donde está.
