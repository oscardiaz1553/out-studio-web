const ACCENT = '#4B8CC8';

interface BrandDotProps {
  color?: string;
}

/**
 * The Out. brand dot: a graphic circle element, not a typographic period.
 * Sized in em so it scales with the surrounding wordmark.
 */
export function BrandDot({ color = ACCENT }: BrandDotProps) {
  return (
    <span
      aria-hidden
      className="inline-block rounded-full"
      style={{ width: '0.17em', height: '0.17em', backgroundColor: color }}
    />
  );
}

interface BrandNameProps {
  suffix?: string;
  dotColor?: string;
  className?: string;
}

/**
 * Renders the Out. wordmark (Inter Black), optionally as a service module:
 * Out<dot>web, Out<dot>design, etc. The dot always follows "Out" with no space.
 */
export function BrandName({ suffix, dotColor = ACCENT, className }: BrandNameProps) {
  return (
    <span className={`font-black ${className ?? ''}`}>
      Out
      <BrandDot color={dotColor} />
      {suffix}
    </span>
  );
}
