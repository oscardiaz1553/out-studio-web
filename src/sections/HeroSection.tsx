import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BrandName } from '../components/Brand';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import HeroVideo from '../components/HeroVideo';

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
      className="fixed inset-0 z-50 bg-black flex flex-col px-6 pt-6 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
    >
      <div className="flex items-center justify-between">
        <span className="text-white text-xl">
          <BrandName />
        </span>
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="relative w-10 h-10 flex items-center justify-center"
        >
          <span className="absolute block w-6 h-0.5 bg-white rotate-45" />
          <span className="absolute block w-6 h-0.5 bg-white -rotate-45" />
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
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.05 + i * 0.05,
              duration: 0.3,
              ease: EASE_OUT,
            }}
            className="text-white font-black uppercase tracking-tight text-5xl leading-none"
          >
            {link.label}
          </motion.a>
        ))}
      </nav>

      <AccentButton href="#contacto" onClick={onClose} className="self-start">
        Hablemos
      </AccentButton>
    </motion.div>
  );
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Depth on exit: the video drifts slower than the scroll (with a subtle
  // zoom) while the content slides away faster and fades.
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.16]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={reduceMotion ? undefined : { y: videoY, scale: videoScale }}
      >
        <HeroVideo className="w-full h-full object-cover" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 45%, #000000 100%)',
          }}
        />
      </motion.div>

      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-10 px-6 md:px-10 pt-6 md:pt-8"
      >
        <div className="flex items-center justify-between gap-4">
          <a href="#" className="text-white text-xl md:text-2xl">
            <BrandName />
          </a>
          <ul className="hidden sm:flex items-center gap-6 md:gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-white font-medium text-sm md:text-base hover:opacity-70 transition-opacity duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block">
              <AccentButton href="#contacto">Hablemos</AccentButton>
            </span>
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="sm:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10"
            >
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
            </button>
          </div>
        </div>
      </FadeIn>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>

      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6"
        style={
          reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }
        }
      >
        <FadeIn delay={0.15} y={40}>
          <h1 className="text-white leading-none tracking-tight text-[26vw] sm:text-[22vw] md:text-[19vw]">
            <BrandName />
          </h1>
        </FadeIn>

        <FadeIn delay={0.35} y={20}>
          <p
            className="text-white font-medium mt-6 sm:mt-8"
            style={{ fontSize: 'clamp(1.15rem, 2.6vw, 2rem)' }}
          >
            Presencia digital que vende.
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <p className="text-white/60 font-semibold uppercase tracking-[0.35em] text-xs sm:text-sm mt-4 sm:mt-5">
            Fuera del molde
          </p>
        </FadeIn>

        <FadeIn delay={0.65} y={20} className="mt-10 sm:mt-12">
          <AccentButton href="#contacto" className="sm:px-12 sm:py-4">
            Hablemos
          </AccentButton>
        </FadeIn>
      </motion.div>
    </section>
  );
}
