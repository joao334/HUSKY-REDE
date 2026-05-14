import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, label, error, id, children, ...props }, ref) => {
  const inputId = id ?? props.name;
  return (
    <label className="block" htmlFor={inputId}>
      {label ? <span className="mb-2 block text-sm font-semibold text-husky-brown dark:text-husky-cream">{label}</span> : null}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          'h-12 w-full rounded-brand border border-husky-blue/15 bg-white/85 px-4 text-husky-cocoa outline-none transition focus:border-husky-blue focus:ring-4 focus:ring-husky-blue/10 dark:border-white/10 dark:bg-husky-cocoa dark:text-husky-cream',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-sm text-red-500">{error}</span> : null}
    </label>
  );
});

Select.displayName = 'Select';
