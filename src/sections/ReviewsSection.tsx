import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import RevealText from '../components/RevealText';
import TitleFrame from '../components/TitleFrame';
import { DEMO_REVIEWS, REVIEWS } from '../data/reviews';
import { GOOGLE_REVIEW_URL } from '../data/site';

function Stars({ value }: { value: number }) {
  return (
    <span
      role="img"
      aria-label={`${value} de 5 estrellas`}
      className="inline-flex gap-0.5 text-carne-deep"
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

// Las reseñas se reciben únicamente en el perfil de Google de Out (el enlace
// lo manda Out a sus clientes). Las que se muestran aquí se eligen a mano en
// src/data/reviews.ts, con permiso de quien las escribió.
export default function ReviewsSection() {
  // ?resenas=demo muestra reseñas de ejemplo (ficticias) para ver el diseño.
  const demo =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('resenas') === 'demo';
  const reviews = REVIEWS.length > 0 ? REVIEWS : demo ? DEMO_REVIEWS : [];
  const hasReviews = reviews.length > 0;

  return (
    <section
      id="resenas"
      className="relative overflow-hidden bg-paper-pure border-t border-klein-deep/15 px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20"
    >
      <div className="relative max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-3">
          <TitleFrame kind="square" tone="warm" fontSize="clamp(2rem, 4vw, 3.4rem)">
            <RevealText
              as="h2"
              text="Reseñas"
              className="font-display font-semibold text-klein tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
            />
          </TitleFrame>
        </div>

        {hasReviews ? (
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <FadeIn
                key={`${r.name}-${i}`}
                className="rounded-2xl border border-klein-deep/15 bg-paper p-7 flex flex-col gap-5"
              >
                {r.rating ? <Stars value={r.rating} /> : null}
                <p className="font-display font-semibold text-klein tracking-[-0.02em] leading-snug text-xl">
                  “{r.quote}”
                </p>
                <div className="mt-auto">
                  <p className="text-sm font-medium text-klein-deep">{r.name}</p>
                  {r.role && <p className="text-xs text-muted">{r.role}</p>}
                </div>
              </FadeIn>
            ))}
          </div>
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
