---
name: reel-con-mango
description: Cuando se quiera hacer un reel o video corto de Out con Mango (la mascota, un orangután naranja con gafas de atardecer) animado en 2D estilo cutout: que hable o escuche, con lipsync por fonemas, expresiones de ojos y cejas, inbetweens, cámara por capas 2.5D, escenas con celulares y tiendas animadas, voces de ElevenLabs y música. Úsala también cuando el usuario diga "reel con Mango", "Mango hablando", "lipsync", "hoja de exposición", "animar a Mango" o "narrador y Mango". Cubre desde el guion y las voces hasta la portada y el texto de la publicación. Para el diseño del texto del post usa también copywriting; para el reel sin Mango, solo HyperFrames.
metadata:
  version: 1.0.0
---

# Reel con Mango

Método para hacer un reel de Out con Mango animado como en una animación 2D cutout: dibujos de boca y ojos que cambian a 2s (un dibujo cada 2 cuadros), lipsync por fonemas, inbetweens entre dibujos, cámara con profundidad y escenas de apoyo hechas en código. Salió del reel «La venta perdida» (`instagram/lote-4/`), que es el ejemplo completo y el punto de partida.

Quien anima es el usuario (animador 2D) y revisa cuadro a cuadro: las correcciones que dio están abajo como reglas. Léelas antes de tocar nada.

## Reglas de animación (el usuario las exigió, no se negocian)

1. **A 2s.** Todo lo de Mango (boca, ojos, cabeza, rotación, posición) se actualiza cada 2 cuadros, a 24 cuadros por segundo. Se probó a 4s y se prefirió 2s. La cámara, las partículas y los textos sí se mueven cada cuadro.
2. **Lipsync por fonemas.** Fonemas principales: a, e, i, o, u, d, t, s, m, p (más b y f). Cada vez que suena uno, **dos cuadros antes** entra su dibujo. Los demás sonidos (n, l, r, k, g, j) no cambian la boca. Un dibujo dura mínimo 3 cuadros; si dos claves caen más juntas gana la de más peso (vocales primero).
3. **Inbetweens entre claves.** Entre dos dibujos de boca se meten hasta dos intermedios generados por flujo óptico, en los cuadros previos a la clave. No hay inbetween si las claves están pegadas.
4. **Parpadeo al cambiar de expresión.** Entreabiertos, cerrado, la nueva expresión. Tapa el cambio de dibujo.
5. **Boca cerrada (M) siempre que Mango no habla.** Aunque la hoja diga otra cosa.
6. **Los ojos siempre se ven.** Solo se usan los dibujos donde se ven los ojos: ojos-abiertos, entreabiertos, mirada-izq, mirada-der, mirada-arriba y parpadeo. Los otros 14 (normal, feliz, sorprendido, enojado, triste, serio, mirada-abajo, guiños y cejas) muestran solo el reflejo de las gafas, y pasar de uno a otro se lee como un salto.
7. **Base: ojos entreabiertos.** Los ojos completamente abiertos solo cuando haga falta (sorpresa, golpe de la escena, énfasis del cierre).
8. **Sin squash and stretch.** Se probó y no gustó: la escala de Mango es siempre uniforme.
9. **Mango nunca desaparece ni salta.** Sigue una ruta continua entre escenas con ease in-out, la cámara lo afecta poco (factor 0.35) y nunca sale de cuadro. Prohibido recolocarlo con un salto instantáneo o hacerlo entrar desde fuera de cuadro.
10. **Ningún texto se pisa con otro elemento.** Revisa cada subtítulo contra los íconos, montos y tarjetas con capturas de cuadros; el zoom de cámara mueve las capas.
11. **Voces:** el narrador cuenta; Mango habla poco (en «La venta perdida» solo dice «Escríbenos.»). Cuando Mango no habla escucha: mira al narrador y asiente.

## Piezas (todo está en el repo)

