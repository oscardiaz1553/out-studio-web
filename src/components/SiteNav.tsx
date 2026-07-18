import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AccentButton from './AccentButton';
import FadeIn from './FadeIn';
import { BrandName } from './Brand';

// Navbar compartido por todas las páginas (home, contacto, proyectos).
// Los anclas apuntan al home (/#servicios…) para que funcionen desde
// cualquier página; Proyectos y Contacto abren sus propias páginas.
const HOME = import.meta.env.BASE_URL;

type NavLink = { label: string; href: string };

const NAV_LINKS: NavLink[] = [
  { label: 'Servicios', href: `${HOME}#servicios` },
  { label: 'Proyectos', href: `${HOME}proyectos.html` },
  { label: 'Nosotros', href: `${HOME}#nosotros` },
  { label: 'Contacto', href: `${HOME}contacto.html` },
];

const CONTACT_URL = `${HOME}contacto.html`;
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
        <a href={HOME} onClick={onClose} className="text-paper-pure text-xl">
          <BrandName onBlue />
        </a>
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

      <AccentButton href={CONTACT_URL} onBlue onClick={onClose} className="self-start">
        Hablemos
      </AccentButton>
    </motion.div>
  );
}

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <FadeIn
        as="nav"
        delay={0}
        y={-16}
        className="relative z-20 px-6 md:px-10 pt-6 md:pt-8"
      >
        <div className="flex items-center justify-between gap-4">
          <a href={HOME} className="text-klein text-xl md:text-2xl">
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
    </>
  );
}
