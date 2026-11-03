# Pipeline de un reel con Mango, paso a paso

Todos los comandos se corren desde la raíz del repositorio. Sustituye `<reel>` por el nombre del reel y `$T` por una carpeta de trabajo (por ejemplo, una temporal fuera del repo).

## 1. Voces

El usuario genera en ElevenLabs un audio por personaje con todas sus frases en orden, separadas por pausas:

```
Frase uno. <break time="2s" /> Frase dos. <break time="2s" /> Frase tres.
```

Si el modelo no acepta `<break>`, párrafos separados o una toma por frase. Guarda los mp3 en `instagram/voces/` (ya están `narrador.mp3`, `narrador2.mp3` y `mango.mp3` de «La venta perdida»).

```
python3 instagram/scripts/cortar-voz.py instagram/voces/narrador2.mp3
```

Imprime los tramos de cada frase. Usa esos números, con 20 a 40 ms de margen a cada lado, como `a` y `b` en el plan.

## 2. Plan de cortes y mezcla de voces

`instagram/dialogo/plan.json`:

```json
{ "duracion": 28.6,
  "lineas": [
    { "voz": "narrador", "archivo": "narrador2", "a": 0.02, "b": 0.80, "t": 2.30, "texto": "Mira qué pasó." },
    { "voz": "mango", "a": 7.48, "b": 8.28, "t": 27.20, "texto": "Escríbenos." } ] }
```

`a` y `b`: segundos dentro del mp3. `t`: segundo del reel donde entra. `archivo`: mp3 de `instagram/voces/` (por defecto, el nombre de la voz). `texto` debe ser exactamente lo que se oye.

```
python3 instagram/scripts/dialogo.py instagram/dialogo/plan.json $T
```

Escribe `narrador.wav`, `mango.wav`, `dialogo.wav` (mezcla a -16 LUFS) y `eventos.json` (voz, inicio, fin y texto de cada frase). El reel lee `eventos.json`: lo que sale en pantalla se busca por el texto de la frase, no por la posición.

## 3. Lipsync

```
python3 instagram/scripts/alinear-fonemas.py $T/mango.wav $T/eventos.json $T/fonemas.json
python3 instagram/scripts/claves-fonemas.py $T/fonemas.json hoja-ojos.json $T/hoja.json 24 2
```

- `alinear-fonemas.py` convierte el texto a fonemas del español y los ubica con Viterbi sobre energía, aire (s, f), voz y formantes. Solo procesa las líneas con `"voz": "mango"`.
- `claves-fonemas.py fonemas.json hoja-ojos.json salida.json fps rejilla`: dibujo de cada fonema principal dos cuadros antes del sonido, cierre (M) al final de cada frase, mínimo 3 cuadros por dibujo, claves en la rejilla de 2. De `hoja-ojos.json` solo toma las claves de ojos y cejas (formato: `{"ojos": {"<cuadro>": "<dibujo>"}}`; ejemplo vivo en `instagram/dialogo/hoja-venta-perdida.json`).

Formato de la hoja: `{ "fps": 24, "bocas": {"<cuadro>": "<boca>"}, "ojos": {"<cuadro>": "<ojos>"} }`. Cada clave se mantiene hasta la siguiente. Bocas: m, pb, a, e, i, o, u, dt, fv, sz, l, r, ch, j, kg, q, n, th, w, h. Ojos permitidos: ojos-abiertos, entreabiertos, mirada-izq, mirada-der, mirada-arriba, parpadeo.

## 4. Hoja de exposición (revisión del animador)

1. Arma la carpeta del artefacto:
   `python3 instagram/mango2d/hoja/preparar.py $T/eventos.json $T/dialogo.wav <hoja_id> $T/hoja`
   Copia `index.html` con el id de la hoja y las frases del reel, y deja junto a él el audio y las imágenes a mitad de tamaño.
2. Publica `$T/hoja/index.html` con la herramienta Artifact (`root` = `$T/hoja`, `files` con todos los archivos de la carpeta) y `capabilities: {"db": {}}`.
3. Siembra `hojas/<HOJA_ID>` con `ArtifactData` (`set`, con la hoja) la primera vez. Después, **lee la versión** antes de escribir; si el usuario ya editó, no lo pises.
4. El usuario ajusta claves a 2s (botón de rejilla: 2, 4 o cuadro a cuadro). Lee el documento con `ArtifactData get` para renderizar.

## 5. Inbetweens

```
python3 instagram/mango2d/inbetweens.py hoja.json instagram/mango2d/inb
```

Genera `inb/boca-<a>__<b>__1.png` y `__2.png` (a 1/3 y 2/3) y `inb/manifest.json`. Se recalculan cada vez que cambian las claves de boca.

## 6. El reel

1. Copia `instagram/mango2d/reel.html` a `instagram/mango2d/reel-<reel>.html` y edita:
   - **Escenas** (función `construir()`): decorados en HTML y tiempos. Cada escena empieza con un cambio de color en círculo (`flip`) y termina con líneas de velocidad (`speed`).
   - **`RUTA`**: posiciones de Mango (tiempo, x, y, escala, rotación). Debe ser continua; no lo recoloques con saltos.
   - **Subtítulos**: `caption(...)` y `capLibre(...)` con el evento de la frase (se buscan con `buscar("inicio del texto")`).
   - **Expresiones de ojos**: la línea de tiempo se escribe en la hoja (`ojos`), base entreabiertos.
