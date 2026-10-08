import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Dónde NO mostrar el botón flotante: ya estás en la cotización/contacto.
const HIDE_ON = ['#cotizacion', '#contacto'];

/**
 * Botón flotante "Cotiza tu proyecto": mantiene la acción principal a un toque
 * mientras se recorre la página. Aparece al pasar el hero y se esconde cuando
 * ya estás frente a la cotización o el contacto (donde sería redundante).
 */
export default function FloatingQuoteCTA() {
  const reduceMotion = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const targets = HIDE_ON.map((s) => document.querySelector(s)).filter(
      Boolean,
    ) as Element[];
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setHidden(seen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const visible = pastHero && !hidden;

  return (
    // Contenedor a todo el ancho que centra el botón: así framer-motion puede
    // animar el transform del botón sin pisar el centrado.
    <div className="fixed bottom-5 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
      <AnimatePresence>
        {visible && (
          <motion.a
            href="#cotizar"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            // Aro claro: se lee igual sobre el azul de Proyectos y sobre el
            // papel del resto de la página.
            className="pointer-events-auto mr-14 sm:mr-0 rounded-full bg-klein text-paper-pure ring-2 ring-paper-pure font-medium text-sm px-6 sm:px-7 py-3.5 shadow-[0_10px_30px_rgba(20,30,92,0.35)] hover:bg-klein-mid transition-colors active:scale-[0.97] whitespace-nowrap"
          >
            Cotiza tu proyecto
            <span aria-hidden className="ml-2">
              →
            </span>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
