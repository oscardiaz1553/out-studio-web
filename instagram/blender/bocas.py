"""Bocas de Mango para hablar: variantes de la textura con la boca más o menos abierta.

Parte de la imagen real (boca abierta, riendo) y la remapea por filas en la zona de la
mandíbula para cerrarla de forma gradual; la variante «o» además estrecha la boca.
Todo con numpy: no hace falta dibujar nada a mano.
"""
import numpy as np
from scipy import ndimage

Y0, Y1, Y2, DMAX = 800, 985, 1230, 112          # zona de la mandíbula (px de la imagen)
CX = 540                                         # centro de la boca


def _suave(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def variante(px, abierta=1.0, estrecha=1.0):
    """px: imagen (alto, ancho, 4) con el origen arriba. abierta 0..1; estrecha 1 = ancho normal."""
    h, w, _ = px.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = (1 - abierta) * DMAX
    off = np.zeros(h, dtype=np.float32)
    ys = np.arange(h, dtype=np.float32)
    sube = (ys >= Y0) & (ys < Y1)
    off[sube] = d * _suave((ys[sube] - Y0) / (Y1 - Y0))
    baja = (ys >= Y1) & (ys < Y2)
    off[baja] = d * (1 - _suave((ys[baja] - Y1) / (Y2 - Y1)))
    sy = np.clip(yy + off[:, None], 0, h - 1)
    sx = xx.copy()
    if estrecha < 0.999:     # «o»: la boca se estrecha, más en el centro que hacia los lados
        franja = _suave(1 - np.abs(yy - 880) / 140)
        cerca = _suave(1 - np.abs(xx - CX) / 330)
        k = 1 - (1 - estrecha) * franja * cerca
        sx = CX + (xx - CX) / np.maximum(k, 0.2)
    out = np.zeros_like(px)
    for c in range(4):
        out[..., c] = ndimage.map_coordinates(px[..., c], [sy, sx], order=1, mode="nearest")
    return out


NIVELES = [("cerrada", 0.0, 1.0), ("rendija", 0.28, 1.0), ("media", 0.55, 1.0), ("abierta", 0.8, 1.0), ("a_tope", 1.0, 1.0), ("o", 0.5, 0.62)]
