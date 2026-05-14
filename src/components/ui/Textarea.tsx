import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, id, ...props }, ref) => {
  const inputId = id ?? props.name;
  return (
    <label className="block" htmlFor={inputId}>
      {label ? <span className="mb-2 block text-sm font-semibold text-husky-brown dark:text-husky-cream">{label}</span> : null}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'min-h-28 w-full resize-y rounded-brand border border-husky-blue/15 bg-white/85 px-4 py-3 text-husky-cocoa outline-none transition placeholder:text-husky-brown/45 focus:border-husky-blue focus:ring-4 focus:ring-husky-blue/10 dark:border-white/10 dark:bg-white/8 dark:text-husky-cream dark:placeholder:text-husky-cream/45',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-red-500">{error}</span> : null}
    </label>
  );
});

Textarea.displayName = 'Textarea';
