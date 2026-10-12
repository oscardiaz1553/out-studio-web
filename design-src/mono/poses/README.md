# Poses de Mango

Mascota oficial de Out. Cada pose está en dos versiones:

- `.png`: el original generado (fondo blanco, 1024 × 1024).
- `.webp`: sin fondo y recortada, lista para la web, redes o piezas.

| Archivo | Situación | Gafas |
|---|---|---|
| mono-saludando | Bienvenida | Sí, reflejo de cielo |
| mono-pensando | Analizando un proyecto | No |
| mono-celebrando | Lanzamiento, logro | Sí, reflejo de fuegos artificiales |
| mono-pulgar-arriba | Tarea lista, aprobado | Sí, reflejo de estadio |
| mono-chateando | Contacto, WhatsApp | No |

> Pendiente: las versiones `.webp` actuales dejan un borde claro alrededor del
> pelo. Hay que regenerar todas las poses en ChatGPT con fondo transparente
> real (ver docs/PENDIENTES.md).

## Prompts para ChatGPT

Subir las dos imágenes de referencia de Mango y pegar primero:

> Este es Mango, la mascota oficial de mi marca: un mono aullador 3D estilo
> caricatura, de pelaje naranja largo y esponjoso, sonrisa grande y expresión
> amigable. Necesito que generes nuevas poses de este MISMO personaje, idéntico
> en cara, pelaje, proporciones y estilo de render. Reglas para todas las
> imágenes: PNG con fondo 100% transparente (sin sombra en el piso, sin halo
> blanco alrededor del pelo), cuerpo completo salvo que diga otra cosa,
> iluminación suave de estudio, sin textos ni logos, formato cuadrado. Te voy a
> pedir una pose por mensaje.

Luego, una por mensaje:

- Saludando con una mano. Gafas doradas con reflejo de cielo azul con nubes.
- Sentado, mano en la barbilla, mirando hacia arriba. Sin gafas.
- Saltando con los brazos arriba y confeti naranja. Gafas con reflejo de fuegos artificiales.
- Medio cuerpo, pulgar arriba. Gafas con reflejo de estadio de fútbol iluminado.
- Medio cuerpo escribiendo en un celular, burbuja de chat verde. Sin gafas.
- Sosteniendo una caja de envío con un mango encima. Gafas con reflejo de ciudad al atardecer.
- Sentado dibujando en una tableta gráfica. Gafas subidas en la cabeza.
- Montado en un cohete azul cobalto que despega. Gafas con reflejo de galaxia.
- Relajado con una taza de café humeante. Sin gafas.
- Sorprendido, manos en las mejillas. Gafas con reflejo de ciudad neón.
- Avatar: cara y pecho de frente, sonrisa cálida, sin gafas.

Si sale con fondo blanco o borde: "Vuelve a exportarla como PNG con fondo
transparente real, sin halo blanco en los bordes del pelo".
