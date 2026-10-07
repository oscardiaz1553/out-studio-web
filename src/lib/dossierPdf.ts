import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import QuoteDossier, { QuoteDraft } from '../components/QuoteDossier';
import { AnswerGroup } from '../data/quote';

const PAGE_W_MM = 210;
const PAGE_H_MM = 297;

async function imagesLoaded(root: HTMLElement) {
  await Promise.all(
    Array.from(root.querySelectorAll('img')).map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((res) => {
            img.addEventListener('load', () => res(), { once: true });
            img.addEventListener('error', () => res(), { once: true });
          }),
    ),
  );
}

/**
 * Renderiza el dossier fuera de pantalla a un ancho fijo A4 (así el resultado
 * no depende del tamaño de la ventana), captura cada hoja como imagen y arma
 * un PDF A4. Devuelve el PDF en base64 (sin prefijo) y como Blob.
 */
export async function buildDossierPdf(
  draft: QuoteDraft,
  groups: AnswerGroup[],
): Promise<{ base64: string; blob: Blob }> {
  const [{ toJpeg }, { jsPDF }] = await Promise.all([
    import('html-to-image'),
    import('jspdf'),
  ]);

  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = `position:fixed;left:-10000px;top:0;width:${PAGE_W_MM}mm;pointer-events:none`;
  document.body.appendChild(host);
  const root = createRoot(host);

  try {
    root.render(createElement(QuoteDossier, { draft, groups }));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await document.fonts.ready;
    await imagesLoaded(host);

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const pages = Array.from(host.querySelectorAll<HTMLElement>('.dossier-page'));
    let first = true;

    for (const page of pages) {
      const w = page.offsetWidth;
      const h = page.offsetHeight;
      const jpg = await toJpeg(page, {
        quality: 0.92,
        pixelRatio: 2,
        width: w,
        height: h,
        backgroundColor: '#FBF8F5',
        style: { margin: '0', boxShadow: 'none' },
      });
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
