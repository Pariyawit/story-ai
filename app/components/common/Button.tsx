interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'gradient';
  gradientColors?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  gradientColors,
  fullWidth = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseClasses =
    'rounded-3xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed';

  let variantClass = '';
  if (variant === 'primary') {
    variantClass = 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500';
  } else if (variant === 'gradient') {
    if (gradientColors) {
      variantClass = `bg-gradient-to-r ${gradientColors}`;
    } else {
      variantClass = 'bg-gradient-to-r from-pink-300 to-rose-300 hover:from-pink-400 hover:to-rose-400';
    }
  }

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClass} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}
