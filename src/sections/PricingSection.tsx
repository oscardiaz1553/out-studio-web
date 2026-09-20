import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import AccentButton from '../components/AccentButton';
import { BrandDot } from '../components/Brand';
import FadeIn from '../components/FadeIn';

const CONTACT_URL = `${import.meta.env.BASE_URL}contacto.html`;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Precios base reales de Out. El de WordPress es el único que depende del
// alcance (número de páginas), así que se cotiza con un slider.
const SHOPIFY_PRICE = 2_400_000;
const LANDING_PRICE = 1_400_000;
const WORDPRESS_BASE = 4_800_000;
const WORDPRESS_PER_PAGE = 1_200_000;
const MAX_EXTRA_PAGES = 15;

function formatCOP(amount: number): string {
  return `$${new Intl.NumberFormat('es-CO').format(amount)} COP`;
}

type TabId = 'shopify' | 'wordpress' | 'landing' | 'otros';

const TABS: { id: TabId; label: string }[] = [
  { id: 'shopify', label: 'Tiendas Shopify' },
  { id: 'wordpress', label: 'Sitios WordPress' },
  { id: 'landing', label: 'Landing Pages' },
  { id: 'otros', label: 'Automatizaciones & otros' },
];

function PriceDisplay({
  amount,
  fromPrefix,
}: {
  amount: number;
  fromPrefix?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      {fromPrefix && <span className="text-xs text-muted">Desde</span>}
      <span className="font-display font-extrabold text-klein leading-none inline-flex items-baseline text-3xl sm:text-4xl">
        {formatCOP(amount)}
        <BrandDot />
      </span>
    </div>
  );
}

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<TabId>('wordpress');
  const [extraPages, setExtraPages] = useState(2);
  const reduceMotion = useReducedMotion();

  const wordpressTotal = WORDPRESS_BASE + extraPages * WORDPRESS_PER_PAGE;
  const sliderPercent = (extraPages / MAX_EXTRA_PAGES) * 100;

  const panelMotion = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 },
    transition: { duration: 0.25, ease: EASE_OUT },
  };

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

        <p className="text-ink-2 leading-relaxed max-w-xl mt-4 mb-10 sm:mb-12">
          Elige un servicio y arma tu estimado. Precios de referencia; la
          cotización final depende del alcance de tu proyecto.
        </p>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Elegir servicio a cotizar"
          className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? 'bg-klein text-paper-pure border border-klein'
                    : 'border border-klein-deep/25 text-klein-deep hover:border-klein hover:text-klein'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Panel dinámico */}
        <div className="rounded-2xl border border-klein-deep/15 bg-paper-pure p-6 sm:p-10 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'shopify' && (
              <motion.div
                key="shopify"
                {...panelMotion}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
              >
                <div className="max-w-md">
                  <h3 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-2">
                    Tiendas Shopify
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Servicio completo: diseño, desarrollo, carga de productos
                    y capacitación.
                  </p>
                </div>
                <PriceDisplay amount={SHOPIFY_PRICE} />
              </motion.div>
            )}

            {activeTab === 'landing' && (
              <motion.div
                key="landing"
                {...panelMotion}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
              >
                <div className="max-w-md">
                  <h3 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-2">
                    Landing Pages
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Página de campaña, lista para convertir.
                  </p>
                </div>
                <PriceDisplay amount={LANDING_PRICE} fromPrefix />
              </motion.div>
            )}

            {activeTab === 'wordpress' && (
              <motion.div key="wordpress" {...panelMotion}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                  <div className="max-w-md">
                    <h3 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-2">
                      Sitios WordPress
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      El sitio base parte de {formatCOP(WORDPRESS_BASE)}. El
                      precio final depende de la cantidad de páginas y el
                      tipo de web.
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs text-muted block mb-1">
                      Total estimado
                    </span>
                    <PriceDisplay amount={wordpressTotal} />
                  </div>
                </div>

                <div className="pt-6 border-t border-klein-deep/15">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-klein-deep">
                      Páginas adicionales
                    </span>
                    <span className="font-display font-semibold text-klein">
                      {extraPages}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={MAX_EXTRA_PAGES}
                    value={extraPages}
                    onChange={(e) => setExtraPages(Number(e.target.value))}
                    aria-label="Número de páginas adicionales"
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-klein [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-klein [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_1px_6px_rgba(20,30,92,0.4)] [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-klein [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #1B2FCC ${sliderPercent}%, rgba(20,30,92,0.14) ${sliderPercent}%)`,
                    }}
                  />
                  <div className="flex justify-between mt-2 text-[11px] text-muted">
                    <span>0</span>
                    <span>+{formatCOP(WORDPRESS_PER_PAGE)} / página</span>
                    <span>{MAX_EXTRA_PAGES}</span>
                  </div>
                </div>

                <p className="text-xs text-muted leading-relaxed mt-6">
                  Estimado de referencia. La cotización final se ajusta al
                  alcance real de tu proyecto.
                </p>
              </motion.div>
            )}

            {activeTab === 'otros' && (
              <motion.div
                key="otros"
                {...panelMotion}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
              >
                <div className="max-w-md">
                  <h3 className="font-display font-semibold text-klein text-xl sm:text-2xl mb-2">
                    Automatizaciones & otros servicios
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Integraciones, automatizaciones y proyectos a medida se
                    cotizan directamente contigo.
                  </p>
                </div>
                <AccentButton href={CONTACT_URL} className="shrink-0">
                  Hablemos
                </AccentButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {activeTab !== 'otros' && (
          <FadeIn y={20} delay={0.1} className="mt-8 sm:mt-10">
            <AccentButton href={CONTACT_URL}>
              Solicita tu cotización
            </AccentButton>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
