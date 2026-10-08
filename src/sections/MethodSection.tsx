import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import AccentButton from '../components/AccentButton';
import RevealText from '../components/RevealText';

// Cómo trabajamos, en 4 pasos. Ligado a los servicios reales (Shopify,
// WordPress, a medida) y a la promesa de no desaparecer tras el lanzamiento.
// Cada paso dice qué hacemos, qué necesitamos del cliente y qué recibe.
const STEPS = [
  {
    step: '01',
    title: 'Diagnóstico',
    summary:
      'Entender tu negocio, antes de tocar una sola pantalla.',
    we: 'Entendemos qué tiene que lograr tu sitio y revisamos lo que ya tienes: marca, contenido y herramientas.',
    you: 'Una conversación sobre tu negocio y, si los hay, tus materiales y accesos actuales.',
    get: 'Una propuesta clara, con alcance, tiempos y valor a la medida de tu caso.',
  },
  {
    step: '02',
    title: 'Diseño & desarrollo',
    summary:
      'Código propio y avances reales: Shopify, WordPress o a medida.',
    we: 'Diseñamos y construimos tu proyecto con código propio, paso a paso y compartiendo avances.',
    you: 'Textos, imágenes y decisiones a tiempo, y tu opinión en cada entrega.',
    get: 'Avances reales que puedes ver y probar, no mockups sueltos.',
  },
  {
    step: '03',
    title: 'Lanzamiento',
    summary:
      'Todo probado antes de salir a producción.',
    we: 'Probamos todo antes de salir: velocidad, SEO técnico, pagos y formularios funcionando.',
    you: 'Tu aprobación final y los accesos necesarios (dominio, pagos).',
    get: 'Tu proyecto en línea y listo para usar, con todo lo que necesitas para administrarlo.',
  },
  {
    step: '04',
    title: 'Soporte',
    summary: 'No desaparecemos después del lanzamiento.',
    we: 'Seguimos a tu lado: mantenimiento, ajustes y mejoras a partir de cómo se usa tu sitio.',
    you: 'Contarnos qué ves en tus números y qué quieres mejorar.',
    get: 'Un equipo que responde y que sigue mejorando tu proyecto.',
  },
];

const BLOCKS = [
  { key: 'we', label: 'Qué hacemos nosotros' },
  { key: 'you', label: 'Qué necesitamos de ti' },
  { key: 'get', label: 'Qué recibes' },
] as const;

/**
 * Pasos interactivos: pestañas arriba y un panel por paso. Los paneles van en
 * una pista horizontal con scroll-snap nativo, así que en móvil se cambia de
 * paso deslizando (con el gesto y la física del propio navegador) y las
 * pestañas siguen al dedo; en escritorio se cambia con las pestañas o con las
 * flechas del teclado.
 */
function MethodSteps() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // Paso al que estamos yendo por una pestaña: mientras dura el scroll
  // animado no dejamos que los pasos intermedios "parpadeen" en las pestañas.
  const target = useRef<number | null>(null);
  const raf = useRef(0);

  const scrollToStep = useCallback(
    (i: number, smooth: boolean) => {
      const el = trackRef.current;
      if (!el) return;
      el.scrollTo({
        left: i * el.clientWidth,
        behavior: smooth && !reduceMotion ? 'smooth' : 'auto',
      });
    },
    [reduceMotion],
  );

  const select = (i: number) => {
    setActive(i);
    target.current = i;
    scrollToStep(i, true);
  };

  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = trackRef.current;
      if (!el) return;
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      if (target.current !== null) {
        if (idx === target.current) target.current = null;
        return;
      }
      setActive((cur) => (cur === idx ? cur : idx));
    });
  };

  // Un toque o arrastre del usuario cancela cualquier destino pendiente.
  const releaseTarget = () => {
    target.current = null;
  };

  // Si cambia el ancho de la pista (giro del móvil, resize), mantiene el paso.
  useEffect(() => {
    const onResize = () => scrollToStep(active, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active, scrollToStep]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    let next = active;
    if (e.key === 'ArrowRight') next = Math.min(STEPS.length - 1, active + 1);
    else if (e.key === 'ArrowLeft') next = Math.max(0, active - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = STEPS.length - 1;
    else return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Pasos de nuestro método"
        className="grid grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6"
      >
        {STEPS.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.step}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`metodo-tab-${i}`}
              aria-selected={isActive}
              aria-controls={`metodo-panel-${i}`}
              aria-label={`Paso ${s.step}: ${s.title}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={onTabKey}
              className={`rounded-xl sm:rounded-2xl border px-2 sm:px-5 py-3 sm:py-4 text-left transition-colors duration-200 ${
                isActive
                  ? 'bg-klein border-klein text-paper-pure'
                  : 'border-klein-deep/20 text-klein-deep hover:border-klein'
              }`}
            >
              <span
                className={`block font-display font-extrabold leading-none text-lg sm:text-2xl text-center sm:text-left ${
                  isActive ? 'text-carne' : 'text-klein'
                }`}
              >
                {s.step}
              </span>
              <span className="hidden sm:block mt-2 text-sm font-medium leading-snug">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-klein-deep/15 bg-paper-pure overflow-hidden">
        <div
          ref={trackRef}
          onScroll={onScroll}
          onTouchStart={releaseTarget}
          onWheel={releaseTarget}
          className="flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              role="tabpanel"
              id={`metodo-panel-${i}`}
              aria-labelledby={`metodo-tab-${i}`}
              aria-hidden={i !== active}
              className="shrink-0 w-full snap-center snap-always p-6 sm:p-10 lg:p-12"
            >
              <div className="flex items-baseline gap-4 mb-4">
                <span
                  aria-hidden
                  className="font-display font-extrabold text-carne-deep leading-none"
                  style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)' }}
                >
                  {s.step}
                </span>
                <h3
                  className="font-display font-semibold text-klein tracking-[-0.03em] leading-tight"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}
                >
                  {s.title}
                </h3>
              </div>
              <p className="text-ink-2 leading-relaxed max-w-xl mb-8 sm:mb-10">
                {s.summary}
              </p>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {BLOCKS.map((b) => (
                  <div key={b.key} className="border-t border-klein-deep/15 pt-4">
                    <dt className="text-[11px] tracking-[0.06em] uppercase text-carne-tinta mb-2">
                      {b.label}
                    </dt>
                    <dd className="text-sm leading-relaxed text-klein-deep">
                      {s[b.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2" aria-hidden>
          {STEPS.map((s, i) => (
            <span
              key={s.step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-klein' : 'w-1.5 bg-klein-deep/25'
              }`}
            />
          ))}
          <span className="ml-3 text-xs text-muted sm:hidden">
            Desliza para ver el siguiente paso
          </span>
        </div>
        <AccentButton href="#cotizacion">Empieza con tu cotización</AccentButton>
      </div>
    </div>
  );
}

export default function MethodSection() {
  return (
    <section
      id="metodo"
      className="bg-paper px-6 md:px-10 lg:px-16 py-20 sm:py-24 md:py-32 border-t border-klein-deep/15"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="text-[11px] tracking-[0.06em] text-carne-tinta">
            03
          </span>
          <RevealText
            as="h2"
            text="Nuestro método"
            unit="word"
            className="font-display font-semibold text-klein tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          />
        </div>

        <p className="text-ink-2 leading-relaxed max-w-xl mt-4 mb-10 sm:mb-14">
          Nada de plantillas de discurso. Así pasamos de tu idea a un sitio
          que vende.
        </p>

        <MethodSteps />
      </div>
    </section>
  );
}
