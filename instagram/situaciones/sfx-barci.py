#!/usr/bin/env python3
"""Efectos de sonido sintetizados para el reel de BARCI (tiempos de la voz de voces/barci-narrador.mp3).
Uso: python3 sfx-barci.py salida.wav"""
import sys, wave
import numpy as np
SR = 44100; DUR = 19.0
L = [0.06, 1.66, 3.5, 6.19, 9.08, 12.54]       # inicio de cada frase
C0 = 15.4                                        # inicio del cierre
S0, PASO = L[5] + 0.35, 0.45                     # semanas
out = np.zeros(int(SR * DUR)); rng = np.random.default_rng(7)
def poner(t, x, g=1.0):
    i = int(t * SR); j = min(len(out), i + len(x)); out[i:j] += x[: j - i] * g
def tono(f, d, dec=20, g=1.0):
    t = np.arange(int(SR * d)) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t * dec) * g
def barrido(d, f0, f1):
    t = np.arange(int(SR * d)) / SR; f = f0 + (f1 - f0) * t / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * 0.4
for t in L: poner(t + 0.15, tono(880, 0.12, 30, 0.22)); poner(t + 0.15, tono(1320, 0.08, 40, 0.1))     # «pop» del rótulo
for t in L[1:]: poner(t - 0.05, barrido(0.5, 250, 1500), 0.4)                                            # cortina que sube
for k, f in enumerate((523, 587, 659, 784)): poner(S0 + k * PASO, tono(f, 0.5, 6, 0.4))                  # una nota por semana
poner(L[5] + 2.1, tono(1047, 0.5, 5, 0.35)); poner(L[5] + 2.1, tono(1568, 0.5, 6, 0.2))                  # sello «Al aire y vendiendo»
poner(C0 - 0.05, barrido(0.5, 300, 1800), 0.5)                                                           # cierre
[poner(C0 + 0.1, tono(f, 0.9, 4, g)) for f, g in ((196, .35), (392, .22), (587, .13))]
poner(C0 + 2.0, tono(1568, 0.5, 8, 0.3)); poner(C0 + 2.3, tono(2093, 0.4, 9, 0.2))
out = np.clip(out, -1, 1)
w = wave.open(sys.argv[1], "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767 * 0.8).astype(np.int16).tobytes()); w.close()
