import { motion, useReducedMotion } from 'framer-motion';
import AccentButton from '../components/AccentButton';
import Magnetic from '../components/Magnetic';
import RotatingWord from '../components/RotatingWord';
import { BOTANICA } from '../data/botanica';

const EASE = [0.16, 1, 0.3, 1] as const;

// Los tres servicios "de producto" (no Integraciones/Soporte, que son más
// de acompañamiento que de titular). Cada rotación debe leerse completa:
// "Tiendas Shopify que venden.", "Sitios WordPress que venden.", etc.
const SERVICES = ['Tiendas Shopify', 'Sitios WordPress', 'Landing Pages'];
const SR_HEADLINE = SERVICES.map((s) => `${s} que venden.`).join(' ');

function ScrollCue() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
    >
      <motion.div
        animate={reduceMotion ? {} : { y: [0, 5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex items-center gap-2 rounded-full bg-paper-pure/95 backdrop-blur-md px-4 py-2 text-klein-deep text-xs font-medium tracking-[0.04em] shadow-[0_8px_24px_rgba(20,20,60,0.2)]"
      >
        Scroll
        <span aria-hidden>↓</span>
      </motion.div>
    </motion.div>
  );
}

/**
 * Hero estilo "Huge": tipografía enorme dominando el fold, sobre la lámina
 * botánica de la marca a sangre completa. El titular rota entre los tres
 * servicios ("Tiendas Shopify / Sitios WordPress / Landing Pages que
 * venden.") — decorativo vía aria-hidden, con las tres frases completas
 * disponibles en un sr-only para lectores de pantalla y buscadores.
 */
export default function HeroSection() {
  return (
    <section
      data-nav-bg="dark"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-klein"
    >
      <img
        src={BOTANICA}
        alt=""
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '60% 40%' }}
      />

      {/* Tinte Klein + degradado: la lámina queda on-brand y el texto en
          paper-pure se lee limpio de arriba a abajo. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-klein/55 mix-blend-multiply pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-klein-deep/50 via-klein-deep/25 to-klein-deep/65 pointer-events-none"
      />

      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-10 lg:px-16 py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex flex-wrap items-baseline justify-between gap-4"
        >
          <span className="text-paper-pure/75 text-sm sm:text-base tracking-[0.02em]">
            Estudio digital · Bogotá, Colombia
          </span>
          <span className="font-display font-semibold text-carne text-sm sm:text-base tracking-[-0.01em]">
            Never the usual.
          </span>
        </motion.div>

        <div className="my-10 md:my-14">
          <h1
            className="font-display font-extrabold tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(2.6rem, 8.5vw, 8.5rem)',
              lineHeight: 0.94,
            }}
          >
            {/* Texto real para lectores de pantalla y buscadores: las tres
                variantes completas, sin depender de en qué punto de la
                rotación esté la animación decorativa. */}
            <span className="sr-only">{SR_HEADLINE}</span>

            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
              className="block text-paper-pure"
            >
              <RotatingWord words={SERVICES} />
            </motion.span>
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: EASE }}
              className="block text-carne"
            >
              que venden.
            </motion.span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="text-paper-pure/85 leading-relaxed max-w-[46ch] text-base sm:text-lg"
          >
            Shopify, WordPress o una landing: código propio, de principio a
            fin, para que no se vea como todas y venda de verdad.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            <Magnetic>
              <AccentButton
                href="#contacto"
                onBlue
                className="sm:px-12 sm:py-4"
              >
                Hablemos
              </AccentButton>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
