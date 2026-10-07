import { ReactNode, useEffect, useMemo, useState } from 'react';
import QuoteDossier, {
  QuoteDraft,
  QuoteItem,
  formatCOP,
  totals,
} from '../components/QuoteDossier';
import {
  DEFAULT_SCOPE,
  PROJECT_TYPES,
  QuotePayload,
  answerGroups,
  answerKey,
  decodePayload,
} from '../data/quote';

const INPUT =
  'w-full bg-paper-pure border border-klein-deep/25 rounded-lg px-3 py-2 text-sm text-klein-deep placeholder-muted focus:border-klein transition-colors duration-200';
const LABEL = 'text-[11px] tracking-[0.04em] text-muted';

const DEFAULT_PAYMENT =
  '50% de anticipo para dar inicio al proyecto y 50% restante contra entrega, antes de la publicación.';
const DEFAULT_TERMS = [
  'Esta propuesta es válida durante el tiempo indicado en la portada.',
  'El alcance cubre únicamente lo descrito en este documento; cualquier cambio o adición se cotiza aparte.',
  'Se incluyen rondas de ajustes razonables sobre cada entregable, definidas de común acuerdo al iniciar.',
  'Dominio, hosting, licencias de plugins o aplicaciones de terceros y comisiones de pasarelas de pago no están incluidos, salvo que se indique.',
  'El cliente entrega textos, imágenes y accesos necesarios en los tiempos acordados; los retrasos pueden mover la fecha de entrega.',
].join('\n');

const uid = () => Math.random().toString(36).slice(2, 9);

function todayISO() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function newFolio() {
  return `OUT-${todayISO().replace(/-/g, '').slice(2)}-001`;
}

function hashString(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function initialDraft(payload: QuotePayload | null): QuoteDraft {
  const plazo = payload?.answers[answerKey('comun', 'plazo')];
  const items: QuoteItem[] = payload
    ? PROJECT_TYPES.filter((t) => payload.types.includes(t.id)).map((t) => ({
        id: uid(),
        title: t.label,
        scope: (DEFAULT_SCOPE[t.id] ?? []).join('\n'),
        price: 0,
      }))
    : [];
  return {
    clientName: payload?.contact.name ?? '',
    clientEmail: payload?.contact.email ?? '',
    clientCompany: payload?.contact.company ?? '',
    clientPhone: payload?.contact.phone ?? '',
    folio: newFolio(),
    date: todayISO(),
    validDays: 15,
    items: items.length ? items : [{ id: uid(), title: '', scope: '', price: 0 }],
    tax: 'none',
    payment: DEFAULT_PAYMENT,
    timeline: `${
      typeof plazo === 'string' ? `Plazo que nos indicaste: ${plazo.toLowerCase()}. ` : ''
    }Con tu aprobación enviamos un cronograma por etapas con fechas de entrega.`,
    terms: DEFAULT_TERMS,
    note: '',
  };
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3 border-t border-klein-deep/15 pt-5">
      <legend className="font-display font-semibold text-klein text-base float-left w-full mb-3">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function PriceInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      inputMode="numeric"
      value={value ? new Intl.NumberFormat('es-CO').format(value) : ''}
      onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '')) || 0)}
      placeholder="Valor en COP"
      className={INPUT}
      aria-label="Valor en COP"
    />
  );
}

