import FadeIn from '../components/FadeIn';
import { AZULEJO } from '../data/botanica';

interface Founder {
  name: string;
  role: string;
  bio: string;
  /** true mientras falta la info real (evita que se vea como un error). */
  pending?: boolean;
}

const FOUNDERS: Founder[] = [
  {
    name: 'Oscar Díaz',
    role: 'Fundador · UX/UI Specialist & Desarrollador WordPress y Shopify',
    bio: 'Lidera cada proyecto de punta a punta: estrategia, diseño y desarrollo. Potencia cada idea con inteligencia artificial.',
  },
  {
    name: 'Jaynne Montero',
    role: 'Co-fundadora',
    bio: 'Su bio llega muy pronto.',
    pending: true,
  },
];

function FounderAvatar({ name }: { name: string }) {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-klein-deep flex items-center justify-center shrink-0">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `url(${AZULEJO})`,
          backgroundSize: '260%',
          backgroundPosition: 'center',
        }}
      />
      <span className="relative font-display font-extrabold text-paper-pure text-xl sm:text-2xl">
        {name.charAt(0)}
      </span>
    </div>
  );
}

export default function FoundersSection() {
  return (
    <section
      id="fundadores"
      className="bg-paper px-6 md:px-10 lg:px-16 py-20 sm:py-24 md:py-32 border-t border-klein-deep/15"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="text-[11px] tracking-[0.06em] text-carne-tinta">
            05
          </span>
          <h2
            className="font-display font-semibold text-klein tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          >
            Los fundadores
          </h2>
        </div>

        <p className="text-ink-2 leading-relaxed max-w-xl mt-4 mb-12 sm:mb-16">
          Dos personas, un mismo estándar: nada sale como todo lo demás.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
          {FOUNDERS.map((f, i) => (
            <FadeIn
              key={f.name}
              delay={i * 0.1}
              y={24}
              className="flex flex-col gap-5 p-6 sm:p-8 rounded-2xl border border-klein-deep/15 bg-paper-pure"
            >
              <FounderAvatar name={f.name} />
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display font-semibold text-klein tracking-[-0.01em] text-xl sm:text-2xl">
                  {f.name}
                </h3>
                <p className="text-muted text-sm tracking-[0.01em]">
                  {f.role}
                </p>
              </div>
              <p
                className={`leading-relaxed text-sm sm:text-base ${
                  f.pending ? 'italic text-muted' : 'text-ink-2'
                }`}
              >
                {f.bio}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
