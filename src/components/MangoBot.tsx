import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AVATAR = `${import.meta.env.BASE_URL}mango-bot.webp`;

// Dónde NO mostrarlo: ya estás en la cotización/contacto.
const HIDE_ON = ['#cotizacion', '#contacto'];

// Lo que dice MangOut, según la parte de la página en la que estás. Cada
// mensaje llega con unos puntitos de "escribiendo…" para que se sienta vivo,
// pero no es un chat: el botón lleva directo a la cotización.
const DEFAULT_MESSAGES = [
  '¡Quihubo! Soy MangOut 🥭',
  '¿Cotizamos tu proyecto?',
  'Cuéntame qué necesitas. Respondemos en 24 a 48 horas.',
];

const SECTION_MESSAGES: Record<string, string[]> = {
  servicios: [
    '¿Cuál de estos servicios te interesa?',
    'Dime cuál y te armamos la cotización.',
  ],
  proyectos: [
    '¿Te gustó lo que ves?',
    'El próximo proyecto de esta lista puede ser el tuyo 😉',
  ],
  cotizacion: [],
  metodo: [
    'Cuatro pasos y tu proyecto está andando.',
    '¿Arrancamos con el primero?',
  ],
  resenas: ['¿Ya te convenció? Cotiza sin compromiso.'],
  nosotros: [
    'Detrás de Out hay una persona real, no un call center.',
    'Cuéntale tu idea.',
  ],
};

const SHOW_MS = 4600;
const TYPING_MS = 900;
const DISMISS_KEY = 'out-mango-dismissed';

function readDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * "MangOut", el asistente flotante de cotización. Un mango de la ilustración de
 * marca como avatar, un globo que va hablando y un toque para empezar la
 * cotización. Aparece a los pocos segundos (o al empezar a bajar) y se
 * esconde cuando ya estás frente a la cotización o el contacto.
 */
export default function MangoBot() {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bubbleOff, setBubbleOff] = useState(readDismissed);
  const [index, setIndex] = useState(0);
  const [topic, setTopic] = useState('default');
  const [typing, setTyping] = useState(true);

  // Aparece a los 3 s o en cuanto se empieza a hacer scroll.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 3000);
    const onScroll = () => {
      if (window.scrollY > 200) setReady(true);
      else setTopic('default');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const targets = HIDE_ON.map((s) => document.querySelector(s)).filter(
      Boolean,
    ) as Element[];
    const seen = new Set<Element>();
    // Sólo cuenta cuando la sección ocupa el centro de la pantalla, no con
    // que asome por un borde.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target);
          else seen.delete(e.target);
        }
        setHidden(seen.size > 0);
      },
      { rootMargin: '-35% 0px -35% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Qué parte de la página tienes en el centro de la pantalla: MangOut
  // comenta según donde estés.
  useEffect(() => {
    const ids = Object.keys(SECTION_MESSAGES).filter(
      (k) => SECTION_MESSAGES[k].length > 0,
    );
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTopic(e.target.id);
            setIndex(0);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const messages = SECTION_MESSAGES[topic]?.length
    ? SECTION_MESSAGES[topic]
    : DEFAULT_MESSAGES;

  // Ciclo: puntitos → mensaje → puntitos → siguiente mensaje (en bucle).
  const talking = ready && !hidden && !bubbleOff;
  useEffect(() => {
    if (!talking) return;
    setTyping(true);
    const showTimer = window.setTimeout(() => setTyping(false), TYPING_MS);
    const nextTimer = window.setTimeout(
      () => setIndex((i) => (i + 1) % messages.length),
      TYPING_MS + SHOW_MS,
    );
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(nextTimer);
    };
  }, [talking, index, topic, messages.length]);

  const dismissBubble = () => {
    setBubbleOff(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* sin storage: simplemente no se recuerda */
    }
  };

  const visible = ready && !hidden;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end gap-3 pointer-events-none max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {visible && !bubbleOff && (
          <motion.div
            key="bubble"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="pointer-events-auto relative mb-2 max-w-[210px] sm:max-w-[250px] rounded-2xl rounded-br-sm bg-paper-pure text-klein-deep shadow-[0_10px_30px_rgba(20,30,92,0.25)] ring-1 ring-klein-deep/10"
          >
            <a
              href="#cotizar"
              className="block pl-4 pr-9 py-3 text-sm leading-snug min-h-[44px]"
            >
              <span className="block text-xs font-bold tracking-[-0.01em] text-klein mb-0.5">
                MangOut
              </span>
              <AnimatePresence mode="wait" initial={false}>
                {typing ? (
                  <motion.span
                    key="typing"
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1 h-5"
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-klein"
                        animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: d * 0.12,
                        }}
                      />
                    ))}
                  </motion.span>
                ) : (
                  <motion.span
                    key={`msg-${topic}-${index}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block font-medium"
                  >
                    {messages[index % messages.length]}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
            <button
              type="button"
              onClick={dismissBubble}
              aria-label="Ocultar mensaje"
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full text-klein-deep/60 hover:text-klein hover:bg-klein-deep/5 flex items-center justify-center text-lg leading-none"
            >
              ×
            </button>
          </motion.div>
        )}

        {visible && (
          <motion.a
            key="avatar"
            href="#cotizar"
            aria-label="MangOut: cotiza tu proyecto"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: -6 }}
            whileTap={{ scale: 0.94 }}
            className="pointer-events-auto relative shrink-0 w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-full bg-paper-pure ring-[3px] ring-paper-pure shadow-[0_10px_30px_rgba(20,30,92,0.4)]"
          >
            <motion.img
              src={AVATAR}
              alt=""
              width={240}
              height={240}
              draggable={false}
              className="w-full h-full rounded-full object-cover select-none"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -14, 0, -6, 0],
                      scaleY: [1, 1.06, 0.92, 1.02, 1],
                      rotate: [0, -8, 6, -3, 0],
                    }
              }
              transition={{
                duration: 1.1,
                repeat: Infinity,
                repeatDelay: 4.5,
                ease: 'easeOut',
              }}
            />
            {/* Punto "en línea" */}
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2FBF71] ring-2 ring-paper-pure"
            />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
