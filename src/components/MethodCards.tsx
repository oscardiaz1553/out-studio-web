import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface MethodStep {
  step: string;
  title: string;
  description: string;
}

interface CardStyle {
  bg: string;
  text: string;
  sub: string;
  border?: string;
}

// Cuatro tratamientos de marca (no fotos, no las tenemos por paso): cada
// tarjeta usa un tono distinto del sistema, como si Huge usara producto
// fotografiado — nosotros usamos color.
const CARD_STYLES: CardStyle[] = [
  {
    bg: 'bg-paper-pure',
    text: 'text-klein',
    sub: 'text-ink-2',
    border: 'border border-klein-deep/15',
  },
  { bg: 'bg-klein', text: 'text-paper-pure', sub: 'text-klein-soft' },
  { bg: 'bg-carne', text: 'text-klein-deep', sub: 'text-klein-deep/75' },
  { bg: 'bg-klein-deep', text: 'text-paper-pure', sub: 'text-klein-soft' },
];

// Inclinación de reposo por tarjeta (la que tiene lejos del centro).
const TILT = [-6, 5, -4, 7];

// El ancho/alto de la tarjeta y el padding lateral de la fila se calculan
// en JS con la MISMA fórmula que las clases de Tailwind de abajo (w-[64vw]
// sm:w-[36vw] md:w-[25vw] max-w-[300px], gap-5 sm:gap-6), en vez de medir
// el DOM: así el centro/ancho de cada tarjeta es correcto desde el primer
// render (window.innerWidth ya está disponible de forma síncrona), sin
// depender de un efecto posterior que "corrija" la medición — un
// MotionValue actualizado después del montaje (measure() en un
// useLayoutEffect) no siempre logra que framer-motion vuelva a escribir
// el estilo en el DOM si nada más está impulsando su loop de render (p.ej.
// en reposo, antes de que el usuario haga scroll), así que la tarjeta
// quedaba con opacidad calculada sobre un centro/ancho viejo (o en 0).
const CARD_MAX_PX = 300;
const BREAKPOINT_SM = 640;
const BREAKPOINT_MD = 768;

function cardWidthFor(viewportWidth: number) {
  const frac =
    viewportWidth >= BREAKPOINT_MD ? 0.25 : viewportWidth >= BREAKPOINT_SM ? 0.36 : 0.64;
  return Math.min(viewportWidth * frac, CARD_MAX_PX);
}

function gapFor(viewportWidth: number) {
  return viewportWidth >= BREAKPOINT_SM ? 24 : 20;
}

