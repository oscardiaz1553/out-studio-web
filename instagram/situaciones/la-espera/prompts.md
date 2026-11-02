# La espera: imágenes para generar (Gemini)

Cómo usarlas:
- En **todas** adjunta la ilustración de Mango (`design-src/mono/ilustrado/mango-ilustrado.png`) como referencia de estilo.
- Desde la segunda imagen de la clienta, adjunta **también** su hoja de personaje (la primera), para que sea siempre la misma mujer.
- Pide formato vertical 9:16. Si una sale con otro estilo (más realista, más plano, otro trazo), repítela recordando: «mismo estilo exacto que la imagen de referencia».
- Fondo verde liso donde se pide: así la recorto limpia. Que nada del personaje sea verde.

## La clienta

**Hoja de personaje**
> Crea un personaje para una serie animada, con exactamente el mismo estilo de ilustración, trazo, textura y luz que la imagen de referencia (el mono naranja con gafas). Mujer latina de unos 28 años, piel morena clara, pelo negro ondulado hasta los hombros, buzo con capucha azul intenso (#1B2FCC), jean, tenis blancos, expresión simpática. Hoja de personaje con tres vistas en la misma imagen: de frente, de tres cuartos y de perfil, de cuerpo completo, de pie, con los brazos a los lados. Fondo verde liso (#00FF00), sin sombra en el piso, sin texto.

**Poses sentada** (una imagen por pose, mismo tamaño y mismo encuadre en todas: cuerpo completo, de tres cuartos mirando hacia la izquierda, sentada como si estuviera en un sofá que no se ve)
> La misma mujer de la imagen adjunta, mismo estilo de ilustración que la referencia del mono. Sentada como si estuviera en un sofá que no se dibuja, cuerpo completo, de tres cuartos mirando hacia la izquierda, sosteniendo un celular con las dos manos. [POSE]. Fondo verde liso (#00FF00), sin sofá, sin sombra, sin texto. Formato vertical 9:16, el personaje centrado y del mismo tamaño que en las otras poses.

Cambia [POSE] por cada una de estas (seis imágenes):
1. «Emocionada, a punto de tocar la pantalla con el dedo índice, sonrisa grande.»
2. «Esperando, mira la pantalla con una sonrisa que se está apagando.»
3. «Aburrida, la mejilla apoyada en una mano, el celular en la otra, ojos entrecerrados.»
4. «Dormida, la cabeza ladeada sobre el hombro, la boca un poco abierta, el celular todavía en la mano.»
5. «Se despierta de golpe, pelo larguísimo hasta la cintura y despeinado, mira la pantalla con ojos muy abiertos.»
6. «Indignada e incrédula, pelo larguísimo, mira la pantalla con la boca abierta, una ceja levantada.»

## La sala (fondo por capas)

Las tres con el mismo encuadre vertical 9:16, vista de frente, a la altura de una persona sentada.

**Capa del fondo**
> Escenario para una animación, con exactamente el mismo estilo de ilustración y de luz que la imagen de referencia. La pared de la sala de un apartamento en Colombia, color crema cálido, con una ventana grande en el centro y un reloj de pared redondo arriba a la derecha. La ventana sin vidrio ni paisaje: el hueco de la ventana relleno de verde liso (#00FF00). El reloj sin manecillas. Sin muebles, sin personajes, sin texto. Formato vertical 9:16.

**Capa media: el sofá**
> Mismo estilo de ilustración que la referencia. Un sofá de tres puestos, de tela color terracota (#BC6039), con dos cojines, visto de frente, como en la sala de un apartamento. Solo el sofá, sobre fondo verde liso (#00FF00), sin sombra, sin texto. Formato vertical 9:16, el sofá ocupando el ancho en la mitad de abajo.

**La planta** (tres imágenes, misma maceta y mismo tamaño de maceta en las tres, sobre fondo verde liso, sin texto)
> Mismo estilo de ilustración que la referencia. Una planta en una maceta de barro, sobre fondo verde liso (#00FF00), sin sombra, sin texto. [TAMAÑO].

Cambia [TAMAÑO] por: «Una plántula pequeña de dos hojas.», «Una planta mediana y frondosa.» y «Una planta gigante, selvática, con hojas enormes que se salen de la imagen.».

**Capa del primer plano**
> Mismo estilo de ilustración que la referencia. Una mesa de centro de madera, vista de frente y un poco desde arriba, con una taza de café humeante encima. Solo la mesa, sobre fondo verde liso (#00FF00), sin sombra, sin texto. Formato vertical 9:16, la mesa en la parte de abajo de la imagen.

## Lo que hago yo en código

El cielo de la ventana (día, tarde, noche, lluvia), las manecillas del reloj, la luz de la sala según la hora, el humo del café, las telarañas, el celular con el cargador y la pantalla de «Agotado», la cámara con paralaje entre capas y los textos.
