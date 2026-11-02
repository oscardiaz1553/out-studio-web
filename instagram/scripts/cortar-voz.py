#!/usr/bin/env python3
"""Encuentra las frases de un audio de voz (ElevenLabs u otro) por sus silencios.

Uso: python3 instagram/scripts/cortar-voz.py audio.mp3 [umbral=0.012] [pausa_min=0.09]
Imprime los tramos (inicio, fin) en segundos. Con esos números se llena `a` y `b` de cada línea
en instagram/dialogo/plan.json (conviene dejar 20 a 40 ms de margen a cada lado).
Nota: ElevenLabs acorta las pausas de <break time="2s"/> a unos 0,4 s, pero sigue dejándolas.
"""
import subprocess, sys, tempfile, wave, array, math, os

src = sys.argv[1]
umbral = float(sys.argv[2]) if len(sys.argv) > 2 else 0.012
pausa = float(sys.argv[3]) if len(sys.argv) > 3 else 0.09
tmp = os.path.join(tempfile.gettempdir(), "cortar-voz.wav")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-ar", "44100", "-ac", "1", tmp], check=True)
w = wave.open(tmp); a = array.array("h"); a.frombytes(w.readframes(w.getnframes())); sr = w.getframerate()
h = sr // 100
activo = [math.sqrt(sum(v * v for v in a[i:i + h]) / h) / 32768 > umbral for i in range(0, len(a) - h, h)]
tramos, ini, ult = [], None, None
for i, x in enumerate(activo):
    t = i / 100
    if x:
        ini = t if ini is None else ini
        ult = t
    elif ini is not None and t - ult > pausa:
        tramos.append((ini, ult + 0.01)); ini = None
if ini is not None: tramos.append((ini, ult))
print("duración total: %.2f s" % (len(a) / sr))
for n, (s, e) in enumerate([t for t in tramos if t[1] - t[0] > 0.2], 1):
    print(f"{n:2d}  {s:6.2f} - {e:6.2f}   ({e - s:.2f} s)")
