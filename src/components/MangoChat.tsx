import { motion, useReducedMotion } from 'framer-motion';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  COMMON_QUESTIONS,
  Contact,
  PROJECT_TYPES,
  Question,
  answerKey,
  isAnswered,
} from '../data/quote';
import { EMAIL } from '../data/site';
import { useQuoteForm } from '../lib/useQuoteForm';

const AVATAR = `${import.meta.env.BASE_URL}mono-avatar.webp`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Una "pregunta" del chat: las mismas de la encuesta de pantalla completa
// (tipo de proyecto → preguntas del tipo → preguntas comunes → contacto),
// una a la vez.
interface Prompt {
  id: string;
  ask: string;
  kind: 'single' | 'multi' | 'text' | 'long';
  options?: string[];
  placeholder?: string;
  required: boolean;
  /** Dónde se guarda la respuesta. */
  target:
    | { type: 'type' }
    | { type: 'answer'; key: string }
    | { type: 'contact'; field: keyof Contact };
  inputType?: 'text' | 'email' | 'tel';
  question?: Question;
}

function fromQuestion(q: Question, scope: string): Prompt {
  return {
    id: answerKey(scope, q.id),
    ask: q.help && q.kind !== 'text' ? `${q.label} (${q.help})` : q.label,
    kind: q.kind,
    options: q.options,
    placeholder: q.placeholder,
    required: Boolean(q.required),
    target: { type: 'answer', key: answerKey(scope, q.id) },
    question: q,
  };
}

const CONTACT_PROMPTS: Prompt[] = [
  {
    id: 'contact.name',
    ask: '¿Cómo te llamas?',
    kind: 'text',
    placeholder: 'Tu nombre',
    required: true,
    target: { type: 'contact', field: 'name' },
  },
  {
    id: 'contact.email',
    ask: '¿A qué correo te enviamos la cotización?',
    kind: 'text',
    inputType: 'email',
    placeholder: 'tu@email.com',
    required: true,
    target: { type: 'contact', field: 'email' },
  },
  {
    id: 'contact.phone',
    ask: '¿Tu WhatsApp o teléfono? (opcional)',
    kind: 'text',
    inputType: 'tel',
    placeholder: '+57 …',
    required: false,
    target: { type: 'contact', field: 'phone' },
  },
  {
    id: 'contact.company',
    ask: '¿Cómo se llama tu empresa o marca? (opcional)',
    kind: 'text',
    placeholder: 'Empresa o marca',
    required: false,
    target: { type: 'contact', field: 'company' },
  },
];

const TYPE_PROMPT: Prompt = {
  id: 'type',
  ask: '¿Qué necesitas? Elige la opción que más se acerque.',
  kind: 'single',
  options: PROJECT_TYPES.map((t) => t.label),
  required: true,
  target: { type: 'type' },
};

const GREETING =
  '¡Quihubo! Soy Mango 🥭 Te hago unas preguntas rápidas y te enviamos una cotización a la medida en 6 a 24 horas.';

/** Estado del chat. Vive fuera del panel para que, si lo cierras y lo vuelves
 *  a abrir, retomes donde ibas. */
export function useChatState() {
  const form = useQuoteForm();
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [typing, setTyping] = useState(false);

  const prompts = useMemo(() => {
    const type = PROJECT_TYPES.find((t) => t.id === form.selected[0]);
    return [
      TYPE_PROMPT,
      ...(type ? type.questions.map((q) => fromQuestion(q, type.id)) : []),
      ...COMMON_QUESTIONS.map((q) => fromQuestion(q, 'comun')),
      ...CONTACT_PROMPTS,
    ];
  }, [form.selected]);

  // Cada vez que avanza o retrocede, Mango "escribe" un instante.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setTyping(true);
    const t = window.setTimeout(() => setTyping(false), 550);
    return () => window.clearTimeout(t);
  }, [cursor]);

  const reset = () => {
    form.reset();
    setCursor(0);
    setTyping(false);
  };

  return { form, open, setOpen, cursor, setCursor, typing, prompts, reset };
}

export type ChatState = ReturnType<typeof useChatState>;

