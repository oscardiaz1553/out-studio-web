import { CSSProperties } from 'react';
import { AZULEJO_BAND } from '../data/botanica';
import { FrameKind, Sym } from './TitleFrame';

const BASE = import.meta.env.BASE_URL;
const MANGO = `${BASE}mango-hero.webp`;
const ASOMA = `${BASE}mono-asoma.webp`;
const AVATAR = `${BASE}mono-avatar.webp`;
const LAPTOP = `${BASE}mono-laptop.webp`;

interface ProjectMediaProps {
  /** URL de la captura real. Si falta, se muestra la lámina de marca. */
  src?: string;
  alt: string;
  /** Nombre del proyecto: va grande en la lámina. */
  label: string;
  /** Enlace del proyecto: de ahí sale el dominio que se muestra abajo. */
  url?: string;
  /** Número del proyecto: decide cuál de las láminas le toca. */
  index?: number;
  className?: string;
  style?: CSSProperties;
}

type Art = 'mango' | 'asoma' | 'avatar' | 'laptop' | 'band';
interface Look {
  bg: string;
  fg: string;
  accent: string;
  kind: FrameKind;
  art: Art;
}

// Nueve láminas con los colores de la marca (nada de rosado ni azul claro), cada
// una con su símbolo y su pieza de material. Están repartidas para que, en la
// cuadrícula de tres columnas, no queden dos iguales una junto a otra. Si hay
// más proyectos, vuelven a empezar.
const LOOKS: Look[] = [
  { bg: '#1B2FCC', fg: '#F5E3B3', accent: '#F5E3B3', kind: 'curly', art: 'mango' },
  { bg: '#F5E3B3', fg: '#1B2FCC', accent: '#BC6039', kind: 'square', art: 'asoma' },
  { bg: '#141E5C', fg: '#F5E3B3', accent: '#F5E3B3', kind: 'angle', art: 'band' },
  { bg: '#141E5C', fg: '#FBF8F5', accent: '#F5E3B3', kind: 'paren', art: 'mango' },
  { bg: '#1B2FCC', fg: '#FBF8F5', accent: '#F5E3B3', kind: 'square', art: 'avatar' },
  { bg: '#F5E3B3', fg: '#141E5C', accent: '#BC6039', kind: 'curly', art: 'laptop' },
  { bg: '#1B2FCC', fg: '#FBF8F5', accent: '#F5E3B3', kind: 'paren', art: 'asoma' },
  { bg: '#F5E3B3', fg: '#1B2FCC', accent: '#BC6039', kind: 'angle', art: 'avatar' },
  { bg: '#141E5C', fg: '#F5E3B3', accent: '#F5E3B3', kind: 'square', art: 'laptop' },
];

/** "https://www.rugsnhome.mx/" → "rugsnhome.mx" */
function domain(url?: string) {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function Pair({ kind, color, size, className = '' }: { kind: FrameKind; color: string; size: string; className?: string }) {
  return (
    <span aria-hidden className={`flex gap-[0.3em] ${className}`} style={{ fontSize: size, color }}>
      <Sym kind={kind} />
      <Sym kind={kind} flip />
    </span>
  );
}

function Artwork({ art, bg }: { art: Art; bg: string }) {
  switch (art) {
    case 'mango':
      return (
        <img
          src={MANGO}
          alt=""
          className="absolute w-[46%] h-auto right-[-7%] bottom-[-14%]"
          style={{ transform: 'rotate(-14deg)' }}
        />
      );
    case 'asoma':
      return <img src={ASOMA} alt="" className="absolute w-[58%] h-auto right-[-5%] bottom-[-9%]" />;
    case 'avatar':
      return <img src={AVATAR} alt="" className="absolute w-[30%] h-auto right-[7%] top-[12%]" style={{ borderRadius: '2cqw' }} />;
    case 'laptop':
      return <img src={LAPTOP} alt="" className="absolute w-[52%] h-auto right-[-6%] bottom-[-12%]" />;
    default:
      // La franja de azulejo, a todo lo ancho, sobre el fondo oscuro.
      return (
        <div
          aria-hidden
          className="absolute left-0 right-0 top-0 h-[16%]"
          style={{ background: `${bg} url(${AZULEJO_BAND}) repeat-x`, backgroundSize: 'auto 100%' }}
        />
      );
  }
}

/**
 * Imagen de un proyecto. Con captura real, la muestra; sin ella, arma una
 * lámina de marca (como las de los servicios): el nombre del proyecto grande,
 * su dominio, un par de símbolos y una pieza del material de Out. Todo se mide
 * en cqw, así que escala sola. Así no hay fotos de stock sobre clientes reales.
 */
export default function ProjectMedia({
  src,
  alt,
  label,
  url,
  index = 0,
  className,
  style,
}: ProjectMediaProps) {
  if (src) {
    return <img src={src} alt={alt} loading="lazy" className={className} style={style} />;
  }

  const look = LOOKS[Math.max(0, index - 1) % LOOKS.length];
  const host = domain(url);
  // Nombres largos, un poco más chicos para que no se corten.
  const nameSize = label.length > 14 ? '9.5cqw' : label.length > 9 ? '12cqw' : '15cqw';

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden ${className ?? ''}`}
      style={{ ...style, background: look.bg, color: look.fg, containerType: 'inline-size' }}
    >
      <Artwork art={look.art} bg={look.bg} />
      <Pair kind={look.kind} color={look.accent} size="9cqw" className="absolute left-[7%] top-[22%]" />
      <span
        className="absolute left-[7%] bottom-[19%] max-w-[58%] font-display font-extrabold tracking-[-0.045em] leading-[0.94] select-none"
        style={{ fontSize: nameSize }}
      >
        {label}
      </span>
      {host && (
        <span
          className="absolute left-[7%] bottom-[7%] font-sans font-medium select-none"
          style={{ fontSize: '3.2cqw', color: look.fg, opacity: 0.75 }}
        >
          {host}
        </span>
      )}
    </div>
  );
}
