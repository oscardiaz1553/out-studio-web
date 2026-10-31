"""Mango en 2D (dibujo real, estilo cómic, a doses) sobre una escena 3D de fondo.
La boca sigue las vocales (fonemas.py); cuando habla el narrador, Mango escucha.

Uso: python3 mango2d_escena.py bocas-mango.json eventos.json carpeta_salida [ancho]
Escribe cuadros RGBA f_0000.png... a 12 cps (solo Mango, fondo transparente).
"""
import os, sys, json, math
import numpy as np
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
import bpy, estilo, poses
import importlib.util
spec = importlib.util.spec_from_file_location("mh", os.path.join(os.path.dirname(__file__), "mango_habla.py"))
src = open(spec.origin).read().replace("\nmain()\n", "\n")        # solo las funciones
mh = type(sys)("mh"); mh.__dict__["__file__"] = spec.origin; exec(compile(src, "mh", "exec"), mh.__dict__)

FPS = 12
bocas = json.load(open(sys.argv[1]))["estados"]
ev = json.load(open(sys.argv[2]))
salida = sys.argv[3]
W = int(sys.argv[4]) if len(sys.argv) > 4 else 540
H = W * 16 // 9
os.makedirs(salida, exist_ok=True)
NOMBRES = ["cerrada", "rendija", "media", "abierta", "a_tope", "o"]
cab = mh.preparar(int(W * 0.92), os.path.join(salida, "_tmp"))
total = int(max(e["t1"] for e in ev) * FPS) + 24


def habla(t, voz):
    return any(e["voz"] == voz and e["t0"] - 0.05 <= t <= e["t1"] + 0.1 for e in ev)


def golpe(t, voz):
    """0..1: pequeño asentimiento al empezar una frase (de cualquiera de las dos voces)."""
    m = 0.0
    for e in ev:
        d = t - e["t0"]
        if 0 <= d < 0.5:
            m = max(m, math.exp(-d * 7) * (1.0 if e["voz"] == voz else 0.5))
    return m


for f in range(total):
    t = f / FPS
    hablando = habla(t, "mango")
    k = f
    est = bocas[k] if (hablando and k < len(bocas)) else 0
    base = cab[NOMBRES[est]]
    v = 1.0 if hablando else 0.0
    g_m, g_n = golpe(t, "mango"), golpe(t, "narrador")
    # hablando: rebote y balanceo; escuchando: leve giro hacia el lado del narrador y un asentimiento
    dy = int(round(5 * math.sin(t * 5.2) * (0.4 + v) - 18 * g_m - 8 * g_n))
    dx = int(round(5 * math.sin(t * 2.7) + (-10 if habla(t, "narrador") else 0)))
    ang = 2.0 * math.sin(t * 3.3) * (0.5 + v) + (3.5 if habla(t, "narrador") else 0) - 4 * g_m
    esc = 1.0 + 0.045 * g_m - 0.02 * g_n
    rot = ndimage.rotate(base, ang, axes=(1, 0), reshape=False, order=1)
    if abs(esc - 1) > 0.002:
        rot = ndimage.zoom(rot, (esc, esc, 1), order=1)
    h, w, _ = rot.shape
    lienzo = np.zeros((H, W, 4), dtype=np.float32)
    y0 = int(H * 0.50) + dy
    x0 = (W - w) // 2 + dx
    ys, xs = max(0, y0), max(0, x0)
    ye, xe = min(H, y0 + h), min(W, x0 + w)
    lienzo[ys:ye, xs:xe] = rot[ys - y0:ye - y0, xs - x0:xe - x0]
    poses.guardar(lienzo, os.path.join(salida, f"f_{f:04d}.png"))
print("cuadros", total)
