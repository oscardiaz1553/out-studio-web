---
title: "Cómo relanzamos Diario Deportes: 47.000 notas en una noche"
description: "El caso Diario Deportes: auditoría, rediseño y migración en vivo de un diario deportivo con más de 47.000 notas, sin parar la redacción. Qué hicimos y qué aprendimos."
date: 2026-10-21
category: Casos
related: desarrollo-web, sitios-wordpress
---

Diario Deportes es el diario deportivo del Caribe colombiano. Sale desde Barranquilla hace más de 20 años y su sitio, [diariodeportes.com.co](https://diariodeportes.com.co), guardaba más de 47.000 notas. Nos pidieron algo que suena sencillo y no lo es: ponerle orden a una portada que había crecido por partes, sin dejar de publicar un solo día.

Esto es lo que encontramos, lo que construimos y cómo cambiamos el motor del sitio con el avión en vuelo.

<video controls preload="metadata" playsinline poster="/diario-deportes-poster.webp">
  <source src="/diario-deportes.mp4" type="video/mp4" />
</video>

## El punto de partida: un sitio que creció sin orden

Antes de diseñar nada, hicimos una auditoría. Encontró seis problemas:

- **Menú desordenado:** diez secciones al mismo nivel, sin una que mandara.
- **Contenido duplicado:** módulos que se repetían en la portada.
- **Demasiada publicidad suelta:** siete o más banners intercalados, sin etiqueta y sin separación del contenido.
- **Widgets de terceros** con estilos ajenos, que rompían la imagen del diario.
- **Sin jerarquía editorial:** no había una nota principal; la portada era un muro plano.
- **Accesibilidad floja:** imágenes sin texto alternativo y contraste dudoso.

También medimos el sitio anterior el 19 de octubre. La portada pesaba unos **32 MB**. En celular, el rendimiento en PageSpeed era de **29 sobre 100**, y el contenido principal tardaba **38 segundos** en aparecer con una red lenta simulada. Para un lector que abre el diario desde el celular, entre partido y partido, eso es una puerta cerrada.

<div class="figure-pair">
  <figure>
    <img src="/casos/diario-deportes-antes.webp" alt="Portada anterior de Diario Deportes en el celular, con un encabezado enorme y anuncios que tapan el contenido" loading="lazy" width="720" height="1280" />
    <figcaption>Antes: un encabezado enorme y publicidad encima de lo que se quiere leer.</figcaption>
  </figure>
  <figure>
    <img src="/casos/diario-deportes-despues.webp" alt="Listado de notas del sitio nuevo de Diario Deportes en el celular, con fotos, categoría y fecha" loading="lazy" width="720" height="1163" />
    <figcaption>Ahora: notas con foto, categoría y fecha, cada una en su lugar.</figcaption>
  </figure>
</div>

## La idea: orden sin perder la voz del diario

No quisimos que el sitio se viera como el de cualquier otro medio. La idea fue poner orden y conservar el carácter del diario:

- Una nota principal que manda.
- La publicidad en su lugar y siempre etiquetada.
- Los datos del fútbol con diseño propio.
- Una redacción que publica sin pelear con la página.
- Y todo editable por el equipo del diario, sin depender de nosotros.

## Lo que construimos

### La portada y la estructura

Redujimos el menú a pocas secciones principales más un «Más», **sin cambiar ninguna dirección web**: así no hay riesgo para el posicionamiento en Google. El encabezado lleva el logo centrado y el logo 2026 del diario.

La portada ahora tiene jerarquía: una nota grande en carrusel, y debajo secciones con una nota principal y notas secundarias con foto. Cada sección tiene un diseño ajustado a lo suyo: Fútbol Colombiano, Internacional, Béisbol, Boxeo, Más Deportes, Columnistas con foto y En video, conectado al canal de YouTube. Cada categoría, como el Junior o el béisbol, tiene además su propia ficha.

### La publicidad, en su lugar

Los anunciantes son parte del diario, y la publicidad tenía que convivir con las notas sin estorbar. Definimos espacios fijos y predecibles, cada uno con su etiqueta «Publicidad», y un sistema que reparte los anuncios para que nunca haya tres a la vista al mismo tiempo. Las nueve piezas de los anunciantes quedaron en su lugar, y hay un bloque «Anuncie en Diario Deportes» con sus logos.

### Datos de fútbol en vivo, con diseño propio

- Una **tira de partidos** arriba de todo, con selector de calendario: Liga BetPlay, Copa, Libertadores y más.
- **Tabla de posiciones y resultados** de la fecha, con la zona de clasificación, el Junior y su rival del día marcados.
- La **ficha del próximo partido del Junior**, con cuenta regresiva, estadio (corregible a mano desde el editor) y canal de televisión.
- La **programación de TV**, con un desplegable de 63 competiciones y equipos, banderas de cada liga y escudos de los clubes colombianos.

Las fuentes de los datos tienen su crédito visible.

### Herramientas para la redacción

Un sitio de noticias se juega en la redacción, así que construimos herramientas para quienes lo usan todos los días:

- **«Lo más leído hoy»**, con contador propio. Mide las últimas 24 horas en la portada, en cada sección y en las notas. No cuenta robots ni las visitas del equipo, y funciona aunque el sitio esté en caché.
- **Pizarra deportiva:** una pantalla simple para publicar, reemplazar o quitar la pizarra del día.
- **Baloncito**, la caricatura diaria, con su archivo.
- **Número de edición y efemérides automáticas:** cambian solas a medianoche («Un día como hoy»), sin que nadie toque nada.
- Una hoja de una página para la redacción: cómo clasificar una nota para que salga en la sección correcta.

### Accesibilidad y celular primero

El sitio se pensó primero para el celular, sin desplazamiento lateral, con áreas táctiles grandes y navegación por teclado. Las imágenes llevan texto alternativo y el contraste es suficiente. Hasta el favicon se rehízo con el logo 2026, para que se lea en pestañas claras y oscuras, y la página de mantenimiento se diseñó con la marca: «Estamos mejorando», con un libro animado en contornos.

## La migración: cambiar el motor con el avión en vuelo

Reconstruimos el sitio en WordPress. El reto no era el diseño, era pasar más de 47.000 notas a un sitio nuevo sin que la redacción dejara de publicar.

**Primero, un ensayo general.** Antes de tocar el sitio real, montamos una copia completa en un subdominio cerrado y corrimos todo el procedimiento de principio a fin:

- Los scripts tardaron **unos 6 minutos**. El plan estimaba 140.
- Encontramos y corregimos **5 errores silenciosos**, de esos que solo aparecen cuando se prueba de verdad.
- Probamos la vuelta atrás: tarda **27 segundos** y no borra nada del sitio anterior.

**La noche del lanzamiento**, entre el 20 y el 21 de octubre, arrancamos a las 8 p. m. El sitio quedó detrás de una página de mantenimiento que le dice a Google «vuelvo pronto» (un código 503), para no afectar el posicionamiento. La redacción siguió publicando notas durante toda la noche.

**El sitio nuevo se publicó a las 3:10 a. m.** El cliente lo esperaba a las 6:00 a. m., para la edición 5.900, así que lo entregamos casi tres horas antes.

**Y nada se perdió:**

- **47.616 notas** publicadas, más que las 47.606 del inicio.
- Las direcciones de las notas de siempre siguen abriendo igual.
- En el ensayo, las 105 direcciones de la sección de columnas se redirigieron sin pérdida.
- Pasaron 19 de las 20 pruebas de aceptación. La que no pasó era un anuncio que se retiró a propósito porque su campaña había vencido.

Durante la noche y la madrugada hicimos además decenas de ajustes pedidos en tiempo real por la editora digital. Cada uno llevó respaldo, revisión y prueba antes de subir.

## Lo que todavía estamos midiendo

Preferimos no contarte una mejora que no hemos medido. Vamos a repetir con el sitio nuevo exactamente el mismo método del «antes» (PageSpeed y peso de la portada) a las 24 horas, a los 7 días y a los 28 días, y vamos a actualizar este artículo con los resultados.

## Lo que aprendimos

- **El orden va antes que el adorno.** Casi todos los problemas del sitio viejo eran de jerarquía, no de estilo: sin una nota que mande, el lector no sabe qué mirar.
- **Ensayar la migración completa vale cada hora.** El ensayo encontró errores que habrían aparecido en vivo, y dejó la vuelta atrás probada.
- **Cuidar las direcciones web.** Cambiar el menú sin cambiar las direcciones protege años de posicionamiento.
- **Pensar en quien lo usa todos los días.** Una redacción necesita herramientas simples, no un sitio que se vea bien solo el día del lanzamiento.

## ¿Tu sitio también creció sin orden?

Si el tuyo tiene un menú con demasiadas cosas, publicidad por todas partes o una portada que nadie sabe por dónde leer, quizá ya sea momento de rediseñarlo. En nuestro artículo sobre las [señales de que tu página web necesita un rediseño](/blog/senales-de-que-tu-pagina-web-necesita-un-rediseno/) te contamos cómo saberlo.

Y si quieres que lo revisemos contigo, mira nuestro servicio de [desarrollo web](/servicios/desarrollo-web/) o [cuéntanos tu proyecto](/#cotizar): te respondemos en 6 a 24 horas.
