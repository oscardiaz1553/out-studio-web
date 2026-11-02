#!/usr/bin/env python3
"""Efectos de sonido sintetizados para «La espera» (sin muestras). Uso: python3 sfx-espera.py salida.wav"""
import sys, wave
import numpy as np
SR = 44100; DUR = 16.0
out = np.zeros(int(SR * DUR)); rng = np.random.default_rng(5)
def poner(t, x, g=1.0):
    i = int(t * SR); j = min(len(out), i + len(x)); out[i:j] += x[: j - i] * g
def tono(f, d, dec=20, g=1.0):
    t = np.arange(int(SR * d)) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t * dec) * g
def clic(): return rng.normal(0, 1, int(SR * 0.03)) * np.exp(-np.arange(int(SR * 0.03)) / SR * 150) * 0.5
def barrido(d, f0, f1):
    t = np.arange(int(SR * d)) / SR; f = f0 + (f1 - f0) * t / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * 0.4
# toque en «Comprar» (el dedo llega a 1.9)
poner(1.95, tono(900, 0.12, 40, 0.5)); poner(1.95, clic())
# cargador: pulso suave que se repite (2.35 a 8.7)
for k in range(0, 20): poner(2.4 + k * 0.32, tono(330 + (k % 4) * 30, 0.2, 18, 0.12))
# reloj: tic tac durante «una hora después»
for k in range(0, 8): poner(4.15 + k * 0.17, tono(1800 if k % 2 else 1400, 0.04, 90, 0.35))
# whooshes de cámara (alineados a los planos)
for t, d in ((1.4, .35), (3.2, .35), (4.95, .65), (6.5, .45), (7.4, .45), (8.6, .4), (9.3, .3), (9.8, .3)): poner(t, barrido(d, 300, 1800), 0.55)
for k in range(24): poner(5.62 + k * 0.13, rng.normal(0, 1, int(SR * 0.12)) * np.exp(-np.arange(int(SR * 0.12)) / SR * 14) * 0.18)   # páginas de calendario
# lluvia (ruido filtrado) bajo la ventana
t = np.arange(int(SR * 1.2)) / SR; r = rng.normal(0, 1, len(t)) * 0.07 * np.sin(np.pi * t / 1.2); poner(7.6, np.convolve(r, np.ones(6) / 6, mode="same"))
# «ding» al cargar y golpe de «Agotado»
poner(9.45, tono(1320, 0.6, 5, 0.5)); poner(9.45, tono(1980, 0.6, 5, 0.25))
poner(9.58, tono(110, 0.6, 7, 0.9)); poner(9.58, rng.normal(0, 1, int(SR * 0.5)) * np.exp(-np.arange(int(SR * 0.5)) / SR * 30) * 0.4)
poner(9.72, barrido(0.4, 900, 180), 0.9)      # el susto de Mango
[poner(10.3, tono(f, 0.8, 4, g)) for f, g in ((196, .4), (392, .25), (587, .15))]
poner(14.12, tono(1568, 0.5, 8, 0.3)); poner(14.12, tono(2093, 0.4, 9, 0.18))
out = np.clip(out, -1, 1)
w = wave.open(sys.argv[1], "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767 * 0.8).astype(np.int16).tobytes()); w.close()
