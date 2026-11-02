#!/usr/bin/env python3
"""Efectos de sonido sintetizados para el reel de BARCI. Uso: python3 sfx-barci.py salida.wav"""
import sys, wave
import numpy as np
SR = 44100; DUR = 19.4
out = np.zeros(int(SR * DUR)); rng = np.random.default_rng(7)
def poner(t, x, g=1.0):
    i = int(t * SR); j = min(len(out), i + len(x)); out[i:j] += x[: j - i] * g
def tono(f, d, dec=20, g=1.0):
    t = np.arange(int(SR * d)) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t * dec) * g
def barrido(d, f0, f1):
    t = np.arange(int(SR * d)) / SR; f = f0 + (f1 - f0) * t / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * 0.4
# «pop» suave al entrar cada rótulo (inicio de cada frase)
for t in (0.3, 2.0, 4.0, 6.4, 9.4, 12.6): poner(t, tono(880, 0.12, 30, 0.25)); poner(t, tono(1320, 0.08, 40, 0.12))
# cortina que sube en cada cambio de escena
for t in (2.0, 4.0, 6.4, 9.4, 12.6): poner(t - 0.05, barrido(0.5, 250, 1500), 0.4)
# cuatro semanas: una nota por casilla y un acorde al sello
for k, f in enumerate((523, 587, 659, 784)): poner(13.3 + k * 0.5, tono(f, 0.5, 6, 0.4))
poner(14.95, tono(1047, 0.5, 5, 0.35)); poner(14.95, tono(1568, 0.5, 6, 0.2))
# cierre
poner(15.55, barrido(0.5, 300, 1800), 0.5)
[poner(15.7, tono(f, 0.9, 4, g)) for f, g in ((196, .4), (392, .25), (587, .15))]
poner(17.65, tono(1568, 0.5, 8, 0.3)); poner(17.95, tono(2093, 0.4, 9, 0.2))
out = np.clip(out, -1, 1)
w = wave.open(sys.argv[1], "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767 * 0.8).astype(np.int16).tobytes()); w.close()
