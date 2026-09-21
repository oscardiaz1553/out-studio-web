import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { CSSProperties, useMemo, useRef } from 'react';

// Gris apagado → tinta llena, palabra por palabra, según el scroll (estilo
// Huge: no son caracteres individuales fundiendo opacidad, es la palabra
// completa cambiando de color, como si el texto se "revelara" al leerlo).
const FROM_COLOR = '#9CA0C4';
const TO_COLOR = '#141E5C';
const ACCENT_COLOR = '#9C3F1C';

export interface TextSegment {
  text: string;
  /** true = esta porción termina en el color de acento, no en la tinta base */
  accent?: boolean;
}

interface AnimatedTextProps {
  segments: TextSegment[];
  className?: string;
  style?: CSSProperties;
}

function Word({
  word,
  accent,
  progress,
  range,
}: {
  word: string;
  accent: boolean;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(
    progress,
    range,
    [FROM_COLOR, accent ? ACCENT_COLOR : TO_COLOR]
  );

  return (
    <span className="relative inline-block">
      <span className="invisible">{word}</span>
      <motion.span className="absolute left-0" style={{ color }}>
        {word}
      </motion.span>
    </span>
  );
}

/**
 * Párrafo que se "completa" en color a medida que se hace scroll sobre él,
 * palabra por palabra, de un gris apagado a la tinta llena — con la opción
 * de marcar un tramo para que termine en el color de acento (la frase
 * pivote del párrafo, como el "It takes design," de Huge).
 */
export default function AnimatedText({
  segments,
  className,
  style,
}: AnimatedTextProps) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = useMemo(
    () =>
      segments.flatMap((segment) =>
        segment.text
          .split(/\s+/)
          .filter(Boolean)
          .map((text) => ({ text, accent: Boolean(segment.accent) }))
      ),
    [segments]
  );

  const fullText = useMemo(() => words.map((w) => w.text).join(' '), [words]);

  return (
    <p
      ref={paragraphRef}
      aria-label={fullText}
      className={className}
      style={style}
    >
      {/* Las palabras son decorativas; un lector de pantalla usa el aria-label */}
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i}>
            <Word
              word={word.text}
              accent={word.accent}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
            />
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </p>
  );
}
