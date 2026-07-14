import { useEffect, useState } from 'react';
import { BrandDot } from './Brand';
import { BOTANICA } from '../data/botanica';

/**
 * The hero wordmark, two-plane:
 *  - back plane: solid Klein "Out" + the always-warm dot (always legible).
 *  - front plane: the same "Out" letters filled with the blue botanical via
 *    background-clip:text, so the garden reads *through* the letters.
 * If the botanical image is missing, the front plane simply doesn't mount and
 * the solid Klein wordmark shows. The word never disappears.
 */
export default function BotanicalWord({ className }: { className?: string }) {
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setHasImage(true);
    img.src = BOTANICA;
  }, []);

  return (
    <h1
      className={`relative font-display font-extrabold tracking-[-0.05em] leading-[0.86] ${className ?? ''}`}
      style={{ fontSize: 'clamp(4rem, 13vw, 12rem)' }}
      aria-label="Out."
    >
      {/* back plane — solid Klein, carries the warm dot */}
      <span aria-hidden className="text-klein">
        Out
        <BrandDot />
      </span>

      {/* front plane — botanical clipped into the letters (desktop, if loaded) */}
      {hasImage && (
        <span
          aria-hidden
          className="absolute inset-0 hidden md:block text-transparent bg-clip-text botanical-fill"
          style={{
            backgroundImage: `url(${BOTANICA})`,
            WebkitTextStroke: '1.4px #1B2FCC',
          }}
        >
          Out
        </span>
      )}
    </h1>
  );
}
