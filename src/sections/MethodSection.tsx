import MethodCards from '../components/MethodCards';
import RevealText from '../components/RevealText';

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
          <RevealText
            as="h2"
            text="Nuestro método"
            unit="word"
            className="font-display font-semibold text-klein tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          />
        </div>

        <p className="text-ink-2 leading-relaxed max-w-xl mt-4 mb-12 sm:mb-16">
          Nada de plantillas de discurso. Así pasamos de tu idea a un sitio
          que vende.
        </p>

        <MethodCards steps={STEPS} />
      </div>
    </section>
  );
}
