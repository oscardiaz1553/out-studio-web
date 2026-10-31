"""Recorta las seis vistas de Mango de la hoja de giro y quita el fondo.

La hoja (design-src/mono/giro/hoja-de-giro.png) trae seis cabezas sobre un fondo naranja liso:
fila de arriba: frente, tres cuartos izquierda, perfil izquierdo
fila de abajo: tres cuartos derecha, perfil derecho, espalda

El fondo se parece al pelo, así que no se usa una llave de color simple: se marca como fondo
solo lo que está conectado con el borde de la imagen y se parece al color del fondo. Así el
pelo claro del interior nunca se vuelve transparente.
Uso: python3 instagram/blender/poses.py [carpeta_salida]
"""
import os, sys
import numpy as np
import bpy
from scipy import ndimage

HOJA = "/home/user/out-studio-web/design-src/mono/giro/hoja-de-giro.png"
VISTAS = [("frente", 0, 0), ("tres-cuartos-izq", 1, 0), ("perfil-izq", 2, 0),
          ("tres-cuartos-der", 0, 1), ("perfil-der", 1, 1), ("espalda", 2, 1)]


def cargar(ruta):
    im = bpy.data.images.load(ruta)
    w, h = im.size
    px = np.array(im.pixels[:], dtype=np.float32).reshape(h, w, 4)[::-1].copy()
    bpy.data.images.remove(im)
    return px[..., :3]


def recortar(rgb, umbral=0.075, suave=1.3):
    h, w, _ = rgb.shape
    borde = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    fondo = np.median(borde, axis=0)
    dist = np.linalg.norm(rgb - fondo, axis=2)
    parecido = dist < umbral
    etiquetas, n = ndimage.label(parecido)
    tocan = set(np.unique(np.concatenate([etiquetas[0], etiquetas[-1], etiquetas[:, 0], etiquetas[:, -1]]))) - {0}
    es_fondo = np.isin(etiquetas, list(tocan))
    es_fondo = ndimage.binary_opening(es_fondo, iterations=1) | (es_fondo & ~ndimage.binary_dilation(~es_fondo, iterations=2))
    alfa = 1 - ndimage.gaussian_filter(es_fondo.astype(np.float32), suave)
    alfa = np.clip((alfa - 0.15) / 0.7, 0, 1)
    # quedarse solo con el trozo más grande (la cabeza)
    sol = alfa > 0.5
    et2, n2 = ndimage.label(sol)
    if n2 > 1:
        tam = ndimage.sum(sol, et2, range(1, n2 + 1))
        alfa = alfa * (et2 == (1 + int(np.argmax(tam))))
    return np.dstack([rgb, alfa]), fondo


def guardar(rgba, ruta):
    h, w, _ = rgba.shape
    im = bpy.data.images.new("tmp", w, h, alpha=True)
    im.pixels = rgba[::-1].ravel().tolist()
    im.filepath_raw = ruta
    im.file_format = "PNG"
    im.save()
    bpy.data.images.remove(im)


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "/home/user/out-studio-web/design-src/mono/giro"
    os.makedirs(out, exist_ok=True)
    hoja = cargar(HOJA)
    H, W, _ = hoja.shape
    cw, ch = W // 3, H // 2
    for nombre, c, f in VISTAS:
        trozo = hoja[f * ch:(f + 1) * ch, c * cw:(c + 1) * cw]
        rgba, fondo = recortar(trozo)
        guardar(rgba, os.path.join(out, f"mango-{nombre}.png"))
        print(nombre, "fondo", np.round(fondo, 2), "opaco %", round(float((rgba[..., 3] > 0.5).mean() * 100), 1))
