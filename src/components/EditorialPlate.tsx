import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BOTANICA } from '../data/botanica';

interface EditorialPlateProps {
  fig: string;
  caption: string;
  /** object-position for the crop, e.g. "38% 42%" */
  objectPosition?: string;
  /** capsize the plate height */
  minH?: string;
  /** knockout pull-quote (two lines: obeys / escapes) */
  quoteObeys?: string;
  quoteEscapes?: string;
  captionSide?: 'left' | 'right';
  /** if true, the plate renders nothing until the botanical image loads */
  hideWithoutImage?: boolean;
}

/**
 * Full-bleed magazine plate. The botanical illustration runs edge to edge; if
 * the image is missing it degrades to a Klein dot-grid panel (on-brand, never
 * broken). Optional Klein multiply scrim + knockout pull-quote. Slow parallax
 * drift on scroll, gated by prefers-reduced-motion.
 */
export default function EditorialPlate({
  fig,
  caption,
  objectPosition = '50% 45%',
  minH = 'min-h-[86vh]',
  quoteObeys,
  quoteEscapes,
  captionSide = 'right',
  hideWithoutImage = false,
}: EditorialPlateProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // 'probing' until we know if the botanical exists; then 'ok' | 'fail'
  const [status, setStatus] = useState<'probing' | 'ok' | 'fail'>('probing');
  const hasQuote = Boolean(quoteObeys || quoteEscapes);
  const failed = status === 'fail';

  useEffect(() => {
    const img = new Image();
    img.onload = () => setStatus('ok');
    img.onerror = () => setStatus('fail');
    img.src = BOTANICA;
  }, []);

  // All hooks must run before any early return (hooks-order rule).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);

  // Keep the layout clean before the image is uploaded: optional plates
  // (e.g. the pattern interlude) render nothing until the botanical exists.
  if (hideWithoutImage && failed) return null;

  return (
    <section
      ref={ref}
      aria-label={`${fig} — ${caption}`}
      className={`relative w-full overflow-hidden bg-klein ${minH}`}
    >
      {/* botanical in full colour (already on-brand), oversized so parallax
          never exposes an edge. Fallback texture = Klein dot-grid. */}
      <motion.div
        className="absolute inset-x-0 -top-[10%] h-[120%]"
        style={{
          backgroundColor: '#1B2FCC',
          backgroundImage: 'radial-gradient(#C8CDF0 1.1px, transparent 1.4px)',
          backgroundSize: '22px 22px',
          ...(reduce ? {} : { y, scale }),
        }}
      >
        {status === 'ok' && (
          <img
            src={BOTANICA}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition }}
          />
        )}
      </motion.div>

      {/* Klein multiply scrim only when the plate carries a quote */}
      {hasQuote && (
        <>
          <div className="absolute inset-0 bg-klein/30 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-klein-deep/55 via-transparent to-transparent pointer-events-none" />
        </>
      )}

      {hasQuote && (
        <div className="absolute left-[6vw] bottom-[12vh] z-10 max-w-[16ch]">
          <p
            className="font-display font-semibold text-paper-pure leading-[0.92] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2.25rem, 7vw, 6rem)' }}
          >
            {quoteObeys}{' '}
            <span className="text-carne">{quoteEscapes}</span>
          </p>
        </div>
      )}

      <span
        className={`absolute bottom-5 ${
          captionSide === 'left' ? 'left-5' : 'right-5'
        } z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-pure/80 pointer-events-none`}
      >
        {fig} — {caption}
      </span>
    </section>
  );
}
