interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  message?: string;
}

export default function LoadingSpinner({ size = 'md', color = 'border-purple-600', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className='flex flex-col items-center justify-center py-4'>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-purple-200 ${color.startsWith('border-t-') ? color : `border-t-${color.replace('border-', '')}`}`}
      ></div>
      {message && <p className='mt-2 text-sm text-purple-600'>{message}</p>}
    </div>
  );
}
