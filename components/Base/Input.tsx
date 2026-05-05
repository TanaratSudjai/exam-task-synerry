import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type BaseInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
};

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(function BaseInput(
  {
    label,
    error,
    leftIcon,
    rightIcon,
    className = '',
    containerClassName = '',
    id,
    type,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const inputClassName = [
    'w-full rounded-lg border bg-slate-50 py-2 text-sm text-slate-700 transition-all',
    'focus:outline-none focus:ring-1 focus:ring-emerald-500',
    leftIcon ? 'pl-10' : 'pl-4',
    isPassword || rightIcon ? 'pr-10' : 'pr-4',
    error ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`space-y-1 ${containerClassName}`.trim()}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-600">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {leftIcon}
          </span>
        )}

        <input ref={ref} id={id} type={currentType} className={inputClassName} {...props} />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : rightIcon ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
});

export default BaseInput;