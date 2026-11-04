# Formulario de Habla Deportes

- **Página:** `/habla-deportes/preguntas/` (`habla-deportes/preguntas/index.html`, `src/pages/HablaDeportesPage.tsx`, preguntas en `src/data/habla-deportes.ts`). Sin indexar (meta `noindex`, `robots.txt`), fuera del menú y del sitemap.
- **Envío:** el navegador manda el JSON a `QUOTE_WORKER_URL` (el Worker de Cloudflare `worker/cotizaciones.js`) con `form: 'habla-deportes'`. El Worker valida, limpia, arma el correo en texto y lo envía con Resend, en texto y con un **PDF adjunto** con el estilo de las cotizaciones de Out (lo arma el propio Worker, sin dependencias: cabecera azul con el logo, tarjeta de datos y preguntas numeradas; si falla, el correo sale igual sin adjunto). En el navegador no hay claves ni el correo de destino.
- **Worker:** hay que **volver a pegar `worker/cotizaciones.js` en Cloudflare** (Workers & Pages, el Worker, Edit code) para que acepte este formulario. No hay que crear variables nuevas: usa `RESEND_API_KEY`, `FROM` y `REPLY_TO` (o `FORM_TO` si se quiere otro destinatario). `RATE_KV` es opcional.
- **Versión:** el cuestionario tiene versión (`HD_VERSION`, ahora 2) en la página y en el Worker. Si no coinciden, el Worker responde 409 y la página pide recargar. Al cambiar preguntas: subir la versión en los dos archivos y **volver a pegar el Worker antes de publicar la página**.
- **Antes de usarlo en el Worker:** los títulos y topes de las preguntas están repetidos en el Worker (`HD_QUESTIONS`). Si se cambia una pregunta en `habla-deportes.ts`, cambiarla también ahí.
- **Prueba real desde la terminal** (con el Worker ya publicado):

```
curl -s -X POST https://out-cotizaciones.oscar-diaz-dc0.workers.dev/ \
  -H 'Origin: https://outstudio.online' -H 'Content-Type: application/json' \
  -d '{"form":"habla-deportes","v":2,"id":"prueba1","nombre":"Prueba","contacto":"","hp":"","answers":{"4":{"sel":["Sí"],"extra":"Prueba"}}}'
```
