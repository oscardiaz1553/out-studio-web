"""Exploración de enfoques para Mango en 3D que aguanten de lado.
  A: pelo real (partículas de pelo de Blender) sobre una cabeza esculpida
  B: low poly facetado (formas grandes y angulosas, adrede)
Uso: python3 instagram/blender/explorar.py carpeta [a|b]"""
import math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import bpy, bmesh
import mango

C = mango


def vgrupo(obj, nombre, f):
    """Grupo de vértices con peso f(x, y, z) sobre las coordenadas del objeto."""
    g = obj.vertex_groups.new(name=nombre)
    for v in obj.data.vertices:
        g.add([v.index], float(max(0, min(1, f(*v.co)))), "REPLACE")


def pelo(obj, nombre, cantidad, largo, hijos, direccion=(0, 0, 0), normal=1.0, grupo=None, grosor=0.012, mat_=None, rizo=0.0):
    ps_mod = obj.modifiers.new(nombre, "PARTICLE_SYSTEM")
    ps = ps_mod.particle_system
    s = ps.settings
    s.type = "HAIR"
    s.count = cantidad
    s.hair_length = largo
    s.child_type = "INTERPOLATED"
    s.child_percent = hijos
    s.rendered_child_count = hijos
    s.child_radius = 0.25
    s.child_roundness = 0.4
    s.clump_factor = 0.55
    s.clump_shape = 0.1
    s.roughness_1 = 0.08
    s.roughness_1_size = 1.0
    s.normal_factor = normal
    s.object_align_factor = direccion
    s.hair_step = 5
    s.display_step = 2
    s.render_step = 5
    s.root_radius = grosor
    s.tip_radius = grosor * 0.15
    s.use_advanced_hair = False
    if grupo:
        ps.vertex_group_density = grupo
    if rizo:
        s.kink = "CURL"
        s.kink_amplitude = rizo
        s.kink_frequency = 4.0
    if mat_ is not None:
        obj.data.materials.append(mat_)
        s.material = len(obj.data.materials)
    return ps


