"""Inbetweens de boca entre dos dibujos de la hoja, por flujo óptico (como un tween en 2D).

Para cada cambio de boca de la hoja de exposición (de A a B) genera dos dibujos intermedios
(a 1/3 y a 2/3 del camino): cada uno deforma A hacia B y B hacia A, y mezcla. Los dibujos de
la hoja están alineados sobre la misma cara, así que el flujo es corto y limpio.

Uso: python3 instagram/mango2d/inbetweens.py hoja.json [carpeta_salida]
Salida: inb/boca-<a>__<b>__1.png, __2.png y inb/manifest.json
"""
import os, sys, json
import numpy as np
import cv2
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "blender"))
import bpy, poses

AQUI = os.path.dirname(os.path.abspath(__file__))
hoja = json.load(open(sys.argv[1]))
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(AQUI, "inb")
os.makedirs(OUT, exist_ok=True)
base = poses.cargar(os.path.join(AQUI, "mango-sin-boca.png"))
X0, Y0, W, H = 450, 600, 406, 190


def rgba(ruta):
    im = bpy.data.images.load(ruta); w, h = im.size
    a = np.array(im.pixels[:], dtype=np.float32).reshape(h, w, 4)[::-1].copy(); bpy.data.images.remove(im); return a


cache = {}
def compuesto(n):
    if n not in cache:
        p = rgba(os.path.join(AQUI, "bocas", f"boca-{n}.png"))
        fondo = base[Y0:Y0 + H, X0:X0 + W]
        cache[n] = (fondo * (1 - p[..., 3:4]) + p[..., :3] * p[..., 3:4], p[..., 3])
    return cache[n]


def flujo(a, b):
    ga = cv2.cvtColor((a * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
    gb = cv2.cvtColor((b * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
    return cv2.calcOpticalFlowFarneback(ga, gb, None, 0.5, 4, 25, 5, 7, 1.5, 0)


def deformar(img, fl, t):
    h, w = img.shape[:2]
    gx, gy = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    return cv2.remap(img, gx + t * fl[..., 0], gy + t * fl[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)


pares = []
prev = "m"
for f in sorted(hoja["bocas"], key=int):
    k = hoja["bocas"][f]
    if k != prev and (prev, k) not in pares: pares.append((prev, k))
    prev = k
manifiesto = []
for a, b in pares:
    A, aa = compuesto(a); B, ab = compuesto(b)
    f_ab, f_ba = flujo(A, B), flujo(B, A)
    for paso, t in ((1, 1 / 3), (2, 2 / 3)):
        im = (1 - t) * deformar(A, f_ba, t) + t * deformar(B, f_ab, 1 - t)
        al = np.maximum(aa, ab)
        nombre = f"{a}__{b}__{paso}"
        poses.guardar(np.dstack([np.clip(im, 0, 1), al]).astype(np.float32), os.path.join(OUT, f"boca-{nombre}.png"))
        manifiesto.append(nombre)
json.dump(manifiesto, open(os.path.join(OUT, "manifest.json"), "w"))
print(len(pares), "pares,", len(manifiesto), "dibujos")
