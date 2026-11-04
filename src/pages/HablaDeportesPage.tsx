import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import LogoOut from '../components/LogoOut';
import {
  HD_QUESTIONS,
  HD_SECTIONS,
  HD_TOTAL,
  HdAnswer,
  HdAnswers,
  HdQuestion,
  OTRO,
  hdHasAnswer,
} from '../data/habla-deportes';
import { QUOTE_WORKER_URL } from '../data/site';

/**
 * Cuestionario de Habla Deportes. Vive en /habla-deportes/preguntas/ (sin
 * indexar, fuera del menú y del sitemap). Pensado para el celular: una sola
 * columna, opciones grandes, letra de 17 px. Guarda el avance en el navegador
 * y envía las respuestas al Worker, que arma y manda el correo.
 */

const STORE_KEY = 'out-habla-deportes-v1';
const RING =
  'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-paper';
const FIELD =
  `w-full min-h-[56px] bg-paper-pure border border-klein-deep/60 rounded-xl px-4 py-3.5 text-[17px] leading-snug text-klein-deep placeholder:text-muted focus:outline-none focus:border-klein focus:ring-[3px] focus:ring-klein/40`;
const CARD =
  'flex items-center gap-3.5 min-h-[56px] w-full rounded-xl border-2 px-4 py-3 text-[17px] leading-snug text-left cursor-pointer select-none transition-colors duration-150 border-klein-deep/55 bg-paper-pure text-klein-deep active:bg-klein-soft/40 peer-checked:border-klein peer-checked:bg-klein peer-checked:text-paper-pure peer-focus-visible:ring-[3px] peer-focus-visible:ring-klein peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper';

type Status = 'idle' | 'sending' | 'success' | 'error' | 'limit';

