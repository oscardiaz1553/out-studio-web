import { BrandName } from '../components/Brand';
import EmberButton from '../components/EmberButton';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';

const NAV_LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

export default function HeroSection() {
  return (
    <section
      className="relative h-screen flex flex-col"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn as="nav" delay={0} y={-20} className="px-6 md:px-10 pt-6 md:pt-8">
        <div className="flex items-center justify-between gap-4">
          <a href="#" className="text-white text-xl md:text-2xl">
            <BrandName />
          </a>
          <ul className="hidden sm:flex items-center gap-6 md:gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-white font-medium text-sm md:text-base hover:opacity-70 transition-opacity duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <EmberButton href="#contacto">Hablar</EmberButton>
        </div>
      </FadeIn>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <FadeIn delay={0.15} y={40}>
          <h1 className="text-white leading-none tracking-tight text-[26vw] sm:text-[22vw] md:text-[19vw]">
            <BrandName />
          </h1>
        </FadeIn>

        <FadeIn delay={0.35} y={20}>
          <p
            className="text-white font-medium mt-6 sm:mt-8"
            style={{ fontSize: 'clamp(1.15rem, 2.6vw, 2rem)' }}
          >
            Presencia digital que vende.
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <p className="text-[#888888] font-semibold uppercase tracking-[0.35em] text-xs sm:text-sm mt-4 sm:mt-5">
            Fuera del molde
          </p>
        </FadeIn>

        <FadeIn delay={0.65} y={20} className="mt-10 sm:mt-12">
          <Magnet padding={80} strength={4}>
            <EmberButton href="#contacto" className="sm:px-12 sm:py-4">
              Hablemos de tu proyecto
            </EmberButton>
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
