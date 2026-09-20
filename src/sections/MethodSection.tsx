import FadeIn from '../components/FadeIn';

// Cómo trabajamos, en 4 pasos. Ligado a los servicios reales (Shopify,
// WordPress, a medida) y a la promesa de no desaparecer tras el lanzamiento.
const STEPS = [
  {
    step: '01',
    title: 'Diagnóstico',
    description:
      'Entendemos tu negocio y a quién le vendes, antes de tocar una sola pantalla.',
  },
  {
    step: '02',
    title: 'Diseño & desarrollo',
    description:
      'Diseñamos y construimos con código propio: Shopify, WordPress o a medida. Ves avances reales, no mockups sueltos.',
  },
  {
    step: '03',
    title: 'Lanzamiento',
    description:
      'Salimos a producción con todo probado: velocidad, SEO técnico, pagos y formularios funcionando.',
  },
  {
    step: '04',
    title: 'Soporte',
    description:
      'No desaparecemos después del lanzamiento. Seguimos optimizando contigo.',
  },
];

export default function MethodSection() {
  return (
    <section
      id="metodo"
      className="bg-paper px-6 md:px-10 lg:px-16 py-20 sm:py-24 md:py-32 border-t border-klein-deep/15"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="text-[11px] tracking-[0.06em] text-carne-tinta">
            02
          </span>
          <h2
            className="font-display font-semibold text-klein tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          >
            Nuestro método
          </h2>
        </div>

        <p className="text-ink-2 leading-relaxed max-w-xl mt-4 mb-12 sm:mb-16">
          Nada de plantillas de discurso. Así pasamos de tu idea a un sitio
          que vende.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-klein-deep/15">
          {STEPS.map((s, i) => (
            <FadeIn
              key={s.step}
              delay={i * 0.08}
              y={24}
              className={`flex flex-col gap-4 py-8 px-0 lg:px-8 border-b sm:border-b-0 border-klein-deep/15 ${
                i > 0 ? 'lg:border-l lg:border-klein-deep/15 lg:pl-8' : ''
              } ${i % 2 === 1 ? '' : 'sm:border-r sm:border-klein-deep/15 sm:pr-8'}`}
            >
              <span
                className="font-display font-extrabold text-klein/25 leading-none"
                style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)' }}
              >
                {s.step}
              </span>
              <h3 className="font-display font-semibold text-klein tracking-[-0.01em] text-lg sm:text-xl">
                {s.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {s.description}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
