import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { BrandDot } from '../components/Brand';
import SiteNav from '../components/SiteNav';
import { AZULEJO } from '../data/botanica';
import {
  categoryLabel,
  PROJECTS,
  PROJECT_TYPES,
  type Project,
  type ProjectType,
} from '../data/projects';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type Filter = 'Todos' | ProjectType;
const FILTERS: Filter[] = ['Todos', ...PROJECT_TYPES];

function ProjectGridCard({ project }: { project: Project }) {
  return (
    <article className="group h-full rounded-2xl border border-klein-deep/15 bg-paper-pure overflow-hidden flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={project.rightImage}
          alt={`${project.name}, vista principal`}
          loading="lazy"
          className="w-full aspect-[4/3] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {/* Lomo de azulejo: el mismo motivo que en las cards del home. */}
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-2.5"
          style={{
            backgroundImage: `url(${AZULEJO})`,
            backgroundSize: 'auto 140%',
            backgroundPosition: '50% 50%',
          }}
        />
      </div>

      <div className="flex flex-col gap-2 flex-1 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="font-display font-extrabold text-klein leading-none flex items-baseline text-xl">
            {project.number}
            <BrandDot />
          </span>
          <span className="text-muted tracking-[0.04em] text-[11px]">
            {categoryLabel(project.type)}
          </span>
        </div>

        <h3 className="font-display font-semibold text-klein tracking-[-0.02em] text-lg sm:text-xl">
          {project.name}
        </h3>
        <p className="text-ink-2 text-sm leading-relaxed">{project.summary}</p>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="mt-auto pt-3 self-start text-klein font-medium text-sm hover:text-carne-tinta transition-colors duration-200"
          >
            Ver proyecto →
          </a>
        )}
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('Todos');

  const counts = useMemo(() => {
    const map: Record<string, number> = { Todos: PROJECTS.length };
    for (const t of PROJECT_TYPES) {
      map[t] = PROJECTS.filter((p) => p.type === t).length;
    }
    return map;
  }, []);

  const visible = useMemo(
    () =>
      filter === 'Todos'
        ? PROJECTS
        : PROJECTS.filter((p) => p.type === filter),
    [filter]
  );

  return (
    <main className="min-h-screen bg-paper flex flex-col" style={{ overflowX: 'clip' }}>
      <SiteNav />

      <section className="px-6 md:px-10 lg:px-16 pt-16 sm:pt-20 md:pt-24 pb-24 flex-1">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-[11px] tracking-[0.06em] text-carne-tinta">02</span>
            <h1
              className="font-display font-semibold text-klein tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
            >
              Proyectos
            </h1>
          </div>
          <p className="text-ink-2 leading-relaxed max-w-xl mb-10 sm:mb-12">
            Nuestros casos, por tipo de proyecto. Elige una categoría para
            filtrar.
          </p>

          {/* Filtros por tipo */}
          <div
            role="tablist"
            aria-label="Filtrar proyectos por tipo"
            className="flex flex-wrap gap-2 sm:gap-3 mb-12 sm:mb-16"
          >
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? 'bg-klein text-paper-pure border border-klein'
                      : 'border border-klein-deep/25 text-klein-deep hover:border-klein hover:text-klein'
                  }`}
                >
                  {f === 'Todos' ? f : `Out.${f}`}
                  <span className={active ? 'opacity-70' : 'text-muted'}>
                    {' '}
                    {counts[f]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grilla filtrable */}
          <motion.div
            layout={!reduceMotion}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <motion.div
                  key={project.number}
                  layout={!reduceMotion}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                >
                  <ProjectGridCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {visible.length === 0 && (
            <p className="text-muted mt-6">
              Aún no hay proyectos de este tipo.
            </p>
          )}
        </div>
      </section>

      <footer className="mt-auto px-6 md:px-10 lg:px-16 py-10 border-t border-klein-deep/15">
        <p className="text-muted text-sm">
          © 2026 Out. Studio. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}
