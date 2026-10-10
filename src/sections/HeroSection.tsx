import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { useEffect } from 'react';
import AccentButton from '../components/AccentButton';
import MorphBrackets from '../components/MorphBrackets';
import Magnetic from '../components/Magnetic';
import RotatingWord from '../components/RotatingWord';

const MANGO = `${import.meta.env.BASE_URL}mango-hero.webp`;

const EASE = [0.16, 1, 0.3, 1] as const;

// Promesa + palabra rotativa: "Hacemos que tu [marca] sea imposible de
// ignorar." Cada rotación se lee completa y apunta a un servicio real
// (tienda, sitio, app, marca). El texto completo vive en un sr-only.
const SUBJECTS = ['marca', 'tienda online', 'sitio web', 'negocio'];
const SR_HEADLINE = `Desarrollo web y tiendas Shopify en Colombia. Hacemos que tu ${SUBJECTS.join(', tu ')} sea imposible de ignorar.`;

/** El mango partido: el objeto de siempre de la marca, grande a un lado. Flota
 *  despacio y se desplaza un poco con el mouse (parallax; en táctil queda
 *  quieto). En escritorio sangra por el borde derecho; en el celular se
 *  apoya abajo a la derecha. */
function MangoHero() {
  const reduceMotion = useReducedMotion();
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
      className="absolute z-[2] pointer-events-none select-none right-[-20%] bottom-[-2%] w-[min(70vw,340px)] sm:right-[-9%] sm:bottom-auto sm:top-[16%] sm:w-[clamp(300px,37vw,620px)]"
      style={{ x, y }}
    >
      <motion.img
        src={MANGO}
        alt=""
        width={1147}
        height={930}
        loading="eager"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 40px 70px rgba(10,14,50,0.45))' }}
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
      </motion.div>
    </motion.div>
  );
}

/**
 * Hero estilo "Huge": tipografía enorme dominando el fold, sobre azul Klein
 * sólido con el mango partido a un lado. La
 * promesa es el titular ("Hacemos que tu [marca] sea imposible de ignorar"),
 * con la palabra central rotando entre lo que Out hace. Un solo CTA primario
 * (cotizar) y uno secundario (ver proyectos). Decorativo vía aria-hidden, con la frase
 * completa en un sr-only para lectores de pantalla y buscadores.
 */
export default function HeroSection() {
  return (
    <section
      data-nav-bg="dark"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-klein"
    >
      {/* Los símbolos de la marca cambiando de forma, de fondo; el mango queda
          por delante. */}
      <MorphBrackets className="absolute z-[1] right-[-4%] top-[6%] w-[70%] sm:w-[58%] lg:w-[50%] opacity-[0.17] sm:opacity-[0.24]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-klein-deep/40 via-transparent to-klein-deep/55 pointer-events-none"
      />

      <MangoHero />

      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-10 lg:px-16 pt-24 pb-[220px] sm:pb-[260px] lg:py-28 md:pt-28">
        {/* Separador vacío: conserva la distribución vertical de la portada. */}
        <div aria-hidden />

        <div className="my-8 md:my-10">
          <h1
            className="font-display font-extrabold tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(2.5rem, 6.2vw, 6.8rem)',
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

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-7 max-w-[52ch]">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="text-paper-pure/90 leading-relaxed text-base sm:text-lg"
            >
              Diseño y desarrollo a medida, con código propio: tiendas
              Shopify, sitios WordPress, landing pages y branding pensados para
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
                Ver proyectos
              </a>
            </motion.div>
          </div>

          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="font-display font-semibold text-carne text-sm tracking-[-0.01em]"
          >
            Never the usual.
          </motion.span>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
