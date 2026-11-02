#!/usr/bin/env python3
"""Efectos de sonido sintetizados para «La espera» (sin muestras). Uso: python3 sfx-espera.py salida.wav"""
import sys, wave
import numpy as np
SR = 44100; DUR = 18.0
out = np.zeros(int(SR * DUR)); rng = np.random.default_rng(5)
def poner(t, x, g=1.0):
    i = int(t * SR); j = min(len(out), i + len(x)); out[i:j] += x[: j - i] * g
def tono(f, d, dec=20, g=1.0):
    t = np.arange(int(SR * d)) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t * dec) * g
def clic(): return rng.normal(0, 1, int(SR * 0.03)) * np.exp(-np.arange(int(SR * 0.03)) / SR * 150) * 0.5
def barrido(d, f0, f1):
    t = np.arange(int(SR * d)) / SR; f = f0 + (f1 - f0) * t / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * 0.4
# toque en «Comprar»
poner(3.0, tono(900, 0.12, 40, 0.5)); poner(3.0, clic())
# cargador: pulso suave que se repite
for k in range(0, 40): poner(3.4 + k * 0.32, tono(330 + (k % 4) * 30, 0.2, 18, 0.12))
# reloj: tic tac durante «una hora después»
for k in range(0, 8): poner(4.0 + k * 0.2, tono(1800 if k % 2 else 1400, 0.04, 90, 0.35))
# paso del tiempo: barridos cada día y cada estación
for t in (5.5, 9.0): poner(t, barrido(0.6, 200, 1400), 0.8)
for k in range(24): poner(5.8 + k * 0.3, rng.normal(0, 1, int(SR * 0.18)) * np.exp(-np.arange(int(SR * 0.18)) / SR * 14) * 0.18)   # páginas de calendario
# lluvia (ruido filtrado) 9.6 a 10.9
t = np.arange(int(SR * 1.3)) / SR; r = rng.normal(0, 1, len(t)) * 0.07 * np.sin(np.pi * t / 1.3); poner(9.6, np.convolve(r, np.ones(6) / 6, mode="same"))
# «ding» al cargar y golpe de «Agotado»
poner(13.0, tono(1320, 0.8, 5, 0.5)); poner(13.0, tono(1980, 0.8, 5, 0.25))
poner(13.55, tono(110, 0.6, 7, 0.9)); poner(13.55, rng.normal(0, 1, int(SR * 0.6)) * np.exp(-np.arange(int(SR * 0.6)) / SR * 30) * 0.4)
poner(14.0, barrido(0.5, 900, 180), 0.9)      # el susto de Mango
[poner(16.0, tono(f, 0.9, 4, g)) for f, g in ((196, .5), (392, .3), (587, .2))]
poner(16.8, tono(1568, 0.5, 8, 0.3))
out = np.clip(out, -1, 1)
w = wave.open(sys.argv[1], "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767 * 0.8).astype(np.int16).tobytes()); w.close()
