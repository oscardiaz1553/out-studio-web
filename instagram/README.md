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
- `scripts/lote-1.cjs` a `scripts/lote-3.cjs`: un script por lote.
- `hyperframes/`: los reels animados, hechos con [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML + GSAP). Cada carpeta es un proyecto: `index.html` es el video. Para volver a renderizarlo, desde su carpeta: `npx hyperframes@0.8.150 render -q high -o reel.mp4` (pide Node 22 y FFmpeg). Toman como referencia la intro del sitio (`public/intro/index.html`): cámara con zoom y giro, anillos que se expanden en los impactos, barrido circular de color, líneas de velocidad y los símbolos [ ] { } < >. La sacudida de pantalla se usa solo en uno o dos golpes grandes por reel, no en cada entrada.
  - `reel-senales/`: reel del lote 3.
  - `reel-diario-deportes/`: reel del lote 1, con capturas reales del sitio antes y después.

Para regenerar un lote: `node instagram/scripts/lote-2.cjs`.

## Reglas

- Sin emojis en las piezas, salvo 🥭 de Mango.
- Sin numerar las láminas: el avance va con puntos.
- El texto de cada botón toma el color del fondo donde está.
- Nada de rosado ni azul claro.
