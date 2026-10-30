#!/usr/bin/env python3
"""Curva de volumen de una voz, para mover la boca de Mango.

Uso:
  python3 instagram/scripts/envolvente-voz.py voz.wav > env.json

Lee un audio (wav mono) y escribe una lista JSON con un valor de 0 a 1 por cada
cuadro del video (30 por segundo): 0 es boca casi cerrada y 1 boca abierta. Pega
la lista en la constante ENV de instagram/hyperframes/reel-venta-perdida-mango/index.html
y vuelve a renderizar. Sirve con cualquier voz: la de Oscar con otro tono, una voz
de IA o una locución.
"""
import array, json, math, sys, wave

FPS = 30
w = wave.open(sys.argv[1])
a = array.array("h")
a.frombytes(w.readframes(w.getnframes()))
sr = w.getframerate()
n = int(len(a) / sr * FPS) + 3
win = int(sr * 0.03)
raw = []
for i in range(n):
    c = int(i / FPS * sr)
    seg = a[max(0, c - win // 2):c + win // 2]
    rms = math.sqrt(sum(v * v for v in seg) / len(seg)) / 32768 if seg else 1e-5
    raw.append(20 * math.log10(rms + 1e-9))
voz = sorted(d for d in raw if d > -50)
lo, hi = voz[int(len(voz) * 0.15)], voz[int(len(voz) * 0.92)]
env, prev = [], 0.0
for d in raw:
    v = min(1, max(0, (d - lo) / (hi - lo))) ** 1.15
    prev = max(v, prev * 0.5)   # ataque rápido y caída suave, para que la boca no parpadee
    env.append(round(prev, 2))
print(json.dumps(env, separators=(",", ":")))
