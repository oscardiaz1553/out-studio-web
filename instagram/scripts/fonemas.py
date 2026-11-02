#!/usr/bin/env python3
"""Boca de Mango según lo que se dice, no solo según el volumen.

Uso: python3 instagram/scripts/fonemas.py voz.wav [fps] > bocas.json
Para cada dibujo (12 por segundo por defecto) elige una de seis bocas:
  0 cerrada   1 rendija   2 media   3 abierta   4 a_tope   5 o
Reglas (español: cinco vocales):
  a  -> abierta (a_tope si es un acento fuerte)     e  -> media
  i  -> rendija (sonrisa estrecha)                  o, u -> «o»
  s, f, z, ch (sonidos de aire) -> rendija          m, b, p y pausas (caídas de energía) -> cerrada
Las vocales se reconocen por los dos primeros formantes (LPC), el tipo de sonido por energía y
cruces por cero. No hay reconocimiento de voz: es una aproximación que se ve natural a 12 cps.
"""
import json, sys, wave
import numpy as np
from scipy.linalg import solve_toeplitz
from scipy.signal import resample_poly

ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
NOMBRES = "--nombres" in sys.argv          # salida con nombres de boca de la hoja (m, pb, a, e, i, o, u, sz, h)
ARCHIVO = ARGS[0]
FPS = int(ARGS[1]) if len(ARGS) > 1 else 12

w = wave.open(ARCHIVO)
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
sr = w.getframerate()
if w.getnchannels() > 1:
    x = x.reshape(-1, w.getnchannels()).mean(axis=1)
x = resample_poly(x, 11025, sr); sr = 11025
x = np.append(x[0], x[1:] - 0.97 * x[:-1])          # pre-énfasis

H = int(sr * 0.010)                                    # paso de 10 ms
V = int(sr * 0.030)                                    # ventana de 30 ms
n = (len(x) - V) // H
rms = np.zeros(n); zcr = np.zeros(n); F = np.zeros((n, 2))
for i in range(n):
    s = x[i * H:i * H + V] * np.hamming(V)
    rms[i] = np.sqrt(np.mean(s ** 2))
    zcr[i] = np.mean(np.abs(np.diff(np.sign(s)))) / 2
    if rms[i] < 1e-4:
        continue
    r = np.correlate(s, s, "full")[V - 1:V + 12]
    try:
        a = solve_toeplitz(r[:12] + np.eye(12)[0] * r[0] * 1e-4, r[1:13])
    except Exception:
        continue
    roots = [z for z in np.roots(np.r_[1, -a]) if z.imag > 0.01]
    fr = sorted((np.angle(z) * sr / (2 * np.pi), -np.log(abs(z)) * sr / np.pi) for z in roots)
    fr = [f for f, bw in fr if f > 220 and bw < 450]
    if len(fr) >= 2:
        F[i] = fr[0], fr[1]

db = 20 * np.log10(rms + 1e-9)
voz = db[db > -62]
if len(voz) == 0:
    print(json.dumps({"fps": FPS, "estados": []})); sys.exit()
techo = np.percentile(voz, 95); piso = techo - 32
nivel = np.clip((db - piso) / (techo - piso), 0, 1)
# energía local: las caídas entre sílabas cierran la boca
from scipy.ndimage import maximum_filter1d, median_filter
F = np.stack([median_filter(F[:, 0], 7), median_filter(F[:, 1], 7)], axis=1)
pico = maximum_filter1d(nivel, size=28)               # pico de ±140 ms
valle = nivel < 0.52 * pico

def vocal(f1, f2):
    if f1 == 0:
        return "?"
    # centros aproximados (Hz): a 800/1300, e 500/1900, i 300/2200, o 500/900, u 320/800
    cs = {"a": (780, 1350), "e": (520, 1850), "i": (330, 2150), "o": (520, 950), "u": (340, 850)}
    return min(cs, key=lambda k: ((f1 - cs[k][0]) / 250) ** 2 + ((f2 - cs[k][1]) / 450) ** 2)

est = np.zeros(n, dtype=int)
for i in range(n):
    if nivel[i] < 0.12:
        est[i] = 0
    elif valle[i]:
        est[i] = (8 if NOMBRES else 0) if nivel[i] < 0.35 else 1
    elif zcr[i] > 0.6:                      # sonidos de aire: s, f, z
        est[i] = 7 if NOMBRES else 1
    else:
        v = vocal(*F[i])
        fuerte = nivel[i] > 0.82
        est[i] = {"a": 4 if fuerte else 3, "e": 2, "i": 1, "o": 5, "u": 6 if NOMBRES else 5, "?": 2}[v]

# a doces: un dibujo cada 1/FPS, gana el estado más repetido ponderado por volumen
paso = int(round(100 / FPS))
sal = []
for k in range(0, n, paso):
    seg = est[k:k + paso]; pes = nivel[k:k + paso] + 0.05
    sc = np.zeros(9)
    for e, p in zip(seg, pes):
        sc[e] += p
    sal.append(int(sc.argmax()))
if NOMBRES:
    N = ["m", "i", "e", "a", "h", "o", "u", "sz", "pb"]
    print(json.dumps({"fps": FPS, "bocas": [N[k] for k in sal]}))
else:
    print(json.dumps({"fps": FPS, "estados": sal}))
