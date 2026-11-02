"""Encaja las expresiones de ojos y cejas de la hoja de ChatGPT (4 × 5) en la cara de Mango ilustrado.

Se alinea por los lentes (separación y altura del cielo reflejado). Del parche se toman las cejas
y la frente, y el interior de los lentes; el aro dorado se queda el de la ilustración (más nítido).
Uso: python3 instagram/mango2d/ojos_hoja.py [carpeta_salida]
"""
import os, sys, json
import numpy as np
from scipy import ndimage
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "blender"))
import bpy, poses

R = "/home/user/out-studio-web/design-src/mono/ilustrado/"
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(R, "ojos")
NOMBRES = [["normal", "feliz", "sorprendido", "enojado"], ["triste", "serio", "parpadeo", "guino-izq"],
           ["guino-der", "ojos-abiertos", "entreabiertos", "mirada-izq"], ["mirada-der", "mirada-arriba", "mirada-abajo", "ceja-der"],
           ["ceja-izq", "ceja-fruncida", "ceja-triste", "ceja-sorprendida"]]
base = poses.cargar(R + "mango-sin-boca.png")
hoja = poses.cargar(R + "ojos/hoja-ojos.png")
Hh, Wh, _ = hoja.shape
tw, th = Wh / 4, Hh / 5


def cielo(rgb, y0, y1, x0, x1):
    r, g, b = rgb[y0:y1, x0:x1].transpose(2, 0, 1)
    m = ndimage.binary_opening((b > 0.45) & (b > r + 0.15), iterations=2)
    lab, n = ndimage.label(m)
    sz = ndimage.sum(m, lab, range(1, n + 1))
    out = []
    for i in np.argsort(sz)[::-1][:2] + 1:
        ys, xs = np.where(lab == i)
        out.append(((xs.min() + xs.max()) / 2 + x0, ys.min() + y0))
    return sorted(out)


(bl, by_l), (br, by_r) = cielo(base, 380, 620, 350, 950)
BMX, BMY, BSEP = (bl + br) / 2, (by_l + by_r) / 2, br - bl
LENTES = [(495, 498), (805, 498)]
H, W, _ = base.shape
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
y0b, y1b, x0b, x1b = 300, 620, 330, 970
Y, X = yy[y0b:y1b, x0b:x1b], xx[y0b:y1b, x0b:x1b]
dl = np.minimum(np.hypot(X - LENTES[0][0], Y - LENTES[0][1]), np.hypot(X - LENTES[1][0], Y - LENTES[1][1]))
dentro = np.clip((101 - dl) / 4, 0, 1)                        # interior de los lentes
frente = np.clip((1 - ((X - 650) / 300) ** 2 - ((Y - 392) / 66) ** 2) / 0.4, 0, 1) * np.clip((dl - 118) / 10, 0, 1)
alfa = np.maximum(dentro, frente)
piel_b = (frente > 0.6) & (base[y0b:y1b, x0b:x1b] @ np.array([0.3, 0.59, 0.11]) > 0.35) & (base[y0b:y1b, x0b:x1b, 0] - base[y0b:y1b, x0b:x1b, 2] > 0.2)
mb, sb = base[y0b:y1b, x0b:x1b][piel_b].mean(0), base[y0b:y1b, x0b:x1b][piel_b].std(0)
os.makedirs(OUT, exist_ok=True)
for r in range(5):
    for c in range(4):
        x0, y0 = int(c * tw), int(r * th)
        (tl, ty_l), (tr, ty_r) = cielo(hoja, y0, y0 + int(th) - 20, x0, x0 + int(tw))
        s = BSEP / (tr - tl)
        tmx, tmy = (tl + tr) / 2, (ty_l + ty_r) / 2
        sy, sx = (Y - BMY) / s + tmy, (X - BMX) / s + tmx
        p = np.dstack([ndimage.map_coordinates(hoja[..., k], [sy, sx], order=3, mode="nearest") for k in range(3)])
        p = np.clip(p, 0, 1)
        # la etiqueta de la hoja tapa el borde de abajo de los lentes en las últimas filas: ahí se deja el lente original
        t = hoja[y0:y0 + int(th), x0:x0 + int(tw)]
        et = ((t @ np.array([0.3, 0.59, 0.11])) < 0.32) & (t[..., 0] > t[..., 2] + 0.1)
        def corrida(fila):
            mx = cur = 0
            for v in fila:
                cur = cur + 1 if v else 0; mx = max(mx, cur)
            return mx
        desde = int(tmy - y0) + 30          # solo por debajo de la mitad de los lentes
        filas = [i for i in range(desde, et.shape[0]) if corrida(et[i]) > 110]
        tope = y0 + (min(filas) if filas else th) - 8
        corte = np.clip((tope - sy) / 3, 0, 1)
        a_ok = np.maximum(dentro * corte, frente)
        l = p @ np.array([0.3, 0.59, 0.11])
        piel = (frente > 0.6) & (l > 0.35) & (p[..., 0] - p[..., 2] > 0.2)
        if piel.sum() > 50:
            mt, st = p[piel].mean(0), p[piel].std(0)
            corr = (p - mt) * (sb / np.maximum(st, 1e-3)) + mb
            w = (frente * np.clip((p[..., 0] - p[..., 2] - 0.15) / 0.15, 0, 1))[..., None]
            p = np.clip(p * (1 - w) + corr * w, 0, 1)
        poses.guardar(np.dstack([p, a_ok]).astype(np.float32), os.path.join(OUT, f"ojos-{NOMBRES[r][c]}.png"))
json.dump({"x": x0b, "y": y0b, "ancho": x1b - x0b, "alto": y1b - y0b, "nombres": sum(NOMBRES, [])}, open(os.path.join(OUT, "ojos.json"), "w"), indent=1)
print("listo")
