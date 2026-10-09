import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// La animación de marca (la misma de la apertura, sin las palabras) en el
// pie: arranca al entrar en pantalla y se queda en el cuadro final, "Out" y
// el lema. Es una sola pieza en vivo que se adapta al formato: en pantalla
// ancha usa el encuadre horizontal y en el celular se reacomoda al alto.
const BASE = import.meta.env.BASE_URL;

export default function FooterAnimation() {
  const reduceMotion = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const inView = useInView(box, { amount: 0.55 });
  const [ready, setReady] = useState(false);

  const src = `${BASE}intro/index.html?nowords=1&speed=1.2&auto=0${reduceMotion ? '&static=1' : ''}`;

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.source !== frame.current?.contentWindow) return;
      if (e.data?.source === 'out-intro' && e.data.type === 'ready') setReady(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Cada vez que entra en pantalla (y ya cargó) se reproduce desde el inicio.
  useEffect(() => {
    if (reduceMotion || !ready || !inView) return;
    frame.current?.contentWindow?.postMessage(
      { source: 'out-intro-cmd', cmd: 'play' },
      window.location.origin,
    );
  }, [inView, ready, reduceMotion]);

  return (
    <div
      ref={box}
      role="img"
      aria-label="Out. Never the usual."
      className="relative overflow-hidden rounded-2xl bg-klein h-[clamp(380px,110vw,460px)] sm:h-[clamp(320px,38vw,540px)] w-full"
    >
      <iframe
        ref={frame}
        src={src}
        title="Animación del logo de Out"
        aria-hidden
        tabIndex={-1}
        loading="lazy"
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}
