import AnimatedText from '../components/AnimatedText';
import FadeIn from '../components/FadeIn';
import ParallaxY from '../components/ParallaxY';

const ABOUT_TEXT =
  'Out. nació de una idea simple: la mayoría de negocios digitales se ven todos iguales. Mismos templates, mismas fórmulas, mismo molde. Out. Studio existe para romper eso. Diseñamos y desarrollamos presencia digital que no solo se ve bien, sino que vende — sitios, tiendas y marcas construidas fuera del molde.';

export default function AboutSection() {
  return (
    <section
      id="nosotros"
      className="bg-[#0A0A0A] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <ParallaxY from={36} to={-36}>
        <FadeIn delay={0} y={40}>
          <h2
            className="text-white font-black text-center leading-none tracking-tight mb-14 sm:mb-16 md:mb-24"
            style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
          >
            Nosotros
          </h2>
        </FadeIn>
      </ParallaxY>

      <div className="max-w-3xl mx-auto flex flex-col items-center gap-12 sm:gap-14">
        <AnimatedText
          text={ABOUT_TEXT}
          className="text-white font-medium text-center leading-relaxed"
          style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)' }}
        />

        <FadeIn delay={0.1} y={20}>
          <p
            className="text-[#888888] text-center leading-relaxed max-w-xl"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)' }}
          >
            Detrás de Out. está{' '}
            <span className="text-white font-semibold">Oscar Díaz</span>,{' '}
            <span className="text-white font-semibold">
              Founder &amp; Creative Director
            </span>
            , liderando cada proyecto de punta a punta: estrategia, diseño y
            desarrollo.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
