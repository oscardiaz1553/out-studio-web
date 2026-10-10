import { useCallback, useEffect, useRef, useState } from 'react';
import RevealText from '../components/RevealText';
import TitleFrame from '../components/TitleFrame';
import blog from '../data/blog.json';

const HOME = import.meta.env.BASE_URL;

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
      aria-label={dir === 'prev' ? 'Artículo anterior' : 'Artículo siguiente'}
      className="w-11 h-11 rounded-full border border-klein/40 text-klein flex items-center justify-center transition hover:bg-klein hover:text-paper-pure disabled:opacity-30 disabled:pointer-events-none active:scale-95"
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

/** Los artículos del blog en un carrusel horizontal, al final de la portada:
 *  se desliza en el celular y tiene flechas en pantallas anchas. */
export default function BlogTeaser() {
  const posts = blog.posts.slice(0, 8);
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

  const go = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector('article');
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.clientWidth + 20), behavior: 'smooth' });
  };

  if (posts.length === 0) return null;
  return (
    <section
      id="blog"
      className="bg-paper-pure border-t border-klein-deep/15 px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-10">
          <TitleFrame kind="curly" tone="warm" fontSize="clamp(2rem, 4vw, 3.4rem)">
            <RevealText
              as="h2"
              text="Blog"
              className="font-display font-semibold text-klein tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
            />
          </TitleFrame>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href={`${HOME}blog/`} className="text-klein font-medium hover:underline underline-offset-4 whitespace-nowrap">
              Ver todo el blog
            </a>
            <div className="hidden sm:flex gap-2">
              <Arrow dir="prev" disabled={edges.start} onClick={() => go(-1)} />
              <Arrow dir="next" disabled={edges.end} onClick={() => go(1)} />
            </div>
          </div>
        </div>
        <div
          ref={trackRef}
          onScroll={measure}
          tabIndex={0}
          role="region"
          aria-label="Carrusel de artículos del blog"
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-6 md:scroll-px-10 lg:scroll-px-[max(4rem,calc((100vw-1400px)/2))] overscroll-x-contain pb-2 [&::-webkit-scrollbar]:hidden"
          // A todo el ancho de la pantalla: la pista sale del contenedor hasta los
          // bordes y el relleno deja la primera tarjeta alineada con el título.
          style={{
            scrollbarWidth: 'none',
            marginInline: 'calc(50% - 50vw)',
            paddingInline: 'calc(50vw - 50%)',
          }}
        >
          {posts.map((p) => (
            <article
              key={p.slug}
              className="group relative shrink-0 snap-start w-[82%] sm:w-[46%] lg:w-[calc((100%-2.5rem)/3)] flex flex-col rounded-2xl border border-klein-deep/15 bg-paper p-6 sm:p-7 transition-colors hover:border-klein"
            >
              <p className="text-xs text-carne-tinta mb-3">
                {p.category} · {p.readingMin} min de lectura
              </p>
              <h3 className="font-display font-semibold text-klein tracking-[-0.02em] leading-snug text-xl">
                <a href={`${HOME}blog/${p.slug}/`} className="after:absolute after:inset-0">
                  {p.title}
                </a>
              </h3>
              <p className="mt-3 text-ink-2 leading-relaxed text-sm">{p.description}</p>
              <p className="mt-auto pt-5 text-sm font-medium text-klein group-hover:underline underline-offset-4">
                Leer artículo
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
