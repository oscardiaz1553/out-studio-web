import SymbolField from '../components/SymbolField';
import TitleFrame from '../components/TitleFrame';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    <article className="group flex flex-col shrink-0 snap-start w-[82%] sm:w-[46%] lg:w-[calc((100%-2.5rem)/3)] rounded-2xl overflow-hidden bg-klein-deep text-paper-pure">
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
            {categoryLabel(project.type)}
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
            Ver sitio
          </a>
        )}
      </div>
    </article>
  );
}

function Arrow({
  dir,
  disabled,
  onClick,
}: {
  dir: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Proyecto anterior' : 'Proyecto siguiente'}
      className="w-11 h-11 rounded-full border border-paper-pure/40 text-paper-pure flex items-center justify-center transition hover:bg-paper-pure hover:text-klein disabled:opacity-30 disabled:pointer-events-none active:scale-95"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={dir === 'prev' ? 'M19 12H5M11 6l-6 6 6 6' : 'M5 12h14M13 6l6 6-6 6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function ProjectsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft < 8,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // Mueve el carrusel una tarjeta (con el gap) hacia cada lado.
  const go = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector('article');
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.clientWidth + 20), behavior: 'smooth' });
  };

  return (
    <section
      id="proyectos"
      data-nav-bg="dark"
      className="relative z-10 overflow-hidden bg-klein px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20"
    >
      <SymbolField
        opacity={0.09}
        items={[
          { kind: 'curly', x: 94, y: 14, size: 'clamp(6rem, 13vw, 13rem)', rot: 8, dur: 14 },
          { kind: 'square', x: 4, y: 88, size: 'clamp(5rem, 11vw, 11rem)', rot: -6, dur: 12, delay: 2, desktopOnly: true },
        ]}
      />
      <div className="relative max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10">
          <TitleFrame kind="curly" tone="light" fontSize="clamp(2rem, 4vw, 3.4rem)">
            <RevealText
              as="h2"
              text="Proyectos"
              className="font-display font-semibold text-paper-pure tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
            />
          </TitleFrame>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={PROJECTS_URL}
              className="text-carne font-medium text-sm sm:text-base hover:text-paper-pure transition-colors duration-200 whitespace-nowrap"
            >
              Ver todos
            </a>
            <div className="hidden sm:flex gap-2">
              <Arrow dir="prev" disabled={edges.start} onClick={() => go(-1)} />
              <Arrow dir="next" disabled={edges.end} onClick={() => go(1)} />
            </div>
          </div>
        </div>

        {FEATURED_PROJECTS.length > 0 ? (
          <div
            ref={trackRef}
            onScroll={measure}
            tabIndex={0}
            role="region"
            aria-label="Carrusel de proyectos"
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-6 md:scroll-px-10 lg:scroll-px-[max(4rem,calc((100vw-1400px)/2))] overscroll-x-contain pb-2 [&::-webkit-scrollbar]:hidden"
            // A todo el ancho de la pantalla: la pista sale del contenedor hasta los
            // bordes y el relleno deja la primera tarjeta alineada con el título.
            style={{
              scrollbarWidth: 'none',
              marginInline: 'calc(50% - 50vw)',
              paddingInline: 'calc(50vw - 50%)',
            }}
          >
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
              Hablemos
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
