interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass";
}

export default function Card({ children, className = "", variant = "glass" }: CardProps) {
  const baseClasses = "rounded-3xl p-6";

  const variantClasses = {
    default: "bg-white",
    glass: "bg-white/80 ",
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</div>;
}
