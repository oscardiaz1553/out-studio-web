import { ReactNode } from 'react';

// Los símbolos de la marca (docs/marca-nueva/simbolos) usados como marco de
// los títulos de sección: cada uno enmarca su palabra como código. Trazo de
// 9.4 con corte plano, igual que los corchetes del logo.
const VIEW = '18.58 21.7 19.61 48.4';
const KINDS = {
  square: { d: 'M38.19,26.4 H23.28 V65.4 H38.19' },
  curly: {
    d: 'M38.19,26.4 H34 Q29,26.4 29,31.4 V40.9 Q29,45.9 23.3,45.9 Q29,45.9 29,50.9 V60.4 Q29,65.4 34,65.4 H38.19',
  },
  angle: { d: 'M46,21 L23.3,45.9 L46,70.8' },
  // Paréntesis de la O partida del logo (viewBox propio).
  paren: {
    view: '44.96 21.7 19.61 48.4',
    fill:
      'M47.75,32.35c-1.86,3.6-2.79,8.18-2.79,13.73,0,3.91,.49,7.37,1.48,10.38,.99,3.02,2.43,5.54,4.31,7.56,1.88,2.02,4.16,3.56,6.82,4.59,2.13,.83,4.46,1.33,7,1.48v-9.43c-.72-.15-1.39-.39-2.02-.7-1.28-.64-2.35-1.58-3.22-2.83-.87-1.24-1.52-2.82-1.94-4.73-.42-1.9-.64-4.08-.64-6.53,0-3.3,.38-6.05,1.13-8.26,.76-2.22,1.86-3.89,3.32-5.02,.98-.76,2.1-1.26,3.37-1.5v-9.42c-3.33,.27-6.35,1.13-9.05,2.59-3.32,1.79-5.91,4.48-7.77,8.09Z',
  },
} as const;

export type FrameKind = keyof typeof KINDS;

export function Sym({ kind, flip }: { kind: FrameKind; flip?: boolean }) {
  const k = KINDS[kind] as { d?: string; fill?: string; view?: string };
  return (
    <svg
      aria-hidden
      viewBox={k.view ?? VIEW}
      className="shrink-0 h-[0.82em] w-auto"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      {k.fill ? (
        <path d={k.fill} fill="currentColor" />
      ) : (
        <path
          d={k.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={9.4}
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          strokeLinecap="butt"
        />
      )}
    </svg>
  );
}

/**
 * Enmarca un título con un par de símbolos de la marca. `tone`: "warm" sobre
 * fondos claros (el único elemento cálido del cuadro), "light" sobre azul.
 */
export default function TitleFrame({
  kind,
  tone = 'warm',
  fontSize,
  children,
}: {
  kind: FrameKind;
  tone?: 'warm' | 'light';
  /** El mismo tamaño de fuente del título, para que los símbolos escalen. */
  fontSize: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-[0.22em] ${
        tone === 'warm' ? 'text-carne-deep' : 'text-carne'
      }`}
      style={{ fontSize }}
    >
      <Sym kind={kind} />
      {children}
      <Sym kind={kind} flip />
    </span>
  );
}
