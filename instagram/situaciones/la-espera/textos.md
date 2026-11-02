# Instagram: La espera

Primer reel de la serie de situaciones (`instagram/serie-situaciones.md`). Todo el mundo está
generado con código (cielo, reloj, celular, planta, tazas, calendario, cierre) y Mango es el
único personaje animado como cutout (a 2s, boca cerrada cuando no habla, ojos siempre visibles).

| Archivo | Qué es |
|---|---|
| `reel-la-espera.mp4` | **El reel.** 1080 × 1920, 15,6 s, 24 cuadros por segundo, con voz del narrador y efectos |
| `portada.png` | La portada, 1080 × 1920. El título queda dentro del centro 4:5 que recorta la cuadrícula del perfil |

## Qué muestra

Mango quiere comprar unos tenis en una tienda. Toca «Comprar» y la página empieza a cargar.
Pasan una hora, tres días y un año (la planta crece, se acumulan las tazas, cambian las
estaciones). Por fin carga, y el producto dice «Agotado». Cierre: «Una página lenta no avisa:
solo pierde ventas.».

**Voz (ElevenLabs, narrador).** «Él quiere comprar en tu tienda. Tu página está cargando. Una
hora después. Tres días después. Un año después. Por fin cargó. Una página lenta no avisa: solo
pierde ventas. Escríbenos.». Mango no habla.

## Texto de la publicación

> Él solo quería comprar.
>
> Tu página tardó tanto en cargar que pasó una hora, tres días, un año… y cuando por fin cargó, el producto ya estaba agotado.
>
> Una página lenta no avisa: solo pierde ventas. Y casi siempre es arreglable.
>
> ¿Cuánto tarda en cargar tu tienda? Escríbenos por DM y la revisamos contigo, o cotiza en outstudio.online (link en la bio).
>
> Guárdalo para acordarte de revisar tu velocidad. Y mándaselo a quien tenga una tienda lenta 👀

**Hashtags:** #TiendaOnline #Shopify #Ecommerce #EmprendimientoColombia #DiseñoWeb #VelocidadWeb #VentasOnline

**Texto alternativo:** Video animado de Out Studio. Mango, la mascota, mira un celular que muestra una tienda cargando mientras pasan una hora, tres días y un año: cambia el clima en la ventana, crece una planta y se acumulan tazas. Al final la página carga, el producto dice «Agotado» y Mango se asusta. Cierra con el texto «Una página lenta no avisa: solo pierde ventas» y outstudio.online.

**Primer comentario (fíjalo tú):** «¿Cuánto tarda en cargar tu tienda? Si no lo sabes, escríbenos y la medimos juntos.»

## Cómo publicarlo

- **Archivo:** sube `reel-la-espera.mp4`. Los efectos son sintetizados y no llevan música, así que no hay derechos de autor.
- **Portada:** en Reels elige «Subir desde el carrete» y usa `portada.png`.
- **Cuándo:** martes o jueves, al mediodía o a las 7 p. m. (o el día siguiente al reel anterior si ya hay uno publicado).
- **Después:** responde cada comentario y DM el mismo día y comparte el reel en historias y en el estado de WhatsApp.

## Antes de publicar

- La voz viene de ElevenLabs: para uso comercial el plan de la cuenta tiene que ser de pago. Confírmalo.
- El texto promete una revisión por DM de la velocidad de la tienda. Confirma que quieres ofrecerla; si no, deja solo «Escríbenos por DM».
- No le puse música: si quieres una base suave, se agrega con `instagram/scripts/musica-reel.py`.

## Cómo se regenera

- **Reel:** `instagram/mango2d/espera.html` (escena completa, sincronizada con `instagram/voces/espera-narrador.mp3`) y efectos en `instagram/situaciones/sfx-espera.py`. Se graba con `grabar.cjs` (`PAGINA=espera.html`, 15,6 s a 24 cuadros) y se mezcla con ffmpeg (voz a -16 LUFS, efectos con sidechain, loudnorm -15).
- **Portada:** `cd instagram/mango2d && NODE_PATH=$(npm root -g) node portada-espera.cjs ../situaciones/la-espera/portada.png`.