const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function Mark({ round, on, rank }: { round: boolean; on: boolean; rank?: number }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 flex items-center justify-center w-7 h-7 border-2 ${round ? 'rounded-full' : 'rounded-md'} ${
        on ? 'border-paper-pure bg-paper-pure text-klein' : 'border-klein-deep/60'
      }`}
    >
      {on &&
        (rank ? (
          <span className="font-display font-extrabold text-[16px] leading-none">{rank}</span>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
    </span>
  );
}

function Question({
  q,
  answer,
  onChange,
}: {
  q: HdQuestion;
  answer: HdAnswer | undefined;
  onChange: (a: HdAnswer) => void;
}) {
  const a = answer ?? {};
  const sel = a.sel ?? [];
  const options = q.otro ? [...(q.options ?? []), OTRO] : q.options ?? [];
  const full = q.max !== undefined && sel.length >= q.max;
  const hintId = `h-${q.n}`;
  const set = (patch: Partial<HdAnswer>) => onChange({ ...a, ...patch });

  const toggle = (opt: string) => {
    if (q.kind === 'uno') {
      set({ sel: [opt], otro: opt === OTRO ? a.otro : '' });
      return;
    }
    const next = sel.includes(opt) ? sel.filter((o) => o !== opt) : [...sel, opt];
    set({ sel: next, otro: next.includes(OTRO) ? a.otro : '' });
  };

  return (
    <fieldset className="flex flex-col gap-3 min-w-0" aria-describedby={q.help || q.max ? hintId : undefined}>
      <legend className="w-full mb-1">
        <span className="flex items-start gap-3">
          <span className="shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-klein text-paper-pure font-display font-extrabold text-[16px]" aria-hidden>
            {q.n}
          </span>
          <span className="min-w-0">
            {q.priority && (
              <span className="inline-block mb-1.5 mr-2 align-middle rounded-full bg-carne text-klein-deep text-[16px] font-medium px-3 py-0.5">
                Prioridad
              </span>
            )}
            <span className="block font-display font-bold text-[21px] sm:text-2xl leading-[1.2] tracking-[-0.01em] text-klein-deep">
              <span className="sr-only">Pregunta {q.n}. </span>
              {q.text}
            </span>
          </span>
        </span>
      </legend>
      <p id={hintId} className="text-[16px] text-ink-2 -mt-1 pl-11" aria-live="polite">
        {q.kind === 'orden'
          ? `${q.help} Elige hasta ${q.max}.${full ? ' Toca uno para quitarlo.' : ''}`
          : q.max
            ? `Elige hasta ${q.max}.${full ? ' Ya elegiste ' + q.max + '. Quita uno para cambiar.' : ''}`
            : q.help ?? ''}
      </p>

      {q.kind === 'orden' && (
        <div className="flex flex-col gap-2.5" role="group" aria-label={q.text}>
          {options.map((opt) => {
            const rank = sel.indexOf(opt) + 1;
            const off = !rank && full;
            return (
              <button
                key={opt}
                type="button"
                aria-pressed={rank > 0}
                aria-disabled={off}
                aria-label={rank ? `${opt}, lugar ${rank}` : opt}
                onClick={() => {
                  if (off) return;
                  set({ sel: rank ? sel.filter((o) => o !== opt) : [...sel, opt] });
                }}
                className={`${CARD} ${RING} ${rank ? '!border-klein !bg-klein !text-paper-pure' : ''} ${off ? 'opacity-45' : ''}`}
              >
                <Mark round on={rank > 0} rank={rank || undefined} />
                <span className="min-w-0">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {(q.kind === 'multi' || q.kind === 'uno') && (
        <div className="flex flex-col gap-2.5">
          {options.map((opt) => {
            const on = sel.includes(opt);
            const off = q.kind === 'multi' && !on && full;
            return (
              <label key={opt} className={`relative block ${off ? 'opacity-45' : ''}`}>
                <input
                  type={q.kind === 'uno' ? 'radio' : 'checkbox'}
                  name={`q${q.n}`}
                  checked={on}
                  disabled={off}
                  onChange={() => toggle(opt)}
                  className="peer sr-only"
                />
                <span className={CARD}>
                  <Mark round={q.kind === 'uno'} on={on} />
                  <span className="min-w-0">{opt}</span>
                </span>
              </label>
            );
          })}
        </div>
      )}

      {q.otro && sel.includes(OTRO) && (
        <label className="flex flex-col gap-1.5">
          <span className="text-[16px] text-ink-2">¿Cuál? (opcional)</span>
          <input
            type="text"
            value={a.otro ?? ''}
            maxLength={200}
            onChange={(e) => set({ otro: e.target.value })}
            className={FIELD}
          />
        </label>
      )}

      {q.kind === 'texto' && (
        <textarea
          rows={4}
          value={a.texto ?? ''}
          maxLength={2000}
          aria-label={q.text}
          placeholder={q.placeholder}
          onChange={(e) => set({ texto: e.target.value })}
          className={`${FIELD} resize-y`}
        />
      )}

      {q.extra && (
        <label className="flex flex-col gap-1.5">
          <span className="text-[16px] text-ink-2">{q.extra} (opcional)</span>
          <input
            type="text"
            value={a.extra ?? ''}
            maxLength={300}
            onChange={(e) => set({ extra: e.target.value })}
            className={FIELD}
          />
        </label>
      )}
    </fieldset>
  );
}

export default function HablaDeportesPage() {
  const [answers, setAnswers] = useState<HdAnswers>({});
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [soloPrioridad, setSoloPrioridad] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [hp, setHp] = useState('');
  const idRef = useRef(newId());
  const sending = useRef(false);
  const [cargado, setCargado] = useState(false);

  // Retoma lo contestado si cerró la página (si el navegador lo permite).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.answers) setAnswers(d.answers);
        if (typeof d.nombre === 'string') setNombre(d.nombre);
        if (typeof d.contacto === 'string') setContacto(d.contacto);
        if (d.id) idRef.current = d.id;
      }
    } catch {
      /* sin almacenamiento: funciona igual, sin guardar */
    }
    setCargado(true);
  }, []);
  useEffect(() => {
    if (!cargado || status === 'success') return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ answers, nombre, contacto, id: idRef.current }));
    } catch {
      /* ignorar */
    }
  }, [answers, nombre, contacto, status, cargado]);

  const done = useMemo(() => HD_QUESTIONS.filter((q) => hdHasAnswer(q, answers[q.n])).length, [answers]);
  const hayRespuestas = done > 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (hp || !hayRespuestas || sending.current) return;
    sending.current = true;
    setStatus('sending');
    try {
      const res = await fetch(QUOTE_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: 'habla-deportes', id: idRef.current, nombre, contacto, answers, hp }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (res.ok && data.ok) {
        try {
          localStorage.removeItem(STORE_KEY);
        } catch {
          /* ignorar */
        }
        setStatus('success');
        window.scrollTo({ top: 0 });
      } else {
        setStatus(res.status === 429 ? 'limit' : 'error');
      }
    } catch {
      setStatus('error');
    } finally {
      sending.current = false;
    }
  };

  const secciones = HD_SECTIONS.map((s) => ({ ...s, questions: s.questions.filter((q) => !soloPrioridad || q.priority) })).filter(
    (s) => s.questions.length > 0,
  );

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-paper text-klein-deep">
        <section className="max-w-[640px] mx-auto px-5 py-16" aria-live="polite">
          <LogoOut className="h-9 w-auto text-klein mb-12" decorative />
          <h1 className="font-display font-extrabold text-[40px] leading-[1.02] tracking-[-0.035em]">Gracias.</h1>
          <p className="mt-5 text-[19px] text-ink-2 leading-snug">Recibimos tus respuestas. Te escribimos pronto.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper text-klein-deep text-[17px]" style={{ overflowX: 'clip' }}>
      {/* Barra de avance fija */}
      <div className="sticky top-0 z-20 bg-paper-pure/95 backdrop-blur border-b border-klein-deep/15">
        <div className="max-w-[640px] mx-auto px-5 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display font-extrabold text-[19px] text-klein" aria-live="polite">
              {done} de {HD_TOTAL}
            </p>
            <p className="text-[16px] text-muted">Todo es opcional</p>
          </div>
          <div className="mt-2 h-2 rounded-full bg-klein-deep/15 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={HD_TOTAL} aria-valuenow={done} aria-label="Preguntas contestadas">
            <div className="h-full bg-klein transition-[width] duration-300" style={{ width: `${(done / HD_TOTAL) * 100}%` }} />
          </div>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="max-w-[640px] mx-auto px-5 pb-28">
        <header className="pt-7">
          <LogoOut className="h-8 w-auto text-klein" decorative />
          <h1 className="mt-8 font-display font-extrabold text-[38px] sm:text-5xl leading-[1.02] tracking-[-0.035em] text-klein-deep">
            Cuéntanos cómo quieres tu web
          </h1>
          <p className="mt-4 text-[19px] leading-snug text-ink-2">
            Son 17 preguntas cortas. Toma unos 5 minutos y nos ayuda a hacer la propuesta a tu medida.
          </p>
          <p className="mt-4 rounded-xl bg-carne text-klein-deep px-4 py-3 text-[17px] leading-snug">
            Si no sabes algo, déjalo en blanco.
          </p>
        </header>

        <div className="mt-8">
          <label className="flex flex-col gap-1.5">
            <span className="font-display font-bold text-[19px]">Tu nombre y cargo</span>
            <span className="text-[16px] text-ink-2">Opcional</span>
            <input type="text" value={nombre} maxLength={120} autoComplete="name" onChange={(e) => setNombre(e.target.value)} placeholder="Ej.: Ana Pérez, directora" className={FIELD} />
          </label>
        </div>

        <div className="mt-7">
          <button
            type="button"
            aria-pressed={soloPrioridad}
            onClick={() => setSoloPrioridad((v) => !v)}
            className={`w-full min-h-[56px] rounded-xl border-2 px-4 py-3 text-[17px] text-left transition-colors ${RING} ${
              soloPrioridad ? 'border-klein bg-klein text-paper-pure' : 'border-klein-deep/55 bg-paper-pure text-klein-deep'
            }`}
          >
            {soloPrioridad ? 'Ver todas las preguntas' : '¿Poco tiempo? Ver solo las 4 de Prioridad'}
          </button>
        </div>

        {secciones.map((s) => (
          <section key={s.id} className="mt-12" aria-labelledby={`sec-${s.id}`}>
            <h2 id={`sec-${s.id}`} className="text-[16px] font-medium tracking-[0.08em] uppercase text-muted mb-5">
              {s.title}
            </h2>
            <div className="flex flex-col gap-11">
              {s.questions.map((q) => (
                <Question key={q.n} q={q} answer={answers[q.n]} onChange={(a) => setAnswers((prev) => ({ ...prev, [q.n]: a }))} />
              ))}
            </div>
          </section>
        ))}

        <section className="mt-12" aria-labelledby="sec-contacto">
          <h2 id="sec-contacto" className="text-[16px] font-medium tracking-[0.08em] uppercase text-muted mb-5">
            Para terminar
          </h2>
          <label className="flex flex-col gap-1.5">
            <span className="font-display font-bold text-[19px]">WhatsApp o correo para contactarte</span>
            <span className="text-[16px] text-ink-2">Opcional</span>
            <input type="text" value={contacto} maxLength={160} autoComplete="off" onChange={(e) => setContacto(e.target.value)} className={FIELD} />
          </label>

          {/* Señuelo para bots: una persona nunca lo ve ni lo llena */}
          <div aria-hidden className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
            <label>
              No llenar este campo
              <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {status === 'limit' && (
              <p className="rounded-xl border-2 border-carne-tinta bg-paper-pure px-4 py-3 text-[17px] text-carne-tinta leading-snug" role="alert">
                Se enviaron muchas respuestas desde esta conexión. Tus respuestas siguen aquí: intenta de nuevo en un rato.
              </p>
            )}
            {status === 'error' && (
              <p className="rounded-xl border-2 border-carne-tinta bg-paper-pure px-4 py-3 text-[17px] text-carne-tinta leading-snug" role="alert">
                No se pudo enviar. No perdiste nada: tus respuestas siguen aquí. Revisa tu conexión y toca «Enviar» otra vez.
              </p>
            )}
            <button
              type="submit"
              disabled={!hayRespuestas || status === 'sending'}
              className={`w-full min-h-[60px] rounded-full bg-klein text-paper-pure font-medium text-[18px] px-8 py-4 transition-[background-color,opacity,transform] duration-150 active:scale-[0.98] hover:bg-klein-mid disabled:opacity-55 disabled:pointer-events-none ${RING}`}
            >
              {status === 'sending' ? 'Enviando…' : 'Enviar respuestas'}
            </button>
            {!hayRespuestas && <p className="text-[16px] text-ink-2">Responde al menos una pregunta para poder enviar.</p>}
            <p className="text-[16px] text-ink-2 leading-snug">Usamos tus respuestas solo para preparar la propuesta de tu web.</p>
          </div>
        </section>
        
      </form>
    </main>
  );
}
