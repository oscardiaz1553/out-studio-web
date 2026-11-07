"""Mango hablando de frente: cambia entre los seis estados de boca según el volumen de la voz.
Estilo cómic, animado «a doses» (12 cuadros por segundo) y con un balanceo leve de cabeza.

Uso: python3 mango_habla.py env.json salida_carpeta [ancho_cuadro]
  env.json: salida de instagram/scripts/envolvente-voz.py (30 valores por segundo, 0 a 1)
Después: ffmpeg -framerate 30 -i salida_carpeta/f_%04d.png -i voz.wav ... (ver README)
"""
import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")) + "/"
import os, sys, json, math
import numpy as np
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
import bpy
import estilo, poses

B = ROOT + "design-src/mono/giro/bocas/"
ESTADOS = ["cerrada", "rendija", "media", "abierta", "a_tope"]
FONDO = (0.106, 0.184, 0.80)


def estado(v, previo):
    """Umbrales con un poco de histéresis para que la boca no tiemble."""
    cortes = [0.10, 0.28, 0.48, 0.72]
    idx = sum(v > c for c in cortes)
    if previo is not None and abs(idx - previo) == 1:
        c = cortes[min(idx, previo)]
        if abs(v - c) < 0.04:
            return previo
    return idx


def preparar(ancho_cabeza, tmp):
    os.makedirs(tmp, exist_ok=True)
    out = {}
    for n in ESTADOS + ["o"]:
        im = bpy.data.images.load(B + f"frente-{n}.png")
        w, h = im.size
        s = ancho_cabeza / w
        im.scale(int(w * s), int(h * s))
        p = os.path.join(tmp, f"{n}.png")
        im.filepath_raw = p
        im.file_format = "PNG"
        im.save()
        bpy.data.images.remove(im)
        c = estilo.comic_alfa(p, bandas=4, punto=5, desfase=1)
        out[n] = estilo.con_contorno(c, grosor=3)
    return out


def main():
    env = json.load(open(sys.argv[1]))
    salida = sys.argv[2]
    W = int(sys.argv[3]) if len(sys.argv) > 3 else 540
    H = W * 16 // 9
    os.makedirs(salida, exist_ok=True)
    cab = preparar(int(W * 0.95), os.path.join(salida, "_tmp"))
    n_cuadros = len(env)
    previo = None
    for f in range(n_cuadros):
        t = f / 30
        dosis = int(t * 12)        # número de dibujo a 12 cps
        # valor de boca: promedio del tramo del dibujo
        a, b = int(dosis / 12 * 30), min(n_cuadros, int((dosis + 1) / 12 * 30) + 1)
        v = float(np.max(env[a:b])) if b > a else 0.0
        idx = estado(v, previo)
        previo = idx
        base = cab[ESTADOS[idx]]
        # balanceo: dibujo a 12 cps
        td = dosis / 12
        dy = int(round(6 * math.sin(td * 5.0) - 14 * v))
        dx = int(round(4 * math.sin(td * 3.1)))
        ang = 2.2 * math.sin(td * 3.7) + 3 * v * math.sin(td * 9)
        rot = ndimage.rotate(base, ang, axes=(1, 0), reshape=False, order=1)
        h, w, _ = rot.shape
        lienzo = np.zeros((H, W, 4), dtype=np.float32)
        y0 = H - h + int(h * 0.1) + dy
        x0 = (W - w) // 2 + dx
        ys, xs = max(0, y0), max(0, x0)
        ye, xe = min(H, y0 + h), min(W, x0 + w)
        lienzo[ys:ye, xs:xe] = rot[ys - y0:ye - y0, xs - x0:xe - x0]
        rgb = estilo.sobre_fondo(lienzo, FONDO)
        estilo._guardar(rgb, os.path.join(salida, f"f_{f:04d}.png"))
    print("cuadros:", n_cuadros)


main()
