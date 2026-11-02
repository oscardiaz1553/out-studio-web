#!/usr/bin/env python3
"""Quita el fondo verde (#00FF00) de las imágenes de personajes y objetos y las guarda como PNG con transparencia.

Uso: python3 instagram/situaciones/quitar_verde.py entrada.(png|jpg|webp) salida.png [--recortar]
- El alfa sale de cuánto verde puro hay en cada píxel (con borde suave, sin halo verde).
- «Despill»: en los bordes se baja el verde sobrante del color, para que el pelo y la ropa no queden con un contorno verdoso.
- --recortar: recorta la imagen a la caja del personaje (con 8 px de margen).
Requiere bpy y numpy.
"""
import sys
import numpy as np
import bpy
from scipy import ndimage

ent, sal = sys.argv[1], sys.argv[2]
im = bpy.data.images.load(ent)
w, h = im.size
px = np.array(im.pixels[:], dtype=np.float32).reshape(h, w, 4)[::-1].copy()
r, g, b = px[..., 0], px[..., 1], px[..., 2]
# «verdosidad»: cuánto domina el verde sobre el resto de los canales
verde = np.clip((g - np.maximum(r, b)) / 0.45, 0, 1)
alfa = 1 - np.clip((verde - 0.15) / 0.7, 0, 1)
# quitar islas de fondo que no tocan el borde (huecos entre brazo y cuerpo se conservan como transparentes)
alfa = ndimage.gaussian_filter(alfa, 0.7)
# despill: el verde de los píxeles de borde no puede superar al promedio de rojo y azul
limite = (r + b) / 2 + 0.02
g2 = np.where(alfa < 0.999, np.minimum(g, limite), g)
out = np.dstack([r, g2, b, alfa])
if "--recortar" in sys.argv:
    ys, xs = np.where(alfa > 0.05)
    y0, y1, x0, x1 = max(0, ys.min() - 8), min(h, ys.max() + 9), max(0, xs.min() - 8), min(w, xs.max() + 9)
    out = out[y0:y1, x0:x1]
hh, ww, _ = out.shape
res = bpy.data.images.new("o", ww, hh, alpha=True)
res.pixels = out[::-1].ravel().tolist()
res.filepath_raw = sal; res.file_format = "PNG"; res.save()
print("listo", sal, (ww, hh))
