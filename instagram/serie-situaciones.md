# Serie de situaciones (reels pensados para viralidad)

En vez de consejos, cada reel cuenta **una situación** que cualquiera ha vivido como cliente de una tienda online, exagerada y bien narrada. El error de la tienda es el chiste; Out aparece al final y Mango, que no habla, es el único personaje.

**Método vigente (nov 2026): todo en código, Mango es el único cutout.** Los decorados, objetos, pantallas, clima y gráficos se dibujan con código (canvas 2D y HTML). Lo único animado como cutout es Mango. No se usan imágenes generadas con IA ni personajes extra: se probó con ChatGPT y Gemini y no funcionó (límites de imágenes, partes que no encajan, mucho trabajo manual). Piloto hecho y publicable: **La espera** (`instagram/situaciones/la-espera/`).

## Qué buscamos en cada reel

- **Gancho en el primer segundo** con texto en pantalla: «POV: tu página carga lento».
- **Una sola situación, un solo error,** exagerado hasta el absurdo. Que la gente diga «me pasó» y se lo mande a alguien.
- **Escalada y remate:** cada golpe peor que el anterior y un final inesperado.
- **Corto:** 12 a 20 segundos. La espera dura 15,6 s.
- **Voz del narrador que va con la imagen:** cada escena entra en el instante en que el narrador dice su frase. Subtítulos siempre (mucha gente lo ve sin sonido).
- **Mango reacciona, no habla.** El narrador dice todo, «Escríbenos.» incluido (la voz de Mango suena infantil y se descartó).
- **Sonido trabajado:** efectos sintetizados en cada golpe y movimiento de cámara. La música es opcional.
- **Cierre con motion graphics**, no un texto «puesto ahí»: las palabras suben una a una al ritmo de la voz, hay un gráfico que cuenta el remate y el botón entra con rebote.

## Situaciones

| Situación | El chiste | Remate |
|---|---|---|
| **La espera** (carga lenta) — hecha | Mango toca «Comprar» y la página carga: pasan una hora, tres días, un año; crece la planta, se acumulan las tazas, cambian las estaciones | Por fin carga: «Agotado». Su cara |
| **La invasión de ventanas** | Cada vez que cierra una ventana emergente aparecen dos más (cupones, cookies, notificaciones, chat) | Cuando las cierra todas, la tienda cerró |
| **El formulario infinito** | Para pagar le piden nombre, cédula, tipo de sangre, el nombre de su primera mascota... | Se va a comprar a la competencia en un clic |
| **El botón de WhatsApp que tapa todo** | El botón flotante tapa justo el «Pagar» y lo persigue por la pantalla | Termina escribiendo por WhatsApp y nadie responde |
| **El zoom** | En el celular las letras son diminutas; hace zoom, luego más zoom, hasta entrar a los píxeles | Adentro solo dice «Precio: consultar» |
| **El link en la bio** | El link de la bio lleva a 8 links, que llevan a otros 8 | Termina en un formulario de Google |
| **El código que nunca llega** | El código de verificación no llega: revisa el correo, el spam, la ventana | Llega cuando ya cerró la pestaña |

## Cómo se produce

Es el mismo método de Mango (skill `reel-con-mango`), con un decorado hecho en código. La plantilla es `instagram/mango2d/espera.html`.

1. **Mango asoma, no hay cuerpo.** Mango es una cabeza: se coloca pequeño (escala 0,4) asomando sobre una mesa, con el borde de la mesa tapando el cuello. Mira lo que pasa, parpadea al cambiar de expresión y reacciona. Sigue las reglas de la skill (a 2s, ojos visibles, boca cerrada si no habla).
2. **Mundo en canvas 2D.** `instagram/mango2d/elementos.js` trae el cielo (hora y clima), el reloj y la pantalla de celular (cargando, agotado); el resto (planta, tazas, telarañas, calendario, mesa, ventana) se dibuja en `espera.html`. Estilo plano con contorno oscuro, como Mango. Cada pieza es una **función del tiempo**: el mismo `t` da siempre el mismo dibujo, lo que hace estable el render cuadro a cuadro.
3. **El mundo va fluido, solo Mango va a 2s.** Probado: todo el mundo a 2s se siente cortado. El crecimiento tiene que ser gradual: cada hoja brota creciendo desde cero y cada taza cae y se apoya (nada de objetos que aparecen de golpe).
4. **Cuidado con el aliasing.** Un lapso de tiempo (reloj, ciclo día y noche) no puede girar más de unos 3 giros por segundo, o a 24 cuadros por segundo se ve trabado o al revés.
5. **Cámara: menos es más.** Dos movimientos, cada uno con motivo. En La espera: abrir al plano general cuando empieza el paso del tiempo y un golpe de zoom a la cara de Mango al ver «Agotado». Los barridos sin motivo (reloj, ventana, tazas) se probaron y se descartaron.
6. **Voz primero, escenas después.** El narrador graba la frase completa con `<break time="2s" />` entre frases; con `cortar-voz.py` se leen los tiempos y se ajustan las marcas de tiempo del HTML (`E`) y los efectos. El mundo puede ir con su propio reloj (`W(t)`) para comprimir el lapso a lo que dura la frase.
7. **Expresión coherente.** Un susto = ojos abiertos + jadeo (boca `e`) y mueca de dientes (`kg`). Ojos abiertos con boca de silbido y cejas relajadas no dice nada. Los ojos siempre visibles.
8. **Cierre y portada.** Cierre por motion graphics (iris circular, palabras que suben desde una máscara, curva que se desploma, botón con rebote). Portada con `portada-espera.cjs`: el título queda dentro del centro 4:5 de la cuadrícula del perfil.

## Variante: reel de un caso con motion graphics (BARCI)

Cuando el reel muestra el trabajo de un cliente en vez de una situación, el escenario ilustrado sobra: fondos lisos con la paleta de la marca, fotos y logo reales de la tienda (con permiso de la clienta), gráficos que cuentan el dato y Mango asomando abajo como único cutout. Plantilla: `instagram/mango2d/reel-barci.html` (la espera y este reel comparten Mango, voz y cierre). Detalles y guion en `instagram/barci/`.

## Cómo se trabaja con el usuario

1. Se acuerda la situación y el guion corto.
2. El usuario genera la voz en ElevenLabs con las frases separadas por `<break time="2s" />`.
3. Claude arma la escena, sincroniza a la voz, sintetiza los efectos, mezcla y revisa con hojas de contactos y tiras de cuadros.
4. El usuario opina sobre lo que es de gusto (ritmo, cámara, expresión). Claude corrige lo que puede ver solo.
5. Portada y texto de la publicación en la carpeta del reel (`textos.md`).

## Archivos

- `instagram/mango2d/espera.html`: plantilla de situación (mundo en código, cámara por planos, cierre).
- `instagram/mango2d/elementos.js`: cielo, reloj, pantalla de celular.
- `instagram/situaciones/sfx-espera.py`, `sfx-barci.py`: efectos sintetizados, con los tiempos de la voz de cada reel.
- `instagram/situaciones/la-espera/`: reel final, portada y texto.
