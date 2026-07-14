// The dot is "lo que se sale": always warm, never the colour of the word.
// carne-deep on light (paper); carne on blue.
const DOT_ON_LIGHT = '#BC6039';
const DOT_ON_BLUE = '#F2C6B4';

interface BrandDotProps {
  color?: string;
}

/**
 * The Out. brand dot: a graphic circle element, not a typographic period.
 * Sized in em so it scales with the surrounding wordmark. Always warm.
 */
export function BrandDot({ color = DOT_ON_LIGHT }: BrandDotProps) {
  return (
    <span
      aria-hidden
      className="inline-block rounded-full transition-transform duration-150 ease-out group-hover:scale-125"
      style={{ width: '0.16em', height: '0.16em', backgroundColor: color }}
    />
  );
}

interface BrandNameProps {
  suffix?: string;
  dotColor?: string;
  /** true when the wordmark sits on the Klein-blue background */
  onBlue?: boolean;
  className?: string;
}

/**
 * The Out. wordmark (Bricolage Grotesque 800). Optionally a service lockup:
 * Out.Web, Out.Design... The dot always follows "Out" with no space and
 * carries a single capital in the service, per the brand rules.
 */
export function BrandName({
  suffix,
  dotColor,
  onBlue = false,
  className,
}: BrandNameProps) {
  const dot = dotColor ?? (onBlue ? DOT_ON_BLUE : DOT_ON_LIGHT);
  return (
    <span
      className={`font-display font-extrabold tracking-[-0.045em] ${className ?? ''}`}
    >
      Out
      <BrandDot color={dot} />
      {suffix}
    </span>
  );
}

export { DOT_ON_LIGHT, DOT_ON_BLUE };
