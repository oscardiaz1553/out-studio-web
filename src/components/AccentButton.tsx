import { ReactNode } from 'react';

interface AccentButtonProps {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  className?: string;
}

const BASE_CLASSES =
  'inline-block rounded-full bg-[#4B8CC8] text-black font-bold uppercase tracking-widest text-center px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm transition-[transform,background-color] duration-150 ease-out hover:bg-[#5E9AD2] active:scale-[0.97]';

export default function AccentButton({
  children,
  href,
  type = 'button',
  className,
}: AccentButtonProps) {
  const classes = `${BASE_CLASSES} ${className ?? ''}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
