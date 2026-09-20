import { motion, useReducedMotion } from 'framer-motion';
import AccentButton from '../components/AccentButton';
import Magnetic from '../components/Magnetic';
import RevealText from '../components/RevealText';
import { BOTANICA } from '../data/botanica';

const HEADLINE = ['CASI TODO', 'OBEDECE.', 'UNA COSA', 'SE SALE.'];

function ScrollCue() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-paper-pure/70"
    >
      <span className="text-[10px] tracking-[0.18em]">SCROLL</span>
      <motion.span
        aria-hidden
        className="block w-px h-8 bg-paper-pure/50"
        animate={reduceMotion ? {} : { scaleY: [0.3, 1, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'top' }}
      />
    </motion.div>
  );
}

/**
 * Hero estilo "Huge": tipografía enorme dominando el fold, sobre la lámina
 * botánica de la marca a sangre completa, en vez del layout partido
 * texto/imagen anterior. El titular se revela línea por línea al cargar.
 */
export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-klein">
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
          <RevealText
            as="h1"
            lines={HEADLINE}
            unit="line"
            trigger="mount"
            delay={0.15}
            stagger={0.09}
            lineClassName="overflow-hidden"
            className="font-display font-extrabold text-paper-pure tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(2.6rem, 8.5vw, 8.5rem)',
              lineHeight: 0.94,
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="text-paper-pure/85 leading-relaxed max-w-[46ch] text-base sm:text-lg"
          >
            Diseñamos y desarrollamos tu tienda Shopify o tu web en WordPress,
            con código propio y de principio a fin, para que no se vea como
            todas y venda de verdad.
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
