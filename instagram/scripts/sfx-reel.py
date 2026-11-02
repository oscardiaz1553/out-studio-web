#!/usr/bin/env python3
"""Efectos de sonido sintetizados (sin muestras) para el reel de Mango: barridos en los cambios
de escena, golpes en cada «Se fue.», «pop» en los globos y un brillo en las marcas de listo.
Uso: python3 instagram/scripts/sfx-reel.py salida.wav [duracion]
"""
import sys, wave
import numpy as np
from scipy import signal

SR = 44100
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 28.6
out = np.zeros(int(SR * DUR))
rng = np.random.default_rng(3)


def poner(t, x, g=1.0):
    i = int(t * SR); j = min(len(out), i + len(x))
    out[i:j] += x[: j - i] * g


def barrido(d=0.45):
    n = int(SR * d); t = np.arange(n) / SR
    ruido = rng.normal(0, 1, n)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    # filtro paso banda que sube de frecuencia
    y = np.zeros(n); paso = 512
    for k in range(0, n, paso):
        f = 300 + 3500 * (k / n) ** 1.5
        b, a = signal.butter(2, [f / (SR / 2) * 0.6, min(0.99, f / (SR / 2) * 1.6)], btype="band")
        y[k:k + paso] = signal.lfilter(b, a, ruido[k:k + paso])
    return y * env * 0.5


def golpe():
    n = int(SR * 0.5); t = np.arange(n) / SR
    bombo = np.sin(2 * np.pi * (55 + 90 * np.exp(-t * 30)) * t) * np.exp(-t * 7)
    clic = rng.normal(0, 1, n) * np.exp(-t * 60) * 0.35
    return (bombo + clic) * 0.9


def pop(f=700):
    n = int(SR * 0.12); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t * (1 + 2 * t)) * np.exp(-t * 40) * 0.35


def brillo():
    n = int(SR * 0.35); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1760 * t) + 0.5 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 12) * 0.12


for t in (3.05, 7.82, 12.6, 17.4, 23.5):
    poner(t, barrido(), 0.8)
for t in (6.95, 11.95, 16.7):
    poner(t, golpe())
poner(18.5, golpe(), 0.8)
for t in (2.30, 19.5, 21.15, 27.2):
    poner(t, pop(760))
for t in (1.55,):
    poner(t, pop(1100), 0.8)
for i, t in enumerate((20.3, 20.52, 20.74)):
    poner(t, brillo())
poner(27.2, golpe(), 0.6)
out = np.clip(out, -1, 1)
st = np.stack([out, out], axis=1)
w = wave.open(sys.argv[1], "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st * 32767 * 0.8).astype(np.int16).tobytes()); w.close()
print("listo")
