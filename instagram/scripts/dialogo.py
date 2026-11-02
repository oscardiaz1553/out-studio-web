#!/usr/bin/env python3
"""Arma el diálogo de un reel con dos voces (narrador y Mango).

Uso: python3 instagram/scripts/dialogo.py instagram/dialogo/plan.json salida_carpeta
Escribe: narrador.wav y mango.wav (cada voz sola, en su sitio de la línea de tiempo, para mover
la boca de cada personaje), dialogo.wav (las dos juntas) y eventos.json (inicio y fin de cada frase).
"""
import json, os, subprocess, sys

plan = json.load(open(sys.argv[1]))
out = sys.argv[2]
os.makedirs(out, exist_ok=True)
base = os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), "..", "voces")
dur = plan["duracion"]


def pistas(voz):
    cmd = ["ffmpeg", "-y", "-loglevel", "error"]
    filtros, mezcla, n = [], [], 0
    for l in plan["lineas"]:
        if l["voz"] != voz:
            continue
        cmd += ["-i", os.path.join(base, f"{l.get('archivo', voz)}.mp3")]
        d = l["b"] - l["a"]
        ms = int(l["t"] * 1000)
        filtros.append(f"[{n}:a]atrim={l['a']}:{l['b']},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono,"
                       f"afade=t=in:d=0.02,afade=t=out:st={d-0.04:.3f}:d=0.04,adelay={ms}[v{n}]")
        mezcla.append(f"[v{n}]")
        n += 1
    filtros.append("".join(mezcla) + f"amix=inputs={n}:normalize=0,apad=whole_dur={dur}[o]")
    cmd += ["-filter_complex", ";".join(filtros), "-map", "[o]", "-t", str(dur), "-ar", "44100", "-ac", "1", os.path.join(out, f"{voz}.wav")]
    subprocess.run(cmd, check=True)


for v in ("narrador", "mango"):
    pistas(v)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(out, "narrador.wav"), "-i", os.path.join(out, "mango.wav"),
                "-filter_complex", "[0:a][1:a]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=7[o]", "-map", "[o]",
                "-ar", "44100", os.path.join(out, "dialogo.wav")], check=True)
ev = [{"voz": l["voz"], "t0": l["t"], "t1": round(l["t"] + l["b"] - l["a"], 2), "texto": l["texto"]} for l in plan["lineas"]]
json.dump(ev, open(os.path.join(out, "eventos.json"), "w"), ensure_ascii=False, indent=1)
print("listo:", out)
