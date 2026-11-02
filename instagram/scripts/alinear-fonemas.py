#!/usr/bin/env python3
"""Alineamiento forzado de fonemas para el lipsync de Mango.

Sabemos exactamente qué dice cada frase (instagram/dialogo/plan.json), así que se convierte el
texto a fonemas del español y se ubica cada uno en el audio con Viterbi: se prueban todas las
formas de repartir la secuencia en el tiempo y se queda la que mejor calza con lo que se oye
(energía, sonidos de aire, voz, vocal por formantes).

Uso: python3 instagram/scripts/alinear-fonemas.py mango.wav eventos.json salida.json
Salida: lista de {t0, t1, fon, palabra, frase} por fonema, en segundos de la línea de tiempo.
"""
import json, re, sys, wave
import numpy as np
from scipy.linalg import solve_toeplitz
from scipy.signal import resample_poly, butter, sosfilt

# ───────── texto a fonemas (español latino: seseo, y = i/ʝ, h muda) ─────────
def g2p(palabra):
    p = palabra.lower()
    p = (p.replace("á", "a'").replace("é", "e'").replace("í", "i'").replace("ó", "o'").replace("ú", "u'").replace("ñ", "N")
         .replace("ü", "u"))
    out = []; i = 0
    while i < len(p):
        c = p[i]; n = p[i + 1] if i + 1 < len(p) else ""
        if c == "'": i += 1; continue
        if c in "aeiou": out.append(c)
        elif c == "c" and n == "h": out.append("ch"); i += 1
        elif c == "c" and n in "ei": out.append("s")
        elif c == "c": out.append("k")
        elif c == "q": out.append("k"); i += 1 if n == "u" else 0
        elif c == "g" and n == "u" and p[i + 2:i + 3] in ("e", "i"): out.append("g"); i += 1
        elif c == "g" and n in "ei": out.append("x")
        elif c == "g": out.append("g")
        elif c == "j": out.append("x")
        elif c == "z": out.append("s")
        elif c == "s": out.append("s")
        elif c == "v" or c == "b": out.append("b")
        elif c == "y": out.append("i" if (i + 1 == len(p) or n not in "aeiou") else "y")
        elif c == "l" and n == "l": out.append("y"); i += 1
        elif c == "r" and n == "r": out.append("r"); i += 1
        elif c == "r": out.append("r")
        elif c == "h": pass
        elif c == "x": out += ["k", "s"]
        elif c == "N": out.append("n")
        elif c in "dfklmnptw": out.append(c)
        i += 1
    return out

def frase_a_fonemas(texto):
    res = []
    for w in re.findall(r"[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+", texto):
        for f in g2p(w): res.append((f, w))
    return res

CLASE = {"a": "V", "e": "V", "i": "V", "o": "V", "u": "V", "s": "F", "f": "F", "x": "F", "ch": "F",
         "m": "N", "n": "N", "l": "L", "r": "L", "y": "L", "b": "B", "d": "B", "g": "B", "p": "S", "t": "S", "k": "S", "w": "L"}
MIN = {"V": 4, "F": 6, "N": 4, "L": 3, "B": 3, "S": 5}      # cuadros de 10 ms mínimos por fonema
CENTROS = {"a": (780, 1350), "e": (520, 1850), "i": (330, 2150), "o": (520, 950), "u": (340, 850)}

# ───────── acústica ─────────
def leer(ruta):
    w = wave.open(ruta); n = w.getnchannels()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    if n > 1: x = x.reshape(-1, n).mean(axis=1)
    return x, w.getframerate()

def rasgos(x, sr, t0, t1):
    """Rasgos cada 10 ms entre t0 y t1: energía, aire (>4 kHz), voz, formantes."""
    a, b = int(max(0, t0 - 0.06) * sr), int(min(len(x) / sr, t1 + 0.06) * sr)
    seg = x[a:b]; base = max(0, t0 - 0.06)
    sos = butter(4, 4000, btype="high", fs=sr, output="sos"); alto = sosfilt(sos, seg)
    y = resample_poly(seg, 11025, sr); y = np.append(y[0], y[1:] - 0.97 * y[:-1]); s2 = 11025
    H, V = int(s2 * 0.01), int(s2 * 0.03); n = (len(y) - V) // H
    E = np.zeros(n); A = np.zeros(n); VO = np.zeros(n); F = np.zeros((n, 2))
    for i in range(n):
        w = y[i * H:i * H + V] * np.hamming(V)
        E[i] = np.sqrt(np.mean(w ** 2)) + 1e-9
        j0, j1 = int((i * H / s2) * sr), int(((i * H + V) / s2) * sr)
        A[i] = np.sqrt(np.mean(alto[j0:j1] ** 2)) / (np.sqrt(np.mean(seg[j0:j1] ** 2)) + 1e-9) if j1 > j0 else 0
        r = np.correlate(w, w, "full")[V - 1:]
        lo, hi = int(s2 / 400), int(s2 / 70)
        VO[i] = r[lo:hi].max() / (r[0] + 1e-9)
        if E[i] > 1e-4:
            try:
                co = solve_toeplitz(r[:12] + np.eye(12)[0] * r[0] * 1e-4, r[1:13])
                rt = [z for z in np.roots(np.r_[1, -co]) if z.imag > 0.01]
                fr = sorted((np.angle(z) * s2 / (2 * np.pi), -np.log(abs(z)) * s2 / np.pi) for z in rt)
                fr = [f for f, bw in fr if f > 220 and bw < 450]
                if len(fr) >= 2: F[i] = fr[0], fr[1]
            except Exception: pass
    db = 20 * np.log10(E)
    return base, db, A, VO, F

