import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FrameKind, Sym } from './TitleFrame';

// Las palabras de la animación de marca: cada una entra dentro de su símbolo
// (diseño) [desarrollo] {marca} <tú>, con un fondo distinto que "barre" desde
// el centro. Adaptado de docs/marca-nueva/fuente/animacion-logo-palabras.
const WORDS: {
  word: string;
  kind: FrameKind;
  bg: string;
  text: string;
  symbol: string;
}[] = [
  { word: 'diseño', kind: 'paren', bg: '#1B2FCC', text: '#F3EDE7', symbol: '#F5E3B3' },
  { word: 'desarrollo', kind: 'square', bg: '#F5E3B3', text: '#141E5C', symbol: '#1B2FCC' },
  { word: 'marca', kind: 'curly', bg: '#141E5C', text: '#F3EDE7', symbol: '#F5E3B3' },
  { word: 'tú', kind: 'angle', bg: '#F3EDE7', text: '#1B2FCC', symbol: '#BC6039' },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const STEP_MS = 1700;

function Slide({ index, tick }: { index: number; tick: number }) {
  const s = WORDS[index];
  const chars = Array.from(s.word);
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center gap-[0.18em]"
      style={{
        zIndex: tick,
        backgroundColor: s.bg,
        color: s.text,
        fontSize: 'clamp(2.8rem, 10.5vw, 9.5rem)',
      }}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ transition: { duration: 0.6 } }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.span
        className="flex"
        style={{ color: s.symbol }}
        initial={{ x: '-120%', scaleX: 1.5 }}
        animate={{ x: 0, scaleX: 1 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
      >
        <Sym kind={s.kind} />
      </motion.span>
      <span className="flex font-display font-extrabold tracking-[-0.045em] leading-none pb-[0.12em]">
        {chars.map((c, k) => (
          <motion.span
            key={k}
            className="inline-block"
            initial={{ y: '90%', opacity: 0, rotate: ((k * 53) % 21) - 10 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.34, 1.4, 0.64, 1],
              delay: 0.15 + k * 0.03,
            }}
          >
            {c}
          </motion.span>
        ))}
      </span>
      <motion.span
        className="flex"
        style={{ color: s.symbol }}
        initial={{ x: '120%', scaleX: 1.5 }}
        animate={{ x: 0, scaleX: 1 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
      >
        <Sym kind={s.kind} flip />
      </motion.span>
    </motion.div>
  );
}

/**
 * Escenario de palabras: diseño · desarrollo · marca · tú. Cambia solo, y se
 * detiene cuando no está en pantalla. Con "reducir movimiento" se muestran
 * las cuatro palabras quietas en una línea.
 */
export default function WordStage() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const [tick, setTick] = useState(WORDS.length);

  useEffect(() => {
    if (reduceMotion || !inView) return;
    const t = window.setInterval(() => setTick((n) => n + 1), STEP_MS);
    return () => window.clearInterval(t);
  }, [reduceMotion, inView]);

  const label = 'Diseño, desarrollo, marca y tú.';

  if (reduceMotion) {
    return (
      <div
        role="img"
        aria-label={label}
        className="rounded-2xl bg-klein text-paper-pure px-6 py-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-display font-extrabold tracking-[-0.04em] text-3xl sm:text-5xl"
      >
        {WORDS.map((w) => (
          <span key={w.word}>
            <span style={{ color: w.symbol === '#1B2FCC' ? '#F5E3B3' : w.symbol }}>
              {w.kind === 'paren' ? '(' : w.kind === 'square' ? '[' : w.kind === 'curly' ? '{' : '<'}
            </span>
            {w.word}
            <span style={{ color: w.symbol === '#1B2FCC' ? '#F5E3B3' : w.symbol }}>
              {w.kind === 'paren' ? ')' : w.kind === 'square' ? ']' : w.kind === 'curly' ? '}' : '>'}
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className="relative overflow-hidden rounded-2xl h-[clamp(170px,24vw,300px)] bg-klein"
    >
      <AnimatePresence initial={false}>
        <Slide key={tick} index={tick % WORDS.length} tick={tick} />
      </AnimatePresence>
    </div>
  );
}
