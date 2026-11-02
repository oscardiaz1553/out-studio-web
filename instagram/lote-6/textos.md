# Instagram, lote 6 (borrador)

**Así hacemos hablar a Mango.** Reel de «detrás de cámaras» que enseña el método de `.claude/skills/reel-con-mango/` con datos y dibujos reales del reel «La venta perdida». Sirve de dos formas: muestra el oficio de Out y le da a otros animadores y creadores una técnica que pueden copiar.

Mango solo dice «Escríbenos.» al final (se reutiliza `instagram/voces/mango.mp3`). Solo hace falta un audio nuevo, el del narrador.

## Guion (narrador) y escenas

Todo lo que sale en pantalla es real: las hojas de bocas y ojos que dibujó el usuario, la forma de onda y los fonemas del audio de «Escríbenos.», las claves de `instagram/dialogo/hoja-venta-perdida.json` y los dibujos intermedios de `instagram/mango2d/inb/`.

| Frase del narrador | Escena |
|---|---|
| Así hacemos hablar a Mango. | Gancho: Mango habla y, alrededor, aparecen las bocas y los ojos como una cuadrícula |
| Primero, los dibujos: veinte bocas y veinte pares de ojos, hechos una sola vez. | Las dos hojas (bocas y ojos) entran dibujo por dibujo |
| Después escuchamos la voz y buscamos las letras que mandan: a, e, i, o, u, de, ese, te, eme y pe. | La onda de «Escríbenos.» con cada letra marcada y la boca que le toca |
| Cada dibujo entra dos cuadros antes del sonido. | La hoja de exposición: la marca del sonido y, dos cuadros antes, la clave del dibujo |
| Entre un dibujo y otro van dibujos intermedios, y todo se mueve cada dos cuadros. | Una boca que pasa de A a E por sus dos intermedios; el contador de cuadros de dos en dos |
| Así se ve fluido, como animación de verdad. | Antes y después: la misma frase brusca y suave, lado a lado |
| ¿Quieres un personaje así para tu marca? | Mango escucha, parpadea |
| (Mango) Escríbenos. | Mango, botón y logo |

## Audio que hay que generar (ElevenLabs, voz del narrador)

```
Así hacemos hablar a Mango. <break time="2s" /> Primero, los dibujos: veinte bocas y veinte pares de ojos, hechos una sola vez. <break time="2s" /> Después escuchamos la voz y buscamos las letras que mandan: a, e, i, o, u, de, ese, te, eme y pe. <break time="2s" /> Cada dibujo entra dos cuadros antes del sonido. <break time="2s" /> Entre un dibujo y otro van dibujos intermedios, y todo se mueve cada dos cuadros. <break time="2s" /> Así se ve fluido, como animación de verdad. <break time="2s" /> ¿Quieres un personaje así para tu marca?
```

## Texto de la publicación (borrador)

> Así hacemos hablar a Mango, paso a paso.
>
> 1. Dibujamos una sola vez veinte bocas y veinte pares de ojos.
> 2. Escuchamos la voz y buscamos las letras que mandan: a, e, i, o, u, d, s, t, m y p.
> 3. Cada dibujo entra dos cuadros antes del sonido, para que el labio y la voz lleguen juntos.
> 4. Entre un dibujo y otro van dibujos intermedios, y todo se mueve cada dos cuadros.
>
> Así sale fluido, como animación de verdad. Si eres animador o creas contenido, pruébalo con tu personaje y cuéntanos cómo te fue.
>
> ¿Quieres un personaje así para tu marca? Escríbenos por DM o cotiza en outstudio.online (link en la bio).
>
> Guárdalo para tenerlo a mano cuando animes.

**Hashtags:** #Animación2D #Cutout #Lipsync #AnimaciónParaMarcas #MascotaDeMarca #DiseñoWeb #BehindTheScenes

## Pendiente antes de producirlo

- Confirmar que Out ofrece mascotas o personajes animados para marcas (el cierre lo ofrece). Si no, el cierre cambia a «Escríbenos si quieres ver cómo trabajamos».
- La voz de ElevenLabs necesita licencia comercial.
- Escena de «antes y después»: hay que renderizar la versión brusca (la primera, movida solo por el volumen) con la misma frase.
