#!/usr/bin/env python3
"""Pone una voz en off en el reel «La venta perdida».

Uso:
  python3 instagram/scripts/poner-voz.py toma.m4a
  python3 instagram/scripts/poner-voz.py toma.m4a --video instagram/lote-4/reel-venta-perdida.mp4 --salida reel-con-voz.mp4

La toma es una sola grabación con las nueve frases del guion (lote-4/textos.md),
en orden y con una pausa corta entre una y otra. El script detecta las pausas,
corta cada frase y la coloca en el segundo exacto de su escena. Si una frase dura
más que su hueco, la acelera un poco (hasta un 18 %) para que no pise la escena
siguiente.

Si no encuentra nueve frases, lista lo que detectó: ajusta --umbral (más negativo
= más sensible al silencio) o --pausa (segundos mínimos de silencio entre frases).
"""
import argparse, re, subprocess, sys, tempfile, os

# (segundo de entrada, hueco máximo en segundos)
LINES = [
    (0.40, 3.40),   # Esta clienta quería comprar en tu tienda. Mira qué pasó.
    (3.90, 2.90),   # Tarda en cargar. Siete segundos.
    (6.95, 0.90),   # Se fue.
    (8.50, 3.20),   # No se ve bien en el celular. No lee nada.
    (11.95, 0.90),  # Se fue.
    (13.40, 3.10),  # Pagar es un enredo. Nueve campos.
    (16.70, 0.90),  # Se fue.
    (18.00, 3.10),  # Tres ventas perdidas. Tres errores con arreglo. Y casi nunca te enteras.
    (21.40, 3.40),  # ¿Tu tienda tiene alguno? Escríbenos.
]
MAX_ATEMPO = 1.18

# Cadenas de filtros para darle más atractivo a la voz. «calido» no cambia la voz:
# limpia el ruido, le da cuerpo en los graves, quita lo «encajonado», aclara la
# dicción, suaviza las eses y la deja pareja. «grave» hace lo mismo y además baja
# el tono casi dos semitonos conservando el timbre (rubberband, formante conservado).
BASE_TONO = (
    "highpass=f=85,afftdn=nr=10:nf=-42,"
    "equalizer=f=190:t=q:w=1.0:g=2.8,"
    "equalizer=f=420:t=q:w=1.2:g=-2.2,"
    "equalizer=f=3200:t=q:w=1.0:g=2.6,"
    "deesser=i=0.35:m=0.5:f=0.5,"
    "treble=g=1.6:f=9500,"
    "acompressor=threshold=0.09:ratio=3:attack=8:release=90:makeup=3"
)
TONOS = {
    "limpio": "",
    "calido": BASE_TONO,
    "grave": BASE_TONO + ",rubberband=pitch=0.915:formant=preserved:pitchq=quality,equalizer=f=140:t=q:w=1.0:g=1.5",
}


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def duration(path):
    r = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return float(r.stdout.strip())


