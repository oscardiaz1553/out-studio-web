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

// CARDS DE PRUEBA para visualizar el stack final. Reemplazar título,
// categoría, imágenes y url con los casos reales; si el array queda vacío,
// la sección vuelve a mostrar el panel "Próximamente".
const PROJECTS: Project[] = [
  {
    number: '01',
    name: 'Andina Café',
    category: 'E-commerce · Shopify',
    leftImages: [
      'https://picsum.photos/seed/out-andina-detalle/900/560',
      'https://picsum.photos/seed/out-andina-producto/900/760',
    ],
    rightImage: 'https://picsum.photos/seed/out-andina-hero/1000/1300',
    url: '#',
  },
  {
    number: '02',
    name: 'Nórdica Estudio',
    category: 'Branding · Identidad',
    leftImages: [
      'https://picsum.photos/seed/out-nordica-marca/900/560',
      'https://picsum.photos/seed/out-nordica-papeleria/900/760',
    ],
    rightImage: 'https://picsum.photos/seed/out-nordica-hero/1000/1300',
    url: '#',
  },
  {
    number: '03',
    name: 'Kiro App',
    category: 'Web · UI/UX',
    leftImages: [
      'https://picsum.photos/seed/out-kiro-pantallas/900/560',
      'https://picsum.photos/seed/out-kiro-flujo/900/760',
    ],
    rightImage: 'https://picsum.photos/seed/out-kiro-hero/1000/1300',
    url: '#',
  },
];

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
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    // Every wrapper pins at the same spot below the sticky heading; each new
    // card slides over the previous ones, which peek behind in a cascade.
    // Top padding clears the pinned "Proyectos" title; image heights are
    // viewport-based so the whole card always fits on screen.
    <div className="h-[100svh] sticky top-0 flex flex-col justify-start pt-28 md:pt-36 pb-4">
      <motion.div
        className="relative w-full rounded-3xl border border-white/10 bg-[#0D0D0D] p-4 sm:p-6 md:p-8"
        style={{
          top: `${index * 24}px`,
          ...(reduceMotion ? {} : { scale }),
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <span
              className="text-white font-black leading-none"
              style={{ fontSize: 'clamp(2.2rem, 6.5vw, 90px)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-white/60 font-medium uppercase tracking-widest text-xs sm:text-sm">
                {project.category}
              </span>
              <h3
                className="text-white font-bold uppercase"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.8rem)' }}
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
              className="rounded-full border-2 border-white/40 text-white font-bold px-8 py-3 text-xs sm:text-sm transition-colors duration-200 hover:border-[#4B8CC8] hover:text-[#4B8CC8] active:scale-[0.97]"
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
              style={{ height: 'clamp(100px, 17vh, 220px)' }}
            />
            <img
              src={project.leftImages[1]}
              alt={`${project.name}, vista 2`}
              loading="lazy"
              className="w-full object-cover rounded-2xl"
              style={{ height: 'clamp(130px, 24vh, 320px)' }}
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
  );
}

function ProjectStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative">
      {/* The section title stays pinned above the stack for its whole run */}
      <div className="sticky top-8 md:top-10">
        <FadeIn delay={0} y={30}>
          <h2
            className="text-white font-black leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 80px)' }}
          >
            Proyectos
          </h2>
        </FadeIn>
      </div>

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
    <>
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
            className="text-[#4B8CC8] font-bold text-sm hover:opacity-80 transition-opacity duration-200"
          >
            Hablemos →
          </a>
        </div>
      </FadeIn>
    </>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="proyectos"
      className="relative z-10 bg-[#000000] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-16 sm:pt-20 md:pt-24 pb-24"
    >
      <div className="max-w-6xl mx-auto">
        {PROJECTS.length > 0 ? <ProjectStack /> : <ComingSoonPanel />}
      </div>
    </section>
  );
}