function Card({
  s,
  style,
  tilt,
  x,
  center,
  width,
}: {
  s: MethodStep;
  style: CardStyle;
  tilt: number;
  x: MotionValue<number>;
  center: number;
  width: number;
}) {
  // La tarjeta se desvanece ANTES de que su borde llegue al borde de la
  // pantalla — así nunca se ve una tarjeta partida por el límite del
  // navegador, solo aparece/desaparece ya invisible. El margen de
  // seguridad es en píxeles fijos (no proporcional): en mobile, donde
  // sobra poco espacio, protege igual; en desktop, donde sobra mucho, dos
  // tarjetas casi no pierden nada y caben más visibles a la vez. Se suma
  // el ancho extra que la rotación agrega al cuadro delimitador (una
  // tarjeta inclinada es "más ancha" en pantalla que su ancho natural),
  // si no, el borde rotado se asoma antes de llegar a opacidad 0.
  const SAFETY_PX = 18;
  const maxTiltRad = (Math.abs(tilt) * Math.PI) / 180;

  // 0 = la tarjeta está centrada en la pantalla ahora mismo; 1 = lejos, en
  // el borde. `center`/`width` llegan como props (recalculados en cada
  // render a partir de window.innerWidth), así que el closure siempre usa
  // el valor actual — el único MotionValue del que depende reactivamente
  // esta transformación es `x`, que sí está atado al loop de scroll activo
  // de framer-motion y por lo tanto siempre refresca el DOM correctamente.
  const proximity = useTransform(x, (xVal) => {
    const screenCenter = center + xVal;
    const dist = Math.abs(screenCenter - window.innerWidth / 2);
    return Math.min(1, dist / (window.innerWidth * 0.55));
  });
  // Nunca escala por encima de 1 (su tamaño natural medido): así el ancho
  // renderizado nunca supera lo que mide el cálculo del margen de borde.
  const scale = useTransform(proximity, [0, 1], [1, 0.85]);
  const rotate = useTransform(proximity, [0, 1], [tilt * 0.25, tilt]);
  const y = useTransform(proximity, [0, 1], [-10, 14]);

  const opacity = useTransform(x, (xVal) => {
    const screenCenter = center + xVal;
    const dist = Math.abs(screenCenter - window.innerWidth / 2);
    const h = (width * 5) / 4; // aspect-[4/5]
    const rotatedHalfWidth =
      (width * Math.cos(maxTiltRad) + h * Math.sin(maxTiltRad)) / 2;
    const edgeDist = window.innerWidth / 2 - rotatedHalfWidth;
    const fadeEnd = Math.max(0, edgeDist - SAFETY_PX);
    const fadeStart = fadeEnd * 0.55;
    if (dist <= fadeStart) return 1;
    if (dist >= fadeEnd) return 0;
    return 1 - (dist - fadeStart) / (fadeEnd - fadeStart);
  });

  return (
    <motion.div
      style={{ scale, rotate, y, opacity }}
      className={`shrink-0 w-[64vw] sm:w-[36vw] md:w-[25vw] max-w-[300px] aspect-[4/5] rounded-3xl p-6 sm:p-7 shadow-[0_14px_28px_rgba(20,20,60,0.12)] flex flex-col justify-between ${style.bg} ${style.border ?? ''}`}
    >
      <span
        className={`font-display font-extrabold leading-none ${style.text}`}
        style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}
      >
        {s.step}
      </span>
      <div>
        <h3
          className={`font-display font-semibold tracking-[-0.02em] mb-2 ${style.text}`}
          style={{ fontSize: 'clamp(1.1rem, 1.9vw, 1.5rem)' }}
        >
          {s.title}
        </h3>
        <p className={`leading-relaxed text-sm ${style.sub}`}>{s.description}</p>
      </div>
    </motion.div>
  );
}

function StaticCard({ s, style }: { s: MethodStep; style: CardStyle }) {
  return (
    <div
      className={`w-full max-w-[560px] rounded-3xl p-8 sm:p-10 ${style.bg} ${style.border ?? ''}`}
    >
      <span
        className={`font-display font-extrabold leading-none block mb-6 ${style.text}`}
        style={{ fontSize: 'clamp(2.4rem, 4vw, 3.2rem)' }}
      >
        {s.step}
      </span>
      <h3
        className={`font-display font-semibold tracking-[-0.01em] text-xl mb-2 ${style.text}`}
      >
        {s.title}
      </h3>
      <p className={`leading-relaxed ${style.sub}`}>{s.description}</p>
    </div>
  );
}

/**
 * Fila de tarjetas que se desliza horizontalmente mientras el scroll
 * vertical queda "enganchado" (estilo Huge, sección "Our work"). No es
 * solo la fila en bloque: cada tarjeta reacciona a su propia posición en
 * pantalla — crece y se endereza un poco al acercarse al centro, se
 * encoge y se inclina más al alejarse — así que se siente viva, no una
 * imagen fija que solo se traslada. El pin no suelta el scroll hasta que
 * la última tarjeta llegó a su lugar. En prefers-reduced-motion no hay
 * pin ni transformaciones: las tarjetas se listan normales.
 */
