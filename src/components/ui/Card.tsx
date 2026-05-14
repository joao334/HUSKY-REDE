import { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-brand border border-white/70 bg-white/82 shadow-card backdrop-blur dark:border-white/10 dark:bg-white/8',
        className,
      )}
      {...props}
    />
  );
}
