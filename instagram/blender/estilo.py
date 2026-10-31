"""Capa de estilo «cómic» sobre un render de Blender: colores planos por bandas, puntos
de semitono en las sombras, desfase de color en los bordes y grano de papel.
Inspirado en el look de Spider-Verse. Uso: estilo.comic(entrada.png, salida.png)"""
import numpy as np
import bpy


def _cargar(ruta, con_alfa=False):
    im = bpy.data.images.load(ruta)
    w, h = im.size
    px = np.array(im.pixels[:], dtype=np.float32).reshape(h, w, 4)
    bpy.data.images.remove(im)
    px = px[::-1].copy()                   # arriba primero
    return px if con_alfa else px[:, :, :3].copy()


def _guardar(rgb, ruta):
    h, w, _ = rgb.shape
    im = bpy.data.images.new("salida", w, h, alpha=True)
    out = np.ones((h, w, 4), dtype=np.float32)
    out[:, :, :3] = np.clip(rgb[::-1], 0, 1)
    im.pixels = out.ravel().tolist()
    im.filepath_raw = ruta
    im.file_format = "PNG"
    im.save()
    bpy.data.images.remove(im)


def comic(entrada, salida, bandas=4, punto=9, tinta=(0.04, 0.05, 0.22), grano=0.035, desfase=2):
    img = _cargar(entrada)
    h, w, _ = img.shape
    mx = img.max(axis=2)
    mn = img.min(axis=2)
    v = mx                                   # brillo
    sat = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0)
    # 1) colores planos: el brillo se parte en bandas, el tono se conserva
    vq = (np.floor(v * bandas + 0.5) / bandas).clip(0.12, 1)
    esc = np.where(v > 1e-4, vq / np.maximum(v, 1e-4), 1)
    base = img * esc[..., None]
    # 2) semitono: en la banda de sombra se dibujan puntos de tinta en una retícula girada
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ang = np.deg2rad(30)
    u = (xx * np.cos(ang) + yy * np.sin(ang)) / punto
    t = (-xx * np.sin(ang) + yy * np.cos(ang)) / punto
    d = np.hypot((u % 1) - 0.5, (t % 1) - 0.5)
    oscuridad = np.clip((0.62 - v) / 0.45, 0, 1) * (sat > 0.15)     # solo en las sombras
    radio = 0.18 + 0.30 * oscuridad
    punto_mascara = ((d < radio) & (oscuridad > 0.05)).astype(np.float32)
    base = base * (1 - 0.55 * punto_mascara[..., None]) + np.array(tinta) * 0.55 * punto_mascara[..., None]
    # 3) bordes de tinta ya vienen de Freestyle; se añade desfase de color (R y B movidos)
    r = np.roll(base[..., 0], desfase, axis=1)
    b = np.roll(base[..., 2], -desfase, axis=1)
    base = np.stack([r, base[..., 1], b], axis=-1)
    # 4) grano de papel
    rng = np.random.default_rng(3)
    base += (rng.standard_normal((h, w, 1)).astype(np.float32) * grano)
    _guardar(base, salida)


def comic_alfa(entrada, bandas=4, punto=8, tinta=(0.05, 0.04, 0.16), desfase=2):
    """Igual que comic(), pero con fondo transparente: devuelve (alto, ancho, 4)."""
    rgba = _cargar(entrada, con_alfa=True)
    a = rgba[..., 3]
    img = rgba[..., :3]
    h, w, _ = img.shape
    v = img.max(axis=2)
    sat = np.where(v > 1e-4, (v - img.min(axis=2)) / np.maximum(v, 1e-4), 0)
    vq = (np.floor(v * bandas + 0.5) / bandas).clip(0.14, 1)
    base = img * np.where(v > 1e-4, vq / np.maximum(v, 1e-4), 1)[..., None]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ang = np.deg2rad(30)
    u = (xx * np.cos(ang) + yy * np.sin(ang)) / punto
    t = (-xx * np.sin(ang) + yy * np.cos(ang)) / punto
    d = np.hypot((u % 1) - 0.5, (t % 1) - 0.5)
    oscuridad = np.clip((0.5 - v) / 0.4, 0, 1) * (sat > 0.2)
    pm = ((d < 0.16 + 0.28 * oscuridad) & (oscuridad > 0.06)).astype(np.float32)
    base = base * (1 - 0.5 * pm[..., None]) + np.array(tinta) * 0.5 * pm[..., None]
    r = np.roll(base[..., 0], desfase, axis=1)
    b = np.roll(base[..., 2], -desfase, axis=1)
    base = np.stack([r, base[..., 1], b], axis=-1)
    return np.dstack([np.clip(base, 0, 1), a])
