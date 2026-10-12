import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import QuoteDossier, { QuoteDraft } from '../components/QuoteDossier';
import { AnswerGroup } from '../data/quote';

const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const PIXEL_RATIO = 2;

/*
  Por qué las imágenes se pintan aparte: html-to-image dibuja la hoja como un
  SVG (foreignObject) y Safari no espera a que carguen las imágenes que van
  dentro, así que Mango y el azulejo salían en blanco en el PDF enviado desde
  el iPhone o el Mac. Ahora cada hoja se arma en tres capas sobre un canvas:
    1. Debajo: los fondos con imagen (azulejo) y los fondos de color que los
       contienen, pintados aquí.
    2. Al medio: la captura de html-to-image, sin imágenes y con esos fondos
       transparentes (texto, símbolos, tarjetas).
    3. Encima: cada <img> (Mango, el mango), pintada aquí con drawImage.
  Así ninguna imagen depende del foreignObject. Regla para el dossier: las
  <img> van en posición absoluta (sacarlas de la captura no mueve nada) y
  ningún contenedor de imágenes va rotado (sí la imagen misma).
*/

type Radii = [number, number, number, number];
type Box = { x: number; y: number; w: number; h: number };

const isTransparent = (color: string) =>
  color === 'transparent' || /rgba\(.*,\s*0\)$/.test(color);

function loadImage(url: string, cache: Map<string, Promise<HTMLImageElement | null>>) {
  let p = cache.get(url);
  if (!p) {
    p = new Promise((res) => {
      const img = new Image();
      img.onload = () => img.decode().then(() => res(img), () => res(img));
      img.onerror = () => res(null);
      img.src = url;
    });
    cache.set(url, p);
  }
  return p;
}

function bgUrl(cs: CSSStyleDeclaration): string | null {
  const m = cs.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
  return m ? m[1] : null;
}

function radii(cs: CSSStyleDeclaration, w: number, h: number): Radii {
  const r = (v: string) => {
    const n = parseFloat(v) || 0;
    const px = v.includes('%') ? (n / 100) * Math.min(w, h) : n;
    return Math.min(px, w / 2, h / 2);
  };
  return [
    r(cs.borderTopLeftRadius),
    r(cs.borderTopRightRadius),
    r(cs.borderBottomRightRadius),
    r(cs.borderBottomLeftRadius),
  ];
}

