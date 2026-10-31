"""Renders de revisión de Mango: varias vistas y poses. Uso: python3 instagram/blender/preview.py carpeta"""
import math, os, sys, time
sys.path.insert(0, os.path.dirname(__file__))
import bpy
import mango

out = sys.argv[1] if len(sys.argv) > 1 else "/tmp"
os.makedirs(out, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
p = mango.construir_mango()
cam = mango.escena(res=(600, 800), muestras=20)
sc = bpy.context.scene
centro = (0, 0, -1.0)

def foto(nombre, angulo_grados=0, dist=10.5, alto=-0.9):
    a = math.radians(angulo_grados)
    mango_pos = (math.sin(a) * dist, -math.cos(a) * dist, alto)
    mango.mirar(cam, mango_pos, centro, 62)
    sc.render.filepath = os.path.join(out, nombre)
    t = time.time(); bpy.ops.render.render(write_still=True); print(nombre, round(time.time() - t, 1), "s")

foto("v1-frente.png")
foto("v2-tres-cuartos.png", 38)
foto("v3-lado.png", 80)
p["jaw"].rotation_euler = (math.radians(26), 0, 0)
foto("v4-boca-abierta.png")
