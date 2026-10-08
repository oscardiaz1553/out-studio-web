import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import LogoOut from '../components/LogoOut';
import RevealText from '../components/RevealText';
import { AZULEJO_BAND } from '../data/botanica';
import {
  Answer,
  Answers,
  COMMON_QUESTIONS,
  Contact,
  PROJECT_TYPES,
  Question,
  answerKey,
  buildBrief,
  encodePayload,
  isAnswered,
} from '../data/quote';
import { EMAIL, WEB3FORMS_ACCESS_KEY } from '../data/site';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const INPUT_CLASSES =
  'w-full bg-paper-pure border border-klein-deep/25 rounded-lg px-4 py-3 text-klein-deep placeholder-muted focus:border-klein transition-colors duration-200';

// Tarjeta de opción: el <input> real (radio/checkbox) queda oculto pero
// accesible por teclado; el estado se pinta con peer-checked.
const OPTION_BASE =
  'flex items-center rounded-xl border px-4 py-3.5 text-[15px] leading-snug cursor-pointer select-none transition-colors duration-150 border-klein-deep/20 text-klein-deep hover:border-klein peer-checked:border-klein peer-checked:bg-klein peer-checked:text-paper-pure peer-focus-visible:ring-2 peer-focus-visible:ring-klein peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper-pure';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const EMPTY_CONTACT: Contact = { name: '', email: '', phone: '', company: '' };

