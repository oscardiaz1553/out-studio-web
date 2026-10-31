import math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import bpy, mango, proyectado

out = sys.argv[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
o, _ = proyectado.construir(paso=4)
cam = mango.escena(res=(900, 1200), muestras=64)
sc = bpy.context.scene
for nombre, ang in (("mango3d-frente.png", 0), ("mango3d-giro.png", 22)):
    a = math.radians(ang)
    mango.mirar(cam, (math.sin(a) * 9.0, -math.cos(a) * 9.0, 0.0), (0, 0, 0.0), 62)
    sc.render.filepath = os.path.join(out, nombre)
    bpy.ops.render.render(write_still=True)
