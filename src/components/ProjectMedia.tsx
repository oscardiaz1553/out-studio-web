import { CSSProperties } from 'react';
import { AZULEJO } from '../data/botanica';

interface ProjectMediaProps {
  /** URL de la captura real. Si falta, se muestra el placeholder de marca. */
  src?: string;
  alt: string;
  /** Inicial u otra etiqueta corta para el placeholder. */
  label: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Imagen de un proyecto, con fallback de marca cuando aún no hay una captura
 * real (p. ej. mientras el sitio sigue en desarrollo). El fallback usa el
 * patrón de azulejo a baja opacidad + la inicial del proyecto en vez de
 * fotos de stock, para no mostrar contenido falso sobre clientes reales.
 */
export default function ProjectMedia({
  src,
  alt,
  label,
  className,
  style,
}: ProjectMediaProps) {
  if (src) {
    return (
      <img src={src} alt={alt} loading="lazy" className={className} style={style} />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden bg-klein-deep flex items-center justify-center ${className ?? ''}`}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: `url(${AZULEJO})`,
          backgroundSize: '220%',
          backgroundPosition: 'center',
        }}
      />
      <span
        className="relative font-display font-extrabold text-paper-pure select-none"
        style={{
          fontSize: 'clamp(1.8rem, 7vw, 4.5rem)',
          textShadow: '0 2px 20px rgba(20,30,92,0.5)',
        }}
      >
        {label}
      </span>
    </div>
  );
}
