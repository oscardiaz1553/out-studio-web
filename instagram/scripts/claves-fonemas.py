#!/usr/bin/env python3
"""Claves de boca para la hoja de exposición a partir de los fonemas alineados.

Regla: cada vez que suena un fonema principal (a e i o u d t s m p, y b f), su dibujo entra dos
cuadros ANTES del sonido. Los demás fonemas no cambian la boca. Al terminar cada frase la boca
se cierra (M). Un dibujo dura al menos 3 cuadros: si dos claves caen más juntas, gana la de más peso (vocales primero).

Uso: python3 instagram/scripts/claves-fonemas.py fonemas.json hoja-ojos.json salida.json [fps]
  hoja-ojos.json: una hoja de la que solo se toman las claves de ojos y cejas.
"""
import json, sys

FPS = int(sys.argv[4]) if len(sys.argv) > 4 else 24
ANTES = 2
MIN_SOSTENIDO = 3          # un dibujo dura al menos 3 cuadros: menos cambios por segundo, menos temblor
DIBUJO = {"a": "a", "e": "e", "i": "i", "o": "o", "u": "u", "d": "dt", "t": "dt", "s": "sz", "m": "m", "p": "pb", "b": "pb", "f": "fv"}
PESO = {"a": 9, "o": 8, "e": 7, "u": 6, "i": 5, "pb": 4, "m": 4, "sz": 3, "dt": 3, "fv": 3}

fon = json.load(open(sys.argv[1]))
claves = []                       # (cuadro, dibujo)
frases = []
for f in fon:
    if not frases or frases[-1][0] != f["frase"]: frases.append([f["frase"], []])
    frases[-1][1].append(f)
for _, lista in frases:
    for f in lista:
        d = DIBUJO.get(f["fon"])
        if d: claves.append((round(f["t0"] * FPS) - ANTES, d))
    claves.append((round(lista[-1]["t1"] * FPS) - 1, "m"))      # cierre al terminar la frase
claves.sort()
# claves casi juntas: se queda la de más peso
res = []
for f, d in claves:
    if res and f - res[-1][0] < MIN_SOSTENIDO:
        if PESO[d] > PESO[res[-1][1]]: res[-1] = (res[-1][0], d)
        continue
    res.append((f, d))
bocas = {}; prev = "m"
for f, d in res:
    if d != prev: bocas[str(f)] = d; prev = d
base = json.load(open(sys.argv[2]))
doc = {"fps": FPS, "bocas": bocas, "ojos": base["ojos"], "actualizado": "2026-11-02T06:00:00Z", "nota": "Bocas: fonemas principales dos cuadros antes del sonido"}
json.dump(doc, open(sys.argv[3], "w"), ensure_ascii=False)
print(len(bocas), "claves de boca")
