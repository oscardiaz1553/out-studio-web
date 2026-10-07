import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
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
  isAnswered,
} from '../data/quote';
import { EMAIL, WEB3FORMS_ACCESS_KEY } from '../data/site';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const INPUT_CLASSES =
  'w-full bg-paper-pure border border-klein-deep/25 rounded-lg px-4 py-3 text-klein-deep placeholder-muted focus:border-klein transition-colors duration-200';

// Tarjeta de opción: el <input> real (radio/checkbox) queda oculto pero
// accesible por teclado; el estado se pinta con peer-checked.
const OPTION_BASE =
  'flex items-center rounded-xl border px-4 py-3 text-sm leading-snug cursor-pointer select-none transition-colors duration-150 border-klein-deep/20 text-klein-deep hover:border-klein peer-checked:border-klein peer-checked:bg-klein peer-checked:text-paper-pure peer-focus-visible:ring-2 peer-focus-visible:ring-klein peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper-pure';

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
      <legend className="font-medium text-klein-deep leading-snug mb-1">
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

export default function QuoteSection() {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<FormStatus>('idle');

  const panelRef = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);

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

  // Al avanzar/retroceder, vuelve al inicio del panel (los bloques son largos,
  // sobre todo en móvil). No se dispara en el primer render.
  useEffect(() => {
    if (!hasInteracted.current) return;
    panelRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [stepIndex, reduceMotion]);

  const setAnswer = (key: string, value: Answer) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const toggleType = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );

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

  const go = (delta: number) => {
    hasInteracted.current = true;
    setStepIndex((i) => Math.max(0, Math.min(steps.length - 1, i + delta)));
  };

  const submit = async (form: HTMLFormElement) => {
    // Trampa para bots: este checkbox está oculto, una persona nunca lo marca.
    if (new FormData(form).get('botcheck')) return;

    const brief = buildBrief(selected, answers, contact);
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canContinue) return;
    if (isLast) void submit(e.currentTarget);
    else go(1);
  };

  const panelMotion = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 },
    transition: { duration: 0.25, ease: EASE_OUT },
  };

  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <section
      id="cotizacion"
      className="bg-paper px-6 md:px-10 lg:px-16 py-20 sm:py-24 md:py-32 border-t border-klein-deep/15"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="text-[11px] tracking-[0.06em] text-carne-tinta">
            06
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
          <div
            ref={panelRef}
            className="scroll-mt-24 rounded-2xl border border-klein-deep/15 bg-paper-pure overflow-hidden max-w-[880px]"
          >
            {status === 'success' ? (
              <div className="flex flex-col items-start">
                <div
                  aria-hidden
                  className="w-full h-14 border-b border-klein/15"
                  style={{
                    backgroundImage: `url(${AZULEJO_BAND})`,
                    backgroundRepeat: 'repeat-x',
                    backgroundSize: 'auto 100%',
                  }}
                />
                <div className="px-6 sm:px-10 py-12 flex flex-col items-start gap-3">
                  <span
                    aria-hidden
                    className="w-3.5 h-3.5 rounded-full bg-carne-deep"
                  />
                  <p className="font-display font-semibold text-klein text-xl">
                    Recibimos tu solicitud.
                  </p>
                  <p className="text-ink-2 leading-relaxed max-w-md">
                    Gracias, {contact.name.split(' ')[0]}. Revisamos tu caso y
                    te enviamos la cotización a {contact.email} en las
                    próximas 24 a 48 horas.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate={false}>
                {/* Progreso */}
                <div className="px-6 sm:px-10 pt-6 sm:pt-8">
                  <div className="flex items-center justify-between text-[11px] tracking-[0.04em] text-muted mb-2">
                    <span>
                      Paso {stepIndex + 1} de {steps.length}
                    </span>
                    {currentType && <span>{currentType.label}</span>}
                  </div>
                  <div
                    className="h-1 rounded-full bg-klein-deep/10 overflow-hidden"
                    role="progressbar"
                    aria-valuemin={1}
                    aria-valuemax={steps.length}
                    aria-valuenow={stepIndex + 1}
                    aria-label="Progreso de la cotización"
                  >
                    <div
                      className="h-full bg-klein rounded-full transition-[width] duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="px-6 sm:px-10 py-8 sm:py-10">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={step} {...panelMotion}>
                      {step === 'tipos' && (
                        <>
                          <h3 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-1">
                            ¿Qué necesitas?
                          </h3>
                          <p className="text-sm text-muted mb-6">
                            Puedes elegir más de uno, por ejemplo una tienda
                            y su branding.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {PROJECT_TYPES.map((t) => (
                              <label key={t.id} className="relative block">
                                <input
                                  type="checkbox"
                                  checked={selected.includes(t.id)}
                                  onChange={() => toggleType(t.id)}
                                  className="peer sr-only"
                                />
                                <span
                                  className={`${OPTION_BASE} flex-col !items-start gap-1 h-full text-left`}
                                >
                                  <span className="font-display font-semibold text-base">
                                    {t.label}
                                  </span>
                                  <span className="text-xs opacity-75">
                                    {t.blurb}
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </>
                      )}

                      {currentType && (
                        <>
                          <h3 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-1">
                            {currentType.label}
                          </h3>
                          <p className="text-sm text-muted mb-8">
                            {currentType.blurb}
                          </p>
                          <div className="flex flex-col gap-8">
                            {currentType.questions.map((q) => (
                              <QuestionField
                                key={q.id}
                                q={q}
                                scope={currentType.id}
                                answers={answers}
                                setAnswer={setAnswer}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      {step === 'comun' && (
                        <>
                          <h3 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-1">
                            Sobre tu proyecto
                          </h3>
                          <p className="text-sm text-muted mb-8">
                            Lo último antes de tus datos de contacto.
                          </p>
                          <div className="flex flex-col gap-8">
                            {COMMON_QUESTIONS.map((q) => (
                              <QuestionField
                                key={q.id}
                                q={q}
                                scope="comun"
                                answers={answers}
                                setAnswer={setAnswer}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      {step === 'contacto' && (
                        <>
                          <h3 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-1">
                            ¿A dónde te enviamos la cotización?
                          </h3>
                          <p className="text-sm text-muted mb-8">
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
                                  setContact({ ...contact, name: e.target.value })
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
                                  setContact({ ...contact, email: e.target.value })
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
                                    setContact({ ...contact, phone: e.target.value })
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
                                    setContact({ ...contact, company: e.target.value })
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

                {/* Navegación */}
                <div className="px-6 sm:px-10 pb-6 sm:pb-8 flex flex-wrap items-center gap-4">
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
                  {stepIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      className="text-sm font-medium text-klein-deep hover:text-klein transition-colors duration-150 px-2 py-2"
                    >
                      Atrás
                    </button>
                  )}
                  {status === 'error' && (
                    <p
                      className="basis-full text-carne-tinta text-sm leading-relaxed"
                      role="alert"
                    >
                      No se pudo enviar la solicitud. Escríbenos directo a{' '}
                      <a href={`mailto:${EMAIL}`} className="underline">
                        {EMAIL}
                      </a>
                      .
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
