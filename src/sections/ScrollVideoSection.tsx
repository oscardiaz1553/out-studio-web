import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const VIDEO = `${import.meta.env.BASE_URL}Out_video.mp4`;

/**
 * Sección scroll-reactiva bajo el hero. El video corre a sangre y queda
 * anclado (sticky) mientras se scrollea; encima, el logo "Out." centrado
 * cambia de color siguiendo el progreso: azul Klein → blanco → naranja.
 * El fondo klein-deep sostiene la marca si el video no carga.
 */
export default function ScrollVideoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // El logo: azul → blanco → naranja a lo largo del scroll de la sección.
  const color = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#1B2FCC', '#FBF8F5', '#BC6039']
  );
  // Respiro sutil de escala para darle vida (desactivado con reduce-motion).
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.06, 0.98]);
  const scale = reduce ? 1 : scaleRaw;
  // Entra y sale con un fade en los extremos.
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.55, 1, 1, 0.55]
  );

  return (
    <section
      ref={ref}
      aria-label="Out. — Never the usual"
      className="relative h-[240vh] bg-klein-deep"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          style={{ filter: 'brightness(0.92)' }}
        />

        {/* Scrim on-brand (klein-deep) para legibilidad al pasar por el blanco */}
        <div className="absolute inset-0 bg-klein-deep/30 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 50%, rgba(20,30,92,0.35) 0%, rgba(20,30,92,0) 70%)',
          }}
        />

        <motion.h2
          aria-label="Out."
          className="relative z-10 font-display font-extrabold tracking-[-0.05em] leading-none flex items-baseline select-none"
          style={{
            color,
            scale,
            opacity,
            fontSize: 'clamp(5rem, 22vw, 20rem)',
            filter: 'drop-shadow(0 4px 44px rgba(20,30,92,0.45))',
          }}
        >
          Out
          <motion.span
            aria-hidden
            className="inline-block rounded-full"
            style={{
              width: '0.16em',
              height: '0.16em',
              marginLeft: '0.03em',
              backgroundColor: color,
            }}
          />
        </motion.h2>
      </div>
    </section>
  );
}
