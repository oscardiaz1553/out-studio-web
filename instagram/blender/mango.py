"""Mango en 3D, estilizado, construido por código con Blender (bpy).

Se corre con:  python3 instagram/blender/mango.py [salida.blend]
Sin Blender instalado:  pip install bpy

Convención: Blender con Z arriba; Mango mira hacia -Y (la cámara está en -Y).
Esqueleto sencillo con empties (sin armature, para que se anime fácil por código):
  mango_root
   ├─ torso (y brazos)
   └─ head_pivot            ← cuello: rota la cabeza
       ├─ partes de la cabeza
       ├─ mouth_scale       ← ancho de la boca (sonrisa, «o»)
       └─ jaw_pivot         ← bisagra de la mandíbula: rota para abrir la boca
           └─ labio de abajo, dientes de abajo, lengua y barba
"""
import math
import sys

import bpy
from mathutils import Vector

NARANJA = (0.95, 0.24, 0.02, 1)
NARANJA_CLARO = (1.0, 0.36, 0.05, 1)
NARANJA_OSCURO = (0.78, 0.15, 0.01, 1)
PIEL = (0.47, 0.22, 0.12, 1)
PIEL_OSCURA = (0.30, 0.13, 0.08, 1)
DIENTE = (0.98, 0.94, 0.84, 1)
BOCA = (0.20, 0.02, 0.03, 1)
LENGUA = (0.86, 0.30, 0.34, 1)
ORO = (1.0, 0.72, 0.22, 1)


# ───────────── materiales ─────────────
def mat(nombre, color, rough=0.6, metal=0.0, pelo=0.0, sss=0.0, emision=None):
    m = bpy.data.materials.new(nombre)
    m.use_nodes = True
    n = m.node_tree.nodes
    b = n["Principled BSDF"]
    b.inputs["Base Color"].default_value = color
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if pelo and "Specular IOR Level" in b.inputs:
        b.inputs["Specular IOR Level"].default_value = 0.15
    if "Subsurface Weight" in b.inputs and sss:
        b.inputs["Subsurface Weight"].default_value = sss
        b.inputs["Subsurface Radius"].default_value = (0.6, 0.2, 0.1)
    if emision:
        b.inputs["Emission Color"].default_value = emision
        b.inputs["Emission Strength"].default_value = 0.6
    if pelo:  # textura de pelo: ruido fino que da relieve a la superficie
        t = n.new("ShaderNodeTexNoise")
        t.inputs["Scale"].default_value = 140
        t.inputs["Detail"].default_value = 8
        t.inputs["Roughness"].default_value = 0.6
        bump = n.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = pelo
        bump.inputs["Distance"].default_value = 0.02
        m.node_tree.links.new(t.outputs["Fac"], bump.inputs["Height"])
        m.node_tree.links.new(bump.outputs["Normal"], b.inputs["Normal"])
        # variación de tono: el pelo no es de un solo color
        ramp = n.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].color = color
        c2 = (min(1, color[0] * 1.05), min(1, color[1] * 1.45), min(1, color[2] * 1.5), 1)
        ramp.color_ramp.elements[1].color = c2
        t2 = n.new("ShaderNodeTexNoise")
        t2.inputs["Scale"].default_value = 6
        m.node_tree.links.new(t2.outputs["Fac"], ramp.inputs["Fac"])
        m.node_tree.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    return m


