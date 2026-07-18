import { BrandName } from '../components/Brand';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import ConceptGrid from '../components/ConceptGrid';

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col bg-paper overflow-hidden">
      {/* Portada editorial: texto a la izquierda, estatua a sangre a la derecha */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] items-stretch">
        <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 py-14 md:py-0 order-2 md:order-1">
          <FadeIn delay={0.1} y={16}>
            <span className="text-base sm:text-lg text-carne-tinta">
              Estudio digital · Bogotá · São Paulo
            </span>
          </FadeIn>

          <FadeIn delay={0.2} y={24}>
            <h1
              className="font-display font-extrabold text-klein tracking-[-0.05em] leading-[0.86] mt-5"
              style={{ fontSize: 'clamp(4rem, 13vw, 12rem)' }}
              aria-label="Out."
            >
              <BrandName />
            </h1>
          </FadeIn>

          <FadeIn delay={0.34} y={18}>
            <p
              className="font-display font-semibold text-klein-mid tracking-[-0.03em] mt-6"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.6rem)' }}
            >
              Never the usual.
            </p>
          </FadeIn>

          <FadeIn delay={0.46} y={16}>
            <p className="text-ink-2 leading-relaxed max-w-[42ch] mt-6 text-base sm:text-lg">
              Casi todo obedece. Una cosa se sale. Diseñamos el sistema, no la
              pieza suelta, y sabemos exactamente dónde romperlo.
            </p>
          </FadeIn>

          <FadeIn delay={0.58} y={16} className="mt-9">
            <AccentButton href="#contacto" className="sm:px-12 sm:py-4">
              Hablemos
            </AccentButton>
          </FadeIn>
        </div>

        {/* La estatua bleed: toca los bordes derecho, superior e inferior */}
        <FadeIn
          delay={0.3}
          y={0}
          duration={1}
          className="relative order-1 md:order-2 h-[42vh] md:h-[86vh] overflow-hidden"
        >
          <ConceptGrid className="absolute inset-0" />
        </FadeIn>
      </div>
    </section>
  );
}