function valueOf(p: Prompt, chat: ChatState): string | string[] | undefined {
  const { form } = chat;
  if (p.target.type === 'type') {
    return PROJECT_TYPES.find((t) => t.id === form.selected[0])?.label;
  }
  if (p.target.type === 'contact') return form.contact[p.target.field];
  return form.answers[p.target.key];
}

function show(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Prefiero omitirla';
  return value && value.trim() ? value.trim() : 'Prefiero omitirla';
}

function Bubble({ from, children }: { from: 'bot' | 'user'; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-[85%] px-3.5 py-2.5 text-[14px] leading-snug whitespace-pre-line ${
        from === 'bot'
          ? 'self-start rounded-2xl rounded-bl-sm bg-paper text-klein-deep'
          : 'self-end rounded-2xl rounded-br-sm bg-klein text-paper-pure'
      }`}
    >
      {children}
    </motion.div>
  );
}

// "Escribiendo…": el cursor | de la marca, parpadeando.
function TypingDots() {
  const reduceMotion = useReducedMotion();
  return (
    <div
      aria-label="Mango está escribiendo"
      className="self-start rounded-2xl rounded-bl-sm bg-paper px-4 py-3 flex items-center h-[42px]"
    >
      <motion.span
        aria-hidden
        className="block w-[3px] h-[18px] bg-klein"
        animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] }}
      />
    </div>
  );
}

const CHIP =
  'rounded-full border px-3.5 py-2 text-[13px] leading-snug text-left transition-colors duration-150 active:scale-[0.97]';


/** En el celular el chat ocupa la pantalla visible: cuando sale el teclado se
 *  encoge a lo que queda arriba de él (visualViewport), en vez de quedar
 *  tapado o de obligar a hacer zoom. También bloquea el scroll de fondo. */
function usePhoneViewport() {
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const vv = window.visualViewport;
    const update = () => {
      if (!mq.matches) return setBox(null);
      setBox({ top: vv ? vv.offsetTop : 0, height: vv ? vv.height : window.innerHeight });
    };
    update();
    const html = document.documentElement;
    const prev = html.style.overflow;
    if (mq.matches) html.style.overflow = 'hidden';
    vv?.addEventListener('resize', update);
    vv?.addEventListener('scroll', update);
    mq.addEventListener('change', update);
    return () => {
      html.style.overflow = prev;
      vv?.removeEventListener('resize', update);
      vv?.removeEventListener('scroll', update);
      mq.removeEventListener('change', update);
    };
  }, []);
  return box;
}

export function MangoChat({ chat, onClose }: { chat: ChatState; onClose: () => void }) {
  const { form, cursor, setCursor, typing, prompts } = chat;
  const reduceMotion = useReducedMotion();
  const phoneBox = usePhoneViewport();
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  const [draft, setDraft] = useState('');
  const [multiDraft, setMultiDraft] = useState<string[]>([]);
  const [fieldError, setFieldError] = useState('');

  const done = cursor >= prompts.length;
  const current = done ? null : prompts[cursor];
  const success = form.status === 'success';

  // Al cambiar de pregunta, el borrador arranca con la respuesta guardada
  // (por si volviste atrás a corregirla).
  useEffect(() => {
    if (!current) return;
    const saved = valueOf(current, chat);
    if (current.kind === 'multi') setMultiDraft(Array.isArray(saved) ? saved : []);
    else setDraft(typeof saved === 'string' ? saved : '');
    setFieldError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, current?.id]);

  // Siempre baja al último mensaje y deja el cursor listo para escribir.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
    if (!typing) inputRef.current?.focus({ preventScroll: true });
  }, [cursor, typing, form.status, reduceMotion, phoneBox?.height]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const commit = (p: Prompt, value: string | string[]) => {
    if (p.target.type === 'type') {
      form.selectType(
        PROJECT_TYPES.find((t) => t.label === value)?.id ?? PROJECT_TYPES[0].id,
      );
    } else if (p.target.type === 'contact') {
      form.setContact({ ...form.contact, [p.target.field]: String(value).trim() });
    } else {
      form.setAnswer(p.target.key, value);
    }
    setCursor(cursor + 1);
  };

  const submitText = (e?: FormEvent) => {
    e?.preventDefault();
    if (!current) return;
    const text = draft.trim();
    if (current.required && !text) return;
    if (current.inputType === 'email' && !EMAIL_RE.test(text)) {
      setFieldError('Revisa el correo: parece que le falta algo.');
      return;
    }
    commit(current, text);
  };

  const canGoMulti =
    !current || !current.question || isAnswered(current.question, multiDraft);

  const send = () => {
    const bot = rootRef.current?.querySelector<HTMLInputElement>('input[name="botcheck"]');
    void form.submit(Boolean(bot?.checked));
  };

  const close = () => {
    if (success) chat.reset();
    onClose();
  };

  const firstName = form.contact.name.trim().split(' ')[0];

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-label="Chat de cotización con Mango"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={phoneBox ? { transformOrigin: 'bottom right', top: phoneBox.top, height: phoneBox.height } : { transformOrigin: 'bottom right' }}
      className="fixed z-[900] inset-x-0 top-0 h-[100dvh] sm:top-auto sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[390px] sm:h-[min(620px,calc(100dvh-3rem))] flex flex-col overflow-hidden sm:rounded-2xl bg-paper-pure text-klein-deep shadow-[0_20px_70px_rgba(20,30,92,0.45)] ring-1 ring-klein-deep/15"
    >
      {/* Cabecera */}
      <header className="shrink-0 flex items-center gap-3 px-4 py-3 bg-klein text-paper-pure">
        <span className="relative shrink-0">
          <img
            src={AVATAR}
            alt=""
            width={480}
            height={640}
            className="w-10 h-[52px] object-contain object-bottom"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold leading-tight">Mango</p>
          <p className="text-xs text-paper-pure/80 leading-tight">
            Cotiza tu proyecto en unos 3 minutos
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar el chat"
          className="w-9 h-9 -mr-1 rounded-full flex items-center justify-center hover:bg-paper-pure/15 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {!success && (
        <div
          className="shrink-0 h-1 bg-klein-deep/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={prompts.length}
          aria-valuenow={Math.min(cursor, prompts.length)}
          aria-label="Progreso de la cotización"
        >
          <div
            className="h-full bg-carne-deep transition-[width] duration-300"
            style={{ width: `${(Math.min(cursor, prompts.length) / prompts.length) * 100}%` }}
          />
        </div>
      )}

      {/* Conversación */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 flex flex-col gap-2.5"
        aria-live="polite"
      >
        <Bubble from="bot">{GREETING}</Bubble>
        {prompts.slice(0, Math.min(cursor, prompts.length)).map((p) => (
          <div key={p.id} className="flex flex-col gap-2.5">
            <Bubble from="bot">{p.ask}</Bubble>
            <Bubble from="user">{show(valueOf(p, chat))}</Bubble>
          </div>
        ))}

        {!done && (typing ? <TypingDots /> : <Bubble from="bot">{current!.ask}</Bubble>)}

        {done && !success && (
          <>
            {typing ? (
              <TypingDots />
            ) : (
              <Bubble from="bot">
                {`¡Listo${firstName ? `, ${firstName}` : ''}! Con esto ya podemos armar tu cotización. La enviamos a ${form.contact.email} en las próximas 6 a 24 horas.`}
              </Bubble>
            )}
            {form.status === 'error' && (
              <Bubble from="bot">
                No pude enviarla. Prueba de nuevo o escríbenos a {EMAIL}.
              </Bubble>
            )}
          </>
        )}

        {success && (
          <Bubble from="bot">
            {`¡Recibimos tu solicitud${firstName ? `, ${firstName}` : ''}! 🥭\nRevisamos tu caso y te escribimos a ${form.contact.email} en las próximas 6 a 24 horas.`}
          </Bubble>
        )}
      </div>

      {/* Zona de respuesta */}
      <div className="shrink-0 border-t border-klein-deep/10 bg-paper-pure px-3 pt-3 pb-3 flex flex-col gap-2">
        {/* Trampa para bots: nunca visible para una persona. */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />

        {success ? (
          <button
            type="button"
            onClick={close}
            className="self-end rounded-full bg-klein text-paper-pure px-5 py-2.5 text-sm font-medium hover:bg-klein-mid transition-colors"
          >
            Cerrar
          </button>
        ) : done ? (
          <button
            type="button"
            onClick={send}
            disabled={form.status === 'sending'}
            className="rounded-full bg-klein text-paper-pure px-5 py-3 text-sm font-medium hover:bg-klein-mid disabled:opacity-60 transition-colors"
          >
            {form.status === 'sending'
              ? 'Enviando…'
              : form.status === 'error'
                ? 'Intentar de nuevo'
                : 'Enviar solicitud'}
          </button>
        ) : typing ? null : current!.kind === 'single' ? (
          <div className="flex flex-wrap gap-2 max-h-[40vh] overflow-y-auto overscroll-contain">
            {current!.options!.map((opt) => {
              const sel = valueOf(current!, chat) === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => commit(current!, opt)}
                  className={`${CHIP} ${
                    sel
                      ? 'bg-klein border-klein text-paper-pure'
                      : 'border-klein/40 text-klein hover:bg-klein hover:text-paper-pure'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : current!.kind === 'multi' ? (
          <>
            <div className="flex flex-wrap gap-2 max-h-[34vh] overflow-y-auto overscroll-contain">
              {current!.options!.map((opt) => {
                const sel = multiDraft.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={sel}
                    onClick={() =>
                      setMultiDraft((d) =>
                        d.includes(opt) ? d.filter((o) => o !== opt) : [...d, opt],
                      )
                    }
                    className={`${CHIP} ${
                      sel
                        ? 'bg-klein border-klein text-paper-pure'
                        : 'border-klein/40 text-klein hover:border-klein'
                    }`}
                  >
                                        {opt}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={!canGoMulti}
              onClick={() => commit(current!, multiDraft)}
              className="self-end rounded-full bg-klein text-paper-pure px-5 py-2.5 text-sm font-medium hover:bg-klein-mid disabled:opacity-40 transition-colors"
            >
              {multiDraft.length === 0 && !current!.required ? 'Saltar' : 'Listo'}
            </button>
          </>
        ) : (
          <form onSubmit={submitText} noValidate className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              {current!.kind === 'long' ? (
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submitText();
                    }
                  }}
                  rows={3}
                  placeholder={current!.placeholder ?? 'Escribe aquí…'}
                  aria-label={current!.ask}
                  className="flex-1 min-w-0 resize-none rounded-xl border border-klein-deep/25 bg-paper px-3 py-2.5 text-base sm:text-[14px] text-klein-deep placeholder-muted focus:border-klein"
                />
              ) : (
                <input
                  ref={inputRef}
                  type={current!.inputType ?? 'text'}
                  inputMode={current!.inputType === 'tel' ? 'tel' : undefined}
                  autoComplete={
                    current!.inputType === 'email'
                      ? 'email'
                      : current!.inputType === 'tel'
                        ? 'tel'
                        : current!.id === 'contact.name'
                          ? 'name'
                          : undefined
                  }
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setFieldError('');
                  }}
                  placeholder={current!.placeholder ?? 'Escribe aquí…'}
                  aria-label={current!.ask}
                  className="flex-1 min-w-0 rounded-xl border border-klein-deep/25 bg-paper px-3 py-2.5 text-base sm:text-[14px] text-klein-deep placeholder-muted focus:border-klein"
                />
              )}
              <button
                type="submit"
                disabled={current!.required && !draft.trim()}
                aria-label="Enviar respuesta"
                className="shrink-0 w-11 h-11 rounded-full bg-klein text-paper-pure flex items-center justify-center hover:bg-klein-mid disabled:opacity-40 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            {fieldError && (
              <p className="text-xs text-carne-tinta" role="alert">
                {fieldError}
              </p>
            )}
            {!current!.required && (
              <button
                type="button"
                onClick={() => commit(current!, '')}
                className="self-start text-xs font-medium text-klein hover:underline"
              >
                Saltar esta
              </button>
            )}
          </form>
        )}

        {!success && cursor > 0 && !typing && (
          <button
            type="button"
            onClick={() => setCursor(cursor - 1)}
            className="self-start text-xs text-muted hover:text-klein transition-colors"
          >
            Cambiar mi respuesta anterior
          </button>
        )}
      </div>
    </motion.div>
  );
}