def mat_lente():
    """Lente con reflejo de atardecer: azul profundo arriba, azul brillante al medio y naranja abajo."""
    m = bpy.data.materials.new("lente")
    m.use_nodes = True
    n, l = m.node_tree.nodes, m.node_tree.links
    b = n["Principled BSDF"]
    b.inputs["Roughness"].default_value = 0.04
    b.inputs["Metallic"].default_value = 0.2
    tc = n.new("ShaderNodeTexCoord")
    sep = n.new("ShaderNodeSeparateXYZ")
    l.new(tc.outputs["Object"], sep.inputs["Vector"])
    rango = n.new("ShaderNodeMapRange")
    rango.inputs["From Min"].default_value = -0.30      # Y local: de abajo a arriba del lente
    rango.inputs["From Max"].default_value = 0.30
    l.new(sep.outputs["Y"], rango.inputs["Value"])
    r = n.new("ShaderNodeValToRGB")
    cs = r.color_ramp.elements
    cs[0].position, cs[0].color = 0.0, (0.98, 0.45, 0.06, 1)
    cs[1].position, cs[1].color = 1.0, (0.02, 0.05, 0.40, 1)
    e = cs.new(0.42)
    e.color = (0.06, 0.28, 0.95, 1)
    l.new(rango.outputs["Result"], r.inputs["Fac"])
    l.new(r.outputs["Color"], b.inputs["Base Color"])
    l.new(r.outputs["Color"], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = 1.4
    return m


# ───────────── primitivas ─────────────
def poner(o, mat_, nombre, parent=None, suave=True):
    o.name = nombre
    if mat_ is not None:
        o.data.materials.append(mat_)
    if suave and o.type == "MESH":
        for p in o.data.polygons:
            p.use_smooth = True
    if parent is not None:
        o.parent = parent
        o.matrix_parent_inverse = parent.matrix_world.inverted()
    return o


def esfera(nombre, loc, esc, mat_, parent=None, r=1.0, seg=40, anillos=20, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=anillos, rotation=rot)
    o = bpy.context.object
    o.scale = esc
    return poner(o, mat_, nombre, parent)


def cono(nombre, loc, rot, r, largo, mat_, parent=None):
    bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=r, radius2=0.0, depth=largo, location=loc, rotation=rot)
    o = bpy.context.object
    return poner(o, mat_, nombre, parent)


def toro(nombre, loc, rot, mayor, menor, mat_, parent=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=mayor, minor_radius=menor, major_segments=48, minor_segments=14, location=loc, rotation=rot)
    o = bpy.context.object
    return poner(o, mat_, nombre, parent)


def cilindro(nombre, loc, rot, r, largo, mat_, parent=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=r, depth=largo, location=loc, rotation=rot)
    o = bpy.context.object
    return poner(o, mat_, nombre, parent)


def sonrisa(o, angulo):
    """Curva el objeto para que sus extremos suban (sonrisa)."""
    m = o.modifiers.new("sonrisa", "SIMPLE_DEFORM")
    m.deform_method = "BEND"
    m.deform_axis = "Y"
    m.angle = math.radians(angulo)


def vacio(nombre, loc, parent=None):
    o = bpy.data.objects.new(nombre, None)
    bpy.context.collection.objects.link(o)
    o.location = loc
    if parent is not None:
        o.parent = parent
        o.matrix_parent_inverse = parent.matrix_world.inverted()
    return o


