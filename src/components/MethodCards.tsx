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

function PinnedCard({
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
  const seg = 1 / total;
  const sign = i % 2 === 0 ? 1 : -1;
  const isLast = i === total - 1;

  // El cruce entre tarjetas dura muy poco (8% del tramo de cada una): la
  // mayor parte del tiempo hay UNA sola tarjeta legible en pantalla, no dos
  // superpuestas. Además de girar, la que sale sube y se va, la que entra
  // viene de abajo — así que aunque coincidan un instante, no quedan text
  // sobre texto en el mismo punto. Los breakpoints deben caer estrictamente
  // dentro de [0,1]: framer-motion puede animar useScroll con timelines
  // nativas del navegador, que exigen offsets crecientes en ese rango — un
  // punto fuera (p. ej. antes de 0) rompe el montaje entero.
  const trans = seg * 0.08;
  const enterAt = i * seg;
  const settleAt = enterAt + trans;
  const holdAt = (i + 1) * seg - trans;
  const exitAt = (i + 1) * seg;

  const times = isLast ? [enterAt, settleAt] : [enterAt, settleAt, holdAt, exitAt];
  const rotateOut = isLast
    ? [sign * 12, sign * -2]
    : [sign * 12, sign * -2, sign * -2, sign * -12];
  const opacityOut = isLast ? [0, 1] : [0, 1, 1, 0];
  const yOut = isLast ? [44, 0] : [44, 0, 0, -44];

  const rotate = useTransform(progress, times, rotateOut);
  const opacity = useTransform(progress, times, opacityOut);
  const y = useTransform(progress, times, yOut);

  return (
    <motion.div
      style={{ rotate, opacity, y }}
      className={`absolute inset-0 rounded-3xl p-8 sm:p-12 shadow-[0_30px_80px_rgba(20,20,60,0.3)] flex flex-col justify-between ${style.bg} ${style.border ?? ''}`}
    >
      <span
        className={`font-display font-extrabold leading-none ${style.text}`}
        style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
      >
        {s.step}
      </span>
      <div>
        <h3
          className={`font-display font-semibold tracking-[-0.02em] mb-3 ${style.text}`}
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
        >
          {s.title}
        </h3>
        <p
          className={`leading-relaxed max-w-[42ch] ${style.sub}`}
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)' }}
        >
          {s.description}
        </p>
      </div>
    </motion.div>
  );
}

function StepDot({
  i,
  total,
  progress,
}: {
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const active = useTransform(progress, (p) => {
    const idx = Math.min(total - 1, Math.floor(p * total));
    return idx === i;
  });
  const opacity = useTransform(active, (a) => (a ? 1 : 0.35));
  const width = useTransform(active, (a) => (a ? 28 : 8));

  return (
    <motion.span
      style={{ opacity, width }}
      className="h-2 rounded-full bg-klein"
    />
  );
}

/**
 * Secuencia de tarjetas fijada al scroll (estilo Huge): la sección se
 * "engancha" (sticky) y no suelta el scroll hasta que las cuatro tarjetas
 * terminaron de pasar, cada una girando al entrar y al salir. En
 * prefers-reduced-motion no hay pin ni scroll-jacking: las tarjetas se
 * listan normales, una debajo de otra.
 */
export default function MethodCards({ steps }: { steps: MethodStep[] }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  if (reduceMotion) {
    return (
      <div className="flex flex-col items-center gap-6 pt-8 pb-14">
        {steps.map((s, i) => (
          <StaticCard key={s.step} s={s} style={CARD_STYLES[i % CARD_STYLES.length]} />
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative" style={{ height: `${steps.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="relative w-full max-w-[560px] h-[400px] sm:h-[460px]">
          {steps.map((s, i) => (
            <PinnedCard
              key={s.step}
              s={s}
              i={i}
              total={steps.length}
              progress={scrollYProgress}
              style={CARD_STYLES[i % CARD_STYLES.length]}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mt-10">
          {steps.map((s, i) => (
            <StepDot key={s.step} i={i} total={steps.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}
