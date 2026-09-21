import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

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

// Inclinación de reposo por tarjeta (alternada) y desplazamiento vertical
// para que el abanico no quede en una fila perfectamente recta.
const REST_TILT = [-6, 5, -4, 7];
const REST_Y = [0, 28, -10, 20];

function MethodCard({
  s,
  i,
  total,
  progress,
  style,
}: {
  s: MethodStep;
  i: number;
  total: number;
  progress: MotionValue<number>;
  style: CardStyle;
}) {
  const reduceMotion = useReducedMotion();
  const start = i / total;
  const end = Math.min(start + 1.3 / total, 1);

  const rotate = useTransform(
    progress,
    [start, end],
    [REST_TILT[i] * 3.2, REST_TILT[i]]
  );
  const y = useTransform(progress, [start, end], [120, REST_Y[i]]);
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.div
      style={
        reduceMotion
          ? { opacity: 1, rotate: REST_TILT[i], y: REST_Y[i] }
          : { rotate, y, opacity }
      }
      className={`relative shrink-0 w-[230px] sm:w-[250px] lg:w-[265px] rounded-2xl p-6 sm:p-7 shadow-[0_24px_50px_rgba(20,20,60,0.2)] ${style.bg} ${style.border ?? ''}`}
    >
      <span
        className={`font-display font-extrabold leading-none block mb-7 ${style.text}`}
        style={{ fontSize: 'clamp(2rem, 3vw, 2.6rem)' }}
      >
        {s.step}
      </span>
      <h3
        className={`font-display font-semibold tracking-[-0.01em] text-lg sm:text-xl mb-2 ${style.text}`}
      >
        {s.title}
      </h3>
      <p className={`text-sm leading-relaxed ${style.sub}`}>
        {s.description}
      </p>
    </motion.div>
  );
}

/**
 * Abanico de tarjetas ligado al scroll (estilo Huge): cada tarjeta entra
 * girando y se asienta en su inclinación de reposo a medida que se hace
 * scroll por la sección — no es un reveal de una sola vez, sigue el
 * progreso real del scroll.
 */
export default function MethodCards({ steps }: { steps: MethodStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.55'],
  });

  return (
    <div
      ref={ref}
      className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start gap-y-10 gap-x-8 sm:gap-x-0 sm:-space-x-5 pt-8 pb-14 sm:pt-10 sm:pb-20"
    >
      {steps.map((s, i) => (
        <MethodCard
          key={s.step}
          s={s}
          i={i}
          total={steps.length}
          progress={scrollYProgress}
          style={CARD_STYLES[i % CARD_STYLES.length]}
        />
      ))}
    </div>
  );
}
