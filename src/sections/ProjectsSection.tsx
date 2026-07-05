import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import { BrandDot } from '../components/Brand';
import FadeIn from '../components/FadeIn';
import ParallaxY from '../components/ParallaxY';

interface Project {
  number: string;
  name: string;
  category: string;
  /** Two stacked images for the left column (40%) */
  leftImages: [string, string];
  /** One tall image for the right column (60%) */
  rightImage: string;
  url?: string;
}

// Agrega aquí los casos reales cuando estén listos; con el array vacío la
// sección muestra el panel "Próximamente" automáticamente.
const PROJECTS: Project[] = [];

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="h-[85vh]">
      <div className="sticky top-24 md:top-32">
        <motion.div
          className="relative rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8"
          style={{
            top: `${index * 28}px`,
            ...(reduceMotion ? {} : { scale }),
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
              <span
                className="text-white font-black leading-none"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
              >
                {project.number}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-white/60 font-medium uppercase tracking-widest text-xs sm:text-sm">
                  {project.category}
                </span>
                <h3
                  className="text-white font-bold uppercase"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2rem)' }}
                >
                  {project.name}
                </h3>
              </div>
            </div>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border-2 border-white/40 text-white font-bold uppercase tracking-widest px-8 py-3 text-xs sm:text-sm transition-colors duration-200 hover:border-[#4B8CC8] hover:text-[#4B8CC8] active:scale-[0.97]"
              >
                Ver proyecto
              </a>
            )}
          </div>

          <div className="flex gap-3 sm:gap-4">
            <div className="w-[40%] flex flex-col gap-3 sm:gap-4">
              <img
                src={project.leftImages[0]}
                alt={`${project.name}, vista 1`}
                loading="lazy"
                className="w-full object-cover rounded-2xl"
                style={{ height: 'clamp(130px, 16vw, 230px)' }}
              />
              <img
                src={project.leftImages[1]}
                alt={`${project.name}, vista 2`}
                loading="lazy"
                className="w-full object-cover rounded-2xl"
                style={{ height: 'clamp(160px, 22vw, 340px)' }}
              />
            </div>
            <div className="w-[60%]">
              <img
                src={project.rightImage}
                alt={`${project.name}, vista principal`}
                loading="lazy"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProjectStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef}>
      {PROJECTS.map((project, i) => (
        <ProjectCard
          key={project.number}
          project={project}
          index={i}
          total={PROJECTS.length}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function ComingSoonPanel() {
  return (
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
          Estamos construyendo nuestros primeros casos. El tuyo puede ser uno
          de ellos.
        </p>
        <a
          href="#contacto"
          className="text-[#4B8CC8] font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity duration-200"
        >
          Hablemos →
        </a>
      </div>
    </FadeIn>
  );
}

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

        {PROJECTS.length > 0 ? <ProjectStack /> : <ComingSoonPanel />}
      </div>
    </section>
  );
}
