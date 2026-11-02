"""Encaja las bocas de la hoja de ChatGPT (5 × 4) en la cara de Mango ilustrado.

Cada boca se alinea por las fosas nasales (escala y posición), se le iguala el tono de piel al
hocico de la ilustración y se recorta con bordes suaves. Salen PNG con transparencia del tamaño
de la cara (1254 × 1254) recortados a su caja, y un JSON con la posición de cada uno.
Uso: python3 instagram/mango2d/bocas_hoja.py [carpeta_salida]
"""
import os, sys, json
import numpy as np
from scipy import ndimage
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "blender"))
import bpy, poses

R = "/home/user/out-studio-web/design-src/mono/ilustrado/"
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(R, "bocas")
NOMBRES = [["m", "pb", "a", "e", "i"], ["o", "u", "dt", "fv", "sz"], ["l", "r", "ch", "j", "kg"], ["q", "n", "th", "w", "h"]]
BASE_F = ((610.07, 600.73), (697.28, 599.76))     # fosas nasales en la ilustración

base = poses.cargar(R + "mango-sin-boca.png")
hoja = poses.cargar(R + "bocas/hoja-bocas.png")
Hh, Wh, _ = hoja.shape
tw, th = Wh / 5, Hh / 4
lum = hoja @ np.array([0.3, 0.59, 0.11])


def fosas(y0, y1, x0, x1):
    r = lum[y0:y1, x0:x1] < 0.18
    lab, n = ndimage.label(r)
    sz = ndimage.sum(r, lab, range(1, n + 1))
    idx = np.argsort(sz)[::-1][:2] + 1
    cs = sorted((c[1] + x0, c[0] + y0) for c in (ndimage.center_of_mass(lab == i) for i in idx))
    return cs


bmx, bmy = (BASE_F[0][0] + BASE_F[1][0]) / 2, (BASE_F[0][1] + BASE_F[1][1]) / 2
bdist = BASE_F[1][0] - BASE_F[0][0]
H, W, _ = base.shape
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
# zona de la boca en la ilustración (hocico bajo la nariz), con borde suave
masc = ((xx - 652) / 188) ** 2 + ((yy - 694) / 74) ** 2
alfa = np.clip((1.0 - masc) / 0.6, 0, 1) ** 1.3
nariz = ((xx - 653) / 120) ** 2 + ((yy - 596) / 46) ** 2
alfa *= np.clip((nariz - 1.0) / 0.6, 0, 1)
y0b, y1b, x0b, x1b = 600, 790, 450, 856
indice = {}
os.makedirs(OUT, exist_ok=True)
piel_base = (alfa > 0.5) & ((base @ np.array([0.3, 0.59, 0.11])) > 0.45)
mb, sb = base[piel_base].mean(0), base[piel_base].std(0)
for r in range(4):
    for c in range(5):
        x0, y0 = int(c * tw), int(r * th)
        (ax, ay), (bx, by) = fosas(y0 + 20, y0 + 100, x0 + 60, x0 + 250)
        if abs(ay - by) > 10:                     # si falla la detección, se usa la posición típica
            ay = by = y0 + 52; ax, bx = x0 + 139, x0 + 195
        s = bdist / (bx - ax)
        mx, my = (ax + bx) / 2, (ay + by) / 2
        # muestreo inverso: para cada píxel de la ilustración, de dónde sale en la hoja
        sy = (yy[y0b:y1b, x0b:x1b] - bmy) / s + my
        sx = (xx[y0b:y1b, x0b:x1b] - bmx) / s + mx
        parche = np.dstack([ndimage.map_coordinates(hoja[..., k], [sy, sx], order=3, mode="nearest") for k in range(3)])
        a = alfa[y0b:y1b, x0b:x1b]
        # igualar el tono: solo la piel (ni dientes ni el interior de la boca)
        l = parche @ np.array([0.3, 0.59, 0.11])
        piel = (a > 0.5) & (l > 0.45) & (parche[..., 0] - parche[..., 2] > 0.18)
        mt, st = parche[piel].mean(0), parche[piel].std(0)
        corr = (parche - mt) * (sb / np.maximum(st, 1e-3)) + mb
        w = np.clip((parche[..., 0] - parche[..., 2] - 0.12) / 0.15, 0, 1)[..., None]   # cuánto es piel
        w *= np.clip((l[..., None] - 0.3) / 0.2, 0, 1)
        parche = np.clip(parche * (1 - w) + corr * w, 0, 1)
        nombre = NOMBRES[r][c]
        poses.guardar(np.dstack([parche, a]).astype(np.float32), os.path.join(OUT, f"boca-{nombre}.png"))
        indice[nombre] = {"x": x0b, "y": y0b}
json.dump(indice, open(os.path.join(OUT, "bocas.json"), "w"), indent=1)
print("listo", len(indice))
