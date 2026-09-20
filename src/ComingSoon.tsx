import { motion, useReducedMotion } from 'framer-motion';
import LogoOut from './components/LogoOut';

// Página "Sitio en desarrollo" que se muestra en outstudio.online mientras se
// termina de agregar el contenido pendiente. El sitio completo vive en la rama
// `desarrollo`. Fondo botánico de la marca + velo azul Klein.
const BG = `${import.meta.env.BASE_URL}botanica.png`;
const EMAIL = 'oscar.diaz@outstudio.online';
const PHONE_DISPLAY = '+57 318 888 8392';
const PHONE_TEL = '573188888392';
const EASE = [0.16, 1, 0.3, 1] as const;

export default function ComingSoon() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-klein-deep flex items-center">
      <img
        src={BG}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '52% 42%' }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-klein mix-blend-multiply opacity-[0.58]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,30,92,.55) 0%, rgba(20,30,92,.12) 34%, rgba(20,30,92,.4) 66%, rgba(20,30,92,.92) 100%)',
        }}
      />

      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative z-10 w-full max-w-[1100px] mx-auto px-6 md:px-10 lg:px-16 text-paper-pure"
      >
        <LogoOut className="h-14 md:h-16 w-auto text-paper-pure" />

        <h1
          className="font-display font-extrabold tracking-[-0.03em] leading-[0.95] mt-8"
          style={{ fontSize: 'clamp(2.6rem, 8vw, 6rem)' }}
        >
          Sitio en desarrollo
        </h1>

        <p
          className="mt-5 max-w-[46ch] text-paper-pure/85 leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 2.2vw, 1.35rem)' }}
        >
          Estamos afinando los detalles. Muy pronto vas a ver aquí nuestro
          trabajo.
        </p>

        <p
          className="mt-4 max-w-[54ch] text-paper-pure leading-relaxed"
          style={{ fontSize: 'clamp(1.05rem, 2.3vw, 1.45rem)' }}
        >
          Somos expertos en{' '}
          <span className="font-semibold text-carne">tiendas Shopify</span> y{' '}
          <span className="font-semibold text-carne">
            desarrollo web en WordPress
          </span>
          .
        </p>

        <p
          className="font-display font-semibold text-carne mt-7"
          style={{ fontSize: 'clamp(1.1rem, 2.6vw, 1.7rem)' }}
        >
          Never the usual.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a
            href={`mailto:${EMAIL}`}
            className="font-medium text-paper-pure hover:text-carne transition-colors duration-200 underline underline-offset-4"
          >
            {EMAIL}
          </a>
          <a
            href={`https://wa.me/${PHONE_TEL}`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-paper-pure hover:text-carne transition-colors duration-200"
          >
            WhatsApp {PHONE_DISPLAY}
          </a>
        </div>
      </motion.div>
    </main>
  );
}
