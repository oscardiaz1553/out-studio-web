import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { useEffect } from 'react';
import AccentButton from '../components/AccentButton';
import Magnetic from '../components/Magnetic';
import RotatingWord from '../components/RotatingWord';
import { PROJECTS } from '../data/projects';

const MANGO = `${import.meta.env.BASE_URL}mango-hero.webp`;

const EASE = [0.16, 1, 0.3, 1] as const;

// Promesa + palabra rotativa: "Hacemos que tu [marca] sea imposible de
// ignorar." Cada rotación se lee completa y apunta a un servicio real
// (tienda, sitio, app, marca). El texto completo vive en un sr-only.
const SUBJECTS = ['marca', 'tienda online', 'sitio web', 'negocio', 'app'];
const SR_HEADLINE = `Hacemos que tu ${SUBJECTS.join(', tu ')} sea imposible de ignorar.`;

// Prueba social real: proyectos ya en línea.
const LIVE_PROJECTS = PROJECTS.filter((p) => p.status === 'launched').map(
  (p) => p.name,
);

/** El mango partido: objeto 3D grande a un lado, como el H de Huge —
 *  pero on-brand (azul Klein sólido detrás, no negro). Sangra por el
 *  borde superior/derecho, con un halo suave y una deriva lenta. */
function MangoHero() {
  const reduceMotion = useReducedMotion();
  // Parallax con el mouse: el mango se desplaza y se inclina un poco hacia
  // donde mira el cursor (solo con mouse; en táctil queda quieto).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 80, damping: 18 });
  const y = useSpring(py, { stiffness: 80, damping: 18 });

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      px.set((e.clientX / window.innerWidth - 0.5) * -34);
      py.set((e.clientY / window.innerHeight - 0.5) * -26);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduceMotion, px, py]);

  return (
    <motion.div
      aria-hidden
      className="absolute right-[-6%] top-[-4%] sm:top-[-2%] z-[2] pointer-events-none select-none"
      style={{ width: 'clamp(240px, 36vw, 640px)', x, y }}
    >
      {/* Halo: separa el mango del azul plano detrás */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(245,227,179,0.22), transparent 72%)',
          transform: 'scale(1.35)',
        }}
      />
      <motion.img
        src={MANGO}
        alt=""
        loading="eager"
        className="relative w-full h-auto"
        style={{
          filter: 'drop-shadow(0 40px 70px rgba(10,14,50,0.45))',
        }}
        initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1, rotate: -4 }
            : { opacity: 1, scale: 1, rotate: -4, y: [0, -14, 0] }
        }
        transition={
          reduceMotion
            ? { delay: 0.3, duration: 0.9, ease: EASE }
            : {
                opacity: { delay: 0.3, duration: 0.9, ease: EASE },
                scale: { delay: 0.3, duration: 0.9, ease: EASE },
                rotate: { delay: 0.3, duration: 0.9, ease: EASE },
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
              }
        }
      />
    </motion.div>
  );
}

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
 * Hero estilo "Huge": tipografía enorme dominando el fold, sobre azul Klein
 * sólido con el mango partido a sangre por el borde superior derecho. La
 * promesa es el titular ("Hacemos que tu [marca] sea imposible de ignorar"),
 * con la palabra central rotando entre lo que Out hace. Un solo CTA primario
 * (cotizar), uno secundario (ver proyectos) y prueba social real: los
 * proyectos que ya están en línea. Decorativo vía aria-hidden, con la frase
 * completa en un sr-only para lectores de pantalla y buscadores.
 */
export default function HeroSection() {
  return (
    <section
      data-nav-bg="dark"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-klein"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-klein-deep/40 via-transparent to-klein-deep/55 pointer-events-none"
      />

      <MangoHero />

      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-10 lg:px-16 py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <span className="text-paper-pure/75 text-sm sm:text-base tracking-[0.02em]">
            Estudio digital · Bogotá, Colombia
          </span>
        </motion.div>

        <div className="my-10 md:my-14">
          <h1
            className="font-display font-extrabold tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(2.5rem, 7.2vw, 7.6rem)',
              lineHeight: 0.96,
            }}
          >
            <span className="sr-only">{SR_HEADLINE}</span>

            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
              className="block text-paper-pure"
            >
              Hacemos que tu
            </motion.span>
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.7, ease: EASE }}
              className="block text-carne"
            >
              <RotatingWord
                words={SUBJECTS}
                interval={3000}
                className="pb-[0.14em] -mb-[0.14em]"
              />
            </motion.span>
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.7, ease: EASE }}
              className="block text-paper-pure"
            >
              sea imposible de ignorar.
            </motion.span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="flex flex-col gap-7 max-w-[52ch]">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="text-paper-pure/90 leading-relaxed text-base sm:text-lg"
            >
              Diseño y desarrollo a medida, con código propio: tiendas
              Shopify, sitios WordPress, apps y branding pensados para
              convertir visitas en clientes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="flex flex-wrap items-center gap-x-7 gap-y-4"
            >
              <Magnetic>
                <AccentButton
                  href="#cotizar"
                  onBlue
                  className="sm:px-12 sm:py-4"
                >
                  Cotiza tu proyecto
                </AccentButton>
              </Magnetic>
              <a
                href="#proyectos"
                className="text-paper-pure font-medium text-sm sm:text-base underline underline-offset-[6px] decoration-paper-pure/40 hover:decoration-carne hover:text-carne transition-colors duration-200"
              >
                Ver proyectos →
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="flex flex-col gap-2 lg:items-end lg:text-right"
          >
            <span className="text-[11px] tracking-[0.1em] uppercase text-carne">
              Ya en línea
            </span>
            <p className="font-display font-semibold text-paper-pure text-lg sm:text-xl tracking-[-0.01em]">
              {LIVE_PROJECTS.join(' · ')}
            </p>
            <span className="font-display font-semibold text-carne text-sm tracking-[-0.01em]">
              Never the usual.
            </span>
          </motion.div>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
