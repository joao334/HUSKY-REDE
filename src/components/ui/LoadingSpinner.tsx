import { PawPrint } from 'lucide-react';
import { cn } from '../../utils/cn';

export function LoadingSpinner({ label = 'Farejando as novidades...', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex min-h-48 flex-col items-center justify-center gap-3 text-center text-husky-brown dark:text-husky-cream', className)}>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-husky-blue text-white shadow-soft">
        <PawPrint className="h-7 w-7 animate-paw" />
      </span>
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}
