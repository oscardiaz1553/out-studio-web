import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BrandDot } from '../components/Brand';
import RevealText from '../components/RevealText';
import TitleFrame, { FrameKind, Sym } from '../components/TitleFrame';
import { categoryLabel, FEATURED_PROJECTS, type Project } from '../data/projects';

const PROJECTS_URL = `${import.meta.env.BASE_URL}proyectos.html`;
const KINDS: FrameKind[] = ['square', 'curly', 'paren', 'angle'];
const SPRING = { type: 'spring', stiffness: 320, damping: 26 } as const;
// El nombre va en una sola línea: el tamaño baja con el ancho de la pantalla.
const NAME_SIZE = 'clamp(2.1rem, 8.6vw, 7rem)';

/**
 * Un proyecto como renglón de índice editorial. Apagado, el nombre es un
 * azul tenue. Al activarse (hover en escritorio, o al pasar por el centro de la
 * pantalla al hacer scroll) se rellena, los símbolos de la marca lo encierran
 * y el punto naranja, lo que se sale, salta fuera del marco.
 */
function ProjectRow({
  project,
  index,
  active,
  onHover,
  register,
}: {
  project: Project;
  index: number;
  active: boolean;
  onHover: (i: number | null) => void;
  register: (i: number, el: HTMLElement | null) => void;
}) {
  const reduceMotion = useReducedMotion();
  const live = Boolean(project.url) && project.status !== 'in-progress';
  const kind = KINDS[index % KINDS.length];
  const Tag = live ? 'a' : 'div';

  return (
    <li
      ref={(el) => register(index, el)}
      data-index={index}
      className="border-t border-klein-deep/20 last:border-b"
    >
      <Tag
        {...(live ? { href: project.url, target: '_blank', rel: 'noreferrer' } : {})}
        onPointerEnter={(e: React.PointerEvent) => e.pointerType === 'mouse' && onHover(index)}
        onPointerLeave={(e: React.PointerEvent) => e.pointerType === 'mouse' && onHover(null)}
        className={`group grid grid-cols-1 lg:grid-cols-[4.5rem_1fr_19rem] items-center gap-x-6 gap-y-3 py-6 sm:py-8 ${
          live ? 'lg:cursor-none' : ''
        }`}
      >
        <div className="flex items-center gap-3 text-xs text-carne-tinta lg:flex-col lg:items-start lg:gap-1">
          <span className="font-display font-bold text-sm tabular-nums text-klein-deep">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{categoryLabel(project.type)}</span>
        </div>

        <div className="relative min-w-0 px-[0.62em]" style={{ fontSize: NAME_SIZE }}>
          <span className="relative inline-flex items-center">
            <motion.span
              aria-hidden
              className="absolute right-full mr-[0.1em] flex text-carne-deep"
              initial={false}
              animate={{ opacity: active ? 1 : 0, x: active ? 0 : '0.35em' }}
              transition={SPRING}
            >
              <Sym kind={kind} />
            </motion.span>
            <h3
              className="font-display font-extrabold tracking-[-0.045em] leading-[1.02] whitespace-nowrap transition-colors duration-300"
              style={{ color: active ? '#1B2FCC' : 'rgba(188,96,57,0.3)' }}
            >
              {project.name}
            </h3>
            <motion.span
              aria-hidden
              className="absolute left-full ml-[0.1em] flex text-carne-deep"
              initial={false}
              animate={{ opacity: active ? 1 : 0, x: active ? 0 : '-0.35em' }}
              transition={SPRING}
            >
              <Sym kind={kind} flip />
            </motion.span>
            {/* El punto: quieto junto al nombre; activo, salta fuera del marco. */}
            <motion.span
              aria-hidden
              className="absolute left-full bottom-[0.2em] ml-[0.04em] flex"
              initial={false}
              animate={
                reduceMotion
                  ? { x: active ? '0.56em' : 0 }
                  : active
                    ? { x: '0.56em', y: ['0em', '-0.5em', '0em'] }
                    : { x: 0, y: '0em' }
              }
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
                <BrandDot />
            </motion.span>
          </span>
        </div>

        <div className="flex flex-col gap-2 lg:items-end lg:text-right">
          <p className="text-ink-2 leading-relaxed text-sm sm:text-base max-w-[40ch]">
            {project.summary}
          </p>
          {live ? (
            <span className="text-sm font-medium text-klein underline underline-offset-4 decoration-klein/30 group-hover:decoration-klein lg:hidden">
              Ver sitio
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 self-start lg:self-end rounded-full bg-klein-deep/[0.07] px-2.5 py-1 text-[11px] font-medium text-klein-deep">
              <span className="w-1.5 h-1.5 rounded-full bg-carne-deep" />
              En desarrollo
            </span>
          )}
        </div>
      </Tag>
    </li>
  );
}

export default function ProjectsSection() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const [centered, setCentered] = useState<number | null>(null);
  const rows = useRef<(HTMLElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);

  // El renglón que cruza la franja central de la pantalla se enciende solo,
  // así el efecto también se ve en el celular, sin hover.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = Number((e.target as HTMLElement).dataset.index);
          if (e.isIntersecting) setCentered(i);
          else setCentered((c) => (c === i ? null : c));
        });
      },
      { rootMargin: '-42% 0px -42% 0px' },
    );
    rows.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Escritorio: un sello "Ver sitio" sigue al cursor sobre los proyectos en línea.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 400, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 400, damping: 32, mass: 0.5 });
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !listRef.current) return;
    const r = listRef.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };
  const hoveredProject = hovered === null ? null : FEATURED_PROJECTS[hovered];
  const showCursor =
    !reduceMotion &&
    Boolean(hoveredProject?.url) &&
    hoveredProject?.status !== 'in-progress';

  const active = hovered ?? centered;

  return (
    <section
      id="proyectos"
      className="relative z-10 overflow-hidden bg-carne px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20"
    >
      <div className="relative max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
          <TitleFrame kind="curly" tone="warm" fontSize="clamp(2rem, 4vw, 3.4rem)">
            <RevealText
              as="h2"
              text="Proyectos"
              className="font-display font-semibold text-klein tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
            />
          </TitleFrame>
          <a
            href={PROJECTS_URL}
            className="text-klein font-medium text-sm sm:text-base underline underline-offset-4 decoration-klein/30 hover:decoration-klein whitespace-nowrap"
          >
            Ver todos
          </a>
        </div>

        <ul ref={listRef} onPointerMove={onMove} className="relative">
          {FEATURED_PROJECTS.map((p, i) => (
            <ProjectRow
              key={p.number}
              project={p}
              index={i}
              active={active === i}
              onHover={setHovered}
              register={(idx, el) => {
                rows.current[idx] = el;
              }}
            />
          ))}

          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
              style={{ x: sx, y: sy }}
            >
              <div className="translate-x-5 translate-y-5">
                <motion.div
                  initial={false}
                  animate={{ scale: showCursor ? 1 : 0, opacity: showCursor ? 1 : 0 }}
                  transition={SPRING}
                  className="w-24 h-24 rounded-full bg-klein text-carne flex items-center justify-center text-sm font-medium shadow-[0_14px_40px_rgba(27,47,204,0.35)]"
                >
                  Ver sitio
                </motion.div>
              </div>
            </motion.div>
          )}
        </ul>
      </div>
    </section>
  );
}
