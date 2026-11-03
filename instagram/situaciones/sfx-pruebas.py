#!/usr/bin/env python3
"""Efectos de sonido sintetizados para «Tres pruebas gratis». Uso: python3 sfx-pruebas.py salida.wav
Los tiempos T son los de instagram/mango2d/reel-pruebas.html (se actualizan con la voz)."""
import sys, wave
import numpy as np
SR = 44100
T = dict(hook=0.1, cinco=3.8, queVenden=5.9, noLoDice=9.3, celular=11.8, datos=13.7, zoom=15.9, veloz=19.6, enlace=21.8, nota=24.6, cierre=28.3, fin=33.4)
DUR = T["fin"] + 0.5
out = np.zeros(int(SR * DUR)); rng = np.random.default_rng(11)
def poner(t, x, g=1.0):
    i = int(t * SR); j = min(len(out), i + len(x)); out[i:j] += x[: j - i] * g
def tono(f, d, dec=20, g=1.0):
    t = np.arange(int(SR * d)) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t * dec) * g
def barrido(d, f0, f1):
    t = np.arange(int(SR * d)) / SR; f = f0 + (f1 - f0) * t / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * 0.4
def clic(g=0.4): return rng.normal(0, 1, int(SR * 0.025)) * np.exp(-np.arange(int(SR * 0.025)) / SR * 160) * g
# rótulos y cortinas
for t in (0.1, T["cinco"], T["queVenden"], T["noLoDice"], T["celular"], T["datos"], T["zoom"], T["veloz"], T["enlace"], T["nota"]): poner(t + 0.15, tono(880, 0.12, 30, 0.2)); poner(t + 0.15, tono(1320, 0.08, 40, 0.1))
for t in (T["cinco"], T["queVenden"], T["celular"], T["veloz"]): poner(t - 0.05, barrido(0.5, 250, 1500), 0.4)
# gancho: el visto bueno aparece y se va; los nombres de las pruebas
poner(1.35, tono(1047, 0.4, 7, 0.35)); poner(1.35, tono(1568, 0.4, 8, 0.2)); poner(2.4, barrido(0.25, 900, 300), 0.3)
for k in range(3): poner(2.3 + k * 0.35 + 0.05, tono(660 + 110 * k, 0.12, 25, 0.25))
# cuenta regresiva: un tic por segundo
for k in range(5): poner(T["cinco"] + 0.2 + k * 0.3, tono(1000 - k * 60, 0.08, 40, 0.4)); poner(T["cinco"] + 0.2 + k * 0.3, clic(0.2))
poner(T["cinco"] + 1.7, tono(440, 0.5, 5, 0.3))
# ¿qué venden?: la tarjeta se va, burbujas
poner(T["queVenden"] + 1.5, barrido(0.35, 1200, 300), 0.35); poner(T["queVenden"] + 2.0, tono(500, 0.15, 20, 0.3)); poner(T["queVenden"] + 2.5, tono(740, 0.12, 22, 0.3)); poner(T["noLoDice"] + 0.2, tono(300, 0.3, 10, 0.3))
# celular: interruptores, carga lenta, zoom
poner(T["datos"] + 0.4, clic(0.5)); poner(T["datos"] + 0.9, clic(0.5)); poner(T["datos"] + 0.9, tono(880, 0.1, 30, 0.25))
for k in range(5): poner(T["zoom"] + 0.2 + k * 0.28, tono(330 + (k % 3) * 30, 0.2, 14, 0.12))
poner(T["zoom"] + 1.4, tono(988, 0.3, 8, 0.25)); poner(T["zoom"] + 1.9, barrido(1.4, 400, 1200), 0.18)
# velocidad: teclas, clic y medidor que sube
for k in range(12): poner(T["enlace"] + 1.2 + k * 0.09, clic(0.45))
poner(T["enlace"] + 2.0, tono(900, 0.1, 40, 0.4)); poner(T["enlace"] + 2.0, clic(0.5))
poner(T["nota"], barrido(2.4, 300, 1800), 0.3)
for k, f in enumerate((523, 659, 784, 1047)): poner(T["nota"] + 2.2 + k * 0.1, tono(f, 0.7, 5, 0.3))
# cierre
poner(T["cierre"] - 0.05, barrido(0.5, 300, 1800), 0.5)
[poner(T["cierre"] + 0.1, tono(f, 0.9, 4, g)) for f, g in ((196, .35), (392, .22), (587, .13))]
poner(T["cierre"] + 2.4, tono(1568, 0.5, 8, 0.3)); poner(T["cierre"] + 2.8, tono(2093, 0.4, 9, 0.2))
out = np.clip(out, -1, 1)
w = wave.open(sys.argv[1], "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767 * 0.8).astype(np.int16).tobytes()); w.close()
