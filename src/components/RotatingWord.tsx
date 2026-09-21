import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

interface RotatingWordProps {
  words: string[];
  interval?: number;
  className?: string;
}

/**
 * Palabra que rota entre varias opciones (p. ej. los servicios del hero).
 * Puramente decorativo: el padre debe exponer el texto completo por fuera
 * (aria-hidden aquí + un sr-only con todas las variantes), así un lector de
 * pantalla o un crawler no dependen de que la animación esté en cierto
 * punto para ver el contenido real.
 */
export default function RotatingWord({
  words,
  interval = 2600,
  className,
}: RotatingWordProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [reduceMotion, words.length, interval]);

  if (reduceMotion) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span
      aria-hidden="true"
      className={`relative inline-block overflow-hidden align-top ${className ?? ''}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
