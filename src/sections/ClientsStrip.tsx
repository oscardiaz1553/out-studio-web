import { CLIENTS } from '../data/clients';

/**
 * "Marcas que confían en Out": una cinta continua con el nombre (o el logo,
 * cuando lo haya) de cada marca con la que se ha trabajado. Prueba social
 * justo debajo del hero. Decorativa en movimiento: el listado completo está
 * en un sr-only, y la animación se detiene con prefers-reduced-motion.
 */
export default function ClientsStrip() {
  return (
    <section
      aria-labelledby="marcas-confian"
      className="bg-paper border-b border-klein-deep/15 py-10 sm:py-14 overflow-hidden"
    >
      <h2
        id="marcas-confian"
        className="px-6 md:px-10 lg:px-16 mb-6 sm:mb-8 text-[11px] tracking-[0.1em] uppercase text-carne-tinta"
      >
        Marcas que confían en Out
      </h2>
      <p className="sr-only">{CLIENTS.map((c) => c.name).join(', ')}</p>

      <div aria-hidden className="clients-track flex w-max items-center">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center shrink-0">
            {CLIENTS.map((c) => (
              <span
                key={`${half}-${c.name}`}
                className="flex items-center mr-12 sm:mr-20"
              >
                {c.logo ? (
                  <img
                    src={c.logo}
                    alt=""
                    className="h-9 sm:h-11 w-auto grayscale opacity-70"
                  />
                ) : (
                  <span className="font-display font-extrabold text-klein tracking-[-0.04em] leading-none whitespace-nowrap text-[clamp(1.8rem,4.4vw,3.4rem)]">
                    {c.name}
                  </span>
                )}
                <span
                  aria-hidden
                  className="ml-12 sm:ml-20 w-2 h-2 rounded-full bg-carne-deep shrink-0"
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
