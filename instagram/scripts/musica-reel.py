#!/usr/bin/env python3
"""Música original para el reel «La venta perdida».

Se sintetiza entera con numpy y scipy (sin muestras ni derechos de autor) y se
ajusta a los golpes del video: 114 BPM, con la rejilla desplazada para que los
cambios de escena y las tres «Se fue.» caigan sobre el pulso.

Uso:
  python3 instagram/scripts/musica-reel.py                 # escribe musica.wav
  python3 instagram/scripts/musica-reel.py --video instagram/lote-4/reel-venta-perdida.mp4

Con --video también mezcla la música con el video y escribe el reel final.
Requisitos: numpy, scipy y ffmpeg.
"""
import argparse, subprocess
import numpy as np
from scipy import signal

SR = 44100
DUR = 28.6
BPM = 114.0
BEAT = 60.0 / BPM
OFF = 0.11            # el primer pulso de la rejilla
RNG = np.random.default_rng(7)

# Notas (Hz)
def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)

N = int((DUR + 1.5) * SR)
bed = np.zeros((2, N))      # el groove
fx = np.zeros((2, N))       # golpes y efectos
rev_bus = np.zeros((2, N))  # lo que lleva reverb


def put(buf, sig, t, gain=1.0, pan=0.0):
    i = int(round(t * SR))
    if i >= N or i + len(sig) <= 0:
        return
    s0 = max(0, -i)
    s1 = min(len(sig), N - i)
    l = gain * np.cos((pan + 1) * np.pi / 4)
    r = gain * np.sin((pan + 1) * np.pi / 4)
    buf[0, i + s0:i + s1] += sig[s0:s1] * l
    buf[1, i + s0:i + s1] += sig[s0:s1] * r


def t_(d):
    return np.arange(int(d * SR)) / SR


def lp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), "low")
    return signal.lfilter(b, a, x)


def hp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), "high")
    return signal.lfilter(b, a, x)


def bp(x, f0, f1, order=2):
    b, a = signal.butter(order, [f0 / (SR / 2), f1 / (SR / 2)], "band")
    return signal.lfilter(b, a, x)


# ───────────── instrumentos ─────────────
def kick():
    t = t_(0.38)
    f = 46 + 120 * np.exp(-t / 0.028)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t / 0.14) + 0.25 * RNG.standard_normal(len(t)) * np.exp(-t / 0.004)) * 0.95


def clap():
    t = t_(0.28)
    n = hp(RNG.standard_normal(len(t)), 900)
    e = sum(np.exp(-np.clip(t - d, 0, None) / 0.05) * (t >= d) for d in (0, 0.011, 0.022)) * 0.5
    e += np.exp(-t / 0.11) * 0.6
    return bp(n, 1100, 7500) * e * 0.7


def hat(open_=False):
    t = t_(0.2 if open_ else 0.06)
    n = hp(RNG.standard_normal(len(t)), 7000)
    return n * np.exp(-t / (0.09 if open_ else 0.018)) * 0.35


def tick(freq=2300, level=0.35):
    t = t_(0.05)
    return np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.006) * level


def pop(f0=520, f1=900, d=0.11, level=0.4):
    t = t_(d)
    f = f0 + (f1 - f0) * (1 - np.exp(-t / 0.03))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (d / 3)) * level


def pluck(f, d=0.34, level=0.4):
    t = t_(d)
    x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t / (d / (1.2 + k * 0.6))) for k, a in ((1, 1), (2, 0.4), (3, 0.22), (4, 0.1)))
    return lp(x, 4200) * level


def bass(f, d, level=0.55):
    t = t_(d)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sign(np.sin(2 * np.pi * f * t))
    e = np.minimum(1, t / 0.008) * np.exp(-t / (d * 0.75))
    return lp(x, 520) * e * level


def pad(freqs, d, level=0.12):
    t = t_(d)
    x = np.zeros(len(t))
    for f in freqs:
        for det in (-0.07, 0.0, 0.07):
            x += signal.sawtooth(2 * np.pi * f * (1 + det * 0.01) * t) / 6
    e = np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.5)
    return lp(x, 1800) * e * level


