import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BrandName } from '../components/Brand';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import ConceptGrid from '../components/ConceptGrid';
import BotanicalWord from '../components/BotanicalWord';

const NAV_LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function MobileMenu({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-klein flex flex-col px-6 pt-6 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
    >
      <div className="flex items-center justify-between">
        <span className="text-paper-pure text-xl">
          <BrandName onBlue />
        </span>
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="relative w-10 h-10 flex items-center justify-center"
        >
          <span className="absolute block w-6 h-0.5 bg-paper-pure rotate-45" />
          <span className="absolute block w-6 h-0.5 bg-paper-pure -rotate-45" />
        </button>
      </div>

      <nav
        aria-label="Navegación móvil"
        className="flex-1 flex flex-col justify-center gap-6"
      >
        {NAV_LINKS.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            onClick={onClose}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05, duration: 0.3, ease: EASE_OUT }}
            className="font-display font-extrabold tracking-[-0.03em] text-paper-pure text-5xl leading-none"
          >
            {link.label}
          </motion.a>
        ))}
      </nav>

      <AccentButton href="#contacto" onBlue onClick={onClose} className="self-start">
        Hablemos
      </AccentButton>
    </motion.div>
  );
}

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <section className="relative min-h-[100dvh] flex flex-col bg-paper overflow-hidden">
      {/* Navegación */}
      <FadeIn
        as="nav"
        delay={0}
        y={-16}
        className="relative z-20 px-6 md:px-10 pt-6 md:pt-8"
      >
        <div className="flex items-center justify-between gap-4">
          <a href="#" className="text-klein text-xl md:text-2xl">
            <BrandName />
          </a>
          <ul className="hidden sm:flex items-center gap-6 md:gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-klein-deep font-medium text-sm md:text-base hover:text-klein transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="sm:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10"
          >
            <span className="block w-6 h-0.5 bg-klein" />
            <span className="block w-6 h-0.5 bg-klein" />
          </button>
        </div>
      </FadeIn>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>

      {/* Portada editorial: texto a la izquierda, estatua a sangre a la derecha */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] items-stretch">
        <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 py-14 md:py-0 order-2 md:order-1">
          <FadeIn delay={0.1} y={16}>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-carne-tinta">
              Estudio digital · Bogotá · São Paulo
            </span>
          </FadeIn>

          <FadeIn delay={0.2} y={24}>
            <BotanicalWord className="mt-5" />
          </FadeIn>

          <FadeIn delay={0.34} y={18}>
            <p
              className="font-display font-semibold text-klein-mid tracking-[-0.03em] mt-6"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.6rem)' }}
            >
              Fuera de lo usual.
            </p>
          </FadeIn>

          <FadeIn delay={0.46} y={16}>
            <p className="text-ink-2 leading-relaxed max-w-[42ch] mt-6 text-base sm:text-lg">
              Casi todo obedece. Una cosa se sale. Diseñamos el sistema, no la
              pieza suelta, y sabemos exactamente dónde romperlo.
            </p>
          </FadeIn>

          <FadeIn delay={0.58} y={16} className="mt-9">
            <AccentButton href="#contacto" className="sm:px-12 sm:py-4">
              Hablemos
            </AccentButton>
          </FadeIn>
        </div>

        {/* La estatua bleed: toca los bordes derecho, superior e inferior */}
        <FadeIn
          delay={0.3}
          y={0}
          duration={1}
          className="relative order-1 md:order-2 h-[42vh] md:h-[86vh] overflow-hidden"
        >
          <ConceptGrid className="absolute inset-0" />
          <span className="absolute left-4 bottom-4 font-mono text-[10px] uppercase tracking-[0.14em] text-carne z-10 pointer-events-none">
            Fig. 01 — Casi todo obedece. Una cosa se sale.
          </span>
        </FadeIn>
      </div>
    </section>
  );
}
