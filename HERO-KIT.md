# Out. — Kit del Hero para el portafolio personal

> Complemento de `BRAND.md`. Contiene TODO el código del hero de Out. Studio
> adaptado para el portafolio personal de **Oscar Díaz**: mismo layout, mismo
> panel cuadrado de puntos animado (ConceptGrid), con el nombre en lugar del
> wordmark. Copiar los bloques tal cual.

**Dependencias:** React 18+, Tailwind (con los tokens de `BRAND.md` §7),
`framer-motion`, y las dos fuentes (`@fontsource-variable/bricolage-grotesque`,
`@fontsource/instrument-sans` 400+500).

---

## 1. Estructura del hero

Grid de dos columnas (en móvil se apila, el panel va arriba):

- **Izquierda:** eyebrow pequeño en `carne-tinta` → nombre gigante en
  Bricolage 800 con el punto cálido → hook en `klein-mid` → párrafo en
  `ink-2` → CTA klein.
- **Derecha:** el panel de puntos (ConceptGrid) **a sangre** — toca los
  bordes superior, derecho e inferior; alto `h-[42vh]` móvil / `h-[86vh]`
  desktop. Es un canvas: retícula de puntos klein-soft sobre azul Klein,
  los puntos se apartan del cursor, y cada ~5s un punto cálido crece y se
  escapa del marco ("casi todo obedece, una cosa se sale").

## 2. HeroSection adaptado (nombre en vez de Out.)

```tsx
// src/sections/HeroSection.tsx
import FadeIn from '../components/FadeIn';
import AccentButton from '../components/AccentButton';
import ConceptGrid from '../components/ConceptGrid';

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col bg-paper overflow-hidden">
      {/* Nav: logo/nombre a la izquierda, links a la derecha, sin botón */}

      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] items-stretch">
        <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 py-14 md:py-0 order-2 md:order-1">
          <FadeIn delay={0.1} y={16}>
            <span className="text-base sm:text-lg text-carne-tinta">
              UX/UI Specialist · Bogotá
            </span>
          </FadeIn>

          <FadeIn delay={0.2} y={24}>
            {/* El nombre hereda la regla del wordmark: Bricolage 800,
                tracking apretado, y el punto cálido pegado al final.
                clamp más contenido que el de "Out." porque el nombre
                es más largo. */}
            <h1
              className="font-display font-extrabold text-klein tracking-[-0.045em] leading-[0.9] mt-5 flex flex-wrap items-baseline"
              style={{ fontSize: 'clamp(3rem, 9.5vw, 8.5rem)' }}
            >
              Oscar Díaz
              <span
                aria-hidden
                className="inline-block rounded-full bg-carne-deep"
                style={{ width: '0.16em', height: '0.16em', marginLeft: '0.05em' }}
              />
            </h1>
          </FadeIn>

          <FadeIn delay={0.34} y={18}>
            <p
              className="font-display font-semibold text-klein-mid tracking-[-0.03em] mt-6"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.6rem)' }}
            >
              Never the usual.
            </p>
          </FadeIn>

          <FadeIn delay={0.46} y={16}>
            <p className="text-ink-2 leading-relaxed max-w-[42ch] mt-6 text-base sm:text-lg">
              {/* Bio corta del portafolio aquí */}
              Diseño y desarrollo productos digitales de punta a punta:
              estrategia, UX/UI y código.
            </p>
          </FadeIn>

          <FadeIn delay={0.58} y={16} className="mt-9">
            <AccentButton href="#contacto" className="sm:px-12 sm:py-4">
              Hablemos
            </AccentButton>
          </FadeIn>
        </div>

        {/* El panel de puntos, a sangre por arriba/derecha/abajo */}
        <FadeIn
          delay={0.3}
          y={0}
          duration={1}
          className="relative order-1 md:order-2 h-[42vh] md:h-[86vh] overflow-hidden"
        >
          <ConceptGrid className="absolute inset-0" />
        </FadeIn>
      </div>
    </section>
  );
}
```

