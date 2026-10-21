import { motion, useReducedMotion } from 'framer-motion';
import AccentButton from '../components/AccentButton';
import { SCENES } from '../components/ServiceScenes';
import SymbolField from '../components/SymbolField';

const HOME = import.meta.env.BASE_URL;

const POINTS = [
  'Tienda online, sitio web, landing page o tu marca',
  'Para cualquier negocio que está arrancando',
  'Diseño UX/UI a la medida, sin plantillas',
];

/**
 * Out Emprende en su propia sección de la portada: el plan para emprendedores
 * (tienda, sitio, landing o marca) no es un servicio más de la lista, así que tiene su franja con la lámina
 * "Plan para emprendedores" y un sello que gira.
 */
export default function OutEmprendeSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="out-emprende"
      data-nav-bg="dark"
      className="relative overflow-hidden bg-klein-deep text-paper-pure px-6 md:px-10 lg:px-16 py-16 sm:py-20 md:py-24"
    >
      <SymbolField
        color="#F5E3B3"
        opacity={0.07}
        items={[
          { kind: 'curly', x: 6, y: 18, size: 'clamp(7rem, 15vw, 15rem)', rot: -8, dur: 14 },
          { kind: 'square', x: 92, y: 86, size: 'clamp(6rem, 12vw, 12rem)', rot: 6, dur: 12, delay: 2, desktopOnly: true },
        ]}
      />

      <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center gap-12 lg:gap-20">
        <div>
          <h2
            className="font-display font-extrabold tracking-[-0.05em] leading-[0.92]"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            Out Emprende
          </h2>
          <p
            className="mt-5 max-w-[22ch] font-display font-bold tracking-[-0.03em] leading-[1.08] text-carne"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}
          >
            Tu proyecto web, con un plan pensado para emprendedores.
          </p>

          <ul className="mt-8 flex flex-col gap-3.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-paper-pure/90 text-base sm:text-lg">
                <span aria-hidden className="shrink-0 w-7 h-7 rounded-full bg-carne text-klein-deep flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <AccentButton href={`${HOME}#cotizar`} onBlue className="sm:px-12 sm:py-4">
              Quiero empezar
            </AccentButton>
            <a
              href={`${HOME}out-emprende/`}
              className="font-medium underline underline-offset-[6px] decoration-paper-pure/40 hover:decoration-carne hover:text-carne transition-colors"
            >
              ¿Es para mí?
            </a>
          </div>
        </div>

        {/* La lámina del plan, inclinada, con un sello que gira encima. */}
        <div className="relative w-full max-w-[340px] sm:max-w-[420px] mx-auto">
          <motion.a
            href={`${HOME}out-emprende/`}
            aria-label="Ver Out Emprende"
            initial={reduceMotion ? false : { y: 40, rotate: 0 }}
            whileInView={{ y: 0, rotate: 4 }}
            whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.02 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18 }}
            className="relative block aspect-[4/5] rounded-[28px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            style={{ containerType: 'inline-size' }}
          >
            {SCENES.emprende}
          </motion.a>

          <motion.div
            aria-hidden
            className="absolute -right-4 -top-6 sm:-right-8 sm:-top-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-carne text-klein-deep shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <path id="sello" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
              </defs>
              <text fontSize="11" fontWeight="700" letterSpacing="1.4" fill="currentColor" style={{ fontFamily: 'var(--display)' }}>
                <textPath href="#sello" textLength="222" lengthAdjust="spacing">PLAN PARA EMPRENDEDORES · </textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-carne-deep" />
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
