import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MangoChat, useChatState } from './MangoChat';

const AVATAR = `${import.meta.env.BASE_URL}mono-asoma.webp`;

// Dónde NO mostrarlo: ya estás en la cotización/contacto.
const HIDE_ON = ['#cotizacion', '#contacto'];

// Un solo mensaje, siempre el mismo.
const MESSAGE = 'Te ayudo con tu cotización en cualquier momento.';
// Clave nueva: una anterior (v1) quedó marcada por el viejo cierre automático.
const DISMISS_KEY = 'out-mango-dismissed-v2';

function readDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * "Mango", el asistente flotante. El mono sobre azul como avatar y
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

  // En la portada ya hay un mono y un botón de cotizar: Mango aparece al
  // dejar atrás la mitad de la portada, o a los 12 s si la persona se queda.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 12000);
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) setReady(true);
    };
    onScroll();
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
      <div className="fixed bottom-0 right-0 z-40 flex items-end pointer-events-none max-w-[100vw]">
        <AnimatePresence>
          {visible && !bubbleOff && (
            <motion.div
              key="bubble"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, x: 12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'bottom right' }}
              className="pointer-events-auto relative z-10 mb-16 sm:mb-24 -mr-10 sm:-mr-12 max-w-[190px] sm:max-w-[250px] rounded-2xl rounded-br-sm bg-paper-pure text-klein-deep shadow-[0_10px_30px_rgba(20,30,92,0.25)] ring-1 ring-klein-deep/10"
            >
              <button
                type="button"
                onClick={openChat}
                className="block w-full text-left pl-4 pr-9 py-3 text-sm leading-snug min-h-[44px]"
              >
                <span className="block text-xs font-bold tracking-[-0.01em] text-klein mb-0.5">
                  Mango
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
              aria-label="Mango: abrir el chat de cotización"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              whileHover={reduceMotion ? undefined : { scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                transformOrigin: '100% 100%',
                // La ilustración termina en seco abajo: el cuerpo se desvanece
                // para que no se vea cortado sobre la barra del navegador.
                maskImage: 'linear-gradient(to bottom, #000 72%, transparent 98%)',
                WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, transparent 98%)',
              }}
              className="pointer-events-auto relative shrink-0 w-[190px] sm:w-[250px] -mr-2"
            >
              {/* El mono asoma desde la esquina, sin fondo: se agarra del
                  borde de la pantalla. */}
              <motion.img
                src={AVATAR}
                alt=""
                width={1200}
                height={900}
                draggable={false}
                className="w-full h-auto select-none"
                style={{
                  transformOrigin: '100% 100%',
                }}
                animate={reduceMotion ? undefined : { rotate: [0, -3, 2, 0], y: [0, -3, 0, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: 'easeOut',
                }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {chat.open && <MangoChat chat={chat} onClose={() => chat.setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
