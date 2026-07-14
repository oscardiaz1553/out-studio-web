import { useEffect, useRef, useState } from 'react';

const KLEIN_SOFT = '200, 205, 240';
const CARNE = '242, 198, 180';

const SPACING = 34;
const BASE_R = 3.1;
const REPEL_RADIUS = 120;
const REPEL_MAX = 26;
const ESCAPE_EVERY = 5200; // ms between escapes
const ESCAPE_DUR = 1700; // ms an escape takes

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
 * The brand concept, animated: a Klein-blue grid where the system reacts to
 * the cursor (dots step aside) and, every few seconds, one warm dot grows and
 * escapes across the border. "Casi todo obedece. Una cosa se sale."
 * Honors prefers-reduced-motion (final state, no loop) and can be paused.
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

    // current escape event
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
      // a dot from the inner area, so it has a border to cross
      const inner = dots
        .map((_, i) => i)
        .filter((i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          return c > 1 && c < cols - 1 && r > 1 && r < rows - 1;
        });
      if (!inner.length) return;
      const i = inner[Math.floor(((now / 137) % 1) * inner.length) % inner.length];
      // direction: up-right bias, the "salida"
      const angle = -Math.PI / 4 + (((now / 91) % 1) - 0.5) * 0.9;
      escapee = { i, t0: now, vx: Math.cos(angle), vy: Math.sin(angle) };
    };

    const drawStatic = () => {
      // reduced-motion: grid + one warm dot already outside, top-right
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${KLEIN_SOFT}, 0.72)`;
        ctx.arc(d.bx, d.by, BASE_R, 0, Math.PI * 2);
        ctx.fill();
      }
      // the escaped one, beyond the frame
      ctx.beginPath();
      ctx.fillStyle = `rgb(${CARNE})`;
      ctx.arc(width * 0.86, height * 0.14, BASE_R * 2.6, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = now - startAt;

      // schedule escapes
      if (!pausedRef.current) {
        if (!escapee && t > nextEscapeAt) pickEscapee(now);
      }

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // entrance
        const age = t - d.born;
        const appear = age <= 0 ? 0 : easeOutCubic(Math.min(age / 520, 1));
        if (appear <= 0) continue;

        // escapee handled separately
        if (escapee && escapee.i === i) continue;

        // repel
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

      // the fugitive
      if (escapee) {
        const d = dots[escapee.i];
        const p = (now - escapee.t0) / ESCAPE_DUR;
        if (p >= 1) {
          escapee = null;
          nextEscapeAt = t + ESCAPE_EVERY;
        } else {
          // grow, then launch across the border
          const grow = p < 0.32 ? easeOutCubic(p / 0.32) : 1;
          const fly = p < 0.32 ? 0 : easeInCubic((p - 0.32) / 0.68);
          const reach = Math.max(width, height) * 1.05;
          const x = d.bx + escapee.vx * reach * fly;
          const y = d.by + escapee.vy * reach * fly;
          const r = BASE_R * (1 + grow * 1.9);
          const alpha = 1 - Math.max(0, (fly - 0.7) / 0.3);

          // soft ring while it swells
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
          className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-klein-soft/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-klein-soft hover:bg-paper-pure hover:text-klein transition-colors duration-200"
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