def mat_pelo():
    m = bpy.data.materials.new("pelo_real")
    m.use_nodes = True
    n, l = m.node_tree.nodes, m.node_tree.links
    b = n["Principled BSDF"]
    info = n.new("ShaderNodeHairInfo")
    r = n.new("ShaderNodeValToRGB")
    r.color_ramp.elements[0].color = (0.45, 0.07, 0.005, 1)
    e = r.color_ramp.elements.new(0.5)
    e.color = (0.95, 0.27, 0.02, 1)
    r.color_ramp.elements[2 if len(r.color_ramp.elements) > 2 else 1].color = (1.0, 0.5, 0.1, 1)
    ruido = n.new("ShaderNodeTexNoise")
    ruido.inputs["Scale"].default_value = 30
    suma = n.new("ShaderNodeMath"); suma.operation = "ADD"
    mul = n.new("ShaderNodeMath"); mul.operation = "MULTIPLY"; mul.inputs[1].default_value = 0.3
    l.new(info.outputs["Intercept"], suma.inputs[0])
    l.new(ruido.outputs["Fac"], mul.inputs[0])
    l.new(mul.outputs["Value"], suma.inputs[1])
    l.new(suma.outputs["Value"], r.inputs["Fac"])
    l.new(r.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.55
    return m


def variante_a():
    """Cabeza esculpida más cuidada con pelo real."""
    d = mango.construir_mango()
    # fuera los mechones de bolas: los reemplaza el pelo
    for o in list(bpy.data.objects):
        if o.name.startswith(("cresta_", "flequillo_", "barba_lado", "barba_2", "barba_3")):
            bpy.data.objects.remove(o)
    m_pelo = mat_pelo()
    cab = bpy.data.objects["cabeza"]
    # el pelo de la cabeza crece hacia arriba y hacia atrás; no en la cara (adelante)
    vgrupo(cab, "pelo", lambda x, y, z: (y + 0.55) * 1.6 if y > -0.55 else 0)
    pelo(cab, "pelo_cabeza", 2500, 0.65, 40, direccion=(0, 0.5, 0.35), normal=0.8, grupo="pelo", grosor=0.014, mat_=m_pelo)
    bar = bpy.data.objects["barba"]
    vgrupo(bar, "pelo", lambda x, y, z: 1.0)
    pelo(bar, "pelo_barba", 2500, 0.8, 40, direccion=(0, 0, -1.2), normal=0.4, grupo="pelo", grosor=0.016, mat_=m_pelo)
    for lado in ("izq", "der"):
        c = bpy.data.objects[f"cachete_{lado}"]
        vgrupo(c, "pelo", lambda x, y, z: 1.0)
        pelo(c, "pelo_cachete", 900, 0.5, 30, direccion=(0, 0, -0.9), normal=0.7, grupo="pelo", grosor=0.014, mat_=m_pelo)
    return d


def variante_b():
    """Low poly facetado: formas grandes y angulosas, con sombra plana."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    def mate(nombre, color):
        m = bpy.data.materials.new(nombre)
        m.use_nodes = True
        m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = color
        m.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.8
        return m
    nar, nar2, nar3 = mate("n1", (0.95, 0.27, 0.02, 1)), mate("n2", (1.0, 0.42, 0.06, 1)), mate("n3", (0.75, 0.15, 0.01, 1))
    piel, boca, diente = mate("piel", (0.5, 0.23, 0.12, 1)), mate("boca", (0.2, 0.02, 0.03, 1)), mate("diente", (0.98, 0.93, 0.82, 1))
    oro, lente = mate("oro", (1.0, 0.72, 0.2, 1)), mango.mat_lente()

    def ico(nombre, loc, esc, mat_, sub=2, rot=(0, 0, 0)):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=1, location=loc, rotation=rot)
        o = bpy.context.object; o.scale = esc; o.name = nombre; o.data.materials.append(mat_)
        for p in o.data.polygons: p.use_smooth = False
        return o
    def cono(nombre, loc, rot, r, largo, mat_, v=5):
        bpy.ops.mesh.primitive_cone_add(vertices=v, radius1=r, radius2=0, depth=largo, location=loc, rotation=rot)
        o = bpy.context.object; o.name = nombre; o.data.materials.append(mat_)
        for p in o.data.polygons: p.use_smooth = False
        return o
    ico("cabeza", (0, 0, 0), (1.2, 1.0, 1.05), nar)
    ico("cara", (0, -0.6, -0.1), (0.78, 0.5, 0.78), piel)
    for s in (-1, 1):
        ico(f"cachete{s}", (s * 0.9, -0.2, -0.25), (0.36, 0.45, 0.6), nar2)
        ico(f"oreja{s}", (s * 1.18, 0.0, 0.1), (0.13, 0.1, 0.2), piel, sub=1)
    # cresta: pirámides altas peinadas hacia atrás
    for i in range(-2, 3):
        cono(f"cresta{i}", (i * 0.34, -0.1 + abs(i) * 0.1, 1.15 - abs(i) * 0.08), (math.radians(-35), math.radians(-i * 8), math.radians(-i * 8)), 0.30, 1.0 - abs(i) * 0.1, nar2 if i % 2 else nar)
    # barba: tres pirámides apiladas que se afinan
    cono("barba1", (0, -0.55, -1.15), (math.radians(180), 0, 0), 0.95, 1.4, nar, v=6)
    cono("barba2", (0, -0.6, -1.9), (math.radians(180), 0, 0), 0.62, 1.2, nar3, v=6)
    cono("barba3", (0, -0.62, -2.5), (math.radians(180), 0, 0), 0.34, 0.9, nar2, v=6)
    # lentes angulosos
    for s in (-1, 1):
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.34, depth=0.05, location=(s * 0.4, -1.08, 0.3), rotation=(math.radians(90), 0, 0))
        l = bpy.context.object; l.name = f"lente{s}"; l.data.materials.append(lente)
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.38, depth=0.04, location=(s * 0.4, -1.075, 0.3), rotation=(math.radians(90), 0, 0))
        a = bpy.context.object; a.name = f"aro{s}"; a.data.materials.append(oro)
    ico("nariz", (0, -1.07, -0.03), (0.2, 0.12, 0.14), piel, sub=1)
    # boca: cuña oscura, dientes arriba, sonrisa angulosa
    ico("boca", (0, -1.04, -0.46), (0.46, 0.1, 0.2), boca, sub=1)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.12, -0.34)); t = bpy.context.object
    t.scale = (0.5, 0.05, 0.07); t.name = "dientes"; t.data.materials.append(diente)
    return None


if __name__ == "__main__":
    out = sys.argv[1]
    cual = sys.argv[2] if len(sys.argv) > 2 else "a"
    if cual == "a":
        bpy.ops.wm.read_factory_settings(use_empty=True)
        variante_a()
    else:
        variante_b()
    cam = mango.escena(res=(540, 720), muestras=20)
    sc = bpy.context.scene
    sc.render.film_transparent = True
    mango.tinta(2.4)
    import estilo
    for nombre, ang in (("frente", 0), ("tres-cuartos", 40), ("lado", 90)):
        a = math.radians(ang)
        mango.mirar(cam, (math.sin(a) * 10.5, -math.cos(a) * 10.5, -0.5), (0, 0, -0.6), 62)
        ruta = os.path.join(out, f"{cual}-{nombre}.png")
        sc.render.filepath = ruta
        bpy.ops.render.render(write_still=True)
        rgba = estilo.comic_alfa(ruta)
        fondo = np.array([0.106, 0.184, 0.80])
        comp = rgba[..., :3] * rgba[..., 3:4] + fondo * (1 - rgba[..., 3:4])
        gi = bpy.data.images.new("tmp", comp.shape[1], comp.shape[0], alpha=True)
        sal = np.ones((comp.shape[0], comp.shape[1], 4), dtype=np.float32)
        sal[..., :3] = np.clip(comp[::-1], 0, 1)
        gi.pixels = sal.ravel().tolist()
        gi.filepath_raw = os.path.join(out, f"{cual}-estilo-{nombre}.png"); gi.file_format = "PNG"; gi.save()
        bpy.data.images.remove(gi)
    print("listo", cual)
