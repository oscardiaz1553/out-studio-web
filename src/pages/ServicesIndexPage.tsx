import { motion, useReducedMotion } from 'framer-motion';
import AccentButton from '../components/AccentButton';
import MangoBot from '../components/MangoBot';
import MorphBrackets from '../components/MorphBrackets';
import ScrollToTop from '../components/ScrollToTop';
import { SCENES } from '../components/ServiceScenes';
import SiteNav from '../components/SiteNav';
import { Sym } from '../components/TitleFrame';
import data from '../data/services.json';
import Footer from '../sections/Footer';
import { MethodSteps } from '../sections/MethodSection';
import { servicePath, THEMES } from './ServicePage';

const HOME = import.meta.env.BASE_URL;

// El orden de la página: primero los servicios puntuales y al final el
// desarrollo web a medida, que los reúne a todos.
const ORDER = ['tiendas-shopify', 'sitios-wordpress', 'landing-pages', 'branding', 'desarrollo-web'];
const TILT: Record<string, number> = {
  'tiendas-shopify': -4,
  'sitios-wordpress': 3,
  'landing-pages': -3,
  branding: 4,
  'desarrollo-web': -2,
};
const PAGES = ORDER.map((slug) => data.pages.find((p) => p.slug === slug)!).filter(Boolean);

/**
 * Página de todos los servicios. Cada servicio es una franja a todo el ancho
 * con el color de su lámina: la lámina inclinada a un lado y, al otro, qué es,
 * qué incluye y el paso siguiente.
 */
