"""Las seis vistas de Mango con el estilo de cómic. Uso: python3 instagram/blender/prueba-poses.py carpeta"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import bpy
import estilo, poses

out = sys.argv[1]
nombres = ["frente", "tres-cuartos-izq", "perfil-izq", "tres-cuartos-der", "perfil-der", "espalda"]
for n in nombres:
    ruta = f"/home/user/out-studio-web/design-src/mono/giro/mango-{n}.png"
    rgba = estilo.comic_alfa(ruta, bandas=5, punto=7)
    rgba = estilo.con_contorno(rgba, 4)
    comp = estilo.sobre_fondo(rgba)
    h, w, _ = comp.shape
    sal = np.ones((h, w, 4), dtype=np.float32)
    sal[..., :3] = np.clip(comp[::-1], 0, 1)
    gi = bpy.data.images.new("t", w, h, alpha=True)
    gi.pixels = sal.ravel().tolist()
    gi.filepath_raw = os.path.join(out, f"pose-comic-{n}.png"); gi.file_format = "PNG"; gi.save()
    bpy.data.images.remove(gi)
print("listo")
