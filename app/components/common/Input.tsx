interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  autoFocus?: boolean;
  required?: boolean;
  className?: string;
}

export default function Input({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  autoFocus = false,
  required = false,
  className = '',
}: InputProps) {
  return (
    <div>
      <label htmlFor={id} className='sr-only'>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        className={`w-full rounded-3xl border-2 border-purple-200 bg-white px-6 py-4 text-lg text-purple-900 placeholder-purple-300 transition-colors focus:border-purple-400 focus:outline-none ${className}`}
      />
    </div>
  );
}
