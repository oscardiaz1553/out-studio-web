# Out Studio: guía para trabajar en este repositorio

Dueño: Oscar Díaz (Out Studio, Colombia). Escribirle en español de Colombia, de tú, claro y corto. Decirle la verdad:
si algo falló o no se pudo probar, decirlo. No afirmar que algo funciona sin haberlo probado.

## Qué hay aquí
- **Sitio web** (outstudio.online): React + Vite + Tailwind, multipágina, en GitHub Pages. Código en `src/`, páginas HTML en la raíz y en `servicios/`, `blog/`, `habla-deportes/`. Marca en `BRAND.md` (azul klein, sin negro ni blanco puro).
- **Instagram** (`instagram/`): reels, carruseles y portadas. Mango (la mascota) se anima en 2D con la skill `reel-con-mango` (`.claude/skills/`). Series: `instagram/serie-consejos.md`, `serie-situaciones.md`.
- **Clientes y cotizaciones** (`docs/clientes/`): Termo Tech (escribirlo con espacio), BARCI, Habla Deportes.
- **Formularios que envían correo:** `brief.html` (brief de tienda, `?c=Empresa`) y `habla-deportes/preguntas/`. Envían al Worker de Cloudflare (`worker/cotizaciones.js`) que manda el correo con Resend. No hay claves ni correos de destino en el navegador. Detalle: `docs/habla-deportes-formulario.md`.
- **Cotizador interno:** `cotizar.html` genera el PDF de cotización (dossier con Mango). Se usa abriéndolo con el brief cargado o a mano.

## Comandos
- `npm install` una vez. `npm run dev` para ver el sitio. `npm run build` (compila, genera sitemap y contenido estático; necesita Chromium de Playwright: `npx playwright install chromium`).
- `npm run seo:pages` regenera las páginas estáticas tras cambiar `services.json`, `projects.ts`, el blog, etc.
- Instagram: ver `docs/trabajar-en-mac.md` y la skill `reel-con-mango` (`references/pipeline.md`). Los scripts usan el Chromium de Playwright (o `CHROMIUM_PATH`).

## Publicar
- Se trabaja en la rama `desarrollo`. Publicar = pasar a `main` sin commit de merge y subir: `git checkout main && git merge --ff-only desarrollo && git push origin main && git checkout desarrollo`. GitHub Actions despliega en unos 2 a 4 minutos (la caché del sitio dura hasta 10).
- **Publicar solo cuando Oscar lo pide o lo confirma.** Después de publicar, comprobar la página real en un navegador.
- Las tiendas nuevas de Proyectos se activan y quitan con la skill `tiendas-nuevas`.
- **El Worker no se despliega con git:** Oscar pega `worker/cotizaciones.js` en Cloudflare (Workers & Pages, `out-cotizaciones`, Edit code, Deploy). Las claves (`RESEND_API_KEY`, `SEND_PASSPHRASE`) viven allá, nunca en el repo. Si cambia el cuestionario de Habla Deportes: subir `HD_VERSION` en `src/data/habla-deportes.ts` y en el Worker, y desplegar el Worker antes de publicar la página.

## Reglas de estilo y de trabajo
- Sin emojis. Sin pastel rosado ni azul claro. Los números de lista no se enumeran en los rótulos de las piezas. El texto de un botón lleva el color del fondo donde está.
- Mango: a 2s, ojos siempre visibles, boca cerrada si no habla, sin squash and stretch, el narrador dice todo (la voz de Mango suena infantil). Cámara: menos es más. Todo el mundo de las situaciones se dibuja con código; Mango es el único cutout. Reglas completas en la skill `reel-con-mango`.
- Voces de ElevenLabs: las genera Oscar; para publicar hace falta que su plan tenga licencia comercial. Nunca pedir ni usar sus cuentas ni claves.
- No inventar cifras ni resultados (por ejemplo ventas de un cliente). Las fotos y marcas de clientes solo con su permiso.
- Probar antes de decir que está listo: capturas en celular y escritorio, y prueba de los formularios (con el envío simulado si no se debe mandar un correo real).

## Estado (nov 2026)
- Publicado: reel «La espera», caso BARCI (carrusel y reel), brief de tienda, formulario de Habla Deportes (15 preguntas, con PDF adjunto).
- Pendiente: respuestas de Habla Deportes y su propuesta; enviar la cotización de Termo Tech ($2.500.000 en Shopify, personalizar con el nombre del contacto); reel «Tres pruebas gratis» (escena lista en `instagram/mango2d/reel-pruebas.html`, falta la voz del narrador: `instagram/voces/pruebas-narrador.mp3`); borradores `instagram/lote-5` y `lote-6`.
