# Instagram, lote 4

Un reel para la publicación 3 del perfil: **La venta perdida**. Está hecho con
HyperFrames (su proyecto vive en `instagram/hyperframes/reel-venta-perdida/`).

| Archivo | Qué es |
|---|---|
| `reel-venta-perdida.mp4` | El reel, 1080 × 1920, 25 segundos, sin audio |
| `reel-venta-perdida-portada.png` | La portada |

## Qué muestra

Seguimos a una clienta que quiere comprar en una tienda online. La tienda le
falla de tres formas y un contador de «ventas perdidas» sube con cada fallo.
Cada fallo termina con la misma frase, «Se fue.», que es lo que da ritmo.

1. Tarda en cargar (el reloj llega a 7,4 segundos).
2. No se ve bien en el celular (hace zoom y no lee nada).
3. Pagar es un enredo (nueve campos antes de poder pagar).

Cierre: tres ventas, tres errores, todos con arreglo, y la invitación a hablar.

## Cómo publicarlo

- **Audio:** el video no trae sonido. Elige uno que esté sonando en Reels (con
  ritmo marcado, que acompañe los golpes de «Se fue.») y ponlo a volumen bajo.
- **Portada:** sube `reel-venta-perdida-portada.png`. En el perfil, la cuadrícula
  recorta arriba y abajo, y el título queda a la vista.
- **Cuándo:** martes o jueves, al mediodía o a las 7 p. m.
- **Primer comentario:** fija uno tuyo con la pregunta del final del texto, para
  que la gente conteste debajo.

## Texto de la publicación

> Esta clienta quería comprar en tu tienda. Mira qué pasó.
>
> Tarda en cargar: se fue.
> No se ve bien en el celular: se fue.
> Pagar es un enredo: se fue.
>
> Tres ventas perdidas por tres errores que tienen arreglo. Y lo difícil es que casi nunca te enteras: el cliente no avisa, solo se va.
>
> Los montos del video son un ejemplo para que se entienda la idea.
>
> ¿Cuál de las tres le pasa a tu tienda? Cuéntanos en los comentarios o escríbenos por DM y la revisamos contigo. También puedes cotizar en outstudio.online (link en la bio).
>
> Guárdalo para revisar tu tienda con calma.

**Hashtags:** #TiendaOnline #Shopify #Ecommerce #EmprendimientoColombia #DiseñoWeb #DiseñoUXUI #VentasOnline

**Texto alternativo:** Video de Out Studio que sigue a una clienta en una tienda online que falla de tres formas: carga lento, no se ve bien en el celular y pagar es un enredo. Un contador de ventas perdidas sube en cada fallo.

## Antes de publicar

- El texto promete una revisión por DM de la tienda de quien comente. Confirma
  que quieres ofrecerla; si no, cambia esa frase por «Escríbenos por DM» solamente.
- Responde cada comentario y DM el mismo día y comparte el reel en tus historias
  y en tu estado de WhatsApp.

## Para regenerarlo

Desde `instagram/hyperframes/reel-venta-perdida/`:
`npx hyperframes@0.8.150 render -q high -o reel.mp4` (pide Node 22 y FFmpeg).
La portada es el cuadro del segundo 2,85 del video:
`ffmpeg -ss 2.85 -i reel.mp4 -frames:v 1 portada.png`.