2. Renderiza (cuadros JPG a 24 por segundo):

```
cd instagram/mango2d
echo '{"estados": []}' > $T/vacio.json     # argumento heredado; no se usa con hoja
HOJA=$T/hoja.json PAGINA=reel-<reel>.html node grabar.cjs $T/vacio.json $T/eventos.json $T/cuadros 28.6 24
```

`grabar.cjs` usa Chromium con WebGL por software; `PAGINA` es el HTML, `HOJA` las claves. Un cuarto argumento extra (`desde`) permite renderizar solo un tramo para probar.

3. Mezcla y codifica:

```
ffmpeg -framerate 24 -i $T/cuadros/f_%04d.jpg -i $T/dialogo.wav -i musica.wav -i sfx.wav \
 -filter_complex "[1:a]aformat=channel_layouts=stereo,asplit=2[v][vk];[2:a]volume=0.42[m];\
[m][vk]sidechaincompress=threshold=0.02:ratio=8:attack=15:release=350[md];[3:a]volume=0.55[fx];\
[v][md][fx]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-15:TP=-1.5:LRA=9[a]" \
 -map 0:v -map "[a]" -c:v libx264 -pix_fmt yuv420p -crf 19 -preset slow -c:a aac -b:a 192k -ar 48000 -t 28.6 reel.mp4
```

La música baja sola cuando hablan las voces.

## 7. Revisión

```
python3 instagram/scripts/revisar-reel.py $T/cuadros 24
```

Detecta Mango que desaparece, salta o sale de cuadro. Después, tiras de cuadros (ffmpeg `select` + `tile`) de: cada transición entre escenas, cada subtítulo contra los elementos de su escena, la cara en los cuadros de cada frase de Mango y una muestra cada segundo para comprobar que los ojos se ven.

## Cambiar el arte de Mango

Si cambian la ilustración o las hojas de bocas y ojos: quita la boca de la ilustración (rellenando la piel), y vuelve a correr `instagram/mango2d/bocas_hoja.py` y `ojos_hoja.py` (alinean cada dibujo de la hoja con la cara por las fosas nasales y por los lentes, igualan el tono de la piel y suavizan los bordes). Revisa las constantes de posición al principio de cada script.

## 8. Situaciones y casos en código (La espera, BARCI)

Plantillas: `instagram/mango2d/espera.html` y `reel-barci.html`. Ambas exponen `window.cargar()` y `window.render(t)` y se graban igual que el reel (el argumento `bocas.json` y `eventos.json` son heredados y van vacíos).

```
T=$SCRATCH; echo '{"estados": []}' > $T/vacio.json; echo '[]' > $T/ev-vacio.json
cd instagram/mango2d
PAGINA=reel-barci.html NODE_PATH=$(npm root -g) node grabar.cjs $T/vacio.json $T/ev-vacio.json $T/cuadros 19.0 24
```

1. **Voz.** Guarda el mp3 en `instagram/voces/<reel>-narrador.mp3`. `python3 instagram/scripts/cortar-voz.py <mp3> 0.012 0.2` da cada frase (inicio y fin). Una frase con dos puntos puede salir en dos tramos.
2. **Marcas de tiempo.** En el HTML, un objeto `E` con el inicio de cada frase (`E.l` en `reel-barci.html`, `E.cuelga`, `E.hora`… en `espera.html`). Cada escena, rótulo, contador y palabra del cierre cuelga de esas marcas.
3. **Efectos.** `instagram/situaciones/sfx-<reel>.py salida.wav`, con las mismas marcas: pop en cada rótulo, whoosh en cada cortina o movimiento de cámara, una nota por paso de un contador, acordes en el cierre.
4. **Mezcla** (voz y efectos; el efecto baja cuando habla el narrador):

```
ffmpeg -framerate 24 -i $T/cuadros/f_%04d.jpg -i voz.mp3 -i sfx.wav -filter_complex \
 "[1:a]loudnorm=I=-16:TP=-1.5:LRA=7,apad=whole_dur=19.0,asplit=2[v][vs];[2:a]volume=0.55,atrim=0:19.0[s];\
 [s][vs]sidechaincompress=threshold=0.03:ratio=6:attack=5:release=250[sd];\
 [v][sd]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-15:TP=-1.5:LRA=9[a]" \
 -map 0:v -map "[a]" -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -b:a 192k -t 19.0 reel.mp4
```

5. **Revisión.** Hojas de contactos de cuadros (ffmpeg `select` + `tile`) de todo el reel y tiras más densas de las transiciones y del lapso de tiempo (crecimiento y objetos que aparecen). `revisar-reel.py` está pensado para el reel con ruta de Mango y no aplica cuando la cámara saca a Mango de cuadro a propósito.
6. **Portada.** `portada-espera.cjs` y `portada-barci.cjs` renderizan un instante de la escena y reemplazan el título; deja el título dentro del centro 4:5 (y 285 a 1635 de 1920).
7. **Fotos de un cliente.** Descárgalas del CDN de su tienda con el ancho que necesites (por ejemplo `?width=900`) a `instagram/mango2d/assets/<cliente>/`; capturas de la web en `instagram/<cliente>/` (`capturar.cjs`, `secciones.cjs`, `larga.cjs` de BARCI son el modelo). Si el dominio no resuelve, hay que permitirlo en la red del entorno de la sesión.
