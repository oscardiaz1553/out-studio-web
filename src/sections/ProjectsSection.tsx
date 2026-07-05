import { BrandDot } from '../components/Brand';
import FadeIn from '../components/FadeIn';
import ParallaxY from '../components/ParallaxY';

export default function ProjectsSection() {
  return (
    <section
      id="proyectos"
      className="relative z-10 bg-[#000000] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-24"
    >
      <div className="max-w-6xl mx-auto">
        <ParallaxY from={36} to={-36}>
          <FadeIn delay={0} y={40}>
            <h2
              className="text-white font-black leading-none tracking-tight mb-12 sm:mb-16 md:mb-20"
              style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
            >
              Proyectos
            </h2>
          </FadeIn>
        </ParallaxY>

        <FadeIn delay={0.15} y={30}>
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-8 py-14 sm:px-14 sm:py-20 flex flex-col items-start gap-5">
            <span
              className="flex items-baseline text-white font-black uppercase tracking-tight leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)' }}
            >
              Próximamente
              <BrandDot />
            </span>
            <p className="text-white/60 font-medium max-w-md leading-relaxed">
              Estamos construyendo nuestros primeros casos. El tuyo puede ser
              uno de ellos.
            </p>
            <a
              href="#contacto"
              className="text-[#4B8CC8] font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity duration-200"
            >
              Hablemos →
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
