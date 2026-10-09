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

const MONO = `${import.meta.env.BASE_URL}mono-asoma.webp`;

const EASE = [0.16, 1, 0.3, 1] as const;

// Promesa + palabra rotativa: "Hacemos que tu [marca] sea imposible de
// ignorar." Cada rotación se lee completa y apunta a un servicio real
// (tienda, sitio, app, marca). El texto completo vive en un sr-only.
const SUBJECTS = ['marca', 'tienda online', 'sitio web', 'negocio', 'app'];
const SR_HEADLINE = `Hacemos que tu ${SUBJECTS.join(', tu ')} sea imposible de ignorar.`;

/** El mono aullador agarrado del borde de la portada: la imagen sangra por
 *  el borde derecho y el inferior (se pasa unos píxeles de la pantalla), así
 *  la mano queda realmente "agarrada" y nunca se ve un corte ni una
 *  separación. Se inclina hacia el mouse girando sobre su esquina de agarre,
 *  de modo que los bordes siguen pegados al encuadre. */
function MonoHero() {
  const reduceMotion = useReducedMotion();
  const tilt = useMotionValue(0);
  const rotate = useSpring(tilt, { stiffness: 70, damping: 16 });

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      // Máximo ±1°: lo que se abre en los bordes lo cubre el sangrado.
      tilt.set((e.clientX / window.innerWidth - 0.5) * -2);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduceMotion, tilt]);

  return (
    <motion.div
      aria-hidden
      className="absolute right-[-10px] bottom-[-24px] z-[2] w-[min(82vw,420px)] sm:w-[min(60vw,560px)] lg:w-[min(52vw,780px)] pointer-events-none select-none"
      style={{ rotate, transformOrigin: '100% 100%' }}
    >
      <motion.img
        src={MONO}
        alt=""
        width={1200}
        height={900}
        loading="eager"
        className="w-full h-auto"
        style={{ transformOrigin: '100% 100%' }}
        initial={{ opacity: 0, x: 90 }}
        animate={
          reduceMotion
            ? { opacity: 1, x: 0 }
            : { opacity: 1, x: 0, rotate: [0, -0.8, 0, 0.8, 0] }
        }
        transition={
          reduceMotion
            ? { delay: 0.3, duration: 0.8, ease: EASE }
            : {
                opacity: { delay: 0.3, duration: 0.8, ease: EASE },
                x: { delay: 0.3, duration: 0.9, ease: EASE },
                rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
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
 * sólido con el mono aullador asomándose por el borde derecho. La
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
      {/* Los símbolos de la marca cambiando de forma, de fondo; el mono los
          corta por abajo. */}
      <MorphBrackets className="absolute z-[1] right-[-4%] top-[6%] w-[70%] sm:w-[58%] lg:w-[50%] opacity-[0.17] sm:opacity-[0.24]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-klein-deep/40 via-transparent to-klein-deep/55 pointer-events-none"
      />

      <MonoHero />

      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-10 lg:px-16 pt-24 pb-[220px] sm:pb-[260px] lg:py-28 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <span className="text-paper-pure/75 text-sm sm:text-base tracking-[0.02em]">
            Estudio digital · Bogotá, Colombia
          </span>
        </motion.div>

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
