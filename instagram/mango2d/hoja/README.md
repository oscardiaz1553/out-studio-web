# Hoja de exposición de Mango

Editor publicado como artefacto (privado): https://claude.ai/artifact/PsAGC5WTjJfRQvm45LAKzg

- `index.html` es la página. Las imágenes (a la mitad de tamaño) y el audio se publican junto a ella.
- Las claves se guardan en la base de datos del artefacto, documento `hojas/venta-perdida`:
  `{ fps: 24, bocas: { "<cuadro>": "<boca>" }, ojos: { "<cuadro>": "<expresión>" } }`.
  Cada clave se mantiene hasta la siguiente, como en una hoja de exposición.
- Para renderizar con esas claves: guardar el documento como JSON y correr
  `HOJA=hoja.json PAGINA=reel.html node grabar.cjs <bocas.json> <eventos.json> <carpeta> 28.6 30`.
