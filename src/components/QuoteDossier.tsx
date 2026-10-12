import { ReactNode } from 'react';
import LogoOut from './LogoOut';
import TitleFrame, { FrameKind, Sym } from './TitleFrame';
import { SCENES } from './ServiceScenes';
import { AnswerGroup } from '../data/quote';
import { EMAIL, PHONE_DISPLAY } from '../data/site';
import { AZULEJO_BAND } from '../data/botanica';

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
  /** Quién recomendó al cliente (vacío si nadie). */
  referral: string;
  /** Descuento por referido, en porcentaje (0 = sin descuento). */
  referralDiscount: number;
  payment: string;
  timeline: string;
  terms: string;
  note: string;
  /** Cuerpo del correo con el que se envía el PDF. */
  emailMessage: string;
}

export const IVA_RATE = 0.19;
/** Descuento por referido que se propone por defecto (editable en el generador). */
export const REFERRAL_DISCOUNT = 10;

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
  const pct = Math.min(100, Math.max(0, draft.referralDiscount || 0));
  const discount = Math.round((subtotal * pct) / 100);
  const base = subtotal - discount;
  const iva = draft.tax === 'iva' ? base * IVA_RATE : 0;
  return { subtotal, discount, pct, iva, total: base + iva };
}

const lines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

const BASE = import.meta.env.BASE_URL;
const MONO_ASOMA = `${BASE}mono-asoma.webp`;
const MONO_LAPTOP = `${BASE}mono-laptop.webp`;

/*
  Ojo al editar: este componente también se convierte en el PDF que se le
  envía al cliente (src/lib/dossierPdf.ts). Para que las imágenes salgan en
  cualquier navegador, las <img> van en posición absoluta y ningún contenedor
  que tenga imágenes va rotado.
*/

// Los pasos del método, con el símbolo de la marca que acompaña a cada uno.
const STEPS: { verb: string; text: string; kind: FrameKind }[] = [
  { verb: 'Escuchamos', text: 'Entendemos tu negocio y lo que tiene que lograr el proyecto.', kind: 'square' },
  { verb: 'Construimos', text: 'Diseñamos y desarrollamos con código propio. Ves avances reales y los apruebas.', kind: 'curly' },
  { verb: 'Lanzamos', text: 'Probamos todo antes de salir: velocidad, pagos, formularios y SEO técnico.', kind: 'angle' },
  { verb: 'Seguimos', text: 'No desaparecemos: soporte, ajustes y mejoras después del lanzamiento.', kind: 'paren' },
];

// La lámina de cada concepto, según cómo se llame.
const FALLBACK_SCENES = ['wordpress', 'landing', 'apps'];
function sceneFor(title: string, index: number): string {
  const t = title.toLowerCase();
  if (/emprende/.test(t)) return 'emprende';
  if (/landing/.test(t)) return 'landing';
  if (/shopify|tienda|e-?commerce/.test(t)) return 'shopify';
  if (/marca|branding|identidad|logo/.test(t)) return 'branding';
  if (/soporte|mantenimiento|optimiza/.test(t)) return 'soporte';
  if (/app|automatiza|integraci/.test(t)) return 'apps';
  if (/wordpress|sitio|web|p[aá]gina/.test(t)) return 'wordpress';
  return FALLBACK_SCENES[index % FALLBACK_SCENES.length];
}

// Lo demás que hace Out, para cerrar la propuesta (sin los que ya se cotizan).
const OTHER_SERVICES = [
  { scene: 'shopify', label: 'Tiendas Shopify' },
  { scene: 'wordpress', label: 'Sitios WordPress' },
  { scene: 'landing', label: 'Landing pages' },
  { scene: 'branding', label: 'Branding' },
  { scene: 'soporte', label: 'Soporte y mejoras' },
];

function Lamina({ scene, className = '' }: { scene: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden rounded-[4mm] aspect-[4/5] shrink-0 ${className}`}
      style={{ containerType: 'inline-size' }}
    >
      {SCENES[scene] ?? SCENES.wordpress}
    </div>
  );
}

/** Franja de azulejo a todo el ancho de la hoja. */
function AzulejoBand({ height, className = '' }: { height: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        height,
        backgroundImage: `url(${AZULEJO_BAND})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
      }}
    />
  );
}

