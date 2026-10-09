import TitleFrame from '../components/TitleFrame';
import { useRef, useState } from 'react';
import AccentButton from '../components/AccentButton';
import RevealText from '../components/RevealText';

// Cuatro pasos, cada uno con un verbo (lo que hacemos), lo que necesitamos de
// ti y lo que recibes al terminar. Cada panel tiene su propio color: el
// recorrido va de lo claro (conversar) a lo profundo (un sitio ya en marcha).
const STEPS = [
  {
    step: '01',
    verb: 'Escuchamos',
    title: 'Diagnóstico',
    result: 'Sabes qué vamos a hacer, cuánto cuesta y cuándo.',
    we: 'Entendemos qué tiene que lograr tu sitio y revisamos lo que ya tienes: marca, contenido y herramientas.',
    you: 'Una conversación sobre tu negocio y, si los hay, tus materiales y accesos actuales.',
    get: 'Una propuesta clara, con alcance, tiempos y valor a la medida de tu caso.',
    card: 'bg-paper-pure text-klein border border-klein-deep/15',
    accent: 'text-carne-deep',
    muted: 'text-klein-deep/70',
    rule: 'border-klein-deep/15',
  },
  {
    step: '02',
    verb: 'Construimos',
    title: 'Diseño y desarrollo',
    result: 'Ves tu proyecto tomar forma. Nada de mockups sueltos.',
    we: 'Diseñamos y construimos con código propio (Shopify, WordPress o a medida), compartiendo avances reales.',
    you: 'Textos, imágenes y decisiones a tiempo, y tu opinión en cada entrega.',
    get: 'Avances que puedes ver, probar y comentar mientras se construyen.',
    card: 'bg-klein-mid text-paper-pure',
    accent: 'text-carne',
    muted: 'text-paper-pure/85',
    rule: 'border-paper-pure/25',
  },
  {
    step: '03',
    verb: 'Lanzamos',
    title: 'Lanzamiento',
    result: 'Tu negocio en línea y listo para vender.',
    we: 'Probamos todo antes de salir: velocidad, SEO técnico, pagos y formularios funcionando.',
    you: 'Tu aprobación final y los accesos necesarios (dominio, pagos).',
    get: 'Tu proyecto en línea y todo lo que necesitas para administrarlo.',
    card: 'bg-klein text-paper-pure',
    accent: 'text-carne',
    muted: 'text-paper-pure/80',
    rule: 'border-paper-pure/25',
  },
  {
    step: '04',
    verb: 'Seguimos',
    title: 'Soporte',
    result: 'No desaparecemos: seguimos mejorando contigo.',
    we: 'Mantenimiento, ajustes y mejoras a partir de cómo se usa tu sitio.',
    you: 'Contarnos qué ves en tus números y qué quieres mejorar.',
    get: 'Un equipo que responde y que sigue mejorando tu proyecto.',
    card: 'bg-klein-deep text-paper-pure',
    accent: 'text-carne',
    muted: 'text-paper-pure/80',
    rule: 'border-paper-pure/20',
  },
];

const BLOCKS = [
  { key: 'we', label: 'Nosotros' },
  { key: 'you', label: 'Tú' },
  { key: 'get', label: 'Recibes' },
] as const;

/**
 * Los cuatro pasos a la vista a la vez. En escritorio son paneles en fila: el
 * activo se abre y muestra el detalle (con el mouse o con clic); en móvil se
 * apilan y el activo se despliega hacia abajo. Todo es accesible por teclado
 * (cada paso es un botón con aria-expanded).
 */