## 3. ConceptGrid — el panel cuadrado con los puntos (completo)

```tsx
// src/components/ConceptGrid.tsx
import { useEffect, useRef, useState } from 'react';

const KLEIN_SOFT = '200, 205, 240';
const CARNE = '242, 198, 180';

const SPACING = 34;
const BASE_R = 3.1;
const REPEL_RADIUS = 120;
const REPEL_MAX = 26;
const ESCAPE_EVERY = 5200; // ms entre escapes
const ESCAPE_DUR = 1700; // ms que dura un escape

interface Dot {
  bx: number;
  by: number;
  ox: number;
  oy: number;
  born: number;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInCubic(t: number) {
  return t * t * t;
}

/**
 * El concepto de marca animado: una retícula azul Klein donde el sistema
 * reacciona al cursor (los puntos se apartan) y, cada pocos segundos, un
 * punto cálido crece y se escapa cruzando el borde. "Casi todo obedece.
 * Una cosa se sale." Respeta prefers-reduced-motion y se puede pausar.
 */
export default function ConceptGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let dots: Dot[] = [];
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let startAt = 0;

    const pointer = { x: -9999, y: -9999, active: false };

    let escapee: { i: number; t0: number; vx: number; vy: number } | null = null;
    let nextEscapeAt = ESCAPE_EVERY;

    const build = () => {
      cols = Math.max(3, Math.floor((width - SPACING) / SPACING));
      rows = Math.max(3, Math.floor((height - SPACING) / SPACING));
      const gw = (cols - 1) * SPACING;
      const gh = (rows - 1) * SPACING;
      const ox = (width - gw) / 2;
      const oy = (height - gh) / 2;
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          dots.push({
            bx: ox + c * SPACING,
            by: oy + r * SPACING,
            ox: 0,
            oy: 0,
            born: i * 5,
          });
        }
      }
    };

    const pickEscapee = (now: number) => {
      const inner = dots
        .map((_, i) => i)
        .filter((i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          return c > 1 && c < cols - 1 && r > 1 && r < rows - 1;
        });
      if (!inner.length) return;
      const i = inner[Math.floor(((now / 137) % 1) * inner.length) % inner.length];
      const angle = -Math.PI / 4 + (((now / 91) % 1) - 0.5) * 0.9;
      escapee = { i, t0: now, vx: Math.cos(angle), vy: Math.sin(angle) };
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${KLEIN_SOFT}, 0.72)`;
        ctx.arc(d.bx, d.by, BASE_R, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.fillStyle = `rgb(${CARNE})`;
      ctx.arc(width * 0.86, height * 0.14, BASE_R * 2.6, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = now - startAt;

      if (!pausedRef.current) {
        if (!escapee && t > nextEscapeAt) pickEscapee(now);
      }

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        const age = t - d.born;
        const appear = age <= 0 ? 0 : easeOutCubic(Math.min(age / 520, 1));
        if (appear <= 0) continue;

        if (escapee && escapee.i === i) continue;

        let tx = 0;
        let ty = 0;
        if (pointer.active) {
          const dx = d.bx - pointer.x;
          const dy = d.by - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.001) {
            const f = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_MAX;
            tx = (dx / dist) * f;
            ty = (dy / dist) * f;
          }
        }
        d.ox += (tx - d.ox) * 0.15;
        d.oy += (ty - d.oy) * 0.15;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${KLEIN_SOFT}, 0.72)`;
        ctx.arc(d.bx + d.ox, d.by + d.oy, BASE_R * appear, 0, Math.PI * 2);
        ctx.fill();
      }

      if (escapee) {
        const d = dots[escapee.i];
        const p = (now - escapee.t0) / ESCAPE_DUR;
        if (p >= 1) {
          escapee = null;
          nextEscapeAt = t + ESCAPE_EVERY;
        } else {
          const grow = p < 0.32 ? easeOutCubic(p / 0.32) : 1;
          const fly = p < 0.32 ? 0 : easeInCubic((p - 0.32) / 0.68);
          const reach = Math.max(width, height) * 1.05;
          const x = d.bx + escapee.vx * reach * fly;
          const y = d.by + escapee.vy * reach * fly;
          const r = BASE_R * (1 + grow * 1.9);
          const alpha = 1 - Math.max(0, (fly - 0.7) / 0.3);

          if (grow > 0 && fly < 0.6) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${CARNE}, ${0.14 * grow})`;
            ctx.arc(x, y, r * 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.fillStyle = `rgba(${CARNE}, ${alpha})`;
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!visible) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduce) drawStatic();
      else {
        startAt = performance.now();
        nextEscapeAt = ESCAPE_EVERY;
        escapee = null;
        draw(performance.now());
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = inside;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    if (!reduce) start();
    if (canHover) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (canHover) {
        window.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
      }
    };
  }, []);

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={`bg-klein overflow-hidden ${className ?? ''}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />
      {!reduce && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-klein-soft/50 px-3 py-1.5 text-[10px] tracking-[0.04em] text-klein-soft hover:bg-paper-pure hover:text-klein transition-colors duration-200"
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: paused ? '#585D88' : '#F2C6B4' }}
          />
          {paused ? 'Reanudar' : 'Pausar'}
        </button>
      )}
    </div>
  );
}
```

> ⚠️ Importante: el contenedor padre que recibe `className` debe traer el
> posicionamiento (`absolute inset-0` como en el hero). **No añadir
> `relative` a la raíz del componente**: las utilities de posición que se
> pasan por className deben ganar.

## 4. Componentes de apoyo

### FadeIn (entradas suaves)
```tsx
// src/components/FadeIn.tsx
import { motion, useReducedMotion } from 'framer-motion';
import { CSSProperties, ElementType, ReactNode, useMemo } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className,
  style,
}: FadeInProps) {
  const reduceMotion = useReducedMotion();
  const MotionComponent = useMemo(
    () => motion.create(as as ElementType) as typeof motion.div,
    [as]
  );

  return (
    <MotionComponent
      initial={{
        opacity: 0,
        x: reduceMotion ? 0 : x,
        y: reduceMotion ? 0 : y,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
}
```

### AccentButton (CTA)
```tsx
// src/components/AccentButton.tsx
import { ReactNode } from 'react';

interface AccentButtonProps {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  /** invertir sobre fondo azul Klein */
  onBlue?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const ON_PAPER = 'bg-klein text-paper-pure hover:bg-klein-mid';
const ON_BLUE = 'bg-paper-pure text-klein hover:bg-paper';

const BASE =
  'inline-block rounded-full font-sans font-medium text-center px-8 py-3 sm:px-10 sm:py-3.5 text-sm transition-[transform,background-color,opacity] duration-150 ease-out active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none';

export default function AccentButton({
  children,
  href,
  type = 'button',
  onBlue = false,
  className,
  onClick,
  disabled,
}: AccentButtonProps) {
  const classes = `${BASE} ${onBlue ? ON_BLUE : ON_PAPER} ${className ?? ''}`;

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
```

## 5. Checklist de integración

1. Tokens de color y `fontFamily` en `tailwind.config.js` → copiar de `BRAND.md` §7.
2. Fuentes: `npm i @fontsource-variable/bricolage-grotesque @fontsource/instrument-sans framer-motion` e importar en el entry:
   ```ts
   import '@fontsource-variable/bricolage-grotesque';
   import '@fontsource/instrument-sans/400.css';
   import '@fontsource/instrument-sans/500.css';
   ```
3. CSS base (variables, `::selection`, focus) → `BRAND.md` §7.
4. Copiar los 3 componentes de este kit + el HeroSection adaptado.
5. Ajustar textos: eyebrow, bio y CTA. El nombre gigante mantiene el punto
   cálido (`#BC6039` sobre papel) — es la firma de la identidad.
6. Reglas que no se negocian: sin mayúsculas forzadas, sin negro/blanco
   puro, dos tipografías, un solo elemento cálido por composición.
