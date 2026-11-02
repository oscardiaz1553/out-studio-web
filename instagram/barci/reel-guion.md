# Reel de BARCI con Mango: guion y cómo se hace

Mango no habla (solo escucha, boca cerrada). El narrador dice todo. La tienda que se ve en el celular es la
captura real de barci.com.co; el cuarto y las casillas de las semanas están hechos con código.

## Guion para ElevenLabs (voz del narrador)

```
Esta es BARCI. <break time="2s" /> Moda femenina colombiana. <break time="2s" /> Básicos, cápsulas y accesorios. <break time="2s" /> Una marca que no cabe en una sola forma. <break time="2s" /> Y una cápsula con personalidad propia: Brava. <break time="2s" /> Su tienda estaba vendiendo a las cuatro semanas. <break time="2s" /> ¿Tu marca necesita la suya? <break time="2s" /> Escríbenos.
```

Guarda el mp3 como `instagram/voces/barci-narrador.mp3`. Con ese audio se ajustan los tiempos `E.l` de
`instagram/mango2d/reel-barci.html` (cada frase y el cierre) y se mezcla.

## Qué pasa en pantalla

| Frase | Pantalla |
|---|---|
| Esta es BARCI. | Hero de la tienda en el celular. Mango mira el celular. |
| Moda femenina colombiana. | Sigue el hero. |
| Básicos, cápsulas y accesorios. | La pantalla baja a «Colecciones». |
| Una marca que no cabe en una sola forma. | Baja a «Tu estilo no tiene que encajar en una categoría». |
| Y una cápsula con personalidad propia: Brava. | Baja al banner de Brava. |
| Su tienda estaba vendiendo a las cuatro semanas. | Mango se voltea a cámara con los ojos abiertos; cuatro casillas (S1 a S4) se encienden y sale «Al aire y vendiendo». |
| ¿Tu marca necesita la suya? / Escríbenos. | Tarjeta azul con las palabras en movimiento y el botón outstudio.online. |

## Archivos

- Escena: `instagram/mango2d/reel-barci.html` (usa `assets/barci-home.jpg`, la captura larga de la home en celular).
- Efectos: `instagram/situaciones/sfx-barci.py`.
- Capturas: `instagram/barci/larga.cjs` (captura larga) y `capturar.cjs` / `secciones.cjs` (el resto).
- Render: `cd instagram/mango2d && PAGINA=reel-barci.html NODE_PATH=$(npm root -g) node grabar.cjs <vacio.json> <ev-vacio.json> <carpeta> 19.4 24`, y ffmpeg con voz y efectos como en La espera.
