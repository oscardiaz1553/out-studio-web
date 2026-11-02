# Instagram, lote 4

**La venta perdida**, publicación 3 del perfil. La pieza principal es el reel con Mango
ilustrado. La misma idea existe también como imagen y como reel sin Mango (ver más abajo).

El reel está hecho con la skill `reel-con-mango` (`.claude/skills/reel-con-mango/`): Mango
animado en 2D a 2s, lipsync por fonemas y voces de ElevenLabs.

| Archivo | Qué es |
|---|---|
| `reel-venta-perdida-mango-ilustrado.mp4` | **El reel.** 1080 × 1920, 28,6 s, 24 cuadros por segundo, con voces, música y efectos |
| `reel-venta-perdida-portada.png` | La portada, 1080 × 1920. Lo importante queda en el centro 4:5 que recorta la cuadrícula del perfil |
| `venta-perdida-imagen.png` | La misma idea en una sola imagen, 1080 × 1350 |
| `reel-venta-perdida-con-musica.mp4`, `reel-venta-perdida.mp4` | Versiones sin Mango: con música original y sin audio |
| `reel-venta-perdida-voces.mp4` | Versión sin Mango con las dos voces |
| `reel-venta-perdida-mango.mp4` | Primer intento de Mango (la imagen deformada). Descartado |
| `voz-plan.json` | Cortes de una grabación de voz de Oscar que se probó y se descartó |

## Qué muestra

Seguimos a una clienta que quiere comprar en una tienda online. La tienda le falla de
tres formas y un contador de «ventas perdidas» sube con cada fallo. Cada fallo termina
con la misma frase, «Se fue.», que es lo que da ritmo.

1. Tarda en cargar (el reloj llega a 7,4 segundos).
2. No se ve bien en el celular (hace zoom y no lee nada).
3. Pagar es un enredo (nueve campos antes de poder pagar).

Cierre: tres ventas, tres errores, todos con arreglo, y Mango dice «Escríbenos.».

**Voces.** El narrador dice todo menos el cierre: «Esta clienta quiere comprar en tu
tienda. Mira qué pasó. Tarda en cargar siete segundos. Se fue. No se ve bien en el celular.
No lee nada. Se fue. Pagar es un enredo. Tiene nueve campos. Se fue. Tres ventas perdidas.
Tres errores con arreglo. Y casi nunca te enteras. ¿Tu tienda tiene alguno?». Mango solo
dice «Escríbenos.» y el resto del tiempo escucha con la boca cerrada.

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
> Míralo con sonido y guárdalo para revisar tu tienda con calma.

**Hashtags:** #TiendaOnline #Shopify #Ecommerce #EmprendimientoColombia #DiseñoWeb #DiseñoUXUI #VentasOnline

**Texto alternativo:** Video de Out Studio con Mango, la mascota, y una clienta en una tienda online que falla de tres formas: carga lento, no se ve bien en el celular y pagar es un enredo. Un contador de ventas perdidas sube en cada fallo hasta 540.000 pesos. Al final Mango dice «Escríbenos».

**Primer comentario (fíjalo tú):** «¿Cuál de las tres le pasa a tu tienda: carga lento, no se ve bien en el celular o pagar es un enredo?»

## Cómo publicarlo

- **Archivo:** sube `reel-venta-perdida-mango-ilustrado.mp4`. La música es original, sin derechos de autor.
- **Portada:** en Reels elige «Subir desde el carrete» y usa `reel-venta-perdida-portada.png`. En el perfil, la cuadrícula recorta arriba y abajo, y el título y Mango quedan a la vista.
- **Cuándo:** martes o jueves, al mediodía o a las 7 p. m.
- **Después:** responde cada comentario y DM el mismo día y comparte el reel en tus historias y en tu estado de WhatsApp.

## Antes de publicar

- Las voces vienen de ElevenLabs: para uso comercial (un reel de Out lo es), el plan de la cuenta tiene que ser de pago. Confírmalo.
- El texto promete una revisión por DM de la tienda de quien comente. Confirma que quieres ofrecerla; si no, cambia esa frase por «Escríbenos por DM» solamente.
- Los montos ($180.000 y $540.000) son un ejemplo. El texto lo aclara; no lo quites.

## Cómo se regenera

- **Portada:** `cd instagram/mango2d && NODE_PATH=$(npm root -g) node portada.cjs ../lote-4/reel-venta-perdida-portada.png` (la hace con el mismo Mango del reel: ojos entreabiertos, boca cerrada).
- **Reel:** ver la skill `reel-con-mango` (flujo completo y comandos). Los datos de este reel: voces en `instagram/voces/`, plan de cortes en `instagram/dialogo/plan.json`, claves de boca y ojos en `instagram/dialogo/hoja-venta-perdida.json`, escenas en `instagram/mango2d/reel.html`.
- **Imagen:** `node instagram/scripts/lote-4.cjs`.

## Publicación de imagen (alternativa)

Imagen: `venta-perdida-imagen.png` (1080 × 1350). Muestra el contador de ventas perdidas, a la clienta que quiere comprar, las tres cosas que fallaron y «Se fue.» en cada una.

> Esta clienta quiere comprar en tu tienda. Y se va.
>
> Tarda en cargar: se fue.
> No se ve bien en el celular: se fue.
> Pagar es un enredo: se fue.
>
> Tres ventas perdidas por tres errores que tienen arreglo. Lo difícil es que casi nunca te enteras: el cliente no avisa, solo se va.
>
> Los montos de la imagen son un ejemplo para que se entienda la idea.
>
> ¿Cuál de las tres le pasa a tu tienda? Cuéntanos en los comentarios o escríbenos por DM y la revisamos contigo. También puedes cotizar en outstudio.online (link en la bio).
>
> Guárdalo para revisar tu tienda con calma.

**Texto alternativo:** Imagen de Out Studio con un contador de ventas perdidas de 540.000 pesos. Una clienta quería comprar y se fue por tres fallos de la tienda: tarda en cargar 7,4 segundos, no se ve bien en el celular y pagar tiene 9 campos. Las tres tienen arreglo.

## Versiones anteriores del reel (por si se retoman)

- **Sin Mango, con música** (`reel-venta-perdida-con-musica.mp4`): el mismo reel sin voz. Se regenera con
  `python3 instagram/scripts/musica-reel.py --video instagram/lote-4/reel-venta-perdida.mp4` (HyperFrames: `instagram/hyperframes/reel-venta-perdida/`).
- **Sin Mango, con dos voces** (`reel-venta-perdida-voces.mp4`): narrador y Mango solo en voz, sin animación.
- **Mango con la imagen deformada** (`reel-venta-perdida-mango.mp4`, proyecto `instagram/hyperframes/reel-venta-perdida-mango/`): la boca se deformaba por tiras; no funcionó y se reemplazó por el Mango ilustrado.
- **Voz de Oscar:** se probó en tres tratamientos y no convenció (`voz-plan.json`, `scripts/poner-voz.py`).

## Música

Hecha con `instagram/scripts/musica-reel.py` (numpy y scipy, todo sintetizado, sin muestras ni derechos de autor). Va a 114 BPM, con la rejilla desplazada para que los cambios de escena y las tres «Se fue.» caigan sobre el pulso. Cambia de acordes menores y tensos a mayores y esperanzados cuando llega la suma, y cierra con un golpe final con campanitas. Los efectos de sonido salen de `instagram/scripts/sfx-reel.py`.
