import { HTMLAttributes } from 'react';
import { initials } from '../../utils/format';
import { cn } from '../../utils/cn';

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const sizes = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

export function Avatar({ src, name, size = 'md', className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-husky-beige font-black text-husky-brown ring-2 ring-white dark:ring-white/10',
        sizes[size],
        className,
      )}
      {...props}
    >
      {src ? <img src={src} alt={name ?? 'Avatar'} className="h-full w-full object-cover" /> : initials(name)}
    </div>
  );
}
