import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AccentButton from './AccentButton';
import LogoOut from './LogoOut';
import Magnetic from './Magnetic';

// Navbar compartido por todas las páginas (home, contacto, proyectos).
// Estilo "Huge": flota sobre el contenido (fixed, no sticky) en tres
// columnas — logo suelto a la izquierda, una píldora de enlaces centrada
// con su propio fondo opaco, y un CTA a la derecha — así que siempre se lee
// bien sin importar qué haya detrás. El logo es lo único sin fondo propio:
// cambia de blanco a azul cuando el hero oscuro del home queda atrás.
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
          <LogoOut onBlue className="h-9 w-auto" />
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

/** Píldora central de enlaces: un halo azul viaja entre ellos al hacer hover. */
function NavPill() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ul
      onMouseLeave={() => setHovered(null)}
      className="hidden md:flex items-center gap-0.5 rounded-full bg-paper-pure/95 backdrop-blur-md border border-klein-deep/10 shadow-[0_8px_30px_rgba(20,20,60,0.14)] p-1.5"
    >
      {NAV_LINKS.map((link) => {
        const active = hovered === link.label;
        return (
          <li key={link.label} className="relative">
            {active && (
              <motion.span
                layoutId="nav-hover-pill"
                className="absolute inset-0 rounded-full bg-klein"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <a
              href={link.href}
              onMouseEnter={() => setHovered(link.label)}
              className={`relative z-10 block px-4 lg:px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                active ? 'text-paper-pure' : 'text-klein-deep'
              }`}
            >
              {link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

interface SiteNavProps {
  /** true cuando la página arranca con un hero oscuro (home): el logo nace
   *  en paper-pure y pasa a klein una vez que el scroll deja atrás el hero. */
  heroDark?: boolean;
}

export default function SiteNav({ heroDark = false }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(!heroDark);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!heroDark) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.82);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroDark]);

  const logoLight = heroDark && !pastHero;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40">
        {/* Velo de desenfoque degradado: funde lo que pasa por debajo del
            nav (fuerte arriba, se disuelve hacia abajo), en vez de una
            barra sólida con borde duro. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24 sm:h-28 md:h-36 backdrop-blur-md pointer-events-none"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
          }}
        />

        <div className="relative px-4 sm:px-6 md:px-10 pt-4 md:pt-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <a
              href={HOME}
              className={`justify-self-start transition-colors duration-300 ${logoLight ? 'text-paper-pure' : 'text-klein'}`}
            >
              <LogoOut className="h-8 md:h-9 w-auto" />
            </a>

            <div className="justify-self-center">
              <NavPill />
            </div>

            <div className="justify-self-end flex items-center gap-3">
              <div className="hidden sm:block">
                <Magnetic>
                  <AccentButton href={CONTACT_URL} className="px-6 py-2.5 text-sm">
                    Hablemos
                  </AccentButton>
                </Magnetic>
              </div>
              <button
                type="button"
                aria-label="Abrir menú"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                className="md:hidden flex flex-col items-center justify-center gap-1.5 w-11 h-11 rounded-full bg-paper-pure shadow-[0_4px_18px_rgba(20,20,60,0.14)]"
              >
                <span className="block w-5 h-0.5 bg-klein" />
                <span className="block w-5 h-0.5 bg-klein" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