function MethodSteps() {
  const [active, setActive] = useState(0);
  const hover = useRef<number | undefined>(undefined);

  const onEnter = (i: number, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(hover.current);
    hover.current = window.setTimeout(() => setActive(i), 90);
  };
  const onLeave = () => window.clearTimeout(hover.current);

  return (
    <div>
      <ol className="flex flex-col xl:flex-row gap-3 xl:h-[440px]">
        {STEPS.map((s, i) => {
          const open = i === active;
          return (
            <li
              key={s.step}
              onPointerEnter={(e) => onEnter(i, e)}
              onPointerLeave={onLeave}
              className={`relative overflow-hidden rounded-2xl transition-[flex-grow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${s.card} ${
                open ? 'xl:flex-[3]' : 'xl:flex-1'
              }`}
            >
              <button
                type="button"
                id={`metodo-tab-${i}`}
                aria-expanded={open}
                aria-controls={`metodo-panel-${i}`}
                onClick={() => setActive(i)}
                className="w-full xl:h-full text-left p-5 sm:p-6 xl:p-6 flex xl:flex-col items-center xl:items-stretch gap-4 xl:gap-0 xl:justify-between"
              >
                <span
                  className={`font-display font-extrabold leading-none tracking-[-0.04em] ${s.accent}`}
                  style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)' }}
                >
                  {s.step}
                </span>
                <span className="flex-1 xl:flex-none min-w-0">
                  <span
                    className="block font-display font-extrabold tracking-[-0.04em] leading-[0.95]"
                    style={{ fontSize: 'clamp(1.5rem, 1.55vw, 1.9rem)' }}
                  >
                    {s.verb}.
                  </span>
                  <span
                    className={`mt-1.5 block text-xs tracking-[0.06em] uppercase ${s.muted}`}
                  >
                    {s.title}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`xl:hidden text-2xl leading-none transition-transform duration-300 ${s.accent} ${
                    open ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>

              {/* Detalle: en escritorio aparece junto al verbo al abrirse; en
                  móvil se despliega bajo la cabecera. */}
              <div
                id={`metodo-panel-${i}`}
                role="region"
                aria-labelledby={`metodo-tab-${i}`}
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] xl:block ${
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div
                  className={`overflow-hidden xl:overflow-visible xl:absolute xl:inset-y-0 xl:right-0 xl:w-[58%] transition-opacity duration-300 ${
                    open
                      ? 'opacity-100 xl:delay-200'
                      : 'opacity-0 xl:pointer-events-none'
                  }`}
                  {...(!open ? { inert: true } : {})}
                >
                  <div className="px-5 sm:px-6 pb-6 xl:px-0 xl:pr-7 xl:py-7 xl:h-full flex flex-col justify-between gap-6">
                    <p
                      className="font-display font-semibold tracking-[-0.02em] leading-snug"
                      style={{ fontSize: 'clamp(1.15rem, 1.7vw, 1.5rem)' }}
                    >
                      {s.result}
                    </p>
                    <dl className="flex flex-col">
                      {BLOCKS.map((b) => (
                        <div
                          key={b.key}
                          className={`grid grid-cols-[4.5rem_1fr] gap-3 py-3 border-t ${s.rule}`}
                        >
                          <dt
                            className={`text-[11px] tracking-[0.08em] uppercase pt-0.5 ${s.accent}`}
                          >
                            {b.label}
                          </dt>
                          <dd className={`text-sm leading-relaxed ${s.muted}`}>
                            {s[b.key]}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Un paso a la vez, con avances que puedes ver y aprobar.
        </p>
        <AccentButton href="#cotizacion">Empieza con tu cotización</AccentButton>
      </div>
    </div>
  );
}

export default function MethodSection() {
  return (
    <section
      id="metodo"
      className="bg-paper px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20 border-t border-klein-deep/15"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="text-[11px] tracking-[0.06em] text-carne-tinta">
            04
          </span>
          <TitleFrame kind="paren" tone="warm" fontSize="clamp(2rem, 4vw, 3.4rem)">
            <RevealText
            as="h2"
            text="Nuestro método"
            className="font-display font-semibold text-klein tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          />
          </TitleFrame>
        </div>

        <p
          className="font-display font-extrabold text-klein tracking-[-0.04em] leading-[1] max-w-[22ch] mt-6 mb-8 sm:mb-10"
          style={{ fontSize: 'clamp(1.8rem, 4.2vw, 3.6rem)' }}
        >
          Cuatro pasos. Sin sorpresas.
        </p>

        <MethodSteps />
      </div>
    </section>
  );
}
