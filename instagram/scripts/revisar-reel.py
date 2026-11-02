#!/usr/bin/env python3
"""Revisión automática de los cuadros de un reel con Mango (busca los errores que ya se cometieron).

Uso: python3 instagram/scripts/revisar-reel.py carpeta_de_cuadros [fps=24]
Mide, cuadro a cuadro, el naranja de Mango en miniatura y avisa de:
  - cambios bruscos de presencia o de tamaño (Mango que desaparece, sale de cuadro o salta; las explosiones
    de partículas naranja pueden dar algún aviso falso)
  - saltos de posición mayores de 260 px entre dos cuadros seguidos (a 2s el viaje normal entre escenas llega a unos 150)
  - Mango fuera de la zona visible (centro más abajo de 1700 px o más arriba de 300 px)
Es una ayuda: después hay que mirar tiras de cuadros y el video entero.
Requiere opencv-python-headless y numpy.
"""
import glob, sys
import cv2, numpy as np

carpeta = sys.argv[1]; fps = int(sys.argv[2]) if len(sys.argv) > 2 else 24
fs = sorted(glob.glob(carpeta + "/f_*.jpg"))
cnt, cen = [], []
for f in fs:
    im = cv2.resize(cv2.imread(f), (135, 240)); b, g, r = [im[..., i].astype(int) for i in range(3)]
    m = (r > 200) & (g > 70) & (g < 140) & (b < 60)
    cnt.append(m.sum()); ys, xs = np.where(m)
    cen.append((xs.mean() * 8, ys.mean() * 8) if len(xs) else (0, 0))
cnt = np.array(cnt, float)
problemas = 0
for i in range(1, len(cnt)):
    if i > 3 and abs(cnt[i] - cnt[i - 1]) / max(cnt[i - 1], 1) > 0.45:
        print(f"presencia/tamaño cambia de golpe en el cuadro {i} ({i / fps:.2f} s)"); problemas += 1
    d = float(np.hypot(cen[i][0] - cen[i - 1][0], cen[i][1] - cen[i - 1][1]))
    if i > 3 and d > 260:
        print(f"salto de posición de {d:.0f} px en el cuadro {i} ({i / fps:.2f} s)"); problemas += 1
    if cen[i][1] > 1700 or (0 < cen[i][1] < 300):
        print(f"Mango fuera de la zona visible en el cuadro {i} ({i / fps:.2f} s)"); problemas += 1
print("sin problemas detectados" if not problemas else f"{problemas} avisos")
