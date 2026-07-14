import { useScroll } from 'framer-motion';
import { useEffect, useRef } from 'react';

const VIDEO = `${import.meta.env.BASE_URL}Out_video.mp4`;

/**
 * Sección scroll-scrubbing (efecto tipo Apple): el video no se reproduce
 * solo; el scroll controla su currentTime. Al bajar avanza, al subir
 * retrocede. El bloque es alto y el visor queda anclado (sticky) mientras
 * se recorre. Encima, el logo "Out." blanco, fijo y centrado.
 */
export default function ScrollVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let duration = 0;
    let target = 0; // segundo objetivo según el scroll
    let current = 0; // segundo aplicado (suavizado)

    const readDuration = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        duration = video.duration;
      }
    };

    // Prime para que iOS/Safari permita hacer seek sin gesto previo.
    const prime = () => {
      readDuration();
      video.pause();
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
    };

    video.addEventListener('loadedmetadata', readDuration);
    video.addEventListener('loadeddata', prime, { once: true });
    if (video.readyState >= 1) readDuration();

    const unsubscribe = scrollYProgress.on('change', (p) => {
      if (duration) {
        target = Math.min(duration, Math.max(0, p * duration));
      }
    });

    // Bucle de suavizado: interpola currentTime hacia el objetivo del scroll.
    const tick = () => {
      if (duration) {
        current += (target - current) * 0.18;
        if (Math.abs(target - current) < 0.004) current = target;
        if (video.readyState >= 2 && Number.isFinite(current)) {
          try {
            video.currentTime = current;
          } catch {
            /* seek fuera de rango durante la carga: se ignora */
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      video.removeEventListener('loadedmetadata', readDuration);
      video.removeEventListener('loadeddata', prime);
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      aria-label="Out. — Never the usual"
      className="relative h-[320vh] bg-klein-deep"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={VIDEO}
          muted
          playsInline
          preload="auto"
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
