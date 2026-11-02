# Reel de BARCI con Mango: guion y cómo se hace

Mango no habla (solo escucha, boca cerrada). El narrador dice todo. Las fotos y el logo son los reales de barci.com.co; todo lo demás está hecho con código.

## Guion para ElevenLabs (voz del narrador)

```
Esta es BARCI. <break time="2s" /> Moda femenina colombiana. <break time="2s" /> Básicos, cápsulas y accesorios. <break time="2s" /> Una marca que no cabe en una sola forma. <break time="2s" /> Y una cápsula con personalidad propia: Brava. <break time="2s" /> Su tienda estaba vendiendo a las cuatro semanas. <break time="2s" /> ¿Tu marca necesita la suya? <break time="2s" /> Escríbenos.
```

Guarda el mp3 como `instagram/voces/barci-narrador.mp3`. Con ese audio se ajustan los tiempos `E.l` de
`instagram/mango2d/reel-barci.html` (cada frase y el cierre) y se mezcla.

## Qué pasa en pantalla

Todo son motion graphics sobre fondos lisos con la paleta de BARCI (café, crema, taupe), con las fotos reales de
la tienda. Mango es el único cutout: asoma desde abajo, mira lo que se muestra y reacciona a las 4 semanas.

| Frase | Pantalla |
|---|---|
| Esta es BARCI. | Logo con el símbolo (flor de infinito) girando detrás y «Infinitas formas de ser tú». |
| Moda femenina colombiana. | Tres fotos de producto entran de lado y una banda «Envíos a toda Colombia · Hecho en Colombia» corre. |
| Básicos, cápsulas y accesorios. | Tres tarjetas (Básicos, Cápsulas, Accesorios) aparecen una a una. |
| Una marca que no cabe en una sola forma. | La frase «Tu estilo no tiene que encajar en una categoría: tiene que sentirse tuyo.» y una tira de productos que no para. |
| Y una cápsula con personalidad propia: Brava. | Banner de Brava y cuatro productos de la cápsula. |
| Su tienda estaba vendiendo a las cuatro semanas. | Contador 1 a 4 semanas con línea de tiempo y sello «Al aire y vendiendo». Mango se voltea con los ojos abiertos. |
| ¿Tu marca necesita la suya? / Escríbenos. | Tarjeta azul de Out con las palabras en movimiento y el botón outstudio.online. |

## Archivos

- Escena: `instagram/mango2d/reel-barci.html` (usa las fotos y el logo de barci.com.co guardados en `instagram/mango2d/assets/barci/`).
- Efectos: `instagram/situaciones/sfx-barci.py`.
- Capturas de la web (usadas en el carrusel): `instagram/barci/capturar.cjs`, `secciones.cjs` y `larga.cjs`.
- Render: `cd instagram/mango2d && PAGINA=reel-barci.html NODE_PATH=$(npm root -g) node grabar.cjs <vacio.json> <ev-vacio.json> <carpeta> 19.4 24`, y ffmpeg con voz y efectos como en La espera.
