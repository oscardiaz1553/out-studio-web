import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import AccentButton from '../components/AccentButton';
import { FrameKind, Sym } from '../components/TitleFrame';
import { AZULEJO } from '../data/botanica';
import ScrollToTop from '../components/ScrollToTop';
import SiteNav from '../components/SiteNav';
import data from '../data/services.json';

export type ServiceData = (typeof data.pages)[number];

const HOME = import.meta.env.BASE_URL;
export const servicePath = (slug: string) => `${HOME}servicios/${slug}/`;

const STEPS = [
  { verb: 'Escuchamos', text: 'Entendemos tu negocio y lo que tiene que lograr tu proyecto. Recibes una propuesta clara, con alcance y tiempos.' },
  { verb: 'Construimos', text: 'Diseñamos y desarrollamos con código propio, compartiendo avances reales que puedes ver y aprobar.' },
  { verb: 'Lanzamos', text: 'Probamos todo antes de salir: velocidad, SEO técnico, pagos y formularios funcionando.' },
  { verb: 'Seguimos', text: 'No desaparecemos después del lanzamiento: soporte, ajustes y mejoras continuas.' },
];

/** Ruta de navegación cuyo último paso es un selector: desde una página de
 *  servicio se salta directo a cualquier otro servicio. */
function ServiceSwitcher({ current, dark }: { current: ServiceData; dark: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-colors ${
          dark ? 'bg-paper-pure/15 hover:bg-paper-pure/25 text-paper-pure' : 'bg-klein-deep/10 hover:bg-klein-deep/15 text-klein-deep'
        }`}
      >
        <span aria-current="page">{current.nav}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          aria-hidden
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="absolute left-0 top-full mt-2 z-30 min-w-[230px] rounded-2xl bg-paper-pure text-klein-deep shadow-[0_18px_50px_rgba(10,14,50,0.35)] ring-1 ring-klein-deep/10 p-2">
          {data.pages.map((p) => (
            <li key={p.slug}>
              <a
                href={servicePath(p.slug)}
                aria-current={p.slug === current.slug ? 'page' : undefined}
                className={`block rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  p.slug === current.slug
                    ? 'bg-klein text-paper-pure font-medium'
                    : 'hover:bg-klein-deep/5 text-klein-deep'
                }`}
              >
                {p.nav}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// El diseño de cada servicio sale de su lámina del hover de la portada: el
// mismo color de fondo, el mismo par de símbolos y el mismo personaje, pero
// llevados a la página completa (no la lámina pegada tal cual).
type Theme = {
  /** Fondo de la cabecera y del cierre. */
  bg: string;
  dark: boolean;
  text: string;
  muted: string;
  /** Color del par de símbolos y de los acentos. */
  accent: string;
  kind: FrameKind;
  /** Imagen que sangra por el borde de la cabecera. */
  art: string;
  artClass: string;
  artRotate: number;
  /** Textura de azulejo de fondo. */
  tile?: boolean;
};

const IMG = {
  mango: `${HOME}mango-hero.webp`,
  monoCara: `${HOME}mono-avatar.webp`,
  monoAsoma: `${HOME}mono-asoma.webp`,
  monoLaptop: `${HOME}mono-laptop.webp`,
};

const THEMES: Record<string, Theme> = {
  shopify: {
    bg: '#F5E3B3', dark: false, text: '#1B2FCC', muted: 'rgba(20,30,92,0.78)', accent: '#1B2FCC',
    kind: 'curly', art: IMG.mango, artRotate: -10,
    artClass: 'right-[-14%] bottom-[-10%] w-[78vw] max-w-[360px] sm:right-[-6%] sm:bottom-[-14%] sm:max-w-none sm:w-[46vw] lg:w-[min(42vw,620px)]',
  },
  wordpress: {
    bg: '#1B2FCC', dark: true, text: '#FBF8F5', muted: 'rgba(251,248,245,0.88)', accent: '#F5E3B3',
    kind: 'square', art: IMG.monoCara, artRotate: 4,
    artClass: 'right-[6%] bottom-[-6%] w-[46vw] max-w-[220px] sm:right-[9%] sm:bottom-[-4%] sm:max-w-none sm:w-[22vw] lg:w-[min(20vw,300px)]',
  },
  landing: {
    bg: '#141E5C', dark: true, text: '#FBF8F5', muted: 'rgba(251,248,245,0.85)', accent: '#F5E3B3',
    kind: 'angle', art: IMG.monoAsoma, artRotate: 0,
    artClass: 'right-[-12px] bottom-[-24px] w-[78vw] max-w-[380px] sm:max-w-none sm:w-[52vw] lg:w-[min(46vw,700px)]',
  },
  branding: {
    bg: '#F3EDE7', dark: false, text: '#1B2FCC', muted: 'rgba(20,30,92,0.78)', accent: '#BC6039',
    kind: 'paren', art: IMG.mango, artRotate: 14,
    artClass: 'right-[-16%] bottom-[-12%] w-[66vw] max-w-[300px] sm:right-[-8%] sm:bottom-[-16%] sm:max-w-none sm:w-[36vw] lg:w-[min(32vw,480px)]',
  },
  apps: {
    bg: '#1B2FCC', dark: true, text: '#FBF8F5', muted: 'rgba(251,248,245,0.88)', accent: '#F5E3B3',
    kind: 'square', art: IMG.monoLaptop, artRotate: 0, tile: true,
    artClass: 'right-[-6%] bottom-[-3%] w-[86vw] max-w-[400px] sm:right-[-2%] sm:max-w-none sm:w-[50vw] lg:w-[min(44vw,660px)]',
  },
};

function HeroArt({ theme }: { theme: Theme }) {
  const reduceMotion = useReducedMotion();
  return (
    <>
      {theme.tile && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            backgroundImage: `url(${AZULEJO})`,
            backgroundSize: '320px',
            backgroundPosition: 'center',
            WebkitMaskImage: 'linear-gradient(to left, #000 30%, transparent 75%)',
            maskImage: 'linear-gradient(to left, #000 30%, transparent 75%)',
          }}
        />
      )}
      {/* El par de símbolos del servicio, enorme, de fondo. */}
      <motion.span
        aria-hidden
        className="absolute flex gap-[0.4em] pointer-events-none select-none right-[-10%] top-[8%] sm:right-[-2%] sm:top-[6%]"
        style={{
          color: theme.accent,
          opacity: theme.dark ? 0.22 : 0.16,
          fontSize: 'clamp(16rem, 44vw, 40rem)',
        }}
        animate={reduceMotion ? undefined : { rotate: [-3, 3, -3], y: [0, -14, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sym kind={theme.kind} />
        <Sym kind={theme.kind} flip />
      </motion.span>
      {/* El personaje (mango o mono), sangrando por el borde. */}
      <motion.img
        aria-hidden
        src={theme.art}
        alt=""
        className={`absolute z-[1] h-auto pointer-events-none select-none ${theme.artClass}`}
        style={{ filter: 'drop-shadow(0 30px 50px rgba(10,14,50,0.35))', rotate: theme.artRotate }}
        initial={reduceMotion ? false : { opacity: 0, x: 60 }}
        animate={reduceMotion ? undefined : { opacity: 1, x: 0, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.7 },
          x: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.9 },
        }}
      />
    </>
  );
}

/**
 * Página de servicio (una por servicio): contenido real y específico para
 * quien busca justo eso (p. ej. "tienda Shopify en Colombia"), con preguntas
 * frecuentes, enlaces a los demás servicios y un llamado a cotizar.
 */
export default function ServicePage({ page }: { page: ServiceData }) {
  const related = data.pages.filter((p) => page.related.includes(p.slug));
  const theme = THEMES[page.scene] ?? THEMES.apps;

  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />

      {/* Cabecera, con el diseño de la lámina del servicio */}
      <header
        {...(theme.dark ? { 'data-nav-bg': 'dark' } : {})}
        className="relative overflow-hidden px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 pb-[300px] sm:pb-28 lg:pb-32 lg:min-h-[86vh] flex items-center"
        style={{ background: theme.bg, color: theme.text }}
      >
        <HeroArt theme={theme} />
        <div className="relative z-[2] w-full max-w-[1200px] mx-auto">
          <div className="max-w-[640px] lg:max-w-[700px]">
            <nav
              aria-label="Ruta de navegación"
              className="text-sm mb-6 flex flex-wrap items-center"
              style={{ color: theme.muted }}
            >
              <a href={HOME} className="underline-offset-4 hover:underline">Inicio</a>
              <span aria-hidden className="mx-2">/</span>
              <a href={`${HOME}#servicios`} className="underline-offset-4 hover:underline">Servicios</a>
              <span aria-hidden className="mx-2">/</span>
              <ServiceSwitcher current={page} dark={theme.dark} />
            </nav>
            <h1
              className="font-display font-extrabold tracking-[-0.04em] leading-[1]"
              style={{ fontSize: 'clamp(2.2rem, 5.2vw, 4.4rem)' }}
            >
              {page.h1}
            </h1>
            <p className="mt-6 sm:mt-8 max-w-[56ch] text-lg sm:text-xl leading-relaxed" style={{ color: theme.muted }}>
              {page.lead}
            </p>
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <AccentButton href={`${HOME}#cotizar`} onBlue={theme.dark}>
                Cotiza tu proyecto
              </AccentButton>
              <a
                href={`${HOME}proyectos.html`}
                className="font-medium underline underline-offset-[6px] decoration-current/40"
              >
                Ver proyectos
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Qué incluye */}
      <section className="px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20 bg-paper-pure">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16">
          <div>
            <span
              aria-hidden
              className="flex gap-[0.35em] mb-4"
              style={{ color: theme.dark ? theme.bg : theme.accent, fontSize: '2.6rem' }}
            >
              <Sym kind={theme.kind} />
              <Sym kind={theme.kind} flip />
            </span>
            <h2 className="font-display font-semibold text-klein tracking-[-0.03em] leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}>
              {page.includesTitle}
            </h2>
          </div>
          <ul className="flex flex-col gap-3">
            {page.includes.map((item) => (
              <li key={item} className="flex gap-3 text-klein-deep leading-relaxed text-base sm:text-lg">
                <span aria-hidden className="mt-[0.7em] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: theme.dark ? theme.bg : theme.accent }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Por qué */}
      <section className="px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20 border-t border-klein-deep/15">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16">
          <h2 className="font-display font-semibold text-klein tracking-[-0.03em] leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}>
            {page.whyTitle}
          </h2>
          <div className="flex flex-col gap-5 text-ink-2 leading-relaxed text-base sm:text-lg">
            {page.why.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              <strong className="text-klein font-semibold">Para quién es:</strong> {page.forWho}
            </p>
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20 bg-paper-pure border-t border-klein-deep/15">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display font-semibold text-klein tracking-[-0.03em] leading-tight mb-8" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}>
            Cómo trabajamos
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <li key={s.verb} className="rounded-2xl border border-klein-deep/15 bg-paper p-6">
                <h3 className="font-display font-extrabold text-klein tracking-[-0.03em] text-2xl mb-2">{s.verb}.</h3>
                <p className="text-sm leading-relaxed text-ink-2">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20 border-t border-klein-deep/15">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-display font-semibold text-klein tracking-[-0.03em] leading-tight mb-8" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}>
            Preguntas frecuentes
          </h2>
          <div className="flex flex-col">
            {page.faq.map((f) => (
              <details key={f.q} className="group border-t border-klein-deep/15 last:border-b py-5">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-6 font-display font-semibold text-klein text-lg sm:text-xl tracking-[-0.01em]">
                  <h3 className="font-display font-semibold text-lg sm:text-xl">{f.q}</h3>
                  <span aria-hidden className="text-2xl leading-none text-carne-deep transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-ink-2 leading-relaxed max-w-[70ch]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Otros servicios */}
      <section className="px-6 md:px-10 lg:px-16 py-14 sm:py-16 bg-paper-pure border-t border-klein-deep/15">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display font-semibold text-klein tracking-[-0.03em] leading-tight mb-6" style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2rem)' }}>
            Otros servicios de Out Studio
          </h2>
          <ul className="flex flex-wrap gap-3">
            {related.map((r) => (
              <li key={r.slug}>
                <a
                  href={servicePath(r.slug)}
                  className="inline-block rounded-full border border-klein text-klein font-medium px-6 py-2.5 text-sm hover:bg-klein hover:text-paper-pure transition-colors"
                >
                  {r.nav}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Llamado final */}
      <section
        {...(theme.dark ? { 'data-nav-bg': 'dark' } : {})}
        className="relative overflow-hidden px-6 md:px-10 lg:px-16 py-16 sm:py-20"
        style={{ background: theme.bg, color: theme.text }}
      >
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <h2 className="font-display font-extrabold tracking-[-0.04em] leading-[1]" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
              Cuéntanos tu proyecto.
            </h2>
            <p className="mt-3 max-w-[50ch] opacity-85">
              Te enviamos una cotización a la medida en 6 a 24 horas.
            </p>
          </div>
          <AccentButton href={`${HOME}#cotizar`} onBlue={theme.dark}>
            Cotiza tu proyecto
          </AccentButton>
        </div>
      </section>

      <footer className="px-6 md:px-10 lg:px-16 py-10 border-t border-klein-deep/15 text-sm text-muted">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-4">
          <nav aria-label="Servicios" className="flex flex-wrap gap-x-5 gap-y-2">
            {data.pages.map((p) => (
              <a key={p.slug} href={servicePath(p.slug)} className="hover:text-klein">
                {p.nav}
              </a>
            ))}
            <a href={`${HOME}proyectos.html`} className="hover:text-klein">Proyectos</a>
            <a href={`${HOME}blog/`} className="hover:text-klein">Blog</a>
            <a href={`${HOME}contacto.html`} className="hover:text-klein">Contacto</a>
          </nav>
          <p>© 2026 Out Studio. Colombia.</p>
        </div>
      </footer>

      <ScrollToTop />
    </main>
  );
}
