import { useState } from 'react';

interface StatueProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Classical statue in the brand duotone (Klein blue shadows, warm highlights).
 * If the photo fails to load, the `.duotone` panel underneath stays as a
 * Klein-blue dot-grid block, so the layout never looks broken.
 */
export default function Statue({ src, alt, className }: StatueProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`duotone ${className ?? ''}`}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
