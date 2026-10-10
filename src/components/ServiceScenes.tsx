import { ReactNode } from 'react';
import { AZULEJO } from '../data/botanica';
import { Sym } from './TitleFrame';

// Las láminas que siguen al cursor en Servicios: cada servicio tiene su
// escena armada con el material de la marca (símbolos, mono, mango, azulejo,
// logo). Todo se mide en cqw (el ancho de la lámina), así que escala solo.
const BASE = import.meta.env.BASE_URL;
const MONO_ASOMA = `${BASE}mono-asoma.webp`;
const MONO_AVATAR = `${BASE}mono-avatar.webp`;
const MONO_LAPTOP = `${BASE}mono-laptop.webp`;
const MANGO = `${BASE}mango-hero.webp`;

const CREMA = '#F5E3B3';

function Scene({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
      {children}
    </div>
  );
}

function Pair({
  kind,
  size,
  color,
  className = '',
}: {
  kind: 'square' | 'curly' | 'angle' | 'paren';
  size: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`flex gap-[0.3em] ${className}`}
      style={{ fontSize: size, color }}
    >
      <Sym kind={kind} />
      <Sym kind={kind} flip />
    </span>
  );
}

// Logo (u): la O partida con la u adentro (Logo out-06).
const LOGO_U = [
  'M103.05,35.21c-.99-3.04-2.42-5.57-4.31-7.59-1.88-2.02-4.14-3.54-6.78-4.56-1.74-.67-3.65-1.12-5.71-1.34v9.78c.73,.27,1.4,.65,2.01,1.13,1.48,1.18,2.6,2.9,3.35,5.16s1.13,5.11,1.13,8.54c0,3.21-.35,5.89-1.06,8.05-.71,2.17-1.79,3.8-3.25,4.88-.66,.48-1.38,.86-2.18,1.12v9.53c1.88-.24,3.64-.67,5.29-1.29,2.68-1.02,5-2.53,6.96-4.56,1.95-2.02,3.44-4.57,4.48-7.63,1.04-3.06,1.55-6.61,1.55-10.66s-.49-7.52-1.48-10.56Z',
  'M21.37,32.32c-1.86,3.6-2.79,8.18-2.79,13.73,0,3.91,.49,7.37,1.48,10.38,.99,3.02,2.43,5.54,4.31,7.56,1.88,2.02,4.16,3.56,6.82,4.59,2.13,.83,4.46,1.33,7,1.48v-9.43c-.72-.15-1.39-.39-2.02-.7-1.28-.64-2.35-1.58-3.22-2.83-.87-1.24-1.52-2.82-1.94-4.73-.42-1.9-.64-4.08-.64-6.53,0-3.3,.38-6.05,1.13-8.26,.76-2.22,1.86-3.89,3.32-5.02,.98-.76,2.1-1.26,3.37-1.5v-9.42c-3.33,.27-6.35,1.13-9.05,2.59-3.32,1.79-5.91,4.48-7.77,8.09Z',
  'M56.16,70.13c-4.19,0-7.3-1.44-9.32-4.31-2.02-2.87-3.04-7.27-3.04-13.21V31.85h11.44v20.27c0,2.92,.42,5.01,1.27,6.29s2.09,1.91,3.74,1.91c1.08,0,2.07-.28,2.97-.85,.89-.56,1.67-1.41,2.33-2.54,.66-1.13,1.15-2.53,1.48-4.2,.33-1.67,.49-3.61,.49-5.83v-15.04h11.44v37.29h-9.53l-.07-13.63h-.78c-.38,3.39-1.07,6.17-2.08,8.33-1.01,2.17-2.38,3.76-4.1,4.77-1.72,1.01-3.8,1.52-6.25,1.52Z',
];

// </> cierre de etiqueta (simbolos/etiqueta-cierre.svg).
function CloseTag({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 126.12 91.76" className="w-full h-auto" aria-hidden style={{ color }}>
      <defs>
        <clipPath id="sc-c">
          <rect x="18.58" y="21.7" width="19.61" height="48.4" />
        </clipPath>
        <clipPath id="sc-cy">
          <rect x="-40" y="21.7" width="200" height="48.4" />
        </clipPath>
      </defs>
      <g
        transform="translate(0 1.9)"
        fill="none"
        stroke="currentColor"
        strokeWidth="9.4"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        strokeLinecap="butt"
      >
        <g transform="translate(-17 0)">
          <g clipPath="url(#sc-c)">
            <path d="M46,21 L23.3,45.9 L46,70.8" />
          </g>
        </g>
        <g clipPath="url(#sc-cy)">
          <path d="M30,70.1 L37,21.7" />
        </g>
        <g transform="matrix(-1 0 0 1 123.11 0)">
          <g clipPath="url(#sc-c)">
            <path d="M46,21 L23.3,45.9 L46,70.8" />
          </g>
        </g>
      </g>
    </svg>
  );
}

