import './marquee.css';

const REPEATS = 6;

/**
 * Kinetic brand statement between sections: outlined "Fuera del molde"
 * drifting horizontally. Decorative only (aria-hidden), constant linear
 * motion, disabled under prefers-reduced-motion.
 */
export default function MarqueeStrip() {
  const items = Array.from({ length: REPEATS * 2 });

  return (
    <section aria-hidden="true" className="brand-marquee bg-black">
      <div className="brand-marquee__track">
        {items.map((_, i) => (
          <span key={i} className="brand-marquee__item">
            Fuera del molde
            <span className="brand-marquee__dot" />
          </span>
        ))}
      </div>
    </section>
  );
}