export default function MethodCards({ steps }: { steps: MethodStep[] }) {
  const reduceMotion = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);

  // window.innerWidth, releído en cada resize real — de acá salen (con la
  // misma fórmula que las clases de Tailwind) el ancho de tarjeta y el
  // padding lateral de la fila, en vez de medirlos del DOM.
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Cuánto está corrido el pin respecto al borde real de la ventana: la
  // fila vive dentro de un max-w-[1400px] mx-auto, así que en pantallas
  // anchas hay cientos de píxeles de por medio antes del borde real. Un
  // intento de "full bleed" por CSS (left-1/2 + margin-left:-50vw) no
  // cancela ese offset de forma confiable (depende de contra qué
  // containing block resuelve el % el navegador), así que se mide con
  // JS. Es un solo número compartido por las 4 tarjetas (no por tarjeta),
  // y se pasa como prop normal de React — no como MotionValue — porque
  // proximity/opacity de cada Card solo necesitan que `x` dispare el
  // recálculo (ese sí está atado al loop de scroll activo de
  // framer-motion); un MotionValue independiente actualizado en un efecto
  // posterior no siempre logra que se reescriba el DOM en reposo.
  const [containerOffset, setContainerOffset] = useState(0);
  useLayoutEffect(() => {
    const measure = () => {
      if (pinRef.current) {
        setContainerOffset(pinRef.current.getBoundingClientRect().left);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const cardWidth = cardWidthFor(viewportWidth);
  const gapPx = gapFor(viewportWidth);
  // La primera y la última tarjeta deben poder llegar exactas al centro
  // de la pantalla: "aire" a los lados = mitad de pantalla menos mitad de
  // tarjeta.
  const sidePad = Math.max(0, viewportWidth / 2 - cardWidth / 2);
  // Centro (natural, x=0) de cada tarjeta EN COORDENADAS DE VIEWPORT:
  // offset del contenedor + padding lateral + posición dentro de la fila.
  const cardCenters = steps.map(
    (_, i) => containerOffset + sidePad + i * (cardWidth + gapPx) + cardWidth / 2
  );
  // La distancia a recorrer NO se mide del overflow natural de la fila
  // (rowWidth - viewportWidth): en un viewport donde 4 tarjetas + gaps +
  // padding suman casi exactamente el ancho de pantalla (p.ej. ~1440px),
  // ese overflow da unos pocos píxeles — la fila queda prácticamente
  // congelada y solo 2 tarjetas quedan cerca del centro todo el scroll
  // ("ahora solo se ven dos cards"). En cambio, la distancia es la que
  // separa el centro de la primera tarjeta del centro de la última.
  const scrollDistance = Math.max(0, (steps.length - 1) * (cardWidth + gapPx));

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  });
  // Forma de callback anclada a scrollYProgress (no un rango [0,1]->[0,-d]
  // fijo): scrollYProgress SÍ está atado al loop de scroll activo de
  // framer-motion, así que cuando el usuario scrollea, este callback se
  // reevalúa y toma el `scrollDistance` más reciente del closure — no
  // depende de que framer detecte un cambio en un array de rango
  // reconstruido en cada render.
  const x = useTransform(scrollYProgress, (p) => -p * scrollDistance);

  if (reduceMotion) {
    return (
      <div className="flex flex-col items-center gap-6 pt-8 pb-14">
        {steps.map((s, i) => (
          <StaticCard key={s.step} s={s} style={CARD_STYLES[i % CARD_STYLES.length]} />
        ))}
      </div>
    );
  }

  // Alto del tramo fijado: suficiente para que el desplazamiento horizontal
  // (scrollDistance) se sienta proporcional al scroll vertical, no
  // demasiado brusco ni demasiado largo.
  const pinHeight = Math.max(220, steps.length * 90);

  return (
    <div ref={pinRef} className="relative" style={{ height: `${pinHeight}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div
          className="flex items-center"
          // Gap y padding en línea (no clases de Tailwind): deben coincidir
          // exactamente con cardWidthFor/gapFor/sidePad de arriba — la
          // misma fórmula tiene que regir el layout visual y el cálculo
          // de centros que usa cada Card.
          style={{
            x,
            gap: `${gapPx}px`,
            paddingLeft: `${sidePad}px`,
            paddingRight: `${sidePad}px`,
          }}
        >
          {steps.map((s, i) => (
            <Card
              key={s.step}
              s={s}
              style={CARD_STYLES[i % CARD_STYLES.length]}
              tilt={TILT[i % TILT.length]}
              x={x}
              center={cardCenters[i]}
              width={cardWidth}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
