import FadeIn from '../components/FadeIn';

// Las promesas reales de Out, dichas fuerte. Una frase corta y rotunda por
// línea (tipografía enorme, a la Huge) y, al lado, la prueba concreta de qué
// significa. Sin cifras inventadas: solo lo que Out realmente hace.
const REASONS = [
  {
    claim: 'Sin plantillas.',
    detail:
      'Cada sitio se diseña desde cero para tu marca. Nada de moldes que se ven iguales a los de tu competencia.',
  },
  {
    claim: 'Código propio.',
    detail:
      'Shopify, WordPress o a medida, construido a mano: rápido, limpio y tuyo para hacerlo crecer.',
  },
  {
    claim: 'Hecho para vender.',
    detail:
      'Cada página tiene un objetivo claro: que tu cliente compre, escriba o reserve.',
  },
  {
    claim: 'Contigo después.',
    detail:
      'No desaparecemos tras el lanzamiento: soporte, mejoras y optimización continua.',
  },
];

export default function WhyOut() {
  return (
    <section
      aria-labelledby="por-que-out"
      className="bg-paper px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20"
    >
      <div className="max-w-[1400px] mx-auto">
        <h2
          id="por-que-out"
          className="text-[11px] tracking-[0.1em] uppercase text-carne-tinta mb-5 sm:mb-6"
        >
          Por qué Out
        </h2>

        <ul>
          {REASONS.map((r, i) => (
            <FadeIn
              key={r.claim}
              as="li"
              delay={i * 0.06}
              y={28}
              className="group grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-3 lg:gap-16 items-end py-4 sm:py-5 border-t border-klein-deep/15 last:border-b"
            >
              <p
                className="font-display font-extrabold text-klein tracking-[-0.045em] leading-[0.95] transition-transform duration-500 ease-out lg:group-hover:translate-x-3"
                style={{ fontSize: 'clamp(1.7rem, 3.6vw, 3.2rem)' }}
              >
                {r.claim}
              </p>
              <p className="text-ink-2 leading-relaxed max-w-[44ch] lg:pb-3">
                {r.detail}
              </p>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
