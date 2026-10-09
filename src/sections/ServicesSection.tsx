import TitleFrame from '../components/TitleFrame';
import WordStage from '../components/WordStage';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { useRef, useState } from 'react';
import FadeIn from '../components/FadeIn';
import RevealText from '../components/RevealText';

const BASE = import.meta.env.BASE_URL;

// Servicios reales de Out, con el lenguaje en tono cálido y directo. Cada uno
// lleva una lámina de la ilustración de marca que aparece siguiendo al mouse
// al pasar por encima (en escritorio): un detalle de agencia, con identidad.
const SERVICES = [
  {
    name: 'Tiendas Shopify',
    description:
      'Tu tienda vendiendo desde el primer día, no cuando por fin quede lista.',
    preview: `${BASE}previews/prev-1.webp`,
    tilt: -4,
  },
  {
    name: 'Sitios WordPress',
    description:
      'Una web profesional que actualizas tú mismo, sin depender de nadie.',
    preview: `${BASE}previews/prev-2.webp`,
    tilt: 3,
  },
  {
    name: 'Landing Pages',
    description:
      'Páginas de campaña con un solo objetivo: que la gente actúe.',
    preview: `${BASE}previews/prev-3.webp`,
    tilt: -3,
  },
  {
    name: 'Branding',
    description:
      'Logo e identidad visual con carácter: que te reconozcan a la primera.',
    preview: `${BASE}previews/prev-4.webp`,
    tilt: 4,
  },
  {
    name: 'Apps & Integraciones',
    description:
      'Productos a medida y herramientas conectadas para que el trabajo repetitivo se haga solo.',
    preview: `${BASE}previews/prev-5.webp`,
    tilt: -2,
  },
  {
    name: 'Soporte & Optimización',
    description: 'No desaparecemos después del lanzamiento. Seguimos contigo.',
    preview: `${BASE}previews/prev-1.webp`,
    tilt: 3,
  },
];

export default function ServicesSection() {
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // La lámina sigue al cursor con un resorte suave (coordenadas relativas a
  // la lista, para que no dependa del scroll).
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !listRef.current) return;
    const r = listRef.current.getBoundingClientRect();
    // La lámina se queda en el espacio libre entre título y descripción y
    // sólo sigue al cursor en vertical (con un leve desplazamiento lateral),
    // así nunca tapa el título que estás mirando.
    x.set(r.width * 0.6 + (e.clientX - r.left - r.width / 2) * 0.12);
    y.set(e.clientY - r.top);
  };

  const showPreview = !reduceMotion;

  return (
    <section
      id="servicios"
      className="bg-paper-pure border-t border-klein-deep/15 px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-3">
          <TitleFrame kind="square" tone="warm" fontSize="clamp(2rem, 4vw, 3.4rem)">
            <RevealText
            as="h2"
            text="Servicios"
            unit="char"
            className="font-display font-semibold text-klein tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          />
          </TitleFrame>
        </div>

        <div className="mt-6 sm:mt-8">
          <WordStage />
        </div>

        <ul
          ref={listRef}
          onPointerMove={onMove}
          onPointerLeave={() => setActive(null)}
          className="relative mt-8 sm:mt-10"
        >
          {SERVICES.map((service, i) => (
            <FadeIn
              key={service.name}
              as="li"
              delay={i * 0.06}
              y={24}
              onPointerEnter={(e: React.PointerEvent) => {
                if (e.pointerType === 'mouse') setActive(i);
              }}
              className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 sm:gap-12 py-4 sm:py-5 border-t border-klein-deep/25 last:border-b cursor-default"
            >
              <div className="flex items-baseline gap-4 sm:gap-6">
                <h3
                  className="font-display font-extrabold text-klein tracking-[-0.04em] leading-[1.02] transition-transform duration-500 ease-out sm:group-hover:translate-x-3"
                  style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.8rem)' }}
                >
                  {service.name}
                </h3>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-klein-deep/80 sm:text-right sm:pt-2 sm:max-w-[34ch]">
                {service.description}
              </p>
            </FadeIn>
          ))}

          {showPreview && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
              style={{ x: sx, y: sy }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <motion.div
                  initial={false}
                  animate={{
                    opacity: active === null ? 0 : 1,
                    scale: active === null ? 0.85 : 1,
                    rotate: active === null ? 0 : SERVICES[active].tilt,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className="w-[240px] lg:w-[280px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(20,30,92,0.35)] ring-4 ring-paper-pure bg-paper-pure"
                >
                  {SERVICES.map((s, i) => (
                    <img
                      key={s.name}
                      src={s.preview}
                      alt=""
                      loading="lazy"
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                        active === i ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </ul>
      </div>
    </section>
  );
}
