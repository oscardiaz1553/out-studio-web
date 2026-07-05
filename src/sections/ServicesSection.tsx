import { BrandName } from '../components/Brand';
import FadeIn from '../components/FadeIn';
import ParallaxY from '../components/ParallaxY';

const SERVICES = [
  {
    suffix: 'web',
    dotColor: '#4D9FFF',
    meta: ['Desarrollo', 'Shopify', 'E-commerce', 'CMS'],
  },
  {
    suffix: 'design',
    dotColor: '#B675FF',
    meta: ['Identidad', 'UI/UX', 'Branding', 'Editorial'],
  },
  {
    suffix: 'motion',
    dotColor: '#FFC24D',
    meta: ['Animación', 'Video', 'After Effects', '3D'],
  },
  {
    suffix: 'brand',
    dotColor: '#FF5733',
    meta: ['Estrategia', 'Naming', 'Posicionamiento'],
  },
  {
    suffix: 'social',
    dotColor: '#4DE1A0',
    meta: ['Contenido', 'Redes', 'Gestión de comunidad'],
  },
];

export default function ServicesSection() {
  return (
    <section
      id="servicios"
      className="bg-[#F7F5F2] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <ParallaxY from={36} to={-36}>
        <FadeIn delay={0} y={40}>
          <h2
            className="text-[#0A0A0A] font-black text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
            style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
          >
            Servicios
          </h2>
        </FadeIn>
      </ParallaxY>

      <div className="max-w-5xl mx-auto">
        {SERVICES.map((service, i) => (
          <FadeIn
            key={service.suffix}
            delay={i * 0.1}
            y={30}
            className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 sm:gap-10 py-8 sm:py-10 md:py-12 ${
              i > 0 ? 'border-t' : ''
            }`}
            style={i > 0 ? { borderColor: 'rgba(10, 10, 10, 0.15)' } : undefined}
          >
            <h3
              className="text-[#0A0A0A] leading-none"
              style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
            >
              <BrandName suffix={service.suffix} dotColor={service.dotColor} />
            </h3>
            <p
              className="text-[#888888] font-medium sm:text-right"
              style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.15rem)' }}
            >
              {service.meta.join(' · ')}
            </p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
