import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FrameKind, Sym } from './TitleFrame';

// La secuencia de la animación de marca: ( ) → [ ] → { } → < > → | y vuelta.
const STEPS: (FrameKind | 'cursor')[] = ['paren', 'square', 'curly', 'angle', 'cursor'];
const STEP_MS = 1500;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Par de símbolos grande que va cambiando de forma, de fondo en la portada:
 * cada símbolo entra por los lados, choca en el centro con un anillo que se
 * expande y se desvanece, y deja paso al siguiente. Pensado para ir detrás
 * del mono, que lo corta por abajo. Quieto (un solo par) con "reducir
 * movimiento"; en pausa si la pestaña no está visible.
 */
export default function MorphBrackets({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let id = window.setInterval(() => setI((n) => n + 1), STEP_MS);
    const onVis = () => {
      window.clearInterval(id);
      if (!document.hidden) id = window.setInterval(() => setI((n) => n + 1), STEP_MS);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduceMotion]);

  const step = STEPS[reduceMotion ? 0 : i % STEPS.length];

  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none text-carne ${className}`}
      style={{ fontSize: 'clamp(9rem, 27vw, 25rem)' }}
    >
      <div className="relative flex items-center justify-center" style={{ height: '0.9em' }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.35 }}
          >
            {step === 'cursor' ? (
              <motion.span
                className="block bg-current"
                style={{ width: '0.05em', height: '0.5em' }}
                animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: 'linear' }}
              />
            ) : (
              <>
                <motion.span
                  className="flex"
                  initial={{ x: '-90%', scaleX: 1.5 }}
                  animate={{ x: '-70%', scaleX: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <Sym kind={step} />
                </motion.span>
                <motion.span
                  className="flex"
                  initial={{ x: '90%', scaleX: 1.5 }}
                  animate={{ x: '70%', scaleX: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <Sym kind={step} flip />
                </motion.span>
                {/* Anillo de impacto */}
                {!reduceMotion && (
                  <motion.span
                    className="absolute rounded-full border-current"
                    style={{ width: '0.3em', height: '0.3em', borderWidth: '0.012em' }}
                    initial={{ scale: 0.3, opacity: 0.9 }}
                    animate={{ scale: 3.2, opacity: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