# ───────────── el personaje ─────────────
def construir_mango():
    m_pelo = mat("pelo", NARANJA, rough=0.75, pelo=0.45)
    m_pelo_c = mat("pelo_claro", NARANJA_CLARO, rough=0.75, pelo=0.45)
    m_pelo_o = mat("pelo_oscuro", NARANJA_OSCURO, rough=0.8, pelo=0.4)
    m_piel = mat("piel", PIEL, rough=0.5, sss=0.25)
    m_piel_o = mat("piel_oscura", PIEL_OSCURA, rough=0.55)
    m_diente = mat("diente", DIENTE, rough=0.25)
    m_boca = mat("boca", BOCA, rough=0.5)
    m_lengua = mat("lengua", LENGUA, rough=0.4, sss=0.2)
    m_oro = mat("oro", ORO, rough=0.22, metal=1.0)
    m_lente = mat_lente()
    m_negro = mat("negro", (0.02, 0.01, 0.01, 1), rough=0.3)

    root = vacio("mango_root", (0, 0, 0))
    torso = None
    head = vacio("head_pivot", (0, 0.1, -1.0), root)   # cuello

    # cabeza: pelo y cara
    esfera("cabeza", (0, 0.02, 0), (1.18, 0.98, 1.0), m_pelo, head)
    esfera("cara", (0, -0.58, -0.10), (0.74, 0.50, 0.74), m_piel, head)           # máscara de piel
    esfera("frente", (0, -0.62, 0.30), (0.64, 0.40, 0.32), m_piel, head)
    for s in (-1, 1):
        lado = "izq" if s < 0 else "der"
        esfera(f"cachete_{lado}", (s * 0.86, -0.30, -0.26), (0.34, 0.42, 0.58), m_pelo_c, head)
        esfera(f"oreja_{lado}", (s * 1.14, 0.0, 0.08), (0.12, 0.09, 0.17), m_piel_o, head)
        esfera(f"mejilla_{lado}", (s * 0.47, -0.97, -0.36), (0.15, 0.09, 0.12), m_piel, head)  # mejilla que sube con la sonrisa

    # cresta: mechones largos peinados hacia atrás
    for i in range(-3, 4):
        x = i * 0.27
        mech = esfera(f"cresta_{i}", (x, -0.15 + abs(i) * 0.12, 1.12 - abs(i) * 0.07), (0.18, 0.18, 0.70 - abs(i) * 0.06), m_pelo_c if i % 2 else m_pelo, head)
        mech.rotation_euler = (math.radians(-62 + abs(i) * 6), math.radians(-i * 7), math.radians(-i * 9))
    for i, x in enumerate((-0.44, 0.0, 0.44)):   # flequillo sobre la frente
        fl = esfera(f"flequillo_{i}", (x, -0.80, 0.72), (0.24, 0.17, 0.20), m_pelo_c if i % 2 else m_pelo, head)
        fl.rotation_euler = (math.radians(-35), 0, math.radians((i - 1) * 14))

    # nariz
    esfera("nariz", (0, -1.04, -0.02), (0.17, 0.11, 0.13), m_piel_o, head)
    for s in (-1, 1):
        esfera(f"fosa_{s}", (s * 0.065, -1.13, -0.04), (0.035, 0.03, 0.045), m_negro, head)

    # lentes
    for s in (-1, 1):
        lado = "izq" if s < 0 else "der"
        toro(f"aro_{lado}", (s * 0.36, -1.07, 0.30), (math.radians(90), 0, 0), 0.31, 0.04, m_oro, head)
        cilindro(f"lente_{lado}", (s * 0.36, -1.065, 0.30), (math.radians(90), 0, 0), 0.30, 0.03, m_lente, head)
        cilindro(f"patilla_{lado}", (s * 0.70, -0.62, 0.30), (math.radians(90), 0, 0), 0.025, 0.95, m_oro, head).rotation_euler = (math.radians(90), 0, math.radians(s * -3))
    cilindro("puente", (0, -1.09, 0.34), (0, math.radians(90), 0), 0.03, 0.14, m_oro, head)

    # boca: la bisagra de la mandíbula queda detrás de la cara. Cada labio es un arco de
    # tres piezas: el centro y dos comisuras que suben, para que la sonrisa se vea sonrisa.
    boca_escala = vacio("mouth_scale", (0, -1.0, -0.42), head)

    def arco(nombre, z, y, ancho, alto, grosor, mat_, padre, sube=0.05, giro=26):
        centro = esfera(nombre, (0, y, z), (ancho * 0.52, grosor, alto), mat_, padre)
        for sgn in (-1, 1):
            lado = esfera(f"{nombre}_{'i' if sgn < 0 else 'd'}", (sgn * ancho * 0.50, y + 0.015, z + sube), (ancho * 0.30, grosor, alto * 0.92), mat_, padre)
            lado.rotation_euler = (0, math.radians(-sgn * giro), 0)
    esfera("boca_interior", (0, -0.985, -0.44), (0.46, 0.10, 0.17), m_boca, boca_escala)
    arco("dientes_arriba", -0.355, -1.04, 0.62, 0.050, 0.06, m_diente, boca_escala)
    arco("labio_arriba", -0.325, -1.052, 0.70, 0.052, 0.06, m_piel_o, boca_escala)
    jaw = vacio("jaw_pivot", (0, -0.45, -0.30), head)
    arco("labio_abajo", -0.545, -1.042, 0.68, 0.060, 0.07, m_piel_o, jaw, sube=0.09)
    arco("dientes_abajo", -0.505, -1.015, 0.52, 0.040, 0.045, m_diente, jaw, sube=0.08)
    esfera("lengua", (0, -0.97, -0.50), (0.20, 0.08, 0.055), m_lengua, jaw)
    esfera("mentón", (0, -0.78, -0.72), (0.40, 0.30, 0.26), m_piel, jaw)
    # barba: una sola masa que se afina hacia abajo, con un par de mechones laterales
    esfera("barba", (0, -0.50, -1.0), (1.0, 0.56, 0.90), m_pelo, jaw)
    esfera("barba_2", (0, -0.55, -1.50), (0.80, 0.48, 0.62), m_pelo_c, jaw)
    esfera("barba_3", (0, -0.58, -1.88), (0.50, 0.36, 0.42), m_pelo_o, jaw)
    for sgn in (-1, 1):
        m1 = esfera(f"barba_lado_{sgn}", (sgn * 0.66, -0.46, -1.30), (0.28, 0.30, 0.55), m_pelo_c, jaw)
        m1.rotation_euler = (0, math.radians(sgn * 14), 0)
    return dict(root=root, head=head, jaw=jaw, boca=boca_escala, torso=torso)


