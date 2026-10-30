# Instagram, lote 4

Un reel para la publicación 3 del perfil: **La venta perdida**. Está hecho con
HyperFrames (su proyecto vive en `instagram/hyperframes/reel-venta-perdida/`).

| Archivo | Qué es |
|---|---|
| `reel-venta-perdida-con-musica.mp4` | El reel con música original, 1080 × 1920, 28,6 segundos, sin voz. Es el que se sube |
| `reel-venta-perdida.mp4` | El mismo reel sin audio, por si prefieres ponerle un sonido en trending de Instagram |
| `voz-plan.json` | Los cortes de una grabación de voz que se probó y se descartó (ver «Voz en off») |
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

- **Audio:** sube `reel-venta-perdida-con-musica.mp4`. La música es original (no
  tiene derechos de autor) y los golpes caen sobre los de la pantalla. Si prefieres
  un sonido que esté de moda en Reels, sube `reel-venta-perdida.mp4` (sin audio) y
  elígelo en Instagram: los sonidos en tendencia suelen dar más alcance.
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

## Voz en off (probada y descartada)

Se probó con la voz de Oscar, grabada en una toma, en tres tratamientos (natural,
cálida y grave), y no convenció, así que el reel se publica sin voz y con música.
El video quedó ajustado al ritmo de esa lectura (por eso el cierre es más pausado
y dura 28,6 s). La herramienta y el guion se dejan por si se quiere retomar.

| Desde | Frase | Qué pasa en pantalla |
|---|---|---|
| 0,4 s | Esta clienta quiere comprar en tu tienda. Mira qué pasó. | Gancho, el carrito de $180.000 |
| 3,95 s | Tarda en cargar siete segundos. | El reloj sube hasta 7,4 s |
| 6,95 s | Se fue. | Cae «Se fue.» y sube el contador |
| 8,5 s | No se ve bien en el celular. No lee nada. | Zoom con los dedos |
| 11,95 s | Se fue. | Cae «Se fue.» |
| 13,4 s | Pagar es un enredo. Tiene nueve campos. | Los campos se apilan |
| 16,7 s | Se fue. | Cae «Se fue.» |
| 18,0 s | Tres ventas perdidas. Tres errores con arreglo. | La suma de $540.000 |
| 21,35 s | Y casi… nunca te enteras. | El texto grande sobre la suma |
| 24,0 s | ¿Tu tienda tiene alguno? | Entra el cierre |
| 27,2 s | Escríbenos. | Mango y el botón |

### Cómo se pone

La toma salió de corrido, sin pausas claras entre frases, así que los cortes están
a mano en `voz-plan.json` (segundo de inicio y fin dentro de la grabación, y el
segundo del video donde entra). Para volver a mezclar:
`python3 instagram/scripts/poner-voz.py toma.m4a --plan instagram/lote-4/voz-plan.json`

Si grabas otra toma con una pausa de un segundo entre frases, el script las
separa solo, sin plan: `python3 instagram/scripts/poner-voz.py toma.m4a`.

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

## Música

Está hecha con `instagram/scripts/musica-reel.py` (numpy y scipy, todo sintetizado, sin
muestras ni derechos de autor). Va a 114 BPM, con la rejilla desplazada para que los
cambios de escena y las tres «Se fue.» caigan sobre el pulso. Va creciendo con las
escenas (intro, reloj, zoom, formulario), se corta justo antes de cada «Se fue.» para
que el golpe pegue más, hace un respiro antes de «nunca te enteras» y pasa de acordes
menores y tensos a mayores y esperanzados cuando llega la suma. Cierra con silencio y
un golpe final con campanitas.

Para regenerarla y mezclarla con el video:
`python3 instagram/scripts/musica-reel.py --video instagram/lote-4/reel-venta-perdida.mp4`
Se puede ajustar el volumen con `--volumen 0.8` (requiere numpy, scipy y ffmpeg).