def emision(fon, db, A, VO, F, techo):
    """Puntaje de cada fotograma de 10 ms para un fonema (más alto = calza mejor)."""
    n = len(db); e = np.clip((db - (techo - 40)) / 40, 0, 1)         # 0 silencio ... 1 fuerte
    c = CLASE[fon]
    if c == "V":
        s = 2.2 * e + 1.6 * VO - 2.0 * A
        cx = CENTROS[fon]
        d = np.where(F[:, 0] > 0, ((F[:, 0] - cx[0]) / 260) ** 2 + ((F[:, 1] - cx[1]) / 480) ** 2, 1.2)
        return s - 0.9 * np.minimum(d, 4)
    if c == "F":
        return 3.0 * A + 0.8 * e - 1.6 * VO - 0.6
    if c == "N":
        return 1.6 * VO - 1.5 * np.abs(e - 0.45) - 1.2 * A
    if c == "L":
        return 1.2 * VO - 1.5 * np.abs(e - 0.55) - 1.2 * A
    if c == "B":
        return 0.8 * VO - 1.8 * np.abs(e - 0.35) - 0.6 * A
    # oclusivas sordas: cierre silencioso
    return -2.2 * e - 0.6 * VO + 0.4 * A

def viterbi(secuencia, db, A, VO, F, techo):
    """Reparte la secuencia de fonemas en el tiempo, de izquierda a derecha, con duraciones mínimas."""
    n = len(db); estados = []                  # (fonema_idx, sub)
    for k, (f, _) in enumerate(secuencia):
        for s in range(MIN[CLASE[f]]): estados.append((k, s))
    S = len(estados); emi = np.zeros((S, n)); cache = {}
    for si, (k, s) in enumerate(estados):
        f = secuencia[k][0]
        if f not in cache: cache[f] = emision(f, db, A, VO, F, techo)
        emi[si] = cache[f]
    NEG = -1e9; dp = np.full((S, n), NEG); bp = np.zeros((S, n), dtype=np.int32)
    dp[0, 0] = emi[0, 0]
    ultimo = {k: max(si for si, (kk, _) in enumerate(estados) if kk == k) for k in range(len(secuencia))}
    for t in range(1, n):
        for si in range(S):
            k, s = estados[si]
            # quedarse en el último sub-estado del fonema (alarga el fonema) o avanzar
            cand = []
            if si > 0: cand.append((dp[si - 1, t - 1], si - 1))
            if si == ultimo[k]: cand.append((dp[si, t - 1] - 0.05, si))
            if not cand: continue
            v, p = max(cand)
            if v > NEG / 2: dp[si, t] = v + emi[si, t]; bp[si, t] = p
    # el último fonema puede terminar en cualquier fotograma final
    si = S - 1; t = int(np.argmax(dp[S - 1, n // 2:]) + n // 2)
    ruta = [0] * n
    for tt in range(t, -1, -1):
        ruta[tt] = si; si = bp[si, tt]
    ruta = ruta[:t + 1]
    res = {}
    for tt, si in enumerate(ruta):
        k = estados[si][0]
        res.setdefault(k, [tt, tt]); res[k][1] = tt
    return res

def main():
    x, sr = leer(sys.argv[1]); ev = json.load(open(sys.argv[2])); salida = []
    for e in ev:
        if e["voz"] != "mango": continue
        seq = frase_a_fonemas(e["texto"])
        base, db, A, VO, F = rasgos(x, sr, e["t0"], e["t1"])
        techo = np.percentile(db, 97)
        r = viterbi(seq, db, A, VO, F, techo)
        for k, (f, w) in enumerate(seq):
            if k not in r: continue
            a, b = r[k]
            salida.append({"t0": round(base + a * 0.01, 3), "t1": round(base + (b + 1) * 0.01, 3), "fon": f, "palabra": w, "frase": e["texto"]})
    json.dump(salida, open(sys.argv[3], "w"), ensure_ascii=False, indent=1)
    cur = None
    for s in salida:
        if s["frase"] != cur: cur = s["frase"]; print("\n" + cur)
        print(f'  {s["t0"]:6.2f}-{s["t1"]:6.2f}  {s["fon"]:>2}  ({s["palabra"]})')

if __name__ == '__main__': main()
