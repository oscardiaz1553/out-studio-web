import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AccentButton from './AccentButton';
import LogoOut from './LogoOut';

// Navbar compartido por todas las páginas (home, contacto, proyectos).
// Es sticky: se queda arriba al hacer scroll y gana un fondo translúcido
// una vez que el usuario se desplaza. Los anclas apuntan al home para
// funcionar desde cualquier página; Proyectos y Contacto abren sus páginas.
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
        <a href={HOME} onClick={onClose} className="text-paper-pure">
          <LogoOut onBlue className="h-7 w-auto" />
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 px-6 md:px-10 py-4 md:py-5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled
            ? 'bg-paper/85 backdrop-blur-md border-b border-klein-deep/10 shadow-[0_1px_24px_rgba(20,20,60,0.06)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <a href={HOME} className="text-klein">
            <LogoOut className="h-6 md:h-7 w-auto" />
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
      </header>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