def whoosh(d=0.55, up=True, level=0.5):
    t = t_(d)
    n = RNG.standard_normal(len(t))
    out = np.zeros(len(t))
    chunks = 12
    for k in range(chunks):
        a, b = int(len(t) * k / chunks), int(len(t) * (k + 1) / chunks)
        c = (k + 1) / chunks if up else 1 - k / chunks
        f0 = 300 + 5000 * c ** 1.5
        seg = bp(n[a:b], f0, min(f0 * 1.9, 18000), 2)
        out[a:b] = seg
    e = (t / d) ** 1.6 if up else (1 - t / d) ** 1.6
    return out * e * level * 2.2


def riser(d, level=0.4):
    t = t_(d)
    n = hp(RNG.standard_normal(len(t)), 1200)
    f = 180 * (2 ** (t / d * 3.2))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.35
    e = (t / d) ** 2.2
    return (n * 0.8 + tone) * e * level


def impact(level=1.0, d=1.6):
    t = t_(d)
    f = 38 + 52 * np.exp(-t / 0.09)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.55)
    noise = lp(RNG.standard_normal(len(t)), 2600) * np.exp(-t / 0.18) * 0.7
    crack = hp(RNG.standard_normal(len(t)), 3000) * np.exp(-t / 0.03) * 0.5
    return (sub * 0.95 + noise * 0.55 + crack * 0.4) * level


def chime(f, d=1.4, level=0.3):
    t = t_(d)
    x = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.3) + 0.25 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / 0.12)
    return x * np.exp(-t / 0.55) * level


def loss_blip(level=0.35):
    a = pop(659, 659, 0.1, level)
    b = pop(494, 494, 0.16, level)
    return np.concatenate([a, np.zeros(int(0.01 * SR)), b])


# ───────────── línea de tiempo ─────────────
def beats(a, b, per=1):
    """Tiempos de la rejilla entre a y b (per = subdivisiones por pulso)."""
    k0 = int(np.ceil((a - OFF) / (BEAT / per)))
    out = []
    k = k0
    while OFF + k * BEAT / per < b - 1e-6:
        out.append(OFF + k * BEAT / per)
        k += 1
    return out


FLIPS = [3.3, 8.15, 13.0, 17.7, 23.8]
EXITS = [3.0, 7.85, 12.6, 17.4, 23.5]
SEFUE = [6.95, 11.95, 16.7]

# Acordes por compás: menor y tenso al principio, mayor y esperanzado al resolver
ACORDES_MENOR = [(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])]   # Am F C G
ACORDES_MAYOR = [(48, [55, 60, 64]), (43, [55, 59, 62]), (45, [57, 60, 64]), (41, [53, 57, 60])]   # C G Am F


