import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import { FOUNDER } from '../data/founder';
import { WHATSAPP_URL } from '../data/site';

const HOME = import.meta.env.BASE_URL;

/** Quién está detrás de Out: la cara y las palabras de quien atiende al cliente. */
export default function FounderSection() {
  return (
    <section
      id="quien-soy"
      data-nav-bg="light"
      className="bg-paper-pure px-6 md:px-10 lg:px-16 py-16 sm:py-20 md:py-24"
    >
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,380px)_1fr] items-center gap-10 md:gap-16">
        <FadeIn>
          <img
            src={`${HOME}${FOUNDER.photo}`}
            alt={FOUNDER.alt}
            width={760}
            height={950}
            loading="lazy"
            className="w-full max-w-[380px] mx-auto md:mx-0 aspect-[4/5] object-cover rounded-[28px]"
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2
            className="font-display font-extrabold tracking-[-0.045em] leading-[0.96] text-klein-deep"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
          >
            Quién está detrás de Out
          </h2>
          <div className="mt-6 flex flex-col gap-4 text-klein-deep/85 text-base sm:text-lg leading-relaxed max-w-[52ch]">
            <p>{FOUNDER.intro}</p>
            {FOUNDER.why && <p>{FOUNDER.why}</p>}
            <p>{FOUNDER.how}</p>
          </div>
          <p className="mt-6 text-sm text-klein-deep/70">
            {FOUNDER.name}, {FOUNDER.role}
          </p>
          <AccentButton href={WHATSAPP_URL} className="mt-6">
            Escríbeme
          </AccentButton>
        </FadeIn>
      </div>
    </section>
  );
}
