import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import { PROJECTS } from '../data/projects';
import RevealText from '../components/RevealText';
import TitleFrame from '../components/TitleFrame';

// El enlace sale de src/data/projects.ts: cuando cambie el sitio de Diario
// Deportes, se actualiza allá.
const CASE_URL = PROJECTS.find((p) => p.name === 'Diario Deportes')?.url;

const BASE = import.meta.env.BASE_URL;
const VIDEO = `${BASE}diario-deportes.mp4`;
const POSTER = `${BASE}diario-deportes-poster.webp`;
// En el celular se usa la versión vertical (9:16), pensada para esa pantalla.
const VIDEO_V = `${BASE}diario-deportes-vertical.mp4`;
const POSTER_V = `${BASE}diario-deportes-vertical-poster.webp`;

function useIsPhone() {
  const query = '(max-width: 639px)';
  const [phone, setPhone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setPhone(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}

/** Video del caso: arranca solo y en silencio cuando entra en pantalla, se
 *  pausa al salir, y deja activar el sonido. Con "reducir movimiento" o ahorro
 *  de datos no arranca solo: muestra el póster y un botón de reproducir. */
function CaseVideo() {
  const reduceMotion = useReducedMotion();
  const vertical = useIsPhone();
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.5 });
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const saveData = Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData,
  );
  const autoplay = !reduceMotion && !saveData;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && (autoplay || playing)) {
      void v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [inView, autoplay, playing]);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    if (muted) {
      v.muted = false;
      v.currentTime = 0;
      void v.play().catch(() => undefined);
    } else {
      v.muted = true;
    }
    setMuted(!muted);
  };

  return (
    <div
      ref={box}
      className={`relative overflow-hidden rounded-2xl bg-klein-deep shadow-[0_24px_60px_rgba(20,30,92,0.25)] ${
        vertical ? 'aspect-[9/16] w-full max-w-[340px] mx-auto' : 'aspect-video'
      }`}
    >
      <video
        key={vertical ? 'v' : 'h'}
        ref={ref}
        src={vertical ? VIDEO_V : VIDEO}
        poster={vertical ? POSTER_V : POSTER}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Video del caso Diario Deportes: del sitio de antes al rediseño"
        onPlay={() => setPlaying(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!autoplay && !playing && (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            void ref.current?.play();
          }}
          aria-label="Reproducir el video"
          className="absolute inset-0 flex items-center justify-center bg-klein-deep/30 hover:bg-klein-deep/20 transition-colors"
        >
          <span className="w-16 h-16 rounded-full bg-paper-pure text-klein flex items-center justify-center text-xl pl-1">
            ▶
          </span>
        </button>
      )}
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        className="absolute bottom-3 right-3 rounded-full bg-paper-pure/95 text-klein-deep text-xs font-medium px-4 py-2 shadow-[0_6px_20px_rgba(20,20,60,0.3)] hover:bg-paper-pure active:scale-[0.97] transition"
      >
        {muted ? '🔈 Activar sonido' : '🔊 Silenciar'}
      </button>
    </div>
  );
}

export default function ResultsSection() {
  return (
    <section
      id="resultados"
      className="bg-paper-pure border-t border-klein-deep/15 px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-8 sm:mb-10">
          <TitleFrame kind="paren" tone="warm" fontSize="clamp(2rem, 4vw, 3.4rem)">
            <RevealText
              as="h2"
              text="Resultados"
              className="font-display font-semibold text-klein tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
            />
          </TitleFrame>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.4fr] gap-8 lg:gap-14 items-center">
          <FadeIn>
            <p className="inline-flex items-center gap-2 text-xs text-carne-tinta mb-4">
              Caso · Diario Deportes
            </p>
            <h3
              className="font-display font-extrabold text-klein tracking-[-0.04em] leading-[1.02]"
              style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3.2rem)' }}
            >
              Una solución
              <br />
              necesaria.
            </h3>
            <p className="text-ink-2 leading-relaxed mt-5 max-w-[46ch]">
              Un medio deportivo con diez secciones al mismo nivel, módulos
              repetidos y banners sin etiqueta. Lo rediseñamos para que cada
              visita encuentre primero lo importante: la nota principal, el
              partido al frente y la publicidad en su lugar.
            </p>
            {CASE_URL && (
              <AccentButton
                href={CASE_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-7"
              >
                Mira el caso Diario Deportes ↗
              </AccentButton>
            )}
          </FadeIn>

          <FadeIn>
            <CaseVideo />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
