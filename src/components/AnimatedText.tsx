import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { CSSProperties, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative">
      <span className="invisible">{char}</span>
      <motion.span className="absolute left-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({
  text,
  className,
  style,
}: AnimatedTextProps) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p
      ref={paragraphRef}
      aria-label={text}
      className={className}
      style={{ whiteSpace: 'pre-wrap', ...style }}
    >
      {/* Per-character spans are decorative; screen readers get the aria-label */}
      <span aria-hidden="true">
        {chars.map((char, i) => (
          <Char
            key={i}
            char={char}
            progress={scrollYProgress}
            range={[i / chars.length, (i + 1) / chars.length]}
          />
        ))}
      </span>
    </p>
  );
}