export default function QuoteBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<QuotePayload | null>(null);
  const [draft, setDraft] = useState<QuoteDraft | null>(null);
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const storageKey = `out-quote:${hashString(hash)}`;

  // Carga el brief del hash (#q=...) y, si ya había un borrador guardado de
  // esa misma solicitud, lo recupera.
  useEffect(() => {
    (async () => {
      const m = hash.match(/^#q=(.+)$/);
      const data = m ? await decodePayload(m[1]) : null;
      setPayload(data);
      let saved: QuoteDraft | null = null;
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) saved = JSON.parse(raw) as QuoteDraft;
      } catch {
        /* sin almacenamiento: se parte del borrador nuevo */
      }
      setDraft(saved ?? initialDraft(data));
      setLoading(false);
    })();
  }, [hash, storageKey]);

  useEffect(() => {
    if (!draft) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      /* ignorar */
    }
    // El título del documento es el nombre sugerido al guardar el PDF.
    document.title = `Cotización ${draft.folio} - ${
      draft.clientCompany || draft.clientName || 'Out'
    }`;
  }, [draft, storageKey]);

  const groups = useMemo(
    () => (payload ? answerGroups(payload.types, payload.answers) : []),
    [payload],
  );

  if (loading || !draft) {
    return <p className="p-8 text-muted">Cargando…</p>;
  }

  const set = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) =>
    setDraft({ ...draft, [key]: value });

  const setItem = (id: string, patch: Partial<QuoteItem>) =>
    set(
      'items',
      draft.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    );

  const { total } = totals(draft);

  const mailto = () => {
    const subject = `Propuesta de cotización ${draft.folio} — Out. Studio`;
    const body = `Hola ${draft.clientName.split(' ')[0] || ''},\n\nGracias por contarnos sobre tu proyecto. Adjunto encuentras nuestra propuesta de cotización (${draft.folio}) con el alcance, la inversión (${formatCOP(total)}) y los tiempos.\n\nCualquier duda la resolvemos con gusto.\n\nOscar Díaz\nOut. Studio`;
    window.location.href = `mailto:${draft.clientEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const reset = () => {
    if (window.confirm('¿Descartar los cambios y volver al borrador inicial?')) {
      setDraft(initialDraft(payload));
    }
  };

  return (
    <div className="min-h-screen bg-paper print:bg-white">
      <div className="lg:grid lg:grid-cols-[440px_1fr] print:block">
        {/* Controles (no se imprimen) */}
        <aside className="print:hidden bg-paper-pure border-r border-klein-deep/15 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto p-6 flex flex-col gap-5">
          <div>
            <h1 className="font-display font-extrabold text-klein text-2xl tracking-[-0.03em]">
              Generador de cotización
            </h1>
            <p className="text-sm text-muted leading-relaxed mt-1">
              {payload
                ? `Brief cargado de ${payload.contact.name}. Pon los valores y ajusta lo que quieras: el dossier se actualiza al lado.`
                : 'Sin brief: abre el link que llega en el correo de la solicitud para cargarlo, o llena todo a mano.'}
            </p>
          </div>

          <Group title="Cliente">
            <Field label="Nombre">
              <input className={INPUT} value={draft.clientName} onChange={(e) => set('clientName', e.target.value)} />
            </Field>
            <Field label="Empresa o marca">
              <input className={INPUT} value={draft.clientCompany} onChange={(e) => set('clientCompany', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <input type="email" className={INPUT} value={draft.clientEmail} onChange={(e) => set('clientEmail', e.target.value)} />
              </Field>
              <Field label="Teléfono">
                <input className={INPUT} value={draft.clientPhone} onChange={(e) => set('clientPhone', e.target.value)} />
              </Field>
            </div>
          </Group>

          <Group title="Documento">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Folio">
                <input className={INPUT} value={draft.folio} onChange={(e) => set('folio', e.target.value)} />
              </Field>
              <Field label="Fecha">
                <input type="date" className={INPUT} value={draft.date} onChange={(e) => set('date', e.target.value)} />
              </Field>
              <Field label="Validez (días)">
                <input
                  type="number"
                  min={1}
                  className={INPUT}
                  value={draft.validDays}
                  onChange={(e) => set('validDays', Math.max(1, Number(e.target.value) || 1))}
                />
              </Field>
            </div>
          </Group>

          <Group title="Alcance e inversión">
            {draft.items.map((item, idx) => (
              <div key={item.id} className="rounded-xl border border-klein-deep/15 p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className={LABEL}>Concepto {idx + 1}</span>
                  {draft.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => set('items', draft.items.filter((i) => i.id !== item.id))}
                      className="text-xs text-carne-tinta hover:underline"
                    >
                      Quitar
                    </button>
                  )}
                </div>
                <input
                  className={INPUT}
                  value={item.title}
                  onChange={(e) => setItem(item.id, { title: e.target.value })}
                  placeholder="Nombre del concepto"
                  aria-label="Nombre del concepto"
                />
                <textarea
                  className={`${INPUT} resize-y`}
                  rows={5}
                  value={item.scope}
                  onChange={(e) => setItem(item.id, { scope: e.target.value })}
                  placeholder="Un entregable por línea"
                  aria-label="Entregables, uno por línea"
                />
                <PriceInput value={item.price} onChange={(n) => setItem(item.id, { price: n })} />
              </div>
            ))}
            <button
              type="button"
              onClick={() => set('items', [...draft.items, { id: uid(), title: '', scope: '', price: 0 }])}
              className="self-start text-sm font-medium text-klein hover:underline"
            >
              + Agregar concepto
            </button>
            <Field label="Impuestos">
              <select className={INPUT} value={draft.tax} onChange={(e) => set('tax', e.target.value as QuoteDraft['tax'])}>
                <option value="none">Sin IVA discriminado</option>
                <option value="iva">Más IVA (19%)</option>
              </select>
            </Field>
            <p className="text-sm font-medium text-klein-deep">Total: {formatCOP(total)}</p>
          </Group>

          <Group title="Pago, tiempos y condiciones">
            <Field label="Forma de pago">
              <textarea className={`${INPUT} resize-y`} rows={3} value={draft.payment} onChange={(e) => set('payment', e.target.value)} />
            </Field>
            <Field label="Tiempos">
              <textarea className={`${INPUT} resize-y`} rows={3} value={draft.timeline} onChange={(e) => set('timeline', e.target.value)} />
            </Field>
            <Field label="Condiciones (una por línea)">
              <textarea className={`${INPUT} resize-y`} rows={8} value={draft.terms} onChange={(e) => set('terms', e.target.value)} />
            </Field>
            <Field label="Nota personal (opcional)">
              <textarea className={`${INPUT} resize-y`} rows={3} value={draft.note} onChange={(e) => set('note', e.target.value)} />
            </Field>
          </Group>

          <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-paper-pure border-t border-klein-deep/15 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-klein text-paper-pure text-sm font-medium px-6 py-2.5 hover:bg-klein-mid transition-colors"
            >
              Descargar PDF
            </button>
            <button
              type="button"
              onClick={mailto}
              disabled={!draft.clientEmail}
              className="rounded-full border border-klein text-klein text-sm font-medium px-6 py-2.5 hover:bg-klein hover:text-paper-pure transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              Preparar correo
            </button>
            <button type="button" onClick={reset} className="text-sm text-muted hover:text-klein px-2">
              Reiniciar
            </button>
            <p className="basis-full text-[11px] text-muted leading-snug">
              En el cuadro de impresión elige «Guardar como PDF» y desactiva
              «Encabezados y pies de página». Luego adjunta el archivo al
              correo.
            </p>
          </div>
        </aside>

        {/* Vista previa del dossier */}
        <main className="p-4 sm:p-8 print:p-0">
          <QuoteDossier draft={draft} groups={groups} />
        </main>
      </div>
    </div>
  );
}
