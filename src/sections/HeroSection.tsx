import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import { BrandName } from '../components/Brand';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import GalaxyCanvas from '../components/GalaxyCanvas';

const NAV_LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Depth on exit: the galaxy drifts slower than the scroll while the
  // content slides away faster and fades.
  const galaxyY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={reduceMotion ? undefined : { y: galaxyY }}
      >
        <GalaxyCanvas className="w-full h-full" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 70%, #000000 100%)',
          }}
        />
      </motion.div>

      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-10 px-6 md:px-10 pt-6 md:pt-8"
      >
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
          <AccentButton href="#contacto">Hablar</AccentButton>
        </div>
      </FadeIn>

      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6"
        style={
          reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }
        }
      >
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
          <p className="text-white/60 font-semibold uppercase tracking-[0.35em] text-xs sm:text-sm mt-4 sm:mt-5">
            Fuera del molde
          </p>
        </FadeIn>

        <FadeIn delay={0.65} y={20} className="mt-10 sm:mt-12">
          <AccentButton href="#contacto" className="sm:px-12 sm:py-4">
            Hablemos de tu proyecto
          </AccentButton>
        </FadeIn>
      </motion.div>
    </section>
  );
}