| Qué | Dónde |
|---|---|
| Ilustración base de Mango sin boca | `instagram/mango2d/mango-sin-boca.png` (original: `design-src/mono/ilustrado/mango-ilustrado.png`) |
| 20 bocas y 20 ojos/cejas encajados en la cara | `instagram/mango2d/bocas/`, `instagram/mango2d/ojos/` |
| Rig en el navegador (giro 2.5D con WebGL, capas) | `instagram/mango2d/rig.js` |
| Plantilla del reel (escenas, ruta de Mango, cámara, partículas) | `instagram/mango2d/reel.html` |
| Renderizador cuadro a cuadro | `instagram/mango2d/grabar.cjs` |
| Inbetweens de boca | `instagram/mango2d/inbetweens.py` |
| Hoja de exposición (editor, artefacto con base de datos) | `instagram/mango2d/hoja/index.html` |
| Cortar voces, plan, mezcla | `instagram/scripts/cortar-voz.py`, `dialogo.py`, `instagram/dialogo/plan.json` |
| Fonemas del texto en el audio | `instagram/scripts/alinear-fonemas.py` |
| Claves de boca por la regla de los fonemas | `instagram/scripts/claves-fonemas.py` |
| Música y efectos | `instagram/scripts/musica-reel.py`, `sfx-reel.py` |
| Revisión automática de cuadros | `instagram/scripts/revisar-reel.py` |

Si cambia el arte de Mango (nueva ilustración u hoja de bocas), se vuelve a encajar con `bocas_hoja.py` y `ojos_hoja.py` (alinean por las fosas nasales y por los lentes; ver `references/pipeline.md`).

## Flujo de trabajo

Pon cada reel en su propia carpeta de datos (`instagram/dialogo/<reel>/`, `instagram/voces/`). Detalle y comandos en `references/pipeline.md`.

1. **Guion y escenas.** Quién dice cada frase y qué muestra cada escena. Mango habla poco.
2. **Voces.** El usuario las genera en ElevenLabs (nunca pidas ni uses sus cuentas ni claves): una por personaje, con las frases en orden y `<break time="2s" />` entre ellas. Guarda los mp3 en `instagram/voces/`. ElevenLabs pide plan de pago para uso comercial: avísalo antes de publicar.
3. **Cortar y acomodar.** `cortar-voz.py` da los tramos; `plan.json` dice qué tramo va en qué segundo (ajustado a las escenas); `dialogo.py` arma `dialogo.wav`, `mango.wav`, `narrador.wav` y `eventos.json`.
4. **Lipsync.** `alinear-fonemas.py` ubica los fonemas de las frases de Mango; `claves-fonemas.py ... 24 2` arma las claves a 2s; los ojos se escriben a mano (base entreabiertos) en la hoja.
5. **Hoja de exposición.** Publica `hoja/index.html` como artefacto con `capabilities {db: {}}`, cambia `HOJA_ID` y la lista `EV`, y siembra el documento `hojas/<id>` con `ArtifactData`. El usuario corrige ahí las claves. **Antes de sobrescribir lee la versión**: si cambió, es trabajo del usuario y no se pisa.
6. **Inbetweens.** `inbetweens.py hoja.json inb` (recalcular cada vez que cambien las claves de boca).
7. **Reel.** Copia `reel.html` a un archivo nuevo, cambia escenas, textos, `RUTA` de Mango y expresiones; renderiza con `grabar.cjs`; mezcla con ffmpeg (receta en `references/pipeline.md`).
8. **Revisión.** `revisar-reel.py` sobre los cuadros, tiras de cuadros del video completo (transiciones, subtítulos contra elementos, ojos visibles) y el reel final al usuario. Pide opinión sobre lo que de verdad es de gusto (ritmo, expresiones), no sobre fallos que puedes encontrar tú.
9. **Entrega.** Portada y texto de la publicación según `instagram/lote-4/textos.md` como modelo.

## Trampas que ya costaron tiempo

- ElevenLabs recorta las pausas: no cuentes con 2 s, corta por silencios.
- El renderizado con WebGL va en CPU (SwiftShader): un reel de 28 s a 1080 × 1920 tarda unos 2 minutos.
- La boca, los ojos y la base se componen en un solo dibujo **antes** del giro 2.5D. Si se superponen como capas sueltas con paralaje, la boca se tuerce al girar la cara.
- `python3` del proyecto es 3.11 (con `bpy` 5, numpy 1.x y opencv instalados con `python3 -m pip`); `pip` a secas instala en otra versión.
- `alinear-fonemas.py` necesita que el texto de `eventos.json` sea exactamente lo que se oye. Es un alineamiento aproximado: puede errar uno o dos cuadros en vocales rápidas; se corrige en la hoja.
- Los efectos y la música (`musica-reel.py`, `sfx-reel.py`) están marcados en segundos del reel de «La venta perdida»: para otro reel hay que reajustar esos tiempos.
- Cumple el estilo de Out: sin emojis, sin pastel rosado ni azul claro, números sin enumerar, el texto del botón del color del fondo donde está.
