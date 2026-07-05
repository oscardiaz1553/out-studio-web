import { motion, useReducedMotion } from 'framer-motion';
import { CSSProperties, ElementType, ReactNode, useMemo } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className,
  style,
}: FadeInProps) {
  const reduceMotion = useReducedMotion();
  const MotionComponent = useMemo(
    () => motion.create(as as ElementType) as typeof motion.div,
    [as]
  );

  return (
    <MotionComponent
      initial={{
        opacity: 0,
        x: reduceMotion ? 0 : x,
        y: reduceMotion ? 0 : y,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
}
