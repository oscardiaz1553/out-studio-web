import { useScroll } from 'framer-motion';
import { useEffect, useRef } from 'react';

/*
  Secuencia de fotogramas extraída de Out_video.mp4 (public/out-seq/).
  Scrubbing tipo Apple: el scroll elige el fotograma y un canvas lo pinta.
  Un <video> con seek por currentTime va a saltos (solo decodifica rápido
  en keyframes); con imágenes precargadas el cuadro exacto sale al instante.
*/
const FRAME_COUNT = 119;
const frameSrc = (i: number) =>
  `${import.meta.env.BASE_URL}out-seq/f_${String(i + 1).padStart(4, '0')}.webp`;

export default function ScrollVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);
    let raf = 0;
    let target = 0; // fotograma que pide el scroll
    let current = 0; // fotograma pintado (suavizado)
    let lastDrawn = -1;
    let disposed = false;

    // Precarga en dos pasadas: primero 1 de cada 8 (el scrub funciona ya),
    // después el resto en orden.
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (images[i]) return resolve();
        const img = new Image();
        img.onload = () => {
          images[i] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameSrc(i);
      });

    (async () => {
      const coarse: number[] = [];
      const rest: number[] = [];
      for (let i = 0; i < FRAME_COUNT; i++) {
        (i % 8 === 0 ? coarse : rest).push(i);
      }
      await Promise.all(coarse.map(load));
      if (disposed) return;
      lastDrawn = -1; // repintar con el primer material disponible
      // El resto en tandas para no saturar la red
      const BATCH = 12;
      for (let s = 0; s < rest.length; s += BATCH) {
        if (disposed) return;
        await Promise.all(rest.slice(s, s + BATCH).map(load));
      }
      lastDrawn = -1;
    })();

    // Dibujo tipo object-fit: cover
    const draw = (index: number) => {
      // usa el fotograma cargado más cercano si este aún no está
      let img = images[index];
      if (!img) {
        for (let d = 1; d < FRAME_COUNT && !img; d++) {
          img = images[index - d] ?? images[index + d] ?? null;
        }
      }
      if (!img) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth * dpr;
      const ch = canvas.clientHeight * dpr;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      const scale = Math.max(cw / img.width, ch / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const unsubscribe = scrollYProgress.on('change', (p) => {
      target = Math.min(FRAME_COUNT - 1, Math.max(0, p * (FRAME_COUNT - 1)));
    });

    const tick = () => {
      current += (target - current) * 0.22;
      if (Math.abs(target - current) < 0.05) current = target;
      const index = Math.round(current);
      if (index !== lastDrawn) {
        draw(index);
        lastDrawn = index;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      lastDrawn = -1;
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      unsubscribe();
      window.removeEventListener('resize', onResize);
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      aria-label="Out. — Never the usual"
      className="relative h-[300vh] bg-klein-deep"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden
        />

        {/* Scrim on-brand para que el logo blanco siempre tenga contraste */}
        <div className="absolute inset-0 bg-klein-deep/30 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 50%, rgba(20,30,92,0.35) 0%, rgba(20,30,92,0) 70%)',
          }}
        />

        <h2
          aria-label="Out."
          className="relative z-10 font-display font-extrabold tracking-[-0.05em] leading-none flex items-baseline select-none text-paper-pure"
          style={{
            fontSize: 'clamp(5rem, 22vw, 20rem)',
            filter: 'drop-shadow(0 4px 44px rgba(20,30,92,0.45))',
          }}
        >
          Out
          <span
            aria-hidden
            className="inline-block rounded-full bg-paper-pure"
            style={{ width: '0.16em', height: '0.16em', marginLeft: '0.03em' }}
          />
        </h2>
      </div>
    </section>
  );
}
