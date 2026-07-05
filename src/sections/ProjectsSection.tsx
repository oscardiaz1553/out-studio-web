import { BrandDot } from '../components/Brand';
import FadeIn from '../components/FadeIn';
import ParallaxY from '../components/ParallaxY';

export default function ProjectsSection() {
  return (
    <section
      id="proyectos"
      className="relative z-10 bg-[#0A0A0A] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-24"
    >
      <ParallaxY from={36} to={-36}>
        <FadeIn delay={0} y={40}>
          <h2
            className="text-white font-black text-center leading-none tracking-tight mb-6 sm:mb-8"
            style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
          >
            Proyectos
          </h2>
        </FadeIn>
      </ParallaxY>

      <FadeIn delay={0.15} y={20}>
        <p className="text-[#888888] font-medium text-center max-w-md mx-auto mb-14 sm:mb-16 md:mb-20">
          Estamos documentando nuestros primeros casos. Muy pronto podrás
          verlos aquí.
        </p>
      </FadeIn>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {[0, 1, 2].map((i) => (
          <FadeIn key={i} delay={0.2 + i * 0.1} y={30}>
            <div className="aspect-[4/3] rounded-3xl border border-dashed border-white/15 bg-[#1A1A1A]/40 flex items-center justify-center">
              <span className="flex items-center gap-2 text-[#888888] font-semibold uppercase tracking-[0.25em] text-xs">
                <span className="text-base leading-none" aria-hidden>
                  <BrandDot />
                </span>
                Próximamente
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
