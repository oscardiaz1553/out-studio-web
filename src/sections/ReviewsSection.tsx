import TitleFrame from '../components/TitleFrame';
import { FormEvent, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import RevealText from '../components/RevealText';
import { DEMO_REVIEWS, REVIEWS } from '../data/reviews';
import { EMAIL, WEB3FORMS_ACCESS_KEY } from '../data/site';

const EASE = [0.16, 1, 0.3, 1] as const;

const INPUT =
  'w-full bg-paper border border-klein-deep/25 rounded-lg px-4 py-3 text-klein-deep placeholder-muted focus:border-klein transition-colors duration-200';

type Status = 'idle' | 'sending' | 'success' | 'error';

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

function ReviewForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  const valid = name.trim() && email.trim() && rating > 0 && text.trim() && consent;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid) return;
    // Trampa para bots: checkbox oculto que una persona nunca marca.
    if (new FormData(e.currentTarget).get('botcheck')) return;

    const message = [
      `Nombre: ${name}`,
      `Cargo / empresa: ${role || '—'}`,
      `Email (no se publica): ${email}`,
      `Calificación: ${rating} de 5`,
      `Autoriza publicar su reseña: Sí`,
      '',
      'Reseña:',
      text,
      '',
      '(Para publicarla, agrégala en src/data/reviews.ts)',
    ].join('\n');
    const subject = `Nueva reseña de ${name} (${rating}/5) — pendiente de aprobar`;

    if (!WEB3FORMS_ACCESS_KEY) {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(message)}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject,
          from_name: name,
          name,
          email,
          message,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-3 py-2">
        <span aria-hidden className="w-3.5 h-3.5 rounded-full bg-carne-deep" />
        <p className="font-display font-semibold text-klein text-xl">
          ¡Gracias por tu reseña!
        </p>
        <p className="text-ink-2 leading-relaxed max-w-md">
          La revisamos y, con tu autorización, la publicamos aquí muy pronto.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-medium text-klein hover:underline mt-1"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-[11px] tracking-[0.04em] text-muted">Nombre *</span>
          <input
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[11px] tracking-[0.04em] text-muted">
            Cargo y empresa
          </span>
          <input
            autoComplete="organization-title"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ej: Fundadora, BARCI"
            className={INPUT}
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-[11px] tracking-[0.04em] text-muted">
          Email * (no se publica)
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={INPUT}
        />
      </label>

      <fieldset>
        <legend className="text-[11px] tracking-[0.04em] text-muted mb-2">
          Calificación *
        </legend>
        <div className="flex gap-1.5" role="radiogroup" aria-label="Calificación">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                className="peer sr-only"
              />
              <span
                className="block p-1 rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-klein"
                aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 20 20"
                  fill={n <= rating ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.4"
                  className="text-carne-deep"
                  aria-hidden
                >
                  <path d="M10 1.8l2.4 5.1 5.6.7-4.1 3.9 1 5.5L10 14.3 5.1 17l1-5.5L2 7.6l5.6-.7L10 1.8z" />
                </svg>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="text-[11px] tracking-[0.04em] text-muted">Tu reseña *</span>
        <textarea
          required
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Cómo fue trabajar con Out? ¿Qué cambió en tu negocio?"
          className={`${INPUT} resize-none`}
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-ink-2 leading-snug cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-klein"
          required
        />
        Autorizo que Out publique mi reseña con mi nombre y cargo en su sitio web.
      </label>
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-4">
        <AccentButton type="submit" disabled={!valid || status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar reseña'}
        </AccentButton>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-medium text-klein-deep hover:text-klein"
        >
          Cancelar
        </button>
      </div>
      {status === 'error' && (
        <p className="text-carne-tinta text-sm" role="alert">
          No se pudo enviar. Escríbenos a{' '}
          <a href={`mailto:${EMAIL}`} className="underline">
            {EMAIL}
          </a>
          .
        </p>
      )}
    </form>
  );
}

export default function ReviewsSection() {
  const reduceMotion = useReducedMotion();
  const [formOpen, setFormOpen] = useState(false);
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
            unit="char"
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
                delay={i * 0.06}
                y={24}
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
          <FadeIn y={24} className="mt-10 sm:mt-14">
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

        <div className="mt-10 sm:mt-12 max-w-[720px]">
          <AnimatePresence initial={false} mode="wait">
            {formOpen ? (
              <motion.div
                key="form"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="rounded-2xl border border-klein-deep/15 bg-paper p-6 sm:p-8"
              >
                <ReviewForm onDone={() => setFormOpen(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-3"
              >
                <AccentButton onClick={() => setFormOpen(true)}>
                  Deja tu reseña
                </AccentButton>
                <p className="text-sm text-muted">
                  ¿Trabajaste con Out? Cuéntanos cómo te fue.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
