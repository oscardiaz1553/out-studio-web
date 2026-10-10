import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { isPhone } from './IntroOverlay';

// La animación de marca (la misma de la apertura, sin las palabras) en el
// pie: arranca al entrar en pantalla y se queda en el cuadro final, "Out" y
// el lema. Es una sola pieza en vivo que se adapta al formato: en pantalla
// ancha usa el encuadre horizontal y en el celular se reacomoda al alto.
const BASE = import.meta.env.BASE_URL;
const VIDEO_MP4 = `${BASE}intro-movil.mp4`;
const VIDEO_WEBM = `${BASE}intro-movil.webm`;
const POSTER = `${BASE}intro-movil-poster.webp`;

/** En el celular: el video vertical liviano (la pieza en vivo es demasiado
 *  pesada para el teléfono). */
function FooterVideo() {
  const reduceMotion = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement | null>(null);
  const inView = useInView(box, { amount: 0.6 });

  useEffect(() => {
    const v = vid.current;
    if (!v || reduceMotion || !inView) return;
    v.currentTime = 0;
    void v.play().catch(() => undefined);
  }, [inView, reduceMotion]);

  return (
    <div
      ref={box}
      role="img"
      aria-label="Out. Never the usual."
      className="relative overflow-hidden rounded-2xl bg-klein aspect-[9/16] w-full max-w-[250px] mx-auto"
    >
      <video
        ref={(el) => {
          vid.current = el;
          if (el) {
            el.muted = true;
            el.defaultMuted = true;
            el.setAttribute('muted', '');
            el.setAttribute('playsinline', '');
          }
        }}
        poster={POSTER}
        muted
        playsInline
        preload="none"
        controls={false}
        disablePictureInPicture
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src={VIDEO_MP4} type="video/mp4" />
        <source src={VIDEO_WEBM} type="video/webm" />
      </video>
    </div>
  );
}

function FooterLive() {
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

export default function FooterAnimation() {
  const phone = useRef(isPhone()).current;
  return phone ? <FooterVideo /> : <FooterLive />;
}
