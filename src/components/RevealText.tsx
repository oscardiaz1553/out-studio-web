import { CSSProperties } from 'react';

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

interface RevealTextProps {
  text?: string;
  lines?: string[];
  as?: Tag;
  /** Se conservan por compatibilidad: el texto ya no se anima al entrar. */
  unit?: 'line' | 'word' | 'char';
  trigger?: 'view' | 'mount';
  delay?: number;
  stagger?: number;
  className?: string;
  style?: CSSProperties;
  lineClassName?: string;
}

// Titular estático: visible de inmediato, sin máscaras ni cascadas.
export default function RevealText({
  text,
  lines,
  as = 'div',
  className,
  style,
  lineClassName,
}: RevealTextProps) {
  const Component = as as any;
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