const SCENE_LIST: ReactNode[] = [
  // Tiendas Shopify: la fruta que se vende, entre llaves.
  <Scene key="shopify" bg={CREMA}>
    <Pair kind="curly" size="34cqw" color="#1B2FCC" className="absolute left-1/2 top-[7%] -translate-x-1/2" />
    <img
      src={MANGO}
      alt=""
      className="absolute w-[96%] h-auto left-[2%] bottom-[-4%]"
      style={{ transform: 'rotate(-10deg)', filter: 'drop-shadow(0 6cqw 8cqw rgba(20,30,92,.3))' }}
    />
  </Scene>,
  // Sitios WordPress: tú, entre corchetes.
  <Scene key="wp" bg="#1B2FCC">
    <div className="absolute inset-0 flex items-center justify-center gap-[2cqw]">
      <Pair kind="square" size="66cqw" color={CREMA} className="!gap-[34cqw]" />
    </div>
    <img
      src={MONO_AVATAR}
      alt=""
      className="absolute left-1/2 top-1/2 w-[40cqw] h-auto -translate-x-1/2 -translate-y-1/2 rounded-[3cqw]"
    />
  </Scene>,
  // Landing Pages: la etiqueta < > con el mono asomando.
  <Scene key="landing" bg="#141E5C">
    <Pair kind="angle" size="58cqw" color={CREMA} className="absolute left-1/2 top-[6%] -translate-x-1/2 !gap-[12cqw]" />
    <img
      src={MONO_ASOMA}
      alt=""
      className="absolute w-[130%] h-auto right-[-4%] bottom-[-6%]"
    />
  </Scene>,
  // Branding: el logo (u) y la fruta.
  <Scene key="branding" bg="#F3EDE7">
    <svg
      viewBox="12 18 106 58"
      aria-hidden
      className="absolute left-1/2 top-[14%] w-[88%] h-auto -translate-x-1/2"
    >
      {LOGO_U.map((d, i) => (
        <path key={i} d={d} fill="#1B2FCC" />
      ))}
    </svg>
    <img
      src={MANGO}
      alt=""
      className="absolute w-[58%] h-auto right-[-8%] bottom-[-6%]"
      style={{ transform: 'rotate(14deg)' }}
    />
    <span
      aria-hidden
      className="absolute left-[8%] bottom-[10%] font-display font-extrabold tracking-[-0.04em] leading-none"
      style={{ fontSize: '12cqw', color: '#BC6039' }}
    >
      Never the
      <br />
      usual.
    </span>
  </Scene>,
  // Apps & Integraciones: el mono programando sobre azulejo.
  <Scene key="apps" bg="#1B2FCC">
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.4]"
      style={{ backgroundImage: `url(${AZULEJO})`, backgroundSize: '70cqw', backgroundPosition: 'center' }}
    />
    <img
      src={MONO_LAPTOP}
      alt=""
      className="absolute w-[130%] h-auto left-[-15%] bottom-[-3%]"
    />
  </Scene>,
  // Soporte & Optimización: cierre de etiqueta, cursor y mango.
  <Scene key="soporte" bg="#141E5C">
    <div className="absolute left-[10%] right-[10%] top-[16%]">
      <CloseTag color={CREMA} />
    </div>
    <span
      aria-hidden
      className="absolute left-[44%] top-[58%] block w-[3cqw] h-[16cqw]"
      style={{ background: CREMA }}
    />
    <img
      src={MANGO}
      alt=""
      className="absolute w-[62%] h-auto left-[-10%] bottom-[-8%]"
      style={{ transform: 'rotate(12deg)' }}
    />
  </Scene>,
];

// Cada lámina por clave, para usarla en el hover de Servicios y en la cabecera
// de la página de cada servicio.
export const SCENES: Record<string, ReactNode> = {
  shopify: SCENE_LIST[0],
  wordpress: SCENE_LIST[1],
  landing: SCENE_LIST[2],
  branding: SCENE_LIST[3],
  apps: SCENE_LIST[4],
  soporte: SCENE_LIST[5],
};
