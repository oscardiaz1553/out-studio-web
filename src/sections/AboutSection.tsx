import AnimatedText from '../components/AnimatedText';
import { BrandDot } from '../components/Brand';
import FadeIn from '../components/FadeIn';
import ParallaxY from '../components/ParallaxY';

const ABOUT_TEXT =
  'Out. nació de una idea simple: la mayoría de negocios digitales se ven todos iguales. Mismos templates, mismas fórmulas, mismo molde. Out. Studio existe para romper eso. Diseñamos y desarrollamos presencia digital que no solo se ve bien, sino que vende — sitios, tiendas y marcas construidas fuera del molde.';

export default function AboutSection() {
  return (
    <section
      id="nosotros"
      className="bg-[#000000] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto">
        <ParallaxY from={36} to={-36}>
          <FadeIn delay={0} y={40}>
            <h2
              className="text-white font-black leading-none tracking-tight mb-12 sm:mb-16 md:mb-20"
              style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
            >
              Nosotros
            </h2>
          </FadeIn>
        </ParallaxY>

        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-16 items-center">
          <FadeIn delay={0.1} y={30}>
            {/* TODO: reemplazar por la foto real de Oscar (retrato vertical,
                ratio 4:5, idealmente B/N para mantener la paleta) */}
            <div className="aspect-[4/5] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
              <span
                className="flex items-baseline font-black text-white/15 leading-none"
                style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
                aria-label="Oscar Díaz"
              >
                OD
                <BrandDot />
              </span>
            </div>
          </FadeIn>

          <div className="flex flex-col gap-8">
            <AnimatedText
              text={ABOUT_TEXT}
              className="text-white font-medium leading-relaxed"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.45rem)' }}
            />

            <FadeIn delay={0.1} y={20}>
              <p
                className="text-white/60 leading-relaxed"
                style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)' }}
              >
                Detrás de Out. está{' '}
                <span className="text-white font-semibold">Oscar Díaz</span>,{' '}
                <span className="text-white font-semibold">
                  Founder &amp; Creative Director
                </span>
                , liderando cada proyecto de punta a punta: estrategia, diseño
                y desarrollo.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
