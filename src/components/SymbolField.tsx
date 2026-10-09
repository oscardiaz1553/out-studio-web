import { motion, useReducedMotion } from 'framer-motion';
import { FrameKind, Sym } from './TitleFrame';

export interface FieldItem {
  kind: FrameKind;
  /** Posición del centro, en % del contenedor. */
  x: number;
  y: number;
  /** Tamaño del par de símbolos (CSS: vw, rem…). */
  size: string;
  /** Giro base, en grados. */
  rot?: number;
  /** Segundos de un ciclo de deriva. */
  dur?: number;
  delay?: number;
  /** Sólo en pantallas medianas y grandes. */
  desktopOnly?: boolean;
}

/**
 * Símbolos de la marca (corchetes, llaves, ángulos, paréntesis) a la deriva
 * en el fondo de una sección: grandes, casi transparentes y lentos, para que
 * se sientan como parte del ambiente y no como una animación. Sólo mueve
 * transform (barato) y se queda quieto con "reducir movimiento".
 */
export default function SymbolField({
  items,
  color = '#F5E3B3',
  opacity = 0.1,
}: {
  items: FieldItem[];
  color?: string;
  opacity?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ color, opacity }}
    >
      {items.map((it, i) => (
        <motion.span
          key={i}
          className={`absolute flex gap-[0.35em] ${it.desktopOnly ? 'hidden md:flex' : ''}`}
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            fontSize: it.size,
            x: '-50%',
            y: '-50%',
            rotate: it.rot ?? 0,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: ['-50%', '-58%', '-50%'],
                  rotate: [(it.rot ?? 0) - 5, (it.rot ?? 0) + 5, (it.rot ?? 0) - 5],
                }
          }
          transition={{
            duration: it.dur ?? 12,
            delay: it.delay ?? 0,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sym kind={it.kind} />
          <Sym kind={it.kind} flip />
        </motion.span>
      ))}
    </div>
  );
}
