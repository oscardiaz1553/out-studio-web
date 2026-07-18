import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import { BrandDot } from '../components/Brand';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import { AZULEJO } from '../data/botanica';
import {
  categoryLabel,
  FEATURED_PROJECTS,
  type Project,
} from '../data/projects';

const PROJECTS_URL = `${import.meta.env.BASE_URL}proyectos.html`;

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
    <div className="h-[100svh] sticky top-0 flex flex-col justify-start pt-28 md:pt-36 pb-4">
      <motion.div
        className="relative w-full overflow-hidden rounded-2xl border border-klein-deep/15 bg-paper-pure p-4 sm:p-6 md:p-8 pl-7 sm:pl-9 md:pl-12"
        style={{
          top: `${index * 24}px`,
          ...(reduceMotion ? {} : { scale }),
        }}
      >
        {/* Lomo de azulejo: cada card muestra un tramo distinto del patrón,
            como pliegos de un mismo cuadernillo. */}
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-2.5 sm:w-3.5"
          style={{
            backgroundImage: `url(${AZULEJO})`,
            backgroundSize: 'auto 140%',
            backgroundPosition: `${index * 33}% 50%`,
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <span
              className="font-display font-extrabold text-klein leading-none flex items-baseline"
              style={{ fontSize: 'clamp(2.2rem, 6.5vw, 90px)' }}
            >
              {project.number}
              <BrandDot />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-muted tracking-[0.04em] text-[11px] sm:text-xs">
                {categoryLabel(project.type)}
              </span>
              <h3
                className="font-display font-semibold text-klein tracking-[-0.02em]"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.9rem)' }}
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
              className="rounded-full border border-klein text-klein font-medium px-7 py-2.5 text-sm transition-colors duration-200 hover:bg-klein hover:text-paper-pure active:scale-[0.97]"
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
              className="w-full object-cover rounded-xl"
              style={{ height: 'clamp(100px, 17vh, 220px)' }}
            />
            <img
              src={project.leftImages[1]}
              alt={`${project.name}, vista 2`}
              loading="lazy"
              className="w-full object-cover rounded-xl"
              style={{ height: 'clamp(130px, 24vh, 320px)' }}
            />
          </div>
          <div className="w-[60%]">
            <img
              src={project.rightImage}
              alt={`${project.name}, vista principal`}
              loading="lazy"
              className="w-full h-full object-cover rounded-xl"
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
      <div className="sticky top-8 md:top-10 z-10">
        <div className="flex items-baseline gap-4">
          <span className="text-[11px] tracking-[0.06em] text-carne">
            02
          </span>
          <h2
            className="font-display font-semibold text-paper-pure tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          >
            Proyectos
          </h2>
        </div>
      </div>

      {FEATURED_PROJECTS.map((project, i) => (
        <ProjectCard
          key={project.number}
          project={project}
          index={i}
          total={FEATURED_PROJECTS.length}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function AllProjectsCta() {
  return (
    <FadeIn
      delay={0.1}
      y={24}
      className="mt-16 sm:mt-20 flex flex-col items-start gap-4"
    >
      <p className="text-klein-soft max-w-md leading-relaxed">
        Esto es solo una muestra. Explora todos los casos y fíltralos por tipo.
      </p>
      <AccentButton href={PROJECTS_URL} onBlue>
        Ver todos los proyectos →
      </AccentButton>
    </FadeIn>
  );
}

function ComingSoonPanel() {
  return (
    <>
      <div className="flex items-baseline gap-4 mb-12">
        <span className="text-[11px] tracking-[0.06em] text-carne">
          02
        </span>
        <h2
          className="font-display font-semibold text-paper-pure tracking-[-0.035em]"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
        >
          Proyectos
        </h2>
      </div>
      <FadeIn delay={0.15} y={30}>
        <div className="rounded-2xl border border-carne/40 bg-klein-deep/40 px-8 py-14 sm:px-14 sm:py-20 flex flex-col items-start gap-5">
          <span
            className="flex items-baseline font-display font-extrabold text-paper-pure tracking-[-0.03em] leading-none"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)' }}
          >
            Próximamente
            <BrandDot color="#F2C6B4" />
          </span>
          <p className="text-klein-soft max-w-md leading-relaxed">
            Estamos construyendo nuestros primeros casos. El tuyo puede ser uno
            de ellos.
          </p>
          <a
            href="#contacto"
            className="text-carne font-medium hover:opacity-80 transition-opacity duration-200"
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
      className="relative z-10 bg-klein px-6 md:px-10 lg:px-16 pt-16 sm:pt-20 md:pt-24 pb-24"
    >
      <div className="max-w-[1400px] mx-auto">
        {FEATURED_PROJECTS.length > 0 ? (
          <>
            <ProjectStack />
            <AllProjectsCta />
          </>
        ) : (
          <ComingSoonPanel />
        )}
      </div>
    </section>
  );
}
