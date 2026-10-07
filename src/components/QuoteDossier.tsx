import { ReactNode } from 'react';
import LogoOut from './LogoOut';
import { AnswerGroup } from '../data/quote';
import { EMAIL, PHONE_DISPLAY } from '../data/site';

export interface QuoteItem {
  id: string;
  title: string;
  /** Un entregable por línea. */
  scope: string;
  price: number;
}

export interface QuoteDraft {
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  clientPhone: string;
  folio: string;
  /** AAAA-MM-DD */
  date: string;
  validDays: number;
  items: QuoteItem[];
  tax: 'none' | 'iva';
  payment: string;
  timeline: string;
  terms: string;
  note: string;
}

export const IVA_RATE = 0.19;

export function formatCOP(amount: number): string {
  return `$${new Intl.NumberFormat('es-CO').format(Math.round(amount))} COP`;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(d);
}

export function validUntil(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(d);
}

export function totals(draft: QuoteDraft) {
  const subtotal = draft.items.reduce((sum, i) => sum + (i.price || 0), 0);
  const iva = draft.tax === 'iva' ? subtotal * IVA_RATE : 0;
  return { subtotal, iva, total: subtotal + iva };
}

const lines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

const BOTANICA = `${import.meta.env.BASE_URL}botanica.png`;

function Page({
  children,
  folio,
  chrome = true,
}: {
  children: ReactNode;
  folio: string;
  chrome?: boolean;
}) {
  return (
    <section className="dossier-page relative bg-paper-pure text-klein-deep shadow-[0_8px_40px_rgba(20,30,92,0.12)] mx-auto mb-8 w-full max-w-[210mm] min-h-[297mm] flex flex-col overflow-hidden">
      {chrome && (
        <header className="flex items-center justify-between px-[16mm] pt-[12mm]">
          <LogoOut decorative className="h-9 w-auto text-klein" />
          <span className="text-[10px] tracking-[0.08em] uppercase text-muted">
            Propuesta {folio}
          </span>
        </header>
      )}
      <div className="flex-1 px-[16mm] py-[10mm]">{children}</div>
      {chrome && (
        <footer className="mx-[16mm] mb-[10mm] pt-3 flex items-center justify-between text-[10px] text-muted border-t border-klein-deep/10">
          <span>Out. Studio</span>
          <span>
            {EMAIL} · {PHONE_DISPLAY}
          </span>
        </footer>
      )}
    </section>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display font-semibold text-klein tracking-[-0.03em] text-[26px] leading-tight mb-6">
      {children}
    </h2>
  );
}

