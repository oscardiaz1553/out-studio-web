"""Alinea las vistas de frente de Mango (la de la hoja, más pequeña, y las nuevas con la boca
cerrada y en «o») usando los lentes, que no cambian, para poder combinar sus bocas."""
import numpy as np
from scipy import ndimage


def lentes(rgb):
    """Caja que envuelve los dos lentes: píxeles azules en la mitad superior de la imagen."""
    h, w, _ = rgb.shape
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    m = (b - np.maximum(r, g) > 0.12) & (b > 0.3)
    m[int(h * 0.62):] = False
    m = ndimage.binary_opening(m, iterations=2)
    et, n = ndimage.label(m)
    tam = ndimage.sum(m, et, range(1, n + 1))
    orden = np.argsort(tam)[::-1][:2] + 1
    sel = np.isin(et, orden)
    ys, xs = np.where(sel)
    return xs.min(), xs.max(), ys.min(), ys.max()


def llevar_a(origen, destino_forma, caja_o, caja_d):
    """Escala y mueve `origen` para que sus lentes coincidan con los del destino."""
    ox0, ox1, oy0, oy1 = caja_o
    dx0, dx1, dy0, dy1 = caja_d
    s = (dx1 - dx0) / (ox1 - ox0)
    cox, coy = (ox0 + ox1) / 2, (oy0 + oy1) / 2
    cdx, cdy = (dx0 + dx1) / 2, (dy0 + dy1) / 2
    H, W = destino_forma
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    sx = (xx - cdx) / s + cox
    sy = (yy - cdy) / s + coy
    salida = np.zeros((H, W, origen.shape[2]), dtype=np.float32)
    for c in range(origen.shape[2]):
        salida[..., c] = ndimage.map_coordinates(origen[..., c], [sy, sx], order=1, mode="nearest")
    return salida, s
