interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
}

export default function Card({
  children,
  className = '',
  variant = 'glass',
}: CardProps) {
  const baseClasses = 'rounded-3xl p-6 shadow-md';

  const variantClasses = {
    default: 'bg-white',
    glass: 'bg-white/80 backdrop-blur-sm',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
