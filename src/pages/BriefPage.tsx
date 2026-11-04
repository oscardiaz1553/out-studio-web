import { FormEvent, useEffect, useMemo, useState } from 'react';
import LogoOut from '../components/LogoOut';
import AccentButton from '../components/AccentButton';
import PrivacyNote from '../components/PrivacyNote';
import {
  BRIEF_SECTIONS,
  BriefAnswer,
  BriefAnswers,
  BriefContact,
  BriefQuestion,
  answerKey,
  buildBriefText,
  isAnswered,
  pesos,
  presupuestoTexto,
} from '../data/brief';
import { EMAIL, WEB3FORMS_ACCESS_KEY, WHATSAPP_URL } from '../data/site';

/**
 * Brief de tienda online. Vive en /brief.html (sin indexar). Se le manda por
 * link a un cliente nuevo; con ?c=NombreDeLaEmpresa se prellena la empresa.
 * Las respuestas se guardan en el navegador mientras las escribe y llegan por
 * correo a Out al enviar.
 */

const INPUT =
  'w-full bg-paper-pure border border-klein-deep/25 rounded-lg px-4 py-3 text-klein-deep placeholder-muted focus:border-klein transition-colors duration-200';
const OPTION =
  'flex items-center rounded-xl border px-4 py-3.5 text-[15px] leading-snug cursor-pointer select-none transition-colors duration-150 border-klein-deep/20 text-klein-deep hover:border-klein peer-checked:border-klein peer-checked:bg-klein peer-checked:text-paper-pure peer-focus-visible:ring-2 peer-focus-visible:ring-klein peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper';
const STORE_KEY = 'out-brief-v1';

type Status = 'idle' | 'sending' | 'success' | 'error';

const clientFromUrl = () => {
  try {
    return (new URLSearchParams(window.location.search).get('c') ?? '').slice(0, 80).trim();
  } catch {
    return '';
  }
};

function Field({ q, value, onChange }: { q: BriefQuestion; value: BriefAnswer | undefined; onChange: (v: BriefAnswer) => void }) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const multi = q.kind === 'multi';
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="font-display text-xl sm:text-2xl text-klein-deep leading-tight">
        {q.label}
        {q.required && <span aria-hidden className="text-carne-deep"> *</span>}
      </legend>
      {q.help && <p className="text-sm text-ink-2 -mt-1">{q.help}</p>}
      {(q.kind === 'single' || multi) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {q.options!.map((opt) => (
            <label key={opt} className="relative block">
              <input
                type={multi ? 'checkbox' : 'radio'}
                name={q.id}
                checked={selected.includes(opt)}
                onChange={() =>
                  multi
                    ? onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt])
                    : onChange(opt)
                }
                className="peer sr-only"
              />
              <span className={OPTION}>{opt}</span>
            </label>
          ))}
        </div>
      )}
      {q.kind === 'range' && q.range && (() => {
        const r = q.range;
        const unknown = value === r.unknown;
        const num = typeof value === 'string' && !unknown ? Number(value.replace(/\D/g, '')) || r.min : Math.round((r.min + r.max) / 2 / r.step) * r.step;
        const elegido = typeof value === 'string' && value !== '' && !unknown;
        const pct = ((num - r.min) / (r.max - r.min)) * 100;
        return (
          <div className="flex flex-col gap-5">
            <p className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-klein min-h-[3rem]" aria-live="polite">
              {unknown ? 'Aún no lo sé' : elegido ? (num >= r.max ? `${pesos(r.max)} o más` : `Hasta ${pesos(num)}`) : <span className="text-muted/70">Mueve el control</span>}
            </p>
            <input
              type="range"
              min={r.min}
              max={r.max}
              step={r.step}
              value={num}
              disabled={unknown}
              aria-label={q.label}
              aria-valuetext={elegido ? presupuestoTexto(num, r.max) : 'Sin elegir'}
              onChange={(e) => onChange(presupuestoTexto(Number(e.target.value), r.max))}
              style={{ background: `linear-gradient(to right, #1B2FCC ${elegido ? pct : 0}%, rgba(20,30,92,.18) ${elegido ? pct : 0}%)` }}
              className="out-slider w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-xs text-muted -mt-2"><span>{pesos(r.min)}</span><span>{pesos(r.max)} o más</span></div>
            <label className="relative block sm:w-fit">
              <input type="checkbox" checked={unknown} onChange={() => onChange(unknown ? '' : r.unknown)} className="peer sr-only" />
              <span className={OPTION}>{r.unknown}</span>
            </label>
          </div>
        );
      })()}
      {q.kind === 'text' && (
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          className={INPUT}
        />
      )}
      {q.kind === 'long' && (
        <textarea
          rows={3}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          className={`${INPUT} resize-y`}
        />
      )}
    </fieldset>
  );
}

