import FadeIn from '../components/FadeIn';
import { AZULEJO } from '../data/botanica';

// Servicios reales de Out, con el lenguaje en tono cálido y directo.
const SERVICES = [
  {
    name: 'Tiendas Shopify',
    description:
      'Tu tienda vendiendo desde el primer día, no cuando por fin quede lista.',
  },
  {
    name: 'Sitios WordPress',
    description:
      'Una web profesional que actualizas tú mismo, sin depender de nadie.',
  },
  {
    name: 'Landing Pages',
    description:
      'Páginas de campaña con un solo objetivo: que la gente actúe.',
  },
  {
    name: 'Integraciones & Automatizaciones',
    description:
      'Conectamos tus herramientas para que el trabajo repetitivo se haga solo.',
  },
  {
    name: 'Soporte & Optimización',
    description:
      'No desaparecemos después del lanzamiento. Seguimos contigo.',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="servicios"
      className="bg-paper px-6 md:px-10 lg:px-16 py-20 sm:py-24 md:py-32 border-t border-klein-deep/15"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="text-[11px] tracking-[0.06em] text-carne-tinta">
            01
          </span>
          <h2
            className="font-display font-semibold text-klein tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          >
            Servicios
          </h2>
        </div>

        <ul className="mt-12 sm:mt-16">
          {SERVICES.map((service, i) => (
            <FadeIn
              key={service.name}
              as="li"
              delay={i * 0.08}
              y={24}
              className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 sm:gap-12 py-7 sm:py-9 border-t border-klein-deep/15"
            >
              <div className="flex items-baseline gap-4 sm:gap-6">
                <span className="text-[11px] tracking-[0.06em] text-carne-tinta shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Al hover, la tipografía se llena de azulejo (tinta de
                    patrón vía background-clip). Cada fila muestra un recorte
                    distinto. Crossfade de opacidad: compositor puro. */}
                <h3
                  className="relative font-display font-semibold text-klein tracking-[-0.02em] leading-[1.03]"
                  style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.8rem)' }}
                >
                  {service.name}
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none"
                    style={{
                      backgroundImage: `url(${AZULEJO})`,
                      backgroundSize: 'cover',
                      backgroundPosition: `${i * 22}% 50%`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {service.name}
                  </span>
                </h3>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-muted sm:text-right sm:pt-2 sm:max-w-[34ch] transition-colors duration-200 group-hover:text-klein">
                {service.description}
              </p>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
