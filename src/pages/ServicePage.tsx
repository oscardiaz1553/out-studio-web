import AccentButton from '../components/AccentButton';
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
        <div className="max-w-[1100px] mx-auto">
          <nav aria-label="Ruta de navegación" className="text-sm text-paper-pure/75 mb-6">
            <a href={HOME} className="hover:text-paper-pure underline-offset-4 hover:underline">Inicio</a>
            <span aria-hidden className="mx-2">/</span>
            <a href={`${HOME}#servicios`} className="hover:text-paper-pure underline-offset-4 hover:underline">Servicios</a>
            <span aria-hidden className="mx-2">/</span>
            <span aria-current="page" className="text-paper-pure">{page.nav}</span>
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
            <a href={`${HOME}contacto.html`} className="hover:text-klein">Contacto</a>
          </nav>
          <p>© 2026 Out Studio. Colombia.</p>
        </div>
      </footer>

      <ScrollToTop />
    </main>
  );
}
