import { BrandDot } from '../components/Brand';
import ProjectMedia from '../components/ProjectMedia';
import RevealText from '../components/RevealText';
import { AZULEJO } from '../data/botanica';
import {
  categoryLabel,
  FEATURED_PROJECTS,
  type Project,
} from '../data/projects';

const PROJECTS_URL = `${import.meta.env.BASE_URL}proyectos.html`;

// Tarjeta compacta: todo a la vista, sin scroll encadenado. Con capturas
// muestra la imagen principal; sin ellas, un panel tipográfico con el nombre.
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const live = project.url && project.status !== 'in-progress';
  const hasImage = Boolean(project.rightImage);

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden bg-klein-deep text-paper-pure">
      {hasImage ? (
        <ProjectMedia
          src={project.rightImage}
          alt={`${project.name}, vista principal`}
          label={project.name.charAt(0)}
          className="w-full h-40 sm:h-64 object-cover"
        />
      ) : (
        <div className="relative h-40 sm:h-64 overflow-hidden flex items-end p-6 sm:p-7">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `url(${AZULEJO})`,
              backgroundSize: '170%',
              backgroundPosition: `${index * 33}% 40%`,
            }}
          />
          <p
            className="relative font-display font-extrabold tracking-[-0.045em] leading-[0.95]"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}
          >
            {project.name}
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7 border-t border-paper-pure/10">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[11px] tracking-[0.06em] text-carne">
            {project.number} · {categoryLabel(project.type)}
          </span>
          {project.status === 'in-progress' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-carne/40 px-2.5 py-0.5 text-[10px] font-medium text-carne">
              <span className="w-1.5 h-1.5 rounded-full bg-carne" />
              En desarrollo
            </span>
          )}
        </div>
        {hasImage && (
          <h3 className="font-display font-semibold text-xl tracking-[-0.02em]">
            {project.name}
          </h3>
        )}
        <p className="text-paper-pure/80 leading-relaxed text-sm sm:text-base">
          {project.summary}
        </p>
        {live && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="mt-auto pt-2 self-start font-medium text-carne hover:text-paper-pure transition-colors duration-200"
          >
            Ver sitio ↗
          </a>
        )}
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="proyectos"
      data-nav-bg="dark"
      className="relative z-10 bg-klein px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-baseline gap-4">
            <span className="text-[11px] tracking-[0.06em] text-carne">02</span>
            <RevealText
              as="h2"
              text="Proyectos"
              className="font-display font-semibold text-paper-pure tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
            />
          </div>
          <a
            href={PROJECTS_URL}
            className="text-carne font-medium text-sm sm:text-base hover:text-paper-pure transition-colors duration-200 whitespace-nowrap"
          >
            Ver todos →
          </a>
        </div>

        {FEATURED_PROJECTS.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {FEATURED_PROJECTS.map((p, i) => (
              <ProjectCard key={p.number} project={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-carne/40 bg-klein-deep/40 px-8 py-12 flex flex-col items-start gap-4">
            <span className="flex items-baseline font-display font-extrabold text-paper-pure text-3xl">
              Próximamente
              <BrandDot color="#F5E3B3" />
            </span>
            <a href="#contacto" className="text-carne font-medium">
              Hablemos →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