export default function ServicesIndexPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-paper" style={{ overflowX: 'clip' }}>
      <SiteNav />

      {/* Cabecera */}
      <header
        data-nav-bg="dark"
        className="relative overflow-hidden bg-klein text-paper-pure px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 pb-16 sm:pb-24"
      >
        <MorphBrackets className="absolute right-[-10%] top-[8%] w-[80%] sm:w-[56%] lg:w-[46%] opacity-[0.14]" />
        <div className="relative z-[2] max-w-[1200px] mx-auto">
          <nav aria-label="Ruta de navegación" className="text-sm mb-6 text-paper-pure/80">
            <a href={HOME} className="underline-offset-4 hover:underline">Inicio</a>
            <span aria-hidden className="mx-2">/</span>
            <span aria-current="page">Servicios</span>
          </nav>
          <h1
            className="max-w-[16ch] font-display font-extrabold tracking-[-0.045em] leading-[0.98]"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 6.2rem)' }}
          >
            Servicios para que tu marca <span className="text-carne">se salga</span> de lo usual.
          </h1>
          <p className="mt-6 sm:mt-8 max-w-[58ch] text-lg sm:text-xl leading-relaxed text-paper-pure/85">
            Especialistas en diseño UX/UI. Diseño y desarrollo web a medida para negocios de
            toda Colombia: tiendas Shopify, sitios WordPress, landing pages y branding, con
            código propio.
          </p>
          {/* Atajos a cada servicio */}
          <ul className="mt-8 sm:mt-10 flex flex-wrap gap-2.5">
            {PAGES.map((p) => (
              <li key={p.slug}>
                <a
                  href={`#${p.slug}`}
                  className="inline-block rounded-full bg-paper-pure/15 hover:bg-carne hover:text-klein-deep px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  {p.nav}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Lo que distingue a Out: el diseño UX/UI detrás de cada servicio. */}
      <section className="px-6 md:px-10 lg:px-16 py-14 sm:py-20 bg-paper-pure">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 items-start">
          <div>
            <h2
              className="font-display font-extrabold text-klein tracking-[-0.045em] leading-[0.98]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
            >
              Especialistas en diseño UX/UI.
            </h2>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-2">
              Antes de escribir código diseñamos la experiencia: cómo llega la gente,
              qué busca y qué la lleva a comprar o a escribirte. Cada servicio parte de ahí.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {[
              ['Entendemos a tus usuarios', 'Qué necesitan, qué les estorba y qué los convence, antes de diseñar una sola pantalla.'],
              ['Ves antes de construir', 'Prototipos y diseños que revisas y apruebas antes de pasar a desarrollo.'],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl bg-paper p-6">
                <h3 className="font-display font-extrabold text-klein tracking-[-0.03em] text-xl sm:text-2xl mb-2">{t}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-ink-2">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Un servicio por franja */}
      {PAGES.map((p, i) => {
        const theme = THEMES[p.scene] ?? THEMES.apps;
        const flip = i % 2 === 1;
        return (
          <section
            key={p.slug}
            id={p.slug}
            {...(theme.dark ? { 'data-nav-bg': 'dark' } : {})}
            className="relative overflow-hidden scroll-mt-16 px-6 md:px-10 lg:px-16 py-16 sm:py-20 lg:py-24"
            style={{ background: theme.bg, color: theme.text }}
          >
            {/* El par de símbolos del servicio, enorme y tenue, de fondo. */}
            <span
              aria-hidden
              className={`absolute flex gap-[0.4em] pointer-events-none select-none top-[6%] ${
                flip ? 'left-[-6%]' : 'right-[-6%]'
              }`}
              style={{ color: theme.accent, opacity: theme.dark ? 0.12 : 0.1, fontSize: 'clamp(12rem, 34vw, 30rem)' }}
            >
              <Sym kind={theme.kind} />
              <Sym kind={theme.kind} flip />
            </span>

            <div
              className={`relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20 ${
                flip ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <motion.a
                href={servicePath(p.slug)}
                aria-label={`Ver ${p.nav}`}
                initial={reduceMotion ? false : { y: 40, rotate: 0 }}
                whileInView={{ y: 0, rotate: TILT[p.slug] ?? 0 }}
                whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.02 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                className="relative block w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[460px] mx-auto aspect-[4/5] rounded-[28px] overflow-hidden shadow-[0_30px_70px_rgba(10,14,50,0.35)]"
                style={{ containerType: 'inline-size' }}
              >
                {SCENES[p.scene]}
              </motion.a>

              <div className="max-w-[560px] mx-auto lg:mx-0 w-full">
                <h2
                  className="font-display font-extrabold tracking-[-0.045em] leading-[0.98]"
                  style={{ fontSize: 'clamp(2.4rem, 5.4vw, 4.6rem)' }}
                >
                  <a href={servicePath(p.slug)} className="hover:underline decoration-[0.06em] underline-offset-[0.12em]">
                    {p.nav}
                  </a>
                </h2>
                <p className="mt-5 text-lg leading-relaxed" style={{ color: theme.muted }}>
                  {p.lead}
                </p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {p.includes.slice(0, 4).map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed" style={{ color: theme.muted }}>
                      <span
                        aria-hidden
                        className="mt-[0.6em] w-2 h-2 rounded-full shrink-0"
                        style={{ background: theme.dark ? '#F5E3B3' : '#BC6039' }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <AccentButton href={servicePath(p.slug)} onBlue={theme.dark}>
                    Ver servicio
                  </AccentButton>
                  <a
                    href={`${HOME}#cotizar`}
                    className="font-medium underline underline-offset-[6px] decoration-current/40 hover:decoration-current"
                  >
                    Cotizar
                  </a>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Cómo trabajamos */}
      <section className="px-6 md:px-10 lg:px-16 py-16 sm:py-20 bg-paper">
        <div className="max-w-[1400px] mx-auto">
          <h2
            className="font-display font-extrabold text-klein tracking-[-0.04em] leading-[1] mb-10"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          >
            Así trabajamos, sea cual sea el servicio.
          </h2>
          {/* El mismo método del home: cuatro paneles que se abren. */}
          <MethodSteps ctaHref={`${HOME}#cotizar`} />
        </div>
      </section>

      {/* Cierre */}
      <section data-nav-bg="dark" className="px-6 md:px-10 lg:px-16 py-16 sm:py-20 bg-klein-deep text-paper-pure">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <h2 className="font-display font-extrabold tracking-[-0.04em] leading-[1]" style={{ fontSize: 'clamp(1.9rem, 4vw, 3.2rem)' }}>
              ¿No sabes cuál necesitas?
            </h2>
            <p className="mt-3 max-w-[50ch] text-paper-pure/80">
              Cuéntanos tu idea y te recomendamos el camino. Respuesta en 6 a 24 horas.
            </p>
          </div>
          <AccentButton href={`${HOME}#cotizar`} onBlue>
            Cotiza tu proyecto
          </AccentButton>
        </div>
      </section>

      <Footer />
      <MangoBot />
      <ScrollToTop />
    </main>
  );
}
