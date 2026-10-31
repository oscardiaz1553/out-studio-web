"""Mango de bloques en una escena nocturna de ciudad, al estilo de los videos de referencia
(personajes simples y redondeados, luz cálida desde abajo, ciudad con luces al fondo).
Uso: python3 mango_noche.py salida.png [ancho]
"""
import math, os, sys, random
import bpy
from mathutils import Vector
sys.path.insert(0, os.path.dirname(__file__))
import mango as M

NAR = (0.95, 0.26, 0.03, 1)
NAR2 = (1.0, 0.42, 0.08, 1)
PIEL = (0.55, 0.26, 0.14, 1)
ORO = (1.0, 0.72, 0.22, 1)


def bloque(nombre, loc, dim, mat, bisel=0.12, parent=None, rot=(0, 0, 0)):
    if parent is not None:
        loc = Vector(loc) + parent.matrix_world.translation
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.object
    o.scale = (dim[0] / 2, dim[1] / 2, dim[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    m = o.modifiers.new("b", "BEVEL")
    m.width, m.segments, m.limit_method = bisel, 4, "NONE"
    M.poner(o, mat, nombre, parent)
    return o


def mango():
    fur = M.mat("fur", NAR, rough=0.55, pelo=0.25)
    fur2 = M.mat("fur2", NAR2, rough=0.55, pelo=0.25)
    piel = M.mat("piel", PIEL, rough=0.5)
    oro = M.mat("oro", ORO, rough=0.25, metal=1.0)
    boca = M.mat("boca", (0.12, 0.01, 0.02, 1), rough=0.8)
    lente = M.mat_lente()
    root = bpy.data.objects.new("mango", None); bpy.context.collection.objects.link(root)
    # cuerpo
    bloque("torso", (0, 0, 1.35), (1.5, 1.0, 1.4), fur, 0.22, root)
    bloque("barriga", (0, -0.42, 1.25), (0.9, 0.3, 0.9), fur2, 0.15, root)
    for s in (-1, 1):
        bloque("brazo", (s * 1.0, 0, 1.45), (0.5, 0.55, 1.3), fur, 0.18, root)
        bloque("mano", (s * 1.0, -0.05, 0.75), (0.5, 0.5, 0.35), piel, 0.12, root)
        bloque("pierna", (s * 0.42, 0, 0.35), (0.62, 0.7, 0.7), fur, 0.16, root)
        bloque("pie", (s * 0.42, -0.18, 0.1), (0.7, 0.95, 0.25), piel, 0.1, root)
    # cabeza
    cab = bpy.data.objects.new("cabeza", None); bpy.context.collection.objects.link(cab)
    cab.parent = root; cab.location = (0, 0, 2.15)
    bpy.context.view_layer.update()
    bloque("craneo", (0, 0, 0.75), (1.9, 1.5, 1.5), fur, 0.3, cab)
    bloque("cresta", (0, 0.05, 1.65), (1.3, 1.0, 0.5), fur2, 0.2, cab)
    bloque("cresta2", (0, 0.1, 1.95), (0.8, 0.7, 0.35), fur, 0.15, cab)
    bloque("cara", (0, -0.72, 0.55), (1.35, 0.25, 1.15), piel, 0.14, cab)
    bloque("barba", (0, -0.5, -0.05), (1.5, 0.7, 0.7), fur2, 0.22, cab)
    bloque("hocico", (0, -0.93, 0.28), (0.7, 0.2, 0.42), (M.mat("hocico", (0.7, 0.36, 0.22, 1), rough=0.5)), 0.08, cab)
    bloque("boca", (0, -1.05, 0.12), (0.42, 0.06, 0.1), boca, 0.03, cab)
    for s in (-1, 1):
        bloque("oreja", (s * 1.0, 0, 0.7), (0.3, 0.5, 0.6), piel, 0.1, cab)
        # lentes redondos con reflejo de atardecer
        bpy.ops.mesh.primitive_cylinder_add(radius=0.34, depth=0.06, location=(s * 0.36, -0.88, 0.78 + 2.15), rotation=(math.pi / 2, 0, 0))
        M.poner(bpy.context.object, lente, "lente", cab)
        bpy.ops.mesh.primitive_torus_add(major_radius=0.35, minor_radius=0.035, location=(s * 0.36, -0.9, 0.78 + 2.15), rotation=(math.pi / 2, 0, 0))
        M.poner(bpy.context.object, oro, "aro", cab)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.2, location=(0, -0.9, 0.82 + 2.15), rotation=(0, math.pi / 2, 0))
    M.poner(bpy.context.object, oro, "puente", cab)
    return root


def ciudad():
    random.seed(4)
    # suelo brillante
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0))
    s = bpy.context.object
    m = bpy.data.materials.new("suelo"); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.02, 0.025, 0.05, 1)
    b.inputs["Roughness"].default_value = 0.3
    s.data.materials.append(m)
    # edificios con ventanas encendidas (textura de ruido emisiva)
    ven = bpy.data.materials.new("ventanas"); ven.use_nodes = True
    n, l = ven.node_tree.nodes, ven.node_tree.links
    b = n["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.01, 0.012, 0.03, 1)
    tc = n.new("ShaderNodeTexCoord"); br = n.new("ShaderNodeTexBrick")
    br.inputs["Scale"].default_value = 2.2
    br.inputs["Mortar Size"].default_value = 0.18
    br.inputs["Color1"].default_value = (1.0, 0.75, 0.35, 1)
    br.inputs["Color2"].default_value = (0.02, 0.03, 0.08, 1)
    br.inputs["Mortar"].default_value = (0.01, 0.01, 0.03, 1)
    nz = n.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 1.6
    mix = n.new("ShaderNodeMixRGB"); mix.blend_type = "MULTIPLY"; mix.inputs["Fac"].default_value = 1
    cr = n.new("ShaderNodeValToRGB")
    cr.color_ramp.elements[0].position = 0.42; cr.color_ramp.elements[1].position = 0.5
    l.new(nz.outputs["Fac"], cr.inputs["Fac"])
    sp = n.new("ShaderNodeSeparateXYZ"); cb = n.new("ShaderNodeCombineXYZ")
    l.new(tc.outputs["Object"], sp.inputs["Vector"])
    l.new(sp.outputs["X"], cb.inputs["X"]); l.new(sp.outputs["Z"], cb.inputs["Y"])
    l.new(cb.outputs["Vector"], br.inputs["Vector"])
    l.new(cb.outputs["Vector"], nz.inputs["Vector"])
    l.new(br.outputs["Color"], mix.inputs["Color1"]); l.new(cr.outputs["Color"], mix.inputs["Color2"])
    l.new(mix.outputs["Color"], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = 2.2
    for i in range(26):
        x = -22 + i * 1.8 + random.uniform(-.4, .4)
        h = random.uniform(5, 16)
        bpy.ops.mesh.primitive_cube_add(location=(x, random.uniform(10, 18), h / 2))
        o = bpy.context.object; o.scale = (random.uniform(.9, 1.6), random.uniform(.9, 1.6), h / 2)
        bpy.ops.object.transform_apply(scale=True)
        o.data.materials.append(ven)


def escena(W, H):
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = 48
    sc.cycles.use_denoising = True
    sc.render.resolution_x, sc.render.resolution_y = W, H
    sc.view_settings.view_transform = "Filmic" if "Filmic" in [v.identifier for v in sc.view_settings.bl_rna.properties["view_transform"].enum_items] else "Standard"
    sc.world = bpy.data.worlds.new("w"); sc.world.use_nodes = True
    bg = sc.world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.01, 0.015, 0.05, 1); bg.inputs["Strength"].default_value = 1.0

    def luz(n, tipo, loc, e, c, tam=3.0, dest=(0, 0, 1.6)):
        d = bpy.data.lights.new(n, tipo); d.energy, d.color = e, c
        if tipo == "AREA": d.size = tam
        o = bpy.data.objects.new(n, d); bpy.context.collection.objects.link(o); o.location = loc
        o.rotation_euler = (Vector(dest) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    luz("calida", "AREA", (2.5, -4, 0.3), 260, (1.0, 0.55, 0.2), 2.5)      # luz baja cálida, como la de la referencia
    luz("contra", "AREA", (-3, 3, 4), 420, (0.35, 0.5, 1.0), 3)           # contraluz azul
    luz("tapa", "AREA", (0, -3, 5), 120, (1, 0.9, 0.8), 3)
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); bpy.context.collection.objects.link(cam)
    sc.camera = cam
    M.mirar(cam, (0.6, -10.5, 2.2), (0, 0, 2.0), lente=42)
    cam.data.dof.use_dof = True; cam.data.dof.focus_distance = 9; cam.data.dof.aperture_fstop = 2.2
    # brillo suave (bloom): compositor de Blender 5 (grupo de nodos de la escena)
    try:
        g = bpy.data.node_groups.new("comp", "CompositorNodeTree")
        g.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
        rl = g.nodes.new("CompositorNodeRLayers"); gl = g.nodes.new("CompositorNodeGlare")
        gl.inputs["Type"].default_value = "Fog Glow"
        gl.inputs["Threshold"].default_value = 0.9
        gl.inputs["Strength"].default_value = 0.6
        out = g.nodes.new("NodeGroupOutput")
        g.links.new(rl.outputs["Image"], gl.inputs["Image"]); g.links.new(gl.outputs["Image"], out.inputs[0])
        sc.compositing_node_group = g
    except Exception as e:
        print("sin bloom:", e)


if __name__ == "__main__":
    salida = sys.argv[1]
    W = int(sys.argv[2]) if len(sys.argv) > 2 else 540
    bpy.ops.wm.read_factory_settings(use_empty=True)
    ciudad(); mango(); escena(W, W * 16 // 9)
    bpy.context.scene.render.filepath = salida
    bpy.ops.render.render(write_still=True)
