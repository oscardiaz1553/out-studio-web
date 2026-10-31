import math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import bpy, mango, proyectado

out = sys.argv[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
o, _ = proyectado.construir()
cam = mango.escena(res=(600, 800), muestras=24)
sc = bpy.context.scene
for nombre, ang in (("q1-frente.png", 0), ("q2-tres-cuartos.png", 38), ("q3-lado.png", 90), ("q4-atras.png", 180)):
    a = math.radians(ang)
    mango.mirar(cam, (math.sin(a) * 9.5, -math.cos(a) * 9.5, 0.0), (0, 0, 0.0), 62)
    sc.render.filepath = os.path.join(out, nombre)
    bpy.ops.render.render(write_still=True)
