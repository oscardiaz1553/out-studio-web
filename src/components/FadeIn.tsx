import { CSSProperties, ElementType, PointerEvent, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  /** Se conservan por compatibilidad: ya no hay animación al hacer scroll. */
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  onPointerEnter?: (e: PointerEvent) => void;
}

// Antes revelaba el contenido al hacer scroll. Ahora el contenido está
// siempre visible desde el primer momento: quien llega quiere leer, no
// esperar a que las cosas aparezcan.
export default function FadeIn({
  children,
  as: Tag = 'div',
  className,
  style,
  onPointerEnter,
}: FadeInProps) {
  return (
    <Tag className={className} style={style} onPointerEnter={onPointerEnter}>
      {children}
    </Tag>
  );
}