/** Un par de símbolos enorme y tenue, de fondo. */
function GhostPair({
  kind,
  size,
  className,
  color,
  opacity,
}: {
  kind: FrameKind;
  size: string;
  className: string;
  color: string;
  opacity: number;
}) {
  return (
    <span
      aria-hidden
      className={`absolute flex gap-[0.35em] pointer-events-none ${className}`}
      style={{ fontSize: size, color, opacity }}
    >
      <Sym kind={kind} />
      <Sym kind={kind} flip />
    </span>
  );
}

function Page({
  children,
  folio,
  chrome = true,
  className = 'bg-paper-pure text-klein-deep',
}: {
  children: ReactNode;
  folio: string;
  chrome?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`dossier-page relative shadow-[0_8px_40px_rgba(20,30,92,0.12)] mx-auto mb-8 w-full max-w-[210mm] min-h-[297mm] flex flex-col overflow-hidden ${className}`}
    >
      {chrome && (
        <header className="relative flex items-center justify-between px-[16mm] pt-[12mm]">
          <LogoOut decorative className="h-9 w-auto text-klein" />
          <span className="text-[11px] text-muted">Propuesta {folio}</span>
        </header>
      )}
      <div className="relative flex-1 flex flex-col px-[16mm] py-[10mm]">{children}</div>
      {chrome && (
        <footer className="relative">
          <div className="mx-[16mm] pb-3 flex items-center justify-between text-[10px] text-muted">
            <span>Out Studio · outstudio.online</span>
            <span>
              {EMAIL} · {PHONE_DISPLAY}
            </span>
          </div>
          <AzulejoBand height="7mm" />
        </footer>
      )}
    </section>
  );
}

function H2({
  children,
  kind = 'square',
  tone = 'warm',
}: {
  children: ReactNode;
  kind?: FrameKind;
  tone?: 'warm' | 'light';
}) {
  return (
    <div className="mb-6">
      <TitleFrame kind={kind} tone={tone} fontSize="28px">
        <h2
          className={`font-display font-extrabold tracking-[-0.035em] text-[28px] leading-tight ${
            tone === 'warm' ? 'text-klein' : 'text-paper-pure'
          }`}
        >
          {children}
        </h2>
      </TitleFrame>
    </div>
  );
}

