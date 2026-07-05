import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxYProps {
  children: ReactNode;
  /** Vertical travel in px as the element crosses the viewport */
  from?: number;
  to?: number;
  className?: string;
}

export default function ParallaxY({
  children,
  from = 48,
  to = -48,
  className,
}: ParallaxYProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
