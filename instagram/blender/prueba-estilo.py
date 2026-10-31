"""Prueba de estilo cómic sobre Mango. Uso: python3 instagram/blender/prueba-estilo.py carpeta"""
import math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import bpy
import mango, estilo

out = sys.argv[1]
os.makedirs(out, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
mango.construir_mango()
cam = mango.escena(res=(900, 1200), muestras=32)
mango.tinta(3.4)
sc = bpy.context.scene
mango.mirar(cam, (0, -10.5, -0.9), (0, 0, -1.0), 62)
sc.render.filepath = os.path.join(out, "estilo-bruto.png")
bpy.ops.render.render(write_still=True)
estilo.comic(os.path.join(out, "estilo-bruto.png"), os.path.join(out, "estilo-comic.png"))
print("listo")
