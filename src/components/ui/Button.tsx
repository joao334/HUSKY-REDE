import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'cream' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-husky-blue text-white shadow-soft hover:bg-husky-sky focus-visible:ring-husky-blue',
  secondary: 'bg-husky-brown text-white shadow-card hover:bg-husky-cocoa focus-visible:ring-husky-brown',
  cream: 'bg-husky-beige text-husky-brown hover:bg-[#e3c98f] focus-visible:ring-husky-beige',
  ghost:
    'bg-transparent text-husky-brown hover:bg-husky-beige/35 focus-visible:ring-husky-blue dark:text-husky-cream dark:hover:bg-white/10',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
  outline:
    'border border-husky-blue/25 bg-white/60 text-husky-blue hover:bg-husky-blue/10 focus-visible:ring-husky-blue dark:bg-white/5 dark:text-husky-cream',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-11 w-11 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-husky-cocoa',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {size !== 'icon' ? children : <span className="sr-only">{children}</span>}
      {!isLoading ? rightIcon : null}
    </button>
  ),
);

Button.displayName = 'Button';
