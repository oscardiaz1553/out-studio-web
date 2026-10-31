"""Prueba: Mango 3D con estilo cómic y sus bocas. Uso: python3 instagram/blender/prueba-boca.py carpeta"""
import math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import bpy, mango, proyectado, bocas, estilo

out = sys.argv[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
o, _ = proyectado.construir(paso=4)
im0, px0 = proyectado.cargar()
cam = mango.escena(res=(600, 800), muestras=24)
sc = bpy.context.scene
sc.render.film_transparent = True
mango.tinta(2.6)
mango.mirar(cam, (0, -9.0, 0.0), (0, 0, 0.0), 62)
tex = next(n for n in o.data.materials[0].node_tree.nodes if n.bl_idname == "ShaderNodeTexImage")
h, w, _ = px0.shape
tiles = []
for nombre, ab, es in bocas.NIVELES:
    v = bocas.variante(px0, ab, es)
    img = bpy.data.images.new(f"boca_{nombre}", w, h, alpha=True)
    img.pixels = v[::-1].ravel().tolist()
    tex.image = img
    ruta = os.path.join(out, f"boca-{nombre}.png")
    sc.render.filepath = ruta
    bpy.ops.render.render(write_still=True)
    rgba = estilo.comic_alfa(ruta)
    fondo = np.array([0.106, 0.184, 0.80])
    comp = rgba[..., :3] * rgba[..., 3:4] + fondo * (1 - rgba[..., 3:4])
    tiles.append(comp)
    # guardar el cuadro estilizado
    gi = bpy.data.images.new("tmp", comp.shape[1], comp.shape[0], alpha=True)
    salida = np.ones((comp.shape[0], comp.shape[1], 4), dtype=np.float32)
    salida[..., :3] = np.clip(comp[::-1], 0, 1)
    gi.pixels = salida.ravel().tolist()
    gi.filepath_raw = os.path.join(out, f"boca-estilo-{nombre}.png"); gi.file_format = "PNG"; gi.save()
print("listo")
