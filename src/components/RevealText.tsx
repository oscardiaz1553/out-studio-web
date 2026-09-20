import { CSSProperties, ReactNode, useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

type Unit = 'line' | 'word' | 'char';
type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

interface RevealTextProps {
  /** Texto simple, dividido en palabras o caracteres según `unit`. */
  text?: string;
  /** Líneas ya partidas a mano (para titulares con salto explícito). */
  lines?: string[];
  as?: Tag;
  unit?: Unit;
  /** 'view' = se revela al entrar en pantalla. 'mount' = al cargar (hero). */
  trigger?: 'view' | 'mount';
  delay?: number;
  stagger?: number;
  className?: string;
  style?: CSSProperties;
  /** Clase por línea, cuando unit="line" (p. ej. controlar el salto). */
  lineClassName?: string;
}

/**
 * Titular estilo "Huge": cada línea/palabra/carácter vive dentro de una
 * máscara (overflow hidden) y se desliza desde abajo, en cascada. El texto
 * real queda como aria-label en el contenedor; las piezas visuales son
 * aria-hidden, para que un lector de pantalla no repita palabra por palabra.
 */
export default function RevealText({
  text,
  lines,
  as = 'div',
  unit = 'word',
  trigger = 'view',
  delay = 0,
  stagger = 0.045,
  className,
  style,
  lineClassName,
}: RevealTextProps) {
  const reduceMotion = useReducedMotion();
  // `any`: `as` es un tag dinámico (h1/h2/.../div) y tipar el ref contra la
  // unión completa de JSX.IntrinsicElements explota el checker (TS2590).
  const Component = as as any;

  // Cada pieza vive dentro de una máscara (overflow:hidden) y arranca
  // desplazada fuera de esa máscara (y: 110%), o sea con área visible cero.
  // Un IntersectionObserver recorta el target contra el clip de sus
  // ancestros, así que observar el motion.span directamente (whileInView)
  // nunca ve una intersección real. Por eso medimos visibilidad en el
  // contenedor exterior, que no está recortado ni transformado.
  const containerRef = useRef<HTMLElement>(null);
  const inView = useInView(containerRef, {
    once: true,
    margin: '0px 0px -10% 0px',
    amount: 0,
  });

  const pieces = useMemo(() => {
    if (unit === 'line') return lines ?? (text ? [text] : []);
    const source = text ?? '';
    return unit === 'char' ? Array.from(source) : source.split(' ');
  }, [text, lines, unit]);

  const fullLabel = lines ? lines.join(' ') : text ?? '';

  if (reduceMotion) {
    return (
      <Component className={className} style={style}>
        {lines
          ? lines.map((line, i) => (
              <span key={i} className={lineClassName} style={{ display: 'block' }}>
                {line}
              </span>
            ))
          : text}
      </Component>
    );
  }

  const shouldReveal = trigger === 'mount' || inView;
  const revealProps = {
    initial: { y: '110%' },
    animate: { y: shouldReveal ? '0%' : '110%' },
  };

  return (
    <Component
      ref={containerRef}
      className={className}
      style={style}
      aria-label={fullLabel}
    >
      {pieces.map((piece, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={unit === 'line' ? lineClassName : undefined}
          style={{
            display: unit === 'line' ? 'block' : 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
          }}
        >
          <motion.span
            style={{ display: 'inline-block', willChange: 'transform' }}
            {...revealProps}
            transition={{
              duration: 0.85,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {piece as ReactNode}
            {unit === 'word' && i < pieces.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