function roundRect(ctx: CanvasRenderingContext2D, { x, y, w, h }: Box, [tl, tr, br, bl]: Radii) {
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.arcTo(x + w, y, x + w, y + tr, tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  ctx.lineTo(x + bl, y + h);
  ctx.arcTo(x, y + h, x, y + h - bl, bl);
  ctx.lineTo(x, y + tl);
  ctx.arcTo(x, y, x + tl, y, tl);
  ctx.closePath();
}

/** Recorta a los contenedores con overflow oculto (con sus esquinas). */
function clipToAncestors(ctx: CanvasRenderingContext2D, el: Element, page: HTMLElement, box: (e: Element) => Box) {
  const chain: Element[] = [];
  for (let a = el.parentElement; a; a = a.parentElement) {
    chain.unshift(a);
    if (a === page) break;
  }
  for (const a of chain) {
    const cs = getComputedStyle(a);
    if (cs.overflow === 'visible' && cs.overflowX === 'visible') continue;
    const b = box(a);
    roundRect(ctx, b, radii(cs, b.w, b.h));
    ctx.clip();
  }
}

function opacityOf(el: Element, page: HTMLElement) {
  let o = 1;
  for (let a: Element | null = el; a; a = a.parentElement) {
    o *= parseFloat(getComputedStyle(a).opacity) || 0;
    if (a === page) break;
  }
  return o;
}

function tileSize(cs: CSSStyleDeclaration, b: Box, iw: number, ih: number) {
  const size = cs.backgroundSize.trim();
  if (size === 'cover' || size === 'contain') {
    const s = (size === 'cover' ? Math.max : Math.min)(b.w / iw, b.h / ih);
    return [iw * s, ih * s];
  }
  const [sw = 'auto', sh = 'auto'] = size.split(/\s+/);
  const len = (v: string, ref: number) =>
    v === 'auto' ? null : v.endsWith('%') ? (parseFloat(v) / 100) * ref : parseFloat(v);
  const w = len(sw, b.w);
  const h = len(sh, b.h);
  if (w != null && h != null) return [w, h];
  if (w != null) return [w, (ih * w) / iw];
  if (h != null) return [(iw * h) / ih, h];
  return [iw, ih];
}

function paintBackground(
  ctx: CanvasRenderingContext2D,
  el: HTMLElement,
  page: HTMLElement,
  box: (e: Element) => Box,
  img: HTMLImageElement | null,
) {
  const cs = getComputedStyle(el);
  const b = box(el);
  ctx.save();
  clipToAncestors(ctx, el, page, box);
  roundRect(ctx, b, radii(cs, b.w, b.h));
  ctx.clip();
  ctx.globalAlpha = opacityOf(el, page);
  if (!isTransparent(cs.backgroundColor)) {
    ctx.fillStyle = cs.backgroundColor;
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
  if (img) {
    const [tw, th] = tileSize(cs, b, img.naturalWidth, img.naturalHeight);
    const [px = '0%', py = '0%'] = cs.backgroundPosition.split(/\s+/);
    const pos = (v: string, free: number) => (v.endsWith('%') ? (parseFloat(v) / 100) * free : parseFloat(v) || 0);
    const ox = pos(px, b.w - tw);
    const oy = pos(py, b.h - th);
    const rep = cs.backgroundRepeat.trim().split(/\s+/);
    const [rx, ry] =
      rep[0] === 'repeat-x' ? ['repeat', 'no-repeat'] : rep[0] === 'repeat-y' ? ['no-repeat', 'repeat'] : [rep[0], rep[1] ?? rep[0]];
    const repX = rx === 'repeat';
    const repY = ry === 'repeat';
    const x0 = repX ? ox - Math.ceil(ox / tw) * tw : ox;
    const y0 = repY ? oy - Math.ceil(oy / th) * th : oy;
    // Medio píxel de traslape para que no se vean costuras entre baldosas.
    for (let y = y0; y < b.h; y += th) {
      for (let x = x0; x < b.w; x += tw) {
        ctx.drawImage(img, b.x + x, b.y + y, tw + 0.5, th + 0.5);
        if (!repX) break;
      }
      if (!repY) break;
    }
  }
  ctx.restore();
}

function paintImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  page: HTMLElement,
  box: (e: Element) => Box,
  pageRect: DOMRect,
) {
  if (!img.naturalWidth) return;
  const w = img.offsetWidth;
  const h = img.offsetHeight;
  // El centro visual no cambia con la rotación: se toma del rectángulo y se
  // aplica la parte lineal de la transformación alrededor de él.
  const r = img.getBoundingClientRect();
  const cx = r.left + r.width / 2 - pageRect.left;
  const cy = r.top + r.height / 2 - pageRect.top;
  const cs = getComputedStyle(img);
  const m = cs.transform && cs.transform !== 'none' ? new DOMMatrix(cs.transform) : null;
  ctx.save();
  clipToAncestors(ctx, img, page, box);
  ctx.globalAlpha = opacityOf(img, page);
  ctx.translate(cx, cy);
  if (m) ctx.transform(m.a, m.b, m.c, m.d, 0, 0);
  const own: Box = { x: -w / 2, y: -h / 2, w, h };
  roundRect(ctx, own, radii(cs, w, h));
  ctx.clip();
  // object-fit: contain (logos de aliados): se encaja sin deformar, según
  // object-position.
  let dx = own.x, dy = own.y, dw = w, dh = h;
  if (cs.objectFit === 'contain') {
    const s = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    dw = img.naturalWidth * s;
    dh = img.naturalHeight * s;
    const [px = '50%', py = '50%'] = cs.objectPosition.split(/\s+/);
    const at = (v: string, free: number) => (v.endsWith('%') ? (parseFloat(v) / 100) * free : parseFloat(v) || 0);
    dx = own.x + at(px, w - dw);
    dy = own.y + at(py, h - dh);
  }
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

/** ¿La captura trae algo pintado? (Una fallida sale toda transparente.) */
function hasInk(canvas: HTMLCanvasElement) {
  const probe = document.createElement('canvas');
  probe.width = 60;
  probe.height = 85;
  const ctx = probe.getContext('2d')!;
  ctx.drawImage(canvas, 0, 0, probe.width, probe.height);
  const data = ctx.getImageData(0, 0, probe.width, probe.height).data;
  let inked = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 0) inked++;
  return inked > 20;
}

async function imagesLoaded(root: HTMLElement) {
  await Promise.all(
    Array.from(root.querySelectorAll('img')).map((img) =>
      (img.complete
        ? Promise.resolve()
        : new Promise<void>((res) => {
            img.addEventListener('load', () => res(), { once: true });
            img.addEventListener('error', () => res(), { once: true });
          })
      ).then(() => img.decode().catch(() => undefined)),
    ),
  );
}

async function renderPage(
  page: HTMLElement,
  toCanvas: typeof import('html-to-image').toCanvas,
  cache: Map<string, Promise<HTMLImageElement | null>>,
): Promise<{ jpg: string; w: number; h: number }> {
  const pageRect = page.getBoundingClientRect();
  const w = page.offsetWidth;
  const h = page.offsetHeight;
  const box = (e: Element): Box => {
    const r = e.getBoundingClientRect();
    return { x: r.left - pageRect.left, y: r.top - pageRect.top, w: r.width, h: r.height };
  };

  // Capa de abajo: los elementos con imagen de fondo y los fondos de color
  // que los contienen (si no, la captura los taparía).
  const all = [page, ...Array.from(page.querySelectorAll<HTMLElement>('*'))];
  const under = new Set<HTMLElement>([page]);
  for (const el of all) {
    if (!bgUrl(getComputedStyle(el))) continue;
    under.add(el);
    for (let a = el.parentElement; a && a !== page; a = a.parentElement) {
      if (!isTransparent(getComputedStyle(a).backgroundColor)) under.add(a);
    }
  }
  const underList = all.filter((el) => under.has(el));
  const underImgs = await Promise.all(
    underList.map((el) => {
      const url = bgUrl(getComputedStyle(el));
      return url ? loadImage(url, cache) : Promise.resolve(null);
    }),
  );

  const scale = PIXEL_RATIO;
  const out = document.createElement('canvas');
  out.width = Math.round(w * scale);
  out.height = Math.round(h * scale);
  const ctx = out.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.fillStyle = '#FBF8F5';
  ctx.fillRect(0, 0, w, h);
  underList.forEach((el, i) => paintBackground(ctx, el, page, box, underImgs[i]));

  // Capa del medio: la captura, sin imágenes y con esos fondos vacíos.
  const saved = underList.map((el) => el.getAttribute('style'));
  underList.forEach((el) => {
    el.style.setProperty('background', 'transparent', 'important');
  });
  try {
    const capture = () =>
      toCanvas(page, {
        pixelRatio: scale,
        width: w,
        height: h,
        filter: (node) => !(node instanceof HTMLImageElement),
        style: { margin: '0', boxShadow: 'none' },
      });
    let layer = await capture();
    for (let attempt = 0; !hasInk(layer) && attempt < 3; attempt++) {
      await new Promise((r) => setTimeout(r, 400));
      layer = await capture();
    }
    if (!hasInk(layer)) throw new Error('La captura de una hoja salió vacía.');
    ctx.drawImage(layer, 0, 0, w, h);
  } finally {
    underList.forEach((el, i) => {
      if (saved[i] == null) el.removeAttribute('style');
      else el.setAttribute('style', saved[i]!);
    });
  }

  // Capa de arriba: las imágenes.
  for (const img of Array.from(page.querySelectorAll('img'))) {
    paintImage(ctx, img, page, box, pageRect);
  }

  return { jpg: out.toDataURL('image/jpeg', 0.92), w, h };
}

/**
 * Renderiza el dossier fuera de pantalla a un ancho fijo A4 (así el resultado
 * no depende del tamaño de la ventana), arma cada hoja como imagen y las junta
 * en un PDF A4. Devuelve el PDF en base64 (sin prefijo) y como Blob.
 */
export async function buildDossierPdf(
  draft: QuoteDraft,
  groups: AnswerGroup[],
): Promise<{ base64: string; blob: Blob }> {
  const [{ toCanvas }, { jsPDF }] = await Promise.all([
    import('html-to-image'),
    import('jspdf'),
  ]);

  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = `position:fixed;left:-10000px;top:0;width:${PAGE_W_MM}mm;pointer-events:none`;
  document.body.appendChild(host);
  const root = createRoot(host);
  const cache = new Map<string, Promise<HTMLImageElement | null>>();

  try {
    root.render(createElement(QuoteDossier, { draft, groups }));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await document.fonts.ready;
    await imagesLoaded(host);

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const pages = Array.from(host.querySelectorAll<HTMLElement>('.dossier-page'));
    let first = true;

    for (const page of pages) {
      const { jpg, w, h } = await renderPage(page, toCanvas, cache);
      // Si el contenido de una hoja se pasa de A4, continúa en otra página.
      const imgH = (PAGE_W_MM * h) / w;
      const slices = Math.max(1, Math.ceil(imgH / PAGE_H_MM - 0.02));
      for (let k = 0; k < slices; k++) {
        if (!first) pdf.addPage();
        first = false;
        pdf.addImage(jpg, 'JPEG', 0, -k * PAGE_H_MM, PAGE_W_MM, imgH);
      }
    }

    const dataUri = pdf.output('datauristring');
    const base64 = dataUri.slice(dataUri.indexOf('base64,') + 7);
    return { base64, blob: pdf.output('blob') };
  } finally {
    root.unmount();
    host.remove();
  }
}
