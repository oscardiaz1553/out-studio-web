import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';

export interface MethodStep {
  step: string;
  title: string;
  description: string;
}

interface CardStyle {
  bg: string;
  text: string;
  sub: string;
  border?: string;
}

// Cuatro tratamientos de marca (no fotos, no las tenemos por paso): cada
// tarjeta usa un tono distinto del sistema, como si Huge usara producto
// fotografiado — nosotros usamos color.
const CARD_STYLES: CardStyle[] = [
  {
    bg: 'bg-paper-pure',
    text: 'text-klein',
    sub: 'text-ink-2',
    border: 'border border-klein-deep/15',
  },
  { bg: 'bg-klein', text: 'text-paper-pure', sub: 'text-klein-soft' },
  { bg: 'bg-carne', text: 'text-klein-deep', sub: 'text-klein-deep/75' },
  { bg: 'bg-klein-deep', text: 'text-paper-pure', sub: 'text-klein-soft' },
];

// Inclinación fija por tarjeta (no gira: ya nace así y así sale, como en
// Huge — es el deslizamiento horizontal el que hace el trabajo).
const TILT = [-6, 5, -4, 7];

function Card({ s, style, tilt }: { s: MethodStep; style: CardStyle; tilt: number }) {
  return (
    <div
      style={{ rotate: `${tilt}deg` }}
      className={`shrink-0 w-[78vw] sm:w-[46vw] md:w-[34vw] max-w-[420px] aspect-[4/5] rounded-3xl p-7 sm:p-9 shadow-[0_30px_70px_rgba(20,20,60,0.25)] flex flex-col justify-between ${style.bg} ${style.border ?? ''}`}
    >
      <span
        className={`font-display font-extrabold leading-none ${style.text}`}
        style={{ fontSize: 'clamp(2.6rem, 5vw, 4rem)' }}
      >
        {s.step}
      </span>
      <div>
        <h3
          className={`font-display font-semibold tracking-[-0.02em] mb-3 ${style.text}`}
          style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)' }}
        >
          {s.title}
        </h3>
        <p className={`leading-relaxed ${style.sub}`}>{s.description}</p>
      </div>
    </div>
  );
}

function StaticCard({ s, style }: { s: MethodStep; style: CardStyle }) {
  return (
    <div
      className={`w-full max-w-[560px] rounded-3xl p-8 sm:p-10 ${style.bg} ${style.border ?? ''}`}
    >
      <span
        className={`font-display font-extrabold leading-none block mb-6 ${style.text}`}
        style={{ fontSize: 'clamp(2.4rem, 4vw, 3.2rem)' }}
      >
        {s.step}
      </span>
      <h3
        className={`font-display font-semibold tracking-[-0.01em] text-xl mb-2 ${style.text}`}
      >
        {s.title}
      </h3>
      <p className={`leading-relaxed ${style.sub}`}>{s.description}</p>
    </div>
  );
}

/**
 * Fila de tarjetas inclinadas que se desliza horizontalmente mientras el
 * scroll vertical queda "enganchado" (estilo Huge, sección "Our work"):
 * cada tarjeta mantiene su propia inclinación fija de principio a fin —
 * no gira, no se desvanece — es el conjunto el que se traslada en X. El
 * pin no suelta el scroll hasta que la última tarjeta llegó a su lugar.
 * En prefers-reduced-motion no hay pin: las tarjetas se listan normales.
 */
export default function MethodCards({ steps }: { steps: MethodStep[] }) {
  const reduceMotion = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  useLayoutEffect(() => {
    if (reduceMotion) return;
    const measure = () => {
      if (!rowRef.current) return;
      const rowWidth = rowRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      setScrollDistance(Math.max(0, rowWidth - viewportWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [reduceMotion, steps.length]);

  if (reduceMotion) {
    return (
      <div className="flex flex-col items-center gap-6 pt-8 pb-14">
        {steps.map((s, i) => (
          <StaticCard key={s.step} s={s} style={CARD_STYLES[i % CARD_STYLES.length]} />
        ))}
      </div>
    );
  }

  // Alto del tramo fijado: suficiente para que el desplazamiento horizontal
  // (scrollDistance) se sienta proporcional al scroll vertical, no
  // demasiado brusco ni demasiado largo.
  const pinHeight = Math.max(220, steps.length * 90);

  return (
    <div ref={pinRef} className="relative" style={{ height: `${pinHeight}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div
          ref={rowRef}
          style={{ x }}
          className="flex items-center gap-6 sm:gap-10 px-[11vw] sm:px-[16vw]"
        >
          {steps.map((s, i) => (
            <Card
              key={s.step}
              s={s}
              style={CARD_STYLES[i % CARD_STYLES.length]}
              tilt={TILT[i % TILT.length]}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
