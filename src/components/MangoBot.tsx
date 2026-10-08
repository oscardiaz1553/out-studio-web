import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MangOutChat, useChatState } from './MangOutChat';

const AVATAR = `${import.meta.env.BASE_URL}mango-bot-3d.webp`;

// Dónde NO mostrarlo: ya estás en la cotización/contacto.
const HIDE_ON = ['#cotizacion', '#contacto'];

// Un solo mensaje, siempre el mismo.
const MESSAGE = 'Te ayudo con tu cotización en cualquier momento.';
const DISMISS_KEY = 'out-mango-dismissed';

function readDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * "MangOut", el asistente flotante. Un mango partido sobre azul como avatar y
 * un globo con un solo mensaje. Al tocarlo se abre un chat flotante que hace
 * las mismas preguntas de la encuesta, una a una. La encuesta de pantalla
 * completa (sección Cotización) sigue siendo la otra vía.
 */
export default function MangoBot() {
  const reduceMotion = useReducedMotion();
  const chat = useChatState();
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bubbleOff, setBubbleOff] = useState(readDismissed);

  // Aparece a los 3 s o en cuanto se empieza a hacer scroll.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 3000);
    const onScroll = () => {
      if (window.scrollY > 200) setReady(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Se esconde sólo cuando la cotización o el contacto ocupan el centro de la
  // pantalla, no con que asomen por un borde.
  useEffect(() => {
    const targets = HIDE_ON.map((s) => document.querySelector(s)).filter(
      Boolean,
    ) as Element[];
    const seen = new Set<Element>();
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

  // Si alguien abre la encuesta de pantalla completa (#cotizar), el chat
  // se guarda.
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#cotizar') chat.setOpen(false);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissBubble = () => {
    setBubbleOff(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* sin storage: simplemente no se recuerda */
    }
  };

  const openChat = () => chat.setOpen(true);
  const visible = ready && !hidden && !chat.open;

  return (
    <>
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
              <button
                type="button"
                onClick={openChat}
                className="block w-full text-left pl-4 pr-9 py-3 text-sm leading-snug min-h-[44px]"
              >
                <span className="block text-xs font-bold tracking-[-0.01em] text-klein mb-0.5">
                  MangOut
                </span>
                <span className="block font-medium">{MESSAGE}</span>
              </button>
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
            <motion.button
              key="avatar"
              type="button"
              onClick={openChat}
              aria-label="MangOut: abrir el chat de cotización"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: -6 }}
              whileTap={{ scale: 0.94 }}
              className="pointer-events-auto relative shrink-0 w-[56px] h-[76px] sm:w-[64px] sm:h-[88px] rounded-2xl bg-klein ring-[3px] ring-paper-pure shadow-[0_10px_30px_rgba(20,30,92,0.4)]"
            >
              <span className="absolute inset-0 rounded-[13px] overflow-hidden flex items-center justify-center">
                <motion.img
                  src={AVATAR}
                  alt=""
                  width={240}
                  height={240}
                  draggable={false}
                  className="h-[112%] w-auto max-w-none select-none"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: [0, -6, 0, -2, 0],
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
              </span>
              {/* Punto "en línea" */}
              <span
                aria-hidden
                className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2FBF71] ring-2 ring-paper-pure"
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {chat.open && <MangOutChat chat={chat} onClose={() => chat.setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
