import { CSSProperties } from 'react';

export interface TextSegment {
  text: string;
  /** true = esta porción va en el color de acento. */
  accent?: boolean;
}

interface AnimatedTextProps {
  segments: TextSegment[];
  className?: string;
  style?: CSSProperties;
}

// Párrafo con un tramo resaltado. Antes se "completaba" al hacer scroll;
// ahora se lee completo desde el principio.
export default function AnimatedText({ segments, className, style }: AnimatedTextProps) {
  return (
    <p className={`text-klein-deep ${className ?? ''}`} style={style}>
      {segments.map((s, i) => (
        <span key={i} className={s.accent ? 'text-carne-tinta' : undefined}>
          {s.text}
        </span>
      ))}
    </p>
  );
}
