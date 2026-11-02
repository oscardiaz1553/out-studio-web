#!/usr/bin/env python3
"""Arma la carpeta que se publica como artefacto de la hoja de exposición de un reel.

Uso: python3 instagram/mango2d/hoja/preparar.py eventos.json dialogo.wav <hoja_id> carpeta_salida
Crea en carpeta_salida: index.html (con el id de la hoja y las frases del reel), dialogo.mp3,
mango.png y las carpetas bocas/ y ojos/ con las imágenes a la mitad de tamaño (para que la página pese poco).
Después se publica con la herramienta Artifact (file_path = index.html, root = carpeta_salida,
files con todos los archivos, capabilities {"db": {}}) y se siembra el documento hojas/<hoja_id>.
"""
import glob, json, os, re, subprocess, sys
import bpy

ev, audio, hoja_id, salida = sys.argv[1:5]
aqui = os.path.dirname(os.path.abspath(__file__)); raiz = os.path.dirname(aqui)
os.makedirs(os.path.join(salida, "bocas"), exist_ok=True); os.makedirs(os.path.join(salida, "ojos"), exist_ok=True)


def mitad(src, dst):
    im = bpy.data.images.load(src); w, h = im.size; im.scale(max(1, w // 2), max(1, h // 2))
    im.filepath_raw = dst; im.file_format = "PNG"; im.save(); bpy.data.images.remove(im)


mitad(os.path.join(raiz, "mango-sin-boca.png"), os.path.join(salida, "mango.png"))
for carpeta in ("bocas", "ojos"):
    for p in glob.glob(os.path.join(raiz, carpeta, f"{carpeta[:-1] if carpeta == 'bocas' else carpeta}-*.png")):
        mitad(p, os.path.join(salida, carpeta, os.path.basename(p)))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", audio, "-ac", "1", "-b:a", "96k", os.path.join(salida, "dialogo.mp3")], check=True)
html = open(os.path.join(aqui, "index.html")).read()
eventos = json.dumps(json.load(open(ev)), ensure_ascii=False, separators=(",", ":"))
html = re.sub(r'const HOJA_ID = "[^"]*"', f'const HOJA_ID = "{hoja_id}"', html, count=1)
html = re.sub(r"const EV = \[.*?\];", lambda m: f"const EV = {eventos};", html, count=1, flags=re.S)
open(os.path.join(salida, "index.html"), "w").write(html)
print("listo:", salida, len(os.listdir(os.path.join(salida, "bocas"))), "bocas,", len(os.listdir(os.path.join(salida, "ojos"))), "ojos")
