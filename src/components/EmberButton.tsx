import { ReactNode } from 'react';

interface EmberButtonProps {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  className?: string;
}

const BASE_CLASSES =
  'inline-block rounded-full bg-[#FF5733] text-white font-bold uppercase tracking-widest text-center px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm transition-[transform,background-color] duration-150 ease-out hover:bg-[#FF6A4D] active:scale-[0.97]';

export default function EmberButton({
  children,
  href,
  type = 'button',
  className,
}: EmberButtonProps) {
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