def acorde_en(t):
    bar = int((t - OFF) // (BEAT * 4)) if t >= OFF else 0
    tabla = ACORDES_MAYOR if t >= 17.7 else ACORDES_MENOR
    return tabla[bar % 4]


# capas activas por escena: (kick, hat, clap, bass, arp, pad)
def capas(t):
    if t < 3.3:
        return dict(kick=t > 1.6, hat=t > 1.0, clap=False, bass=False, arp=False, pad=True)
    if t < 8.15:
        return dict(kick=True, hat=True, clap=False, bass=True, arp=False, pad=True)
    if t < 13.0:
        return dict(kick=True, hat=True, clap=True, bass=True, arp=True, pad=True)
    if t < 17.7:
        return dict(kick=True, hat=True, clap=True, bass=True, arp=True, pad=True)
    if t < 21.3:
        return dict(kick=True, hat=True, clap=True, bass=True, arp=True, pad=True)
    if t < 22.25:
        return dict(kick=False, hat=False, clap=False, bass=False, arp=True, pad=True)   # respiro antes de «nunca te enteras»
    if t < 27.2:
        return dict(kick=True, hat=True, clap=True, bass=True, arp=True, pad=True)
    return dict(kick=False, hat=False, clap=False, bass=False, arp=False, pad=False)


# Huecos de silencio justo antes de cada golpe, para que el golpe pegue más
STOPS = [(s - 0.30, s + 0.02) for s in SEFUE] + [(22.25 - 0.20, 22.25 + 0.02), (27.2 - 0.25, 27.5 + 0.02)]


def construir():
    kicks = []
    # pulso
    for t in beats(0.0, 27.2, 1):
        c = capas(t)
        if c["kick"]:
            put(bed, kick(), t, 0.9 if t >= 3.3 else 0.45)   # en la intro, un latido suave
            kicks.append(t)
    for t in beats(0.0, 27.2, 2):
        c = capas(t)
        if c["hat"]:
            idx = int(round((t - OFF) / (BEAT / 2)))
            put(bed, hat(open_=(idx % 4 == 3)), t, 0.55 if idx % 2 else 0.4, pan=0.25 if idx % 2 else -0.25)
    for t in beats(0.0, 27.2, 1):
        idx = int(round((t - OFF) / BEAT))
        if idx % 2 == 1 and capas(t)["clap"]:
            put(bed, clap(), t, 0.8)
    # bajo y arpegio con los acordes
    for t in beats(3.3, 27.2, 2):
        c = capas(t)
        raiz, notas = acorde_en(t)
        idx = int(round((t - OFF) / (BEAT / 2)))
        if c["bass"]:
            nota = raiz + (12 if idx % 4 == 3 else 0)
            put(bed, bass(midi(nota), BEAT * 0.45), t, 0.8)
        if c["arp"]:
            n = notas[idx % len(notas)] + (12 if idx % 8 >= 4 else 0)
            put(bed, pluck(midi(n + 12)), t, 0.5, pan=-0.3 if idx % 2 else 0.3)
            put(rev_bus, pluck(midi(n + 12)), t, 0.25, pan=-0.3 if idx % 2 else 0.3)
    # colchón de acordes
    for k in range(0, 13):
        bar_ini = OFF + k * BEAT * 4
        if bar_ini >= 27.2:
            break
        raiz, notas = acorde_en(bar_ini + 0.01)
        if capas(bar_ini + 0.01)["pad"] or capas(min(bar_ini + BEAT * 2, 27.0))["pad"]:
            put(rev_bus, pad([midi(n) for n in notas], BEAT * 4 + 0.4), bar_ini, 1.5 if bar_ini < 3.3 else 0.8)
    return kicks


def efectos():
    # subidas y barridos antes de cada cambio de escena
    for e, f in zip(EXITS, FLIPS):
        put(fx, riser(f - e + 0.45, 0.5), e - 0.4, 0.6)
        put(fx, whoosh(0.5, up=False, level=0.5), f - 0.02, 0.7, pan=0.3)
        put(fx, impact(0.55, 1.2), f, 0.6)
        put(rev_bus, impact(0.4, 1.2), f, 0.4)
    # gancho
    put(fx, impact(0.8, 1.6), 0.30, 0.7)
    for t in (0.35, 0.7, 1.05):
        put(fx, pop(190, 120, 0.1, 0.45), t, 0.7)
    put(fx, pop(520, 980, 0.12, 0.4), 1.95, 0.7)
    # escena 2: reloj que corre
    t = 4.1
    paso = 0.22
    while t < 6.85:
        put(fx, tick(2300 + (t - 4.1) * 160, 0.28), t, 0.8, pan=-0.2)
        paso = max(0.09, paso * 0.965)
        t += paso
    # «Se fue.»: golpe seco + gota del contador
    for s in SEFUE:
        put(fx, impact(1.0, 1.7), s, 1.0)
        put(rev_bus, impact(0.5, 1.7), s, 0.5)
        put(fx, whoosh(0.35, up=True, level=0.45), s - 0.12, 0.6)
        put(fx, loss_blip(0.32), s + 0.05, 0.9)
        put(fx, whoosh(0.4, up=False, level=0.4), s - 0.1, 0.55, pan=0.6)   # el teléfono sale volando
    # globos y avatares
    for t in (4.25, 4.55, 9.0, 9.3, 15.2, 15.5):
        put(fx, pop(480, 820, 0.1, 0.35), t, 0.6, pan=-0.4)
    # escena 3: pellizco y rebote
    put(fx, whoosh(0.55, up=True, level=0.4), 9.8, 0.7)
    put(fx, impact(0.35, 0.8), 10.95, 0.5)
    # escena 4: los campos se apilan
    for i in range(10):
        put(fx, pop(420 + i * 55, 650 + i * 70, 0.09, 0.34), 13.7 + 0.2 * i, 0.7, pan=-0.2 + 0.04 * i)
    # escena 5: la suma
    put(fx, impact(0.9, 1.7), 18.6, 0.9)
    put(fx, pop(660, 990, 0.12, 0.4), 19.4, 0.7)
    put(fx, impact(0.7, 1.4), 22.25, 0.8)
    put(rev_bus, impact(0.4, 1.4), 22.25, 0.4)
    # escena 6: cierre
    put(fx, whoosh(0.6, up=True, level=0.4), 24.7, 0.7)
    put(fx, pop(300, 520, 0.14, 0.45), 24.9, 0.7)
    put(fx, impact(1.0, 1.8), 27.5, 0.9)
    put(rev_bus, impact(0.5, 1.8), 27.5, 0.5)
    for f_, t in ((midi(72), 27.6), (midi(76), 27.75), (midi(79), 27.9), (midi(84), 28.05)):
        put(fx, chime(f_, 1.4, 0.32), t, 0.7, pan=-0.2)
        put(rev_bus, chime(f_, 1.4, 0.3), t, 0.4)
    put(bed, pad([midi(n) for n in (48, 55, 60, 64, 67)], 1.8, 0.2), 27.5, 0.9)


def reverb(x, secs=1.9, wet=0.28):
    t = t_(secs)
    ir = RNG.standard_normal((2, len(t))) * np.exp(-t / (secs / 4.5))
    ir = np.array([lp(ir[0], 5500), lp(ir[1], 5500)])
    ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
    return np.array([signal.fftconvolve(x[c], ir[c])[:N] for c in range(2)]) * wet


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--salida", default="instagram/lote-4/musica-venta-perdida.wav")
    ap.add_argument("--video", help="si se da, mezcla la música con el video")
    ap.add_argument("--reel", default="instagram/lote-4/reel-venta-perdida-con-musica.mp4")
    ap.add_argument("--volumen", type=float, default=1.0)
    a = ap.parse_args()

    construir()
    efectos()

    # los silencios antes de cada golpe se aplican solo al groove
    duck = np.ones(N)
    for s0, s1 in STOPS:
        i0, i1 = int(s0 * SR), int(s1 * SR)
        duck[i0:i1] = 0.0
        r = int(0.08 * SR)
        duck[i1:i1 + r] = np.linspace(0, 1, r)
        duck[max(0, i0 - int(0.02 * SR)):i0] = np.linspace(1, 0, i0 - max(0, i0 - int(0.02 * SR)))
    bed_m = bed * duck
    rev_m = rev_bus * duck
    mix = bed_m * 0.9 + fx * 0.95 + reverb(rev_m)
    # filtro de graves suave y limitador
    mix = np.array([hp(mix[c], 28, 2) for c in range(2)])
    mix = np.tanh(mix * 0.9) / np.tanh(0.9)
    fin = np.ones(N)
    f0 = int((DUR - 0.9) * SR)
    fin[f0:] = np.linspace(1, 0, N - f0) ** 2
    mix = mix[:, :N] * fin
    mix = mix[:, :int(DUR * SR)]
    pico = np.abs(mix).max()
    mix = mix / pico * 0.89 * a.volumen
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16).T.copy()
    import wave
    with wave.open(a.salida, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print("Música escrita:", a.salida)

    if a.video:
        r = subprocess.run([
            "ffmpeg", "-y", "-loglevel", "error", "-i", a.video, "-i", a.salida,
            "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-shortest", "-movflags", "+faststart", a.reel], capture_output=True, text=True)
        if r.returncode:
            print(r.stderr); raise SystemExit(1)
        print("Reel con música:", a.reel)


if __name__ == "__main__":
    main()
