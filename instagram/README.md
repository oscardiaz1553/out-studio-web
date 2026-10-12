# Instagram

Todo el material de Instagram de Out: piezas listas para subir, textos para
cada publicación y los scripts que las generan.

## Lotes

| Lote | Contenido | Carpeta |
|---|---|---|
| Lote 1 | Carrusel "3 errores que frenan tu tienda online", reel de Diario Deportes (video y portada), carrusel de Out Emprende | `lote-1/` |
| Lote 2 | Carrusel "¿Shopify, WordPress o landing page?", carrusel "Antes de pedir tu página web, ten esto listo", publicación e historia de Mango | `lote-2/` |
| Lote 3 | Carrusel "¿De qué depende el precio de una página web?", reel "3 señales de que tu página necesita un rediseño" (video y portada), carrusel "Así trabajamos" | `lote-3/` |

Cada carpeta tiene un `textos.md` con el calendario sugerido, el texto de
cada publicación, los hashtags y el texto alternativo.

## Cómo se generan

Las piezas se arman con el material de la marca (Bricolage e Instrument Sans,
símbolos, azulejo y Mango) y se renderizan con Playwright: 1080 × 1350 para
carruseles y publicaciones, 1080 × 1920 para reels e historias.

- `scripts/kit.cjs`: lo compartido (fuentes, colores, logo, símbolos, imágenes y el render).
- `scripts/lote-1.cjs` a `scripts/lote-3.cjs`: un script por lote. Los reels animados se arman con ffmpeg desde sus láminas.

Para regenerar un lote: `node instagram/scripts/lote-2.cjs`.

## Reglas

- Sin emojis en las piezas, salvo 🥭 de Mango.
- Sin numerar las láminas: el avance va con puntos.
- El texto de cada botón toma el color del fondo donde está.
- Nada de rosado ni azul claro.
