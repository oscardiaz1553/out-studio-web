import { useMemo, useState } from 'react';
import {
  Answer,
  Answers,
  COMMON_QUESTIONS,
  Contact,
  PROJECT_TYPES,
  answerKey,
  buildBrief,
  encodePayload,
  isAnswered,
} from '../data/quote';
import { EMAIL, WEB3FORMS_ACCESS_KEY } from '../data/site';

export type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export const EMPTY_CONTACT: Contact = { name: '', email: '', phone: '', company: '' };

/** Estado de la encuesta: vive fuera de la pantalla para que, si el cliente
 *  cierra y vuelve a abrir, retome donde iba. */
export function useQuoteForm() {
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

  // `botTripped`: la trampa para bots (un checkbox oculto) fue marcada; una
  // persona nunca lo hace.
  const submit = async (botTripped = false) => {
    if (botTripped) return;

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