export default function QuoteDossier({
  draft,
  groups,
}: {
  draft: QuoteDraft;
  groups: AnswerGroup[];
}) {
  const { subtotal, iva, total } = totals(draft);
  const client = draft.clientCompany || draft.clientName || 'tu proyecto';
  const projectTitles = draft.items.map((i) => i.title).filter(Boolean);
  const terms = lines(draft.terms);

  return (
    <div className="dossier">
      {/* Portada */}
      <Page folio={draft.folio} chrome={false}>
        <div className="absolute inset-0 bg-klein-deep" />
        <img
          src={BOTANICA}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '52% 42%' }}
        />
        <div className="absolute inset-0 bg-klein mix-blend-multiply opacity-[0.6]" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,30,92,.5) 0%, rgba(20,30,92,.1) 35%, rgba(20,30,92,.55) 65%, rgba(20,30,92,.95) 100%)',
          }}
        />
        <div className="relative h-full min-h-[277mm] flex flex-col justify-between text-paper-pure">
          <LogoOut decorative className="h-14 w-auto text-paper-pure self-start" />
          <div>
            <p className="text-[11px] tracking-[0.12em] uppercase text-carne mb-4">
              Propuesta de cotización
            </p>
            <h1 className="font-display font-extrabold tracking-[-0.035em] leading-[0.95] text-[54px] mb-6">
              {client}
            </h1>
            {projectTitles.length > 0 && (
              <p className="text-lg text-paper-pure/90 max-w-[120mm] leading-snug">
                {projectTitles.join(' · ')}
              </p>
            )}
            <p className="font-display font-semibold text-carne mt-8 text-xl">
              Never the usual.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-6 text-sm border-t border-paper-pure/30 pt-5">
            <div>
              <dt className="text-[10px] tracking-[0.1em] uppercase text-carne mb-1">
                Folio
              </dt>
              <dd>{draft.folio}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.1em] uppercase text-carne mb-1">
                Fecha
              </dt>
              <dd>{formatDate(draft.date)}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.1em] uppercase text-carne mb-1">
                Válida hasta
              </dt>
              <dd>{validUntil(draft.date, draft.validDays)}</dd>
            </div>
          </dl>
        </div>
      </Page>

      {/* Lo que entendimos */}
      {groups.length > 0 && (
        <Page folio={draft.folio}>
          <H2>Lo que entendimos de tu proyecto</H2>
          <p className="text-sm text-ink-2 leading-relaxed mb-8 max-w-[140mm]">
            Estas son las respuestas que nos compartiste. Esta propuesta se
            construye sobre ellas; si algo no está bien, avísanos y lo
            ajustamos.
          </p>
          <div className="flex flex-col gap-7">
            {groups.map((g) => (
              <div key={g.title} className="break-inside-avoid">
                <h3 className="font-display font-semibold text-klein text-base mb-3 pb-2 border-b border-klein-deep/15">
                  {g.title}
                </h3>
                <dl className="flex flex-col gap-3">
                  {g.rows.map((r) => (
                    <div
                      key={r.question}
                      className="grid grid-cols-[1fr_1.2fr] gap-6 text-[12.5px] leading-snug"
                    >
                      <dt className="text-muted">{r.question}</dt>
                      <dd className="text-klein-deep">{r.answer}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Page>
      )}

      {/* Alcance e inversión */}
      <Page folio={draft.folio}>
        <H2>Alcance de la propuesta</H2>
        <div className="flex flex-col gap-6 mb-10">
          {draft.items.map((item) => (
            <div key={item.id} className="break-inside-avoid">
              <h3 className="font-display font-semibold text-klein text-lg mb-2">
                {item.title || 'Concepto'}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {lines(item.scope).map((l) => (
                  <li
                    key={l}
                    className="flex gap-2.5 text-[13px] leading-snug text-klein-deep"
                  >
                    <span
                      aria-hidden
                      className="mt-[5px] w-1.5 h-1.5 rounded-full bg-carne-deep shrink-0"
                    />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="break-inside-avoid">
          <H2>Inversión</H2>
          <table className="w-full text-[13px] border-collapse">
            <tbody>
              {draft.items.map((item) => (
                <tr key={item.id} className="border-b border-klein-deep/12">
                  <td className="py-3 pr-4">{item.title || 'Concepto'}</td>
                  <td className="py-3 text-right font-medium whitespace-nowrap">
                    {item.price > 0 ? formatCOP(item.price) : 'Por definir'}
                  </td>
                </tr>
              ))}
              {draft.tax === 'iva' && (
                <>
                  <tr className="border-b border-klein-deep/12">
                    <td className="py-3 pr-4 text-muted">Subtotal</td>
                    <td className="py-3 text-right whitespace-nowrap">
                      {formatCOP(subtotal)}
                    </td>
                  </tr>
                  <tr className="border-b border-klein-deep/12">
                    <td className="py-3 pr-4 text-muted">IVA (19%)</td>
                    <td className="py-3 text-right whitespace-nowrap">
                      {formatCOP(iva)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          <div className="mt-5 rounded-xl bg-klein text-paper-pure px-6 py-5 flex items-baseline justify-between gap-4">
            <span className="text-[11px] tracking-[0.1em] uppercase text-carne">
              Total{draft.tax === 'none' ? '' : ' con IVA'}
            </span>
            <span className="font-display font-extrabold text-[28px] leading-none">
              {formatCOP(total)}
            </span>
          </div>
          {draft.tax === 'none' && (
            <p className="text-[11px] text-muted mt-2">
              Valores en pesos colombianos (COP).
            </p>
          )}
        </div>
      </Page>

      {/* Tiempos, condiciones y cierre */}
      <Page folio={draft.folio}>
        <H2>Forma de pago y tiempos</H2>
        <div className="grid grid-cols-2 gap-8 mb-10 text-[13px] leading-relaxed">
          <div>
            <h3 className="font-display font-semibold text-klein mb-2">
              Forma de pago
            </h3>
            <p className="whitespace-pre-line">{draft.payment}</p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-klein mb-2">
              Tiempos
            </h3>
            <p className="whitespace-pre-line">{draft.timeline}</p>
          </div>
        </div>

        {terms.length > 0 && (
          <div className="mb-10 break-inside-avoid">
            <h3 className="font-display font-semibold text-klein mb-3">
              Condiciones
            </h3>
            <ul className="flex flex-col gap-2">
              {terms.map((t) => (
                <li
                  key={t}
                  className="flex gap-2.5 text-[12.5px] leading-snug text-ink-2"
                >
                  <span
                    aria-hidden
                    className="mt-[5px] w-1.5 h-1.5 rounded-full bg-klein-soft shrink-0"
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {draft.note.trim() && (
          <div className="mb-10 break-inside-avoid rounded-xl bg-paper px-6 py-5 text-[13px] leading-relaxed whitespace-pre-line">
            {draft.note}
          </div>
        )}

        <div className="break-inside-avoid rounded-xl border border-klein/30 px-6 py-6">
          <h3 className="font-display font-semibold text-klein text-lg mb-2">
            Siguientes pasos
          </h3>
          <p className="text-[13px] leading-relaxed text-ink-2 mb-4">
            Si la propuesta te hace sentido, respóndenos a este correo o por
            WhatsApp y coordinamos el anticipo para arrancar. Con gusto
            resolvemos cualquier duda antes.
          </p>
          <p className="text-[13px] font-medium text-klein">
            {EMAIL} · {PHONE_DISPLAY}
          </p>
        </div>
      </Page>
    </div>
  );
}
