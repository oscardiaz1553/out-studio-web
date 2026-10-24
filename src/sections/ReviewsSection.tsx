import { useEffect, useRef, useState } from 'react';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import RevealText from '../components/RevealText';
import TitleFrame from '../components/TitleFrame';
import { DEMO_REVIEWS, REVIEWS, VIDEO_TESTIMONIAL } from '../data/reviews';
import { GOOGLE_REVIEW_URL } from '../data/site';

const BASE = import.meta.env.BASE_URL;

/** Foto de perfil de quien reseña; sin foto, su inicial sobre el azul de la marca. */
function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    return (
      <img
        src={`${BASE}${src}`}
        alt=""
        width={96}
        height={96}
        loading="lazy"
        className="w-12 h-12 rounded-full object-cover shrink-0 bg-paper-pure ring-2 ring-carne/40"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="w-12 h-12 rounded-full bg-carne text-klein-deep font-display font-bold text-xl flex items-center justify-center shrink-0"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span
      role="img"
      aria-label={`${value} de 5 estrellas`}
      className="inline-flex gap-0.5 text-carne"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill={n <= value ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M10 1.8l2.4 5.1 5.6.7-4.1 3.9 1 5.5L10 14.3 5.1 17l1-5.5L2 7.6l5.6-.7L10 1.8z" />
        </svg>
      ))}
    </span>
  );
}

const ARROW = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Las reseñas se reciben únicamente en el perfil de Google de Out (el enlace
// lo manda Out a sus clientes). Las que se muestran aquí se eligen a mano en
// src/data/reviews.ts, con permiso de quien las escribió.
export default function ReviewsSection() {
  // ?resenas=demo muestra reseñas de ejemplo (ficticias) para ver el diseño.
  const demo =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('resenas') === 'demo';
  const reviews = REVIEWS.length > 0 ? REVIEWS : demo ? DEMO_REVIEWS : [];
  const hasVideo = REVIEWS.length > 0;
  const hasReviews = reviews.length > 0;
  // El video de Hugo va de primero; después, las reseñas de Google.
  const total = reviews.length + (hasVideo ? 1 : 0);

  const track = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [index, setIndex] = useState(0);

  // Flechas y puntos solo cuando las tarjetas no caben en pantalla.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      setOverflow(el.scrollWidth > el.clientWidth + 4);
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const d = Math.abs((c as HTMLElement).offsetLeft - el.offsetLeft - el.scrollLeft);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex(best);
    };
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [total]);

  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 0, behavior: 'smooth' });
  };

  return (
    <section
      id="resenas"
      className="relative overflow-hidden bg-paper-pure border-t border-klein-deep/15 px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20"
    >
      <div className="relative max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-4 mb-3">
          <TitleFrame kind="square" tone="warm" fontSize="clamp(2rem, 4vw, 3.4rem)">
            <RevealText
              as="h2"
              text="Reseñas"
              className="font-display font-semibold text-klein tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
            />
          </TitleFrame>
          {hasReviews && overflow && (
            <div className="hidden sm:flex gap-2">
              <button
                type="button"
                onClick={() => goTo(Math.max(0, index - 1))}
                disabled={index === 0}
                aria-label="Reseña anterior"
                className="w-11 h-11 rounded-full bg-klein text-paper-pure flex items-center justify-center rotate-180 disabled:opacity-30"
              >
                {ARROW}
              </button>
              <button
                type="button"
                onClick={() => goTo(Math.min(total - 1, index + 1))}
                disabled={index >= total - 1}
                aria-label="Reseña siguiente"
                className="w-11 h-11 rounded-full bg-klein text-paper-pure flex items-center justify-center disabled:opacity-30"
              >
                {ARROW}
              </button>
            </div>
          )}
        </div>

        {hasReviews ? (
          <>
            <div
              ref={track}
              role="region"
              aria-label="Reseñas de clientes"
              tabIndex={0}
              className="mt-10 sm:mt-12 flex gap-5 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-2 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              {hasVideo && (
                <article className="snap-start shrink-0 self-start w-[92%] sm:w-[640px] rounded-[28px] bg-klein-deep text-paper-pure p-3 sm:p-4 flex flex-col gap-4">
                  <video
                    controls
                    playsInline
                    preload="none"
                    poster={`${BASE}${VIDEO_TESTIMONIAL.poster}`}
                    aria-label={`${VIDEO_TESTIMONIAL.name}, ${VIDEO_TESTIMONIAL.role}: su opinión sobre el sitio nuevo`}
                    className="w-full aspect-video rounded-[20px] bg-klein-deep object-cover"
                  >
                    <source src={`${BASE}${VIDEO_TESTIMONIAL.src}`} type="video/mp4" />
                  </video>
                  <div className="px-3 pb-3 sm:px-4 sm:pb-3">
                    <p className="text-xs text-paper-pure/70">{VIDEO_TESTIMONIAL.label}</p>
                    <p className="mt-1 text-sm font-semibold text-carne">{VIDEO_TESTIMONIAL.name}</p>
                    <p className="text-xs text-paper-pure/70">{VIDEO_TESTIMONIAL.role}</p>
                  </div>
                </article>
              )}
              {reviews.map((r, i) => (
                <article
                  key={`${r.name}-${i}`}
                  className="snap-start shrink-0 w-[86%] sm:w-[460px] rounded-[28px] bg-klein-deep text-paper-pure p-7 sm:p-9 flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3">
                    {r.rating ? <Stars value={r.rating} /> : null}
                    <span className="text-xs text-paper-pure/70">Reseña en Google</span>
                  </div>
                  <p className="text-[1.15rem] sm:text-[1.25rem] leading-[1.55] text-paper-pure">
                    “{r.quote}”
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    <Avatar name={r.name} src={r.avatar} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-carne">{r.name}</p>
                      {r.role && <p className="text-xs text-paper-pure/70">{r.role}</p>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {overflow && (
              <div className="mt-5 flex gap-2" role="tablist" aria-label="Elegir reseña">
                {Array.from({ length: total }, (_, i) => (
                  <button
                    key={`dot-${i}`}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Ver la reseña ${i + 1} de ${total}`}
                    aria-selected={i === index}
                    role="tab"
                    className={`h-2.5 rounded-full transition-all ${
                      i === index ? 'w-7 bg-klein' : 'w-2.5 bg-klein/25'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <FadeIn className="mt-10 sm:mt-14">
            <p
              className="font-display font-extrabold text-klein tracking-[-0.04em] leading-[1] max-w-[18ch]"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 5.4rem)' }}
            >
              Lo que dicen de trabajar con Out.
            </p>
            <p className="text-ink-2 leading-relaxed max-w-md mt-6">
              Aquí van las palabras de las marcas con las que ya trabajamos.
            </p>
          </FadeIn>
        )}

        {GOOGLE_REVIEW_URL && (
          <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-x-5 gap-y-3">
            <AccentButton href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer">
              Reseñar en Google
            </AccentButton>
            <p className="text-sm text-muted">
              ¿Trabajaste con Out? Cuéntanos cómo te fue.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
