import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  vx: number;
  vy: number;
  ember: boolean;
}

const LIGHT_RADIUS = 230;
const STAR_WHITE = '255, 255, 255';
const ACCENT = '75, 140, 200';

/**
 * Starfield background in constant, gentle motion: stars drift slowly and
 * twinkle at all times. The area under the cursor additionally lights up
 * like a focus: nearby stars brighten and swell while a soft glow eases
 * toward the pointer. Falls back to a static field under
 * prefers-reduced-motion, and the loop pauses while the canvas is
 * off-screen.
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
    let visible = true;

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
      stars = Array.from({ length: count }, () => {
        const drift = 0.05 + Math.random() * 0.12;
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.4 + Math.random() * 1.2,
          baseAlpha: 0.12 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.2,
          vx: Math.cos(angle) * drift,
          vy: Math.sin(angle) * drift,
          ember: Math.random() < 0.08,
        };
      });
    };

    const draw = (t: number) => {
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

        // Ambient twinkle, always on
        const twinkle = Math.sin(t * star.speed + star.phase);
        let alpha = star.baseAlpha * (0.75 + 0.25 * twinkle);

        // Cursor focus: brighten, swell and push slightly
        alpha += (0.95 - alpha) * boost;
        if (boost > 0 && dist > 0.001) {
          const push = 5 * boost;
          x += (dx / dist) * push;
          y += (dy / dist) * push;
          r = star.r * (1 + 0.35 * boost + 0.15 * twinkle * boost);
        }

        ctx.beginPath();
        ctx.fillStyle = star.ember
          ? `rgba(${ACCENT}, ${alpha})`
          : `rgba(${STAR_WHITE}, ${alpha})`;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (now: number) => {
      // Constant slow drift, wrapping at the edges
      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < -2) star.x = width + 2;
        else if (star.x > width + 2) star.x = -2;
        if (star.y < -2) star.y = height + 2;
        else if (star.y > height + 2) star.y = -2;
      }

      lightX += (targetX - lightX) * 0.12;
      lightY += (targetY - lightY) * 0.12;
      strength += (targetStrength - strength) * 0.08;
      if (targetStrength === 0 && strength < 0.005) strength = 0;

      draw(now / 1000);

      if (!visible) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      raf = requestAnimationFrame(step);
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
      draw(performance.now() / 1000);
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
      if (inside && lightX < -999) {
        lightX = targetX;
        lightY = targetY;
      }
    };

    const onPointerLeave = () => {
      targetStrength = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    // Pause the loop while the hero is scrolled out of view
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(canvas);

    start();

    if (canHover) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener(
        'pointerleave',
        onPointerLeave
      );
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
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
