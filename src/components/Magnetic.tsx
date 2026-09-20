import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const SPRING = { stiffness: 150, damping: 14, mass: 0.2 };
// Qué tanto sigue el elemento al cursor (0–1, fracción del desplazamiento).
const STRENGTH = 0.35;

interface MagneticProps {
  children: ReactNode;
  className?: string;
}

/**
 * Envuelve un CTA para que "persiga" el cursor un poco al pasar por encima,
 * y vuelva a su sitio con un resorte al salir. Detalle típico de sitios de
 * agencia (Huge, etc.). Se desactiva con prefers-reduced-motion.
 */
export default function Magnetic({ children, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * STRENGTH);
    y.set((e.clientY - (rect.top + rect.height / 2)) * STRENGTH);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
