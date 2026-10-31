"""Render de presentación de Mango en mejor calidad. Uso: python3 instagram/blender/preview-final.py carpeta"""
import math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import bpy
import mango

out = sys.argv[1] if len(sys.argv) > 1 else "/tmp"
os.makedirs(out, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
p = mango.construir_mango()
cam = mango.escena(res=(900, 1200), muestras=64)
sc = bpy.context.scene
for nombre, ang in (("mango-frente.png", 0), ("mango-tres-cuartos.png", 34)):
    a = math.radians(ang)
    mango.mirar(cam, (math.sin(a) * 10.5, -math.cos(a) * 10.5, -0.9), (0, 0, -1.0), 62)
    sc.render.filepath = os.path.join(out, nombre)
    bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out, "mango.blend"))