def escena(res=(540, 960), muestras=24, fondo=(0.106, 0.184, 0.80, 1)):
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = muestras
    sc.cycles.use_denoising = True
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.film_transparent = False
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    sc.world = bpy.data.worlds.new("mundo")
    sc.world.use_nodes = True
    bg = sc.world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = fondo
    bg.inputs["Strength"].default_value = 0.3
    # luz principal cálida, relleno azul y contraluz crema
    def luz(nombre, tipo, loc, energia, color, tam=3.0):
        d = bpy.data.lights.new(nombre, tipo)
        d.energy, d.color = energia, color
        if tipo == "AREA":
            d.size = tam
        o = bpy.data.objects.new(nombre, d)
        bpy.context.collection.objects.link(o)
        o.location = loc
        direccion = Vector((0, 0, -0.5)) - Vector(loc)
        o.rotation_euler = direccion.to_track_quat("-Z", "Y").to_euler()
        return o
    luz("principal", "AREA", (3.5, -5.5, 3.5), 600, (1.0, 0.93, 0.85), 4)
    luz("relleno", "AREA", (-4.5, -4.0, 0.5), 160, (0.55, 0.65, 1.0), 4)
    luz("contra", "AREA", (0.5, 4.5, 3.0), 320, (1.0, 0.88, 0.7), 3)
    cam = bpy.data.objects.new("camara", bpy.data.cameras.new("camara"))
    bpy.context.collection.objects.link(cam)
    sc.camera = cam
    return cam


def mirar(cam, desde, hacia, lente=70):
    cam.location = desde
    cam.data.lens = lente
    cam.rotation_euler = (Vector(hacia) - Vector(desde)).to_track_quat("-Z", "Y").to_euler()


if __name__ == "__main__":
    bpy.ops.wm.read_factory_settings(use_empty=True)
    personaje = construir_mango()
    cam = escena()
    salida = sys.argv[1] if len(sys.argv) > 1 else "/tmp/mango.blend"
    bpy.ops.wm.save_as_mainfile(filepath=salida)
    print("Guardado", salida)