export default function BriefPage() {
  const cliente = useMemo(clientFromUrl, []);
  const [contact, setContact] = useState<BriefContact>({ name: '', email: '', phone: '', company: cliente });
  const [answers, setAnswers] = useState<BriefAnswers>({});
  const [status, setStatus] = useState<Status>('idle');
  const [bot, setBot] = useState(false);
  const [cargado, setCargado] = useState(false);

  // Retoma lo que ya había escrito (si el navegador lo permite).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${STORE_KEY}:${cliente}`);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.contact) setContact((c) => ({ ...c, ...d.contact, company: d.contact.company || cliente }));
        if (d.answers) setAnswers(d.answers);
      }
    } catch {
      /* sin almacenamiento: sigue funcionando sin guardar */
    }
    setCargado(true);
  }, [cliente]);
  useEffect(() => {
    if (!cargado || status === 'success') return;
    try {
      localStorage.setItem(`${STORE_KEY}:${cliente}`, JSON.stringify({ contact, answers }));
    } catch {
      /* ignorar */
    }
  }, [contact, answers, cliente, status, cargado]);

  const required = BRIEF_SECTIONS.flatMap((s) => s.questions.filter((q) => q.required).map((q) => answerKey(s.id, q.id)));
  const total = BRIEF_SECTIONS.reduce((n, s) => n + s.questions.length, 0);
  const done = BRIEF_SECTIONS.reduce(
    (n, s) => n + s.questions.filter((q) => isAnswered(answers[answerKey(s.id, q.id)])).length,
    0,
  );
  const faltan = required.filter((k) => !isAnswered(answers[k])).length;
  const listo = contact.name.trim() !== '' && /\S+@\S+\.\S+/.test(contact.email) && faltan === 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (bot || !listo || status === 'sending') return;
    const subject = `Brief de tienda: ${contact.company || contact.name}`;
    const message = buildBriefText(contact, answers);
    if (!WEB3FORMS_ACCESS_KEY) {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
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
          from_name: contact.name,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        try {
          localStorage.removeItem(`${STORE_KEY}:${cliente}`);
        } catch {
          /* ignorar */
        }
      }
      setStatus(data.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-paper text-klein-deep" style={{ overflowX: 'clip' }}>
      <header className="px-6 md:px-10 lg:px-16 py-6 flex items-center justify-between">
        <a href={import.meta.env.BASE_URL} aria-label="Out, inicio">
          <LogoOut className="h-9 w-auto text-klein" decorative />
        </a>
        <span className="text-sm text-muted">{done} de {total} respondidas</span>
      </header>

      {status === 'success' ? (
        <section className="max-w-[720px] mx-auto px-6 sm:px-8 py-16 sm:py-24" aria-live="polite">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-[1.02]">
            Listo{contact.name ? `, ${contact.name.split(' ')[0]}` : ''}. Recibimos tu brief.
          </h1>
          <p className="mt-5 text-lg text-ink-2">
            Lo revisamos y te escribimos en 6 a 24 horas con una propuesta y una cotización. Si algo no quedó claro, te llamamos 15 minutos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AccentButton href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Escribirnos por WhatsApp
            </AccentButton>
          </div>
        </section>
      ) : (
        <form onSubmit={submit} className="max-w-[720px] mx-auto px-6 sm:px-8 pb-24" noValidate>
          <div className="pt-6 sm:pt-10">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-[1.02]">
              {cliente ? `${cliente}: cuéntanos de tu tienda.` : 'Cuéntanos de tu tienda.'}
            </h1>
            <p className="mt-5 text-lg text-ink-2">
              Son unas 20 preguntas, la mayoría de marcar. Con esto sabemos qué necesitas y qué ya tienes, y te mandamos una cotización a la medida. Lo que no sepas, déjalo en blanco.
            </p>
          </div>

          <div className="mt-10 rounded-2xl bg-paper-pure border border-klein-deep/15 p-6 sm:p-8 flex flex-col gap-5">
            <h2 className="font-display text-2xl text-klein-deep">Tus datos</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-[11px] tracking-[0.04em] text-muted">Nombre *</span>
                <input type="text" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={INPUT} required />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] tracking-[0.04em] text-muted">Empresa o marca</span>
                <input type="text" autoComplete="organization" value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} className={INPUT} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] tracking-[0.04em] text-muted">Correo *</span>
                <input type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={INPUT} required />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] tracking-[0.04em] text-muted">WhatsApp</span>
                <input type="tel" inputMode="numeric" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value.replace(/[^\d+\s]/g, '') })} placeholder="+57 …" className={INPUT} />
              </label>
            </div>
          </div>

          {BRIEF_SECTIONS.map((s, i) => (
            <section key={s.id} className="mt-12" aria-labelledby={`s-${s.id}`}>
              <p className="text-sm text-muted tracking-wide">0{i + 1}</p>
              <h2 id={`s-${s.id}`} className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">{s.title}</h2>
              {s.intro && <p className="mt-2 text-ink-2">{s.intro}</p>}
              <div className="mt-6 flex flex-col gap-9">
                {s.questions.map((q) => (
                  <Field key={q.id} q={q} value={answers[answerKey(s.id, q.id)]} onChange={(v) => setAnswers((a) => ({ ...a, [answerKey(s.id, q.id)]: v }))} />
                ))}
              </div>
            </section>
          ))}

          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" checked={bot} onChange={(e) => setBot(e.target.checked)} />

          <div className="mt-12 flex flex-col gap-4">
            {!listo && (
              <p className="text-sm text-ink-2" role="status">
                {contact.name.trim() === '' || !/\S+@\S+\.\S+/.test(contact.email)
                  ? 'Falta tu nombre y un correo válido.'
                  : `Faltan ${faltan} pregunta${faltan === 1 ? '' : 's'} marcada${faltan === 1 ? '' : 's'} con *.`}
              </p>
            )}
            {status === 'error' && (
              <p className="text-carne-tinta text-sm" role="alert">
                No se pudo enviar. Escríbenos a{' '}
                <a href={`mailto:${EMAIL}`} className="underline">{EMAIL}</a> o por{' '}
                <a href={WHATSAPP_URL} className="underline">WhatsApp</a>.
              </p>
            )}
            <div>
              <AccentButton type="submit" disabled={!listo || status === 'sending'}>
                {status === 'sending' ? 'Enviando…' : 'Enviar brief'}
              </AccentButton>
            </div>
            <PrivacyNote />
          </div>
        </form>
      )}
    </main>
  );
}
