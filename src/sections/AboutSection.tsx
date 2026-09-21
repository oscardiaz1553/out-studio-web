import AnimatedText from '../components/AnimatedText';
import FadeIn from '../components/FadeIn';
import RevealText from '../components/RevealText';
import Statue from '../components/Statue';
import { STATUES } from '../data/statues';

const ABOUT_SEGMENTS = [
  {
    text: 'La mayoría de negocios digitales se ven todos iguales. Mismos templates, mismas fórmulas, mismo molde. ',
  },
  { text: 'Out existe para romper eso: ', accent: true },
  {
    text: 'tiendas Shopify y webs en WordPress hechas a medida, con código propio, para que nadie tenga que decirte que no se puede.',
  },
];

export default function AboutSection() {
  return (
    <section
      id="nosotros"
      className="bg-paper border-t border-klein-deep/15 grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr]"
    >
      {/* Estatua a sangre por el borde izquierdo */}
      <div className="relative min-h-[46vh] md:min-h-[80vh] order-1">
        <Statue
          src={STATUES.about}
          alt="Retrato de estatua clásica en dúotono"
          className="absolute inset-0"
        />
      </div>

      <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 py-16 md:py-24 order-2">
        <div className="flex items-baseline gap-4 mb-8">
          <span className="text-[11px] tracking-[0.06em] text-carne-tinta">
            04
          </span>
          <RevealText
            as="h2"
            text="Nosotros"
            unit="char"
            className="font-display font-semibold text-klein tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          />
        </div>

        <AnimatedText
          segments={ABOUT_SEGMENTS}
          className="font-medium leading-relaxed max-w-[46ch]"
          style={{ fontSize: 'clamp(1.15rem, 2vw, 1.6rem)' }}
        />

        <FadeIn delay={0.1} y={18} className="mt-10">
          <p className="text-ink-2 leading-relaxed max-w-[46ch]">
            Detrás de Out está{' '}
            <span className="text-klein font-semibold">Oscar Díaz</span>,{' '}
            <span className="text-klein font-semibold">
              UX/UI Specialist y Desarrollador WordPress y Shopify
            </span>
            , liderando cada proyecto de punta a punta: estrategia, diseño y
            desarrollo. Potenciamos tu idea con inteligencia artificial.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
