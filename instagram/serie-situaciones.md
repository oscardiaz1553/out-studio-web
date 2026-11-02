# Serie de situaciones (reels pensados para viralidad)

En vez de consejos, cada reel cuenta **una situación** que cualquiera ha vivido como cliente de una tienda online, exagerada y bien narrada, ilustrada en 2.5D (personajes cutout, fondos por capas y cámara con profundidad). El error de la tienda es el chiste; Out aparece al final con Mango.

## Qué buscamos en cada reel

- **Gancho en el primer segundo** con texto en pantalla: «POV: intentas comprar en una tienda online».
- **Una sola situación, un solo error,** exagerado hasta el absurdo. Que la gente diga «me pasó» y se lo mande a alguien.
- **Escalada y remate:** cada golpe peor que el anterior y un final inesperado.
- **Corto:** 12 a 20 segundos. Cuanto más se repite completo, más se muestra.
- **Final que empalma con el inicio** cuando se pueda, para que se vea en bucle.
- **Sonido trabajado:** efectos en cada golpe, música y voces de personaje. Subtítulos siempre (mucha gente lo ve sin sonido).
- **Personajes que vuelven:** la clienta (y más adelante el emprendedor) se vuelven conocidos episodio a episodio.
- **Mango de cameo al final:** «Escríbenos.», nada más. El reel no vende, entretiene.

## Situaciones

| Situación | El chiste | Remate |
|---|---|---|
| **La espera** (carga lenta) | La clienta toca «Comprar» y la página carga mientras pasan el día y la noche, crece una planta, le sale barba, cambian las estaciones | Por fin carga: «Agotado» |
| **La invasión de ventanas** | Cada vez que cierra una ventana emergente aparecen dos más (cupones, cookies, notificaciones, chat) | Cuando las cierra todas, la tienda cerró |
| **El formulario infinito** | Para pagar le piden nombre, cédula, tipo de sangre, el nombre de su primera mascota... | Se va a comprar a la competencia en un clic |
| **El botón de WhatsApp que tapa todo** | El botón flotante tapa justo el «Pagar» y la persigue por la pantalla | Termina escribiendo por WhatsApp y nadie responde |
| **El zoom** | En el celular las letras son diminutas; hace zoom, luego más zoom, hasta entrar a los píxeles | Adentro solo dice «Precio: consultar» |
| **El link en la bio** | El link de la bio lleva a 8 links, que llevan a otros 8 | Termina en un formulario de Google |
| **El código que nunca llega** | El código de verificación no llega: revisa el correo, el spam, la ventana, le escribe a su mamá | Llega cuando ya cerró la pestaña |

## Cómo se produce en 2.5D (sin 3D)

Es el mismo método de Mango (skill `reel-con-mango`), ampliado a más personajes y a escenarios:

1. **Personajes cutout.** Cada personaje se dibuja una vez en el estilo ilustrado de Mango y se separa en partes que se animan: cabeza, torso, brazos, manos, más hojas de bocas y de ojos (como las de Mango). Las partes se mueven a 2s con pivotes, y la cabeza gira en 2.5D con el mismo rig.
2. **Fondos por capas.** Cada escenario (sala, bus, oficina) se ilustra en 3 o 4 capas (fondo, medio, primer plano). La cámara se mueve entre ellas con paralaje: es lo que da la sensación de profundidad sin 3D. Los cambios de día a noche y de estación se hacen con color y luz en código.
3. **Pantallas en código.** Celulares, ventanas emergentes, formularios, cargadores: nítidos, editables y con el texto exacto.
4. **Cámara y montaje.** Acercamientos, barridos, cortes a primer plano de la cara, planos detalle del dedo y del celular.
5. **Voces y sonido.** Voces de personaje en ElevenLabs, efectos en cada golpe, música. Subtítulos palabra por palabra.

## Qué hace falta (y quién lo hace)

- **Arte de cada personaje** (el usuario, con ChatGPT, con las indicaciones de abajo): una hoja de partes, una de bocas y una de ojos, en el mismo estilo de la ilustración de Mango.
- **Fondos por capas** (el usuario, con ChatGPT): cada escenario, una imagen por capa sobre fondo liso.
- **Voces** (el usuario, en ElevenLabs).
- **Todo lo demás** (Claude): separar y encajar las partes, rig, escenas, pantallas, cámara, lipsync, sonido, render y revisión.

### Indicaciones para ChatGPT: la clienta

Subir la ilustración de Mango (`design-src/mono/ilustrado/mango-ilustrado.png`) como referencia de estilo y pedir, una por mensaje:

1. «Personaje para una serie animada, mismo estilo de ilustración y de luz que esta imagen de referencia: mujer joven latina, ropa casual, expresiva y simpática. Hoja de personaje: de frente, de tres cuartos y de perfil, cuerpo completo, de pie, brazos a los lados, fondo liso de un solo color, sin sombras en el piso, sin texto.»
2. «La misma mujer, de frente. Hoja de partes separadas para animar como cutout, cada parte suelta con espacio alrededor: cabeza sin boca, torso, brazo superior, antebrazo y mano de cada lado (mano abierta, mano señalando, mano sosteniendo un celular), piernas. Fondo liso, sin texto.»
3. «La misma mujer. Hoja de bocas para lipsync, de frente, solo la parte de abajo de la cara: cerrada, A, E, I, O, U, M/P/B, F/V, S, y sonrisa. Fondo liso, cada boca con su etiqueta.»
4. «La misma mujer. Hoja de ojos y cejas: normal, aburrida, sorprendida, enojada, desesperada, dormida, mirando al celular. Fondo liso, cada una con su etiqueta.»

### Indicaciones para ChatGPT: un fondo por capas (la sala de «La espera»)

«Escenario para una animación en el mismo estilo de ilustración que la imagen de referencia: la sala de un apartamento en Colombia, con un sofá, una ventana grande y una planta. Formato vertical 9:16. Dame tres imágenes separadas con el mismo encuadre: 1) solo la pared y la ventana; 2) solo el sofá y la planta, con fondo transparente o liso; 3) un objeto de primer plano (una mesa de centro), con fondo liso. Sin personajes, sin texto.»

## Piloto propuesto: «La espera»

12 a 18 segundos, un personaje, un escenario.

1. POV: la clienta en el sofá toca «Comprar» en su celular. Aparece el cargador.
2. Espera: el cargador gira mientras por la ventana pasa el día y la noche, la planta crece, a ella le crece el pelo, cambia de posición en el sofá (aburrida, dormida), cae la nieve (en Colombia: el chiste es justamente que no nieva).
3. Remate: por fin carga la página: «Agotado». Su cara.
4. Cameo: Mango «Escríbenos.». Texto final: «Una página lenta pierde ventas».
