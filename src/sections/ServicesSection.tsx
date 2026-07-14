import { BrandName } from '../components/Brand';
import FadeIn from '../components/FadeIn';

const SERVICES = [
  { suffix: 'Web', meta: ['Sitios', 'Landings', 'Corporativos'] },
  { suffix: 'Design', meta: ['Identidad', 'UI/UX', 'Editorial'] },
  { suffix: 'Motion', meta: ['Animación', 'Video', '3D'] },
  { suffix: 'Brand', meta: ['Estrategia', 'Naming', 'Posicionamiento'] },
  { suffix: 'Social', meta: ['Contenido', 'Redes', 'Comunidad'] },
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
              key={service.suffix}
              as="li"
              delay={i * 0.08}
              y={24}
              className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 sm:gap-10 py-7 sm:py-9 border-t border-klein-deep/15"
            >
              <h3
                className="text-klein leading-none"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
              >
                <BrandName suffix={service.suffix} />
              </h3>
              <p className="text-xs sm:text-sm tracking-[0.04em] text-muted sm:text-right sm:pt-4 transition-colors duration-200 group-hover:text-klein">
                {service.meta.join(' · ')}
              </p>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
