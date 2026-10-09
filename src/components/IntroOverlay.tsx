import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const SEEN_KEY = 'out-intro-seen';
// 1 = ritmo original (100 BPM, ~9 s). 1.5 la deja en unos 6 s sin perder
// los golpes.
const SPEED = 1.5;
const BASE = import.meta.env.BASE_URL;
const SRC = `${BASE}intro/index.html?nowords=1&speed=${SPEED}`;
// En el celular NO se corre la animación en vivo (capas gigantes que hacen
// que el navegador del teléfono se quede sin memoria y recargue la página):
// se reproduce el video vertical, liviano.
const VIDEO = `${BASE}intro-movil.mp4`;
const POSTER = `${BASE}intro-movil-poster.webp`;

export function isPhone(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches;
}

/** La apertura sólo se ve una vez por visita, al llegar a la portada desde
 *  arriba, y nunca con "reducir movimiento" ni con ahorro de datos. */
export function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (conn?.saveData) return false;
    if (window.location.hash) return false;
    if (window.scrollY > 40) return false;
    return sessionStorage.getItem(SEEN_KEY) !== '1';
  } catch {
    return false;
  }
}

/**
 * Apertura de marca: la animación del logo "Out" (la O se parte en corchetes,
 * cambia de símbolo y vuelve) en pantalla completa, con "Omitir" siempre a la
 * vista. Corre en un iframe propio (public/intro) para que su línea de tiempo
 * no se mezcle con el resto de la página. Al terminar, deja ver la portada.
 */
export default function IntroOverlay({
  onFinish,
  onGone,
}: {
  /** Empieza a descubrirse la portada (el overlay se está desvaneciendo). */
  onFinish: () => void;
  /** El overlay ya salió del todo. */
  onGone: () => void;
}) {
  const [open, setOpen] = useState(true);
  const finished = useRef(false);
  const phone = useRef(isPhone()).current;
  const videoRef = useRef<HTMLVideoElement>(null);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* sin storage: simplemente se vuelve a ver */
    }
    setOpen(false);
    onFinish();
  };

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';

    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.source !== 'out-intro') return;
      if (e.data.type === 'ready') window.clearTimeout(readyTimer);
      if (e.data.type === 'done') finish();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    // Si la animación no arranca (red lenta, bloqueada), no se queda la pantalla.
    // En el celular el video tiene 4 s para empezar a reproducirse.
    const readyTimer = window.setTimeout(finish, phone ? 4000 : 5000);
    const hardStop = window.setTimeout(finish, 15000);
    const v = videoRef.current;
    const onPlaying = () => window.clearTimeout(readyTimer);
    v?.addEventListener('playing', onPlaying);

    window.addEventListener('message', onMsg);
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev;
      window.clearTimeout(readyTimer);
      window.clearTimeout(hardStop);
      v?.removeEventListener('playing', onPlaying);
      window.removeEventListener('message', onMsg);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence onExitComplete={onGone}>
      {open && (
        <motion.div
          key="intro"
          role="presentation"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[2000] bg-klein"
        >
          {phone ? (
            <video
              ref={videoRef}
              src={VIDEO}
              poster={POSTER}
              autoPlay
              muted
              playsInline
              preload="auto"
              aria-hidden
              onEnded={() => window.setTimeout(finish, 500)}
              onError={finish}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={SRC}
              title="Animación de apertura de Out"
              aria-hidden
              tabIndex={-1}
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
          <button
            type="button"
            onClick={finish}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-full bg-paper-pure/95 text-klein-deep text-sm font-medium px-5 py-2.5 shadow-[0_8px_24px_rgba(20,20,60,0.25)] hover:bg-paper-pure active:scale-[0.97] transition"
          >
            Omitir
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
