import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useLayoutEffect, useState } from 'react';
import AccentButton from './AccentButton';
import LogoOut from './LogoOut';
import Magnetic from './Magnetic';

// Navbar compartido por todas las páginas (home, contacto, proyectos).
// Estilo "Huge": flota sobre el contenido (fixed, no sticky) en tres
// columnas — logo suelto a la izquierda, enlaces centrados sin cápsula
// propia, y un CTA a la derecha. El logo y los enlaces cambian de klein a
// paper-pure según lo que haya realmente detrás del nav en cada momento
// (no solo "es el home"): cada sección marca su fondo con
// data-nav-bg="dark" (Hero, la secuencia, Proyectos, las láminas
// editoriales, el marquee, el footer) y un IntersectionObserver detecta
// cuál está cruzando la franja del nav. Al hacer scroll el nav toma un
// fondo propio (papel con desenfoque) y pasa siempre a texto oscuro: así
// el logo y los enlaces se leen sobre cualquier imagen o color, también
// sobre las láminas claras que el detector marcaba como oscuras.
const HOME = import.meta.env.BASE_URL;

type NavLink = { label: string; href: string };

const NAV_LINKS: NavLink[] = [
  { label: 'Servicios', href: `${HOME}#servicios` },
  { label: 'Proyectos', href: `${HOME}proyectos.html` },
  { label: 'Nosotros', href: `${HOME}#nosotros` },
  { label: 'Contacto', href: `${HOME}contacto.html` },
];

const QUOTE_URL = `${HOME}#cotizar`;
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

      <AccentButton href={QUOTE_URL} onBlue onClick={onClose} className="self-start">
        Cotiza tu proyecto
      </AccentButton>
    </motion.div>
  );
}

/** Enlaces centrados, sin cápsula propia: un halo viaja detrás del que
 *  tiene el mouse encima, en el color que corresponda al fondo actual. */
function NavPill({ onDark }: { onDark: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ul
      onMouseLeave={() => setHovered(null)}
      className="hidden md:flex items-center gap-0.5"
    >
      {NAV_LINKS.map((link) => {
        const active = hovered === link.label;
        return (
          <li key={link.label} className="relative">
            {active && (
              <motion.span
                layoutId="nav-hover-pill"
                className={`absolute inset-0 rounded-full ${
                  onDark ? 'bg-paper-pure/15 backdrop-blur-sm' : 'bg-klein'
                }`}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <a
              href={link.href}
              onMouseEnter={() => setHovered(link.label)}
              className={`relative z-10 block px-4 lg:px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                onDark
                  ? 'text-paper-pure'
                  : active
                    ? 'text-paper-pure'
                    : 'text-klein-deep'
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

const SCROLLED_AT = 24;

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkBehind, setDarkBehind] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  // Con fondo propio (scrolled) el nav es siempre claro: texto oscuro.
  const onDark = darkBehind && !scrolled;

  useEffect(() => {
    let raf = 0;
    const update = () => setScrolled(window.scrollY > SCROLLED_AT);
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Detecta qué hay realmente detrás del nav: cualquier sección marcada
  // data-nav-bg="dark" que cruce la altura del header. Se mide por posición
  // (y se vuelve a buscar la sección cada vez) para que siga funcionando si
  // una sección se vuelve a montar, como la portada al terminar la apertura.
  useLayoutEffect(() => {
    const NAV_Y = 60;
    let raf = 0;
    const measure = () => {
      const dark = Array.from(
        document.querySelectorAll<HTMLElement>('[data-nav-bg="dark"]'),
      ).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= NAV_Y && r.bottom > NAV_Y;
      });
      setDarkBehind(dark);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40">
        {/* Arriba del todo: velo de desenfoque degradado que funde lo que pasa
            por debajo (fuerte arriba, se disuelve rápido). */}
        <div
          aria-hidden
          className={`absolute inset-x-0 top-0 h-14 sm:h-16 md:h-20 backdrop-blur pointer-events-none transition-opacity duration-300 ${
            scrolled ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, black 20%, transparent 55%)',
            maskImage:
              'linear-gradient(to bottom, black 0%, black 20%, transparent 55%)',
          }}
        />
        {/* Al hacer scroll: barra con fondo propio, para que el logo y los
            enlaces se vean sobre cualquier cosa. */}
        <div
          aria-hidden
          className={`absolute inset-0 bg-paper/90 backdrop-blur-md border-b border-klein-deep/10 shadow-[0_6px_24px_rgba(20,20,60,0.06)] pointer-events-none transition-opacity duration-300 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`relative px-4 sm:px-6 md:px-10 transition-[padding] duration-300 ${
            scrolled ? 'py-3' : 'pt-4 md:pt-6'
          }`}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <a
              href={HOME}
              className={`justify-self-start transition-colors duration-300 ${onDark ? 'text-paper-pure' : 'text-klein'}`}
            >
              <LogoOut className="h-8 md:h-9 w-auto" />
            </a>

            <div className="justify-self-center">
              <NavPill onDark={onDark} />
            </div>

            <div className="justify-self-end flex items-center gap-3">
              <div className="hidden sm:block">
                <Magnetic>
                  <AccentButton href={QUOTE_URL} className="px-6 py-2.5 text-sm">
                    Cotiza tu proyecto
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
