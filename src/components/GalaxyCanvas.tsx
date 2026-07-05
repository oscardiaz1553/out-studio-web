import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  ember: boolean;
}

const LIGHT_RADIUS = 230;
const STAR_WHITE = '255, 255, 255';
const ACCENT = '75, 140, 200';

/**
 * Starfield background. Static at rest; the area under the cursor lights up
 * like a focus ring: nearby stars brighten, twinkle and drift slightly while
 * a soft glow follows the pointer with spring-like smoothing.
 */
export default function GalaxyCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const canHover = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;

    // Spotlight state: position eases toward the cursor, strength fades
    // in/out so the focus never pops.
    let lightX = -9999;
    let lightY = -9999;
    let targetX = -9999;
    let targetY = -9999;
    let strength = 0;
    let targetStrength = 0;

    const buildStars = () => {
      const count = Math.round((width * height) / 3000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.2,
        baseAlpha: 0.12 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2.5,
        ember: Math.random() < 0.08,
      }));
    };

    const draw = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, width, height);

      if (strength > 0.01) {
        const glow = ctx.createRadialGradient(
          lightX,
          lightY,
          0,
          lightX,
          lightY,
          LIGHT_RADIUS * 1.3
        );
        glow.addColorStop(0, `rgba(${ACCENT}, ${0.045 * strength})`);
        glow.addColorStop(0.35, `rgba(${STAR_WHITE}, ${0.035 * strength})`);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      for (const star of stars) {
        const dx = star.x - lightX;
        const dy = star.y - lightY;
        const dist = Math.hypot(dx, dy);
        let influence = dist < LIGHT_RADIUS ? 1 - dist / LIGHT_RADIUS : 0;
        influence = influence * influence * (3 - 2 * influence); // smoothstep
        const boost = influence * strength;

        let x = star.x;
        let y = star.y;
        let r = star.r;
        let alpha = star.baseAlpha + (0.95 - star.baseAlpha) * boost;

        if (!reduceMotion && boost > 0) {
          // Stars drift gently away from the light and twinkle while focused
          if (dist > 0.001) {
            const push = 5 * boost;
            x += (dx / dist) * push;
            y += (dy / dist) * push;
          }
          const twinkle = Math.sin(t * star.speed + star.phase);
          r = star.r * (1 + 0.35 * boost + 0.15 * twinkle * boost);
          alpha += 0.1 * twinkle * boost;
        }

        ctx.beginPath();
        ctx.fillStyle = star.ember
          ? `rgba(${ACCENT}, ${alpha})`
          : `rgba(${STAR_WHITE}, ${alpha})`;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      lightX += (targetX - lightX) * 0.12;
      lightY += (targetY - lightY) * 0.12;
      strength += (targetStrength - strength) * 0.08;

      draw(now);

      if (targetStrength === 0 && strength < 0.005) {
        strength = 0;
        draw(now);
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      draw(performance.now());
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetStrength = inside ? 1 : 0;
      if (inside) {
        if (lightX < -999) {
          lightX = targetX;
          lightY = targetY;
        }
        start();
      } else if (strength > 0) {
        start();
      }
    };

    const onPointerLeave = () => {
      targetStrength = 0;
      if (strength > 0) start();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (canHover) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener(
        'pointerleave',
        onPointerLeave
      );
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      if (canHover) {
        window.removeEventListener('pointermove', onPointerMove);
        document.documentElement.removeEventListener(
          'pointerleave',
          onPointerLeave
        );
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none ${className ?? ''}`}
    />
  );
}