def frases(audio, umbral, pausa, minimo):
    """Devuelve [(inicio, fin)] de los tramos con voz."""
    r = run(["ffmpeg", "-hide_banner", "-i", audio, "-af", f"silencedetect=noise={umbral}dB:d={pausa}", "-f", "null", "-"])
    total = duration(audio)
    sil = []
    ini = None
    for linea in r.stderr.splitlines():
        m = re.search(r"silence_start: ([\d.]+)", linea)
        if m:
            ini = float(m.group(1))
        m = re.search(r"silence_end: ([\d.]+)", linea)
        if m and ini is not None:
            sil.append((ini, float(m.group(1))))
            ini = None
    if ini is not None:
        sil.append((ini, total))
    voz, cursor = [], 0.0
    for s0, s1 in sil:
        if s0 - cursor >= minimo:
            voz.append((cursor, s0))
        cursor = s1
    if total - cursor >= minimo:
        voz.append((cursor, total))
    return voz


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("toma")
    ap.add_argument("--video", default="instagram/lote-4/reel-venta-perdida.mp4")
    ap.add_argument("--salida", default="instagram/lote-4/reel-venta-perdida-con-voz.mp4")
    ap.add_argument("--umbral", type=float, default=-32, help="dB bajo los que hay silencio")
    ap.add_argument("--pausa", type=float, default=0.30, help="segundos de silencio que separan frases")
    ap.add_argument("--minimo", type=float, default=0.18, help="duración mínima de una frase")
    ap.add_argument("--margen", type=float, default=0.06, help="aire que se deja antes y después de cada frase")
    ap.add_argument("--tono", choices=sorted(TONOS), default="limpio", help="limpio (como se grabó), calido o grave")
    ap.add_argument("--plan", help="JSON con los cortes a mano: [{\"t0\": 1.94, \"t1\": 3.92, \"entra\": 0.4}, ...]. Si la toma salió de corrido y las pausas no alcanzan para separar las frases")
    a = ap.parse_args()

    global LINES
    if a.plan:
        import json
        plan = json.load(open(a.plan))
        tramos = [(x["t0"], x["t1"]) for x in plan]
        # el hueco de cada frase llega hasta el inicio de la siguiente (o 0,9 s la última)
        LINES = []
        for i, x in enumerate(plan):
            sig = plan[i + 1]["entra"] if i + 1 < len(plan) else x["entra"] + (x["t1"] - x["t0"]) + 0.9
            LINES.append((x["entra"], max(0.3, sig - x["entra"] - 0.05)))
        print(f"Plan manual: {len(tramos)} cortes")
    else:
        tramos = frases(a.toma, a.umbral, a.pausa, a.minimo)
        print(f"Frases detectadas: {len(tramos)} (se esperan {len(LINES)})")
        for i, (t0, t1) in enumerate(tramos, 1):
            print(f"  {i}: {t0:6.2f} s a {t1:6.2f} s  ({t1 - t0:.2f} s)")
        if len(tramos) != len(LINES):
            print("\nNo coinciden. Ajusta --umbral o --pausa, usa --plan con los cortes a mano, o graba de nuevo con pausas más claras.")
            sys.exit(1)

    entradas = ["-i", a.video, "-i", a.toma]
    filtros, etiquetas = [], []
    for i, ((t0, t1), (entra, hueco)) in enumerate(zip(tramos, LINES)):
        t0, t1 = max(0, t0 - a.margen), t1 + a.margen
        dur = t1 - t0
        cadena = f"[1:a]atrim={t0:.3f}:{t1:.3f},asetpts=PTS-STARTPTS"
        if TONOS[a.tono]:
            cadena += "," + TONOS[a.tono]
        if dur > hueco:
            f = min(MAX_ATEMPO, dur / hueco)
            cadena += f",atempo={f:.4f}"
            print(f"  frase {i + 1}: dura {dur:.2f} s y su hueco es {hueco:.2f} s, se acelera x{f:.2f}")
        cadena += f",afade=t=in:d=0.02,afade=t=out:st={max(0, dur - 0.05):.3f}:d=0.05,adelay={int(entra * 1000)}|{int(entra * 1000)}[v{i}]"
        filtros.append(cadena)
        etiquetas.append(f"[v{i}]")
    filtros.append("".join(etiquetas) + f"amix=inputs={len(LINES)}:normalize=0,dynaudnorm=f=150:g=7,loudnorm=I=-15:TP=-1.5:LRA=9,apad,atrim=0:{duration(a.video):.2f}[a]")
    cmd = ["ffmpeg", "-y", "-loglevel", "error"] + entradas + [
        "-filter_complex", ";".join(filtros), "-map", "0:v", "-map", "[a]",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", a.salida,
    ]
    r = run(cmd)
    if r.returncode != 0:
        print(r.stderr)
        sys.exit(1)
    print(f"\nListo: {a.salida}")


if __name__ == "__main__":
    main()
