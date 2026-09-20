import { useState } from 'react';
import AccentButton from '../components/AccentButton';
import { BrandDot } from '../components/Brand';
import FadeIn from '../components/FadeIn';

const CONTACT_URL = `${import.meta.env.BASE_URL}contacto.html`;

// Precios base reales de Out. El de WordPress es el único que depende del
// alcance (número de páginas), así que se muestra como calculadora.
const SHOPIFY_PRICE = 2_400_000;
const LANDING_PRICE = 1_400_000;
const WORDPRESS_BASE = 4_800_000;
const WORDPRESS_PER_PAGE = 1_200_000;
const MAX_EXTRA_PAGES = 15;

function formatCOP(amount: number): string {
  return `$${new Intl.NumberFormat('es-CO').format(amount)} COP`;
}

function PriceAmount({ amount, className }: { amount: number; className?: string }) {
  return (
    <span
      className={`font-display font-extrabold text-klein leading-none inline-flex items-baseline ${className ?? ''}`}
    >
      {formatCOP(amount)}
      <BrandDot />
    </span>
  );
}

function SimplePriceCard({
  eyebrow,
  amount,
  fromPrefix,
  note,
  description,
}: {
  eyebrow: string;
  amount?: number;
  fromPrefix?: boolean;
  note: string;
  description: string;
}) {
  return (
    <FadeIn
      y={24}
      className="flex flex-col gap-4 p-6 sm:p-8 rounded-2xl border border-klein-deep/15 bg-paper-pure"
    >
      <span className="text-muted tracking-[0.04em] text-[11px] sm:text-xs">
        {eyebrow}
      </span>
      {amount ? (
        <div className="flex flex-col gap-1">
          {fromPrefix && (
            <span className="text-xs text-muted">Desde</span>
          )}
          <PriceAmount amount={amount} className="text-2xl sm:text-3xl" />
        </div>
      ) : (
        <span
          className="font-display font-extrabold text-klein leading-none"
          style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)' }}
        >
          {note}
        </span>
      )}
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </FadeIn>
  );
}

function WordpressCalculator() {
  const [extraPages, setExtraPages] = useState(0);
  const total = WORDPRESS_BASE + extraPages * WORDPRESS_PER_PAGE;

  const decrease = () => setExtraPages((p) => Math.max(0, p - 1));
  const increase = () => setExtraPages((p) => Math.min(MAX_EXTRA_PAGES, p + 1));

  return (
    <FadeIn
      y={24}
      className="flex flex-col gap-6 p-6 sm:p-10 rounded-2xl border border-klein-deep/15 bg-paper-pure"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-md">
          <span className="text-muted tracking-[0.04em] text-[11px] sm:text-xs">
            Sitios WordPress
          </span>
          <h3 className="font-display font-semibold text-klein tracking-[-0.01em] text-xl sm:text-2xl">
            Calcula un estimado
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            El sitio base parte de {formatCOP(WORDPRESS_BASE)}. El precio final
            depende de la cantidad de páginas y el tipo de web —cada página
            adicional suma {formatCOP(WORDPRESS_PER_PAGE)} aprox.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
          <span className="text-xs text-muted">Total estimado</span>
          <PriceAmount amount={total} className="text-3xl sm:text-4xl" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-klein-deep/15">
        <span className="text-sm text-klein-deep font-medium">
          Páginas adicionales
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={decrease}
            disabled={extraPages === 0}
            aria-label="Restar página"
            className="w-9 h-9 rounded-full border border-klein-deep/25 text-klein flex items-center justify-center text-lg font-semibold transition-colors duration-200 hover:bg-klein hover:text-paper-pure disabled:opacity-30 disabled:pointer-events-none"
          >
            −
          </button>
          <span
            className="font-display font-semibold text-klein w-6 text-center"
            aria-live="polite"
          >
            {extraPages}
          </span>
          <button
            type="button"
            onClick={increase}
            disabled={extraPages === MAX_EXTRA_PAGES}
            aria-label="Sumar página"
            className="w-9 h-9 rounded-full border border-klein-deep/25 text-klein flex items-center justify-center text-lg font-semibold transition-colors duration-200 hover:bg-klein hover:text-paper-pure disabled:opacity-30 disabled:pointer-events-none"
          >
            +
          </button>
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed">
        Estimado de referencia. La cotización final se ajusta al alcance real
        de tu proyecto.
      </p>
    </FadeIn>
  );
}

export default function PricingSection() {
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
          <h2
            className="font-display font-semibold text-klein tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          >
            Cotización
          </h2>
        </div>

        <p className="text-ink-2 leading-relaxed max-w-xl mt-4 mb-12 sm:mb-16">
          Una idea de lo que cuesta, antes de escribirnos. Precios de
          referencia; la cotización final depende del alcance de tu proyecto.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <WordpressCalculator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <SimplePriceCard
              eyebrow="Tiendas Shopify"
              amount={SHOPIFY_PRICE}
              note=""
              description="Servicio completo: diseño, desarrollo, carga de productos y capacitación."
            />
            <SimplePriceCard
              eyebrow="Landing Pages"
              amount={LANDING_PRICE}
              fromPrefix
              note=""
              description="Página de campaña, lista para convertir."
            />
            <SimplePriceCard
              eyebrow="Automatizaciones & otros"
              note="Cotización a la medida"
              description="Integraciones, automatizaciones y proyectos a medida se cotizan directamente contigo."
            />
          </div>
        </div>

        <FadeIn y={20} delay={0.1} className="mt-10 sm:mt-12">
          <AccentButton href={CONTACT_URL}>
            Solicita tu cotización
          </AccentButton>
        </FadeIn>
      </div>
    </section>
  );
}
