import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '../../utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, leftIcon, id, ...props }, ref) => {
  const inputId = id ?? props.name;
  return (
    <label className="block" htmlFor={inputId}>
      {label ? <span className="mb-2 block text-sm font-semibold text-husky-brown dark:text-husky-cream">{label}</span> : null}
      <span className="relative block">
        {leftIcon ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-husky-blue">{leftIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-12 w-full rounded-brand border border-husky-blue/15 bg-white/85 px-4 text-husky-cocoa outline-none transition placeholder:text-husky-brown/45 focus:border-husky-blue focus:ring-4 focus:ring-husky-blue/10 dark:border-white/10 dark:bg-white/8 dark:text-husky-cream dark:placeholder:text-husky-cream/45',
            leftIcon && 'pl-10',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
            className,
          )}
          {...props}
        />
      </span>
      {error ? <span className="mt-1 block text-sm text-red-500">{error}</span> : null}
    </label>
  );
});

Input.displayName = 'Input';
