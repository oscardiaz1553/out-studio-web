import { ReactNode } from 'react';

interface AccentButtonProps {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  /** invert for use on the Klein-blue background */
  onBlue?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// Primary CTA: Klein blue with paper text (8.5:1, AAA). On blue backgrounds
// it inverts to a paper fill with Klein text.
const ON_PAPER =
  'bg-klein text-paper-pure hover:bg-klein-mid';
const ON_BLUE =
  'bg-paper-pure text-klein hover:bg-paper';

const BASE =
  'inline-block rounded-full font-sans font-medium text-center px-8 py-3 sm:px-10 sm:py-3.5 text-sm transition-[transform,background-color,opacity] duration-150 ease-out active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none';

export default function AccentButton({
  children,
  href,
  type = 'button',
  onBlue = false,
  className,
  onClick,
  disabled,
}: AccentButtonProps) {
  const classes = `${BASE} ${onBlue ? ON_BLUE : ON_PAPER} ${className ?? ''}`;

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