function Check({ dark = false }: { dark?: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-[1px] shrink-0 w-[15px] h-[15px] rounded-full flex items-center justify-center ${
        dark ? 'bg-carne text-klein-deep' : 'bg-klein text-paper-pure'
      }`}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/*
  Las respuestas del brief se reparten en hojas para que ninguna se pase de
  A4 (si se pasa, el PDF la corta por la mitad). La altura es un estimado en
  mm: cada tarjeta de grupo más una fila por cada dos respuestas.
*/
const FIRST_PAGE_MM = 150;
const NEXT_PAGE_MM = 225;
const GROUP_MM = 24;
const ROW_MM = 13;

function paginateAnswers(groups: AnswerGroup[]): AnswerGroup[][] {
  const pages: AnswerGroup[][] = [[]];
  let room = FIRST_PAGE_MM;
  for (const g of groups) {
    let rows = g.rows;
    let title = g.title;
    while (rows.length) {
      const fit = Math.floor((room - GROUP_MM) / ROW_MM) * 2;
      if (fit < 2 && pages[pages.length - 1].length) {
        pages.push([]);
        room = NEXT_PAGE_MM;
        continue;
      }
      const take = rows.slice(0, Math.max(2, fit));
      pages[pages.length - 1].push({ title, rows: take });
      room -= GROUP_MM + Math.ceil(take.length / 2) * ROW_MM + 5;
      rows = rows.slice(take.length);
      title = `${g.title} (continuación)`;
      if (rows.length) {
        pages.push([]);
        room = NEXT_PAGE_MM;
      }
    }
  }
  return pages.filter((p) => p.length);
}

function AnswerCards({ groups }: { groups: AnswerGroup[] }) {
  return (
    <div className="flex flex-col gap-5">
      {groups.map((g) => (
        <div key={g.title} className="rounded-[4mm] bg-paper px-6 py-5">
          <h3 className="font-display font-extrabold text-klein tracking-[-0.02em] text-[17px] mb-4">
            {g.title}
          </h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {g.rows.map((r) => (
              <div key={r.question} className="border-l-2 border-carne-deep pl-3">
                <dt className="text-[11px] leading-snug text-muted mb-1">{r.question}</dt>
                <dd className="text-[13px] leading-snug font-medium text-klein-deep">{r.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export default function QuoteDossier({
  draft,
  groups,
}: {
  draft: QuoteDraft;
  groups: AnswerGroup[];
}) {
  const { subtotal, discount, pct, iva, total } = totals(draft);
  const client = draft.clientCompany || draft.clientName || 'tu proyecto';
  const firstName = draft.clientName.trim().split(' ')[0];
  const projectTitles = draft.items.map((i) => i.title).filter(Boolean);
  const terms = lines(draft.terms);
  const answerPages = paginateAnswers(groups);
  const used = new Set(draft.items.map((item, i) => sceneFor(item.title, i)));
  const others = OTHER_SERVICES.filter((o) => !used.has(o.scene)).slice(0, 4);

  return (
    <div className="dossier">
      {/* Portada: azul Klein, el nombre del cliente y Mango asomándose. */}
      <Page folio={draft.folio} chrome={false} className="bg-klein text-paper-pure">
        <GhostPair kind="curly" size="360px" color="#F5E3B3" opacity={0.07} className="right-[-18mm] top-[34mm]" />
        <div className="relative flex-1 flex flex-col pt-[2mm]">
          <div className="flex items-center justify-between">
            <LogoOut decorative className="h-14 w-auto text-paper-pure" />
            <span className="text-[12px] text-paper-pure/75">Propuesta {draft.folio}</span>
          </div>

          <div className="mt-[46mm] max-w-[150mm]">
            <p className="text-[15px] text-carne mb-4">Propuesta de cotización para</p>
            <h1 className="font-display font-extrabold tracking-[-0.045em] leading-[0.92] text-[64px]">
              {client}
            </h1>
            {projectTitles.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2 max-w-[120mm]">
                {projectTitles.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-paper-pure/35 px-4 py-1.5 text-[13px] text-paper-pure"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-auto mb-[8mm] max-w-[96mm]">
            <p className="font-display font-extrabold text-carne text-[30px] tracking-[-0.03em] leading-none mb-7">
              Never the usual.
            </p>
            <dl className="grid grid-cols-[28mm_1fr] gap-x-4 gap-y-2 text-[13px] border-t border-paper-pure/30 pt-5">
              <dt className="text-carne">Fecha</dt>
              <dd>{formatDate(draft.date)}</dd>
              <dt className="text-carne">Válida hasta</dt>
              <dd>{validUntil(draft.date, draft.validDays)}</dd>
              <dt className="text-carne">Preparada por</dt>
              <dd>Oscar Díaz · Out Studio</dd>
            </dl>
          </div>
        </div>
        <img
          src={MONO_ASOMA}
          alt=""
          aria-hidden
          className="absolute w-[128mm] h-auto"
          style={{ right: '-2mm', bottom: '16mm' }}
        />
        <AzulejoBand height="16mm" className="relative -mx-[16mm] -mb-[10mm]" />
      </Page>

      {/* Saludo y lo que entendimos */}
      <Page folio={draft.folio}>
        <div className="grid grid-cols-[1fr_46mm] gap-[10mm] items-start mb-[10mm]">
          <div>
            <h2 className="font-display font-extrabold text-klein tracking-[-0.045em] leading-[0.95] text-[44px] mb-5">
              Hola{firstName ? `, ${firstName}` : ''}.
            </h2>
            <p className="text-[14px] leading-relaxed text-ink-2 mb-3">
              Gracias por contarnos tu idea. Aquí está nuestra propuesta: lo que
              vamos a hacer, cuánto cuesta y cómo trabajamos.
            </p>
            <p className="text-[14px] leading-relaxed text-ink-2">
              Si algo no te cuadra, lo hablamos y lo ajustamos. Para eso estamos.
            </p>
            <p className="mt-6 font-display font-bold text-klein-deep text-[15px]">
              Oscar Díaz
              <span className="block font-sans font-normal text-[12px] text-muted">
                Out Studio
              </span>
            </p>
          </div>
          <Lamina scene="wordpress" className="w-[46mm]" />
        </div>

        {answerPages[0] && (
          <>
            <H2 kind="paren">Lo que entendimos</H2>
            <AnswerCards groups={answerPages[0]} />
          </>
        )}
      </Page>
      {answerPages.slice(1).map((chunk, k) => (
        <Page key={k} folio={draft.folio}>
          <AnswerCards groups={chunk} />
        </Page>
      ))}

      {/* Alcance: una tarjeta por concepto, con su lámina. */}
      <Page folio={draft.folio}>
        <H2 kind="square">Lo que vamos a hacer</H2>
        <div className="flex flex-col gap-5">
          {draft.items.map((item, i) => (
            <div key={item.id} className="rounded-[4mm] bg-paper p-[5mm] flex gap-[6mm] items-start">
              <Lamina scene={sceneFor(item.title, i)} className="w-[36mm]" />
              <div className="flex-1 pt-1">
                <h3 className="font-display font-extrabold text-klein tracking-[-0.03em] text-[22px] leading-tight mb-3">
                  {item.title || 'Concepto'}
                </h3>
                <ul className="flex flex-col gap-2">
                  {lines(item.scope).map((l) => (
                    <li key={l} className="flex gap-2.5 text-[13px] leading-snug text-klein-deep">
                      <Check />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Page>

      {/* Inversión, forma de pago, tiempos y condiciones */}
      <Page folio={draft.folio}>
        <H2 kind="curly">Tu inversión</H2>
        <div className="relative overflow-hidden rounded-[5mm] bg-klein-deep text-paper-pure px-[8mm] py-[7mm]">
          <table className="relative w-full text-[13px] border-collapse">
            <tbody>
              {draft.items.map((item) => (
                <tr key={item.id} className="border-b border-paper-pure/15">
                  <td className="py-3 pr-4">{item.title || 'Concepto'}</td>
                  <td className="py-3 text-right font-medium whitespace-nowrap">
                    {item.price > 0 ? formatCOP(item.price) : 'Por definir'}
                  </td>
                </tr>
              ))}
              {(draft.tax === 'iva' || discount > 0) && (
                <tr className="border-b border-paper-pure/15">
                  <td className="py-3 pr-4 text-paper-pure/70">Subtotal</td>
                  <td className="py-3 text-right whitespace-nowrap text-paper-pure/70">{formatCOP(subtotal)}</td>
                </tr>
              )}
              {discount > 0 && (
                <tr className="border-b border-paper-pure/15">
                  <td className="py-3 pr-4">
                    <span className="text-carne font-medium">Descuento por referido ({pct}%)</span>
                    {draft.referral.trim() && (
                      <span className="block text-[11px] text-paper-pure/65">
                        Recomendado por {draft.referral.trim()}. Gracias por llegar de su mano.
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right whitespace-nowrap text-carne font-medium">
                    − {formatCOP(discount)}
                  </td>
                </tr>
              )}
              {draft.tax === 'iva' && (
                <tr className="border-b border-paper-pure/15">
                  <td className="py-3 pr-4 text-paper-pure/70">IVA (19%)</td>
                  <td className="py-3 text-right whitespace-nowrap text-paper-pure/70">{formatCOP(iva)}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="relative mt-6 flex items-end justify-between gap-4">
            <span className="text-[13px] text-carne pb-1">
              Total{draft.tax === 'none' ? '' : ' con IVA'}
            </span>
            <span className="font-display font-extrabold text-carne text-[40px] tracking-[-0.03em] leading-none">
              {formatCOP(total)}
            </span>
          </div>
          <p className="relative mt-4 pt-4 border-t border-paper-pure/15 text-[11.5px] leading-relaxed text-paper-pure/75">
            Valor inicial, calculado con la información que nos compartiste. Puede
            ajustarse cuando definamos el detalle del proyecto en una reunión uno a uno.
          </p>
        </div>
        {draft.tax === 'none' && (
          <p className="text-[11px] text-muted mt-2">Valores en pesos colombianos (COP).</p>
        )}

        <div className="grid grid-cols-2 gap-4 mt-[10mm]">
          {[
            { title: 'Forma de pago', text: draft.payment, kind: 'square' as FrameKind },
            { title: 'Tiempos', text: draft.timeline, kind: 'angle' as FrameKind },
          ].map((b) => (
            <div key={b.title} className="rounded-[4mm] bg-carne px-6 py-5">
              <span aria-hidden className="flex gap-[0.3em] text-carne-deep mb-3" style={{ fontSize: '22px' }}>
                <Sym kind={b.kind} />
                <Sym kind={b.kind} flip />
              </span>
              <h3 className="font-display font-extrabold text-klein-deep tracking-[-0.02em] text-[18px] mb-2">
                {b.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-klein-deep whitespace-pre-line">{b.text}</p>
            </div>
          ))}
        </div>

        {terms.length > 0 && (
          <div className="mt-[10mm]">
            <h3 className="font-display font-extrabold text-klein tracking-[-0.02em] text-[18px] mb-3">
              Condiciones
            </h3>
            <ul className="flex flex-col gap-2.5">
              {terms.map((t) => (
                <li key={t} className="flex gap-2.5 text-[12.5px] leading-snug text-ink-2">
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Page>

      {/* Cómo trabajamos, nota y lo demás que hacemos */}
      <Page folio={draft.folio}>
        <H2 kind="angle">Cómo trabajamos</H2>
        <ol className="grid grid-cols-2 gap-4 mb-[10mm]">
          {STEPS.map((s) => (
            <li key={s.verb} className="rounded-[4mm] bg-paper px-6 py-5">
              <span aria-hidden className="flex gap-[0.3em] text-carne-deep mb-3" style={{ fontSize: '22px' }}>
                <Sym kind={s.kind} />
                <Sym kind={s.kind} flip />
              </span>
              <h3 className="font-display font-extrabold text-klein tracking-[-0.03em] text-[20px] mb-1.5">
                {s.verb}.
              </h3>
              <p className="text-[12.5px] leading-relaxed text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>

        {draft.note.trim() && (
          <div className="rounded-[4mm] border-2 border-klein px-6 py-5">
            <h3 className="font-display font-extrabold text-klein tracking-[-0.02em] text-[16px] mb-1.5">
              Una nota para ti
            </h3>
            <p className="text-[13px] leading-relaxed text-klein-deep whitespace-pre-line">{draft.note}</p>
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-auto pt-[10mm]">
            <h3 className="font-display font-extrabold text-klein tracking-[-0.02em] text-[18px] mb-1">
              Y cuando lo necesites
            </h3>
            <p className="text-[12.5px] text-ink-2 mb-4">También te acompañamos con:</p>
            <ul className="grid grid-cols-4 gap-4">
              {others.map((o) => (
                <li key={o.scene}>
                  <Lamina scene={o.scene} className="w-full" />
                  <p className="mt-2 font-display font-bold text-klein-deep text-[13px] leading-tight">{o.label}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Page>

      {/* Contraportada: el llamado a arrancar. */}
      <Page folio={draft.folio} chrome={false} className="bg-klein-deep text-paper-pure">
        <AzulejoBand height="16mm" className="relative -mx-[16mm] -mt-[10mm] mb-[12mm]" />
        <GhostPair kind="square" size="320px" color="#F5E3B3" opacity={0.05} className="right-[-12mm] top-[44mm]" />
        <div className="relative flex-1 flex flex-col">
          <LogoOut decorative className="h-12 w-auto text-paper-pure self-start" />
          <div className="mt-[40mm] max-w-[140mm]">
            <h2 className="font-display font-extrabold text-carne tracking-[-0.05em] leading-[0.92] text-[76px] mb-6">
              ¿Arrancamos?
            </h2>
            <p className="text-[16px] leading-relaxed text-paper-pure/90 max-w-[118mm]">
              Si la propuesta te hace sentido, respóndenos al correo o escríbenos
              por WhatsApp y coordinamos el anticipo para empezar. Si tienes dudas,
              las resolvemos antes.
            </p>
          </div>
          <dl className="mt-[14mm] grid grid-cols-[24mm_1fr] gap-x-4 gap-y-3 text-[15px] max-w-[110mm]">
            <dt className="text-carne text-[13px] pt-[2px]">Correo</dt>
            <dd className="font-medium">{EMAIL}</dd>
            <dt className="text-carne text-[13px] pt-[2px]">WhatsApp</dt>
            <dd className="font-medium">{PHONE_DISPLAY}</dd>
            <dt className="text-carne text-[13px] pt-[2px]">Web</dt>
            <dd className="font-medium">outstudio.online</dd>
          </dl>
          <p className="mt-auto font-display font-extrabold text-paper-pure text-[26px] tracking-[-0.03em]">
            Never the usual.
          </p>
        </div>
        <img
          src={MONO_LAPTOP}
          alt=""
          aria-hidden
          className="absolute w-[118mm] h-auto"
          style={{ right: '-8mm', bottom: '6mm' }}
        />
      </Page>
    </div>
  );
}
