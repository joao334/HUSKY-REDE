import { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type BadgeTone = 'blue' | 'cream' | 'brown' | 'green' | 'red' | 'muted';

const tones: Record<BadgeTone, string> = {
  blue: 'bg-husky-blue/12 text-husky-blue dark:bg-husky-blue/25 dark:text-[#d7ecff]',
  cream: 'bg-husky-beige text-husky-brown',
  brown: 'bg-husky-brown text-white',
  green: 'bg-husky-mint/25 text-emerald-800 dark:text-emerald-100',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-100',
  muted: 'bg-husky-brown/8 text-husky-brown/70 dark:bg-white/10 dark:text-husky-cream/70',
};

export function Badge({ className, tone = 'blue', ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.02em]', tones[tone], className)}
      {...props}
    />
  );
}
