import { ReactNode } from 'react';

interface AccentButtonProps {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const BASE_CLASSES =
  'inline-block rounded-full bg-[#4B8CC8] text-white font-bold text-center px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm transition-[transform,background-color,opacity] duration-150 ease-out hover:bg-[#5E9AD2] active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none';

export default function AccentButton({
  children,
  href,
  type = 'button',
  className,
  onClick,
  disabled,
}: AccentButtonProps) {
  const classes = `${BASE_CLASSES} ${className ?? ''}`;

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
