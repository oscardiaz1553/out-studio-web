"""Mango en 3D a partir de su imagen real (design-src/mono/mono-avatar.png).

La silueta transparente de la imagen se convierte en una malla; la profundidad se
infla como un globo desde los bordes (más grueso al centro) y la imagen se proyecta
como textura. Así el 3D conserva el diseño de Mango: su pelaje, sus lentes y su cara.
"""
import math
import numpy as np
import bpy
import bmesh
from scipy import ndimage

IMAGEN = "/home/user/out-studio-web/design-src/mono/mono-avatar.png"
ESCALA = 3.1 / 1086        # unidades de Blender por píxel de la imagen


def cargar(ruta=IMAGEN):
    im = bpy.data.images.load(ruta)
    w, h = im.size
    px = np.array(im.pixels[:], dtype=np.float32).reshape(h, w, 4)[::-1].copy()   # arriba primero
    return im, px


def profundidad(alfa, grosor=1.05, radio=330, suavizado=7):
    """Mapa de profundidad tipo globo: 0 en el borde, máximo hacia el centro."""
    d = ndimage.distance_transform_edt(alfa > 0.5)
    t = np.clip(d / radio, 0, 1)
    z = grosor * np.sqrt(1 - (1 - t) ** 2)
    return ndimage.gaussian_filter(z, suavizado)


def construir(paso=5, grosor=1.05):
    im, px = cargar()
    h, w, _ = px.shape
    alfa = px[..., 3]
    z = profundidad(alfa, grosor)
    # malla en rejilla, solo donde hay imagen
    ys = np.arange(0, h, paso)
    xs = np.arange(0, w, paso)
    bm = bmesh.new()
    ids = {}
    for j, y in enumerate(ys):
        for i, x in enumerate(xs):
            ids[(i, j)] = None
    uv_coords = {}
    for j, y in enumerate(ys):
        for i, x in enumerate(xs):
            if alfa[y, x] > 0.5:
                v = bm.verts.new(((x - w / 2) * ESCALA, z[y, x], -(y - h / 2) * ESCALA))
                ids[(i, j)] = v
                uv_coords[v.index if False else id(v)] = (x / w, 1 - y / h)
    # la cara frontal mira hacia -Y: Y negativo es hacia la cámara
    for v in bm.verts:
        v.co.y = -v.co.y
    bm.verts.ensure_lookup_table()
    for j in range(len(ys) - 1):
        for i in range(len(xs) - 1):
            q = [ids[(i, j)], ids[(i + 1, j)], ids[(i + 1, j + 1)], ids[(i, j + 1)]]
            if all(q):
                try:
                    bm.faces.new(q[::-1])
                except ValueError:
                    pass
    uvl = bm.loops.layers.uv.new("uv")
    for f in bm.faces:
        for l in f.loops:
            co = l.vert.co
            x = co.x / ESCALA + w / 2
            y = -co.z / ESCALA + h / 2
            l[uvl].uv = (x / w, 1 - y / h)
    bm.normal_update()
    # parte de atrás: copia espejada para cerrar el volumen
    frente = bm.copy()
    geo = bmesh.ops.mirror(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], axis="Y", merge_dist=0.0005)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.0008)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    frente.free()
    me = bpy.data.meshes.new("mango_proyectado")
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new("mango", me)
    bpy.context.collection.objects.link(o)
    for p in me.polygons:
        p.use_smooth = True
    # material con la imagen
    m = bpy.data.materials.new("mango_textura")
    m.use_nodes = True
    n = m.node_tree.nodes
    b = n["Principled BSDF"]
    t = n.new("ShaderNodeTexImage")
    t.image = im
    t.interpolation = "Cubic"
    m.node_tree.links.new(t.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.65
    if "Specular IOR Level" in b.inputs:
        b.inputs["Specular IOR Level"].default_value = 0.2
    o.data.materials.append(m)
    o.rotation_euler = (0, 0, 0)
    return o, (w, h)