function OptionGrid({
  name,
  options,
  multi,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  multi: boolean;
  value: Answer | undefined;
  onChange: (next: Answer) => void;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const toggle = (opt: string) => {
    if (!multi) return onChange(opt);
    onChange(
      selected.includes(opt)
        ? selected.filter((o) => o !== opt)
        : [...selected, opt],
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map((opt) => (
        <label key={opt} className="relative block">
          <input
            type={multi ? 'checkbox' : 'radio'}
            name={name}
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="peer sr-only"
          />
          <span className={OPTION_BASE}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function QuestionField({
  q,
  scope,
  answers,
  setAnswer,
}: {
  q: Question;
  scope: string;
  answers: Answers;
  setAnswer: (key: string, value: Answer) => void;
}) {
  const key = answerKey(scope, q.id);
  const value = answers[key];

  return (
    <fieldset className="min-w-0">
      <legend className="font-display font-semibold text-klein-deep text-lg sm:text-xl leading-snug tracking-[-0.01em] mb-1">
        {q.label}
        {q.required && <span className="text-carne-tinta"> *</span>}
      </legend>
      {q.help && <p className="text-xs text-muted mb-3">{q.help}</p>}
      {!q.help && <div className="mb-3" />}

      {(q.kind === 'single' || q.kind === 'multi') && q.options && (
        <OptionGrid
          name={key}
          options={q.options}
          multi={q.kind === 'multi'}
          value={value}
          onChange={(next) => setAnswer(key, next)}
        />
      )}

      {q.kind === 'text' && (
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => setAnswer(key, e.target.value)}
          placeholder={q.placeholder}
          className={INPUT_CLASSES}
          aria-label={q.label}
        />
      )}

      {q.kind === 'long' && (
        <textarea
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => setAnswer(key, e.target.value)}
          placeholder={q.placeholder}
          rows={4}
          className={`${INPUT_CLASSES} resize-none`}
          aria-label={q.label}
        />
      )}
    </fieldset>
  );
}

/** Estado de la encuesta: vive fuera de la pantalla para que, si el cliente
 *  cierra y vuelve a abrir, retome donde iba. */
function useQuoteForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<FormStatus>('idle');

  // Los pasos dependen de lo que el cliente elija: tipos → un bloque por cada
  // tipo elegido → datos del proyecto → contacto.
  const types = useMemo(
    () => PROJECT_TYPES.filter((t) => selected.includes(t.id)),
    [selected],
  );
  const steps = useMemo(
    () => ['tipos', ...types.map((t) => t.id), 'comun', 'contacto'],
    [types],
  );
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const isLast = stepIndex >= steps.length - 1;
  const currentType = types.find((t) => t.id === step);

  const setAnswer = (key: string, value: Answer) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  // Un solo tipo de proyecto por solicitud.
  const selectType = (id: string) => setSelected([id]);

  const canContinue = (() => {
    if (step === 'tipos') return selected.length > 0;
    if (step === 'comun') {
      return COMMON_QUESTIONS.every((q) =>
        isAnswered(q, answers[answerKey('comun', q.id)]),
      );
    }
    if (step === 'contacto') {
      return contact.name.trim() !== '' && contact.email.trim() !== '';
    }
    return (currentType?.questions ?? []).every((q) =>
      isAnswered(q, answers[answerKey(currentType!.id, q.id)]),
    );
  })();

  const go = (delta: number) =>
    setStepIndex((i) => Math.max(0, Math.min(steps.length - 1, i + delta)));

  const reset = () => {
    setSelected([]);
    setAnswers({});
    setContact(EMPTY_CONTACT);
    setStepIndex(0);
    setStatus('idle');
  };

  const submit = async (form: HTMLFormElement) => {
    // Trampa para bots: este checkbox está oculto, una persona nunca lo marca.
    if (new FormData(form).get('botcheck')) return;

    // Link al generador de cotización con todo el brief prellenado (viaja en
    // el hash, nunca pasa por un servidor).
    const payload = await encodePayload({
      v: 1,
      contact,
      types: selected,
      answers,
    });
    const builderUrl = `${window.location.origin}${import.meta.env.BASE_URL}cotizar.html#q=${payload}`;
    const brief = `${buildBrief(selected, answers, contact)}\n\n=== ARMAR COTIZACIÓN ===\nAbre este link para generar el dossier con todo prellenado:\n${builderUrl}`;
    const labels = types.map((t) => t.label).join(' + ');
    const subject = `Solicitud de cotización: ${contact.name} — ${labels}`;

    if (!WEB3FORMS_ACCESS_KEY) {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(brief)}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject,
          from_name: contact.name,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          message: brief,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return {
    selected,
    answers,
    contact,
    setContact,
    stepIndex,
    status,
    types,
    steps,
    step,
    isLast,
    currentType,
    setAnswer,
    selectType,
    canContinue,
    go,
    reset,
    submit,
  };
}

type QuoteForm = ReturnType<typeof useQuoteForm>;

/** Tarjetas de tipo de proyecto: el primer paso de la encuesta. Se usan en la
 *  página (donde elegir una abre la pantalla completa) y dentro de ella. */
function TypeCards({
  selected,
  onSelect,
}: {
  selected: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {PROJECT_TYPES.map((t) => (
        <label key={t.id} className="relative block">
          <input
            type="radio"
            name="tipo-proyecto"
            checked={selected.includes(t.id)}
            onChange={() => onSelect(t.id)}
            // click además de change: tocar el que ya estaba elegido no
            // dispara change, pero sí debe volver a abrir la pantalla.
            onClick={() => onSelect(t.id)}
            className="peer sr-only"
          />
          <span
            className={`${OPTION_BASE} flex-col !items-start gap-1 h-full text-left`}
          >
            <span className="font-display font-semibold text-base">
              {t.label}
            </span>
            <span className="text-xs opacity-75">{t.blurb}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Pantalla completa de la encuesta: una sola cosa en foco, sin el resto de
 *  la página. Barra de progreso arriba, navegación siempre visible abajo. */
function QuoteScreen({
  form,
  onClose,
}: {
  form: QuoteForm;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const {
    stepIndex,
    steps,
    step,
    isLast,
    currentType,
    status,
    contact,
    answers,
    canContinue,
  } = form;

  // Bloquea el scroll de la página de fondo, mueve el foco adentro, cierra con
  // Escape y mantiene el Tab dentro del diálogo; al cerrar devuelve el foco.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      html.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [onClose]);

  // Cada paso arranca desde arriba (los bloques largos, sobre todo en móvil).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [stepIndex, reduceMotion]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canContinue) return;
    if (isLast) void form.submit(e.currentTarget);
    else form.go(1);
  };

  const finish = () => {
    form.reset();
    onClose();
  };

  const panelMotion = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 },
    transition: { duration: 0.25, ease: EASE_OUT },
  };

  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Cotiza tu proyecto"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[1000] bg-paper flex flex-col outline-none"
    >
      {/* Barra superior */}
      <header className="shrink-0 flex items-center justify-between px-5 sm:px-10 h-16 sm:h-20">
        <LogoOut decorative className="h-8 sm:h-9 w-auto text-klein" />
        {status !== 'success' && (
          <span className="text-[11px] tracking-[0.06em] text-muted">
            Paso {stepIndex + 1} de {steps.length}
          </span>
        )}
        <button
          type="button"
          onClick={status === 'success' ? finish : onClose}
          aria-label="Cerrar la cotización"
          className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-klein-deep hover:bg-klein-deep/10 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {status !== 'success' && (
        <div
          className="shrink-0 h-1 bg-klein-deep/10"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={stepIndex + 1}
          aria-label="Progreso de la cotización"
        >
          <div
            className="h-full bg-klein transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {status === 'success' ? (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[640px] mx-auto px-6 py-16 sm:py-24 flex flex-col items-start gap-4">
            <div
              aria-hidden
              className="w-full h-14 rounded-xl border border-klein/15 mb-4"
              style={{
                backgroundImage: `url(${AZULEJO_BAND})`,
                backgroundRepeat: 'repeat-x',
                backgroundSize: 'auto 100%',
              }}
            />
            <span aria-hidden className="w-3.5 h-3.5 rounded-full bg-carne-deep" />
            <h2 className="font-display font-semibold text-klein text-3xl sm:text-4xl tracking-[-0.03em]">
              Recibimos tu solicitud.
            </h2>
            <p className="text-ink-2 leading-relaxed text-lg max-w-md">
              Gracias, {contact.name.split(' ')[0]}. Revisamos tu caso y te
              enviamos la cotización a {contact.email} en las próximas 24 a 48
              horas.
            </p>
            <AccentButton onClick={finish} className="mt-4">
              Cerrar
            </AccentButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-8 sm:py-14">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} {...panelMotion}>
                  {step === 'tipos' && (
                    <>
                      <h2 className="font-display font-semibold text-klein text-3xl sm:text-5xl tracking-[-0.035em] leading-[1.05] mb-3">
                        ¿Qué necesitas?
                      </h2>
                      <p className="text-ink-2 leading-relaxed mb-8 max-w-lg">
                        Cada proyecto es distinto, así que no te damos una
                        cifra al azar: cuéntanos y te enviamos una cotización a
                        la medida en 24 a 48 horas. Elige la opción que más
                        se acerque.
                      </p>
                      <TypeCards
                        selected={form.selected}
                        onSelect={form.selectType}
                      />
                    </>
                  )}

                  {currentType && (
                    <>
                      <h2 className="font-display font-semibold text-klein text-3xl sm:text-5xl tracking-[-0.035em] leading-[1.05] mb-3">
                        {currentType.label}
                      </h2>
                      <p className="text-ink-2 leading-relaxed mb-10">
                        {currentType.blurb}
                      </p>
                      <div className="flex flex-col gap-10">
                        {currentType.questions.map((q) => (
                          <QuestionField
                            key={q.id}
                            q={q}
                            scope={currentType.id}
                            answers={answers}
                            setAnswer={form.setAnswer}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {step === 'comun' && (
                    <>
                      <h2 className="font-display font-semibold text-klein text-3xl sm:text-5xl tracking-[-0.035em] leading-[1.05] mb-3">
                        Sobre tu proyecto
                      </h2>
                      <p className="text-ink-2 leading-relaxed mb-10">
                        Lo último antes de tus datos de contacto.
                      </p>
                      <div className="flex flex-col gap-10">
                        {COMMON_QUESTIONS.map((q) => (
                          <QuestionField
                            key={q.id}
                            q={q}
                            scope="comun"
                            answers={answers}
                            setAnswer={form.setAnswer}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {step === 'contacto' && (
                    <>
                      <h2 className="font-display font-semibold text-klein text-3xl sm:text-5xl tracking-[-0.035em] leading-[1.05] mb-3">
                        ¿A dónde te enviamos la cotización?
                      </h2>
                      <p className="text-ink-2 leading-relaxed mb-10">
                        Usamos tus datos solo para responderte.
                      </p>
                      <div className="flex flex-col gap-4">
                        <label className="flex flex-col gap-2">
                          <span className="text-[11px] tracking-[0.04em] text-muted">
                            Nombre *
                          </span>
                          <input
                            type="text"
                            required
                            autoComplete="name"
                            value={contact.name}
                            onChange={(e) =>
                              form.setContact({ ...contact, name: e.target.value })
                            }
                            placeholder="Tu nombre"
                            className={INPUT_CLASSES}
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <span className="text-[11px] tracking-[0.04em] text-muted">
                            Email *
                          </span>
                          <input
                            type="email"
                            required
                            autoComplete="email"
                            value={contact.email}
                            onChange={(e) =>
                              form.setContact({ ...contact, email: e.target.value })
                            }
                            placeholder="tu@email.com"
                            className={INPUT_CLASSES}
                          />
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <label className="flex flex-col gap-2">
                            <span className="text-[11px] tracking-[0.04em] text-muted">
                              WhatsApp o teléfono
                            </span>
                            <input
                              type="tel"
                              autoComplete="tel"
                              value={contact.phone}
                              onChange={(e) =>
                                form.setContact({ ...contact, phone: e.target.value })
                              }
                              placeholder="+57 …"
                              className={INPUT_CLASSES}
                            />
                          </label>
                          <label className="flex flex-col gap-2">
                            <span className="text-[11px] tracking-[0.04em] text-muted">
                              Empresa o marca
                            </span>
                            <input
                              type="text"
                              autoComplete="organization"
                              value={contact.company}
                              onChange={(e) =>
                                form.setContact({ ...contact, company: e.target.value })
                              }
                              className={INPUT_CLASSES}
                            />
                          </label>
                        </div>
                        <input
                          type="checkbox"
                          name="botcheck"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden
                          className="hidden"
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navegación siempre a la vista */}
          <div className="shrink-0 border-t border-klein-deep/15 bg-paper-pure">
            <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
              {stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => form.go(-1)}
                  className="text-sm font-medium text-klein-deep hover:text-klein transition-colors px-2 py-2"
                >
                  Atrás
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-4">
                {status === 'error' && (
                  <p className="text-carne-tinta text-xs leading-snug text-right max-w-[220px]" role="alert">
                    No se pudo enviar. Escríbenos a{' '}
                    <a href={`mailto:${EMAIL}`} className="underline">
                      {EMAIL}
                    </a>
                  </p>
                )}
                <AccentButton
                  type="submit"
                  disabled={!canContinue || status === 'sending'}
                >
                  {status === 'sending'
                    ? 'Enviando…'
                    : isLast
                      ? 'Enviar solicitud'
                      : 'Continuar'}
                </AccentButton>
              </div>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
}

export default function QuoteSection() {
  const form = useQuoteForm();
  const [open, setOpen] = useState(false);

  // Link directo: outstudio.online/#cotizar abre la encuesta.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === '#cotizar') setOpen(true);
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  const close = () => {
    setOpen(false);
    if (window.location.hash === '#cotizar') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <section
      id="cotizacion"
      className="bg-paper px-6 md:px-10 lg:px-16 py-20 sm:py-24 md:py-32 border-t border-klein-deep/15"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="text-[11px] tracking-[0.06em] text-carne-tinta">
            05
          </span>
          <RevealText
            as="h2"
            text="Cotización"
            unit="char"
            className="font-display font-semibold text-klein tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          />
        </div>

        <p className="text-ink-2 leading-relaxed max-w-xl mt-4 mb-10 sm:mb-12">
          Cada proyecto es distinto, así que no te damos una cifra al azar.
          Cuéntanos qué necesitas y te enviamos una cotización a la medida en
          24 a 48 horas.
        </p>

        <FadeIn y={20}>
          <div className="rounded-2xl border border-klein-deep/15 bg-paper-pure p-6 sm:p-10 max-w-[880px]">
            <h3 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-1">
              ¿Qué necesitas?
            </h3>
            <p className="text-sm text-muted mb-6">
              Elige una opción para empezar; se abre en pantalla completa
              para que te concentres.
            </p>
            <TypeCards
              selected={form.selected}
              onSelect={(id) => {
                form.selectType(id);
                setOpen(true);
              }}
            />
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 min-h-[2.75rem]">
              {form.selected.length > 0 && (
                <AccentButton onClick={() => setOpen(true)}>
                  Continuar mi cotización
                </AccentButton>
              )}
              <p className="text-xs text-muted">
                Toma unos 3 minutos. Sin compromiso.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && <QuoteScreen form={form} onClose={close} />}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
