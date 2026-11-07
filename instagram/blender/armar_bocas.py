"""Seis estados de boca de Mango de frente, sobre una misma cabeza.

Reales: boca cerrada y «o» (imágenes nuevas) y sonrisa grande (vista de frente de la hoja,
alineada por los lentes). Intermedias (rendija, media, abierta): se parten de la sonrisa
grande cerrando la mandíbula poco a poco. El pelo sale siempre de la imagen con la boca
cerrada y solo se cambia la zona de la boca, con bordes suaves.
Uso: python3 instagram/blender/armar_bocas.py [carpeta_salida]
"""
import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")) + "/"
import os, sys
import numpy as np
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
import bpy
import alinear, poses

G = ROOT + "design-src/mono/giro/"
CENTRO, RX, RY, PLUMA = (658, 745), 275, 175, 70
Y0, Y1, Y2, DMAX = 650, 800, 980, 105


def mascara(forma):
    h, w = forma
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.hypot((xx - CENTRO[0]) / RX, (yy - CENTRO[1]) / RY)
    m = 1 - np.clip((d - 1) * (RX / PLUMA) * 1.0, 0, 1)
    return ndimage.gaussian_filter(np.clip(m, 0, 1), 6)[..., None]


def suave(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def cerrar_mandibula(img, abierta):
    h, w, _ = img.shape
    d = (1 - abierta) * DMAX
    ys = np.arange(h, dtype=np.float32)
    off = np.zeros(h, dtype=np.float32)
    a = (ys >= Y0) & (ys < Y1); off[a] = d * suave((ys[a] - Y0) / (Y1 - Y0))
    b = (ys >= Y1) & (ys < Y2); off[b] = d * (1 - suave((ys[b] - Y1) / (Y2 - Y1)))
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    sy = np.clip(yy + off[:, None], 0, h - 1)
    out = np.zeros_like(img)
    for c in range(img.shape[2]):
        out[..., c] = ndimage.map_coordinates(img[..., c], [sy, xx], order=1, mode="nearest")
    return out


def armar():
    A = poses.cargar(G + "boca-cerrada.png")
    B = poses.cargar(G + "boca-o.png")
    hoja = poses.cargar(poses.HOJA)
    H, W, _ = hoja.shape
    F = hoja[0:H // 2, 0:W // 3]
    Fw, _ = alinear.llevar_a(F, A.shape[:2], alinear.lentes(F), alinear.lentes(A))
    m = mascara(A.shape[:2])
    _, _ = None, None
    rgba, _ = poses.recortar(A)
    alfa = rgba[..., 3:4]
    completa = A * (1 - m) + Fw * m           # sonrisa grande sobre la cabeza de la boca cerrada
    estados = {
        "cerrada": A,
        "rendija": A * (1 - m) + cerrar_mandibula(completa, 0.30) * m,
        "media": A * (1 - m) + cerrar_mandibula(completa, 0.58) * m,
        "abierta": A * (1 - m) + cerrar_mandibula(completa, 0.82) * m,
        "a_tope": completa,
        "o": A * (1 - m) + B * m,
    }
    return {k: np.dstack([np.clip(v, 0, 1), alfa]) for k, v in estados.items()}


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else G + "bocas"
    os.makedirs(out, exist_ok=True)
    for nombre, img in armar().items():
        poses.guardar(img, os.path.join(out, f"frente-{nombre}.png"))
        print("ok", nombre)
