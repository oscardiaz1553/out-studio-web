import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import AccentButton from '../components/AccentButton';
import { SCENES } from '../components/ServiceScenes';
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
function ServiceSwitcher({ current }: { current: ServiceData }) {
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
        className="inline-flex items-center gap-1.5 rounded-full bg-paper-pure/15 hover:bg-paper-pure/25 px-3 py-1 text-paper-pure font-medium transition-colors"
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

/** La lámina del servicio (la misma del hover de la portada), grande y con
 *  un vaivén suave. */
function SceneCard({ page }: { page: ServiceData }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      initial={reduceMotion ? false : { opacity: 0, y: 30, rotate: 0 }}
      animate={
        reduceMotion
          ? { rotate: page.tilt }
          : { opacity: 1, y: [0, -10, 0], rotate: page.tilt }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              opacity: { duration: 0.6 },
              rotate: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
            }
      }
      className="relative w-[min(70vw,250px)] sm:w-[280px] lg:w-[340px] aspect-[4/5] rounded-[28px] overflow-hidden ring-[6px] ring-paper-pure shadow-[0_30px_80px_rgba(10,14,50,0.45)] bg-paper-pure"
      style={{ containerType: 'inline-size' }}
    >
      {SCENES[page.scene]}
    </motion.div>
  );
}

/**
 * Página de servicio (una por servicio): contenido real y específico para
 * quien busca justo eso (p. ej. "tienda Shopify en Colombia"), con preguntas
 * frecuentes, enlaces a los demás servicios y un llamado a cotizar.
 */
export default function ServicePage({ page }: { page: ServiceData }) {
  const related = data.pages.filter((p) => page.related.includes(p.slug));

  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />

      {/* Cabecera */}
      <header
        data-nav-bg="dark"
        className="relative overflow-hidden bg-klein text-paper-pure px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 pb-16 sm:pb-24"
      >
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-12 lg:gap-10 items-center">
          <div>
          <nav aria-label="Ruta de navegación" className="text-sm text-paper-pure/75 mb-6 flex flex-wrap items-center">
            <a href={HOME} className="hover:text-paper-pure underline-offset-4 hover:underline">Inicio</a>
            <span aria-hidden className="mx-2">/</span>
            <a href={`${HOME}#servicios`} className="hover:text-paper-pure underline-offset-4 hover:underline">Servicios</a>
            <span aria-hidden className="mx-2">/</span>
            <ServiceSwitcher current={page} />
          </nav>
          <h1
            className="font-display font-extrabold tracking-[-0.04em] leading-[1] max-w-[22ch]"
            style={{ fontSize: 'clamp(2.2rem, 5.4vw, 4.6rem)' }}
          >
            {page.h1}
          </h1>
          <p className="mt-6 sm:mt-8 max-w-[60ch] text-lg sm:text-xl leading-relaxed text-paper-pure/90">
            {page.lead}
          </p>
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <AccentButton href={`${HOME}#cotizar`} onBlue>
              Cotiza tu proyecto
            </AccentButton>
            <a
              href={`${HOME}proyectos.html`}
              className="text-paper-pure font-medium underline underline-offset-[6px] decoration-paper-pure/40 hover:decoration-carne"
            >
              Ver proyectos
            </a>
          </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <SceneCard page={page} />
          </div>
        </div>
      </header>

      {/* Qué incluye */}
      <section className="px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20 bg-paper-pure">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16">
          <h2 className="font-display font-semibold text-klein tracking-[-0.03em] leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}>
            {page.includesTitle}
          </h2>
          <ul className="flex flex-col gap-3">
            {page.includes.map((item) => (
              <li key={item} className="flex gap-3 text-klein-deep leading-relaxed text-base sm:text-lg">
                <span aria-hidden className="mt-[0.7em] w-1.5 h-1.5 rounded-full bg-carne-deep shrink-0" />
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
      <section data-nav-bg="dark" className="bg-klein-deep text-paper-pure px-6 md:px-10 lg:px-16 py-16 sm:py-20">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <h2 className="font-display font-extrabold tracking-[-0.04em] leading-[1]" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
              Cuéntanos tu proyecto.
            </h2>
            <p className="mt-3 text-paper-pure/85 max-w-[50ch]">
              Te enviamos una cotización a la medida en 24 a 48 horas.
            </p>
          </div>
          <AccentButton href={`${HOME}#cotizar`} onBlue>
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
