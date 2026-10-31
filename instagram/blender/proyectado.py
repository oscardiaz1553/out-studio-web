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
    alfa = ndimage.binary_erosion(px[..., 3] > 0.5, iterations=4).astype(np.float32)
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
    for v in bm.verts:
        if any(len(e.link_faces) < 2 for e in v.link_edges):
            v.co.y = 0.0                      # el borde de la silueta queda en el plano medio
    # parte de atrás: copia espejada para cerrar el volumen
    frente = bm.copy()
    geo = bmesh.ops.mirror(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], axis="Y", merge_dist=0.0005)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.004)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    frente.free()
    me = bpy.data.meshes.new("mango_proyectado")
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new("mango", me)
    bpy.context.collection.objects.link(o)
    for p in me.polygons:
        p.use_smooth = True
    # material: textura real al frente; hacia los lados y atrás, pelaje naranja generado
    m = bpy.data.materials.new("mango_textura")
    m.use_nodes = True
    n, l = m.node_tree.nodes, m.node_tree.links
    b = n["Principled BSDF"]
    t = n.new("ShaderNodeTexImage")
    t.image = im
    t.interpolation = "Cubic"
    t.extension = "EXTEND"
    # pelaje generado: ruido alargado en vertical (el pelo cae), con variación de tono
    tc = n.new("ShaderNodeTexCoord")
    mp = n.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (46, 46, 4)
    l.new(tc.outputs["Object"], mp.inputs["Vector"])
    ruido = n.new("ShaderNodeTexNoise")
    ruido.inputs["Detail"].default_value = 10
    ruido.inputs["Roughness"].default_value = 0.65
    l.new(mp.outputs["Vector"], ruido.inputs["Vector"])
    gran = n.new("ShaderNodeTexNoise")
    gran.inputs["Scale"].default_value = 2.2
    l.new(tc.outputs["Object"], gran.inputs["Vector"])
    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (0.50, 0.08, 0.005, 1)
    ramp.color_ramp.elements[1].color = (0.95, 0.30, 0.02, 1)
    e = ramp.color_ramp.elements.new(0.55)
    e.color = (0.80, 0.17, 0.01, 1)
    mezcla_r = n.new("ShaderNodeMath")
    mezcla_r.operation = "MULTIPLY_ADD"
    mezcla_r.inputs[1].default_value = 0.8
    l.new(ruido.outputs["Fac"], mezcla_r.inputs[0])
    l.new(gran.outputs["Fac"], mezcla_r.inputs[2])
    l.new(mezcla_r.outputs["Value"], ramp.inputs["Fac"])
    # cuánto mira la superficie hacia la cámara (frente = -Y)
    geo = n.new("ShaderNodeNewGeometry")
    sep = n.new("ShaderNodeSeparateXYZ")
    l.new(geo.outputs["Normal"], sep.inputs["Vector"])
    neg = n.new("ShaderNodeMath")
    neg.operation = "MULTIPLY"
    neg.inputs[1].default_value = -1.0
    l.new(sep.outputs["Y"], neg.inputs[0])
    paso_f = n.new("ShaderNodeMapRange")
    paso_f.inputs["From Min"].default_value = 0.30
    paso_f.inputs["From Max"].default_value = 0.75
    paso_f.clamp = True
    l.new(neg.outputs["Value"], paso_f.inputs["Value"])
    mix = n.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    l.new(paso_f.outputs["Result"], mix.inputs["Factor"])
    l.new(ramp.outputs["Color"], mix.inputs["A"])
    l.new(t.outputs["Color"], mix.inputs["B"])
    l.new(mix.outputs["Result"], b.inputs["Base Color"])
    # relieve de pelo en la parte generada
    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.5
    bump.inputs["Distance"].default_value = 0.03
    l.new(ruido.outputs["Fac"], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], b.inputs["Normal"])
    b.inputs["Roughness"].default_value = 0.65
    if "Specular IOR Level" in b.inputs:
        b.inputs["Specular IOR Level"].default_value = 0.2
    o.data.materials.append(m)
    o.rotation_euler = (0, 0, 0)
    return o, (w, h)
